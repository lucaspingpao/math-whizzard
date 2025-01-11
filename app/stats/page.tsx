"use client";

import { useEffect, useState } from 'react';
import styles from '../styles/Stats.module.css';

interface Stats {
  user_id: string;
  score: number;
  created_at: string;
}

const mockStats: Stats[] = [
  {
    user_id: "alice_test",
    score: 1250,
    created_at: "2023-05-01T12:00:00Z"
  },
  {
    user_id: "alice_test",
    score: 1250,
    created_at: "2023-05-01T12:00:00Z"
  },
  {
    user_id: "alice_test",
    score: 1250,
    created_at: "2023-05-01T12:00:00Z"
  },
];

export default function Leaderboard() {
  const apiUrl = 'https://smwylkwm55.execute-api.us-east-2.amazonaws.com/default/stats';
  const [stats, setStats] = useState(mockStats);

  useEffect(() => {
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        console.log(data)
          setStats(data);
      })
      .catch(error => console.error('Error:', error));
  }, []);

  return (
    <div className={styles.leaderboard}>
      <h2 className={styles.h2}>Leaderboard</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Rank</th>
            <th className={styles.th}>Player</th>
            <th className={styles.th}>Score</th>
            <th className={styles.th}>Time</th>
          </tr>
        </thead>
        <tbody>
          {stats
            .map((player, index) => (
              <tr key={index} className={styles.tr}>
                <td className={styles.td}>{index + 1}</td>
                <td className={styles.td}>{player.user_id}</td>
                <td className={styles.td}>{player.score}</td>
                <td className={styles.td}>{player.created_at}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};
