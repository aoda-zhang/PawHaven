/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-nocheck
import { httpRequestErrors } from './types';

/**
 * Normalize various axios error shapes into a unified format
 */
const normalizeHttpError = (error: unknown) => {
  if (error?.isAxiosError) {
    // Connected to the service: check if there is a response with a status code
    if (error?.response && error?.response?.status) {
      const { status, data, code } = error.response;

      // Determine error type by HTTP status
      // If status is 4xx, it's a client error; if 5xx, it's a server error
      let type = httpRequestErrors.HTTP;
      if (status >= 500) {
        type = httpRequestErrors.SERVER;
      } else {
        switch (status) {
          case 401:
            type = httpRequestErrors.AUTH;
            break;
          case 403:
            type = httpRequestErrors.FORBIDDEN;
            break;
          default:
            type = httpRequestErrors.CLIENT;
            break;
        }
      }
      return {
        type,
        code,
        status,
        data: data ?? null,
        raw: error,
      };
    }
    return {
      type: httpRequestErrors.NETWORK,
      status: undefined,
      code: error?.code ?? 'ERR_NETWORK',
      raw: error,
    };
  }
  return {
    type: httpRequestErrors.UNKNOWN,
    status: undefined,
    code: httpRequestErrors.UNKNOWN,
    raw: error,
  };
};

export default normalizeHttpError;
