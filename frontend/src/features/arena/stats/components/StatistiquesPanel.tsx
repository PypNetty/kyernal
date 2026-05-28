import React, { useState, useContext, useEffect, useRef } from 'react';
import { LayoutCtx } from '../../layout/components/Layout';

// --- TYPES ---
interface StatPeriod {
  label: string;
  value: string;
}

interface WeeklyData {
  day: string;
  tickets: number;
  hints: number;
  minutes: number;
}

interface CommandStat {
  command: string;
  count: number;
  category: string;
}

interface AgentInteraction {
  type: 'hint' | 'validation' | 'suggestion';
  ticketId: string;
  question: string;
  timestamp: string;
}

// --- MOCK DATA ---
const WEEKLY_DATA: WeeklyData[] = [
  { day: 'Lun', tickets: 0, hints: 0, minutes: 0 },
  { day: 'Mar', tickets: 2, hints: 0, minutes: 28 },
  { day: 'Mer', tickets: 1, hints: 1, minutes: 45 },
  { day: 'Jeu', tickets: 0, hints: 0, minutes: 0 },
  { day: 'Ven', tickets: 1, hints: 2, minutes: 18 },
  { day: 'Sam', tickets: 0, hints: 0, minutes: 0 },
  { day: 'Dim', tickets: 1, hints: 0, minutes: 31 },
];

const TOP_COMMANDS: CommandStat[] = [
  { command: 'systemctl status', count: 24, category: 'services' },
  { command: 'journalctl -u', count: 18, category: 'logs' },
  { command: 'ss -tlnp', count: 15, category: 'réseau' },
  { command: 'tail -n 50', count: 12, category: 'logs' },
  { command: 'grep -i error', count: 11, category: 'recherche' },
  { command: 'df -h', count: 9, category: 'disque' },
  { command: 'sudo fail2ban-client', count: 7, category: 'sécurité' },
  { command: 'curl -I', count: 6, category: 'web' },
];

const AGENT_INTERACTIONS: AgentInteraction[] = [
  {
    type: 'hint',
    ticketId: 'INC-042',
    question: 'Comment lister les processus sur un port ?',
    timestamp: "Aujourd'hui 09:22",
  },
  {
    type: 'hint',
    ticketId: 'INC-042',
    question: "Comment lire les 50 dernières lignes d'un log ?",
    timestamp: "Aujourd'hui 09:29",
  },
  {
    type: 'validation',
    ticketId: 'INC-035',
    question: 'Ma configuration fail2ban est-elle correcte ?',
    timestamp: 'Hier 17:05',
  },
  {
    type: 'suggestion',
    ticketId: 'INC-021',
    question: 'Quelle est la différence entre reload et restart ?',
    timestamp: 'Mar 13:58',
  },
  {
    type: 'hint',
    ticketId: 'INC-088',
    question: 'Comment tester une résolution DNS en local ?',
    timestamp: 'Mer 11:14',
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  services: '#4d8fff',
  logs: '#a78bfa',
  réseau: '#22d3ee',
  recherche: '#30a46c',
  disque: '#f59e0b',
  sécurité: '#ef4444',
  web: '#f97316',
};

const INTERACTION_CONFIG = {
  hint: {
    label: 'Indice',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.2)',
  },
  validation: {
    label: 'Validation',
    color: '#30a46c',
    bg: 'rgba(48,164,108,0.08)',
    border: 'rgba(48,164,108,0.2)',
  },
  suggestion: {
    label: 'Suggestion',
    color: '#4d8fff',
    bg: 'rgba(0,85,229,0.08)',
    border: 'rgba(0,85,229,0.2)',
  },
};

// --- MINI BAR CHART ---
function BarChart({
  data,
  dark,
  textMuted,
}: {
  data: WeeklyData[];
  dark: boolean;
  textMuted: string;
}) {
  const maxVal = Math.max(...data.map((d) => d.tickets), 1);
  const barBg = dark ? '#18191b' : '#f0f0ee';

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: '10px',
        height: '100px',
        padding: '12px 4px 4px 4px',
      }}
    >
      {data.map((d, i) => {
        const pct = (d.tickets / maxVal) * 100;
        return (
          <div
            key={i}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              height: '100%',
              justifyContent: 'flex-end',
            }}
          >
            <div
              style={{
                width: '100%',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                height: '100%',
              }}
            >
              <div
                style={{
                  width: '100%',
                  background: barBg,
                  borderRadius: '4px',
                  height: '100%',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: `${pct}%`,
                    background: d.hints > 0 ? '#f59e0b' : '#0055e5',
                    borderRadius: '3px',
                    transition: 'height 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    minHeight: d.tickets > 0 ? '6px' : '0',
                  }}
                />
              </div>
            </div>
            <span
              style={{ fontSize: '11px', color: textMuted, fontWeight: 500 }}
            >
              {d.day}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// --- STAT CARD ---
function StatCard({
  label,
  value,
  sub,
  color,
  dark,
  border,
}: {
  label: string;
  value: string;
  sub?: string;
  color: string;
  dark: boolean;
  border: string;
}) {
  return (
    <div
      style={{
        padding: '16px',
        borderRadius: '8px',
        border: `1px solid ${border}`,
        background: dark ? '#111113' : '#ffffff',
        flex: 1,
        minWidth: 0,
      }}
    >
      <div
        style={{
          fontSize: '11px',
          color: dark ? '#8a8a93' : '#6b6b6b',
          marginBottom: '8px',
          fontWeight: 500,
          letterSpacing: '0.2px',
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: '24px',
          fontWeight: 600,
          color,
          marginBottom: '4px',
          fontFamily: 'monospace',
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: '11px', color: dark ? '#63636e' : '#8c8c99' }}>
          {sub}
        </div>
      )}
    </div>
  );
}

