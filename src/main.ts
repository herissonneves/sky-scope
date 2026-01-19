import { initTheme } from '@/styles';

// Initialize theme on app load
initTheme();

const app = document.querySelector<HTMLDivElement>('#app');

if (app) {
  app.innerHTML = `
    <div style="padding: 2rem;">
      <h1>Sky Scope</h1>
      <p>Aplicação de clima feita em React.</p>
      <p style="margin-top: 1rem; font-size: 0.875rem; color: var(--md-sys-color-on-surface-variant);">
        Tema Material Design 3 carregado com sucesso! 🎨
      </p>
    </div>
  `;
}
