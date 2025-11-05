/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-nocheck
import type { AxiosError } from 'axios';

export const httpRequestErrors = {
  AUTH: 'AUTH',
  FORBIDDEN: 'FORBIDDEN',
  HTTP: 'HTTP',
  NETWORK: 'NETWORK',
  BUSINESS: 'BUSINESS',
  UNKNOWN: 'UNKNOWN',
} as const;

export type HttpRequestErrorType =
  (typeof httpRequestErrors)[keyof typeof httpRequestErrors];

export interface NormalizedHttpError {
  type: HttpRequestErrorType;
  status?: number;
  message: string;
  data?: any;
  raw?: unknown;
}

/**
 * Normalize various axios error shapes into a unified format
 */
export function normalizeHttpError(error: unknown): NormalizedHttpError {
  // Case 1: Network or CORS-level failure
  if (!error) {
    return {
      type: httpRequestErrors.NETWORK,
      message: '网络异常，请检查您的网络连接。',
    };
  }

  // Case 2: Axios error (most common)
  if ((error as AxiosError).isAxiosError) {
    const axiosError = error as AxiosError;
    const { response } = axiosError;
    const status = response?.status;
    const data = response?.data;

    // Auth related
    if (status === 401) {
      return {
        type: httpRequestErrors.AUTH,
        status,
        message: data?.message || '登录已过期，请重新登录。',
        data,
        raw: error,
      };
    }

    // Forbidden
    if (status === 403) {
      return {
        type: httpRequestErrors.FORBIDDEN,
        status,
        message: data?.message || '您没有权限执行此操作。',
        data,
        raw: error,
      };
    }

    // Server errors
    if (status && status >= 500) {
      return {
        type: httpRequestErrors.HTTP,
        status,
        message: data?.message || '服务器异常，请稍后再试。',
        data,
        raw: error,
      };
    }

    // Business logic error (valid HTTP but app-level failure)
    if (status && status < 500) {
      return {
        type: httpRequestErrors.BUSINESS,
        status,
        message: data?.message || '请求出错，请稍后再试。',
        data,
        raw: error,
      };
    }

    // No response (network or timeout)
    if (!response) {
      return {
        type: httpRequestErrors.NETWORK,
        message: '网络错误或请求超时，请检查您的网络连接。',
        raw: error,
      };
    }
  }

  // Case 3: Non-Axios unexpected error
  return {
    type: httpRequestErrors.UNKNOWN,
    message: (error as Error)?.message || '发生未知错误。',
    raw: error,
  };
}

export default normalizeHttpError;
