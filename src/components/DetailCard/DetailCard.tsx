import styles from './DetailCard.module.css';

export interface DetailCardProps {
  label: string;
  value: string;
}

export function DetailCard({ label, value }: DetailCardProps) {
  return (
    <div className={styles.detailCard}>
      <div className={styles.detailCard__value}>{value}</div>
      <div className={styles.detailCard__label}>{label}</div>
    </div>
  );
}
