import styles from '../styles/Footer.module.css';
import { FaDev, FaGithub, FaAws, FaYoutube } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.textContainer}>
          <h1 className={styles.title}>
            PαthMαth
          </h1>
          <p className={styles.text}>
            Created by Lucas Pao in January 2025.
          </p>
        </div>
        <div className={styles.links}>
          <a href="https://devpost.com/software/pathmath" className={styles.link} target="_blank" rel="noopener noreferrer">
            <FaDev size={30} />
          </a>
          <a href="https://github.com/lucaspingpao/path-math" className={styles.link} target="_blank" rel="noopener noreferrer">
            <FaGithub size={30} />
          </a>
          <a href="https://community.aws/content/2rd0vJMfg1g59W9c6N3QPVRDz7b/pathmath-find-the-right-path-to-practice-math" className={styles.link} target="_blank" rel="noopener noreferrer">
            <FaAws size={30} />
          </a>
          <a href="https://www.youtube.com/@paocodingtutorials2143" className={styles.link} target="_blank" rel="noopener noreferrer">
            <FaYoutube size={30} />
          </a>
        </div>
       
      </div>
    </footer>
  );
}
