import React from 'react';

export const KlixyLogo = ({
  size = 28,
  glow = false,
}: {
  size?: number;
  glow?: boolean;
}) => (
  <div
    style={{
      position: 'relative',
      width: size,
      height: size,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    {/* Halo lumineux optionnel pour la Landing Page */}
    {glow && (
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: '#ffffff',
          filter: 'blur(10px)',
          opacity: 0.15,
          borderRadius: '8px',
        }}
      />
    )}

    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ zIndex: 1 }}
    >
      {/* Fond du logo (Reprend les bordures de l'UI globale) */}
      <rect
        width="32"
        height="32"
        rx="8"
        fill="#141416"
        stroke="#27272a"
        strokeWidth="1"
      />

      {/* Tracé du K : Ligne verticale (Le serveur parent) */}
      <path
        d="M12 9V23"
        stroke="#f4f4f5"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Tracé du K : Chevron (Le fork / clone de la VM) */}
      <path
        d="M21 9L12 16L21 23"
        stroke="#f4f4f5"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Nœud Actif : L'indicateur "VM UP" en haut à droite */}
      <circle cx="21" cy="9" r="2.5" fill="#30a46c" />
    </svg>
  </div>
);
