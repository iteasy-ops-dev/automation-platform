/**
 * API 클라이언트 테스트
 */

import { TypedAPIClient, APIError, createAPIClient } from '../../utils/api-client';
import { mockApiResponse, mockApiError, delay } from '../../jest.setup';

// fetch mock
global.fetch = jest.fn();
const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

describe('TypedAPIClient', () => {
  let client: TypedAPIClient;

  beforeEach(() => {
    client = createAPIClient({
      baseURL: 'http://localhost:8000',
      timeout: 5000,
      retryAttempts: 2,
    });
    mockFetch.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('request method', () => {
    it('should make successful GET request', async () => {
      const mockData = { id: '1', name: 'test-device' };
      const response = mockApiResponse(mockData);
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => response,
        headers: new Headers(),
      } as Response);

      const result = await client.get('/api/v1/devices');
      
      expect(result).toEqual(response);
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/v1/devices',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );
    });

    it('should make successful POST request with body', async () => {
      const requestBody = {
        name: 'new-device',
        type: 'SERVER' as const,
        connectionType: 'SSH' as const,
        host: '192.168.1.100',
        port: 22,
      };
      const mockData = { id: '2', ...requestBody };
      const response = mockApiResponse(mockData);
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => response,
        headers: new Headers(),
      } as Response);

      const result = await client.post('/api/v1/devices', { body: requestBody });
      
      expect(result).toEqual(response);
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/v1/devices',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(requestBody),
        })
      );
    });

    it('should handle path parameters', async () => {
      const deviceId = 'device-123';
      const response = mockApiResponse({ id: deviceId, status: 'ONLINE' });
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => response,
        headers: new Headers(),
      } as Response);

      await client.get('/api/v1/devices/:id', {
        params: { id: deviceId },
      });
      
      expect(mockFetch).toHaveBeenCalledWith(
        `http://localhost:8000/api/v1/devices/${deviceId}`,
        expect.any(Object)
      );
    });

    it('should handle query parameters', async () => {
      const response = mockApiResponse({ items: [], pagination: {} });
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => response,
        headers: new Headers(),
      } as Response);

      await client.get('/api/v1/devices', {
        params: { page: 1, limit: 20, search: 'test' },
      });
      
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/v1/devices?page=1&limit=20&search=test',
        expect.any(Object)
      );
    });

    it('should handle 204 No Content response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 204,
        headers: new Headers({ 'content-length': '0' }),
      } as Response);

      const result = await client.delete('/api/v1/devices/:id', {
        params: { id: 'device-123' },
      });
      
      expect(result).toEqual({ success: true });
    });
  });

  describe('error handling', () => {
    it('should throw APIError for HTTP errors', async () => {
      const errorResponse = mockApiError('VALIDATION_ERROR', 'Invalid data');
      
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: async () => errorResponse,
        headers: new Headers(),
      } as Response);

      await expect(client.get('/api/v1/devices')).rejects.toThrow(APIError);
      await expect(client.get('/api/v1/devices')).rejects.toMatchObject({
        status: 400,
        code: 'VALIDATION_ERROR',
        message: 'Invalid data',
      });
    });

    it('should throw APIError for network errors', async () => {
      mockFetch.mockRejectedValueOnce(new TypeError('Network error'));

      await expect(client.get('/api/v1/devices')).rejects.toThrow(APIError);
      await expect(client.get('/api/v1/devices')).rejects.toMatchObject({
        status: 0,
        code: 'NETWORK_ERROR',
      });
    });

    it('should handle timeout', async () => {
      // 빠른 타임아웃으로 설정
      const fastClient = createAPIClient({
        baseURL: 'http://localhost:8000',
        timeout: 100,
      });

      mockFetch.mockImplementationOnce(() => delay(200).then(() => ({ ok: true } as Response)));

      await expect(fastClient.get('/api/v1/devices')).rejects.toThrow(APIError);
      await expect(fastClient.get('/api/v1/devices')).rejects.toMatchObject({
        status: 408,
        code: 'TIMEOUT',
      });
    });
  });

  describe('retry logic', () => {
    it('should retry on retryable errors', async () => {
      // 처음 두 번은 500 에러, 세 번째는 성공
      const response = mockApiResponse({ status: 'ok' });
      
      mockFetch
        .mockRejectedValueOnce(new APIError(500, 'INTERNAL_ERROR', 'Server error'))
        .mockRejectedValueOnce(new APIError(502, 'BAD_GATEWAY', 'Bad gateway'))
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => response,
          headers: new Headers(),
        } as Response);

      const result = await client.get('/api/v1/health');
      
      expect(result).toEqual(response);
      expect(mockFetch).toHaveBeenCalledTimes(3);
    });

    it('should not retry on non-retryable errors', async () => {
      mockFetch.mockRejectedValueOnce(new APIError(400, 'BAD_REQUEST', 'Bad request'));

      await expect(client.get('/api/v1/devices')).rejects.toThrow(APIError);
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('should stop retrying after max attempts', async () => {
      mockFetch.mockRejectedValue(new APIError(500, 'INTERNAL_ERROR', 'Server error'));

      await expect(client.get('/api/v1/devices')).rejects.toThrow(APIError);
      // 초기 시도 + 2번 재시도 = 3번
      expect(mockFetch).toHaveBeenCalledTimes(3);
    });
  });

  describe('abort functionality', () => {
    it('should abort request', async () => {
      let resolveFetch: (value: Response) => void;
      const fetchPromise = new Promise<Response>((resolve) => {
        resolveFetch = resolve;
      });
      
      mockFetch.mockReturnValueOnce(fetchPromise);

      const requestPromise = client.get('/api/v1/devices');
      
      // 요청 취소
      client.abort();
      
      await expect(requestPromise).rejects.toThrow(APIError);
      await expect(requestPromise).rejects.toMatchObject({
        status: 408,
        code: 'TIMEOUT',
      });
    });
  });
});

describe('APIError', () => {
  it('should create APIError with correct properties', () => {
    const error = new APIError(404, 'NOT_FOUND', 'Resource not found', { resource: 'device' });
    
    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe('APIError');
    expect(error.status).toBe(404);
    expect(error.code).toBe('NOT_FOUND');
    expect(error.message).toBe('Resource not found');
    expect(error.details).toEqual({ resource: 'device' });
  });
});

describe('createAPIClient', () => {
  it('should create client with default config', () => {
    const client = createAPIClient({
      baseURL: 'http://localhost:8000',
    });
    
    expect(client).toBeInstanceOf(TypedAPIClient);
  });

  it('should create client with custom config', () => {
    const client = createAPIClient({
      baseURL: 'http://localhost:8000',
      timeout: 15000,
      retryAttempts: 5,
      headers: {
        'Authorization': 'Bearer token',
      },
    });
    
    expect(client).toBeInstanceOf(TypedAPIClient);
  });
});