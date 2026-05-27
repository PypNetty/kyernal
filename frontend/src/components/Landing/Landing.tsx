import React, { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { KlixyLogo } from '../KlixyLogo';

export default function Landing() {
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#09090b',
        color: '#f4f4f5',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Texture de fond — Halo minimaliste diffus */}
      <div
        style={{
          position: 'absolute',
          top: '25%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '500px',
          height: '250px',
          background:
            'radial-gradient(circle, rgba(255,255,255,0.02) 0%, transparent 80%)',
          pointerEvents: 'none',
          filter: 'blur(50px)',
          zIndex: 0,
        }}
      />

      {/* Conteneur Textuel */}
      <div
        style={{
          textAlign: 'center',
          maxWidth: '600px',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Badge d'état filaire micro */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 10px',
            borderRadius: '100px',
            background: '#141416',
            border: '1px solid #27272a',
            fontSize: '11px',
            fontWeight: 500,
            color: '#a1a1aa',
            marginBottom: '28px',
            letterSpacing: '0.2px',
          }}
        >
          <KlixyLogo size={32} glow={true} />
          Klixy Engine v2.2026 · Production Stable
        </div>

        {/* Titre Typographique Brut */}
        <h1
          style={{
            fontSize: '44px',
            fontWeight: 600,
            letterSpacing: '-1.2px',
            margin: '0 0 16px 0',
            lineHeight: 1.1,
            color: '#ffffff',
          }}
        >
          Simulez la production.
          <br />
          <span style={{ color: '#52525b' }}>Maîtrisez les incidents.</span>
        </h1>

        {/* Description Technique Fine */}
        <p
          style={{
            fontSize: '14px',
            color: '#a1a1aa',
            lineHeight: 1.6,
            margin: '0 0 36px 0',
            maxWidth: '490px',
            letterSpacing: '-0.1px',
          }}
        >
          Environnement de simulation de pannes réelles injectées à chaud sur
          des infrastructures isolées. Résolvez vos tickets de support, analysez
          votre autonomie et validez vos compétences CCP pour le jury.
        </p>

        {/* Actions Monochromes */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Link to="/login" style={{ textDecoration: 'none' }}>
            <button
              onMouseEnter={() => setHoveredBtn('primary')}
              onMouseLeave={() => setHoveredBtn(null)}
              style={{
                height: '34px',
                padding: '0 16px',
                borderRadius: '6px',
                background: hoveredBtn === 'primary' ? '#e4e4e7' : '#ffffff',
                color: '#09090b',
                border: 'none',
                fontWeight: 500,
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'background 0.12s ease',
              }}
            >
              Espace de travail
            </button>
          </Link>

          <Link to="/inbox" style={{ textDecoration: 'none' }}>
            <button
              onMouseEnter={() => setHoveredBtn('secondary')}
              onMouseLeave={() => setHoveredBtn(null)}
              style={{
                height: '34px',
                padding: '0 16px',
                borderRadius: '6px',
                background:
                  hoveredBtn === 'secondary' ? '#141416' : 'transparent',
                color: '#f4f4f5',
                border: '1px solid #27272a',
                fontWeight: 500,
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.12s ease',
              }}
            >
              Session éphémère
            </button>
          </Link>
        </div>
      </div>

      {/* Identifiant de nœud d'infrastructure en bas */}
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          fontSize: '10px',
          color: '#3f3f46',
          fontFamily: 'monospace',
          letterSpacing: '0.5px',
        }}
      >
        [CLUSTER_NODE_OK] // RECONNAISSANCE ENVIRONNEMENTALE SÉCURISÉE
      </div>
    </div>
  );
}
