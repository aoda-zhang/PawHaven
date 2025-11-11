/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-nocheck
import { HttpBusinessMappingCode, httpRequestErrors } from './types';

/**
 * Check if the error is an authentication-related error (e.g., JWT expired, unauthorized)
 */
const isAuthError = (errorRes) => {
  const { status, code } = errorRes;
  return (
    status === 401 &&
    [
      HttpBusinessMappingCode.jwtExpired,
      HttpBusinessMappingCode.unauthorized,
    ].includes(code)
  );
};

/**
 * Check if the error is a permission (forbidden) error
 */
const isPermissionError = (errorRes) => {
  const { status, code } = errorRes;
  return status === 403 && [HttpBusinessMappingCode.forbidden].includes(code);
};

/**
 * Check if the error indicates the client has hit the API rate limit
 */
const isRateLimit = (errorRes) => {
  const { status, code } = errorRes;
  return (
    status === 429 ||
    [
      HttpBusinessMappingCode.rateLimitExceeded,
      HttpBusinessMappingCode.tooManyRequests,
    ].includes(code)
  );
};

/**
 * Check if the error is a bad request (client-side input error)
 */
const isBadRequest = (errorRes) => {
  const { status, code } = errorRes;
  return (
    status === 400 &&
    [
      HttpBusinessMappingCode.invalidParams,
      HttpBusinessMappingCode.badRequest,
    ].includes(code)
  );
};

/**
 * Check if the error is a server-side internal error
 */
const isServerError = (errorRes) => {
  const { status } = errorRes;
  return status >= 500 && status !== 503;
};

/**
 * Check if the server is temporarily unavailable (maintenance)
 */
const isMaintenance = (errorRes) => {
  const { status, code } = errorRes;
  return status === 503 && [HttpBusinessMappingCode.maintenance].includes(code);
};

/**
 * Normalize various axios error shapes into a unified format
 */
const normalizeHttpError = (error) => {
  let errorType = httpRequestErrors.NETWORK;
  let errorStatus = error?.status;
  let errorCode = error?.code;
  if (error?.isAxiosError && error?.response) {
    const { code, status } = error.response;
    errorStatus = status;
    errorCode = code;
    if (isAuthError(error?.response)) {
      errorType = httpRequestErrors.AUTH;
      errorStatus = status;
    }
    if (isPermissionError(error?.response)) {
      errorType = httpRequestErrors.FORBIDDEN;
    }
    if (isBusinessError(error?.response)) {
      errorType = httpRequestErrors.CLIENT;
    }
    if (isMaintenance(error?.response)) {
      errorType = httpRequestErrors.MAINTENANCE;
    }
    if (isServerError(error?.response)) {
      errorType = httpRequestErrors.SERVER;
    }
  }
  return {
    type: errorType,
    status: errorStatus,
    code: errorCode,
    raw: error,
  };
};

export default normalizeHttpError;
