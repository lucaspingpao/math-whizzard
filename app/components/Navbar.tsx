import Link from 'next/link';
import styles from '../styles/Navbar.module.css';
import { Avatar, Menu, MenuItem, Divider } from '@aws-amplify/ui-react';
import { useAuthenticator } from '@aws-amplify/ui-react';

export default function Navbar() {
  const { signOut } = useAuthenticator();
  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContainer}>
        <Link href="/" className={styles.navLink}>Home</Link>
        <Link href="/about" className={styles.navLink}>About</Link>
        <Link href="/play" className={styles.navLink}>Play Game</Link>
        <Link href="/stats" className={styles.navLink}>Stats</Link>
        <div className={styles.menu}>
          <Menu trigger={
            <div className={styles.profilePic}>
              <Avatar />
            </div>
          }>
            <Link href="/profile">
              <MenuItem style={{width: "100%"}}>
                Profile
              </MenuItem>
            </Link>
            <Link href="/stats">
              <MenuItem style={{width: "100%"}}>
                Stats
              </MenuItem>
            </Link>
            <Link href="/profile">
              <MenuItem style={{width: "100%"}}>
                Profile
              </MenuItem>
            </Link>
            <Divider />
            <MenuItem onClick={signOut}>Log In</MenuItem>
            <MenuItem onClick={signOut}>Sign Out</MenuItem>
          </Menu>
        </div>
      </div>
    </nav>
  );
}