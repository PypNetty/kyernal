import React, { useState, useContext } from 'react';
import { LayoutCtx } from './Layout';

// --- TYPES ---
interface CompetenceItem {
  id: string;
  label: string;
  validated: boolean;
  ticketIds: string[];
}

interface CCP {
  id: string;
  code: string;
  title: string;
  description: string;
  color: string;
  competences: CompetenceItem[];
}

// --- MOCK ---
const MOCK_CCPS: CCP[] = [
  {
    id: 'ccp1',
    code: 'CCP1',
    title: "Administrer les composants d'un réseau",
    description:
      'Configurer et maintenir les équipements réseau, assurer la connectivité et diagnostiquer les pannes.',
    color: '#4d8fff',
    competences: [
      {
        id: 'c1',
        label: "Configurer les paramètres réseau d'un poste",
        validated: true,
        ticketIds: ['INC-008'],
      },
      {
        id: 'c2',
        label: 'Mettre en place et tester une connexion réseau',
        validated: true,
        ticketIds: ['INC-012'],
      },
      {
        id: 'c3',
        label: 'Diagnostiquer un dysfonctionnement réseau',
        validated: true,
        ticketIds: ['INC-088'],
      },
      {
        id: 'c4',
        label: 'Configurer un serveur DNS',
        validated: true,
        ticketIds: ['INC-088', 'INC-014'],
      },
      {
        id: 'c5',
        label: 'Mettre en place un serveur DHCP',
        validated: false,
        ticketIds: [],
      },
      {
        id: 'c6',
        label: 'Configurer un pare-feu (iptables / nftables)',
        validated: false,
        ticketIds: [],
      },
      {
        id: 'c7',
        label: 'Mettre en place un VPN site-à-site',
        validated: false,
        ticketIds: [],
      },
    ],
  },
  {
    id: 'ccp2',
    code: 'CCP2',
    title: 'Exploiter des serveurs Linux',
    description:
      'Installer, configurer et maintenir des serveurs Linux en conditions opérationnelles.',
    color: '#30a46c',
    competences: [
      {
        id: 'c8',
        label: 'Installer et configurer un système Linux',
        validated: true,
        ticketIds: ['INC-003'],
      },
      {
        id: 'c9',
        label: 'Gérer les utilisateurs et les permissions',
        validated: true,
        ticketIds: ['INC-007'],
      },
      {
        id: 'c10',
        label: 'Configurer et maintenir un serveur web (Apache/Nginx)',
        validated: true,
        ticketIds: ['INC-021', 'INC-042'],
      },
      {
        id: 'c11',
        label: 'Gérer les services systemd',
        validated: true,
        ticketIds: ['INC-035'],
      },
      {
        id: 'c12',
        label: 'Surveiller et optimiser les ressources système',
        validated: true,
        ticketIds: ['INC-009', 'INC-101'],
      },
      {
        id: 'c13',
        label: 'Mettre en place des sauvegardes',
        validated: false,
        ticketIds: [],
      },
      {
        id: 'c14',
        label: 'Automatiser des tâches avec cron et scripts bash',
        validated: false,
        ticketIds: ['INC-115'],
      },
      {
        id: 'c15',
        label: 'Déployer et gérer des conteneurs Docker',
        validated: false,
        ticketIds: [],
      },
    ],
  },
  {
    id: 'ccp3',
    code: 'CCP3',
    title: 'Sécuriser les infrastructures',
    description:
      'Mettre en œuvre et maintenir la sécurité des systèmes et des réseaux.',
    color: '#a78bfa',
    competences: [
      {
        id: 'c16',
        label: 'Durcir la configuration SSH',
        validated: true,
        ticketIds: ['INC-077'],
      },
      {
        id: 'c17',
        label: 'Mettre en place fail2ban',
        validated: true,
        ticketIds: ['INC-035'],
      },
      {
        id: 'c18',
        label: 'Configurer les permissions sudo',
        validated: false,
        ticketIds: [],
      },
      {
        id: 'c19',
        label: 'Mettre en place une PKI / certificats TLS',
        validated: false,
        ticketIds: [],
      },
      {
        id: 'c20',
        label: "Auditer la sécurité d'un système",
        validated: false,
        ticketIds: [],
      },
      {
        id: 'c21',
        label: 'Configurer SELinux / AppArmor',
        validated: false,
        ticketIds: [],
      },
    ],
  },
];

