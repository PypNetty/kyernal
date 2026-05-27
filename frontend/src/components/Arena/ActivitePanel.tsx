import React, { useState, useContext } from 'react';
import { LayoutCtx } from './Layout';

// --- TYPES ---
type EventType =
  | 'ticket_opened'
  | 'vm_started'
  | 'vm_stopped'
  | 'ticket_resolved'
  | 'hint_requested'
  | 'feedback_received'
  | 'score_updated'
  | 'session_expired'
  | 'command_key';

interface ActivityEvent {
  id: string;
  type: EventType;
  title: string;
  detail?: string;
  ticketId?: string;
  timestamp: string;
  date: string; // pour le groupement
}

// --- MOCK ---
const MOCK_EVENTS: ActivityEvent[] = [
  // Aujourd'hui
  {
    id: '1',
    type: 'vm_started',
    title: 'VM démarrée',
    detail: 'vm-apprenant-04 provisionnée en 3.2s',
    ticketId: 'INC-042',
    timestamp: '09:14',
    date: "Aujourd'hui",
  },
  {
    id: '2',
    type: 'ticket_opened',
    title: 'Ticket ouvert',
    detail: 'Apache ne répond plus sur le port 80',
    ticketId: 'INC-042',
    timestamp: '09:14',
    date: "Aujourd'hui",
  },
  {
    id: '3',
    type: 'hint_requested',
    title: 'Indice demandé',
    detail: 'Commande pour lister les processus sur un port',
    ticketId: 'INC-042',
    timestamp: '09:22',
    date: "Aujourd'hui",
  },
  {
    id: '4',
    type: 'hint_requested',
    title: 'Indice demandé',
    detail: 'Lecture des logs Apache',
    ticketId: 'INC-042',
    timestamp: '09:29',
    date: "Aujourd'hui",
  },
  {
    id: '5',
    type: 'session_expired',
    title: 'Session expirée',
    detail: "vm-apprenant-04 détruite après 2h d'inactivité",
    ticketId: 'INC-042',
    timestamp: '11:14',
    date: "Aujourd'hui",
  },
  // Hier
  {
    id: '6',
    type: 'ticket_opened',
    title: 'Ticket ouvert',
    detail: 'fail2ban bloque des IP légitimes',
    ticketId: 'INC-035',
    timestamp: '16:50',
    date: 'Hier',
  },
  {
    id: '7',
    type: 'vm_started',
    title: 'VM démarrée',
    detail: 'vm-apprenant-03 provisionnée en 2.8s',
    ticketId: 'INC-035',
    timestamp: '16:50',
    date: 'Hier',
  },
  {
    id: '8',
    type: 'command_key',
    title: 'Commande clé exécutée',
    detail: 'sudo fail2ban-client status sshd',
    ticketId: 'INC-035',
    timestamp: '16:58',
    date: 'Hier',
  },
  {
    id: '9',
    type: 'ticket_resolved',
    title: 'Ticket résolu',
    detail: 'Résolu en 18 min — autonomie totale',
    ticketId: 'INC-035',
    timestamp: '17:08',
    date: 'Hier',
  },
  {
    id: '10',
    type: 'vm_stopped',
    title: 'VM détruite',
    detail: 'vm-apprenant-03 supprimée',
    ticketId: 'INC-035',
    timestamp: '17:08',
    date: 'Hier',
  },
  {
    id: '11',
    type: 'score_updated',
    title: "Score d'autonomie mis à jour",
    detail: '+12 pts → 74 pts au total',
    timestamp: '17:09',
    date: 'Hier',
  },
  {
    id: '12',
    type: 'feedback_received',
    title: 'Retour reçu',
    detail: 'Marc Lefebvre a annoté ta session INC-035',
    ticketId: 'INC-035',
    timestamp: '17:32',
    date: 'Hier',
  },
  // Mardi
  {
    id: '13',
    type: 'ticket_opened',
    title: 'Ticket ouvert',
    detail: 'Nginx — erreur 502 Bad Gateway',
    ticketId: 'INC-021',
    timestamp: '13:55',
    date: 'Mardi',
  },
  {
    id: '14',
    type: 'vm_started',
    title: 'VM démarrée',
    detail: 'vm-apprenant-02 provisionnée en 2.5s',
    ticketId: 'INC-021',
    timestamp: '13:55',
    date: 'Mardi',
  },
  {
    id: '15',
    type: 'ticket_resolved',
    title: 'Ticket résolu',
    detail: 'Résolu en 12 min — record personnel',
    ticketId: 'INC-021',
    timestamp: '14:07',
    date: 'Mardi',
  },
  {
    id: '16',
    type: 'vm_stopped',
    title: 'VM détruite',
    detail: 'vm-apprenant-02 supprimée',
    ticketId: 'INC-021',
    timestamp: '14:07',
    date: 'Mardi',
  },
  {
    id: '17',
    type: 'score_updated',
    title: "Score d'autonomie mis à jour",
    detail: '+15 pts → 62 pts au total',
    timestamp: '14:08',
    date: 'Mardi',
  },
  {
    id: '18',
    type: 'feedback_received',
    title: 'Retour reçu',
    detail: 'Marc Lefebvre a annoté ta session INC-021',
    ticketId: 'INC-021',
    timestamp: '14:10',
    date: 'Mardi',
  },
];

