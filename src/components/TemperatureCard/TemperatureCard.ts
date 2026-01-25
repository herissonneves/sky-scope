/**
 * TemperatureCard Component
 * Card para exibir temperatura atual
 */

export interface TemperatureCardElements {
  card: HTMLDivElement;
  value: HTMLDivElement;
}

export function createTemperatureCard(): TemperatureCardElements {
  // Card para exibir temperatura
  const temperatureCard = document.createElement('div');
  temperatureCard.style.cssText = `
    margin-top: 1rem;
    padding: 1.5rem;
    max-width: 400px;
    width: 100%;
    background-color: var(--md-sys-color-surface-container-low);
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.3), 0 1px 3px 1px rgba(0, 0, 0, 0.15);
    border-radius: 0.75rem;
    text-align: center;
    display: none;
  `;

  const temperatureValue = document.createElement('div');
  temperatureValue.style.cssText = `
    font-size: 3rem;
    font-weight: 600;
    color: var(--md-sys-color-primary, #435E91);
    line-height: 1;
  `;

  const temperatureLabel = document.createElement('div');
  temperatureLabel.style.cssText = `
    margin-top: 0.5rem;
    font-size: 0.875rem;
    color: var(--md-sys-color-on-surface-variant, #44474F);
  `;
  temperatureLabel.textContent = 'Temperatura Atual';

  temperatureCard.appendChild(temperatureValue);
  temperatureCard.appendChild(temperatureLabel);

  return {
    card: temperatureCard,
    value: temperatureValue,
  };
}
