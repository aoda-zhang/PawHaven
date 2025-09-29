import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';

import envConfig from '../config';

import { combinedReducers, persistConfig } from './reducerConfig';

const rootReducer = combineReducers(combinedReducers);

export const store = configureStore({
  reducer: persistReducer(persistConfig, rootReducer),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // needed for redux-persist
    }),
  devTools: envConfig?.env !== 'prod', // Enable Redux DevTools in non-production environments
});

export const persistor = persistStore(store);

// ReduxState represents the entire Redux state tree; use this type for typing selectors and state in components
export type ReduxState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
