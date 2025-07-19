/**
 * 설정 및 상수 인덱스
 */

export * from './constants';

// 환경별 설정 유틸리티
export const getEnvironmentConfig = () => {
  const env = process.env.NODE_ENV || 'development';
  
  return {
    isDevelopment: env === 'development',
    isProduction: env === 'production',
    isTest: env === 'test',
    
    api: {
      baseURL: process.env.VITE_API_URL || 'http://localhost:8000',
      timeout: parseInt(process.env.VITE_API_TIMEOUT || '30000'),
    },
    
    websocket: {
      url: process.env.VITE_WS_URL || 'ws://localhost:8000/ws',
      reconnectInterval: parseInt(process.env.VITE_WS_RECONNECT_INTERVAL || '5000'),
    },
    
    features: {
      langflowIntegration: process.env.VITE_LANGFLOW_ENABLED === 'true',
      vectorDatabase: process.env.VITE_VECTOR_DB_ENABLED === 'true',
      authentication: process.env.VITE_AUTH_ENABLED === 'true',
    },
  };
};

// 빌드 시간 상수
export const BUILD_INFO = {
  version: process.env.npm_package_version || '1.0.0',
  buildTime: new Date().toISOString(),
  gitCommit: process.env.VITE_GIT_COMMIT || 'unknown',
  buildNumber: process.env.VITE_BUILD_NUMBER || '0',
} as const;

// 로그 레벨 설정
export const getLogLevel = () => {
  const level = process.env.LOG_LEVEL || 'info';
  return LOG_LEVELS[level.toUpperCase() as keyof typeof LOG_LEVELS] || LOG_LEVELS.INFO;
};

// API 엔드포인트 URL 생성
export const createAPIUrl = (path: string, baseURL?: string) => {
  const base = baseURL || getEnvironmentConfig().api.baseURL;
  return `${base}${path.startsWith('/') ? '' : '/'}${path}`;
};

// WebSocket URL 생성
export const createWebSocketUrl = (path: string = '', baseURL?: string) => {
  const config = getEnvironmentConfig();
  const base = baseURL || config.websocket.url;
  return `${base}${path.startsWith('/') ? '' : '/'}${path}`;
};

// 타임아웃 설정 유틸리티
export const getTimeouts = () => ({
  request: DEFAULT_CONFIG.REQUEST_TIMEOUT,
  workflow: DEFAULT_CONFIG.WORKFLOW_DEFAULT_TIMEOUT,
  device: DEFAULT_CONFIG.DEVICE_CONNECTION_TIMEOUT,
  mcp: DEFAULT_CONFIG.MCP_DEFAULT_TIMEOUT,
});

// 성능 설정
export const getPerformanceConfig = () => ({
  maxConcurrentWorkflows: parseInt(process.env.MAX_CONCURRENT_WORKFLOWS || '50'),
  maxWebSocketConnections: parseInt(process.env.MAX_WEBSOCKET_CONNECTIONS || '1000'),
  maxMCPConnections: parseInt(process.env.MAX_MCP_CONNECTIONS || '100'),
});

// 보안 설정
export const getSecurityConfig = () => ({
  enableCORS: process.env.ENABLE_CORS !== 'false',
  corsOrigins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
  rateLimiting: {
    enabled: process.env.RATE_LIMITING_ENABLED !== 'false',
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15분
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  },
});

// 디버그 설정
export const getDebugConfig = () => ({
  mcp: process.env.DEBUG_MCP === 'true',
  llm: process.env.DEBUG_LLM === 'true',
  workflow: process.env.DEBUG_WORKFLOW === 'true',
  verbose: process.env.DEBUG_VERBOSE === 'true',
});

import { LOG_LEVELS, DEFAULT_CONFIG } from './constants';
import { validateDeviceData, normalizeDeviceData, maskSensitiveData, validateMCPServerConfig, normalizeMCPServerConfig, validateLLMConfig, validatePerformanceMetrics } from '../utils/validation';