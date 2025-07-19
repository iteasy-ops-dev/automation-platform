/**
 * 공유 타입 인덱스 파일
 * 모든 타입 정의를 중앙에서 관리하고 내보냄
 */

// 장비 관리 타입
export * from './device';

// MCP 프로토콜 타입
export * from './mcp';

// 워크플로우 타입
export * from './workflow';

// LLM 관리 타입
export * from './llm';

// API 타입
export * from './api';

// 공통 유틸리티 타입
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface TimestampedEntity {
  createdAt: string;
  updatedAt: string;
}

export interface AuditableEntity extends TimestampedEntity {
  createdBy?: string;
  updatedBy?: string;
}

// 검증 결과 타입
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings?: string[];
}

// 비동기 작업 상태
export type AsyncTaskStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';

export interface AsyncTask<T = any> {
  id: string;
  status: AsyncTaskStatus;
  progress: number; // 0-100
  result?: T;
  error?: string;
  startTime: string;
  endTime?: string;
}

// 환경 설정 타입
export interface EnvironmentConfig {
  nodeEnv: 'development' | 'staging' | 'production';
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  features: {
    langflowIntegration: boolean;
    vectorDatabase: boolean;
    authentication: boolean;
    analytics: boolean;
  };
}

// 메트릭 타입
export interface MetricValue {
  value: number;
  timestamp: string;
  tags?: Record<string, string>;
}

export interface MetricSeries {
  name: string;
  values: MetricValue[];
  unit?: string;
  description?: string;
}

// 알림 타입
export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  action?: {
    label: string;
    url?: string;
    callback?: string;
  };
  expiresAt?: string;
}

// 사용자 컨텍스트 (향후 확장용)
export interface UserContext {
  id?: string;
  role?: string;
  permissions?: string[];
  preferences?: Record<string, any>;
}

// 시스템 정보
export interface SystemInfo {
  version: string;
  buildTime: string;
  environment: string;
  features: string[];
  uptime: number;
}

// 로그 레벨
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

// 로그 엔트리
export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  component: string;
  requestId?: string;
  userId?: string;
  metadata?: Record<string, any>;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}