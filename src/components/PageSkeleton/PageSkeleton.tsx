import styles from "./PageSkeleton.module.css";

// Generic skeleton shown while a lazily-loaded page chunk is being fetched.
// Mirrors the common page layout: a title bar and a grid of cards.
export const PageSkeleton = () => (
  <div className={styles.container}>
    <div className={`skeleton ${styles.title}`} />
    <div className={styles.grid}>
      {[...Array(6)].map((_, i) => (
        <div key={i} className={styles.card}>
          <div className={`skeleton ${styles.cardTitle}`} />
          <div className={`skeleton ${styles.cardText}`} />
          <div className={`skeleton ${styles.cardTextShort}`} />
          <div className={styles.cardFooter}>
            <div className={`skeleton ${styles.cardDate}`} />
            <div className={`skeleton ${styles.cardButton}`} />
          </div>
        </div>
      ))}
    </div>
  </div>
);
