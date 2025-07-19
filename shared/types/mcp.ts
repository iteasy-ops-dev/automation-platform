/**
 * MCP (Model Context Protocol) 관련 타입 정의
 * JSON-RPC 2.0 프로토콜 기반
 */

// MCP 전송 타입
export type MCPTransportType = 'stdio' | 'websocket';

// MCP 서버 상태
export type MCPServerStatus = 'CONNECTED' | 'DISCONNECTED' | 'ERROR' | 'CONNECTING';

// JSON-RPC 2.0 기본 구조
export interface JSONRPCRequest {
  jsonrpc: '2.0';
  method: string;
  params?: any;
  id?: string | number;
}

export interface JSONRPCResponse {
  jsonrpc: '2.0';
  result?: any;
  error?: JSONRPCError;
  id: string | number | null;
}

export interface JSONRPCError {
  code: number;
  message: string;
  data?: any;
}

// MCP 도구 정의
export interface MCPTool {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, any>;
    required?: string[];
  };
}

// MCP 리소스 정의
export interface MCPResource {
  uri: string;
  name?: string;
  description?: string;
  mimeType?: string;
}

// MCP 서버 설정
export interface MCPServerConfig {
  id: string;
  name: string;
  description?: string;
  transportType: MCPTransportType;
  
  // stdio 타입용
  command?: string;
  args?: string[];
  env?: Record<string, string>;
  
  // websocket 타입용
  url?: string;
  headers?: Record<string, string>;
  
  // 공통 설정
  timeout?: number;
  retryAttempts?: number;
  healthCheckInterval?: number;
}

// MCP 서버 정보 (런타임)
export interface MCPServer {
  id: string;
  config: MCPServerConfig;
  status: MCPServerStatus;
  lastConnected?: string;
  lastError?: string;
  tools: MCPTool[];
  resources: MCPResource[];
  capabilities: {
    tools?: {
      dynamicRegistration?: boolean;
    };
    resources?: {
      dynamicRegistration?: boolean;
    };
  };
  stats: {
    totalCalls: number;
    successfulCalls: number;
    failedCalls: number;
    averageResponseTime: number;
  };
}

// MCP 서버 생성 요청
export interface CreateMCPServerRequest {
  name: string;
  description?: string;
  transportType: MCPTransportType;
  command?: string;
  args?: string[];
  env?: Record<string, string>;
  url?: string;
  headers?: Record<string, string>;
  timeout?: number;
  retryAttempts?: number;
}

// MCP 도구 호출 요청
export interface MCPToolCallRequest {
  serverId: string;
  toolName: string;
  parameters: Record<string, any>;
  timeout?: number;
}

// MCP 도구 호출 응답
export interface MCPToolCallResponse {
  success: boolean;
  result?: any;
  error?: {
    code: number;
    message: string;
    details?: any;
  };
  executionTime: number;
  metadata?: {
    serverId: string;
    toolName: string;
    timestamp: string;
  };
}

// MCP 연결 상태 이벤트
export interface MCPConnectionEvent {
  serverId: string;
  status: MCPServerStatus;
  error?: string;
  timestamp: string;
}

// MCP 서버 헬스 체크 결과
export interface MCPHealthCheck {
  serverId: string;
  healthy: boolean;
  responseTime?: number;
  error?: string;
  lastCheck: string;
  capabilities: {
    toolsAvailable: number;
    resourcesAvailable: number;
  };
}