/**
 * 유틸리티 함수 인덱스
 */

// API 클라이언트
export * from './api-client';

// 검증 함수
export * from './validation';

// 타입 헬퍼 유틸리티
export type {
  APIClientType,
  APIRequestConfig,
} from './api-client';

// 검증 유틸리티 재사용
export const createDeviceValidator = () => {
  return {
    validate: validateDeviceData,
    normalize: normalizeDeviceData,
    maskSensitive: maskSensitiveData,
  };
};

export const createMCPValidator = () => {
  return {
    validate: validateMCPServerConfig,
    normalize: normalizeMCPServerConfig,
  };
};

export const createLLMValidator = () => {
  return {
    validate: validateLLMConfig,
    validatePerformance: validatePerformanceMetrics,
  };
};