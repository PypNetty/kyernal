import { Link } from '@tanstack/react-router';
import { useContext, useState, type CSSProperties, type FormEvent } from 'react';
import { LayoutCtx } from '../../arena/layout/components/Layout';
import { getFormationById } from '../data/formations';
import { useAuth } from '../hooks/useAuth';
import { useChangePassword } from '../hooks/useChangePassword';
import { useLogout } from '../hooks/useLogout';

type ProfileTheme = {
  bg: string;
  border: string;
  textMain: string;
  textMuted: string;
  cardBg: string;
  inputBg: string;
  hoverBg: string;
  btnPrimaryBg: string;
  btnPrimaryText: string;
};

function getProfileTheme(dark: boolean): ProfileTheme {
  return {
    bg: dark ? '#0e0f11' : '#ffffff',
    border: dark ? '#27282b' : '#e8e8e5',
    textMain: dark ? '#ededed' : '#111113',
    textMuted: dark ? '#8a8a93' : '#6b6b6b',
    cardBg: dark ? '#141416' : '#f7f7f9',
    inputBg: dark ? '#0e0f11' : '#ffffff',
    hoverBg: dark ? '#ffffff0a' : '#00000008',
    btnPrimaryBg: dark ? '#ededed' : '#111113',
    btnPrimaryText: dark ? '#111113' : '#fafafa',
  };
}

function Card({
  children,
  theme,
  style,
}: {
  children: React.ReactNode;
  theme: ProfileTheme;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        background: theme.cardBg,
        border: `1px solid ${theme.border}`,
        borderRadius: '10px',
        padding: '24px',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function SectionTitle({
  title,
  description,
  theme,
}: {
  title: string;
  description?: string;
  theme: ProfileTheme;
}) {
  return (
    <>
      <h2
        style={{
          margin: '0 0 4px',
          fontSize: '15px',
          fontWeight: 600,
          color: theme.textMain,
        }}
      >
        {title}
      </h2>
      {description && (
        <p style={{ margin: '0 0 20px', fontSize: '13px', color: theme.textMuted }}>
          {description}
        </p>
      )}
    </>
  );
}

function InfoRow({
  label,
  value,
  theme,
}: {
  label: string;
  value: string;
  theme: ProfileTheme;
}) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        gap: '16px',
        padding: '12px 0',
        borderBottom: `1px solid ${theme.border}`,
      }}
    >
      <span style={{ fontSize: '12px', color: theme.textMuted, flexShrink: 0 }}>
        {label}
      </span>
      <span
        style={{
          fontSize: '13px',
          fontWeight: 500,
          color: theme.textMain,
          textAlign: 'right',
        }}
      >
        {value}
      </span>
    </div>
  );
}

function PasswordField({
  id,
  label,
  value,
  onChange,
  theme,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  theme: ProfileTheme;
}) {
  return (
    <label style={{ display: 'block', marginBottom: '14px' }}>
      <span
        style={{
          display: 'block',
          marginBottom: '6px',
          fontSize: '12px',
          color: theme.textMuted,
        }}
      >
        {label}
      </span>
      <input
        id={id}
        type="password"
        autoComplete={id === 'new-password' ? 'new-password' : 'current-password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = theme.textMuted;
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = theme.border;
        }}
        style={{
          width: '100%',
          boxSizing: 'border-box',
          height: '40px',
          padding: '0 12px',
          borderRadius: '8px',
          border: `1px solid ${theme.border}`,
          background: theme.inputBg,
          color: theme.textMain,
          fontSize: '13px',
          outline: 'none',
          transition: 'border-color 0.15s',
        }}
      />
    </label>
  );
}

function ProfileButton({
  children,
  onClick,
  type = 'button',
  variant = 'secondary',
  disabled,
  theme,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  theme: ProfileTheme;
}) {
  const [hovered, setHovered] = useState(false);

  const styles: Record<'primary' | 'secondary' | 'danger', CSSProperties> = {
    primary: {
      background: theme.btnPrimaryBg,
      color: theme.btnPrimaryText,
      border: 'none',
    },
    secondary: {
      background: hovered ? theme.hoverBg : 'transparent',
      color: theme.textMain,
      border: `1px solid ${theme.border}`,
    },
    danger: {
      background: hovered ? 'rgba(239,68,68,0.08)' : 'transparent',
      color: '#ef4444',
      border: `1px solid ${theme.border}`,
    },
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '40px',
        padding: '0 16px',
        borderRadius: '8px',
        fontSize: '13px',
        fontWeight: 500,
        cursor: disabled ? 'wait' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        transition: 'background 0.15s, opacity 0.15s',
        ...styles[variant],
      }}
    >
      {children}
    </button>
  );
}

