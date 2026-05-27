import React, { useState } from 'react';
import { Outlet } from '@tanstack/react-router';
import { UserProfile } from './types';
import Sidebar from './Sidebar';

// --- ICÔNES TOPBAR ---
const IconLayoutH = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <line x1="12" y1="3" x2="12" y2="21"/>
  </svg>
);
const IconLayoutV = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <line x1="3" y1="12" x2="21" y2="12"/>
  </svg>
);
const IconSun = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/>
    <line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/>
    <line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);
const IconMoon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);
const IconStop = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
  </svg>
);
const IconTrash = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6M14 11v6"/>
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);

const IconBtn = ({
  onClick,
  children,
  title,
  danger = false,
  dark,
}: {
  onClick: () => void;
  children: React.ReactNode;
  title?: string;
  danger?: boolean;
  dark: boolean;
}) => {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      title={title}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '28px',
        height: '28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        background: hovered
          ? danger ? 'rgba(255,80,80,0.12)' : dark ? '#ffffff14' : '#00000010'
          : 'transparent',
        color: hovered
          ? danger ? '#ff5050' : dark ? '#ededed' : '#111113'
          : dark ? '#8a8a93' : '#6b6b6b',
        transition: 'background 0.1s, color 0.1s',
        padding: 0,
      }}
    >
      {children}
    </button>
  );
};

// --- CONTEXTE GLOBAL UNIQUE ---
export interface LayoutContext {
  dark: boolean;
  vertical: boolean;
  vmHost: string | undefined;
  vmId: number | undefined;
  loading: boolean;
  startSession: (incidentId: string) => Promise<void>;
  stopSession: () => Promise<void>;
  deleteSession: () => Promise<void>;
  showTerminal: boolean;
  setShowTerminal: (val: boolean) => void;
  showTicket: boolean;
  setShowTicket: (val: boolean) => void;
}

export const LayoutCtx = React.createContext<LayoutContext>({} as LayoutContext);

export default function Layout() {
  const [dark, setDark] = useState(true);
  const [vertical, setVertical] = useState(false);
  const [vmHost, setVmHost] = useState<string | undefined>(undefined);
  const [vmId, setVmId] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const [showTerminal, setShowTerminal] = useState(true);
  const [showTicket, setShowTicket] = useState(true);

  const currentUser: UserProfile = {
    name: 'Henryck Paris',
    initials: 'HP',
    role: 'Admin Linux DevOps',
  };

  const border = dark ? '#1f1f1f' : '#e8e8e5';
  const bg = dark ? '#0c0c0d' : '#fafaf9';
  const text = dark ? '#ededed' : '#0f0f0f';
  const textMuted = dark ? '#8a8a93' : '#6b6b6b';

  const startSession = async (incidentId: string) => {
    setLoading(true);
    setVmHost(undefined);
    try {
      const res = await fetch(
        `http://127.0.0.1:8080/arena/start?incident=${incidentId}`,
        { method: 'POST' },
      );
      const data = await res.json();
      setVmHost(data.vmIP);
      setVmId(data.vmID);
    } catch (e) {
      console.error('Failed to start arena:', e);
    } finally {
      setLoading(false);
    }
  };

  const stopSession = async () => {
    if (!vmId) return;
    try {
      await fetch(`http://127.0.0.1:8080/arena/stop?id=${vmId}`, { method: 'POST' });
      setVmHost(undefined);
    } catch (e) {
      console.error('Failed to stop session:', e);
    }
  };

  const deleteSession = async () => {
    if (!vmId) return;
    try {
      await fetch(`http://127.0.0.1:8080/arena/delete?id=${vmId}`, { method: 'DELETE' });
      setVmHost(undefined);
      setVmId(undefined);
    } catch (e) {
      console.error('Failed to delete session:', e);
    }
  };

  const ctx: LayoutContext = {
    dark, vertical, vmHost, vmId, loading,
    startSession, stopSession, deleteSession,
    showTerminal, setShowTerminal, showTicket, setShowTicket
  };

  return (
    <LayoutCtx.Provider value={ctx}>
      <div style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: dark ? '#111113' : '#ffffff',
        color: text,
        fontFamily: '-apple-system, BlinkMacSystemFont, Inter, sans-serif',
      }}>

        {/* TopBar */}
        <div style={{
          height: '40px',
          borderBottom: `1px solid ${border}`,
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          justifyContent: 'space-between',
          background: bg,
          flexShrink: 0,
        }}>
          <div style={{ fontSize: '12px', fontWeight: 500, color: text }}>
            Klixy Arena
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            <button
              onClick={() => setShowTicket(!showTicket)}
              style={{
                height: '22px', padding: '0 8px', borderRadius: '4px', marginRight: '4px',
                border: `1px solid ${showTicket ? (dark ? '#4d8fff44' : '#0055e544') : border}`,
                background: showTicket ? (dark ? 'rgba(77,143,255,0.1)' : 'rgba(0,85,229,0.06)') : 'transparent',
                color: showTicket ? (dark ? '#4d8fff' : '#0055e5') : textMuted,
                fontSize: '11px', fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s'
              }}
            >
              Ticket
            </button>
            <button
              onClick={() => setShowTerminal(!showTerminal)}
              style={{
                height: '22px', padding: '0 8px', borderRadius: '4px', marginRight: '8px',
                border: `1px solid ${showTerminal ? (dark ? '#4d8fff44' : '#0055e544') : border}`,
                background: showTerminal ? (dark ? 'rgba(77,143,255,0.1)' : 'rgba(0,85,229,0.06)') : 'transparent',
                color: showTerminal ? (dark ? '#4d8fff' : '#0055e5') : textMuted,
                fontSize: '11px', fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s'
              }}
            >
              Terminal
            </button>

            <div style={{ width: '1px', height: '14px', background: border, marginRight: '6px' }} />

            {vmHost && (
              <>
                <IconBtn onClick={stopSession} title="Stopper la session" dark={dark}>
                  <IconStop />
                </IconBtn>
                <IconBtn onClick={deleteSession} title="Supprimer la VM" danger dark={dark}>
                  <IconTrash />
                </IconBtn>
                <div style={{
                  width: '1px', height: '16px',
                  background: dark ? '#27282b' : '#e8e8e5',
                  margin: '0 4px',
                }} />
              </>
            )}
            <IconBtn
              onClick={() => setVertical(!vertical)}
              title={vertical ? 'Disposition horizontale' : 'Disposition verticale'}
              dark={dark}
            >
              {vertical ? <IconLayoutH /> : <IconLayoutV />}
            </IconBtn>
            <IconBtn
              onClick={() => setDark(!dark)}
              title={dark ? 'Mode clair' : 'Mode sombre'}
              dark={dark}
            >
              {dark ? <IconSun /> : <IconMoon />}
            </IconBtn>
          </div>
        </div>

        {/* Workspace */}
        <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
          <Sidebar dark={dark} user={currentUser} />
          <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
            <Outlet />
          </div>
        </div>

      </div>
    </LayoutCtx.Provider>
  );
}