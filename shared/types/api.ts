/**
 * API 엔드포인트 타입 정의
 * 백엔드-프론트엔드 간 타입 안전 연계를 위한 엔드포인트 인터페이스
 */

import { Device, CreateDeviceRequest, UpdateDeviceRequest, ConnectionTestResult, DeviceExecutionRequest, DeviceExecutionResponse, DeviceStats } from './device';
import { MCPServer, CreateMCPServerRequest, MCPToolCallRequest, MCPToolCallResponse, MCPHealthCheck } from './mcp';
import { WorkflowExecution, WorkflowExecutionRequest, WorkflowTemplate, WorkflowStats } from './workflow';
import { LLMProviderConfig, LLMUsageMapping, LLMCallResult, LLMUsageStats, PromptTemplate } from './llm';

// API 응답 래퍼
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  metadata?: {
    timestamp: string;
    requestId: string;
    version: string;
  };
}

// 페이지네이션
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// 필터 파라미터
export interface FilterParams {
  search?: string;
  filters?: Record<string, any>;
}

// API 엔드포인트 타입 정의
export interface APIEndpoints {
  // 장비 관리
  '/api/v1/devices': {
    GET: {
      params?: PaginationParams & FilterParams;
      response: APIResponse<PaginatedResponse<Device>>;
    };
    POST: {
      body: CreateDeviceRequest;
      response: APIResponse<Device>;
    };
  };
  
  '/api/v1/devices/:id': {
    GET: {
      response: APIResponse<Device>;
    };
    PUT: {
      body: UpdateDeviceRequest;
      response: APIResponse<Device>;
    };
    DELETE: {
      response: APIResponse<void>;
    };
  };
  
  '/api/v1/devices/:id/test': {
    POST: {
      response: APIResponse<ConnectionTestResult>;
    };
  };
  
  '/api/v1/devices/:id/execute': {
    POST: {
      body: DeviceExecutionRequest;
      response: APIResponse<DeviceExecutionResponse>;
    };
  };
  
  '/api/v1/devices/stats': {
    GET: {
      response: APIResponse<DeviceStats>;
    };
  };
  
  // MCP 서버 관리
  '/api/v1/mcp/servers': {
    GET: {
      response: APIResponse<MCPServer[]>;
    };
    POST: {
      body: CreateMCPServerRequest;
      response: APIResponse<MCPServer>;
    };
  };
  
  '/api/v1/mcp/servers/:id': {
    GET: {
      response: APIResponse<MCPServer>;
    };
    PUT: {
      body: Partial<CreateMCPServerRequest>;
      response: APIResponse<MCPServer>;
    };
    DELETE: {
      response: APIResponse<void>;
    };
  };
  
  '/api/v1/mcp/servers/:id/health': {
    GET: {
      response: APIResponse<MCPHealthCheck>;
    };
  };
  
  '/api/v1/mcp/tools/call': {
    POST: {
      body: MCPToolCallRequest;
      response: APIResponse<MCPToolCallResponse>;
    };
  };
  
  // 워크플로우 관리
  '/api/v1/workflows/execute': {
    POST: {
      body: WorkflowExecutionRequest;
      response: APIResponse<{ executionId: string }>;
    };
  };
  
  '/api/v1/workflows/executions': {
    GET: {
      params?: PaginationParams & FilterParams;
      response: APIResponse<PaginatedResponse<WorkflowExecution>>;
    };
  };
  
  '/api/v1/workflows/executions/:id': {
    GET: {
      response: APIResponse<WorkflowExecution>;
    };
    DELETE: {
      response: APIResponse<void>;
    };
  };
  
  '/api/v1/workflows/templates': {
    GET: {
      response: APIResponse<WorkflowTemplate[]>;
    };
    POST: {
      body: Omit<WorkflowTemplate, 'id' | 'metadata'>;
      response: APIResponse<WorkflowTemplate>;
    };
  };
  
  '/api/v1/workflows/stats': {
    GET: {
      response: APIResponse<WorkflowStats>;
    };
  };
  
  // LLM 관리
  '/api/v1/llm/providers': {
    GET: {
      response: APIResponse<LLMProviderConfig[]>;
    };
    POST: {
      body: LLMProviderConfig;
      response: APIResponse<LLMProviderConfig>;
    };
  };
  
  '/api/v1/llm/providers/:provider': {
    PUT: {
      body: Partial<LLMProviderConfig>;
      response: APIResponse<LLMProviderConfig>;
    };
    DELETE: {
      response: APIResponse<void>;
    };
  };
  