// --- HELPERS ---
function getProgress(ccp: CCP) {
  const total = ccp.competences.length;
  const validated = ccp.competences.filter((c) => c.validated).length;
  return { validated, total, pct: Math.round((validated / total) * 100) };
}

function progressColor(pct: number, color: string) {
  return color;
}

// --- COMPOSANT PRINCIPAL ---
export default function CompetencePanel() {
  const { dark } = useContext(LayoutCtx);
  const [selected, setSelected] = useState<string>('ccp1');

  const border = dark ? '#27282b' : '#e8e8e5';
  const bg = dark ? '#0e0f11' : '#f7f7f9';
  const bgDetail = dark ? '#111113' : '#ffffff';
  const textMain = dark ? '#ededed' : '#111113';
  const textMuted = dark ? '#8a8a93' : '#6b6b6b';
  const hoverBg = dark ? '#ffffff0a' : '#00000008';
  const activeBg = dark ? '#ffffff12' : '#00000012';
  const trackBg = dark ? '#27282b' : '#e8e8e5';

  const selectedCCP = MOCK_CCPS.find((c) => c.id === selected)!;
  const selectedProgress = getProgress(selectedCCP);

  return (
    <div
      style={{
        display: 'flex',
        height: '100%',
        fontFamily: '-apple-system, BlinkMacSystemFont, Inter, sans-serif',
        background: bg,
      }}
    >
      {/* ── LISTE CCP ── */}
      <div
        style={{
          width: '260px',
          flexShrink: 0,
          borderRight: `1px solid ${border}`,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            padding: '0 16px',
            borderBottom: `1px solid ${border}`,
          }}
        >
          <span style={{ fontSize: '13px', fontWeight: 600, color: textMain }}>
            Compétences
          </span>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', paddingTop: '8px' }}>
          {MOCK_CCPS.map((ccp) => {
            const { validated, total, pct } = getProgress(ccp);
            const isActive = ccp.id === selected;
            return (
              <div
                key={ccp.id}
                onClick={() => setSelected(ccp.id)}
                style={{
                  padding: '12px 16px',
                  cursor: 'pointer',
                  margin: '2px 8px',
                  borderRadius: '7px',
                  background: isActive ? activeBg : 'transparent',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.background = hoverBg;
                }}
                onMouseLeave={(e) => {
                  if (!isActive)
                    e.currentTarget.style.background = 'transparent';
                }}
              >
                {/* Code + badge */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '4px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      color: ccp.color,
                    }}
                  >
                    {ccp.code}
                  </span>
                  <span style={{ fontSize: '11px', color: textMuted }}>
                    {validated}/{total}
                  </span>
                </div>

                {/* Titre */}
                <div
                  style={{
                    fontSize: '12px',
                    color: textMain,
                    fontWeight: 500,
                    marginBottom: '8px',
                    lineHeight: 1.4,
                  }}
                >
                  {ccp.title}
                </div>

                {/* Barre de progression */}
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
                      background: ccp.color,
                      width: `${pct}%`,
                      transition: 'width 0.4s ease',
                    }}
                  />
                </div>
                <div
                  style={{
                    fontSize: '10px',
                    color: textMuted,
                    marginTop: '4px',
                    textAlign: 'right',
                  }}
                >
                  {pct}%
                </div>
              </div>
            );
          })}
        </div>

        {/* Score global */}
        <div style={{ padding: '12px 16px', borderTop: `1px solid ${border}` }}>
          {(() => {
            const totalAll = MOCK_CCPS.reduce(
              (s, c) => s + c.competences.length,
              0,
            );
            const validatedAll = MOCK_CCPS.reduce(
              (s, c) => s + c.competences.filter((x) => x.validated).length,
              0,
            );
            const pctAll = Math.round((validatedAll / totalAll) * 100);
            return (
              <>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '6px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      color: textMuted,
                      letterSpacing: '0.4px',
                    }}
                  >
                    PROGRESSION GLOBALE
                  </span>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color: textMain,
                    }}
                  >
                    {pctAll}%
                  </span>
                </div>
                <div
                  style={{
                    height: '5px',
                    borderRadius: '3px',
                    background: trackBg,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      borderRadius: '3px',
                      background:
                        'linear-gradient(90deg, #4d8fff, #30a46c, #a78bfa)',
                      width: `${pctAll}%`,
                      transition: 'width 0.4s ease',
                    }}
                  />
                </div>
              </>
            );
          })()}
        </div>
      </div>

      {/* ── DÉTAIL CCP ── */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          background: bgDetail,
          minWidth: 0,
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
            gap: '12px',
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              color: selectedCCP.color,
              letterSpacing: '0.5px',
            }}
          >
            {selectedCCP.code}
          </span>
          <span
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: textMain,
              flex: 1,
            }}
          >
            {selectedCCP.title}
          </span>
          <span style={{ fontSize: '12px', color: textMuted }}>
            {selectedProgress.validated}/{selectedProgress.total} validées
          </span>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '5px',
              background: `${selectedCCP.color}18`,
              color: selectedCCP.color,
            }}
          >
            {selectedProgress.pct}%
          </span>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          {/* Description */}
          <p
            style={{
              fontSize: '13px',
              color: textMuted,
              lineHeight: 1.7,
              marginBottom: '20px',
              marginTop: 0,
            }}
          >
            {selectedCCP.description}
          </p>

          {/* Barre de progression détail */}
          <div style={{ marginBottom: '24px' }}>
            <div
              style={{
                height: '6px',
                borderRadius: '3px',
                background: trackBg,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  borderRadius: '3px',
                  background: selectedCCP.color,
                  width: `${selectedProgress.pct}%`,
                  transition: 'width 0.4s ease',
                }}
              />
            </div>
          </div>

          {/* Groupes validé / à faire */}
          {(['validated', 'todo'] as const).map((group) => {
            const items = selectedCCP.competences.filter((c) =>
              group === 'validated' ? c.validated : !c.validated,
            );
            if (items.length === 0) return null;

            return (
              <div key={group} style={{ marginBottom: '20px' }}>
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    color: textMuted,
                    letterSpacing: '0.5px',
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  {group === 'validated' ? (
                    <>
                      <span style={{ color: '#30a46c' }}>✓</span> VALIDÉES (
                      {items.length})
                    </>
                  ) : (
                    <>
                      <span style={{ color: textMuted }}>○</span> À VALIDER (
                      {items.length})
                    </>
                  )}
                </div>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}
                >
                  {items.map((comp) => (
                    <div
                      key={comp.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: `1px solid ${border}`,
                        background:
                          group === 'validated'
                            ? dark
                              ? 'rgba(48,164,108,0.04)'
                              : 'rgba(48,164,108,0.03)'
                            : 'transparent',
                      }}
                    >
                      {/* Checkbox */}
                      <div
                        style={{
                          width: '16px',
                          height: '16px',
                          borderRadius: '4px',
                          flexShrink: 0,
                          border: `1.5px solid ${group === 'validated' ? '#30a46c' : border}`,
                          background:
                            group === 'validated' ? '#30a46c' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {group === 'validated' && (
                          <svg
                            width="9"
                            height="9"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#fff"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                        )}
                      </div>

                      {/* Label */}
                      <span
                        style={{
                          fontSize: '13px',
                          flex: 1,
                          color: group === 'validated' ? textMain : textMuted,
                          opacity: group === 'validated' ? 1 : 0.8,
                        }}
                      >
                        {comp.label}
                      </span>

                      {/* Tickets associés */}
                      {comp.ticketIds.length > 0 && (
                        <div style={{ display: 'flex', gap: '4px' }}>
                          {comp.ticketIds.map((tid) => (
                            <span
                              key={tid}
                              style={{
                                fontSize: '10px',
                                padding: '1px 6px',
                                borderRadius: '4px',
                                background: 'rgba(0,85,229,0.1)',
                                color: '#4d8fff',
                                fontWeight: 500,
                              }}
                            >
                              #{tid}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
