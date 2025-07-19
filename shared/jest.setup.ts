/**
 * Jest 테스트 설정
 */

// 전역 테스트 설정
global.console = {
  ...console,
  // 테스트 중 불필요한 로그 숨기기
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// 타임아웃 설정
jest.setTimeout(10000);

// 환경 변수 설정
process.env.NODE_ENV = 'test';
process.env.LOG_LEVEL = 'error';

// 테스트 유틸리티
export const createMockDevice = () => ({
  id: 'test-device-1',
  name: 'test-server',
  type: 'SERVER' as const,
  connectionType: 'SSH' as const,
  host: '192.168.1.100',
  port: 22,
  groups: ['test'],
  tags: { environment: 'test' },
  status: 'ONLINE' as const,
  metadata: {},
  credentials: {
    username: 'testuser',
  },
});

export const createMockMCPServer = () => ({
  id: 'test-mcp-1',
  config: {
    id: 'test-mcp-1',
    name: 'Test MCP Server',
    transportType: 'stdio' as const,
    command: 'test-mcp',
    args: ['--test'],
  },
  status: 'CONNECTED' as const,
  tools: [],
  resources: [],
  capabilities: {},
  stats: {
    totalCalls: 0,
    successfulCalls: 0,
    failedCalls: 0,
    averageResponseTime: 0,
  },
});

export const createMockWorkflowExecution = () => ({
  id: 'test-execution-1',
  type: 'fixed' as const,
  status: 'PENDING' as const,
  userQuery: 'test query',
  startTime: new Date().toISOString(),
  nodes: [],
  currentNodeIndex: 0,
  metadata: {
    source: 'test' as const,
    priority: 'medium' as const,
  },
});

// 모킹 헬퍼
export const mockApiResponse = <T>(data: T) => ({
  success: true,
  data,
  metadata: {
    timestamp: new Date().toISOString(),
    requestId: 'test-request-id',
    version: '1.0.0',
  },
});

export const mockApiError = (code: string, message: string) => ({
  success: false,
  error: {
    code,
    message,
  },
  metadata: {
    timestamp: new Date().toISOString(),
    requestId: 'test-request-id',
    version: '1.0.0',
  },
});

// 비동기 테스트 유틸리티
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const waitFor = async (condition: () => boolean, timeout = 5000, interval = 100) => {
  const start = Date.now();
  while (!condition() && Date.now() - start < timeout) {
    await delay(interval);
  }
  if (!condition()) {
    throw new Error(`Condition not met within ${timeout}ms`);
  }
};