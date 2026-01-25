/**
 * ResultElement Component
 * Elemento para exibir mensagens de erro, loading e resultados
 */

import styles from './ResultElement.module.css';

export function createResultElement(): HTMLParagraphElement {
  const resultElement = document.createElement('p');
  resultElement.className = styles.resultElement;

  return resultElement;
}
