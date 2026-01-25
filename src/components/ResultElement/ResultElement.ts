/**
 * ResultElement Component
 * Elemento para exibir mensagens de erro, loading e resultados
 */

export function createResultElement(): HTMLParagraphElement {
  const resultElement = document.createElement('p');
  resultElement.style.cssText = `
    margin-top: 1rem;
    padding: 1rem;
    max-width: 400px;
    width: 100%;
    font-size: 0.875rem;
    color: var(--md-sys-color-on-surface, #1A1B20);
    background-color: var(--md-sys-color-surface-container, #EDEDF4);
    border-radius: 8px;
    word-wrap: break-word;
    white-space: pre-wrap;
    min-height: 1.5rem;
    display: none;
  `;

  return resultElement;
}
