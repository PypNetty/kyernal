import { Link } from '@tanstack/react-router';
import { useState } from 'react';
import KyernalLogo from './KyernalLogo';
import { THEMES } from '../theme/landingTheme';

export default function Landing() {
  const [mode, setMode] = useState<'dark' | 'light'>('light');
  const [ctaHovered, setCtaHovered] = useState(false);
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
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `linear-gradient(${t.gridColor} 1px, transparent 1px), linear-gradient(90deg, ${t.gridColor} 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          opacity: 0.4,
          zIndex: 0,
        }}
      />
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
          <Link
            to="/login"
            style={{
              height: '32px',
              padding: '0 14px',
              borderRadius: '6px',
              border: `1px solid ${t.border}`,
              background: t.btnSecondaryBg,
              color: t.btnSecondaryText,
              fontSize: '13px',
              fontWeight: 500,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            Se connecter
          </Link>
          <button
            type="button"
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
        </div>
      </nav>

      <main
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
        <h1
          style={{
            fontSize: 'clamp(38px, 6vw, 66px)',
            fontWeight: 700,
            letterSpacing: '-2.5px',
            lineHeight: 1.02,
            margin: '0 0 20px',
            color: t.text,
            maxWidth: '720px',
          }}
        >
          La plateforme qui simule
          <br />
          <span style={{ color: t.textMuted }}>votre futur poste.</span>
        </h1>

        <p
          style={{
            fontSize: '16px',
            color: t.textSub,
            lineHeight: 1.65,
            margin: '0 0 40px',
            maxWidth: '520px',
          }}
        >
          Entraînez-vous sur des environnements réalistes avant le jour J.
          Rejoignez la liste d'attente pour un accès anticipé.
        </p>

        <Link
          to="/waitlist"
          onMouseEnter={() => setCtaHovered(true)}
          onMouseLeave={() => setCtaHovered(false)}
          style={{
            height: '44px',
            padding: '0 24px',
            borderRadius: '8px',
            background: t.btnPrimary,
            color: t.btnPrimaryText,
            fontSize: '14px',
            fontWeight: 600,
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            opacity: ctaHovered ? 0.88 : 1,
            transition: 'opacity 0.15s',
          }}
        >
          Rejoindre la waitlist
        </Link>
      </main>

      <footer
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px', opacity: 0.6 }}>
          <KyernalLogo size={13} dark={mode === 'light'} />
          <span style={{ fontSize: '11px', color: t.textMuted, fontWeight: 500 }}>
            Kyernal
          </span>
        </div>
        <span style={{ fontSize: '10px', color: t.textFaint, fontFamily: 'monospace' }}>
          France · RGPD · 2026
        </span>
      </footer>
    </div>
  );
}
