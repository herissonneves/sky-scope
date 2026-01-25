/**
 * DetailsCardsContainer Component
 * Container para os cards de detalhes (sensação, umidade, vento)
 */

import { createDetailCard, type DetailCardElements } from '../DetailCard/index.js';

export interface DetailsCardsContainerElements {
  container: HTMLDivElement;
  feelsLikeCard: DetailCardElements;
  humidityCard: DetailCardElements;
  windSpeedCard: DetailCardElements;
}

export function createDetailsCardsContainer(): DetailsCardsContainerElements {
  // Container para os cards menores
  const detailsCardsContainer = document.createElement('div');
  detailsCardsContainer.style.cssText = `
    margin-top: 1rem;
    max-width: 400px;
    width: 100%;
    display: none;
    flex-direction: row;
    gap: 0.75rem;
    flex-wrap: wrap;
    justify-content: center;
  `;

  // Cards de detalhes
  const feelsLikeCard = createDetailCard('Sensação');
  const humidityCard = createDetailCard('Umidade');
  const windSpeedCard = createDetailCard('Vento');

  detailsCardsContainer.appendChild(feelsLikeCard.card);
  detailsCardsContainer.appendChild(humidityCard.card);
  detailsCardsContainer.appendChild(windSpeedCard.card);

  return {
    container: detailsCardsContainer,
    feelsLikeCard,
    humidityCard,
    windSpeedCard,
  };
}
