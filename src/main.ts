const app = document.querySelector<HTMLDivElement>('#app');

if (app) {
  // Container centralizado
  const container = document.createElement('div');
  container.style.cssText = `
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    min-height: 100vh;
    padding-top: 2rem;
  `;

  // Caixa de texto
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Digite aqui...';
  input.style.cssText = `
    width: 100%;
    max-width: 400px;
    padding: 0.75rem 1rem;
    font-size: 1rem;
    border: 1px solid var(--md-sys-color-outline, #74777F);
    border-radius: 4px;
    background-color: var(--md-sys-color-surface, #F9F9FF);
    color: var(--md-sys-color-on-surface, #1A1B20);
    outline: none;
    transition: border-color 0.2s ease;
  `;

  // Eventos de foco
  input.addEventListener('focus', () => {
    input.style.borderColor = 'var(--md-sys-color-primary, #435E91)';
  });

  input.addEventListener('blur', () => {
    input.style.borderColor = 'var(--md-sys-color-outline, #74777F)';
  });

  container.appendChild(input);
  app.appendChild(container);
}
