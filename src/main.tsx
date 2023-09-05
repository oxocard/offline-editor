import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider, batch } from 'react-redux';
import i18n from './i18n.ts';
import { ToastContainer } from 'react-toastify';

/* Components */
import App from './App.tsx';

/* Store */
import { store } from './store/index.ts';
import { loadClient } from './store/slices/client.ts';
import { loadCode, resetError, setShowDeviceState } from './store/slices/editor.ts';
import { loadLayout } from './store/slices/layout.ts';

/* Styles */
import { CssBaseline } from '@mui/material';
import Serial from './serial/index.ts';

batch(() => {
  store.dispatch(loadClient());
  store.dispatch(loadLayout());
  store.dispatch(loadCode());
});

i18n.changeLanguage(store.getState().client.language);

const calculateVh = () => {
  /* Fix for the iOS devices vh property */
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
};

calculateVh();
window.addEventListener('resize', calculateVh);

document.addEventListener('keydown', (e) => {
  /* Run Code */
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    /* Prevent the Save dialog to open */
    e.preventDefault();

    const state = store.getState();
    const isDeviceConnected = state.device.isConnected;

    if (isDeviceConnected) {
      batch(() => {
        store.dispatch(resetError());
        store.dispatch(setShowDeviceState(true));
      });
      const serial = Serial.getInstance();
      serial.sendCode();
    }
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CssBaseline />
    <Provider store={store}>
      <App />
      <ToastContainer
        className="toast-container"
        position="bottom-right"
        autoClose={5000}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="colored"
      />
    </Provider>
  </React.StrictMode>
);
