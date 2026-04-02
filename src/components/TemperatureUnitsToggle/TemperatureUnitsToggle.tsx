import type { TemperatureUnit } from '../../lib/temperatureUnitsStorage.js';

import styles from './TemperatureUnitsToggle.module.css';

export interface TemperatureUnitsToggleProps {
  value: TemperatureUnit;
  onChange: (units: TemperatureUnit) => void;
  disabled?: boolean;
}

export function TemperatureUnitsToggle({ value, onChange, disabled }: TemperatureUnitsToggleProps) {
  return (
    <div className={styles.toggle} role="group" aria-label="Unidade de temperatura">
      <button
        type="button"
        className={`${styles.toggle__btn} ${value === 'metric' ? styles.toggle__btn_active : ''}`}
        aria-pressed={value === 'metric'}
        onClick={() => onChange('metric')}
        disabled={disabled}
      >
        °C
      </button>
      <button
        type="button"
        className={`${styles.toggle__btn} ${value === 'imperial' ? styles.toggle__btn_active : ''}`}
        aria-pressed={value === 'imperial'}
        onClick={() => onChange('imperial')}
        disabled={disabled}
      >
        °F
      </button>
    </div>
  );
}
