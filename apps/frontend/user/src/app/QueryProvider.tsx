import getReactQueryOptions from '@pawhaven/shared-frontend/cores/react-query';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { useEffect, type ReactNode } from 'react';

import envConfig from '../config';

import useIsProd from '@/hooks/useIsProd';

const localStoragePersister =
  typeof window !== 'undefined'
    ? createAsyncStoragePersister({ storage: window.localStorage })
    : undefined;

const queryClient = new QueryClient(getReactQueryOptions(envConfig));

const QueryProvider = ({ children }: { children: ReactNode }) => {
  const isProd = useIsProd();
  useEffect(() => {
    if (localStoragePersister) {
      persistQueryClient({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        queryClient: queryClient as any,
        persister: localStoragePersister,
        dehydrateOptions: {
          shouldDehydrateQuery: (query) => {
            const isPersist = (query?.meta?.isPersist ?? false) as boolean;
            return isPersist;
          },
        },
      });
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {!isProd && <ReactQueryDevtools initialIsOpen />}
    </QueryClientProvider>
  );
};

export default QueryProvider;
