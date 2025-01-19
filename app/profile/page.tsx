"use client";

import { useState, useEffect, use } from 'react';
import styles from '../styles/ProfileDashboard.module.css';
import { useAuthenticator } from "@aws-amplify/ui-react";
import { FaPencilAlt } from 'react-icons/fa';
import { uploadData } from 'aws-amplify/storage';
import { StorageImage } from '@aws-amplify/ui-react-storage';

export default function ProfileDashboard() {
  const { user } = useAuthenticator();
  const email = user.signInDetails?.loginId;
  const [username, setUsername] = useState<string>('not_found');
  const [gamesPlayed, setGamesPlayed] = useState<number>(0);
  const avatarUrl = `picture-submissions/${user.userId}`;
  const [file, setFile] = useState<File | null>(null);
  
  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event?.target?.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      try {
        await uploadData({
          path: avatarUrl,
          data: selectedFile,
        });
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  const getUsername = () => {
    const apiUrl = 'https://smwylkwm55.execute-api.us-east-2.amazonaws.com/default/users';
    fetch(apiUrl, {
      method: 'GET',
    })
    .then(response => response.json())
    .then(data => {
      const u = JSON.parse(data.body).data.find(([first]: string[]) => first === user.userId)?.[1];
      if (u) {
        setUsername(u);
      } else {
        editName();
      }
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
          <label htmlFor="fileInput" className={styles.avatarLabel}>
            {file ? (
              <img 
                src={URL.createObjectURL(file)} 
                alt={username || "User"} 
                className={styles.avatar}
              />
            ) : (
              <StorageImage
                alt={username || "User"}
                path={avatarUrl} 
                className={styles.avatar}
                fallbackSrc={"https://www.gravatar.com/avatar/?d=identicon"}
              />
            )}
          </label>
          <input
            type="file"
            id="fileInput"
            style={{ display: "none" }}
            onChange={handleChange}
          />
        </div>
        <div className={styles.info}>
          <h2 className={styles.name}>{username}</h2>
        </div>
        <div className={styles.profileSection}>
          <div className={styles.column1}>
            <p className={styles.statLabel}>Username:</p>
            <p className={styles.statLabel}>Email:</p>
          </div>
          <div className={styles.column2}>
            <div className={styles.editButton} onClick={editName}><FaPencilAlt /></div>
          </div>
          <div className={styles.column3}>
            <p className={styles.statLabel}>{username}</p>
            <p className={styles.statLabel}>{email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
