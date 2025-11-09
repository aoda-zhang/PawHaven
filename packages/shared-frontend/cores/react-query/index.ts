import type { ToasterProps } from '@pawhaven/ui';
import { showNotification } from '@pawhaven/ui';
import { QueryCache, MutationCache } from '@tanstack/react-query';
import i18n, { t } from 'i18next';
import '@pawhaven/i18n';

import { httpRequestErrors, type ApiErrorInfo } from '../http/types';

interface RequestMeta {
  isShowServerError?: boolean;
  isShowClientError?: boolean;
  [key: string]: unknown;
}

const showErrorToast = (
  errorMessage: string,
  errorNotificationOptions?: ToasterProps,
) => {
  showNotification({
    message: errorMessage,
    type: 'error',
    ...(errorNotificationOptions ?? {}),
  });
};

const handleError = (errorInfo: ApiErrorInfo, meta?: RequestMeta) => {
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
    case httpRequestErrors.AUTH:
      showErrorToast(errorMessage, {
        duration: 2000,
      });
      break;
    case httpRequestErrors.FORBIDDEN:
      showErrorToast(errorMessage, {
        duration: Infinity,
      });
      break;
    case httpRequestErrors.CLIENT:
      if (metaData?.isShowClientError) {
        showErrorToast(errorMessage);
      }
      break;
    case httpRequestErrors.NETWORK:
      if (metaData?.isShowServerError) {
        showErrorToast(errorMessage);
      }
      break;

    default:
      showErrorToast(errorMessage);
      break;
  }
};
const getRequestQueryOptions = (envConfig: Record<string, never>) => {
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
        retry: (failureCount: number, error: ApiErrorInfo) => {
          return (
            failureCount < 2 &&
            [
              httpRequestErrors.NETWORK,
              httpRequestErrors.SERVER,
              httpRequestErrors.UNKNOWN,
            ].includes(error.type)
          );
        },
      },
    },

    queryCache: new QueryCache({
      onError: (error, query) => {
        // Do not show errors for queries that already have data
        if (query.state.data !== undefined) return;
        handleError(error as unknown as ApiErrorInfo, query?.meta ?? {});
      },
    }),

    mutationCache: new MutationCache({
      onError: (error, _variables, _context, mutation) => {
        const meta = mutation.meta as Record<string, unknown> | undefined;
        handleError(error as unknown as ApiErrorInfo, meta ?? {});
      },
    }),
  };
};

export default getRequestQueryOptions;
