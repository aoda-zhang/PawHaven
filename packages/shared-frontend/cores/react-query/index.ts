import {
  type ToastType,
  notificationType,
  showNotification,
} from '@pawhaven/ui';
import { QueryCache, MutationCache } from '@tanstack/react-query';
import i18n, { t } from 'i18next';
import '@pawhaven/i18n';
import type { ToastOptions } from 'react-hot-toast';

import { type ApiErrorInfo, httpRequestErrors } from '../http/types';

interface RequestMeta {
  isShowServerError?: boolean;
  isShowClientError?: boolean;
  toastOptions?: { type: ToastType } & ToastOptions;
}

interface QueryOptionsType {
  refetchOnReconnect?: boolean;
  refetchOnWindowFocus?: boolean;
  staleTime?: string;
  cacheTime?: string;
  maxRetry?: number;
  onAuthError: () => void;
  onPermissionError: () => void;
}

interface ErrorHandleType {
  queryOptions: QueryOptionsType;
  errorInfo: ApiErrorInfo;
  meta: RequestMeta;
}

const showErrorToast = (
  errorMessage: string,
  errorNotificationOptions?: { type: ToastType } & ToastOptions,
) => {
  showNotification({
    message: errorMessage,
    ...(errorNotificationOptions ?? {}),
  });
};

const handleError = ({ queryOptions, errorInfo, meta }: ErrorHandleType) => {
  let errorMessage = t('errorMessage.UNKNOWN_ERROR');
  if (i18n.exists(`errorMessage.${errorInfo?.code}`)) {
    errorMessage = t(`errorMessage.${errorInfo?.code}`);
  }
  const metaData: RequestMeta = {
    isShowClientError: false,
    isShowServerError: true,
    ...meta,
  };
  switch (errorInfo.type) {
    // Auth---------
    case httpRequestErrors.AUTH:
      queryOptions?.onAuthError();
      break;
    case httpRequestErrors.PERMISSION:
      queryOptions?.onPermissionError();
      break;

    // client------------
    case httpRequestErrors.BADREQUEST:
    case httpRequestErrors.RATELIMIT:
      break;
    // Network ----------
    case httpRequestErrors.NETWORK:
      if (metaData?.isShowServerError) {
        showErrorToast(errorMessage, {
          ...(metaData?.toastOptions ?? {}),
          type: metaData?.toastOptions?.type ?? notificationType.info,
          duration: metaData?.toastOptions?.duration ?? 1000,
        });
      }
      break;
    default:
      showErrorToast(errorMessage);
      break;
  }
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getRequestQueryOptions = (queryOptions: QueryOptionsType) => {
  const {
    refetchOnReconnect = true,
    refetchOnWindowFocus = false,
    staleTime = 5 * 60 * 1000, // Data is considered fresh within 5 minutes
    cacheTime = 30 * 60 * 1000, // Cache for 30 minutes
    maxRetry = 2, // Default max retry 2 times
  } = queryOptions ?? {};

  return {
    defaultOptions: {
      queries: {
        refetchOnReconnect,
        refetchOnWindowFocus,
        staleTime,
        cacheTime,
        retry: (failureCount: number, error: ApiErrorInfo) => {
          const retryAbleErrors = [
            httpRequestErrors.NETWORK,
            httpRequestErrors.UNKNOWN,
            httpRequestErrors.SERVER,
          ] as const;
          return (
            failureCount < maxRetry &&
            retryAbleErrors.includes(
              error?.type as (typeof retryAbleErrors)[number],
            )
          );
        },
      },
    },

    queryCache: new QueryCache({
      onError: (errorInfo, query) => {
        // Do not show errors for queries that already have data
        if (query.state.data !== undefined) return;
        handleError({ queryOptions, errorInfo, meta: query?.meta ?? {} });
      },
    }),

    mutationCache: new MutationCache({
      onError: (errorInfo, _variables, _context, mutation) => {
        const meta = mutation.meta as Record<string, unknown>;
        handleError({ queryOptions, errorInfo, meta });
      },
    }),
  };
};

export default getRequestQueryOptions;
