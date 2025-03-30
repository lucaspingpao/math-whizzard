"use client";

import styles from '../styles/Loading.module.css';

export default function Loading() {
  return (
    <div className={styles.loading}>
      <p>Oops...! The AWS database storing the leaderboard information has been temporarily disabled to avoid incurring AWS' exorbitant costs. Keep enjoying the gameplay without the pressure to perform!</p>
    </div>
  );
}
