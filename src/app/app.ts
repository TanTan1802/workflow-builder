import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NodeToolboxComponent } from './components/node-toolbox/node-toolbox.component';
import { WorkflowCanvasComponent } from './components/workflow-canvas/workflow-canvas.component';
import { NodeEditorComponent } from './components/node-editor/node-editor.component';
import { WorkflowService } from './services/workflow.service';
import { ThemeService } from './services/theme.service';
import { NodeTemplate, WorkflowNode, Workflow } from './models/workflow.models';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    NodeToolboxComponent,
    WorkflowCanvasComponent,
    NodeEditorComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Workflow Builder');

  currentWorkflow: Workflow | null = null;
  selectedNode: WorkflowNode | null = null;
  isNodeEditorOpen = false;
  isSidebarCollapsed = false;
  showOnboarding = false;
  zoomLevel = 100;

  constructor(
    private workflowService: WorkflowService,
    private themeService: ThemeService
  ) {
    this.workflowService.currentWorkflow$.subscribe((workflow: Workflow | null) => {
      this.currentWorkflow = workflow;
    });

    // Show onboarding for new users (only in browser environment)
    if (typeof localStorage !== 'undefined') {
      const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
      if (!hasSeenOnboarding) {
        this.showOnboarding = true;
      }
    }
  }

  // Theme methods
  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  isDarkMode(): boolean {
    return this.themeService.isDarkMode();
  }

  // Sidebar methods
  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  // Canvas zoom methods
  zoomIn(): void {
    if (this.zoomLevel < 200) {
      this.zoomLevel += 10;
      // TODO: Apply zoom to canvas
    }
  }

  zoomOut(): void {
    if (this.zoomLevel > 10) {
      this.zoomLevel -= 10;
      // TODO: Apply zoom to canvas
    }
  }

  // Action methods
  onUndo(): void {
    // TODO: Implement undo functionality
    console.log('Undo');
  }

  onRedo(): void {
    // TODO: Implement redo functionality
    console.log('Redo');
  }

  // Settings and Help methods
  showSettings(): void {
    // TODO: Implement settings modal
    console.log('Show settings');
  }

  showHelp(): void {
    this.showOnboarding = true;
  }

  closeOnboarding(): void {
    this.showOnboarding = false;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('hasSeenOnboarding', 'true');
    }
  }

  // Node interaction methods
  onNodeSelected(template: NodeTemplate): void {
    // Node selection is handled by drag & drop in canvas
    console.log('Node template selected:', template);
  }

  onWorkflowChanged(workflow: Workflow): void {
    this.currentWorkflow = workflow;
    this.workflowService.updateWorkflow(workflow);
  }

  onNodeUpdated(node: WorkflowNode): void {
    if (this.currentWorkflow) {
      const nodeIndex = this.currentWorkflow.nodes.findIndex(n => n.id === node.id);
      if (nodeIndex >= 0) {
        this.currentWorkflow.nodes[nodeIndex] = node;
        this.workflowService.updateWorkflow(this.currentWorkflow);
      }
    }
  }

  onNodeEditorClosed(): void {
    this.isNodeEditorOpen = false;
    this.selectedNode = null;
  }

  onNodeDoubleClick(node: WorkflowNode): void {
    this.selectedNode = node;
    this.isNodeEditorOpen = true;
  }

  // Workflow action methods
  onSaveWorkflow(): void {
    if (this.currentWorkflow) {
      this.workflowService.updateWorkflow(this.currentWorkflow);
      // TODO: Show success message
    }
  }

  onRunWorkflow(): void {
    this.workflowService.executeWorkflow();
  }

  onNewWorkflow(): void {
    this.workflowService.createNewWorkflow();
  }

  onLoadWorkflow(): void {
    // TODO: Implement workflow loading dialog
    console.log('Load workflow');
  }
}
