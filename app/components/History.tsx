import { ReactNode } from 'react';
import styles from '../styles/History.module.css';
import { HistoryState } from '../types/types';

interface HistoryProps {
  history: HistoryState[];
  score: number;
  lives: number;
}

export default function History({ history, score, lives }: HistoryProps) {
  if (history.length === 0) {
    return (
      <div className={`${styles.history} ${styles.chalkboard}`}>
        <div className={styles.topBar}>
          <span className={styles.text}>Score: {score}</span>
          <span className={styles.text}>Lives: {lives}</span>
        </div>
        <h2 className={styles.text}>Equations</h2>
        <p className={`${styles.emptyState} ${styles.text}`}>No equations submitted yet</p>
      </div>
    );
  }

  return (
    <div className={`${styles.history} ${styles.chalkboard}`}>
      <div className={styles.topBar}>
        <span className={styles.text}>Score: {score}</span>
        <span className={styles.text}>Lives: {lives}</span>
      </div>
      <h2 className={styles.text}>Equations</h2>
      {history.length === 0 ? (
        <p className={`${styles.emptyState} ${styles.text}`}>No equations submitted yet</p>
      ) : (
        <div className={styles.historyList}>
          {history.map((item, index) => (
            <div 
              key={index}
              className={`${styles.historyItem} ${item.correct ? styles.correct : styles.incorrect} ${styles.text}`}
            >
              <span className={`${styles.equation} ${styles.text}`}>{item.equation}</span>
              <span className={`${styles.equation} ${styles.text}`}>{`${item.correct ? '+' : '-'}${item.score} points`}</span>
              <span className={`${styles.result} ${styles.text}`}>{item.correct ? '✓' : '✗'}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}