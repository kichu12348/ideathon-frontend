import { Link } from 'react-router-dom';
import styles from './Header.module.css';

export const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link to="/">Ideathon Admin</Link>
      </div>
      <nav className={styles.nav}>
        <Link to="/">Teams</Link>
        <Link to="/redirects">Redirects</Link>
      </nav>
    </header>
  );
};
