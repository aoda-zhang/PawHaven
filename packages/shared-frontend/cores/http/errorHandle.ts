/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpBusinessMappingCode } from './types';

const normalizeHttpError = (error: any) => {
  const status = error?.status ?? error?.statusCode ?? error?.response?.status;
  const data = error?.data ?? error?.response?.data;
  const message =
    error?.message ||
    data?.message ||
    error?.response?.statusText ||
    '发生未知错误';

  if (data === HttpBusinessMappingCode.jwtexpired) {
    return {
      type: 'AUTH' as const,
      status,
      message: '登录信息已过期，请重新登录',
      data,
    };
  }

  if (status === 401 || status === 403) {
    return {
      type: 'AUTH' as const,
      status,
      message,
      data,
    };
  }

  if (status === 500) {
    return {
      type: 'HTTP' as const,
      status,
      message,
      data,
    };
  }

  if (!status) {
    return {
      type: 'NETWORK' as const,
      message: '网络错误，请检查您的网络连接',
      data,
    };
  }

  return {
    type: 'BUSINESS' as const,
    status,
    message,
    data,
  };
};

export default normalizeHttpError;
