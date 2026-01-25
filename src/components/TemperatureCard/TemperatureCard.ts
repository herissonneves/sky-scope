/**
 * TemperatureCard Component
 * Card para exibir temperatura atual
 */

import styles from './TemperatureCard.module.css';

export interface TemperatureCardElements {
  card: HTMLDivElement;
  value: HTMLDivElement;
}

export function createTemperatureCard(): TemperatureCardElements {
  // Card para exibir temperatura
  const temperatureCard = document.createElement('div');
  temperatureCard.className = styles.card;

  const temperatureValue = document.createElement('div');
  temperatureValue.className = styles.value;

  const temperatureLabel = document.createElement('div');
  temperatureLabel.className = styles.label;
  temperatureLabel.textContent = 'Temperatura Atual';

  temperatureCard.appendChild(temperatureValue);
  temperatureCard.appendChild(temperatureLabel);

  return {
    card: temperatureCard,
    value: temperatureValue,
  };
}
