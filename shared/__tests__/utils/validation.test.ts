/**
 * 검증 유틸리티 테스트
 */

import {
  isValidEmail,
  isValidURL,
  isValidPort,
  isValidIPAddress,
  isValidHostname,
  isDeviceType,
  isConnectionType,
  validateDeviceData,
  validateMCPServerConfig,
  validateLLMConfig,
  normalizeDeviceData,
  maskSensitiveData,
} from '../../utils/validation';
import { createMockDevice } from '../../jest.setup';

describe('validation utilities', () => {
  describe('basic validation functions', () => {
    describe('isValidEmail', () => {
      it('should validate correct emails', () => {
        expect(isValidEmail('test@example.com')).toBe(true);
        expect(isValidEmail('user.name+tag@domain.co.uk')).toBe(true);
        expect(isValidEmail('test123@test-domain.org')).toBe(true);
      });

      it('should reject invalid emails', () => {
        expect(isValidEmail('invalid')).toBe(false);
        expect(isValidEmail('@example.com')).toBe(false);
        expect(isValidEmail('test@')).toBe(false);
        expect(isValidEmail('test..test@example.com')).toBe(false);
      });
    });

    describe('isValidURL', () => {
      it('should validate correct URLs', () => {
        expect(isValidURL('https://example.com')).toBe(true);
        expect(isValidURL('http://localhost:8000')).toBe(true);
        expect(isValidURL('ws://127.0.0.1:3000/path')).toBe(true);
        expect(isValidURL('ftp://files.example.com')).toBe(true);
      });

      it('should reject invalid URLs', () => {
        expect(isValidURL('not-a-url')).toBe(false);
        expect(isValidURL('http://')).toBe(false);
        expect(isValidURL('')).toBe(false);
      });
    });

    describe('isValidPort', () => {
      it('should validate correct ports', () => {
        expect(isValidPort(22)).toBe(true);
        expect(isValidPort(80)).toBe(true);
        expect(isValidPort(65535)).toBe(true);
        expect(isValidPort(1)).toBe(true);
      });

      it('should reject invalid ports', () => {
        expect(isValidPort(0)).toBe(false);
        expect(isValidPort(-1)).toBe(false);
        expect(isValidPort(65536)).toBe(false);
        expect(isValidPort(1.5)).toBe(false);
      });
    });

    describe('isValidIPAddress', () => {
      it('should validate IPv4 addresses', () => {
        expect(isValidIPAddress('192.168.1.1')).toBe(true);
        expect(isValidIPAddress('10.0.0.1')).toBe(true);
        expect(isValidIPAddress('127.0.0.1')).toBe(true);
        expect(isValidIPAddress('255.255.255.255')).toBe(true);
      });

      it('should validate IPv6 addresses', () => {
        expect(isValidIPAddress('2001:0db8:85a3:0000:0000:8a2e:0370:7334')).toBe(true);
        expect(isValidIPAddress('::1')).toBe(false); // 단순한 regex로 아직 지원 안함
      });

      it('should reject invalid IP addresses', () => {
        expect(isValidIPAddress('192.168.1.256')).toBe(false);
        expect(isValidIPAddress('192.168')).toBe(false);
        expect(isValidIPAddress('not-an-ip')).toBe(false);
      });
    });

    describe('isValidHostname', () => {
      it('should validate hostnames', () => {
        expect(isValidHostname('example.com')).toBe(true);
        expect(isValidHostname('sub.example.com')).toBe(true);
        expect(isValidHostname('localhost')).toBe(true);
        expect(isValidHostname('test-server')).toBe(true);
        expect(isValidHostname('192.168.1.1')).toBe(true); // IP도 허용
      });

      it('should reject invalid hostnames', () => {
        expect(isValidHostname('.')).toBe(false);
        expect(isValidHostname('')).toBe(false);
        expect(isValidHostname('-invalid')).toBe(false);
      });
    });
  });

  describe('type guards', () => {
    it('should validate device types', () => {
      expect(isDeviceType('SERVER')).toBe(true);
      expect(isDeviceType('NETWORK_DEVICE')).toBe(true);
      expect(isDeviceType('DESKTOP')).toBe(true);
      expect(isDeviceType('INVALID')).toBe(false);
    });

    it('should validate connection types', () => {
      expect(isConnectionType('SSH')).toBe(true);
      expect(isConnectionType('TELNET')).toBe(true);
      expect(isConnectionType('RDP')).toBe(true);
      expect(isConnectionType('VNC')).toBe(true);
      expect(isConnectionType('INVALID')).toBe(false);
    });
  });

  describe('data validation', () => {
    describe('validateDeviceData', () => {
      it('should validate correct device data', () => {
        const device = createMockDevice();
        const result = validateDeviceData(device);
        
        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });

      it('should reject device with missing required fields', () => {
        const device = {
          type: 'SERVER',
          connectionType: 'SSH',
          port: 22,
        };
        
        const result = validateDeviceData(device);
        
        expect(result.valid).toBe(false);
        expect(result.errors).toContain('장비 이름이 필요합니다.');
        expect(result.errors).toContain('호스트 주소가 필요합니다.');
      });

      it('should reject device with invalid data', () => {
        const device = {
          name: 'test',
          host: 'invalid-host-name!@#',
          port: 'not-a-number',
          type: 'INVALID_TYPE',
          connectionType: 'INVALID_CONNECTION',
        };
        
        const result = validateDeviceData(device);
        
        expect(result.valid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
      });

      it('should generate warnings for SSH without credentials', () => {
        const device = {
          name: 'test',
          host: '192.168.1.1',
          port: 22,
          type: 'SERVER',
          connectionType: 'SSH',
          credentials: {
            username: 'testuser',
          },
        };
        
        const result = validateDeviceData(device);
        
        expect(result.valid).toBe(true);
        expect(result.warnings).toContain('SSH 연결을 위해 비밀번호 또는 SSH 키가 필요합니다.');
      });
    });

    describe('validateMCPServerConfig', () => {
      it('should validate stdio MCP server config', () => {
        const config = {
          name: 'Test MCP',
          transportType: 'stdio',
          command: 'test-mcp',
          args: ['--test'],
        };
        
        const result = validateMCPServerConfig(config);
        
        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });

      it('should validate websocket MCP server config', () => {
        const config = {
          name: 'Test WebSocket MCP',
          transportType: 'websocket',
          url: 'ws://localhost:8080/mcp',
        };
        
        const result = validateMCPServerConfig(config);
        
        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });

      it('should reject invalid MCP server config', () => {
        const config = {
          transportType: 'invalid',
          command: '',
        };
        
        const result = validateMCPServerConfig(config);
        
        expect(result.valid).toBe(false);
        expect(result.errors).toContain('MCP 서버 이름이 필요합니다.');
        expect(result.errors).toContain('유효하지 않은 전송 타입입니다.');
      });
    });

    describe('validateLLMConfig', () => {
      it('should validate correct LLM config', () => {
        const config = {
          provider: 'openai',
          model: 'gpt-4',
          temperature: 0.7,
          maxTokens: 2000,
        };
        
        const result = validateLLMConfig(config);
        
        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });

      it('should reject invalid LLM config', () => {
        const config = {
          provider: 'invalid',
          temperature: 5,
          maxTokens: -100,
        };
        
        const result = validateLLMConfig(config);
        
        expect(result.valid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
      });

      it('should warn about high token limits', () => {
        const config = {
          provider: 'openai',
          model: 'gpt-4',
          temperature: 0.7,
          maxTokens: 150000,
        };
        
        const result = validateLLMConfig(config);
        
        expect(result.valid).toBe(true);
        expect(result.warnings).toContain('최대 토큰 수가 매우 큽니다. 비용을 확인해주세요.');
      });
    });
  });

  describe('data normalization', () => {
    it('should normalize device data', () => {
      const device = {
        name: '  TEST-DEVICE  ',
        host: '  192.168.1.100  ',
        port: '22',
        groups: ['  web-servers  ', '  production  '],
      };
      
      const normalized = normalizeDeviceData(device);
      
      expect(normalized.name).toBe('TEST-DEVICE');
      expect(normalized.host).toBe('192.168.1.100');
      expect(normalized.port).toBe(22);
      expect(normalized.groups).toEqual(['web-servers', 'production']);
    });

    it('should handle missing optional fields', () => {
      const device = {
        name: 'test',
        host: '192.168.1.1',
        port: '22',
      };
      
      const normalized = normalizeDeviceData(device);
      
      expect(normalized.groups).toEqual([]);
      expect(normalized.tags).toEqual({});
      expect(normalized.metadata).toEqual({});
    });
  });

  describe('sensitive data masking', () => {
    it('should mask sensitive fields', () => {
      const data = {
        username: 'testuser',
        password: 'secretpassword',
        apiKey: 'sk-1234567890',
        token: 'bearer-token',
        publicInfo: 'not-sensitive',
        nested: {
          secret: 'hidden-value',
          normal: 'visible-value',
        },
      };
      
      const masked = maskSensitiveData(data);
      
      expect(masked.username).toBe('testuser');
      expect(masked.password).toBe('********');
      expect(masked.apiKey).toBe('********');
      expect(masked.token).toBe('********');
      expect(masked.publicInfo).toBe('not-sensitive');
      expect(masked.nested.secret).toBe('********');
      expect(masked.nested.normal).toBe('visible-value');
    });

    it('should handle non-object data', () => {
      expect(maskSensitiveData('string')).toBe('string');
      expect(maskSensitiveData(123)).toBe(123);
      expect(maskSensitiveData(null)).toBe(null);
      expect(maskSensitiveData(undefined)).toBe(undefined);
    });

    it('should handle empty sensitive fields', () => {
      const data = {
        password: '',
        apiKey: null,
        token: undefined,
      };
      
      const masked = maskSensitiveData(data);
      
      expect(masked.password).toBe('');
      expect(masked.apiKey).toBe(null);
      expect(masked.token).toBe(undefined);
    });
  });
});