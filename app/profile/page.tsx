
// ProfileDashboard component displays user profile information and stats
import { FC } from 'react';
import styles from '../styles/ProfileDashboard.module.css';

interface ProfileDashboardProps {
  name: string;
  title: string;
  stats: {
    followers: number;
    following: number;
    posts: number;
  };
  avatarUrl: string;
}

// Mock data for testing/development
const mockProfileData: ProfileDashboardProps = {
  name: "Jane Smith",
  title: "Senior Software Engineer",
  stats: {
    followers: 1234,
    following: 567,
    posts: 89
  },
  avatarUrl: "https://example.com/avatar.jpg"
};

const { name, title, stats, avatarUrl } = mockProfileData;

export default function ProfileDashboard() {
  return (
    <div className={styles.container}>
      <div className={styles.profileCard}>
        <div className={styles.avatarContainer}>
          <img src={avatarUrl} alt={name} className={styles.avatar} />
        </div>
        <div className={styles.info}>
          <h2 className={styles.name}>{name}</h2>
          <p className={styles.title}>{title}</p>
        </div>
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{stats.followers}</span>
            <span className={styles.statLabel}>Followers</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{stats.following}</span>
            <span className={styles.statLabel}>Following</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{stats.posts}</span>
            <span className={styles.statLabel}>Posts</span>
          </div>
        </div>
      </div>
    </div>
  );
};
