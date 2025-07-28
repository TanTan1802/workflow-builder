import { Injectable } from '@angular/core';
import { NodeTemplate, NodeType } from '../models/workflow.models';

@Injectable({
  providedIn: 'root'
})
export class NodeTemplateService {
  private nodeTemplates: NodeTemplate[] = [
    {
      type: NodeType.HTTP_REQUEST,
      label: 'HTTP Request',
      description: 'Make HTTP requests (GET, POST, PUT, DELETE)',
      icon: '🌐',
      color: '#3b82f6',
      inputs: [
        { id: 'trigger', label: 'Trigger', type: 'trigger', required: false }
      ],
      outputs: [
        { id: 'response', label: 'Response', type: 'object' },
        { id: 'error', label: 'Error', type: 'error' }
      ],
      configSchema: [
        {
          key: 'method',
          label: 'HTTP Method',
          type: 'select',
          required: true,
          options: [
            { label: 'GET', value: 'GET' },
            { label: 'POST', value: 'POST' },
            { label: 'PUT', value: 'PUT' },
            { label: 'DELETE', value: 'DELETE' }
          ],
          description: 'Select the HTTP method for the request'
        },
        {
          key: 'url',
          label: 'URL',
          type: 'text',
          required: true,
          placeholder: 'https://api.example.com/endpoint',
          description: 'The URL to send the request to'
        },
        {
          key: 'headers',
          label: 'Headers',
          type: 'json',
          required: false,
          placeholder: '{"Content-Type": "application/json"}',
          description: 'HTTP headers as JSON object'
        },
        {
          key: 'body',
          label: 'Request Body',
          type: 'json',
          required: false,
          placeholder: '{"key": "value"}',
          description: 'Request body for POST/PUT requests'
        }
      ]
    },
    {
      type: NodeType.SEND_EMAIL,
      label: 'Send Email',
      description: 'Send email notifications',
      icon: '📧',
      color: '#f59e0b',
      inputs: [
        { id: 'trigger', label: 'Trigger', type: 'trigger', required: false },
        { id: 'data', label: 'Data', type: 'object', required: false }
      ],
      outputs: [
        { id: 'success', label: 'Success', type: 'boolean' },
        { id: 'error', label: 'Error', type: 'error' }
      ],
      configSchema: [
        {
          key: 'recipient',
          label: 'Recipient Email',
          type: 'text',
          required: true,
          placeholder: 'user@example.com',
          description: 'Email address of the recipient'
        },
        {
          key: 'subject',
          label: 'Subject',
          type: 'text',
          required: true,
          placeholder: 'Email subject',
          description: 'Subject line of the email'
        },
        {
          key: 'body',
          label: 'Email Body',
          type: 'textarea',
          required: true,
          placeholder: 'Email content...',
          description: 'Content of the email'
        },
        {
          key: 'isHtml',
          label: 'HTML Format',
          type: 'checkbox',
          required: false,
          description: 'Send email in HTML format'
        }
      ]
    },
    {
      type: NodeType.GPT_API,
      label: 'GPT API Call',
      description: 'Call OpenAI GPT API for text generation',
      icon: '🤖',
      color: '#10b981',
      inputs: [
        { id: 'trigger', label: 'Trigger', type: 'trigger', required: false },
        { id: 'prompt', label: 'Prompt', type: 'string', required: false }
      ],
      outputs: [
        { id: 'response', label: 'Response', type: 'string' },
        { id: 'usage', label: 'Usage', type: 'object' },
        { id: 'error', label: 'Error', type: 'error' }
      ],
      configSchema: [
        {
          key: 'apiKey',
          label: 'API Key',
          type: 'text',
          required: true,
          placeholder: 'sk-...',
          description: 'OpenAI API key'
        },
        {
          key: 'model',
          label: 'Model',
          type: 'select',
          required: true,
          options: [
            { label: 'GPT-4', value: 'gpt-4' },
            { label: 'GPT-4 Turbo', value: 'gpt-4-turbo' },
            { label: 'GPT-3.5 Turbo', value: 'gpt-3.5-turbo' }
          ],
          description: 'GPT model to use'
        },
        {
          key: 'prompt',
          label: 'Prompt',
          type: 'textarea',
          required: true,
          placeholder: 'Enter your prompt here...',
          description: 'The prompt to send to GPT'
        },
        {
          key: 'maxTokens',
          label: 'Max Tokens',
          type: 'number',
          required: false,
          placeholder: '1000',
          description: 'Maximum number of tokens to generate'
        },
        {
          key: 'temperature',
          label: 'Temperature',
          type: 'number',
          required: false,
          placeholder: '0.7',
          description: 'Creativity level (0-2)'
        }
      ]
    },
    {
      type: NodeType.READ_FILE,
      label: 'Read File',
      description: 'Read file from various sources',
      icon: '📁',
      color: '#8b5cf6',
      inputs: [
        { id: 'trigger', label: 'Trigger', type: 'trigger', required: false }
      ],
      outputs: [
        { id: 'content', label: 'Content', type: 'string' },
        { id: 'metadata', label: 'Metadata', type: 'object' },
        { id: 'error', label: 'Error', type: 'error' }
      ],
      configSchema: [
        {
          key: 'source',
          label: 'File Source',
          type: 'select',
          required: true,
          options: [
            { label: 'Local File', value: 'local' },
            { label: 'Google Drive', value: 'gdrive' },
            { label: 'FTP Server', value: 'ftp' },
            { label: 'URL', value: 'url' }
          ],
          description: 'Source of the file to read'
        },
        {
          key: 'path',
          label: 'File Path/URL',
          type: 'text',
          required: true,
          placeholder: '/path/to/file.txt or https://example.com/file.txt',
          description: 'Path or URL to the file'
        },
        {
          key: 'encoding',
          label: 'Encoding',
          type: 'select',
          required: false,
          options: [
            { label: 'UTF-8', value: 'utf8' },
            { label: 'ASCII', value: 'ascii' },
            { label: 'Base64', value: 'base64' }
          ],
          description: 'File encoding format'
        }
      ]
    },
    {
      type: NodeType.LOG,
      label: 'Log Message',
      description: 'Log messages to console or UI',
      icon: '📝',
      color: '#6b7280',
      inputs: [
        { id: 'trigger', label: 'Trigger', type: 'trigger', required: false },
        { id: 'data', label: 'Data', type: 'any', required: false }
      ],
      outputs: [
        { id: 'logged', label: 'Logged', type: 'boolean' }
      ],
      configSchema: [
        {
          key: 'message',
          label: 'Log Message',
          type: 'textarea',
          required: true,
          placeholder: 'Enter log message...',
          description: 'Message to log'
        },
        {
          key: 'level',
          label: 'Log Level',
          type: 'select',
          required: true,
          options: [
            { label: 'Info', value: 'info' },
            { label: 'Warning', value: 'warn' },
            { label: 'Error', value: 'error' },
            { label: 'Debug', value: 'debug' }
          ],
          description: 'Log level for the message'
        },
        {
          key: 'includeTimestamp',
          label: 'Include Timestamp',
          type: 'checkbox',
          required: false,
          description: 'Include timestamp in log message'
        }
      ]
    },
    {
      type: NodeType.DELAY,
      label: 'Delay',
      description: 'Pause workflow execution for specified time',
      icon: '⏰',
      color: '#ef4444',
      inputs: [
        { id: 'trigger', label: 'Trigger', type: 'trigger', required: false }
      ],
      outputs: [
        { id: 'completed', label: 'Completed', type: 'boolean' }
      ],
      configSchema: [
        {
          key: 'delay',
          label: 'Delay (seconds)',
          type: 'number',
          required: true,
          placeholder: '5',
          description: 'Number of seconds to delay'
        },
        {
          key: 'reason',
          label: 'Reason',
          type: 'text',
          required: false,
          placeholder: 'Waiting for external process...',
          description: 'Optional reason for the delay'
        }
      ]
    },
    {
      type: NodeType.CONDITION,
      label: 'Condition',
      description: 'Branch workflow based on conditions',
      icon: '🔀',
      color: '#f97316',
      inputs: [
        { id: 'trigger', label: 'Trigger', type: 'trigger', required: false },
        { id: 'data', label: 'Data', type: 'any', required: false }
      ],
      outputs: [
        { id: 'true', label: 'True', type: 'boolean' },
        { id: 'false', label: 'False', type: 'boolean' }
      ],
      configSchema: [
        {
          key: 'condition',
          label: 'Condition',
          type: 'text',
          required: true,
          placeholder: 'data.value > 100',
          description: 'JavaScript expression to evaluate'
        },
        {
          key: 'description',
          label: 'Description',
          type: 'text',
          required: false,
          placeholder: 'Check if value is greater than 100',
          description: 'Description of what this condition checks'
        }
      ]
    }
  ];

  getNodeTemplates(): NodeTemplate[] {
    return this.nodeTemplates;
  }

  getNodeTemplate(type: NodeType): NodeTemplate | undefined {
    return this.nodeTemplates.find(template => template.type === type);
  }

  getNodeTemplatesByCategory(): { [category: string]: NodeTemplate[] } {
    return {
      'Data & API': [
        this.getNodeTemplate(NodeType.HTTP_REQUEST)!,
        this.getNodeTemplate(NodeType.READ_FILE)!,
        this.getNodeTemplate(NodeType.GPT_API)!
      ],
      'Communication': [
        this.getNodeTemplate(NodeType.SEND_EMAIL)!
      ],
      'Logic & Control': [
        this.getNodeTemplate(NodeType.CONDITION)!,
        this.getNodeTemplate(NodeType.DELAY)!
      ],
      'Utilities': [
        this.getNodeTemplate(NodeType.LOG)!
      ]
    };
  }
}
