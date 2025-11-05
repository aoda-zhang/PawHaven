/* eslint-disable @typescript-eslint/no-explicit-any */
import { QueryCache, MutationCache } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { normalizeHttpError, httpRequestErrors } from '../http/errorHandle';

let lastErrorTime = 0;
const showErrorToast = (msg: string) => {
  const now = Date.now();
  if (now - lastErrorTime > 3000) {
    // Do not show duplicate toasts within 3 seconds
    toast.error(msg);
    lastErrorTime = now;
  }
};

const handleError = (error: unknown, envConfig: Record<string, any>) => {
  const normalized = normalizeHttpError(error);

  switch (normalized.type) {
    case httpRequestErrors.AUTH:
      showErrorToast(normalized.message);
      // Can trigger logout or redirect to login page logic
      break;
    case httpRequestErrors.FORBIDDEN:
      showErrorToast('You do not have permission to perform this operation');
      break;
    case httpRequestErrors.NETWORK:
      showErrorToast('Network error, please check your connection');
      break;
    case httpRequestErrors.HTTP:
      showErrorToast('Server error, please try again later');
      break;
    case httpRequestErrors.BUSINESS:
      showErrorToast(normalized.message);
      break;
    default:
      showErrorToast(
        envConfig?.env === 'prod'
          ? envConfig?.systemSettings?.errorMessage ||
              'Request error, please try again later.'
          : `Error: ${normalized.message}`,
      );
      break;
  }

  // Optional: report to Sentry
  if (
    envConfig?.enableSentry &&
    normalized.type !== httpRequestErrors.BUSINESS
  ) {
    // Sentry.captureException(normalized.raw);
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getReactQueryOptions = (envConfig: Record<string, any>) => {
  const {
    refetchOnReconnect = true,
    refetchOnWindowFocus = false,
    staleTime = 5 * 60 * 1000, // Data is considered fresh within 5 minutes
    cacheTime = 30 * 60 * 1000, // Cache for 30 minutes
  } = envConfig?.queryOptions ?? {};

  return {
    defaultOptions: {
      queries: {
        refetchOnReconnect,
        refetchOnWindowFocus,
        staleTime,
        cacheTime,
        retry: (failureCount: number, error: unknown) => {
          const normalized = normalizeHttpError(error);
          return (
            failureCount < 2 &&
            (normalized.type === httpRequestErrors.NETWORK ||
              (normalized.status ?? 0) >= 500)
          );
        },
      },
    },

    queryCache: new QueryCache({
      onError: (error, query) => {
        // Do not show errors for queries that already have data
        if (query.state.data !== undefined) return;
        handleError(error, envConfig);
      },
    }),

    mutationCache: new MutationCache({
      onError: (error) => {
        handleError(error, envConfig);
      },
    }),
  };
};

export default getReactQueryOptions;
