import { Link, Outlet } from '@tanstack/react-router';
import { useAuth } from '../../../auth';
import { useAppTheme } from '../../layout/context/AppTheme';
import styles from './Home.module.css';

function ThemeIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

function BrandMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M12 9V23" stroke="#f4f4f5" strokeWidth="2.5" strokeLinecap="round" />
      <path
        d="M21 9L12 16L21 23"
        stroke="#f4f4f5"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="21" cy="9" r="2.5" fill="#35b27b" />
    </svg>
  );
}

export default function HomeLayout() {
  const { dark, toggleDark } = useAppTheme();
  const { data: session } = useAuth();

  const orgLabel =
    session?.user?.organization?.split(' ')[0] ??
    session?.user?.role?.split(' ')[0] ??
    'Kyernal';
  const initials = session?.user?.initials ?? '?';

  return (
    <div className={`${styles.homeRoot} ${dark ? '' : styles.homeRootLight}`}>
      <header className={`${styles.header} ${styles.reveal} ${styles.d1}`}>
        <Link to="/home" className={styles.brand}>
          <span className={styles.brandMark}>
            <BrandMark />
          </span>
          <span className={styles.brandName}>Kyernal</span>
        </Link>

        <div className={styles.topRight}>
          <span className={styles.org}>{orgLabel}</span>
          <button
            type="button"
            className={styles.iconBtn}
            onClick={() => toggleDark()}
            title={dark ? 'Mode clair' : 'Mode sombre'}
            aria-label={dark ? 'Activer le mode clair' : 'Activer le mode sombre'}
          >
            <ThemeIcon />
          </button>
          <Link to="/profil" className={styles.avatar} title={session?.user?.name ?? 'Profil'}>
            {initials}
          </Link>
        </div>
      </header>

      <Outlet />
    </div>
  );
}
