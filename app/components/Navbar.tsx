import Link from 'next/link';
import styles from '../styles/Navbar.module.css';
import { Avatar } from '@aws-amplify/ui-react';

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContainer}>
        <Link href="/" className={styles.navLink}>Home</Link>
        <Link href="/tutorial" className={styles.navLink}>Tutorial</Link>
        <Link href="/play" className={styles.navLink}>Play</Link>
        <Link href="/stats" className={styles.navLink}>Stats</Link>
        <div className={styles.avatarContainer}>
          <Avatar
            alt={"User"}
            className={styles.avatar}
          />
        </div>
      </div>
    </nav>
  );
}