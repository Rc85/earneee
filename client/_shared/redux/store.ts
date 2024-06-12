import { configureStore } from '@reduxjs/toolkit';
import appSlice, { AppState } from './app';
import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER, persistReducer } from 'redux-persist';
import localStorage from 'redux-persist/es/storage';

const persistConfig = {
  key: 'App',
  storage: localStorage,
  whitelist: ['cart'],
  version: 1
};

export const store = configureStore({
  reducer: {
    App: persistReducer<AppState>(persistConfig, appSlice)
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    })
});

export type RootState = ReturnType<typeof store.getState>;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
