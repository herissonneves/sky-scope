/**
 * DetailCard Component
 * Card menor para exibir detalhes (sensação, umidade, vento, etc.)
 */

export interface DetailCardElements {
  card: HTMLDivElement;
  value: HTMLDivElement;
}

export function createDetailCard(label: string): DetailCardElements {
  const card = document.createElement('div');
  card.style.cssText = `
    flex: 1;
    min-width: 110px;
    padding: 1rem;
    background-color: var(--md-sys-color-surface-container-low);
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.3), 0 1px 3px 1px rgba(0, 0, 0, 0.15);
    border-radius: 0.75rem;
    text-align: center;
  `;

  const value = document.createElement('div');
  value.style.cssText = `
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--md-sys-color-primary, #435E91);
    line-height: 1.2;
    margin-bottom: 0.25rem;
  `;

  const labelElement = document.createElement('div');
  labelElement.style.cssText = `
    font-size: 0.75rem;
    color: var(--md-sys-color-on-surface-variant, #44474F);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  `;
  labelElement.textContent = label;

  card.appendChild(value);
  card.appendChild(labelElement);

  return { card, value };
}