// --- EVENT CONFIG ---
const EVENT_CONFIG: Record<
  EventType,
  { color: string; bg: string; icon: React.ReactNode }
> = {
  ticket_opened: {
    color: '#4d8fff',
    bg: 'rgba(0,85,229,0.1)',
    icon: (
      <svg
        width="11"
        height="11"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  vm_started: {
    color: '#30a46c',
    bg: 'rgba(48,164,108,0.1)',
    icon: (
      <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
        <polygon points="5 3 19 12 5 21 5 3" />
      </svg>
    ),
  },
  vm_stopped: {
    color: '#8a8a93',
    bg: 'rgba(138,138,147,0.1)',
    icon: (
      <svg
        width="11"
        height="11"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
      </svg>
    ),
  },
  ticket_resolved: {
    color: '#30a46c',
    bg: 'rgba(48,164,108,0.12)',
    icon: (
      <svg
        width="11"
        height="11"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  hint_requested: {
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.1)',
    icon: (
      <svg
        width="11"
        height="11"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
  feedback_received: {
    color: '#a78bfa',
    bg: 'rgba(167,139,250,0.1)',
    icon: (
      <svg
        width="11"
        height="11"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
    ),
  },
  score_updated: {
    color: '#f97316',
    bg: 'rgba(249,115,22,0.1)',
    icon: (
      <svg
        width="11"
        height="11"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </svg>
    ),
  },
  session_expired: {
    color: '#ef4444',
    bg: 'rgba(239,68,68,0.1)',
    icon: (
      <svg
        width="11"
        height="11"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  command_key: {
    color: '#22d3ee',
    bg: 'rgba(34,211,238,0.1)',
    icon: (
      <svg
        width="11"
        height="11"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="4 17 10 11 4 5" />
        <line x1="12" y1="19" x2="20" y2="19" />
      </svg>
    ),
  },
};

// --- COMPOSANT PRINCIPAL ---
export default function ActivitePanel() {
  const { dark } = useContext(LayoutCtx);
  const [filter, setFilter] = useState<EventType | 'all'>('all');

  const border = dark ? '#1f1f1f' : '#e8e8e5';
  const bg = dark ? '#0e0f11' : '#f7f7f9';
  const textMain = dark ? '#ededed' : '#111113';
  const textMuted = dark ? '#8a8a93' : '#6b6b6b';
  const lineBg = dark ? '#27282b' : '#e2e2e0';

  const filtered = MOCK_EVENTS.filter(
    (e) => filter === 'all' || e.type === filter,
  );

  // Grouper par date
  const grouped = filtered.reduce<Record<string, ActivityEvent[]>>((acc, e) => {
    if (!acc[e.date]) acc[e.date] = [];
    acc[e.date].push(e);
    return acc;
  }, {});
  const dateKeys = Object.keys(grouped);

  const FILTERS: { val: EventType | 'all'; label: string }[] = [
    { val: 'all', label: 'Tout' },
    { val: 'ticket_resolved', label: 'Résolus' },
    { val: 'hint_requested', label: 'Indices' },
    { val: 'feedback_received', label: 'Retours' },
    { val: 'score_updated', label: 'Score' },
  ];

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: bg,
        fontFamily: '-apple-system, BlinkMacSystemFont, Inter, sans-serif',
      }}
    >
      {/* Header */}
      <div
        style={{
          height: '48px',
          display: 'flex',
          alignItems: 'center',
          padding: '0 20px',
          borderBottom: `1px solid ${border}`,
          gap: '10px',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontSize: '13px',
            fontWeight: 600,
            color: textMain,
            flex: 1,
          }}
        >
          Activité
        </span>
        {/* Filtres */}
        <div style={{ display: 'flex', gap: '3px' }}>
          {FILTERS.map((f) => (
            <button
              key={f.val}
              onClick={() => setFilter(f.val)}
              style={{
                padding: '3px 9px',
                fontSize: '11px',
                fontWeight: 500,
                borderRadius: '5px',
                border: 'none',
                cursor: 'pointer',
                background:
                  filter === f.val
                    ? dark
                      ? '#ffffff18'
                      : '#00000012'
                    : 'transparent',
                color: filter === f.val ? textMain : textMuted,
                transition: 'background 0.1s',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0 24px 0' }}>
        {dateKeys.map((date) => (
          <div key={date}>
            {/* Séparateur de jour */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 20px 8px 20px',
              }}
            >
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: textMuted,
                  letterSpacing: '0.4px',
                  flexShrink: 0,
                }}
              >
                {date.toUpperCase()}
              </span>
              <div style={{ flex: 1, height: '1px', background: lineBg }} />
            </div>

            {/* Événements du jour */}
            <div style={{ padding: '0 20px', position: 'relative' }}>
              {/* Ligne verticale timeline */}
              <div
                style={{
                  position: 'absolute',
                  left: '32px',
                  top: 0,
                  bottom: 0,
                  width: '1px',
                  background: lineBg,
                }}
              />

              {grouped[date].map((event, i) => {
                const cfg = EVENT_CONFIG[event.type];
                const isLast = i === grouped[date].length - 1;
                return (
                  <div
                    key={event.id}
                    style={{
                      display: 'flex',
                      gap: '14px',
                      alignItems: 'flex-start',
                      paddingBottom: isLast ? '4px' : '12px',
                      position: 'relative',
                    }}
                  >
                    {/* Icône sur la timeline */}
                    <div
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: cfg.bg,
                        border: `1px solid ${cfg.color}33`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: cfg.color,
                        flexShrink: 0,
                        zIndex: 1,
                        marginTop: '1px',
                      }}
                    >
                      {cfg.icon}
                    </div>

                    {/* Contenu */}
                    <div style={{ flex: 1, minWidth: 0, paddingTop: '2px' }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'baseline',
                          gap: '8px',
                          marginBottom: '2px',
                        }}
                      >
                        <span
                          style={{
                            fontSize: '12px',
                            fontWeight: 600,
                            color: textMain,
                          }}
                        >
                          {event.title}
                        </span>
                        {event.ticketId && (
                          <span
                            style={{
                              fontSize: '11px',
                              color: '#4d8fff',
                              fontWeight: 500,
                            }}
                          >
                            #{event.ticketId}
                          </span>
                        )}
                        <span
                          style={{
                            fontSize: '11px',
                            color: textMuted,
                            marginLeft: 'auto',
                            flexShrink: 0,
                          }}
                        >
                          {event.timestamp}
                        </span>
                      </div>
                      {event.detail && (
                        <div
                          style={{
                            fontSize: '12px',
                            color: textMuted,
                            lineHeight: 1.5,
                          }}
                        >
                          {event.detail}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
