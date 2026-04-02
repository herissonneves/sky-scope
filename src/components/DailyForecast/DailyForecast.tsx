import type { DailyForecastDay } from '../../lib/weatherDisplayFormat.js';
import layoutStyles from '../PageContainerContent/PageContainerContent.module.css';

import styles from './DailyForecast.module.css';

export type { DailyForecastDay };

export interface DailyForecastProps {
  visible: boolean;
  days: readonly DailyForecastDay[];
}

export function DailyForecast({ visible, days }: DailyForecastProps) {
  if (!visible || days.length === 0) {
    return null;
  }

  return (
    <section
      className={`${styles.dailyForecast} ${layoutStyles.pageContainerContent__dailyForecast} ${
        visible ? layoutStyles.pageContainerContent__dailyForecast_visible : ''
      }`}
      aria-label="Previsão para os próximos dias"
    >
      <h2 className={styles.dailyForecast__title}>Próximos 5 dias</h2>
      <div className={styles.dailyForecast__grid}>
        {days.map((day, index) => (
          <div key={index} className={styles.dailyForecast__day}>
            <div className={styles.dailyForecast__weekday}>{day.label}</div>
            <div className={styles.dailyForecast__main}>{day.main}</div>
            <div className={styles.dailyForecast__row}>
              Mín. <span className={styles.dailyForecast__value}>{day.min}</span>
            </div>
            <div className={styles.dailyForecast__row}>
              Máx. <span className={styles.dailyForecast__value}>{day.max}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
