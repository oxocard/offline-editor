import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';

import client from './slices/client';
import device from './slices/device';
import editor from './slices/editor';
import layout from './slices/layout';
import spiffs from './slices/spiffs';
import terminal from './slices/terminal';

export const store = configureStore({
  reducer: {
    client,
    device,
    editor,
    layout,
    spiffs,
    terminal,
  },
  middleware: (getDefaultMiddleware) =>
    import.meta.env.MODE === 'development'
      ? getDefaultMiddleware().concat(logger)
      : getDefaultMiddleware(),
});

/*Infer the `RootState` and `AppDispatch` types from the store itself */
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
