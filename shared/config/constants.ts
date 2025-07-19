/**
 * 공통 상수 정의
 */

// API 버전
export const API_VERSION = 'v1';
export const API_BASE_PATH = `/api/${API_VERSION}`;

// 기본 설정
export const DEFAULT_CONFIG = {
  // 네트워크
  REQUEST_TIMEOUT: 30000, // 30초
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1초
  
  // 페이지네이션
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  
  // WebSocket
  WS_RECONNECT_INTERVAL: 5000, // 5초
  WS_MAX_RECONNECT_ATTEMPTS: 10,
  
  // LLM
  LLM_DEFAULT_TIMEOUT: 30000, // 30초
  LLM_MAX_TOKENS_WARNING: 50000,
  LLM_COST_WARNING_THRESHOLD: 50, // $50
  
  // 장비
  DEVICE_CONNECTION_TIMEOUT: 10000, // 10초
  DEVICE_HEALTH_CHECK_INTERVAL: 60000, // 1분
  
  // MCP
  MCP_DEFAULT_TIMEOUT: 15000, // 15초
  MCP_HEALTH_CHECK_INTERVAL: 30000, // 30초
  
  // 워크플로우
  WORKFLOW_DEFAULT_TIMEOUT: 300000, // 5분
  WORKFLOW_NODE_TIMEOUT: 60000, // 1분
} as const;

// 디디이스 타입별 기본 포트
export const DEFAULT_PORTS = {
  SSH: 22,
  TELNET: 23,
  RDP: 3389,
  VNC: 5900,
} as const;

// LLM 모델별 기본 설정
export const LLM_MODEL_CONFIGS = {
  // OpenAI
  'gpt-4-turbo': {
    maxTokens: 128000,
    costPerToken: { input: 0.00001, output: 0.00003 },
    recommended: ['main_chat', 'plan_generation'],
  },
  'gpt-4': {
    maxTokens: 8192,
    costPerToken: { input: 0.00003, output: 0.00006 },
    recommended: ['plan_generation'],
  },
  'gpt-3.5-turbo': {
    maxTokens: 16384,
    costPerToken: { input: 0.0000015, output: 0.000002 },
    recommended: ['intent_analysis', 'result_summary'],
  },
  
  // Anthropic
  'claude-3-opus': {
    maxTokens: 200000,
    costPerToken: { input: 0.000015, output: 0.000075 },
    recommended: ['main_chat'],
  },
  'claude-3-sonnet': {
    maxTokens: 200000,
    costPerToken: { input: 0.000003, output: 0.000015 },
    recommended: ['plan_generation'],
  },
  'claude-3-haiku': {
    maxTokens: 200000,
    costPerToken: { input: 0.00000025, output: 0.00000125 },
    recommended: ['intent_analysis', 'result_summary'],
  },
  
  // Google
  'gemini-pro': {
    maxTokens: 32768,
    costPerToken: { input: 0.0000005, output: 0.0000015 },
    recommended: ['general'],
  },
} as const;

// 워크플로우 노드 설정
export const WORKFLOW_NODE_CONFIGS = {
  IntentAnalysis: {
    timeout: 15000,
    retryAttempts: 2,
    recommendedModels: ['claude-3-haiku', 'gpt-3.5-turbo'],
  },
  DeviceValidation: {
    timeout: 10000,
    retryAttempts: 3,
    recommendedModels: [], // 규칙 기반
  },
  PlanGeneration: {
    timeout: 30000,
    retryAttempts: 2,
    recommendedModels: ['claude-3-sonnet', 'gpt-4'],
  },
  ParallelExecution: {
    timeout: 120000,
    retryAttempts: 1,
    recommendedModels: [], // MCP 직접 실행
  },
  ResultAggregation: {
    timeout: 15000,
    retryAttempts: 2,
    recommendedModels: ['claude-3-haiku', 'gpt-3.5-turbo'],
  },
} as const;

// 환경 변수 키
export const ENV_KEYS = {
  // 서버
  NODE_ENV: 'NODE_ENV',
  PORT: 'PORT',
  HOST: 'HOST',
  
  // LLM API
  OPENAI_API_KEY: 'OPENAI_API_KEY',
  ANTHROPIC_API_KEY: 'ANTHROPIC_API_KEY',
  GOOGLE_API_KEY: 'GOOGLE_API_KEY',
  
  // 데이터베이스
  DATABASE_URL: 'DATABASE_URL',
  STORAGE_PATH: 'STORAGE_PATH',
  
  // 보안
  SECRET_KEY: 'SECRET_KEY',
  FERNET_KEY: 'FERNET_KEY',
  
  // 모니터링
  LOG_LEVEL: 'LOG_LEVEL',
  SENTRY_DSN: 'SENTRY_DSN',
  
  // 기능 플래그
  LANGFLOW_ENABLED: 'LANGFLOW_ENABLED',
  LANGFLOW_API_URL: 'LANGFLOW_API_URL',
  VECTOR_DB_ENABLED: 'VECTOR_DB_ENABLED',
} as const;

// HTTP 상태 코드
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const;

