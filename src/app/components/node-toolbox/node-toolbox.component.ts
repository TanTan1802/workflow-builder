import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NodeTemplateService } from '../../services/node-template.service';
import { NodeTemplate } from '../../models/workflow.models';

@Component({
  selector: 'app-node-toolbox',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './node-toolbox.component.html',
  styleUrls: ['./node-toolbox.component.scss']
})
export class NodeToolboxComponent {
  @Input() collapsed = false;
  @Output() nodeSelected = new EventEmitter<NodeTemplate>();
  @Output() toggleSidebarEvent = new EventEmitter<void>();

  // Properties for new features
  nodeCategories: { [category: string]: NodeTemplate[] } = {};
  expandedCategories: Set<string> = new Set(['Data & API']);
  searchTerm: string = '';
  filteredCategories: { [category: string]: NodeTemplate[] } = {};

  // Utility for template
  protected readonly ObjectKeys = Object;
  Object = Object;

  constructor(private nodeTemplateService: NodeTemplateService) {
    this.nodeCategories = this.nodeTemplateService.getNodeTemplatesByCategory();
    this.filteredCategories = { ...this.nodeCategories };
  }

  // Sidebar toggle functionality
  get isCollapsed(): boolean {
    return this.collapsed;
  }

  toggleSidebar(): void {
    this.toggleSidebarEvent.emit();
  }

  // Search functionality
  onSearchChange(): void {
    if (!this.searchTerm.trim()) {
      this.filteredCategories = { ...this.nodeCategories };
      return;
    }

    const searchLower = this.searchTerm.toLowerCase();
    this.filteredCategories = {};

    for (const [category, nodes] of Object.entries(this.nodeCategories)) {
      const filteredNodes = nodes.filter(node =>
        node.label.toLowerCase().includes(searchLower) ||
        node.description.toLowerCase().includes(searchLower) ||
        category.toLowerCase().includes(searchLower)
      );

      if (filteredNodes.length > 0) {
        this.filteredCategories[category] = filteredNodes;
      }
    }
  }

  getFilteredCategories(): { [category: string]: NodeTemplate[] } {
    return this.filteredCategories;
  }

  // Category management
  toggleCategory(category: string): void {
    if (this.expandedCategories.has(category)) {
      this.expandedCategories.delete(category);
    } else {
      this.expandedCategories.add(category);
    }
  }

  isCategoryExpanded(category: string): boolean {
    return this.expandedCategories.has(category);
  }

  // Node interactions
  onNodeClick(template: NodeTemplate): void {
    this.nodeSelected.emit(template);
  }

  onDragStart(event: DragEvent, template: NodeTemplate): void {
    if (event.dataTransfer) {
      event.dataTransfer.setData('application/json', JSON.stringify(template));
      event.dataTransfer.effectAllowed = 'copy';
    }
  }

  // Utility methods for template
  getCategoryIcon(category: string): string {
    const icons: { [key: string]: string } = {
      'Data & API': '🔗',
      'Communication': '📞',
      'Logic & Control': '🔧',
      'Utilities': '⚙️',
      'Processing': '⚡',
      'Storage': '💾',
      'Analytics': '📊',
      'Security': '🔒',
      'Notifications': '🔔',
      'Integrations': '🔌'
    };
    return icons[category] || '📦';
  }

  getNodeGradient(color: string): string {
    // Convert single color to gradient
    const gradients: { [key: string]: string } = {
      '#3B82F6': 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
      '#10B981': 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
      '#9333EA': 'linear-gradient(135deg, #9333EA 0%, #7C3AED 100%)',
      '#F59E0B': 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
      '#EF4444': 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
      '#6B7280': 'linear-gradient(135deg, #6B7280 0%, #4B5563 100%)'
    };
    return gradients[color] || `linear-gradient(135deg, ${color} 0%, ${color}DD 100%)`;
  }

  // Stats methods
  getTotalNodeCount(): number {
    return Object.values(this.nodeCategories).reduce((total, nodes) => total + nodes.length, 0);
  }

  getVisibleCategoriesCount(): number {
    return Object.keys(this.filteredCategories).length;
  }

  getVisibleNodesCount(): number {
    return Object.values(this.filteredCategories).reduce((total, nodes) => total + nodes.length, 0);
  }

  // Performance optimization
  trackByTemplate(index: number, template: NodeTemplate): string {
    return template.type + template.label;
  }
}
