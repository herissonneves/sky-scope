/**
 * CityLabel Component
 * Label para exibir cidade, estado e país
 */

export function createCityLabel(): HTMLDivElement {
  const cityLabel = document.createElement('div');
  cityLabel.style.cssText = `
    margin-top: 1rem;
    max-width: 400px;
    width: 100%;
    font-size: 1rem;
    color: var(--md-sys-color-on-surface, #1A1B20);
    text-align: center;
    font-weight: 500;
    min-height: 1.5rem;
    display: none;
  `;

  return cityLabel;
}