// WebSocket 이벤트 네임
export const WS_EVENTS = {
  // 연결
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  ERROR: 'error',
  
  // 채팅
  CHAT_MESSAGE: 'chat.message',
  CHAT_RESPONSE: 'chat.response',
  
  // 워크플로우
  WORKFLOW_START: 'workflow.start',
  WORKFLOW_NODE_UPDATE: 'workflow.node.update',
  WORKFLOW_COMPLETE: 'workflow.complete',
  
  // 장비
  DEVICE_STATUS_UPDATE: 'device.status.update',
  DEVICE_EXECUTION_START: 'device.execution.start',
  DEVICE_EXECUTION_OUTPUT: 'device.execution.output',
  DEVICE_EXECUTION_COMPLETE: 'device.execution.complete',
  
  // MCP
  MCP_CONNECTION_UPDATE: 'mcp.connection.update',
  
  // 시스템
  SYSTEM_NOTIFICATION: 'system.notification',
} as const;

// 에러 코드
export const ERROR_CODES = {
  // 일반
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  
  // 네트워크
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT',
  CONNECTION_FAILED: 'CONNECTION_FAILED',
  
  // 장비
  DEVICE_NOT_FOUND: 'DEVICE_NOT_FOUND',
  DEVICE_CONNECTION_FAILED: 'DEVICE_CONNECTION_FAILED',
  DEVICE_AUTHENTICATION_FAILED: 'DEVICE_AUTHENTICATION_FAILED',
  DEVICE_COMMAND_FAILED: 'DEVICE_COMMAND_FAILED',
  
  // MCP
  MCP_SERVER_NOT_FOUND: 'MCP_SERVER_NOT_FOUND',
  MCP_CONNECTION_FAILED: 'MCP_CONNECTION_FAILED',
  MCP_TOOL_NOT_FOUND: 'MCP_TOOL_NOT_FOUND',
  MCP_TOOL_EXECUTION_FAILED: 'MCP_TOOL_EXECUTION_FAILED',
  
  // LLM
  LLM_PROVIDER_NOT_FOUND: 'LLM_PROVIDER_NOT_FOUND',
  LLM_MODEL_NOT_FOUND: 'LLM_MODEL_NOT_FOUND',
  LLM_QUOTA_EXCEEDED: 'LLM_QUOTA_EXCEEDED',
  LLM_RATE_LIMIT_EXCEEDED: 'LLM_RATE_LIMIT_EXCEEDED',
  LLM_CONTENT_FILTER: 'LLM_CONTENT_FILTER',
  
  // 워크플로우
  WORKFLOW_NOT_FOUND: 'WORKFLOW_NOT_FOUND',
  WORKFLOW_EXECUTION_FAILED: 'WORKFLOW_EXECUTION_FAILED',
  WORKFLOW_NODE_FAILED: 'WORKFLOW_NODE_FAILED',
  WORKFLOW_TIMEOUT: 'WORKFLOW_TIMEOUT',
} as const;

// 로그 레벨
export const LOG_LEVELS = {
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
} as const;

// 메트릭 단위
export const METRIC_UNITS = {
  MILLISECONDS: 'ms',
  SECONDS: 's',
  BYTES: 'bytes',
  KILOBYTES: 'KB',
  MEGABYTES: 'MB',
  PERCENTAGE: '%',
  COUNT: 'count',
  TOKENS: 'tokens',
  DOLLARS: 'USD',
} as const;

// 기본 태그
export const DEFAULT_TAGS = {
  DEVICE: {
    PRODUCTION: 'production',
    STAGING: 'staging',
    DEVELOPMENT: 'development',
    CRITICAL: 'critical',
    BACKUP: 'backup',
  },
  WORKFLOW: {
    AUTOMATED: 'automated',
    MANUAL: 'manual',
    SCHEDULED: 'scheduled',
    EMERGENCY: 'emergency',
  },
  MCP: {
    SYSTEM: 'system',
    NETWORK: 'network',
    FILE: 'file',
    DATABASE: 'database',
  },
} as const;

// 지원되는 파일 확장자
export const SUPPORTED_FILE_EXTENSIONS = {
  CONFIG: ['.json', '.yaml', '.yml', '.toml'],
  LOG: ['.log', '.txt'],
  SCRIPT: ['.sh', '.py', '.js', '.ts'],
  CERT: ['.pem', '.crt', '.key'],
  ARCHIVE: ['.tar', '.gz', '.zip'],
} as const;

// 기본 사용자 역할 (향후 확장용)
export const USER_ROLES = {
  ADMIN: 'admin',
  OPERATOR: 'operator',
  VIEWER: 'viewer',
  GUEST: 'guest',
} as const;

// 기본 권한 (향후 확장용)
export const PERMISSIONS = {
  DEVICE_READ: 'device:read',
  DEVICE_WRITE: 'device:write',
  DEVICE_EXECUTE: 'device:execute',
  MCP_READ: 'mcp:read',
  MCP_WRITE: 'mcp:write',
  WORKFLOW_READ: 'workflow:read',
  WORKFLOW_WRITE: 'workflow:write',
  WORKFLOW_EXECUTE: 'workflow:execute',
  LLM_READ: 'llm:read',
  LLM_WRITE: 'llm:write',
  SYSTEM_READ: 'system:read',
  SYSTEM_WRITE: 'system:write',
} as const;