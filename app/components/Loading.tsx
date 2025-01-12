"use client";

import styles from '../styles/Loading.module.css';

export default function Loading() {
  return (
    <div className={styles.loading}>
      <div className={styles.spinner}></div>
      <p>Loading leaderboard data...</p>
    </div>
  );
}
