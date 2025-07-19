/**
 * 장비 타입 테스트
 */

import type {
  Device,
  DeviceType,
  ConnectionType,
  DeviceStatus,
  CreateDeviceRequest,
  UpdateDeviceRequest,
  ConnectionTestResult,
  DeviceExecutionRequest,
  DeviceExecutionResponse,
} from '../../types/device';
import { createMockDevice } from '../../jest.setup';

describe('Device Types', () => {
  describe('Device interface', () => {
    it('should have all required properties', () => {
      const device: Device = createMockDevice();
      
      // 필수 필드 검증
      expect(typeof device.id).toBe('string');
      expect(typeof device.name).toBe('string');
      expect(['SERVER', 'NETWORK_DEVICE', 'DESKTOP']).toContain(device.type);
      expect(['SSH', 'TELNET', 'RDP', 'VNC']).toContain(device.connectionType);
      expect(typeof device.host).toBe('string');
      expect(typeof device.port).toBe('number');
      expect(Array.isArray(device.groups)).toBe(true);
      expect(typeof device.tags).toBe('object');
      expect(['ONLINE', 'OFFLINE', 'UNKNOWN', 'ERROR']).toContain(device.status);
      expect(typeof device.metadata).toBe('object');
    });

    it('should allow optional properties', () => {
      const device: Device = {
        id: 'test',
        name: 'test',
        type: 'SERVER',
        connectionType: 'SSH',
        host: '192.168.1.1',
        port: 22,
        groups: [],
        tags: {},
        status: 'UNKNOWN',
        metadata: {},
        // 선택적 필드
        lastConnected: new Date().toISOString(),
        credentials: {
          username: 'test',
          passwordMasked: '****',
        },
      };
      
      expect(device.lastConnected).toBeDefined();
      expect(device.credentials).toBeDefined();
    });
  });

  describe('CreateDeviceRequest interface', () => {
    it('should exclude id from Device', () => {
      const request: CreateDeviceRequest = {
        name: 'new-device',
        type: 'SERVER',
        connectionType: 'SSH',
        host: '192.168.1.100',
        port: 22,
        credentials: {
          username: 'admin',
          password: 'secret',
        },
      };
      
      expect(request).not.toHaveProperty('id');
      expect(typeof request.name).toBe('string');
      expect(request.credentials?.password).toBe('secret');
    });

    it('should allow optional fields', () => {
      const request: CreateDeviceRequest = {
        name: 'minimal-device',
        type: 'SERVER',
        connectionType: 'SSH',
        host: '192.168.1.100',
        port: 22,
        credentials: {
          username: 'admin',
        },
        groups: ['production'],
        tags: { environment: 'prod' },
        metadata: { location: 'datacenter-1' },
      };
      
      expect(request.groups).toEqual(['production']);
      expect(request.tags?.environment).toBe('prod');
      expect(request.metadata?.location).toBe('datacenter-1');
    });
  });

  describe('UpdateDeviceRequest interface', () => {
    it('should make all fields optional', () => {
      const update: UpdateDeviceRequest = {
        name: 'updated-name',
      };
      
      expect(update.name).toBe('updated-name');
      expect(update.host).toBeUndefined();
      expect(update.port).toBeUndefined();
    });

    it('should allow partial updates', () => {
      const update: UpdateDeviceRequest = {
        groups: ['new-group'],
        tags: { updated: 'true' },
      };
      
      expect(update.groups).toEqual(['new-group']);
      expect(update.tags?.updated).toBe('true');
    });
  });

  describe('ConnectionTestResult interface', () => {
    it('should handle successful connection', () => {
      const result: ConnectionTestResult = {
        success: true,
        latency: 100,
        details: {
          connectedAt: new Date().toISOString(),
          authMethod: 'password',
          responseTime: 100,
        },
      };
      
      expect(result.success).toBe(true);
      expect(result.latency).toBe(100);
      expect(result.details?.authMethod).toBe('password');
    });

    it('should handle failed connection', () => {
      const result: ConnectionTestResult = {
        success: false,
        error: 'Connection timeout',
      };
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Connection timeout');
      expect(result.latency).toBeUndefined();
    });
  });

  describe('DeviceExecutionRequest interface', () => {
    it('should have required fields', () => {
      const request: DeviceExecutionRequest = {
        deviceId: 'device-123',
        command: 'ls -la',
      };
      
      expect(request.deviceId).toBe('device-123');
      expect(request.command).toBe('ls -la');
    });

    it('should allow optional fields', () => {
      const request: DeviceExecutionRequest = {
        deviceId: 'device-123',
        command: 'pwd',
        timeout: 5000,
        workingDirectory: '/home/user',
        environment: {
          NODE_ENV: 'production',
          DEBUG: 'false',
        },
      };
      
      expect(request.timeout).toBe(5000);
      expect(request.workingDirectory).toBe('/home/user');
      expect(request.environment?.NODE_ENV).toBe('production');
    });
  });

  describe('DeviceExecutionResponse interface', () => {
    it('should handle successful execution', () => {
      const response: DeviceExecutionResponse = {
        deviceId: 'device-123',
        status: 'SUCCESS',
        output: 'command output',
        executionTime: 1500,
        exitCode: 0,
        metadata: {
          startTime: new Date().toISOString(),
          endTime: new Date().toISOString(),
          command: 'ls -la',
        },
      };
      
      expect(response.status).toBe('SUCCESS');
      expect(response.output).toBe('command output');
      expect(response.exitCode).toBe(0);
    });

    it('should handle failed execution', () => {
      const response: DeviceExecutionResponse = {
        deviceId: 'device-123',
        status: 'FAILURE',
        output: '',
        error: 'Command not found',
        executionTime: 500,
        exitCode: 127,
      };
      
      expect(response.status).toBe('FAILURE');
      expect(response.error).toBe('Command not found');
      expect(response.exitCode).toBe(127);
    });

    it('should handle timeout', () => {
      const response: DeviceExecutionResponse = {
        deviceId: 'device-123',
        status: 'TIMEOUT',
        output: 'partial output',
        error: 'Execution timeout after 30 seconds',
        executionTime: 30000,
      };
      
      expect(response.status).toBe('TIMEOUT');
      expect(response.executionTime).toBe(30000);
    });
  });

  describe('Type constraints', () => {
    it('should enforce DeviceType values', () => {
      const validTypes: DeviceType[] = ['SERVER', 'NETWORK_DEVICE', 'DESKTOP'];
      
      validTypes.forEach(type => {
        const device: Partial<Device> = { type };
        expect(['SERVER', 'NETWORK_DEVICE', 'DESKTOP']).toContain(device.type);
      });
    });

    it('should enforce ConnectionType values', () => {
      const validConnections: ConnectionType[] = ['SSH', 'TELNET', 'RDP', 'VNC'];
      
      validConnections.forEach(connectionType => {
        const device: Partial<Device> = { connectionType };
        expect(['SSH', 'TELNET', 'RDP', 'VNC']).toContain(device.connectionType);
      });
    });

    it('should enforce DeviceStatus values', () => {
      const validStatuses: DeviceStatus[] = ['ONLINE', 'OFFLINE', 'UNKNOWN', 'ERROR'];
      
      validStatuses.forEach(status => {
        const device: Partial<Device> = { status };
        expect(['ONLINE', 'OFFLINE', 'UNKNOWN', 'ERROR']).toContain(device.status);
      });
    });
  });
});