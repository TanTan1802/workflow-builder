export interface WorkflowNode {
  id: string;
  type: NodeType;
  position: { x: number; y: number };
  data: NodeData;
  inputs: NodeInput[];
  outputs: NodeOutput[];
  status?: NodeStatus;
}

export interface NodeData {
  label: string;
  config: { [key: string]: any };
  [key: string]: any;
}

export interface NodeInput {
  id: string;
  label: string;
  type: string;
  value?: any;
}

export interface NodeOutput {
  id: string;
  label: string;
  type: string;
  value?: any;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle: string;
  targetHandle: string;
}

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  createdAt: Date;
  updatedAt: Date;
}

export enum NodeType {
  HTTP_REQUEST = 'http-request',
  SEND_EMAIL = 'send-email',
  GPT_API = 'gpt-api',
  READ_FILE = 'read-file',
  LOG = 'log',
  DELAY = 'delay',
  CONDITION = 'condition',
  START = 'start',
  END = 'end'
}

export enum NodeStatus {
  IDLE = 'idle',
  RUNNING = 'running',
  SUCCESS = 'success',
  ERROR = 'error',
  WAITING = 'waiting'
}

export interface NodeTemplate {
  type: NodeType;
  label: string;
  description: string;
  icon: string;
  color: string;
  inputs: NodeInputTemplate[];
  outputs: NodeOutputTemplate[];
  configSchema: ConfigField[];
}

export interface NodeInputTemplate {
  id: string;
  label: string;
  type: string;
  required: boolean;
}

export interface NodeOutputTemplate {
  id: string;
  label: string;
  type: string;
}

export interface ConfigField {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'select' | 'checkbox' | 'json';
  required: boolean;
  options?: { label: string; value: any }[];
  placeholder?: string;
  description?: string;
}

export interface ExecutionResult {
  nodeId: string;
  status: NodeStatus;
  output?: any;
  error?: string;
  duration?: number;
  timestamp: Date;
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  startedAt: Date;
  completedAt?: Date;
  results: ExecutionResult[];
  error?: string;
}
