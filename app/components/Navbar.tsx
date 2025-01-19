import Link from 'next/link';
import styles from '../styles/Navbar.module.css';
import { Avatar, Menu, MenuItem, Divider } from '@aws-amplify/ui-react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { StorageImage } from '@aws-amplify/ui-react-storage';

export default function Navbar() {
  const { user, signOut } = useAuthenticator();
  const avatarUrl = `picture-submissions/${user.userId}`;

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContainer}>
        <Link href="/" className={styles.navLink}>Home</Link>
        <Link href="/tutorial" className={styles.navLink}>Tutorial</Link>
        <Link href="/play" className={styles.navLink}>Play</Link>
        <Link href="/stats" className={styles.navLink}>Stats</Link>
        <div className={styles.menu}>
          <Menu trigger={
            <div className={styles.avatarContainer}>
              <StorageImage
                alt={"User"}
                path={avatarUrl}
                className={styles.avatar}
                fallbackSrc={"https://www.gravatar.com/avatar/?d=identicon"}
              />
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
            <Divider />
            <MenuItem onClick={() => alert('Already signed in!')}>Log In</MenuItem>
            <MenuItem onClick={signOut}>Sign Out</MenuItem>
          </Menu>
        </div>
      </div>
    </nav>
  );
}