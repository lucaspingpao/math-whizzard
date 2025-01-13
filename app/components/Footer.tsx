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
            <FaDev size={24} />
          </a>
          <a href="https://github.com/lucaspingpao/path-math" className={styles.link} target="_blank" rel="noopener noreferrer">
            <FaGithub size={24} />
          </a>
          <a href="#" className={styles.link} target="_blank" rel="noopener noreferrer">
            <FaAws size={24} />
          </a>
          <a href="#" className={styles.link} target="_blank" rel="noopener noreferrer">
            <FaYoutube size={24} />
          </a>
        </div>
       
      </div>
    </footer>
  );
}
