import { ThemeProvider } from '@mui/material';
import '@shared/theme/global.css';
import Loading from '@shared/components/Loading';
import getReactQueryOptions from '@shared/cores/react-query';
import MUITheme from '@shared/theme/MUI-theme';
import { type ReactNode, Suspense, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import envConfig, { EnvVariables } from '../config';
import '@shared/i18n';
import { store, persistor } from '../store/reduxStore';

import GlobalInitializer from './GlobalInitializer';

import ErrorPage from '@/components/SystemError';

type AppProviderProps = {
  children: ReactNode;
};

const AppProvider = ({ children }: AppProviderProps) => {
  const [queryClient] = useState(() => {
    return new QueryClient(getReactQueryOptions(envConfig));
  });
  return (
    <Provider store={store}>
      <PersistGate loading={<Loading />} persistor={persistor}>
        <Suspense fallback={<Loading />}>
          <ErrorBoundary FallbackComponent={ErrorPage}>
            <QueryClientProvider client={queryClient}>
              {envConfig?.env !== EnvVariables.prod && (
                <ReactQueryDevtools initialIsOpen />
              )}
              <ThemeProvider theme={MUITheme}>
                <Toaster />
                <GlobalInitializer />
                {children}
              </ThemeProvider>
            </QueryClientProvider>
          </ErrorBoundary>
        </Suspense>
      </PersistGate>
    </Provider>
  );
};

export default AppProvider;
