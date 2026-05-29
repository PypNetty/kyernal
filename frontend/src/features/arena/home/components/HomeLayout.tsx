import { Link, Outlet } from '@tanstack/react-router';
import KyernalLogo from '../../../landing/components/KyernalLogo';
import { useAuth, useLogout } from '../../../auth';
import { useAppTheme } from '../../layout/context/AppTheme';

export default function HomeLayout() {
  const { dark, toggleDark } = useAppTheme();
  const { data: session } = useAuth();
  const logoutMutation = useLogout();

  const bg = dark ? '#09090b' : '#fafafa';
  const border = dark ? '#27282b' : '#e8e8e5';
  const textMain = dark ? '#ededed' : '#111113';
  const textMuted = dark ? '#8a8a93' : '#6b6b6b';

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: bg,
        color: textMain,
        fontFamily: '-apple-system, BlinkMacSystemFont, Inter, sans-serif',
      }}
    >
      <header
        style={{
          height: '48px',
          display: 'flex',
          alignItems: 'center',
          padding: '0 20px',
          gap: '16px',
          borderBottom: `1px solid ${border}`,
          flexShrink: 0,
        }}
      >
        <Link
          to="/home"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            textDecoration: 'none',
            color: textMain,
          }}
        >
          <KyernalLogo size={18} dark={!dark} />
          <span style={{ fontSize: '13px', fontWeight: 600 }}>Kyernal</span>
        </Link>

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Link
            to="/tickets"
            style={{
              fontSize: '12px',
              fontWeight: 600,
              padding: '6px 12px',
              borderRadius: '6px',
              background: '#0055e5',
              color: '#ffffff',
              textDecoration: 'none',
            }}
          >
            Entrer dans le lab
          </Link>

          <Link
            to="/profil"
            style={{
              fontSize: '12px',
              fontWeight: 500,
              padding: '6px 10px',
              borderRadius: '6px',
              color: textMuted,
              textDecoration: 'none',
            }}
          >
            {session?.user?.name ?? 'Profil'}
          </Link>

          <button
            type="button"
            onClick={() => toggleDark()}
            title={dark ? 'Mode clair' : 'Mode sombre'}
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              border: `1px solid ${border}`,
              background: 'transparent',
              color: textMuted,
              cursor: 'pointer',
              fontSize: '13px',
            }}
          >
            {dark ? '☀' : '◐'}
          </button>

          <button
            type="button"
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
            style={{
              fontSize: '12px',
              fontWeight: 500,
              padding: '6px 10px',
              borderRadius: '6px',
              border: `1px solid ${border}`,
              background: 'transparent',
              color: textMuted,
              cursor: logoutMutation.isPending ? 'wait' : 'pointer',
            }}
          >
            Déconnexion
          </button>
        </div>
      </header>

      <main style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <Outlet />
      </main>
    </div>
  );
}
