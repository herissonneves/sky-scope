import layoutStyles from '../PageContainerContent/PageContainerContent.module.css';

import styles from './TemperatureCard.module.css';

export interface TemperatureCardProps {
  visible: boolean;
  value: string;
}

export function TemperatureCard({ visible, value }: TemperatureCardProps) {
  return (
    <div
      className={`${styles.temperatureCard} ${layoutStyles.pageContainerContent__temperatureCard} ${
        visible ? layoutStyles.pageContainerContent__temperatureCard_visible : ''
      }`}
    >
      <div className={styles.temperatureCard__value}>{value}</div>
      <div className={styles.temperatureCard__label}>Temperatura Atual</div>
    </div>
  );
}
