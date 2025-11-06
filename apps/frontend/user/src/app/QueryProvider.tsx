import getReactQueryOptions from '@pawhaven/shared-frontend/cores/react-query';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { useState, type ReactNode } from 'react';

import envConfig from '../config';

import useIsStableEnv from '@/hooks/useIsStableEnv';

const QueryProvider = ({ children }: { children: ReactNode }) => {
  const IsStableEnv = useIsStableEnv();
  const [queryClient] = useState(
    () => new QueryClient(getReactQueryOptions(envConfig)),
  );

  const [asyncStoragePersister] = useState(() =>
    createAsyncStoragePersister({
      storage: window.localStorage,
      key: 'PAWHAVEN_DATA_PERSIST',
    }),
  );

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister: asyncStoragePersister }}
    >
      {children}
      {!IsStableEnv && <ReactQueryDevtools initialIsOpen />}
    </PersistQueryClientProvider>
  );
};

export default QueryProvider;
