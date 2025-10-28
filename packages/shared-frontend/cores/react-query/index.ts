import { QueryCache } from '@tanstack/react-query';
import toast from 'react-hot-toast';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getReactQueryOptions = (envConfig: Record<string, any>) => {
  const {
    refetchOnReconnect = true,
    refetchOnWindowFocus = false,
    // Fresh data for 5 minutes
    staleTime = 5 * 60 * 1000,
    // Cache data for 30 minutes
    cacheTime = 30 * 60 * 1000,
    // Retry failed requests up to 2 times
    retry = 2,
  } = envConfig?.queryOptions ?? {};
  return {
    defaultOptions: {
      queries: {
        refetchOnReconnect,
        refetchOnWindowFocus,
        staleTime,
        cacheTime,
        retry,
      },
    },
    queryCache: new QueryCache({
      onError: (error, query) => {
        // Handle errors globally for queries
        if (query.state.data !== undefined) {
          toast.error(
            envConfig?.env === 'prod'
              ? envConfig?.systemSettings?.errorMessage
              : `Error: ${error instanceof Error ? error?.message : 'Unknown error'}`,
          );
        }
      },
    }),
  };
};
export default getReactQueryOptions;
