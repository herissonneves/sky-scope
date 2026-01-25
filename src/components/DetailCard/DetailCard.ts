/**
 * DetailCard Component
 * Card menor para exibir detalhes (sensação, umidade, vento, etc.)
 */

import styles from './DetailCard.module.css';

export interface DetailCardElements {
  card: HTMLDivElement;
  value: HTMLDivElement;
}

export function createDetailCard(label: string): DetailCardElements {
  const card = document.createElement('div');
  card.className = styles.card;

  const value = document.createElement('div');
  value.className = styles.value;

  const labelElement = document.createElement('div');
  labelElement.className = styles.label;
  labelElement.textContent = label;

  card.appendChild(value);
  card.appendChild(labelElement);

  return { card, value };
}
