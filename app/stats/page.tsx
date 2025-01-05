"use client";

import React from 'react';
import styles from '../styles/Stats.module.css';

interface GameStats {
  playerName: string;
  score: number;
  gamesPlayed: number;
  winPercentage: number;
}

interface LeaderboardProps {
  stats: GameStats[];
}

const mockStats: GameStats[] = [
  {
    playerName: "John Doe",
    score: 1250,
    gamesPlayed: 45,
    winPercentage: 68.5
  },
  {
    playerName: "Jane Smith", 
    score: 980,
    gamesPlayed: 32,
    winPercentage: 62.3
  },
  {
    playerName: "Bob Wilson",
    score: 1450,
    gamesPlayed: 52,
    winPercentage: 71.2
  },
  {
    playerName: "Alice Brown",
    score: 875,
    gamesPlayed: 28,
    winPercentage: 57.8
  },
  {
    playerName: "Mike Johnson",
    score: 1125,
    gamesPlayed: 39,
    winPercentage: 64.9
  }
];

export default function Leaderboard() {
  return (
    <div className={styles.leaderboard}>
      <h2 className={styles.h2}>Leaderboard</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Rank</th>
            <th className={styles.th}>Player</th>
            <th className={styles.th}>Score</th>
            <th className={styles.th}>Games</th>
            <th className={styles.th}>Win %</th>
          </tr>
        </thead>
        <tbody>
          {mockStats
            .sort((a, b) => b.score - a.score)
            .map((player, index) => (
              <tr key={player.playerName} className={styles.tr}>
                <td className={styles.td}>{index + 1}</td>
                <td className={styles.td}>{player.playerName}</td>
                <td className={styles.td}>{player.score}</td>
                <td className={styles.td}>{player.gamesPlayed}</td>
                <td className={styles.td}>{player.winPercentage.toFixed(1)}%</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};
