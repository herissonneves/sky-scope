/**
 * PageContainer Component
 * Container principal da aplicação com elevation do Material Design 3
 */

import { createPageContainerContent } from '../PageContainerContent/index.js';

import styles from './PageContainer.module.css';

export function createPageContainer(): HTMLDivElement {
  // Container principal com elevation
  const pageContainer = document.createElement('div');
  pageContainer.className = styles.pageContainer;

  // Criar e adicionar o conteúdo do container
  createPageContainerContent(pageContainer);

  return pageContainer;
}
