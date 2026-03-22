import layoutStyles from '../PageContainerContent/PageContainerContent.module.css';

import styles from './CityLabel.module.css';

export interface CityLabelProps {
  visible: boolean;
  text: string;
}

export function CityLabel({ visible, text }: CityLabelProps) {
  return (
    <div
      className={`${styles.cityLabel} ${layoutStyles.pageContainerContent__cityLabel} ${
        visible ? layoutStyles.pageContainerContent__cityLabel_visible : ''
      }`}
    >
      {text}
    </div>
  );
}
