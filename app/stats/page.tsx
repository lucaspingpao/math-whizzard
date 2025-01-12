"use client";

import { useEffect, useState } from 'react';
import styles from '../styles/Stats.module.css';
import Loading from '../components/Loading';

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
  {
    user_id: "alice_test",
    score: 1250,
    created_at: "2023-05-01T12:00:00Z"
  },
];

export default function Leaderboard() {
  const apiUrl = 'https://smwylkwm55.execute-api.us-east-2.amazonaws.com/default/stats';
  const [stats, setStats] = useState<Stats[]>([]);

  const formatTimeUnit = (value: number, unit: string): string => {
    return `${value} ${value === 1 ? unit : unit + 's'} ago`;
  };

  const getTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    const timeUnits = [
      { limit: 60, divisor: 1, unit: 'second' },
      { limit: 3600, divisor: 60, unit: 'minute' },
      { limit: 86400, divisor: 3600, unit: 'hour' },
      { limit: 604800, divisor: 86400, unit: 'day' },
      { limit: 2592000, divisor: 604800, unit: 'week' },
      { limit: 31536000, divisor: 2592000, unit: 'month' },
      { limit: Infinity, divisor: 31536000, unit: 'year' }
    ];

    const timeUnit = timeUnits.find(unit => diffInSeconds < unit.limit);
    if (!timeUnit) return formatTimeUnit(0, 'second');
    
    const value = Math.floor(diffInSeconds / timeUnit.divisor);
    return formatTimeUnit(value, timeUnit.unit);
  };
  
  useEffect(() => {
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        const parsedData = JSON.parse(data.body).data;
        setStats(parsedData);
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
            <th className={styles.th}>Date</th>
          </tr>
        </thead>
        <tbody>
          {stats.length > 0 ?
            stats.map((player, index) => (
              <tr key={index} className={styles.tr}>
                <td className={styles.td}>{index + 1}</td>
                <td className={styles.td}>{player.user_id}</td>
                <td className={styles.td}>{player.score}</td>
                <td className={styles.td}>{getTimeAgo(player.created_at)}</td>
              </tr>
            ))
              :
            <tr>
              <td colSpan={4} className={styles.td}>
                <Loading/>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  );
};
