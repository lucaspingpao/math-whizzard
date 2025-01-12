import styles from '../styles/Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p className={styles.text}>
          &copy; {new Date().getFullYear()} Your Company Name. All Rights Reserved.
        </p>
        <div className={styles.links}>
          <a href="#" className={styles.link}>
            Privacy Policy
          </a>
          <a href="#" className={styles.link}>
            Terms of Service
          </a>
          <a href="#" className={styles.link}>
            Contact Us
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;