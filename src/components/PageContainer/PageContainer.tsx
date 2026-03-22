import { PageContainerContent } from '../PageContainerContent/PageContainerContent.js';

import styles from './PageContainer.module.css';

export function PageContainer() {
  return (
    <div className={styles.pageContainer}>
      <PageContainerContent />
    </div>
  );
}
