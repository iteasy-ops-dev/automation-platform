/**
 * LLM 관리 관련 타입 정의
 * 이원화된 LLM 시스템: 메인 채팅용 + 워크플로우 노드별
 */

// LLM 프로바이더
export type LLMProvider = 'openai' | 'anthropic' | 'google' | 'custom';

// LLM 모델
export type LLMModel = 
  // OpenAI
  | 'gpt-4-turbo' | 'gpt-4' | 'gpt-3.5-turbo'
  // Anthropic
  | 'claude-3-opus' | 'claude-3-sonnet' | 'claude-3-haiku'
  // Google
  | 'gemini-pro' | 'gemini-flash'
  // Custom
  | string;

// LLM 사용 용도
export type LLMUsageType = 
  | 'main_chat'        // 메인 채팅용 (고품질)
  | 'intent_analysis'  // 의도 분석 (빠른 응답)
  | 'plan_generation'  // 계획 생성 (논리적 사고)
  | 'result_summary'   // 결과 요약 (빠른 요약)
  | 'general'          // 범용;

// LLM 설정
export interface LLMConfig {
  model: LLMModel;
  provider: LLMProvider;
  temperature: number;
  maxTokens: number;
  streaming?: boolean;
  timeout?: number;
  
  // 프롬프트 엔지니어링
  systemPrompt?: string;
  promptTemplate?: string;
  outputFormat?: 'text' | 'json' | 'markdown';
  
  // 비용 관리
  costPerToken?: {
    input: number;
    output: number;
  };
  quotaLimit?: {
    daily?: number;
    monthly?: number;
  };
}

// LLM 프로바이더 설정
export interface LLMProviderConfig {
  provider: LLMProvider;
  apiKey: string; // 암호화 저장
  baseUrl?: string;
  organization?: string;
  
  // 연결 설정
  timeout?: number;
  retryAttempts?: number;
  rateLimitPerMinute?: number;
  
  // 모니터링
  enabled: boolean;
  healthCheckUrl?: string;
}

// LLM 사용 할당
export interface LLMUsageMapping {
  usageType: LLMUsageType;
  primaryConfig: LLMConfig;
  fallbackConfigs: LLMConfig[];
  
  // 선택 로직
  selectionCriteria: {
    costOptimization: boolean;
    performanceFirst: boolean;
    fallbackOnError: boolean;
    fallbackOnQuotaExceeded: boolean;
  };
}

// LLM 호출 결과
export interface LLMCallResult {
  success: boolean;
  model: LLMModel;
  provider: LLMProvider;
  usageType: LLMUsageType;
  
  // 응답 데이터
  content?: string;
  finishReason?: 'stop' | 'length' | 'content_filter' | 'tool_calls';
  
  // 토큰 사용량
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  
  // 성능 메트릭
  latency: number; // ms
  cost?: number;
  
  // 메타데이터
  metadata: {
    requestId: string;
    timestamp: string;
    promptVersion?: string;
    temperature: number;
    maxTokens: number;
  };
  
  // 에러 정보
  error?: {
    code: string;
    message: string;
    type: 'rate_limit' | 'quota_exceeded' | 'content_filter' | 'network' | 'unknown';
    retryable: boolean;
  };
}

// 프롬프트 템플릿
export interface PromptTemplate {
  id: string;
  name: string;
  usageType: LLMUsageType;
  version: string;
  
  // 템플릿 내용
  systemPrompt: string;
  userPromptTemplate: string;
  variables: string[]; // 템플릿 변수 목록
  
  // 출력 형식
  outputFormat: 'text' | 'json' | 'markdown';
  outputSchema?: any; // JSON 스키마
  
  // 프롬프트 엔지니어링 기법
  techniques: Array<'cot' | 'few_shot' | 'zero_shot' | 'role_based'>;
  examples?: Array<{
    input: Record<string, any>;
    output: string;
  }>;
  
  // 메타데이터
  metadata: {
    author: string;
    createdAt: string;
    updatedAt: string;
    description: string;
    tags: string[];
  };
  
  // 성능 메트릭
  performance?: {
    averageLatency: number;
    successRate: number;
    averageCost: number;
    testResults?: Array<{
      input: any;
      expectedOutput: string;
      actualOutput: string;
      passed: boolean;
    }>;
  };
}

// LLM 사용량 통계
export interface LLMUsageStats {
  period: {
    start: string;
    end: string;
  };
  
  totalCalls: number;
  successfulCalls: number;
  failedCalls: number;
  
  // 프로바이더별 통계
  byProvider: Record<LLMProvider, {
    calls: number;
    tokens: number;
    cost: number;
    averageLatency: number;
  }>;
  
  // 용도별 통계
  byUsageType: Record<LLMUsageType, {
    calls: number;
    tokens: number;
    cost: number;
    averageLatency: number;
  }>;
  
  // 비용 분석
  costs: {
    total: number;
    byModel: Record<LLMModel, number>;
    trend: Array<{
      date: string;
      cost: number;
    }>;
    projection: {
      monthly: number;
      yearly: number;
    };
  };
  
  // 성능 메트릭
  performance: {
    averageLatency: number;
    p95Latency: number;
    p99Latency: number;
    errorRate: number;
    fallbackRate: number;
  };
}