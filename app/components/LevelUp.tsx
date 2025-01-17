"use client";

import styles from '../styles/LevelUp.module.css';

// Add this styled div for the level up animation
export const LevelUpOverlay: React.FC<{ show: boolean }> = ({ show }) => {
  if (!show) return null;
  return (
    <div className={styles.levelUpStyle}>
      LEVEL UP!
    </div>
  );
};
