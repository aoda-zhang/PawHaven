/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';

import getLocale from '../../utils/getLocale';

import { generateSign, getUTCTimestamp } from './encrypt';
import normalizeHttpError from './errorHandle';

/**
 * Configuration options for creating an API client instance.
 */
export interface ApiClientOptions {
  baseURL: string; // The base URL for API requests
  timeout?: number; // Optional request timeout
  enableSign?: boolean; // Whether to use signature validation
  prefix: string; // endpoint prefix
  privateKey: string; // HMA key
  withCredentials?: boolean; // Is send cookies to backend automatically
}

/**
 * Factory function to create a reusable API client with common interceptors and headers.
 */
const createApiClient = (options: ApiClientOptions) => {
  const {
    baseURL,
    timeout = 20000,
    enableSign = true,
    prefix,
    privateKey,
    withCredentials = true,
  } = options;

  const Http: AxiosInstance = axios.create({
    baseURL,
    timeout,
    withCredentials,
  });

  const getHttpHeaders = (config: Record<string, any>) => {
    const timestamp = `${getUTCTimestamp()}`;
    const headers: Record<string, any> = {
      Accept: 'application/json',
      'X-timestamp': timestamp,
      'X-locale': getLocale(),
    };
    if (enableSign) {
      headers['X-sign'] = generateSign({
        config,
        timestamp,
        prefix,
        privateKey,
      });
    }

    return headers;
  };

  // ✅ Request interceptor with proper typing
  Http.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      Object.assign(config.headers ?? {}, getHttpHeaders(config));
      return config;
    },
    (error) => {
      return Promise.reject(normalizeHttpError(error));
    },
  );

  // ✅ Response interceptor
  Http.interceptors.response.use(
    (response: AxiosResponse<any>) => {
      if (
        response?.data?.status >= 200 &&
        response?.data?.status < 400 &&
        response?.data?.isSuccess
      ) {
        return response.data.data;
      }
      const err = normalizeHttpError(response.data);
      return Promise.reject(new Error(err.message || 'Unknown error'));
    },
    (error) => {
      const err = normalizeHttpError(error);
      return Promise.reject(new Error(err.message || 'Unknown network error'));
    },
  );

  return {
    get<T>(
      url: string,
      params?: Record<string, any>,
      config?: AxiosRequestConfig,
    ): Promise<T> {
      return Http.get(url, { params, ...config });
    },
    delete<T>(
      url: string,
      params?: Record<string, any>,
      config?: AxiosRequestConfig,
    ): Promise<T> {
      return Http.delete(url, { params, ...config });
    },
    post<T>(
      url: string,
      data?: Record<string, any>,
      config?: AxiosRequestConfig,
    ): Promise<T> {
      return Http.post(url, data, { ...config });
    },
    put<T>(
      url: string,
      data?: Record<string, any>,
      config?: AxiosRequestConfig,
    ): Promise<T> {
      return Http.put(url, data, { ...config });
    },
  };
};

export default createApiClient;