// --- COMPOSANT PRINCIPAL ---
export default function StatistiquesPanel() {
  const { dark } = useContext(LayoutCtx);

  const border = dark ? '#27282b' : '#e8e8e5';
  const bg = dark ? '#0c0c0d' : '#fafaf9';
  const textMain = dark ? '#ededed' : '#111113';
  const textMuted = dark ? '#8a8a93' : '#6b6b6b';
  const cardBg = dark ? '#111113' : '#ffffff';
  const trackBg = dark ? '#1f1f23' : '#f0f0ee';

  const totalTickets = 9;
  const resolvedAuto = 6;
  const totalHints = 5;
  const avgTime = '21 min';
  const autonomyScore = 74;
  const maxCommand = TOP_COMMANDS[0].count;

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: bg,
        fontFamily: '-apple-system, BlinkMacSystemFont, Inter, sans-serif',
        overflowY: 'auto',
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
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: '13px', fontWeight: 600, color: textMain }}>
          Statistiques d'analyse de l'agent
        </span>
        <div
          style={{
            width: '1px',
            height: '12px',
            background: border,
            margin: '0 10px',
          }}
        />
        <span style={{ fontSize: '11px', color: textMuted, fontWeight: 500 }}>
          Cette semaine
        </span>
      </div>

      <div
        style={{
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        {/* KPIs */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <StatCard
            label="Tickets résolus"
            value={String(totalTickets)}
            sub="sur la période courante"
            color={textMain}
            dark={dark}
            border={border}
          />
          <StatCard
            label="Score d'autonomie"
            value={`${autonomyScore}%`}
            sub="résolution sans assistance"
            color="#30a46c"
            dark={dark}
            border={border}
          />
          <StatCard
            label="Indices demandés"
            value={String(totalHints)}
            sub={`${Math.round((totalHints / totalTickets) * 10) / 10} par ticket en moyenne`}
            color="#f59e0b"
            dark={dark}
            border={border}
          />
          <StatCard
            label="Temps moyen"
            value={avgTime}
            sub="par diagnostic de panne"
            color="#0055e5"
            dark={dark}
            border={border}
          />
        </div>

        {/* Graphique activité semaine */}
        <div
          style={{
            padding: '20px',
            borderRadius: '8px',
            border: `1px solid ${border}`,
            background: cardBg,
          }}
        >
          <div
            style={{
              fontSize: '12px',
              fontWeight: 600,
              color: textMain,
              marginBottom: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>Activité — 7 derniers jours</span>
            <div
              style={{
                display: 'flex',
                gap: '16px',
                fontSize: '11px',
                fontWeight: 500,
                color: textMuted,
              }}
            >
              <span
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '2px',
                    background: '#0055e5',
                  }}
                />{' '}
                Autonome
              </span>
              <span
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '2px',
                    background: '#f59e0b',
                  }}
                />{' '}
                Assisté
              </span>
            </div>
          </div>
          <BarChart data={WEEKLY_DATA} dark={dark} textMuted={textMuted} />
        </div>

        {/* Score d'autonomie + top commandes */}
        <div style={{ display: 'flex', gap: '12px' }}>
          {/* Score autonomie (Bloc Gauche) */}
          <div
            style={{
              flex: 1,
              padding: '20px',
              borderRadius: '8px',
              border: `1px solid ${border}`,
              background: cardBg,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: textMain,
                marginBottom: '20px',
              }}
            >
              Répartition par objectifs de certification
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                marginBottom: '24px',
              }}
            >
              <div
                style={{
                  position: 'relative',
                  width: '72px',
                  height: '72px',
                  flexShrink: 0,
                }}
              >
                <svg width="72" height="72" viewBox="0 0 72 72">
                  <circle
                    cx="36"
                    cy="36"
                    r="28"
                    fill="none"
                    stroke={trackBg}
                    strokeWidth="6"
                  />
                  <circle
                    cx="36"
                    cy="36"
                    r="28"
                    fill="none"
                    stroke="#30a46c"
                    strokeWidth="6"
                    strokeDasharray={`${(2 * Math.PI * 28 * autonomyScore) / 100} ${2 * Math.PI * 28 * (1 - autonomyScore / 100)}`}
                    strokeLinecap="round"
                    transform="rotate(-90 36 36)"
                  />
                </svg>
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    fontWeight: 700,
                    color: '#30a46c',
                    fontFamily: 'monospace',
                  }}
                >
                  {autonomyScore}
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: '13px',
                    color: textMain,
                    fontWeight: 600,
                    marginBottom: '2px',
                  }}
                >
                  Niveau intermédiaire
                </div>
                <div
                  style={{
                    fontSize: '11px',
                    color: textMuted,
                    lineHeight: 1.5,
                  }}
                >
                  {resolvedAuto} pannes résolues de manière critique sans l'aide
                  du mentor.
                </div>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                marginTop: 'auto',
              }}
            >
              {[
                {
                  ccp: 'CCP1 — Support Réseau & Accès',
                  score: 85,
                  color: '#0055e5',
                },
                {
                  ccp: 'CCP2 — Exploitation des Services',
                  score: 72,
                  color: '#30a46c',
                },
                {
                  ccp: 'CCP3 — Automatisation & Scripts',
                  score: 60,
                  color: '#a78bfa',
                },
              ].map(({ ccp, score, color }) => (
                <div key={ccp}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '4px',
                      fontSize: '11px',
                    }}
                  >
                    <span style={{ color: textMuted, fontWeight: 500 }}>
                      {ccp}
                    </span>
                    <span
                      style={{
                        fontWeight: 600,
                        color,
                        fontFamily: 'monospace',
                      }}
                    >
                      {score}%
                    </span>
                  </div>
                  <div
                    style={{
                      height: '4px',
                      borderRadius: '100px',
                      background: trackBg,
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        borderRadius: '100px',
                        background: color,
                        width: `${score}%`,
                        transition: 'width 0.4s',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top commandes (Bloc Droite) */}
          <div
            style={{
              flex: 1,
              padding: '20px',
              borderRadius: '8px',
              border: `1px solid ${border}`,
              background: cardBg,
            }}
          >
            <div
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: textMain,
                marginBottom: '16px',
              }}
            >
              Séquences de commandes observées
            </div>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
            >
              {TOP_COMMANDS.map((cmd, i) => {
                const pct = (cmd.count / maxCommand) * 100;
                const color = CATEGORY_COLORS[cmd.category] ?? '#8a8a93';
                return (
                  <div key={i}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '3px',
                        alignItems: 'center',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '11px',
                          fontFamily: 'JetBrains Mono, monospace',
                          color: dark ? '#7eb8ff' : '#0055e5',
                          fontWeight: 500,
                        }}
                      >
                        {cmd.command}
                      </span>
                      <span
                        style={{
                          fontSize: '11px',
                          color: textMuted,
                          fontFamily: 'monospace',
                        }}
                      >
                        {cmd.count}×
                      </span>
                    </div>
                    <div
                      style={{
                        height: '3px',
                        borderRadius: '100px',
                        background: trackBg,
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          height: '100%',
                          borderRadius: '100px',
                          background: color,
                          width: `${pct}%`,
                          transition: 'width 0.4s',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Interactions avec l'agent */}
        <div
          style={{
            padding: '20px',
            borderRadius: '8px',
            border: `1px solid ${border}`,
            background: cardBg,
          }}
        >
          <div
            style={{
              fontSize: '12px',
              fontWeight: 600,
              color: textMain,
              marginBottom: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>Historique des requêtes Klixy Mentor</span>
            <span
              style={{ fontSize: '11px', color: textMuted, fontWeight: 500 }}
            >
              {AGENT_INTERACTIONS.length} requêtes interceptées
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {AGENT_INTERACTIONS.map((a, i) => {
              const cfg = INTERACTION_CONFIG[a.type];
              return (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: `1px solid ${border}`,
                    background: bg,
                  }}
                >
                  <span
                    style={{
                      fontSize: '10px',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: cfg.bg,
                      color: cfg.color,
                      border: `1px solid ${cfg.border}`,
                      fontWeight: 600,
                      flexShrink: 0,
                      textTransform: 'uppercase',
                      letterSpacing: '0.3px',
                    }}
                  >
                    {cfg.label}
                  </span>
                  <span
                    style={{
                      fontSize: '11px',
                      color: '#0055e5',
                      fontWeight: 600,
                      fontFamily: 'monospace',
                      flexShrink: 0,
                    }}
                  >
                    #{a.ticketId}
                  </span>
                  <span
                    style={{
                      fontSize: '12px',
                      color: textMain,
                      flex: 1,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      fontWeight: 400,
                    }}
                  >
                    "{a.question}"
                  </span>
                  <span
                    style={{
                      fontSize: '11px',
                      color: textMuted,
                      flexShrink: 0,
                      fontWeight: 500,
                    }}
                  >
                    {a.timestamp}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
