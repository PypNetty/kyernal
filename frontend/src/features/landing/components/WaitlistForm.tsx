import { useState } from 'react';
import type { Theme } from '../theme/landingTheme';

export default function WaitlistForm({ t }: { t: Theme }) {
  const [email, setEmail] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = () => {
    if (!email.includes('@')) return;
    // TODO: POST /waitlist { email, jobUrl } sur le backend Go
    setSent(true);
  };

  if (sent) {
    return (
      <div
        style={{
          padding: '16px 24px',
          borderRadius: '10px',
          border: '1px solid #30a46c33',
          background: '#30a46c08',
          maxWidth: '460px',
          width: '100%',
        }}
      >
        <span style={{ fontSize: '14px', color: '#30a46c', fontWeight: 500 }}>
          ✓ Demande enregistrée. On revient vers vous.
        </span>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        width: '100%',
        maxWidth: '460px',
      }}
    >
      <input
        type="url"
        value={jobUrl}
        onChange={(e) => setJobUrl(e.target.value)}
        placeholder="Lien de l'offre d'emploi (optionnel)"
        style={{
          width: '100%',
          height: '40px',
          padding: '0 16px',
          borderRadius: '7px',
          border: `1px solid ${t.inputBorder}`,
          background: t.inputBg,
          color: t.text,
          fontSize: '13px',
          outline: 'none',
          boxSizing: 'border-box',
        }}
        onFocus={(e) => {
          e.currentTarget.style.border = `1px solid ${t.textMuted}`;
        }}
        onBlur={(e) => {
          e.currentTarget.style.border = `1px solid ${t.inputBorder}`;
        }}
      />

      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="votre@email.fr"
          style={{
            flex: 1,
            height: '40px',
            padding: '0 16px',
            borderRadius: '7px',
            border: `1px solid ${t.inputBorder}`,
            background: t.inputBg,
            color: t.text,
            fontSize: '13px',
            outline: 'none',
          }}
          onFocus={(e) => {
            e.currentTarget.style.border = `1px solid ${t.textMuted}`;
          }}
          onBlur={(e) => {
            e.currentTarget.style.border = `1px solid ${t.inputBorder}`;
          }}
        />
        <button
          type="button"
          onClick={handleSubmit}
          style={{
            height: '40px',
            padding: '0 20px',
            borderRadius: '7px',
            background: t.btnPrimary,
            color: t.btnPrimaryText,
            border: 'none',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            flexShrink: 0,
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.85';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1';
          }}
        >
          Accès anticipé
        </button>
      </div>

      <span style={{ fontSize: '11px', color: t.textFaint, textAlign: 'center' }}>
        TSSR · AIS · DevOps · Linux · Réseau
      </span>
    </div>
  );
}
