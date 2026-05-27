import React, { useState, useContext, useEffect, useRef } from 'react';
import { LayoutCtx } from './Layout';

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
  hint: { label: 'Indice', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  validation: {
    label: 'Validation',
    color: '#30a46c',
    bg: 'rgba(48,164,108,0.1)',
  },
  suggestion: {
    label: 'Suggestion',
    color: '#4d8fff',
    bg: 'rgba(0,85,229,0.1)',
  },
};

// --- MINI BAR CHART ---
function BarChart({
  data,
  dark,
  textMuted,
  border,
}: {
  data: WeeklyData[];
  dark: boolean;
  textMuted: string;
  border: string;
}) {
  const maxVal = Math.max(...data.map((d) => d.tickets), 1);
  const barBg = dark ? '#27282b' : '#f0f0ee';

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: '8px',
        height: '80px',
        padding: '0 4px',
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
              gap: '4px',
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
                height: '60px',
              }}
            >
              <div
                style={{
                  width: '100%',
                  background: barBg,
                  borderRadius: '3px 3px 0 0',
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
                    background: d.hints > 0 ? '#f59e0b' : '#4d8fff',
                    borderRadius: '3px 3px 0 0',
                    transition: 'height 0.4s ease',
                    minHeight: d.tickets > 0 ? '4px' : '0',
                  }}
                />
              </div>
            </div>
            <span style={{ fontSize: '10px', color: textMuted }}>{d.day}</span>
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
        padding: '14px 16px',
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
          marginBottom: '6px',
          fontWeight: 500,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: '22px',
          fontWeight: 700,
          color,
          marginBottom: '2px',
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: '11px', color: dark ? '#8a8a93' : '#6b6b6b' }}>
          {sub}
        </div>
      )}
    </div>
  );
}

