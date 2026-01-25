/**
 * CityLabel Component
 * Label para exibir cidade, estado e país
 */

import styles from './CityLabel.module.css';

export function createCityLabel(): HTMLDivElement {
  const cityLabel = document.createElement('div');
  cityLabel.className = styles.cityLabel;

  return cityLabel;
}
