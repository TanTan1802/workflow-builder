import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { WorkflowNode, ConfigField } from '../../models/workflow.models';
import { NodeTemplateService } from '../../services/node-template.service';
import { WorkflowService } from '../../services/workflow.service';

@Component({
  selector: 'app-node-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './node-editor.component.html',
  styleUrls: ['./node-editor.component.scss']
})
export class NodeEditorComponent implements OnInit {
  @Input() node: WorkflowNode | null = null;
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<WorkflowNode>();

  configForm: FormGroup;
  nodeTemplate: any;
  configFields: ConfigField[] = [];

  constructor(
    private fb: FormBuilder,
    private nodeTemplateService: NodeTemplateService,
    private workflowService: WorkflowService
  ) {
    this.configForm = this.fb.group({});
  }

  ngOnInit(): void {
    if (this.node) {
      this.loadNodeConfiguration();
    }
  }

  ngOnChanges(): void {
    if (this.node) {
      this.loadNodeConfiguration();
    }
  }

  private loadNodeConfiguration(): void {
    if (!this.node) return;

    this.nodeTemplate = this.nodeTemplateService.getNodeTemplate(this.node.type);
    this.configFields = this.nodeTemplate?.configSchema || [];

    // Build form based on config schema
    const formControls: { [key: string]: any } = {};

    this.configFields.forEach(field => {
      const currentValue = this.node!.data.config[field.key];
      const validators = field.required ? [Validators.required] : [];

      formControls[field.key] = [currentValue || '', validators];
    });

    this.configForm = this.fb.group(formControls);
  }

  onSave(): void {
    if (!this.node || this.configForm.invalid) {
      this.markAllFieldsAsTouched();
      return;
    }

    const updatedConfig = this.configForm.value;

    // Update node data
    this.workflowService.updateNodeData(this.node.id, {
      config: updatedConfig
    });

    this.close.emit();
  }

  onCancel(): void {
    this.close.emit();
  }

  onDelete(): void {
    if (this.node) {
      this.workflowService.removeNode(this.node.id);
      this.close.emit();
    }
  }

  private markAllFieldsAsTouched(): void {
    Object.keys(this.configForm.controls).forEach(key => {
      this.configForm.get(key)?.markAsTouched();
    });
  }

  getFieldError(fieldKey: string): string {
    const control = this.configForm.get(fieldKey);
    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        return 'This field is required';
      }
      return 'Invalid value';
    }
    return '';
  }

  isFieldInvalid(fieldKey: string): boolean {
    const control = this.configForm.get(fieldKey);
    return !!(control?.invalid && control.touched);
  }

  parseJsonField(value: string): any {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }

  formatJsonField(value: any): string {
    if (typeof value === 'string') return value;
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return String(value);
    }
  }

  onJsonFieldChange(fieldKey: string, event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    const value = target.value;

    try {
      // Try to parse as JSON if it looks like JSON
      if (value.trim().startsWith('{') || value.trim().startsWith('[')) {
        JSON.parse(value);
      }
      this.configForm.patchValue({ [fieldKey]: value });
    } catch {
      // Invalid JSON, but still update the form to show validation error
      this.configForm.patchValue({ [fieldKey]: value });
    }
  }
}
