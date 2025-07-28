import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import {
  Workflow,
  WorkflowNode,
  WorkflowEdge,
  NodeType,
  NodeStatus,
  WorkflowExecution,
  ExecutionResult,
  NodeTemplate
} from '../models/workflow.models';

@Injectable({
  providedIn: 'root'
})
export class WorkflowService {
  private currentWorkflow = new BehaviorSubject<Workflow | null>(null);
  private workflowExecution = new BehaviorSubject<WorkflowExecution | null>(null);
  private nodeExecutionSubject = new Subject<ExecutionResult>();

  currentWorkflow$ = this.currentWorkflow.asObservable();
  workflowExecution$ = this.workflowExecution.asObservable();
  nodeExecution$ = this.nodeExecutionSubject.asObservable();

  constructor() {
    this.initializeEmptyWorkflow();
  }

  private initializeEmptyWorkflow(): void {
    const emptyWorkflow: Workflow = {
      id: uuidv4(),
      name: 'New Workflow',
      description: '',
      nodes: [],
      edges: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.currentWorkflow.next(emptyWorkflow);
  }

  getCurrentWorkflow(): Workflow | null {
    return this.currentWorkflow.value;
  }

  updateWorkflow(workflow: Workflow): void {
    workflow.updatedAt = new Date();
    this.currentWorkflow.next(workflow);
    this.saveToLocalStorage(workflow);
  }

  addNode(nodeTemplate: NodeTemplate, position: { x: number; y: number }): void {
    const workflow = this.getCurrentWorkflow();
    if (!workflow) return;

    const newNode: WorkflowNode = {
      id: uuidv4(),
      type: nodeTemplate.type,
      position,
      data: {
        label: nodeTemplate.label,
        config: {}
      },
      inputs: nodeTemplate.inputs.map(input => ({
        id: uuidv4(),
        label: input.label,
        type: input.type
      })),
      outputs: nodeTemplate.outputs.map(output => ({
        id: uuidv4(),
        label: output.label,
        type: output.type
      })),
      status: NodeStatus.IDLE
    };

    workflow.nodes.push(newNode);
    this.updateWorkflow(workflow);
  }

  removeNode(nodeId: string): void {
    const workflow = this.getCurrentWorkflow();
    if (!workflow) return;

    // Remove node
    workflow.nodes = workflow.nodes.filter(node => node.id !== nodeId);

    // Remove connected edges
    workflow.edges = workflow.edges.filter(edge =>
      edge.source !== nodeId && edge.target !== nodeId
    );

    this.updateWorkflow(workflow);
  }

  updateNodePosition(nodeId: string, position: { x: number; y: number }): void {
    const workflow = this.getCurrentWorkflow();
    if (!workflow) return;

    const node = workflow.nodes.find(n => n.id === nodeId);
    if (node) {
      node.position = position;
      this.updateWorkflow(workflow);
    }
  }

  updateNodeData(nodeId: string, data: Partial<any>): void {
    const workflow = this.getCurrentWorkflow();
    if (!workflow) return;

    const node = workflow.nodes.find(n => n.id === nodeId);
    if (node) {
      node.data = { ...node.data, ...data };
      this.updateWorkflow(workflow);
    }
  }

  addEdge(source: string, target: string, sourceHandle: string, targetHandle: string): void {
    const workflow = this.getCurrentWorkflow();
    if (!workflow) return;

    const newEdge: WorkflowEdge = {
      id: uuidv4(),
      source,
      target,
      sourceHandle,
      targetHandle
    };

    workflow.edges.push(newEdge);
    this.updateWorkflow(workflow);
  }

  removeEdge(edgeId: string): void {
    const workflow = this.getCurrentWorkflow();
    if (!workflow) return;

    workflow.edges = workflow.edges.filter(edge => edge.id !== edgeId);
    this.updateWorkflow(workflow);
  }

  async executeWorkflow(): Promise<void> {
    const workflow = this.getCurrentWorkflow();
    if (!workflow) return;

    const execution: WorkflowExecution = {
      id: uuidv4(),
      workflowId: workflow.id,
      status: 'running',
      startedAt: new Date(),
      results: []
    };

    this.workflowExecution.next(execution);

    try {
      // Reset all node statuses
      workflow.nodes.forEach(node => {
        node.status = NodeStatus.IDLE;
      });
      this.updateWorkflow(workflow);

      // Find start nodes (nodes with no incoming edges)
      const startNodes = workflow.nodes.filter(node =>
        !workflow.edges.some(edge => edge.target === node.id)
      );

      // Execute nodes in topological order
      for (const startNode of startNodes) {
        await this.executeNodeRecursively(startNode, workflow, execution);
      }

      execution.status = 'completed';
      execution.completedAt = new Date();
    } catch (error) {
      execution.status = 'failed';
      execution.error = error instanceof Error ? error.message : 'Unknown error';
      execution.completedAt = new Date();
    }

    this.workflowExecution.next(execution);
  }

  private async executeNodeRecursively(
    node: WorkflowNode,
    workflow: Workflow,
    execution: WorkflowExecution
  ): Promise<void> {
    const startTime = Date.now();

    try {
      // Update node status to running
      node.status = NodeStatus.RUNNING;
      this.updateWorkflow(workflow);

      // Execute the node
      const output = await this.executeNode(node);

      // Create execution result
      const result: ExecutionResult = {
        nodeId: node.id,
        status: NodeStatus.SUCCESS,
        output,
        duration: Date.now() - startTime,
        timestamp: new Date()
      };

      execution.results.push(result);
      this.nodeExecutionSubject.next(result);

      // Update node status
      node.status = NodeStatus.SUCCESS;
      this.updateWorkflow(workflow);

      // Execute connected nodes
      const connectedEdges = workflow.edges.filter(edge => edge.source === node.id);
      for (const edge of connectedEdges) {
        const targetNode = workflow.nodes.find(n => n.id === edge.target);
        if (targetNode && targetNode.status === NodeStatus.IDLE) {
          await this.executeNodeRecursively(targetNode, workflow, execution);
        }
      }

    } catch (error) {
      const result: ExecutionResult = {
        nodeId: node.id,
        status: NodeStatus.ERROR,
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: Date.now() - startTime,
        timestamp: new Date()
      };

      execution.results.push(result);
      this.nodeExecutionSubject.next(result);

      node.status = NodeStatus.ERROR;
      this.updateWorkflow(workflow);

      throw error;
    }
  }

  private async executeNode(node: WorkflowNode): Promise<any> {
    console.log(`Executing node: ${node.data.label} (${node.type})`);

    // Simulate execution based on node type
    switch (node.type) {
      case NodeType.HTTP_REQUEST:
        return this.executeHttpRequest(node);
      case NodeType.SEND_EMAIL:
        return this.executeSendEmail(node);
      case NodeType.GPT_API:
        return this.executeGptApi(node);
      case NodeType.READ_FILE:
        return this.executeReadFile(node);
      case NodeType.LOG:
        return this.executeLog(node);
      case NodeType.DELAY:
        return this.executeDelay(node);
      case NodeType.CONDITION:
        return this.executeCondition(node);
      default:
        return { message: 'Node executed successfully' };
    }
  }

  private async executeHttpRequest(node: WorkflowNode): Promise<any> {
    const config = node.data.config;
    const url = config['url'] || 'https://jsonplaceholder.typicode.com/posts/1';
    const method = config['method'] || 'GET';

    // Simulate HTTP request
    await this.delay(1000);
    return {
      status: 200,
      data: { message: `${method} request to ${url} completed` },
      url,
      method
    };
  }

  private async executeSendEmail(node: WorkflowNode): Promise<any> {
    const config = node.data.config;
    await this.delay(800);
    return {
      message: 'Email sent successfully',
      recipient: config['recipient'] || 'example@example.com',
      subject: config['subject'] || 'No subject'
    };
  }

  private async executeGptApi(node: WorkflowNode): Promise<any> {
    const config = node.data.config;
    await this.delay(2000);
    return {
      response: 'This is a simulated GPT response',
      prompt: config['prompt'] || 'Default prompt',
      model: config['model'] || 'gpt-3.5-turbo'
    };
  }

  private async executeReadFile(node: WorkflowNode): Promise<any> {
    const config = node.data.config;
    await this.delay(500);
    return {
      content: 'Simulated file content',
      filename: config['filename'] || 'example.txt',
      size: Math.floor(Math.random() * 10000)
    };
  }

  private async executeLog(node: WorkflowNode): Promise<any> {
    const config = node.data.config;
    const message = config['message'] || 'Log message';
    console.log(`[Workflow Log]: ${message}`);
    return { message, timestamp: new Date() };
  }

  private async executeDelay(node: WorkflowNode): Promise<any> {
    const config = node.data.config;
    const delayMs = (config['delay'] || 1) * 1000;
    await this.delay(delayMs);
    return { delayed: delayMs };
  }

  private async executeCondition(node: WorkflowNode): Promise<any> {
    const config = node.data.config;
    await this.delay(100);
    const result = Math.random() > 0.5; // Random condition for demo
    return {
      condition: config['condition'] || 'Random condition',
      result,
      branch: result ? 'true' : 'false'
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  saveToLocalStorage(workflow: Workflow): void {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(`workflow_${workflow.id}`, JSON.stringify(workflow));

        // Update workflow list
        const savedWorkflows = this.getSavedWorkflows();
        const existingIndex = savedWorkflows.findIndex(w => w.id === workflow.id);

        if (existingIndex >= 0) {
          savedWorkflows[existingIndex] = workflow;
        } else {
          savedWorkflows.push(workflow);
        }

        localStorage.setItem('workflows', JSON.stringify(savedWorkflows));
      }
    } catch (error) {
      console.error('Failed to save workflow to localStorage:', error);
    }
  }

  loadFromLocalStorage(workflowId: string): Workflow | null {
    try {
      if (typeof localStorage !== 'undefined') {
        const data = localStorage.getItem(`workflow_${workflowId}`);
        if (data) {
          const workflow = JSON.parse(data);
          workflow.createdAt = new Date(workflow.createdAt);
          workflow.updatedAt = new Date(workflow.updatedAt);
          this.currentWorkflow.next(workflow);
          return workflow;
        }
      }
    } catch (error) {
      console.error('Failed to load workflow from localStorage:', error);
    }
    return null;
  }

  getSavedWorkflows(): Workflow[] {
    try {
      if (typeof localStorage !== 'undefined') {
        const data = localStorage.getItem('workflows');
        if (data) {
          return JSON.parse(data).map((w: any) => ({
            ...w,
            createdAt: new Date(w.createdAt),
            updatedAt: new Date(w.updatedAt)
          }));
        }
      }
    } catch (error) {
      console.error('Failed to get saved workflows:', error);
    }
    return [];
  }

  deleteWorkflow(workflowId: string): void {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(`workflow_${workflowId}`);

        const savedWorkflows = this.getSavedWorkflows().filter(w => w.id !== workflowId);
        localStorage.setItem('workflows', JSON.stringify(savedWorkflows));
      }
    } catch (error) {
      console.error('Failed to delete workflow:', error);
    }
  }

  createNewWorkflow(name?: string): void {
    const newWorkflow: Workflow = {
      id: uuidv4(),
      name: name || 'New Workflow',
      description: '',
      nodes: [],
      edges: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.currentWorkflow.next(newWorkflow);
  }
}
