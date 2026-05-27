import React, { useState } from 'react';
import { Link } from '@tanstack/react-router';

const KyernalLogo = ({
  size = 28,
  dark = false,
}: {
  size?: number;
  dark?: boolean;
}) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <rect
      width="32"
      height="32"
      rx="8"
      fill={dark ? '#f5f0eb' : '#141416'}
      stroke={dark ? '#e8e0d5' : '#27272a'}
      strokeWidth="1"
    />
    <path
      d="M12 9V23"
      stroke={dark ? '#1c1917' : '#f4f4f5'}
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <path
      d="M21 9L12 16L21 23"
      stroke={dark ? '#1c1917' : '#f4f4f5'}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="21" cy="9" r="2.5" fill="#30a46c" />
  </svg>
);

const THEMES = {
  dark: {
    bg: '#09090b',
    bgCard: '#141416',
    border: '#27272a',
    borderMuted: 'rgba(24,24,27,0.5)',
    text: '#ffffff',
    textSub: '#a1a1aa',
    textMuted: '#71717a',
    textFaint: '#3f3f46',
    inputBg: '#141416',
    inputBorder: '#27272a',
    navBg: 'rgba(9,9,11,0.7)',
    btnPrimary: '#f4f4f5',
    btnPrimaryText: '#09090b',
    btnSecondaryBg: '#141416',
    btnSecondaryText: '#e4e4e7',
    badgeBg: 'rgba(255,255,255,0.03)',
    badgeBorder: 'rgba(255,255,255,0.1)',
    gridColor: '#18181b',
    haloBg: 'rgba(255,255,255,0.03)',
    toggleBg: '#141416',
    toggleBorder: '#27272a',
    toggleActiveBg: '#27272a',
    toggleActiveText: '#f4f4f5',
    toggleInactiveText: '#71717a',
    tagBg: '#141416',
    tagBorder: '#27272a',
    tagText: '#52525b',
    textareaBg: '#141416',
    textareaText: '#f4f4f5',
    textareaPlaceholder: '#52525b',
  },
  light: {
    bg: '#f5f0eb',
    bgCard: '#ede8e0',
    border: '#d6cfc4',
    borderMuted: 'rgba(214,207,196,0.6)',
    text: '#1c1917',
    textSub: '#57534e',
    textMuted: '#78716c',
    textFaint: '#a8a29e',
    inputBg: '#faf7f2',
    inputBorder: '#d6cfc4',
    navBg: 'rgba(245,240,235,0.8)',
    btnPrimary: '#1c1917',
    btnPrimaryText: '#faf7f2',
    btnSecondaryBg: '#ede8e0',
    btnSecondaryText: '#1c1917',
    badgeBg: 'rgba(28,25,23,0.04)',
    badgeBorder: 'rgba(28,25,23,0.12)',
    gridColor: '#e8e0d5',
    haloBg: 'rgba(28,25,23,0.015)',
    toggleBg: '#ede8e0',
    toggleBorder: '#d6cfc4',
    toggleActiveBg: '#1c1917',
    toggleActiveText: '#faf7f2',
    toggleInactiveText: '#78716c',
    tagBg: '#ede8e0',
    tagBorder: '#d6cfc4',
    tagText: '#78716c',
    textareaBg: '#faf7f2',
    textareaText: '#1c1917',
    textareaPlaceholder: '#a8a29e',
  },
};

type Theme = typeof THEMES.dark;

function Waitlist({ t }: { t: Theme }) {
  const [email, setEmail] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = () => {
    if (!email.includes('@')) return;
    // TODO: POST /waitlist { email, jobUrl } sur le backend Go
    setSent(true);
  };

  if (sent)
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
      {/* Champ offre d'emploi */}
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
        onFocus={(e) =>
          (e.currentTarget.style.border = `1px solid ${t.textMuted}`)
        }
        onBlur={(e) =>
          (e.currentTarget.style.border = `1px solid ${t.inputBorder}`)
        }
      />

      {/* Email + bouton */}
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
          onFocus={(e) =>
            (e.currentTarget.style.border = `1px solid ${t.textMuted}`)
          }
          onBlur={(e) =>
            (e.currentTarget.style.border = `1px solid ${t.inputBorder}`)
          }
        />
        <button
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
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          Accès anticipé
        </button>
      </div>

      <span
        style={{ fontSize: '11px', color: t.textFaint, textAlign: 'center' }}
      >
        TSSR · AIS · DevOps · Linux · Réseau
      </span>
    </div>
  );
}

