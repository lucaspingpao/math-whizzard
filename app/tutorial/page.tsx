"use client";

import styles from '../styles/Tutorial.module.css';

export default function Tutorial() {
  return (
    <main className={styles.mainContainer}>
      <h1 className={styles.pageTitle}>Tutorial</h1>
      <p className={styles.pageSubtitle}>How to play PαthMαth</p>
      
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Our Game</h2>
        <p className={styles.sectionText}>
          Our game is an exciting adventure that challenges players to solve puzzles and explore
          beautiful environments. With stunning graphics and an engaging storyline, players will
          be immersed in a unique gaming experience.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Our Team</h2>
        <p className={styles.sectionText}>
          We are a passionate group of developers, artists, and designers working together to
          create memorable gaming experiences. Our team brings years of industry experience
          and a shared love of gaming to every project.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Contact Us</h2>
        <p className={styles.sectionText}>
          Have questions or feedback? We'd love to hear from you!
          Email us at: contact@ourgame.com
        </p>
      </section>
      
    </main>
  );
}

