import { ReactNode } from 'react';
import styles from '../styles/History.module.css';
import { HistoryState } from '../types/types';
import { scoreMap } from '../constants/scoreMap';

interface HistoryProps {
  history: HistoryState[];
  totalScore: number;
  lives: number;
  level: number;
}

export default function History({ history, totalScore, lives, level }: HistoryProps) {
  return (
    <div className={`${styles.history} ${styles.chalkboard}`}>
      <div className={styles.topBar}>
        <span className={styles.topText}>Lives: {'❤️'.repeat(lives)}</span>
        <span className={styles.topText}>Score: {totalScore} / {scoreMap.get(level)}</span>
        <span className={styles.topText}>Level: {level}</span>
      </div>
      <h2 className={styles.text}>Equations</h2>
      {history.length === 0 ? (
        <p className={`${styles.emptyState} ${styles.text}`}>No equations submitted yet</p>
      ) : (
        <div className={styles.historyList}>
          {history.map((item, index) => (
            <div 
              key={item.equation + index}
              className={`${styles.historyItem} ${item.correct ? styles.correct : styles.incorrect} ${styles.text} ${item.isNew ? styles.fadeIn : ''}`}
            >
              <span className={`${styles.equation} ${styles.text}`}>{item.equation}</span>
              <span className={`${styles.equation} ${styles.text}`}>{`${item.correct ? '+' : '-'}${item.score} point${item.score === 1 ? '' : 's'}`}</span>
              <span className={`${styles.result} ${styles.text}`}>{item.correct ? '✓' : '✗'}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}