function ProfileLinkButton({
  to,
  search,
  children,
  theme,
}: {
  to: string;
  search?: Record<string, string>;
  children: React.ReactNode;
  theme: ProfileTheme;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      to={to}
      search={search}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '40px',
        padding: '0 16px',
        borderRadius: '8px',
        border: `1px solid ${theme.border}`,
        background: hovered ? theme.hoverBg : 'transparent',
        color: theme.textMain,
        fontSize: '13px',
        fontWeight: 500,
        textDecoration: 'none',
        boxSizing: 'border-box',
        transition: 'background 0.15s',
      }}
    >
      {children}
    </Link>
  );
}

export default function ProfilePage() {
  const { dark } = useContext(LayoutCtx);
  const theme = getProfileTheme(dark);
  const { data: session } = useAuth();
  const logoutMutation = useLogout();
  const changePasswordMutation = useChangePassword();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const user = session?.user;
  const email = session?.email ?? '—';
  const formation = session?.formationId
    ? getFormationById(session.formationId)
    : undefined;
  const ccps = formation?.ccps.join(' · ') ?? '—';

  const passwordError =
    changePasswordMutation.error instanceof Error
      ? changePasswordMutation.error.message
      : changePasswordMutation.isError
        ? 'Impossible de modifier le mot de passe.'
        : null;

  const handlePasswordSubmit = (e: FormEvent) => {
    e.preventDefault();
    setPasswordSuccess(false);
    changePasswordMutation.mutate(
      { currentPassword, newPassword, confirmPassword },
      {
        onSuccess: () => {
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
          setPasswordSuccess(true);
        },
      },
    );
  };

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
      <div style={{ maxWidth: '560px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <h1
            style={{
              margin: '0 0 4px',
              fontSize: '20px',
              fontWeight: 600,
              color: theme.textMain,
            }}
          >
            Mon profil
          </h1>
          <p style={{ margin: 0, fontSize: '13px', color: theme.textMuted }}>
            Informations de votre compte apprenant
          </p>
        </div>

        <Card theme={theme}>
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
                  color: theme.textMain,
                  marginBottom: '4px',
                }}
              >
                {user.name}
              </div>
              <div style={{ fontSize: '12px', color: theme.textMuted }}>
                {user.role}
              </div>
            </div>
          </div>

          <InfoRow label="E-mail" value={email} theme={theme} />
          <InfoRow
            label="Formation"
            value={user.organization ?? '—'}
            theme={theme}
          />
          {session?.learningGoal && (
            <InfoRow label="Objectif" value={session.learningGoal} theme={theme} />
          )}
          <InfoRow label="Blocs visés" value={ccps} theme={theme} />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              gap: '16px',
              padding: '12px 0 0',
            }}
          >
            <span style={{ fontSize: '12px', color: theme.textMuted }}>Statut</span>
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
        </Card>

        <Card theme={theme}>
          <SectionTitle
            title="Mot de passe"
            description="Modifiez le mot de passe utilisé pour vous connecter."
            theme={theme}
          />

          <form onSubmit={handlePasswordSubmit}>
            <PasswordField
              id="current-password"
              label="Mot de passe actuel"
              value={currentPassword}
              onChange={setCurrentPassword}
              theme={theme}
            />
            <PasswordField
              id="new-password"
              label="Nouveau mot de passe"
              value={newPassword}
              onChange={setNewPassword}
              theme={theme}
            />
            <PasswordField
              id="confirm-password"
              label="Confirmer le nouveau mot de passe"
              value={confirmPassword}
              onChange={setConfirmPassword}
              theme={theme}
            />

            {passwordError && (
              <p style={{ margin: '0 0 12px', fontSize: '12px', color: '#ef4444' }}>
                {passwordError}
              </p>
            )}

            {passwordSuccess && (
              <p style={{ margin: '0 0 12px', fontSize: '12px', color: '#30a46c' }}>
                Mot de passe mis à jour.
              </p>
            )}

            <ProfileButton
              type="submit"
              variant="primary"
              disabled={changePasswordMutation.isPending}
              theme={theme}
            >
              {changePasswordMutation.isPending
                ? 'Enregistrement…'
                : 'Enregistrer le mot de passe'}
            </ProfileButton>
          </form>
        </Card>

        <Card theme={theme}>
          <SectionTitle
            title="Compte"
            description="Gérez votre parcours et votre session."
            theme={theme}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <ProfileLinkButton
              to="/formation"
              search={{ redirect: '/profil', change: '1' }}
              theme={theme}
            >
              Changer de formation
            </ProfileLinkButton>

            <ProfileButton
              variant="danger"
              disabled={logoutMutation.isPending}
              onClick={() => logoutMutation.mutate()}
              theme={theme}
            >
              {logoutMutation.isPending ? 'Déconnexion…' : 'Se déconnecter'}
            </ProfileButton>
          </div>
        </Card>
      </div>
    </div>
  );
}
