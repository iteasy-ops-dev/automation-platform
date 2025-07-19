/**
 * 타입 및 데이터 검증 유틸리티
 */

import { ValidationResult } from '../types';
import { DeviceType, ConnectionType, DeviceStatus } from '../types/device';
import { MCPTransportType, MCPServerStatus } from '../types/mcp';
import { WorkflowType, WorkflowStatus } from '../types/workflow';
import { LLMProvider, LLMUsageType } from '../types/llm';

// 공통 검증 함수
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidURL(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function isValidPort(port: number): boolean {
  return Number.isInteger(port) && port >= 1 && port <= 65535;
}

export function isValidIPAddress(ip: string): boolean {
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
}

export function isValidHostname(hostname: string): boolean {
  if (isValidIPAddress(hostname)) {
    return true;
  }
  
  const hostnameRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)?$/;
  return hostnameRegex.test(hostname);
}

// 타입 가드 함수
export function isDeviceType(value: string): value is DeviceType {
  return ['SERVER', 'NETWORK_DEVICE', 'DESKTOP'].includes(value);
}

export function isConnectionType(value: string): value is ConnectionType {
  return ['SSH', 'TELNET', 'RDP', 'VNC'].includes(value);
}

export function isDeviceStatus(value: string): value is DeviceStatus {
  return ['ONLINE', 'OFFLINE', 'UNKNOWN', 'ERROR'].includes(value);
}

export function isMCPTransportType(value: string): value is MCPTransportType {
  return ['stdio', 'websocket'].includes(value);
}

export function isMCPServerStatus(value: string): value is MCPServerStatus {
  return ['CONNECTED', 'DISCONNECTED', 'ERROR', 'CONNECTING'].includes(value);
}

export function isWorkflowType(value: string): value is WorkflowType {
  return ['fixed', 'dynamic'].includes(value);
}

export function isWorkflowStatus(value: string): value is WorkflowStatus {
  return ['PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED', 'TIMEOUT'].includes(value);
}

export function isLLMProvider(value: string): value is LLMProvider {
  return ['openai', 'anthropic', 'google', 'custom'].includes(value);
}

export function isLLMUsageType(value: string): value is LLMUsageType {
  return ['main_chat', 'intent_analysis', 'plan_generation', 'result_summary', 'general'].includes(value);
}

// 데이터 검증 함수
export function validateDeviceData(device: any): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 필수 필드 검증
  if (!device.name || typeof device.name !== 'string') {
    errors.push('장비 이름이 필요합니다.');
  }

  if (!device.host || typeof device.host !== 'string') {
    errors.push('호스트 주소가 필요합니다.');
  } else if (!isValidHostname(device.host)) {
    errors.push('유효하지 않은 호스트 주소입니다.');
  }

  if (!device.port || !isValidPort(device.port)) {
    errors.push('유효한 포트 번호를 입력해주세요 (1-65535).');
  }

  if (!isDeviceType(device.type)) {
    errors.push('유효하지 않은 장비 타입입니다.');
  }

  if (!isConnectionType(device.connectionType)) {
    errors.push('유효하지 않은 연결 타입입니다.');
  }

  // 인증 정보 검증
  if (device.credentials) {
    if (!device.credentials.username) {
      errors.push('사용자명이 필요합니다.');
    }

    if (device.connectionType === 'SSH' && !device.credentials.password && !device.credentials.sshKeyPath) {
      warnings.push('SSH 연결을 위해 비밀번호 또는 SSH 키가 필요합니다.');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings: warnings.length > 0 ? warnings : undefined,
  };
}

export function validateMCPServerConfig(config: any): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!config.name || typeof config.name !== 'string') {
    errors.push('MCP 서버 이름이 필요합니다.');
  }

  if (!isMCPTransportType(config.transportType)) {
    errors.push('유효하지 않은 전송 타입입니다.');
  }

  if (config.transportType === 'stdio') {
    if (!config.command) {
      errors.push('stdio 전송 타입에서는 명령어가 필요합니다.');
    }
  } else if (config.transportType === 'websocket') {
    if (!config.url) {
      errors.push('websocket 전송 타입에서는 URL이 필요합니다.');
    } else if (!isValidURL(config.url)) {
      errors.push('유효하지 않은 WebSocket URL입니다.');
    }
  }

  if (config.timeout && (typeof config.timeout !== 'number' || config.timeout <= 0)) {
    warnings.push('타임아웃은 양수여야 합니다.');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings: warnings.length > 0 ? warnings : undefined,
  };
}

