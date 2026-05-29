import { useContext, useEffect, useState, type CSSProperties, type FormEvent } from 'react';
import { useRouterState } from '@tanstack/react-router';
import { LayoutCtx } from '../../arena/layout/components/Layout';
import { FORMATIONS, getFormationById } from '../data/formations';
import { getPresenceStatusMeta } from '../data/profileConfig';
import { DndToggleIcon, PresenceStatusIcon } from './PresenceStatusIcon';
import { useAuth } from '../hooks/useAuth';
import { useChangePassword } from '../hooks/useChangePassword';
import { useLogout } from '../hooks/useLogout';
import { useSetDnd } from '../hooks/useSetDnd';
import { useUpdateProfile } from '../hooks/useUpdateProfile';
import { getPresenceActivityFromRoute } from '../lib/presenceStatus';
import type { PresenceStatus } from '../types';

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

function TextInput({
  value,
  onChange,
  placeholder,
  theme,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  theme: ProfileTheme;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
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
      }}
    />
  );
}

function FieldLabel({
  label,
  theme,
  children,
}: {
  label: string;
  theme: ProfileTheme;
  children: React.ReactNode;
}) {
  return (
    <label style={{ display: 'block', marginBottom: '16px' }}>
      <span
        style={{
          display: 'block',
          marginBottom: '8px',
          fontSize: '12px',
          color: theme.textMuted,
        }}
      >
        {label}
      </span>
      {children}
    </label>
  );
}

function StatusBadge({
  status,
  dark,
}: {
  status: PresenceStatus;
  dark: boolean;
}) {
  const meta = getPresenceStatusMeta(status);
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        fontSize: '11px',
        fontWeight: 600,
        color: meta.color,
        background: dark ? meta.background : meta.background.replace('0.12', '0.18'),
        padding: '3px 8px',
        borderRadius: '4px',
      }}
    >
      <span style={{ display: 'flex', lineHeight: 0 }} aria-hidden>
        <PresenceStatusIcon status={status} />
      </span>
      {meta.label}
    </span>
  );
}

function DndIconButton({
  active,
  onClick,
  disabled,
  theme,
}: {
  active: boolean;
  onClick: () => void;
  disabled?: boolean;
  theme: ProfileTheme;
}) {
  const meta = getPresenceStatusMeta('dnd');

  return (
    <button
      type="button"
      title={active ? 'Désactiver ne pas déranger' : 'Ne pas déranger'}
      aria-label={active ? 'Désactiver ne pas déranger' : 'Activer ne pas déranger'}
      aria-pressed={active}
      onClick={onClick}
      disabled={disabled}
      style={{
        width: '26px',
        height: '26px',
        padding: 0,
        borderRadius: '6px',
        border: `1px solid ${active ? meta.color : theme.border}`,
        background: active ? meta.background : 'transparent',
        color: active ? meta.color : theme.textMuted,
        cursor: disabled ? 'wait' : 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: disabled ? 0.6 : 1,
        flexShrink: 0,
      }}
    >
      <DndToggleIcon />
    </button>
  );
}

function SelectInput({
  value,
  onChange,
  theme,
  children,
}: {
  value: string;
  onChange: (value: string) => void;
  theme: ProfileTheme;
  children: React.ReactNode;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: '100%',
        height: '40px',
        padding: '0 12px',
        borderRadius: '8px',
        border: `1px solid ${theme.border}`,
        background: theme.inputBg,
        color: theme.textMain,
        fontSize: '13px',
        outline: 'none',
        boxSizing: 'border-box',
      }}
    >
      {children}
    </select>
  );
}

function TogglePill({
  label,
  selected,
  onClick,
  theme,
  accent,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  theme: ProfileTheme;
  accent?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        height: '26px',
        padding: '0 8px',
        borderRadius: '5px',
        border: `1px solid ${selected ? (accent ?? theme.textMain) : theme.border}`,
        background: selected
          ? accent
            ? `${accent}22`
            : theme.hoverBg
          : 'transparent',
        color: selected ? theme.textMain : theme.textMuted,
        fontSize: '11px',
        fontWeight: selected ? 600 : 500,
        cursor: 'pointer',
        transition: 'border-color 0.15s, background 0.15s',
      }}
    >
      {label}
    </button>
  );
}

