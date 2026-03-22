/// <reference types="vite/client" />

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './styles/global.css';
import { App } from './App.js';

const rootEl = document.querySelector<HTMLDivElement>('#app');

if (rootEl) {
  createRoot(rootEl).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
