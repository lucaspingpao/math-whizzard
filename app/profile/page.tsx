"use client";

import { useState, useEffect } from 'react';
import styles from '../styles/ProfileDashboard.module.css';
import { useAuthenticator } from "@aws-amplify/ui-react";
const avatarUrl = "https://d1.awsstatic.com/asset-repository/products/amazon-rds/1024px-MySQL.ff87215b43fd7292af172e2a5d9b844217262571.png"; 
import { FaPencilAlt } from 'react-icons/fa';

export default function ProfileDashboard() {
  const { user } = useAuthenticator();
  const email = user.signInDetails?.loginId;
  const [username, setUsername] = useState<string>('')
  const [gamesPlayed, setGamesPlayed] = useState<number>(0);

  const getUsername = () => {
    const apiUrl = 'https://smwylkwm55.execute-api.us-east-2.amazonaws.com/default/users';
    fetch(apiUrl, {
      method: 'GET',
    })
    .then(response => response.json())
    .then(data => {
      const u = JSON.parse(data.body).data[0][3];
        setUsername(u);
      })
    .catch(error => console.error('Error:', error));
  }

  useEffect(() => {
    getUsername();
  }, []);

  const validateUsername = (username: string): { isValid: boolean; message: string } => {
    // Username must be between 3 and 20 characters
    if (username.length < 3 || username.length > 20) {
      return {
        isValid: false,
        message: "Username must be between 3 and 20 characters"
      };
    }

    // Username can only contain letters, numbers, underscores and hyphens
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      return {
        isValid: false, 
        message: "Username can only contain letters, numbers, underscores and hyphens"
      };
    }

    return {
      isValid: true,
      message: "Valid username"
    };
  };

  const editName = () => {
    const newUsername = prompt("Enter new username:");
    
    if (newUsername) {
      const validation = validateUsername(newUsername);
      
      if (!validation.isValid) {
        alert(validation.message);
        return;
      }

      const apiUrl = 'https://smwylkwm55.execute-api.us-east-2.amazonaws.com/default/users';
      fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: String(user.userId),
          username: newUsername
        }),
      })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error('Error:', error));
      setUsername(newUsername);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Welcome back, {username}!</h1>
      <div className={styles.profileCard}>
        <div className={styles.avatarContainer}>
          <img src={avatarUrl} alt={username} className={styles.avatar} />
        </div>
        <div className={styles.info}>
          <h2 className={styles.name}>{username}</h2>
          <p className={styles.email}>{email}</p>
        </div>
        <div className={styles.profileSection}>
          <div className={styles.column1}>
            <p className={styles.statLabel}>Username:</p>
            <p className={styles.statLabel}>Email:</p>
            <p className={styles.statLabel}>Highest Score:</p>
            <p className={styles.statLabel}>Games Played:</p>
          </div>
          <div className={styles.column2}>
            <div className={styles.editButton} onClick={editName}><FaPencilAlt /></div>
          </div>
          <div className={styles.column3}>
            <p className={styles.statLabel}>{username}</p>
            <p className={styles.statLabel}>{email}</p>
            <p className={styles.statLabel}>{gamesPlayed}</p>
            <p className={styles.statLabel}>{gamesPlayed}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