  '/api/v1/llm/usage-mappings': {
    GET: {
      response: APIResponse<LLMUsageMapping[]>;
    };
    POST: {
      body: LLMUsageMapping;
      response: APIResponse<LLMUsageMapping>;
    };
  };
  
  '/api/v1/llm/prompts': {
    GET: {
      response: APIResponse<PromptTemplate[]>;
    };
    POST: {
      body: Omit<PromptTemplate, 'id' | 'metadata'>;
      response: APIResponse<PromptTemplate>;
    };
  };
  
  '/api/v1/llm/stats': {
    GET: {
      params?: { period?: string };
      response: APIResponse<LLMUsageStats>;
    };
  };
  
  // 채팅
  '/api/v1/chat/send': {
    POST: {
      body: {
        message: string;
        chatId?: string;
        context?: Record<string, any>;
      };
      response: APIResponse<{
        chatId: string;
        messageId: string;
        response: string;
        workflowTriggered?: boolean;
        executionId?: string;
      }>;
    };
  };
  
  '/api/v1/chat/history': {
    GET: {
      params?: { chatId?: string } & PaginationParams;
      response: APIResponse<PaginatedResponse<{
        id: string;
        chatId: string;
        type: 'user' | 'assistant';
        content: string;
        timestamp: string;
        metadata?: Record<string, any>;
      }>>;
    };
  };
  
  // 시스템
  '/api/v1/health': {
    GET: {
      response: APIResponse<{
        status: 'healthy' | 'unhealthy';
        timestamp: string;
        services: Record<string, {
          status: 'up' | 'down';
          latency?: number;
          error?: string;
        }>;
        version: string;
      }>;
    };
  };
  
  '/api/v1/debug/info': {
    GET: {
      response: APIResponse<{
        environment: string;
        version: string;
        buildTime: string;
        activeConnections: {
          websockets: number;
          mcpServers: number;
        };
        systemMetrics: {
          cpuUsage: number;
          memoryUsage: number;
          diskUsage: number;
        };
      }>;
    };
  };
}

// WebSocket 이벤트 타입
export interface WebSocketEvents {
  // 채팅 이벤트
  'chat.message': {
    chatId: string;
    messageId: string;
    content: string;
    type: 'user' | 'assistant';
    timestamp: string;
  };
  
  'chat.response': {
    chatId: string;
    messageId: string;
    content: string;
    finished: boolean;
    metadata?: Record<string, any>;
  };
  
  // 워크플로우 이벤트
  'workflow.start': {
    executionId: string;
    workflowType: string;
    userQuery: string;
  };
  
  'workflow.node.update': {
    executionId: string;
    nodeId: string;
    status: 'running' | 'completed' | 'failed';
    progress?: number;
    output?: any;
    error?: string;
  };
  
  'workflow.complete': {
    executionId: string;
    status: 'success' | 'failure';
    result?: any;
    summary: string;
  };
  
  // 장비 이벤트
  'device.status.update': {
    deviceId: string;
    status: 'ONLINE' | 'OFFLINE' | 'ERROR';
    timestamp: string;
    error?: string;
  };
  
  'device.execution.start': {
    deviceId: string;
    command: string;
    executionId: string;
  };
  
  'device.execution.output': {
    deviceId: string;
    executionId: string;
    output: string;
    timestamp: string;
  };
  
  'device.execution.complete': {
    deviceId: string;
    executionId: string;
    status: 'success' | 'failure';
    exitCode?: number;
    error?: string;
  };
  
  // MCP 이벤트
  'mcp.connection.update': {
    serverId: string;
    status: 'connected' | 'disconnected' | 'error';
    error?: string;
  };
  
  // 시스템 이벤트
  'system.notification': {
    type: 'info' | 'warning' | 'error';
    title: string;
    message: string;
    timestamp: string;
    action?: {
      label: string;
      url: string;
    };
  };
}

// 타입 추출 헬퍼
export type ExtractAPIResponseData<T> = T extends APIResponse<infer U> ? U : never;
export type ExtractEndpointResponse<T extends keyof APIEndpoints, M extends keyof APIEndpoints[T]> = 
  APIEndpoints[T][M] extends { response: infer R } ? R : never;
export type ExtractEndpointBody<T extends keyof APIEndpoints, M extends keyof APIEndpoints[T]> = 
  APIEndpoints[T][M] extends { body: infer B } ? B : never;
export type ExtractEndpointParams<T extends keyof APIEndpoints, M extends keyof APIEndpoints[T]> = 
  APIEndpoints[T][M] extends { params: infer P } ? P : never;