export default function ProfilePage() {
  const { dark, vmHost, showCourse } = useContext(LayoutCtx);
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const theme = getProfileTheme(dark);
  const { data: session } = useAuth();
  const logoutMutation = useLogout();
  const changePasswordMutation = useChangePassword();
  const updateProfileMutation = useUpdateProfile();
  const setDndMutation = useSetDnd();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const [formationId, setFormationId] = useState('');
  const [targetCcps, setTargetCcps] = useState<string[]>([]);
  const [learningGoal, setLearningGoal] = useState('');
  const [parcoursSuccess, setParcoursSuccess] = useState(false);

  const user = session?.user;
  const email = session?.email ?? '—';
  const currentStatus = session?.presenceStatus ?? 'actif';
  const currentStatusMeta = getPresenceStatusMeta(currentStatus);
  const dndEnabled = session?.dndEnabled ?? false;
  const routeActivity = getPresenceActivityFromRoute(pathname);
  const selectedFormation = formationId ? getFormationById(formationId) : undefined;
  const availableCcps = selectedFormation?.ccps ?? [];

  useEffect(() => {
    if (!session?.formationId) return;
    const formation = getFormationById(session.formationId);
    if (!formation) return;
    setFormationId(session.formationId);
    setTargetCcps(session.targetCcps ?? formation.ccps);
    setLearningGoal(session.learningGoal ?? '');
    setParcoursSuccess(false);
  }, [session]);

  const passwordError =
    changePasswordMutation.error instanceof Error
      ? changePasswordMutation.error.message
      : changePasswordMutation.isError
        ? 'Impossible de modifier le mot de passe.'
        : null;

  const parcoursError =
    updateProfileMutation.error instanceof Error
      ? updateProfileMutation.error.message
      : updateProfileMutation.isError
        ? 'Impossible de mettre à jour le parcours.'
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

  const handleFormationChange = (nextFormationId: string) => {
    setFormationId(nextFormationId);
    const nextFormation = getFormationById(nextFormationId);
    if (nextFormation) {
      setTargetCcps([...nextFormation.ccps]);
    }
  };

  const toggleCcp = (ccp: string) => {
    setTargetCcps((prev) => {
      if (prev.includes(ccp)) {
        if (prev.length <= 1) return prev;
        return prev.filter((item) => item !== ccp);
      }
      return [...prev, ccp].sort(
        (a, b) => availableCcps.indexOf(a) - availableCcps.indexOf(b),
      );
    });
  };

  const handleParcoursSubmit = (e: FormEvent) => {
    e.preventDefault();
    setParcoursSuccess(false);
    updateProfileMutation.mutate(
      {
        formationId,
        targetCcps,
        learningGoal: learningGoal.trim() || undefined,
      },
      { onSuccess: () => setParcoursSuccess(true) },
    );
  };

  const toggleDnd = () => {
    setDndMutation.mutate({
      enabled: !dndEnabled,
      activity: {
        vmActive: Boolean(vmHost),
        readingContent: showCourse || routeActivity.readingContent,
        workingOnTicket: routeActivity.workingOnTicket,
      },
    });
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
          <div style={{ padding: '12px 0 0' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '16px',
              }}
            >
              <span style={{ fontSize: '12px', color: theme.textMuted }}>Statut</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <StatusBadge status={currentStatus} dark={dark} />
                <DndIconButton
                  active={dndEnabled}
                  onClick={toggleDnd}
                  disabled={setDndMutation.isPending}
                  theme={theme}
                />
              </div>
            </div>
            <p
              style={{
                margin: '6px 0 0',
                fontSize: '11px',
                color: theme.textMuted,
                textAlign: 'right',
              }}
            >
              {currentStatusMeta.description} · mis à jour automatiquement
            </p>
          </div>
        </Card>

        <Card theme={theme}>
          <SectionTitle
            title="Parcours"
            description="Formation et blocs visés."
            theme={theme}
          />

          <form onSubmit={handleParcoursSubmit}>
            <FieldLabel label="Formation" theme={theme}>
              <SelectInput
                value={formationId}
                onChange={handleFormationChange}
                theme={theme}
              >
                {FORMATIONS.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </SelectInput>
            </FieldLabel>

            <FieldLabel label="Blocs visés" theme={theme}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {availableCcps.map((ccp) => (
                  <TogglePill
                    key={ccp}
                    label={ccp}
                    selected={targetCcps.includes(ccp)}
                    onClick={() => toggleCcp(ccp)}
                    theme={theme}
                    accent={selectedFormation?.accent}
                  />
                ))}
              </div>
            </FieldLabel>

            <FieldLabel label="Objectif (optionnel)" theme={theme}>
              <TextInput
                value={learningGoal}
                onChange={setLearningGoal}
                placeholder="Ex. Valider le CCP2 avant la fin du trimestre"
                theme={theme}
              />
            </FieldLabel>

            {parcoursError && (
              <p style={{ margin: '0 0 12px', fontSize: '12px', color: '#ef4444' }}>
                {parcoursError}
              </p>
            )}

            {parcoursSuccess && (
              <p style={{ margin: '0 0 12px', fontSize: '12px', color: '#30a46c' }}>
                Parcours mis à jour.
              </p>
            )}

            <ProfileButton
              type="submit"
              variant="primary"
              disabled={updateProfileMutation.isPending || !formationId}
              theme={theme}
            >
              {updateProfileMutation.isPending
                ? 'Enregistrement…'
                : 'Enregistrer le parcours'}
            </ProfileButton>
          </form>
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
            description="Déconnectez-vous de votre session."
            theme={theme}
          />

          <ProfileButton
            variant="danger"
            disabled={logoutMutation.isPending}
            onClick={() => logoutMutation.mutate()}
            theme={theme}
          >
            {logoutMutation.isPending ? 'Déconnexion…' : 'Se déconnecter'}
          </ProfileButton>
        </Card>
      </div>
    </div>
  );
}