// --- COMPOSANT PRINCIPAL ---
export default function StatistiquesPanel() {
  const { dark } = useContext(LayoutCtx);

  const border = dark ? '#1f1f1f' : '#e8e8e5';
  const bg = dark ? '#0e0f11' : '#f7f7f9';
  const textMain = dark ? '#ededed' : '#111113';
  const textMuted = dark ? '#8a8a93' : '#6b6b6b';
  const cardBg = dark ? '#111113' : '#ffffff';
  const cardBorder = dark ? '#27282b' : '#e8e8e5';
  const trackBg = dark ? '#27282b' : '#f0f0ee';

  const totalTickets = 9;
  const resolvedAuto = 6; // sans indice
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
          Statistiques IA
        </span>
        <span style={{ marginLeft: '8px', fontSize: '11px', color: textMuted }}>
          Cette semaine
        </span>
      </div>

      <div
        style={{
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        {/* KPIs */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <StatCard
            label="Tickets résolus"
            value={String(totalTickets)}
            sub="cette semaine"
            color={textMain}
            dark={dark}
            border={cardBorder}
          />
          <StatCard
            label="Autonomie totale"
            value={`${resolvedAuto}/${totalTickets}`}
            sub="sans indice"
            color="#30a46c"
            dark={dark}
            border={cardBorder}
          />
          <StatCard
            label="Indices demandés"
            value={String(totalHints)}
            sub={`${Math.round((totalHints / totalTickets) * 10) / 10} par ticket`}
            color="#f59e0b"
            dark={dark}
            border={cardBorder}
          />
          <StatCard
            label="Temps moyen"
            value={avgTime}
            sub="par ticket"
            color="#4d8fff"
            dark={dark}
            border={cardBorder}
          />
        </div>

        {/* Graphique activité semaine */}
        <div
          style={{
            padding: '16px',
            borderRadius: '8px',
            border: `1px solid ${cardBorder}`,
            background: cardBg,
          }}
        >
          <div
            style={{
              fontSize: '12px',
              fontWeight: 600,
              color: textMain,
              marginBottom: '12px',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            Activité — 7 derniers jours
            <span
              style={{
                fontSize: '10px',
                color: textMuted,
                fontWeight: 400,
                display: 'flex',
                gap: '10px',
              }}
            >
              <span
                style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '2px',
                    background: '#4d8fff',
                    display: 'inline-block',
                  }}
                />{' '}
                Résolu
              </span>
              <span
                style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '2px',
                    background: '#f59e0b',
                    display: 'inline-block',
                  }}
                />{' '}
                Avec indice
              </span>
            </span>
          </div>
          <BarChart
            data={WEEKLY_DATA}
            dark={dark}
            textMuted={textMuted}
            border={border}
          />
        </div>

        {/* Score d'autonomie + top commandes */}
        <div style={{ display: 'flex', gap: '12px' }}>
          {/* Score autonomie */}
          <div
            style={{
              flex: 1,
              padding: '16px',
              borderRadius: '8px',
              border: `1px solid ${cardBorder}`,
              background: cardBg,
            }}
          >
            <div
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: textMain,
                marginBottom: '12px',
              }}
            >
              Score d'autonomie
            </div>
            {/* Gauge circulaire simplifiée */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '16px',
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
                    strokeWidth="7"
                  />
                  <circle
                    cx="36"
                    cy="36"
                    r="28"
                    fill="none"
                    stroke="#30a46c"
                    strokeWidth="7"
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
                    fontWeight: 500,
                    marginBottom: '4px',
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
                  {resolvedAuto} tickets résolus
                  <br />
                  sans demander d'aide
                </div>
              </div>
            </div>
            {/* Progression par CCP */}
            {[
              { ccp: 'CCP1', score: 85, color: '#4d8fff' },
              { ccp: 'CCP2', score: 72, color: '#30a46c' },
              { ccp: 'CCP3', score: 60, color: '#a78bfa' },
            ].map(({ ccp, score, color }) => (
              <div key={ccp} style={{ marginBottom: '8px' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '3px',
                  }}
                >
                  <span style={{ fontSize: '11px', color: textMuted }}>
                    {ccp}
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: 600, color }}>
                    {score}%
                  </span>
                </div>
                <div
                  style={{
                    height: '4px',
                    borderRadius: '2px',
                    background: trackBg,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      borderRadius: '2px',
                      background: color,
                      width: `${score}%`,
                      transition: 'width 0.4s',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Top commandes */}
          <div
            style={{
              flex: 1,
              padding: '16px',
              borderRadius: '8px',
              border: `1px solid ${cardBorder}`,
              background: cardBg,
            }}
          >
            <div
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: textMain,
                marginBottom: '12px',
              }}
            >
              Commandes les plus utilisées
            </div>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}
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
                        marginBottom: '2px',
                        alignItems: 'center',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '11px',
                          fontFamily: 'JetBrains Mono, Fira Code, monospace',
                          color: dark ? '#7eb8ff' : '#0055e5',
                        }}
                      >
                        {cmd.command}
                      </span>
                      <span
                        style={{
                          fontSize: '10px',
                          color: textMuted,
                          flexShrink: 0,
                          marginLeft: '8px',
                        }}
                      >
                        {cmd.count}×
                      </span>
                    </div>
                    <div
                      style={{
                        height: '3px',
                        borderRadius: '2px',
                        background: trackBg,
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          height: '100%',
                          borderRadius: '2px',
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
            padding: '16px',
            borderRadius: '8px',
            border: `1px solid ${cardBorder}`,
            background: cardBg,
          }}
        >
          <div
            style={{
              fontSize: '12px',
              fontWeight: 600,
              color: textMain,
              marginBottom: '12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            Interactions avec Klixy Agent
            <span
              style={{ fontSize: '10px', color: textMuted, fontWeight: 400 }}
            >
              {AGENT_INTERACTIONS.length} cette semaine
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {AGENT_INTERACTIONS.map((a, i) => {
              const cfg = INTERACTION_CONFIG[a.type];
              return (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '7px 10px',
                    borderRadius: '6px',
                    border: `1px solid ${border}`,
                  }}
                >
                  <span
                    style={{
                      fontSize: '10px',
                      padding: '2px 7px',
                      borderRadius: '4px',
                      background: cfg.bg,
                      color: cfg.color,
                      fontWeight: 600,
                      flexShrink: 0,
                    }}
                  >
                    {cfg.label}
                  </span>
                  <span
                    style={{
                      fontSize: '11px',
                      color: '#4d8fff',
                      fontWeight: 500,
                      flexShrink: 0,
                    }}
                  >
                    #{a.ticketId}
                  </span>
                  <span
                    style={{
                      fontSize: '12px',
                      color: textMuted,
                      flex: 1,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {a.question}
                  </span>
                  <span
                    style={{
                      fontSize: '10px',
                      color: textMuted,
                      flexShrink: 0,
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
