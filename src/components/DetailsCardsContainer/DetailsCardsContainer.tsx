import { DetailCard } from '../DetailCard/DetailCard.js';
import layoutStyles from '../PageContainerContent/PageContainerContent.module.css';

import styles from './DetailsCardsContainer.module.css';

export interface DetailsCardsContainerProps {
  visible: boolean;
  feelsLike: string;
  humidity: string;
  windSpeed: string;
}

export function DetailsCardsContainer({
  visible,
  feelsLike,
  humidity,
  windSpeed,
}: DetailsCardsContainerProps) {
  return (
    <div
      className={`${styles.detailsCardsContainer} ${layoutStyles.pageContainerContent__detailsCards} ${
        visible ? layoutStyles.pageContainerContent__detailsCards_visible : ''
      }`}
    >
      <DetailCard label="Sensação" value={feelsLike} />
      <DetailCard label="Umidade" value={humidity} />
      <DetailCard label="Vento" value={windSpeed} />
    </div>
  );
}