export default function Landing() {
  const [mode, setMode] = useState<'dark' | 'light'>('light');
  const t = THEMES[mode];

  return (
    <div
      style={{
        minHeight: '100vh',
        background: t.bg,
        color: t.text,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        position: 'relative',
        overflow: 'hidden',
        transition: 'background 0.3s, color 0.3s',
      }}
    >
      {/* Grille de fond */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `linear-gradient(${t.gridColor} 1px, transparent 1px), linear-gradient(90deg, ${t.gridColor} 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          opacity: 0.4,
          zIndex: 0,
          transition: 'opacity 0.3s',
        }}
      />
      {/* Halo */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '60vw',
          height: '50vh',
          background: `radial-gradient(ellipse, ${t.haloBg} 0%, transparent 70%)`,
          filter: 'blur(40px)',
          zIndex: 0,
        }}
      />

      {/* NAV */}
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          height: '56px',
          borderBottom: `1px solid ${t.borderMuted}`,
          background: t.navBg,
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 28px',
          justifyContent: 'space-between',
          transition: 'background 0.3s',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <KyernalLogo size={20} dark={mode === 'light'} />
          <span
            style={{
              fontSize: '14px',
              fontWeight: 600,
              letterSpacing: '-0.2px',
              color: t.text,
            }}
          >
            Kyernal
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Toggle thème */}
          <button
            onClick={() => setMode((m) => (m === 'dark' ? 'light' : 'dark'))}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              border: `1px solid ${t.border}`,
              background: t.bgCard,
              color: t.textMuted,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
            }}
            title={mode === 'dark' ? 'Mode clair' : 'Mode sombre'}
          >
            {mode === 'dark' ? '☀' : '◐'}
          </button>
          <Link to="/login" style={{ textDecoration: 'none' }}>
            <button
              style={{
                height: '32px',
                padding: '0 16px',
                borderRadius: '6px',
                border: `1px solid ${t.border}`,
                background: t.btnSecondaryBg,
                color: t.btnSecondaryText,
                fontSize: '12px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              Espace apprenant
            </button>
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px 24px',
          textAlign: 'center',
        }}
      >
        {/* Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '100px',
            background: t.badgeBg,
            border: `1px solid ${t.badgeBorder}`,
            fontSize: '11px',
            color: t.textSub,
            marginBottom: '36px',
            backdropFilter: 'blur(10px)',
          }}
        >
          <div
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#30a46c',
              boxShadow: '0 0 8px #30a46c',
            }}
          />
          Simulation d'infrastructure · Accès anticipé
        </div>

        {/* Titre principal */}
        <h1
          style={{
            fontSize: 'clamp(38px, 6vw, 66px)',
            fontWeight: 700,
            letterSpacing: '-2.5px',
            lineHeight: 1.02,
            margin: '0 0 20px 0',
            color: t.text,
            maxWidth: '720px',
          }}
        >
          Ne postulez plus à l'aveugle.
          <br />
          <span style={{ color: t.textMuted }}>Prouvez-le.</span>
        </h1>

        {/* Sous-titre */}
        <p
          style={{
            fontSize: '16px',
            color: t.textSub,
            lineHeight: 1.65,
            margin: '0 0 16px 0',
            maxWidth: '500px',
          }}
        >
          Klixy analyse l'offre d'emploi de vos rêves.
        </p>
        <p
          style={{
            fontSize: '16px',
            color: t.textMuted,
            lineHeight: 1.65,
            margin: '0 0 52px 0',
            maxWidth: '500px',
          }}
        >
          Kyernal génère l'infrastructure exacte pour vous tester avant
          l'entretien.
        </p>

        <Waitlist t={t} />
      </div>

      {/* FOOTER */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          padding: '18px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: `1px solid ${t.borderMuted}`,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            opacity: 0.6,
          }}
        >
          <KyernalLogo size={13} dark={mode === 'light'} />
          <span
            style={{ fontSize: '11px', color: t.textMuted, fontWeight: 500 }}
          >
            Kyernal
          </span>
        </div>
        <span
          style={{
            fontSize: '10px',
            color: t.textFaint,
            fontFamily: 'monospace',
          }}
        >
          France · RGPD · 2026
        </span>
      </div>
    </div>
  );
}
