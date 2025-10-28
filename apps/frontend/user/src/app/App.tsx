import type { FC } from 'react';

import AppRouterProvider from '../route/AppRouterProvider';

import AppProvider from './AppProvider';

const App: FC = () => {
  return (
    <AppProvider>
      <AppRouterProvider />
    </AppProvider>
  );
};

export default App;
