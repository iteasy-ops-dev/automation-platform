/**
 * 장비 관리 관련 타입 정의
 * 백엔드-프론트엔드 간 공유되는 타입으로 일관성 보장
 */

// 장비 타입
export type DeviceType = 'SERVER' | 'NETWORK_DEVICE' | 'DESKTOP';

// 연결 타입
export type ConnectionType = 'SSH' | 'TELNET' | 'RDP' | 'VNC';

// 장비 상태
export type DeviceStatus = 'ONLINE' | 'OFFLINE' | 'UNKNOWN' | 'ERROR';

// 장비 인증 정보 (민감 정보는 마스킹)
export interface DeviceCredentials {
  username: string;
  // 보안을 위해 password는 조회 시 마스킹됨
  passwordMasked?: string;
  sshKeyPath?: string;
  sshKeyPassphrase?: string;
  enablePassword?: string; // 네트워크 장비용
}

// 장비 기본 정보
export interface Device {
  id: string;
  name: string; // e.g., "manager01"
  type: DeviceType;
  connectionType: ConnectionType;
  host: string;
  port: number;
  groups: string[]; // e.g., ["web_servers", "production"]
  tags: Record<string, string>;
  status: DeviceStatus;
  lastConnected?: string; // ISO 날짜 문자열
  metadata: Record<string, any>;
  // 인증 정보는 민감하므로 별도 관리
  credentials?: DeviceCredentials;
}

// 장비 생성 요청 (ID 제외)
export interface CreateDeviceRequest {
  name: string;
  type: DeviceType;
  connectionType: ConnectionType;
  host: string;
  port: number;
  groups?: string[];
  tags?: Record<string, string>;
  metadata?: Record<string, any>;
  credentials: Omit<DeviceCredentials, 'passwordMasked'>;
}

// 장비 수정 요청
export interface UpdateDeviceRequest {
  name?: string;
  type?: DeviceType;
  connectionType?: ConnectionType;
  host?: string;
  port?: number;
  groups?: string[];
  tags?: Record<string, string>;
  metadata?: Record<string, any>;
  credentials?: Omit<DeviceCredentials, 'passwordMasked'>;
}

// 연결 테스트 결과
export interface ConnectionTestResult {
  success: boolean;
  latency?: number; // ms
  error?: string;
  details?: {
    connectedAt: string;
    authMethod: string;
    responseTime: number;
  };
}

// 장비 명령 실행 요청
export interface DeviceExecutionRequest {
  deviceId: string;
  command: string;
  timeout?: number; // 초 단위
  workingDirectory?: string;
  environment?: Record<string, string>;
}

// 장비 명령 실행 응답
export interface DeviceExecutionResponse {
  deviceId: string;
  status: 'SUCCESS' | 'FAILURE' | 'TIMEOUT';
  output: string;
  error?: string;
  executionTime: number; // ms
  exitCode?: number;
  metadata?: {
    startTime: string;
    endTime: string;
    command: string;
  };
}

// 장비 그룹 정의
export interface DeviceGroup {
  name: string;
  description?: string;
  deviceIds: string[];
  tags?: Record<string, string>;
  metadata?: Record<string, any>;
}

// 장비 발견 결과 (자동 탐색)
export interface DiscoveredDevice {
  host: string;
  port: number;
  detectedType?: DeviceType;
  detectedServices: string[];
  responseTime: number;
  confidence: number; // 0-1 점수
  fingerprint?: {
    os?: string;
    version?: string;
    services: Record<string, any>;
  };
}

// 장비 통계
export interface DeviceStats {
  total: number;
  byStatus: Record<DeviceStatus, number>;
  byType: Record<DeviceType, number>;
  byGroup: Record<string, number>;
  recentlyConnected: Device[];
  unreachable: Device[];
}