export function validateLLMConfig(config: any): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!isLLMProvider(config.provider)) {
    errors.push('유효하지 않은 LLM 프로바이더입니다.');
  }

  if (!config.model || typeof config.model !== 'string') {
    errors.push('LLM 모델이 필요합니다.');
  }

  if (typeof config.temperature !== 'number' || config.temperature < 0 || config.temperature > 2) {
    errors.push('Temperature는 0-2 사이의 숫자여야 합니다.');
  }

  if (!config.maxTokens || typeof config.maxTokens !== 'number' || config.maxTokens <= 0) {
    errors.push('최대 토큰 수는 양수여야 합니다.');
  }

  if (config.maxTokens > 100000) {
    warnings.push('최대 토큰 수가 매우 큽니다. 비용을 확인해주세요.');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings: warnings.length > 0 ? warnings : undefined,
  };
}

// 배치 검증
export function validateBatch<T>(items: T[], validator: (item: T) => ValidationResult): ValidationResult {
  const allErrors: string[] = [];
  const allWarnings: string[] = [];
  let validCount = 0;

  items.forEach((item, index) => {
    const result = validator(item);
    
    if (result.valid) {
      validCount++;
    } else {
      result.errors.forEach(error => {
        allErrors.push(`아이템 ${index + 1}: ${error}`);
      });
    }
    
    if (result.warnings) {
      result.warnings.forEach(warning => {
        allWarnings.push(`아이템 ${index + 1}: ${warning}`);
      });
    }
  });

  return {
    valid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings.length > 0 ? allWarnings : undefined,
  };
}

// 데이터 정규화
export function normalizeDeviceData(device: any): any {
  return {
    ...device,
    name: device.name?.trim(),
    host: device.host?.trim().toLowerCase(),
    port: parseInt(device.port),
    groups: device.groups?.map((g: string) => g.trim()) || [],
    tags: device.tags || {},
    metadata: device.metadata || {},
  };
}

export function normalizeMCPServerConfig(config: any): any {
  const normalized = {
    ...config,
    name: config.name?.trim(),
    description: config.description?.trim(),
    timeout: config.timeout ? parseInt(config.timeout) : undefined,
    retryAttempts: config.retryAttempts ? parseInt(config.retryAttempts) : undefined,
  };

  if (config.transportType === 'stdio') {
    normalized.command = config.command?.trim();
    normalized.args = config.args?.map((arg: string) => arg.trim()) || [];
  } else if (config.transportType === 'websocket') {
    normalized.url = config.url?.trim();
  }

  return normalized;
}

// 민감 데이터 마스킹
export function maskSensitiveData(data: any): any {
  if (!data || typeof data !== 'object') {
    return data;
  }

  const masked = { ...data };
  const sensitiveFields = ['password', 'apiKey', 'token', 'secret', 'key'];

  Object.keys(masked).forEach(key => {
    if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
      if (typeof masked[key] === 'string' && masked[key].length > 0) {
        masked[key] = '*'.repeat(Math.min(masked[key].length, 8));
      }
    } else if (typeof masked[key] === 'object') {
      masked[key] = maskSensitiveData(masked[key]);
    }
  });

  return masked;
}

// 성능 메트릭 검증
export function validatePerformanceMetrics(metrics: any): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (typeof metrics.latency === 'number' && metrics.latency > 5000) {
    warnings.push('응답 시간이 5초를 초과합니다.');
  }

  if (typeof metrics.errorRate === 'number' && metrics.errorRate > 0.1) {
    warnings.push('에러율이 10%를 초과합니다.');
  }

  if (typeof metrics.cost === 'number' && metrics.cost > 100) {
    warnings.push('비용이 $100을 초과합니다.');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings: warnings.length > 0 ? warnings : undefined,
  };
}