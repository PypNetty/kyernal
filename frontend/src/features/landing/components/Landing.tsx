import { Link } from '@tanstack/react-router';
import { useState } from 'react';
import KyernalLogo from './KyernalLogo';
import { THEMES } from '../theme/landingTheme';

export default function Landing() {
  const [mode, setMode] = useState<'dark' | 'light'>('dark');
  const t = THEMES[mode];

  return (
    <div
      style={{
        minHeight: '100vh',
        background: t.bg,
        color: t.text,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        position: 'relative',
        overflowX: 'hidden',
        transition: 'background 0.3s, color 0.3s',
      }}
    >
      {/* Background Effects */}
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

      {/* Navigation */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              textDecoration: 'none',
              color: t.text,
            }}
          >
            <KyernalLogo size={20} dark={mode === 'light'} />
            <span style={{ fontSize: '15px', fontWeight: 600, letterSpacing: '-0.2px', color: t.text }}>
              Klixy
            </span>
          </Link>

          <div className="landing-nav-links" style={{ display: 'none', gap: '24px' }}>
            {[
              { label: 'Fonctionnalités', id: 'fonctionnalites' },
              { label: 'Tarifs', id: 'tarifs' },
              { label: 'Pour les organismes', id: 'organismes' },
              { label: 'Docs', id: 'docs' },
            ].map(({ label, id }) => (
              <a
                key={id}
                href={`#${id}`}
                style={{ fontSize: '13px', color: t.textSub, textDecoration: 'none', fontWeight: 500 }}
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => setMode((m) => (m === 'dark' ? 'light' : 'dark'))}
            style={{
              width: '32px', height: '32px', borderRadius: '6px', border: `1px solid ${t.border}`,
              background: t.bgCard, color: t.textMuted, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px',
            }}
          >
            {mode === 'dark' ? '☀' : '◐'}
          </button>
          <Link
            to="/login"
            style={{
              height: '32px', padding: '0 14px', borderRadius: '6px', border: `1px solid ${t.border}`,
              background: t.btnSecondaryBg, color: t.btnSecondaryText, fontSize: '13px', fontWeight: 500,
              textDecoration: 'none', display: 'flex', alignItems: 'center', cursor: 'pointer',
            }}
          >
            Connexion
          </Link>
          <Link
            to="/"
            style={{
              height: '32px', padding: '0 16px', borderRadius: '6px', border: 'none',
              background: t.btnPrimary, color: t.btnPrimaryText, fontSize: '13px', fontWeight: 600,
              textDecoration: 'none', display: 'flex', alignItems: 'center', cursor: 'pointer',
            }}
          >
            Commencer gratuitement
          </Link>
        </div>
      </nav>

      <main style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '120px 24px 80px' }}>
        
        {/* HERO SECTION */}
        <div style={{ textAlign: 'center', maxWidth: '800px', marginBottom: '64px' }}>
          <div
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px',
              borderRadius: '100px', background: t.badgeBg, border: `1px solid ${t.badgeBorder}`,
              fontSize: '12px', color: t.textSub, marginBottom: '24px', backdropFilter: 'blur(10px)',
            }}
          >
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#30a46c', boxShadow: '0 0 8px #30a46c' }} />
            Le moteur de micro-virtualisation Kyernal est en ligne
          </div>

          <h1 style={{ fontSize: 'clamp(40px, 6vw, 64px)', fontWeight: 700, letterSpacing: '-2px', lineHeight: 1.05, margin: '0 0 24px 0', color: t.text }}>
            La pratique pure.<br />
            <span style={{ color: t.textMuted }}>Oubliez les QCM.</span>
          </h1>

          <p style={{ fontSize: '18px', color: t.textSub, lineHeight: 1.6, margin: '0 auto 40px', maxWidth: '580px' }}>
            Klixy génère des infrastructures réelles à la volée. Préparez vos titres TSSR, vos certifications DevOps et vos entretiens techniques sur de véritables environnements Linux isolés.
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
             <Link
               to="/login"
               style={{
                 height: '44px', padding: '0 24px', borderRadius: '8px', background: t.btnPrimary,
                 color: t.btnPrimaryText, border: 'none', fontSize: '14px', fontWeight: 600,
                 textDecoration: 'none', display: 'inline-flex', alignItems: 'center',
               }}
             >
               Lancer ma première Arena
             </Link>
             <a
               href="#fonctionnalites"
               style={{
                 height: '44px', padding: '0 24px', borderRadius: '8px', background: t.btnSecondaryBg,
                 color: t.btnSecondaryText, border: `1px solid ${t.border}`, fontSize: '14px',
                 fontWeight: 500, textDecoration: 'none', display: 'inline-flex', alignItems: 'center',
               }}
             >
               Voir comment ça marche
             </a>
          </div>
        </div>

        {/* DEMO VIDEO PLACEHOLDER */}
        <div style={{ width: '100%', maxWidth: '1000px', aspectRatio: '16/9', background: t.bgCard, borderRadius: '16px', border: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '120px', boxShadow: `0 20px 40px -20px rgba(0,0,0,0.5)`, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '40px', borderBottom: `1px solid ${t.borderMuted}`, display: 'flex', alignItems: 'center', padding: '0 16px', gap: '8px' }}>
             <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56' }}/>
             <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e' }}/>
             <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f' }}/>
             <span style={{ fontSize: '12px', color: t.textMuted, marginLeft: '12px', fontFamily: 'monospace' }}>kyernal --deploy arena</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
             <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: t.btnPrimary, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
               <div style={{ width: 0, height: 0, borderTop: '10px solid transparent', borderBottom: '10px solid transparent', borderLeft: `16px solid ${t.btnPrimaryText}`, marginLeft: '6px' }}/>
             </div>
             <span style={{ color: t.textSub, fontSize: '14px', fontWeight: 500 }}>Vidéo de démonstration (30s)</span>
          </div>
        </div>

        {/* FEATURES SECTION */}
        <div id="fonctionnalites" style={{ maxWidth: '1000px', width: '100%', marginBottom: '120px', scrollMarginTop: '80px' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: 700, color: t.text, marginBottom: '16px' }}>Conçu pour l'apprentissage actif</h2>
            <p style={{ color: t.textSub, fontSize: '16px' }}>Une combinaison d'infrastructures réelles et d'accompagnement intelligent.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {[
              { title: "Des vraies VMs, en 3 secondes", desc: "Pas de simulateurs factices. Déployez de véritables environnements isolés par notre hyperviseur maison pour bidouiller vos noyaux ou configurer vos réseaux en conditions réelles." },
              { title: "Agent d'accompagnement Vocal", desc: "Bloqué sur la configuration d'un reverse proxy ? Notre IA analyse votre terminal en temps réel et vous guide vocalement sans vous donner la réponse toute cuite." },
              { title: "Détection de frustration", desc: "Klixy repère les commandes répétées qui échouent. Le système ajuste la difficulté ou vous suggère une piste avant que vous n'abandonniez." }
            ].map((feat, i) => (
              <div key={i} style={{ background: t.bgCard, padding: '32px', borderRadius: '12px', border: `1px solid ${t.borderMuted}` }}>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: t.text, marginBottom: '12px' }}>{feat.title}</h3>
                <p style={{ fontSize: '15px', color: t.textSub, lineHeight: 1.5 }}>{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* PRICING SECTION */}
        <div id="tarifs" style={{ maxWidth: '800px', width: '100%', marginBottom: '120px', scrollMarginTop: '80px' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: 700, color: t.text, marginBottom: '16px' }}>Tarification simple</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {/* Free Tier */}
            <div style={{ background: t.bg, padding: '40px', borderRadius: '16px', border: `1px solid ${t.border}` }}>
              <h3 style={{ fontSize: '20px', fontWeight: 600, color: t.text, marginBottom: '8px' }}>Découverte</h3>
              <div style={{ fontSize: '40px', fontWeight: 700, color: t.text, marginBottom: '24px' }}>0€ <span style={{ fontSize: '16px', color: t.textMuted, fontWeight: 400 }}>/mois</span></div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', display: 'flex', flexDirection: 'column', gap: '12px', color: t.textSub, fontSize: '14px' }}>
                <li>✓ 2 Arenas par mois</li>
                <li>✓ Environnements éphémères</li>
                <li>✓ Agent IA (Texte uniquement)</li>
              </ul>
              <button style={{ width: '100%', height: '40px', borderRadius: '6px', background: t.btnSecondaryBg, color: t.btnSecondaryText, border: `1px solid ${t.border}`, fontWeight: 500, cursor: 'pointer' }}>
                Créer un compte
              </button>
            </div>

            {/* Pro Tier */}
            <div style={{ background: t.bgCard, padding: '40px', borderRadius: '16px', border: `2px solid ${t.btnPrimary}`, position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: t.btnPrimary, color: t.btnPrimaryText, padding: '4px 12px', borderRadius: '100px', fontSize: '12px', fontWeight: 600 }}>
                Le plus populaire
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 600, color: t.text, marginBottom: '8px' }}>Apprenti Pro</h3>
              <div style={{ fontSize: '40px', fontWeight: 700, color: t.text, marginBottom: '24px' }}>15€ <span style={{ fontSize: '16px', color: t.textMuted, fontWeight: 400 }}>/mois</span></div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', display: 'flex', flexDirection: 'column', gap: '12px', color: t.textSub, fontSize: '14px' }}>
                <li>✓ Arenas illimitées</li>
                <li>✓ Persistance des environnements</li>
                <li>✓ Agent IA Vocal complet</li>
                <li>✓ Tableaux de bord de progression</li>
              </ul>
              <button style={{ width: '100%', height: '40px', borderRadius: '6px', background: t.btnPrimary, color: t.btnPrimaryText, border: 'none', fontWeight: 600, cursor: 'pointer' }}>
                Passer Pro
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer style={{ borderTop: `1px solid ${t.borderMuted}`, padding: '64px 48px', background: t.bg, position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '48px', marginBottom: '64px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <KyernalLogo size={16} dark={mode === 'light'} />
              <span style={{ fontSize: '14px', color: t.text, fontWeight: 600 }}>Klixy</span>
            </div>
            <p style={{ fontSize: '13px', color: t.textMuted, lineHeight: 1.5 }}>L'apprentissage de l'infrastructure par la pratique réelle.</p>
          </div>
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 600, color: t.text, marginBottom: '16px' }}>Produit</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {['Arenas', 'Agent IA', 'Tarifs', 'Changelog'].map(l => <a key={l} href="#" style={{ fontSize: '13px', color: t.textSub, textDecoration: 'none' }}>{l}</a>)}
            </div>
          </div>
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 600, color: t.text, marginBottom: '16px' }}>Légal</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {['Mentions légales', 'CGU', 'CGV', 'Politique de confidentialité'].map(l => <a key={l} href="#" style={{ fontSize: '13px', color: t.textSub, textDecoration: 'none' }}>{l}</a>)}
            </div>
          </div>
        </div>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '24px', borderTop: `1px solid ${t.borderMuted}` }}>
           <span style={{ fontSize: '12px', color: t.textFaint }}>© 2026 Klixy. Tous droits réservés.</span>
           <span style={{ fontSize: '11px', color: t.textFaint, fontFamily: 'monospace' }}>Hébergé en France · RGPD</span>
        </div>
      </footer>

      <style>{`
        @media (min-width: 768px) {
          .landing-nav-links {
            display: flex !important;
            align-items: center;
          }
        }
      `}</style>
    </div>
  );
}