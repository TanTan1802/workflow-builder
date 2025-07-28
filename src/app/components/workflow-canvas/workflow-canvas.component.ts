import { Component, OnInit, OnDestroy, ViewChild, ElementRef, HostListener, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

import { WorkflowService } from '../../services/workflow.service';
import { NodeTemplateService } from '../../services/node-template.service';
import { WorkflowNodeComponent } from '../workflow-node/workflow-node.component';

import {
  Workflow,
  WorkflowNode,
  WorkflowEdge,
  NodeTemplate,
  NodeStatus
} from '../../models/workflow.models';

@Component({
  selector: 'app-workflow-canvas',
  standalone: true,
  imports: [CommonModule, WorkflowNodeComponent],
  templateUrl: './workflow-canvas.component.html',
  styleUrls: ['./workflow-canvas.component.scss']
})
export class WorkflowCanvasComponent implements OnInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLDivElement>;
  @Output() nodeDoubleClick = new EventEmitter<WorkflowNode>();

  workflow: Workflow | null = null;
  selectedNodes: Set<string> = new Set();

  // Canvas state
  canvasPosition = { x: 0, y: 0 };
  canvasScale = 1;
  isPanning = false;
  panStart = { x: 0, y: 0 };

  // Connection state
  isConnecting = false;
  connectionStart: { nodeId: string; handleId: string; type: 'input' | 'output' } | null = null;
  tempConnection: { start: { x: number; y: number }; end: { x: number; y: number } } | null = null;

  // Grid settings
  gridSize = 20;
  showGrid = true;

  private destroy$ = new Subject<void>();

  constructor(
    private workflowService: WorkflowService,
    private nodeTemplateService: NodeTemplateService
  ) {}

  ngOnInit(): void {
    this.workflowService.currentWorkflow$
      .pipe(takeUntil(this.destroy$))
      .subscribe((workflow: Workflow | null) => {
        this.workflow = workflow;
      });

    this.setupCanvasEvents();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupCanvasEvents(): void {
    const canvas = this.canvasRef.nativeElement;

    // Handle drop events
    canvas.addEventListener('dragover', this.onDragOver.bind(this));
    canvas.addEventListener('drop', this.onDrop.bind(this));

    // Handle connection events
    canvas.addEventListener('mousedown', this.onCanvasMouseDown.bind(this));
    canvas.addEventListener('mousemove', this.onCanvasMouseMove.bind(this));
    canvas.addEventListener('mouseup', this.onCanvasMouseUp.bind(this));
  }

  @HostListener('wheel', ['$event'])
  onWheel(event: WheelEvent): void {
    event.preventDefault();

    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const scaleFactor = event.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.min(Math.max(this.canvasScale * scaleFactor, 0.1), 3);

    // Calculate new position to zoom towards mouse cursor
    const scaleChange = newScale - this.canvasScale;
    this.canvasPosition.x -= (mouseX - this.canvasPosition.x) * scaleChange / this.canvasScale;
    this.canvasPosition.y -= (mouseY - this.canvasPosition.y) * scaleChange / this.canvasScale;

    this.canvasScale = newScale;
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Delete' || event.key === 'Backspace') {
      this.deleteSelectedNodes();
    } else if (event.key === 'Escape') {
      this.clearSelection();
      this.cancelConnection();
    } else if (event.ctrlKey && event.key === 'a') {
      event.preventDefault();
      this.selectAllNodes();
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.dataTransfer!.dropEffect = 'copy';
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();

    const data = event.dataTransfer?.getData('application/json');
    if (!data) return;

    try {
      const nodeTemplate: NodeTemplate = JSON.parse(data);
      const rect = this.canvasRef.nativeElement.getBoundingClientRect();

      const position = {
        x: (event.clientX - rect.left - this.canvasPosition.x) / this.canvasScale,
        y: (event.clientY - rect.top - this.canvasPosition.y) / this.canvasScale
      };

      // Snap to grid
      if (this.showGrid) {
        position.x = Math.round(position.x / this.gridSize) * this.gridSize;
        position.y = Math.round(position.y / this.gridSize) * this.gridSize;
      }

      this.workflowService.addNode(nodeTemplate, position);
    } catch (error) {
      console.error('Error dropping node:', error);
    }
  }

  onCanvasMouseDown(event: MouseEvent): void {
    if (event.button === 1 || (event.ctrlKey && event.button === 0)) {
      // Middle mouse button or Ctrl+Left click for panning
      this.startPanning(event);
    } else if (event.button === 0) {
      // Left click - check if we're starting a connection
      const target = event.target as HTMLElement;
      if (target.classList.contains('connection-point')) {
        this.startConnection(event, target);
      } else {
        // Clear selection if clicking on empty canvas
        this.clearSelection();
      }
    }
  }

  onCanvasMouseMove(event: MouseEvent): void {
    if (this.isPanning) {
      this.updatePanning(event);
    } else if (this.isConnecting && this.tempConnection) {
      this.updateTempConnection(event);
    }
  }

  onCanvasMouseUp(event: MouseEvent): void {
    if (this.isPanning) {
      this.stopPanning();
    } else if (this.isConnecting) {
      this.finishConnection(event);
    }
  }

  private startPanning(event: MouseEvent): void {
    this.isPanning = true;
    this.panStart = { x: event.clientX - this.canvasPosition.x, y: event.clientY - this.canvasPosition.y };
    this.canvasRef.nativeElement.style.cursor = 'grabbing';
  }

  private updatePanning(event: MouseEvent): void {
    this.canvasPosition.x = event.clientX - this.panStart.x;
    this.canvasPosition.y = event.clientY - this.panStart.y;
  }

  private stopPanning(): void {
    this.isPanning = false;
    this.canvasRef.nativeElement.style.cursor = 'default';
  }

  private startConnection(event: MouseEvent, target: HTMLElement): void {
    const isOutput = target.classList.contains('output-point');
    const nodeElement = target.closest('.workflow-node') as HTMLElement;
    const nodeId = nodeElement?.getAttribute('data-node-id');
    const handleId = target.getAttribute(isOutput ? 'data-output-id' : 'data-input-id');

    if (!nodeId || !handleId) return;

    this.isConnecting = true;
    this.connectionStart = {
      nodeId,
      handleId,
      type: isOutput ? 'output' : 'input'
    };

    const rect = target.getBoundingClientRect();
    const canvasRect = this.canvasRef.nativeElement.getBoundingClientRect();

    const startX = rect.left + rect.width / 2 - canvasRect.left;
    const startY = rect.top + rect.height / 2 - canvasRect.top;

    this.tempConnection = {
      start: { x: startX, y: startY },
      end: { x: event.clientX - canvasRect.left, y: event.clientY - canvasRect.top }
    };
  }

  private updateTempConnection(event: MouseEvent): void {
    if (!this.tempConnection) return;

    const canvasRect = this.canvasRef.nativeElement.getBoundingClientRect();
    this.tempConnection.end = {
      x: event.clientX - canvasRect.left,
      y: event.clientY - canvasRect.top
    };
  }

  private finishConnection(event: MouseEvent): void {
    if (!this.isConnecting || !this.connectionStart) {
      this.cancelConnection();
      return;
    }

    const target = event.target as HTMLElement;
    if (!target.classList.contains('connection-point')) {
      this.cancelConnection();
      return;
    }

    const isOutput = target.classList.contains('output-point');
    const nodeElement = target.closest('.workflow-node') as HTMLElement;
    const nodeId = nodeElement?.getAttribute('data-node-id');
    const handleId = target.getAttribute(isOutput ? 'data-output-id' : 'data-input-id');

    if (!nodeId || !handleId || nodeId === this.connectionStart.nodeId) {
      this.cancelConnection();
      return;
    }

    // Ensure we're connecting output to input
    if (this.connectionStart.type === (isOutput ? 'output' : 'input')) {
      this.cancelConnection();
      return;
    }

    // Create the connection
    if (this.connectionStart.type === 'output') {
      this.workflowService.addEdge(
        this.connectionStart.nodeId,
        nodeId,
        this.connectionStart.handleId,
        handleId
      );
    } else {
      this.workflowService.addEdge(
        nodeId,
        this.connectionStart.nodeId,
        handleId,
        this.connectionStart.handleId
      );
    }

    this.cancelConnection();
  }

  private cancelConnection(): void {
    this.isConnecting = false;
    this.connectionStart = null;
    this.tempConnection = null;
  }

  onNodeClick(node: WorkflowNode): void {
    if (!this.selectedNodes.has(node.id)) {
      this.clearSelection();
      this.selectedNodes.add(node.id);
    }
  }

  onNodeDoubleClick(node: WorkflowNode): void {
    this.nodeDoubleClick.emit(node);
  }

  onNodeDelete(nodeId: string): void {
    this.workflowService.removeNode(nodeId);
    this.selectedNodes.delete(nodeId);
  }

  onNodePositionChange(event: { id: string; position: { x: number; y: number } }): void {
    this.workflowService.updateNodePosition(event.id, event.position);
  }

  isNodeSelected(nodeId: string): boolean {
    return this.selectedNodes.has(nodeId);
  }

  clearSelection(): void {
    this.selectedNodes.clear();
  }

  selectAllNodes(): void {
    if (this.workflow) {
      this.workflow.nodes.forEach(node => this.selectedNodes.add(node.id));
    }
  }

  deleteSelectedNodes(): void {
    this.selectedNodes.forEach(nodeId => {
      this.workflowService.removeNode(nodeId);
    });
    this.clearSelection();
  }

  // Canvas transformation methods
  getCanvasTransform(): string {
    return `translate(${this.canvasPosition.x}px, ${this.canvasPosition.y}px) scale(${this.canvasScale})`;
  }

  getGridPattern(): string {
    const size = this.gridSize * this.canvasScale;
    return `
      <pattern id="grid" width="${size}" height="${size}" patternUnits="userSpaceOnUse">
        <path d="M ${size} 0 L 0 0 0 ${size}" fill="none" stroke="#e5e7eb" stroke-width="1"/>
      </pattern>
    `;
  }

  // Connection rendering
  getConnectionPath(edge: WorkflowEdge): string {
    const sourceNode = this.workflow?.nodes.find(n => n.id === edge.source);
    const targetNode = this.workflow?.nodes.find(n => n.id === edge.target);

    if (!sourceNode || !targetNode) return '';

    const sourceX = sourceNode.position.x + 200; // Node width
    const sourceY = sourceNode.position.y + 60;  // Approximate output position
    const targetX = targetNode.position.x;
    const targetY = targetNode.position.y + 60;  // Approximate input position

    const dx = targetX - sourceX;
    const dy = targetY - sourceY;
    const controlOffset = Math.abs(dx) * 0.3;

    return `M ${sourceX} ${sourceY} C ${sourceX + controlOffset} ${sourceY} ${targetX - controlOffset} ${targetY} ${targetX} ${targetY}`;
  }

  getTempConnectionPath(): string {
    if (!this.tempConnection) return '';

    const { start, end } = this.tempConnection;
    const dx = end.x - start.x;
    const controlOffset = Math.abs(dx) * 0.3;

    return `M ${start.x} ${start.y} C ${start.x + controlOffset} ${start.y} ${end.x - controlOffset} ${end.y} ${end.x} ${end.y}`;
  }

  // Canvas control methods
  zoomIn(): void {
    this.canvasScale = Math.min(this.canvasScale * 1.2, 3);
  }

  zoomOut(): void {
    this.canvasScale = Math.max(this.canvasScale / 1.2, 0.1);
  }

  resetZoom(): void {
    this.canvasScale = 1;
    this.canvasPosition = { x: 0, y: 0 };
  }

  toggleGrid(): void {
    this.showGrid = !this.showGrid;
  }

  fitToView(): void {
    if (!this.workflow?.nodes.length) return;

    const nodes = this.workflow.nodes;
    const minX = Math.min(...nodes.map(n => n.position.x));
    const minY = Math.min(...nodes.map(n => n.position.y));
    const maxX = Math.max(...nodes.map(n => n.position.x + 200)); // Node width
    const maxY = Math.max(...nodes.map(n => n.position.y + 100)); // Node height

    const canvasRect = this.canvasRef.nativeElement.getBoundingClientRect();
    const padding = 50;

    const scaleX = (canvasRect.width - padding * 2) / (maxX - minX);
    const scaleY = (canvasRect.height - padding * 2) / (maxY - minY);
    const scale = Math.min(scaleX, scaleY, 1);

    this.canvasScale = scale;
    this.canvasPosition = {
      x: padding - minX * scale,
      y: padding - minY * scale
    };
  }
}
