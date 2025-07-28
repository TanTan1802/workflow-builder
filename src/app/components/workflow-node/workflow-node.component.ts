import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkflowNode, NodeStatus } from '../../models/workflow.models';
import { NodeTemplateService } from '../../services/node-template.service';

@Component({
  selector: 'app-workflow-node',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './workflow-node.component.html',
  styleUrls: ['./workflow-node.component.scss']
})
export class WorkflowNodeComponent implements OnInit {
  @Input() node!: WorkflowNode;
  @Input() selected = false;
  @Input() scale = 1;

  @Output() nodeClick = new EventEmitter<WorkflowNode>();
  @Output() nodeDoubleClick = new EventEmitter<WorkflowNode>();
  @Output() nodeDelete = new EventEmitter<string>();
  @Output() positionChange = new EventEmitter<{ id: string; position: { x: number; y: number } }>();

  isDragging = false;
  dragOffset = { x: 0, y: 0 };
  nodeTemplate: any;

  NodeStatus = NodeStatus;

  constructor(private nodeTemplateService: NodeTemplateService) {}

  ngOnInit(): void {
    this.nodeTemplate = this.nodeTemplateService.getNodeTemplate(this.node.type);
  }

  onMouseDown(event: MouseEvent): void {
    if (event.button !== 0) return; // Only left click

    this.isDragging = true;
    this.dragOffset = {
      x: event.clientX - this.node.position.x * this.scale,
      y: event.clientY - this.node.position.y * this.scale
    };

    const onMouseMove = (e: MouseEvent) => {
      if (this.isDragging) {
        const newPosition = {
          x: (e.clientX - this.dragOffset.x) / this.scale,
          y: (e.clientY - this.dragOffset.y) / this.scale
        };
        this.positionChange.emit({ id: this.node.id, position: newPosition });
      }
    };

    const onMouseUp = () => {
      this.isDragging = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    event.preventDefault();
  }

  onClick(event: MouseEvent): void {
    event.stopPropagation();
    this.nodeClick.emit(this.node);
  }

  onDoubleClick(event: MouseEvent): void {
    event.stopPropagation();
    this.nodeDoubleClick.emit(this.node);
  }

  onDelete(event: MouseEvent): void {
    event.stopPropagation();
    this.nodeDelete.emit(this.node.id);
  }

  getStatusColor(): string {
    switch (this.node.status) {
      case NodeStatus.RUNNING:
        return '#f59e0b';
      case NodeStatus.SUCCESS:
        return '#10b981';
      case NodeStatus.ERROR:
        return '#ef4444';
      case NodeStatus.WAITING:
        return '#6366f1';
      default:
        return '#6b7280';
    }
  }

  getStatusIcon(): string {
    switch (this.node.status) {
      case NodeStatus.RUNNING:
        return '🔄';
      case NodeStatus.SUCCESS:
        return '✅';
      case NodeStatus.ERROR:
        return '❌';
      case NodeStatus.WAITING:
        return '⏳';
      default:
        return '';
    }
  }

  hasConfiguration(): boolean {
    return Object.keys(this.node.data.config || {}).length > 0;
  }

  getConfigPreview(): { key: string; value: string }[] {
    const config = this.node.data.config || {};
    return Object.entries(config)
      .slice(0, 3)
      .map(([key, value]) => ({
        key,
        value: typeof value === 'string' ? value.substring(0, 20) + (value.length > 20 ? '...' : '') : String(value)
      }));
  }

  getConfigCount(): number {
    return Object.keys(this.node.data.config || {}).length;
  }
}
