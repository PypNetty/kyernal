import { useState } from 'react';
import { Allotment } from 'allotment';
import 'allotment/dist/style.css';
import TerminalComponent from './Terminal';

const NAV_ITEMS = [
  { icon: '⬡', label: 'Labs', active: true },
  { icon: '◎', label: 'Historique' },
  { icon: '⊕', label: 'Progression' },
  { icon: '⊞', label: 'Ressources' },
];

type PanelType = 'term' | 'ticket';

interface AgentStep {
  status: 'success' | 'thinking' | 'executing' | 'failed';
  message: string;
  code?: string;
}

function Sidebar({ dark }: { dark: boolean }) {
  return (
    <div
      style={{
        width: '48px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '12px',
        gap: '4px',
        borderRight: `1px solid ${dark ? '#1f1f1f' : '#e8e8e5'}`,
        background: dark ? '#0c0c0d' : '#fafaf9',
      }}
    >
      <div
        style={{
          width: '28px',
          height: '28px',
          borderRadius: '6px',
          background: '#0066ff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          fontWeight: 700,
          color: '#fff',
          marginBottom: '16px',
        }}
      >
        K
      </div>
      {NAV_ITEMS.map((item) => (
        <div
          key={item.label}
          title={item.label}
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            cursor: 'pointer',
            background: item.active
              ? dark
                ? '#1f1f1f'
                : '#f0f0ed'
              : 'transparent',
            color: item.active
              ? dark
                ? '#ededed'
                : '#0f0f0f'
              : dark
                ? '#525252'
                : '#9b9b9b',
          }}
        >
          {item.icon}
        </div>
      ))}
      <div style={{ flex: 1 }} />
      <div
        style={{
          width: '26px',
          height: '26px',
          borderRadius: '50%',
          marginBottom: '12px',
          background: '#0066ff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '10px',
          fontWeight: 600,
          color: '#fff',
        }}
      >
        HP
      </div>
    </div>
  );
}

interface PanelProps {
  dark: boolean;
  onDragStart: (e: React.DragEvent, type: PanelType) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, target: PanelType) => void;
  isDraggedOver: boolean;
}

function TerminalPanel({
  dark,
  onDragStart,
  onDragOver,
  onDrop,
  isDraggedOver,
}: PanelProps) {
  return (
    <div
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, 'term')}
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        outline: isDraggedOver ? '2px dashed #0066ff' : 'none',
        outlineOffset: '-2px',
      }}
    >
      <div
        style={{
          height: '36px',
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          gap: '8px',
          flexShrink: 0,
          borderBottom: `1px solid ${dark ? '#1f1f1f' : '#e8e8e5'}`,
          background: dark ? '#0c0c0d' : '#fafaf9',
        }}
      >
        <span
          draggable
          onDragStart={(e) => onDragStart(e, 'term')}
          style={{
            fontSize: '12px',
            fontWeight: 600,
            color: dark ? '#ededed' : '#0f0f0f',
            cursor: 'grab',
            userSelect: 'none',
          }}
        >
          ☰ Terminal
        </span>
        <span style={{ fontSize: '11px', color: dark ? '#525252' : '#9b9b9b' }}>
          vm-apprenant-01
        </span>
        <div style={{ flex: 1 }} />
        <span
          style={{
            fontSize: '10px',
            padding: '2px 7px',
            borderRadius: '100px',
            border: '1px solid #30a46c44',
            color: '#30a46c',
            background: '#30a46c0f',
          }}
        >
          ● SSH
        </span>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <TerminalComponent />
      </div>
      <div
        style={{
          height: '28px',
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          gap: '10px',
          flexShrink: 0,
          borderTop: `1px solid ${dark ? '#1f1f1f' : '#e8e8e5'}`,
          background: dark ? '#0c0c0d' : '#fafaf9',
        }}
      >
        <span style={{ fontSize: '10px', color: dark ? '#525252' : '#9b9b9b' }}>
          Progression
        </span>
        <div
          style={{
            flex: 1,
            height: '2px',
            background: dark ? '#1f1f1f' : '#e8e8e5',
            borderRadius: '1px',
          }}
        >
          <div
            style={{
              width: '33%',
              height: '100%',
              background: '#30a46c',
              borderRadius: '1px',
            }}
          />
        </div>
        <span
          style={{
            fontSize: '10px',
            color: dark ? '#525252' : '#9b9b9b',
            fontFamily: 'monospace',
          }}
        >
          1/3
        </span>
        <span
          style={{
            fontSize: '10px',
            fontWeight: 600,
            color: '#30a46c',
            fontFamily: 'monospace',
          }}
        >
          67%
        </span>
      </div>
    </div>
  );
}

