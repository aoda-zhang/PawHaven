import { ThemeProvider } from '@mui/material';
import '@pawhaven/theme/globalTailwind.css';
import MUITheme from '@pawhaven/theme/MUI-theme';
import { Loading, Notification } from '@pawhaven/ui';
import { type ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
// Enable i18n for the entire app
import '@pawhaven/i18n';

import QueryProvider from './QueryProvider';

import SystemError from '@/components/SystemError';
import { persistor, store } from '@/store/reduxStore';

type AppProviderProps = {
  children: ReactNode;
};

const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <Provider store={store}>
      <PersistGate loading={<Loading />} persistor={persistor}>
        <ErrorBoundary FallbackComponent={SystemError}>
          <QueryProvider>
            <ThemeProvider theme={MUITheme}>
              <Notification />
              {children}
            </ThemeProvider>
          </QueryProvider>
        </ErrorBoundary>
      </PersistGate>
    </Provider>
  );
};

export default AppProvider;
