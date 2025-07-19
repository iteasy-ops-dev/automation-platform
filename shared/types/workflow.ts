/**
 * 워크플로우 관련 타입 정의
 * LangGraph 5단계 워크플로우 + LangFlow 동적 워크플로우
 */

// 워크플로우 타입
export type WorkflowType = 'fixed' | 'dynamic';

// 워크플로우 상태
export type WorkflowStatus = 
  | 'PENDING' 
  | 'RUNNING' 
  | 'COMPLETED' 
  | 'FAILED' 
  | 'CANCELLED' 
  | 'TIMEOUT';

// 워크플로우 노드 상태
export type NodeStatus = 
  | 'PENDING'
  | 'RUNNING'
  | 'COMPLETED'
  | 'FAILED'
  | 'SKIPPED';

// LangGraph 노드 타입
export type LangGraphNodeType = 
  | 'IntentAnalysis'
  | 'DeviceValidation'
  | 'PlanGeneration'
  | 'ParallelExecution'
  | 'ResultAggregation'
  | 'ErrorHandler';

// 워크플로우 실행 요청
export interface WorkflowExecutionRequest {
  type: WorkflowType;
  userQuery: string;
  workflowId?: string; // 동적 워크플로우용
  parameters?: Record<string, any>;
  timeout?: number;
  priority?: 'low' | 'medium' | 'high';
}

// 워크플로우 노드 정보
export interface WorkflowNode {
  id: string;
  type: LangGraphNodeType | string; // 동적 워크플로우는 커스텀 타입 가능
  name: string;
  status: NodeStatus;
  startTime?: string;
  endTime?: string;
  input?: any;
  output?: any;
  error?: string;
  metadata?: {
    llmModel?: string;
    promptVersion?: string;
    executionTime?: number;
    retryCount?: number;
  };
}

// 워크플로우 상태 (LangGraph State)
export interface WorkflowState {
  // 기본 정보
  executionId: string;
  userQuery: string;
  currentNode: string;
  
  // 의도 분석 결과
  intent?: {
    action: string;
    target: string;
    parameters: Record<string, any>;
    reasoning: string;
  };
  
  // 장비 정보
  targetDevices?: string[];
  validDevices?: string[];
  failedDevices?: Array<{
    deviceId: string;
    error: string;
  }>;
  
  // 실행 계획
  executionPlan?: Array<{
    step: number;
    action: string;
    target: string;
    command?: string;
    mcpTool?: string;
    parameters?: Record<string, any>;
  }>;
  
  // 실행 결과
  results?: Record<string, any>;
  
  // 메타데이터
  errors: string[];
  warnings: string[];
  retryCount: number;
  checkpoints: Record<string, any>;
}

// 워크플로우 실행 정보
export interface WorkflowExecution {
  id: string;
  type: WorkflowType;
  status: WorkflowStatus;
  userQuery: string;
  workflowId?: string;
  
  // 실행 시간
  startTime: string;
  endTime?: string;
  totalDuration?: number;
  
  // 노드 정보
  nodes: WorkflowNode[];
  currentNodeIndex: number;
  
  // 결과
  result?: {
    success: boolean;
    summary: string;
    details: any;
    affectedDevices: string[];
  };
  
  // 메타데이터
  metadata: {
    userId?: string;
    source: 'chat' | 'api' | 'schedule';
    priority: 'low' | 'medium' | 'high';
    tags?: string[];
  };
  
  // 에러 정보
  error?: {
    code: string;
    message: string;
    node?: string;
    details?: any;
  };
}

// 워크플로우 템플릿 (LangFlow)
export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  version: string;
  
  // LangFlow 정의
  nodes: Array<{
    id: string;
    type: string;
    data: any;
    position: { x: number; y: number };
  }>;
  
  edges: Array<{
    id: string;
    source: string;
    target: string;
    sourceHandle?: string;
    targetHandle?: string;
  }>;
  
  // 메타데이터
  metadata: {
    author: string;
    createdAt: string;
    updatedAt: string;
    tags: string[];
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    estimatedDuration: number; // 분 단위
  };
  
  // 입력 스키마
  inputSchema: {
    type: 'object';
    properties: Record<string, any>;
    required: string[];
  };
  
  // 출력 스키마
  outputSchema: {
    type: 'object';
    properties: Record<string, any>;
  };
}

// 워크플로우 실행 통계
export interface WorkflowStats {
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  averageExecutionTime: number;
  
  byStatus: Record<WorkflowStatus, number>;
  byType: Record<WorkflowType, number>;
  
  recentExecutions: WorkflowExecution[];
  popularTemplates: WorkflowTemplate[];
  
  performance: {
    fastestExecution: WorkflowExecution;
    slowestExecution: WorkflowExecution;
    mostUsedTemplate?: WorkflowTemplate;
  };
}