import styles from './Spinner.module.css';

interface SpinnerBarProps {}

export const Spinner = (props: SpinnerBarProps) => {
  return (
    <div className={styles.container}>
      <span>Loading…</span>
      <span className={`${styles.spinner} ${styles.three}`} />
    </div>
  );
};
