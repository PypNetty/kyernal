import { useLayoutEffect } from 'react';
import KyernalLogo from './KyernalLogo';
import WaitlistForm from './WaitlistForm';
import { THEMES } from '../theme/landingTheme';

export default function Waitlist() {
  const t = THEMES.light;

  useLayoutEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtmlBg = html.style.background;
    const prevBodyBg = body.style.background;
    html.style.background = t.bg;
    body.style.background = t.bg;
    return () => {
      html.style.background = prevHtmlBg;
      body.style.background = prevBodyBg;
    };
  }, [t.bg]);

  return (
    <div
      style={{
        width: '100%',
        minHeight: '100vh',
        background: t.bg,
        color: t.text,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        position: 'relative',
        overflowX: 'hidden',
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

      <main
        style={{
          position: 'relative',
          zIndex: 1,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px 24px',
          textAlign: 'center',
        }}
      >
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
          Ne postulez plus à l'aveugle.
          <br />
          <span style={{ color: t.textMuted }}>Prouvez-le.</span>
        </h1>

        <p
          style={{
            fontSize: '16px',
            color: t.textSub,
            lineHeight: 1.65,
            margin: '0 0 16px',
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
            margin: '0 0 52px',
            maxWidth: '500px',
          }}
        >
          Kyernal génère l'infrastructure exacte pour vous tester avant
          l'entretien.
        </p>

        <WaitlistForm t={t} />
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
          <KyernalLogo size={13} dark={true} />
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
