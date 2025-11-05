import getReactQueryOptions from '@pawhaven/shared-frontend/cores/react-query';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { type ReactNode } from 'react';

import envConfig from '../config';

import useIsProd from '@/hooks/useIsProd';

const queryClient = new QueryClient(getReactQueryOptions(envConfig));

const asyncStoragePersister = createAsyncStoragePersister({
  storage: window.localStorage,
  key: 'PAWHAVEN_DATA_PERSIST',
});

const QueryProvider = ({ children }: { children: ReactNode }) => {
  const isProd = useIsProd();

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister: asyncStoragePersister }}
    >
      {children}
      {!isProd && <ReactQueryDevtools initialIsOpen />}
    </PersistQueryClientProvider>
  );
};

export default QueryProvider;
