import React, { useState } from 'react';
import { useRouter } from '@tanstack/react-router';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Redirection immédiate vers le Workspace
    router.navigate({ to: '/inbox' });
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#09090b',
        color: '#f4f4f5',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '320px',
          background: '#141416',
          border: '1px solid #27272a',
          borderRadius: '8px',
          padding: '28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '4px',
              background: '#ffffff',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#09090b',
              fontSize: '12px',
              fontWeight: 700,
              marginBottom: '14px',
            }}
          >
            K
          </div>
          <h2
            style={{
              fontSize: '14px',
              fontWeight: 600,
              margin: 0,
              letterSpacing: '0.2px',
            }}
          >
            Connexion au terminal Klixy
          </h2>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label
              style={{
                fontSize: '10px',
                color: '#71717a',
                fontWeight: 600,
                letterSpacing: '0.3px',
              }}
            >
              IDENTIFIANT ÉCOLE OU ENTREPRISE
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nom@infrastructure.fr"
              style={{
                height: '32px',
                background: '#09090b',
                border: '1px solid #27272a',
                borderRadius: '6px',
                padding: '0 10px',
                color: '#ffffff',
                fontSize: '13px',
                outline: 'none',
                fontFamily: 'inherit',
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <label
                style={{
                  fontSize: '10px',
                  color: '#71717a',
                  fontWeight: 600,
                  letterSpacing: '0.3px',
                }}
              >
                MOT DE PASSE SECURITY
              </label>
              <span
                style={{
                  fontSize: '10px',
                  color: '#71717a',
                  cursor: 'pointer',
                }}
              >
                Oublié ?
              </span>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                height: '32px',
                background: '#09090b',
                border: '1px solid #27272a',
                borderRadius: '6px',
                padding: '0 10px',
                color: '#ffffff',
                fontSize: '13px',
                outline: 'none',
                fontFamily: 'inherit',
              }}
            />
          </div>

          <button
            type="submit"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
              height: '32px',
              background: isHovered ? '#e4e4e7' : '#ffffff',
              color: '#09090b',
              border: 'none',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              marginTop: '10px',
              transition: 'background 0.12s ease',
            }}
          >
            S'authentifier
          </button>
        </form>
      </div>
    </div>
  );
}
