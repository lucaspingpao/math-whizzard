import { ReactNode } from 'react';
import styles from '../styles/History.module.css';

interface HistoryState {
  equation: string;
  correct: boolean;
}

interface HistoryProps {
  history: HistoryState[];
}

export default function History({ history }: HistoryProps) {
  if (history.length === 0) {
    return (
      <div className={styles.history}>
        <h2>History</h2>
        <p className={styles.emptyState}>No equations submitted yet</p>
      </div>
    );
  }

  return (
    <div className={styles.history}>
      <h2>History</h2>
      <div className={styles.historyList}>
        {history.map((item, index) => (
          <div 
            key={index}
            className={`${styles.historyItem} ${item.correct ? styles.correct : styles.incorrect}`}
          >
            <span className={styles.equation}>{item.equation}</span>
            <span className={styles.result}>
              {item.correct ? '✓' : '✗'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
