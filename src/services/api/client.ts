import axios from 'axios';

export interface ApiError {
  status: number;
  message: string;
  data?: unknown;
}

interface ApiResponse<T> {
  status: number;
  data: T;
}

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

export const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const createApiError = (error: unknown): ApiError => {
  interface ErrorWithResponse {
    response?: {
      status: number;
      data: unknown;
    };
    request?: unknown;
    message: string;
    isAxiosError?: boolean;
  }

  const isErrorWithResponse = (err: unknown): err is ErrorWithResponse => {
    return err !== null &&
      typeof err === 'object' &&
      ('isAxiosError' in err || 'response' in err || 'request' in err);
  };

  if (isErrorWithResponse(error)) {
    if (error.response) {
      return {
        status: error.response.status,
        message: typeof error.response.data === 'string' ? error.response.data : 'An error occurred',
        data: error.response.data
      };
    } else if (error.request) {
      return {
        status: 0,
        message: 'No response received from server'
      };
    }
  }

  return {
    status: 500,
    message: error instanceof Error ? error.message : 'An unknown error occurred'
  };
};

client.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    const apiError = createApiError(error);

    switch (apiError.status) {
      case 401:
        // Handle unauthorized access
        localStorage.removeItem('auth_token');
        window.dispatchEvent(new CustomEvent('auth:logout'));
        window.location.href = '/login';
        break;
      case 403:
        console.error('Access forbidden:', apiError.message);
        break;
      case 404:
        console.error('Resource not found:', apiError.message);
        break;
      case 422:
        console.error('Validation error:', apiError.message);
        break;
      case 429:
        console.error('Rate limit exceeded:', apiError.message);
        break;
      case 500:
        console.error('Server error:', apiError.message);
        break;
      default:
        console.error('API Error:', apiError.message);
    }

    return Promise.reject(apiError);
  }
);