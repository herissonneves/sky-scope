/// <reference types="vite/client" />

import './styles/global.css';
import { createPageContainer } from './components/PageContainer/index.js';

const app = document.querySelector<HTMLDivElement>('#app');

if (app) {
  const pageContainer = createPageContainer();
  app.appendChild(pageContainer);
}
