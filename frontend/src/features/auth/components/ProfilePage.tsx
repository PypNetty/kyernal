import { useContext } from 'react';
import { LayoutCtx } from '../../arena/layout/components/Layout';
import { APPRENANT_CCPS } from '../../arena/resources/data/resourcesData';
import { useAuth } from '../hooks/useAuth';
import { useLogout } from '../hooks/useLogout';

function InfoRow({
  label,
  value,
  dark,
  border,
  textMain,
  textMuted,
}: {
  label: string;
  value: string;
  dark: boolean;
  border: string;
  textMain: string;
  textMuted: string;
}) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        gap: '16px',
        padding: '12px 0',
        borderBottom: `1px solid ${border}`,
      }}
    >
      <span style={{ fontSize: '12px', color: textMuted, flexShrink: 0 }}>
        {label}
      </span>
      <span
        style={{
          fontSize: '13px',
          fontWeight: 500,
          color: textMain,
          textAlign: 'right',
        }}
      >
        {value}
      </span>
    </div>
  );
}

export default function ProfilePage() {
  const { dark } = useContext(LayoutCtx);
  const { data: session } = useAuth();
  const logoutMutation = useLogout();

  const user = session?.user;
  const email = session?.email ?? '—';

  const bg = dark ? '#0e0f11' : '#ffffff';
  const border = dark ? '#27282b' : '#e8e8e5';
  const textMain = dark ? '#ededed' : '#111113';
  const textMuted = dark ? '#8a8a93' : '#6b6b6b';
  const cardBg = dark ? '#141416' : '#f7f7f9';

  if (!user) return null;

  return (
    <div
      style={{
        height: '100%',
        overflowY: 'auto',
        padding: '32px 40px',
        fontFamily: '-apple-system, BlinkMacSystemFont, Inter, sans-serif',
      }}
    >
      <div style={{ maxWidth: '560px' }}>
        <h1
          style={{
            margin: '0 0 4px',
            fontSize: '20px',
            fontWeight: 600,
            color: textMain,
          }}
        >
          Mon profil
        </h1>
        <p style={{ margin: '0 0 28px', fontSize: '13px', color: textMuted }}>
          Informations de votre compte apprenant
        </p>

        <div
          style={{
            background: cardBg,
            border: `1px solid ${border}`,
            borderRadius: '10px',
            padding: '24px',
            marginBottom: '20px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '24px',
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: '#30a46c',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '18px',
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {user.initials}
            </div>
            <div>
              <div
                style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: textMain,
                  marginBottom: '4px',
                }}
              >
                {user.name}
              </div>
              <div style={{ fontSize: '12px', color: textMuted }}>
                {user.role}
              </div>
            </div>
          </div>

          <InfoRow
            label="E-mail"
            value={email}
            dark={dark}
            border={border}
            textMain={textMain}
            textMuted={textMuted}
          />
          <InfoRow
            label="Organisation"
            value={user.organization ?? '—'}
            dark={dark}
            border={border}
            textMain={textMain}
            textMuted={textMuted}
          />
          <InfoRow
            label="Parcours"
            value={APPRENANT_CCPS.join(' · ')}
            dark={dark}
            border={border}
            textMain={textMain}
            textMuted={textMuted}
          />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              gap: '16px',
              padding: '12px 0 0',
            }}
          >
            <span style={{ fontSize: '12px', color: textMuted }}>Statut</span>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: '#30a46c',
                background: dark ? 'rgba(48,164,108,0.15)' : 'rgba(48,164,108,0.12)',
                padding: '3px 8px',
                borderRadius: '4px',
              }}
            >
              Actif
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => logoutMutation.mutate()}
          disabled={logoutMutation.isPending}
          style={{
            padding: '10px 16px',
            borderRadius: '8px',
            border: `1px solid ${border}`,
            background: bg,
            color: '#ef4444',
            fontSize: '13px',
            fontWeight: 500,
            cursor: logoutMutation.isPending ? 'wait' : 'pointer',
            opacity: logoutMutation.isPending ? 0.7 : 1,
          }}
        >
          {logoutMutation.isPending ? 'Déconnexion…' : 'Se déconnecter'}
        </button>
      </div>
    </div>
  );
}