function TicketPanel({
  dark,
  onDragStart,
  onDragOver,
  onDrop,
  isDraggedOver,
}: PanelProps) {
  const border = dark ? '#1f1f1f' : '#e8e8e5';
  const bg = dark ? '#0c0c0d' : '#fafaf9';
  const bg2 = dark ? '#111113' : '#ffffff';
  const text = dark ? '#ededed' : '#0f0f0f';
  const text2 = dark ? '#a1a1aa' : '#6b6b6b';
  const text3 = dark ? '#525252' : '#9b9b9b';

  const agentSteps: AgentStep[] = [
    { status: 'success', message: 'Connexion SSH établie sur vm-01' },
    { status: 'success', message: 'Analyse de /var/log/apache2/error.log' },
    {
      status: 'executing',
      message: 'Inspection des sockets réseau',
      code: 'debian-13$ ss -tlnp | grep :80\nLISTEN 0 50 *:80  users:(("nginx",pid=1842,fd=6))',
    },
    { status: 'thinking', message: "Corrélation avec l'état du service..." },
  ];

  const events = [
    {
      time: '12:39:01',
      icon: '●',
      color: '#30a46c',
      text: 'Session Arena démarrée',
    },
    {
      time: '12:40:11',
      icon: '✓',
      color: '#30a46c',
      text: 'Objectif 1 validé — Diagnostic effectué',
    },
    {
      time: '12:41:02',
      icon: '⚠',
      color: '#f76b15',
      text: 'Tentative échouée sur /etc/hosts',
    },
  ];

  return (
    <div
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, 'ticket')}
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: bg2,
        minHeight: 0,
        outline: isDraggedOver ? '2px dashed #0066ff' : 'none',
        outlineOffset: '-2px',
      }}
    >
      <div
        style={{
          height: '36px',
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          gap: '8px',
          flexShrink: 0,
          borderBottom: `1px solid ${border}`,
          background: bg,
        }}
      >
        <span
          draggable
          onDragStart={(e) => onDragStart(e, 'ticket')}
          style={{
            fontSize: '12px',
            fontWeight: 600,
            color: text,
            cursor: 'grab',
            userSelect: 'none',
          }}
        >
          ☰ Ticket
        </span>
        <span style={{ fontSize: '11px', color: text3 }}>
          #042 · Apache down
        </span>
        <div style={{ flex: 1 }} />
        <span
          style={{
            fontSize: '10px',
            padding: '2px 7px',
            borderRadius: '100px',
            border: '1px solid #e5484d44',
            color: '#e5484d',
            background: '#e5484d0f',
          }}
        >
          ● Critique
        </span>
      </div>

      <div
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        {/* Infos ticket */}
        <div>
          <p
            style={{
              fontSize: '13px',
              fontWeight: 500,
              color: text,
              marginBottom: '10px',
              lineHeight: 1.4,
            }}
          >
            Apache ne répond plus sur le port 80
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '8px',
            }}
          >
            {[
              ['Signalé par', 'Utilisateur RH'],
              ['Depuis', '10 min'],
              ['Serveur', 'vm-01'],
              ['OS', 'Debian 13'],
            ].map(([k, v]) => (
              <div key={k}>
                <div
                  style={{
                    fontSize: '10px',
                    color: text3,
                    marginBottom: '2px',
                  }}
                >
                  {k}
                </div>
                <div
                  style={{
                    fontSize: '11px',
                    color: text2,
                    fontFamily: 'monospace',
                  }}
                >
                  {v}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ height: '1px', background: border }} />

        {/* Objectifs */}
        <div>
          <p
            style={{
              fontSize: '10px',
              color: text3,
              letterSpacing: '.5px',
              marginBottom: '8px',
            }}
          >
            OBJECTIFS
          </p>
          {[
            { done: true, active: false, text: 'Diagnostiquer la cause' },
            {
              done: false,
              active: true,
              text: 'Identifier le processus sur le port 80',
            },
            { done: false, active: false, text: 'Remettre Apache en service' },
          ].map((obj, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                padding: '5px 0',
                fontSize: '12px',
              }}
            >
              <div
                style={{
                  width: '15px',
                  height: '15px',
                  borderRadius: '50%',
                  flexShrink: 0,
                  marginTop: '1px',
                  border: `1.5px solid ${obj.done ? '#30a46c' : obj.active ? '#f76b15' : border}`,
                  background: obj.done ? '#30a46c14' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '8px',
                  color: '#30a46c',
                }}
              >
                {obj.done ? '✓' : ''}
              </div>
              <span
                style={{
                  color: obj.done ? text3 : text2,
                  textDecoration: obj.done ? 'line-through' : 'none',
                }}
              >
                {obj.text}
              </span>
            </div>
          ))}
        </div>

        <div style={{ height: '1px', background: border }} />

        {/* Timeline activité */}
        <div>
          <p
            style={{
              fontSize: '10px',
              color: text3,
              letterSpacing: '.5px',
              marginBottom: '8px',
            }}
          >
            ACTIVITÉ
          </p>
          {events.map((ev, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '3px 0',
                fontSize: '11px',
              }}
            >
              <span
                style={{
                  color: ev.color,
                  fontSize: '10px',
                  width: '10px',
                  textAlign: 'center',
                  flexShrink: 0,
                }}
              >
                {ev.icon}
              </span>
              <span
                style={{
                  color: text3,
                  fontFamily: 'monospace',
                  fontSize: '10px',
                  flexShrink: 0,
                }}
              >
                {ev.time}
              </span>
              <span style={{ color: text2 }}>{ev.text}</span>
            </div>
          ))}
        </div>

        <div style={{ height: '1px', background: border }} />

        {/* Agent Klixy */}
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '10px',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#0066ff',
                flexShrink: 0,
              }}
            />
            <p
              style={{
                fontSize: '10px',
                color: '#0066ff',
                letterSpacing: '.5px',
                fontWeight: 600,
              }}
            >
              KLIXY AGENT
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              marginBottom: '10px',
            }}
          >
            {agentSteps.map((step, i) => (
              <div key={i}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                    color: text2,
                  }}
                >
                  <span
                    style={{
                      color:
                        step.status === 'success'
                          ? '#30a46c'
                          : step.status === 'failed'
                            ? '#e5484d'
                            : step.status === 'thinking'
                              ? '#0066ff'
                              : '#f76b15',
                      fontSize: '10px',
                      width: '10px',
                      textAlign: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {step.status === 'success'
                      ? '✓'
                      : step.status === 'failed'
                        ? '✕'
                        : step.status === 'thinking'
                          ? '◌'
                          : '▶'}
                  </span>
                  <span
                    style={{
                      color: step.status === 'thinking' ? '#0066ff' : text2,
                    }}
                  >
                    {step.message}
                  </span>
                </div>
                {step.code && (
                  <pre
                    style={{
                      margin: '4px 0 4px 18px',
                      padding: '6px 8px',
                      background: dark ? '#09090b' : '#f0f0ed',
                      border: `1px solid ${border}`,
                      borderRadius: '4px',
                      fontSize: '10px',
                      color: '#f76b15',
                      overflowX: 'auto',
                      fontFamily: 'monospace',
                      lineHeight: 1.5,
                    }}
                  >
                    {step.code}
                  </pre>
                )}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            <input
              placeholder="Demander à l'agent (ou utilise le micro)..."
              style={{
                flex: 1,
                height: '30px',
                borderRadius: '6px',
                border: `1px solid ${border}`,
                background: bg,
                color: text,
                fontSize: '12px',
                padding: '0 10px',
                outline: 'none',
                fontFamily: 'inherit',
              }}
            />
            <button
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '6px',
                border: `1px solid ${border}`,
                background: '#0066ff',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ↑
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Arena() {
  const [dark, setDark] = useState(true);
  const [vertical, setVertical] = useState(false);
  const [reverseOrder, setReverseOrder] = useState(false);
  const [draggedOver, setDraggedOver] = useState<PanelType | null>(null);

  const border = dark ? '#1f1f1f' : '#e8e8e5';
  const bg = dark ? '#0c0c0d' : '#fafaf9';
  const text = dark ? '#ededed' : '#0f0f0f';
  const text2 = dark ? '#525252' : '#9b9b9b';

  const handleDragStart = (e: React.DragEvent, type: PanelType) => {
    e.dataTransfer.setData('text/plain', type);
  };

  const handleDrop = (e: React.DragEvent, target: PanelType) => {
    e.preventDefault();
    setDraggedOver(null);
    const source = e.dataTransfer.getData('text/plain') as PanelType;
    if (source && source !== target) {
      setReverseOrder(!reverseOrder);
    }
  };

  const panelLeftOrTop = (
    <TerminalPanel
      dark={dark}
      onDragStart={handleDragStart}
      onDragOver={(e) => {
        e.preventDefault();
        setDraggedOver('term');
      }}
      onDrop={handleDrop}
      isDraggedOver={draggedOver === 'term'}
    />
  );
  const panelRightOrBottom = (
    <TicketPanel
      dark={dark}
      onDragStart={handleDragStart}
      onDragOver={(e) => {
        e.preventDefault();
        setDraggedOver('ticket');
      }}
      onDrop={handleDrop}
      isDraggedOver={draggedOver === 'ticket'}
    />
  );

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: dark ? '#111113' : '#ffffff',
        color: text,
        fontFamily: '-apple-system, BlinkMacSystemFont, Inter, sans-serif',
      }}
    >
      <div
        style={{
          height: '40px',
          borderBottom: `1px solid ${border}`,
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          gap: '8px',
          justifyContent: 'space-between',
          flexShrink: 0,
          background: bg,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
          }}
        >
          <span style={{ color: text2 }}>Arena</span>
          <span style={{ color: border }}>/</span>
          <span style={{ color: text, fontWeight: 500 }}>Incident #042</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span
            style={{ fontSize: '11px', color: text2, fontFamily: 'monospace' }}
          >
            42:18
          </span>
          <div style={{ width: '1px', height: '14px', background: border }} />
          <button
            onClick={() => setVertical(!vertical)}
            style={{
              height: '26px',
              padding: '0 8px',
              borderRadius: '6px',
              cursor: 'pointer',
              border: `1px solid ${border}`,
              background: bg,
              color: text2,
              fontSize: '11px',
              fontFamily: 'inherit',
            }}
          >
            {vertical ? '⬜ Horizontal' : '▬ Vertical'}
          </button>
          <button
            onClick={() => setDark(!dark)}
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '6px',
              cursor: 'pointer',
              border: `1px solid ${border}`,
              background: bg,
              color: text2,
              fontSize: '12px',
            }}
          >
            {dark ? '☀' : '☾'}
          </button>
        </div>
      </div>

      <div
        style={{ flex: 1, display: 'flex', minHeight: 0 }}
        onDragLeave={() => setDraggedOver(null)}
      >
        <Sidebar dark={dark} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <Allotment key={`${vertical}-${reverseOrder}`} vertical={vertical}>
            <Allotment.Pane minSize={200}>
              {reverseOrder ? panelRightOrBottom : panelLeftOrTop}
            </Allotment.Pane>
            <Allotment.Pane minSize={200}>
              {reverseOrder ? panelLeftOrTop : panelRightOrBottom}
            </Allotment.Pane>
          </Allotment>
        </div>
      </div>
    </div>
  );
}
