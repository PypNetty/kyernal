import React, { useState, useContext } from 'react';
import { LayoutCtx } from '../../layout/components/Layout';

// --- TYPES ---
type AnnotationAuthor = 'formateur' | 'ia';
type RetourNote = 'positif' | 'neutre' | 'ameliorer';

interface Annotation {
  author: AnnotationAuthor;
  authorName: string;
  line?: string;
  comment: string;
}

interface TicketRetour {
  id: string;
  ticketId: string;
  ticketTitle: string;
  competence: string;
  resolvedAt: string;
  duration: string;
  hintsUsed: number;
  note: RetourNote;
  annotations: Annotation[];
}

// --- MOCK ---
const MOCK_RETOURS: TicketRetour[] = [
  {
    id: '1',
    ticketId: 'INC-035',
    ticketTitle: 'fail2ban bloque des IP légitimes',
    competence: 'CCP3',
    resolvedAt: 'Hier, 17h32',
    duration: '18 min',
    hintsUsed: 0,
    note: 'positif',
    annotations: [
      {
        author: 'formateur',
        authorName: 'Marc Lefebvre',
        line: 'sudo journalctl -u fail2ban --since "1 hour ago"',
        comment:
          "Bon réflexe de limiter la fenêtre temporelle avec --since. C'est exactement ce qu'on attend.",
      },
      {
        author: 'formateur',
        authorName: 'Marc Lefebvre',
        line: 'sudo fail2ban-client status sshd',
        comment: 'Vérification du bon jail, bonne commande.',
      },
      {
        author: 'formateur',
        authorName: 'Marc Lefebvre',
        line: 'sudo nano /etc/fail2ban/jail.local',
        comment:
          'Préfère `fail2ban-client set sshd unbanip` pour débannir sans éditer le fichier à chaud.',
      },
      {
        author: 'ia',
        authorName: 'Klixy Agent',
        comment:
          "Session résolue en autonomie totale. Aucun indice demandé. Score d'autonomie +12 pts.",
      },
    ],
  },
  {
    id: '2',
    ticketId: 'INC-021',
    ticketTitle: 'Nginx — erreur 502 Bad Gateway',
    competence: 'CCP2',
    resolvedAt: 'Mar, 14h10',
    duration: '12 min',
    hintsUsed: 0,
    note: 'positif',
    annotations: [
      {
        author: 'formateur',
        authorName: 'Marc Lefebvre',
        comment:
          "Parfait. Tu as suivi la bonne séquence sans hésitation : upstream → logs → redémarrage ciblé. C'est le niveau attendu pour le jury TSSR.",
      },
      {
        author: 'ia',
        authorName: 'Klixy Agent',
        line: 'systemctl status php8.2-fpm',
        comment:
          "Identification de l'upstream correcte dès la 2e commande. Temps de résolution excellent.",
      },
    ],
  },
  {
    id: '3',
    ticketId: 'INC-042',
    ticketTitle: 'Apache ne répond plus sur le port 80',
    competence: 'CCP2',
    resolvedAt: "Aujourd'hui, 09h15",
    duration: '23 min',
    hintsUsed: 2,
    note: 'ameliorer',
    annotations: [
      {
        author: 'ia',
        authorName: 'Klixy Agent',
        line: 'cat /var/log/apache2/error.log',
        comment:
          "Le fichier fait 40k lignes. Utilise `tail -n 50` ou `grep -i error` pour aller à l'essentiel.",
      },
      {
        author: 'ia',
        authorName: 'Klixy Agent',
        line: 'curl localhost',
        comment:
          'Tu aurais pu vérifier avec `ss -tlnp | grep :80` avant curl pour identifier quel processus occupe le port.',
      },
      {
        author: 'formateur',
        authorName: 'Marc Lefebvre',
        comment:
          "Session interrompue avant résolution complète. Reprends ce ticket — tu étais sur la bonne piste avec systemctl, il fallait juste aller jusqu'au bout.",
      },
    ],
  },
  {
    id: '4',
    ticketId: 'INC-009',
    ticketTitle: 'Partition /boot pleine après mise à jour',
    competence: 'CCP2',
    resolvedAt: '5 mai, 11h00',
    duration: '31 min',
    hintsUsed: 2,
    note: 'neutre',
    annotations: [
      {
        author: 'ia',
        authorName: 'Klixy Agent',
        line: 'df -h',
        comment: 'Bon réflexe en premier.',
      },
      {
        author: 'ia',
        authorName: 'Klixy Agent',
        line: 'apt autoremove',
        comment:
          "Nettoyage correct, mais `dpkg --list | grep linux-image` aurait permis d'identifier les anciens kernels plus rapidement.",
      },
      {
        author: 'formateur',
        authorName: 'Marc Lefebvre',
        comment:
          "2 indices demandés — l'objectif est d'arriver à 0. Relis le man de dpkg avant le prochain ticket similaire.",
      },
    ],
  },
];

// --- CONFIG ---
const NOTE_CONFIG: Record<
  RetourNote,
  { label: string; color: string; bg: string }
> = {
  positif: {
    label: '👍 Positif',
    color: '#30a46c',
    bg: 'rgba(48,164,108,0.1)',
  },
  neutre: { label: '→ Neutre', color: '#8a8a93', bg: 'rgba(138,138,147,0.1)' },
  ameliorer: {
    label: '⚠ À améliorer',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.1)',
  },
};

const AUTHOR_CONFIG: Record<
  AnnotationAuthor,
  { color: string; initials: string }
> = {
  formateur: { color: '#30a46c', initials: 'ML' },
  ia: { color: '#0055e5', initials: 'KA' },
};

// --- COMPOSANT PRINCIPAL ---
export default function RetourPanel() {
  const { dark } = useContext(LayoutCtx);
  const [selected, setSelected] = useState<string>('1');

  const border = dark ? '#27282b' : '#e8e8e5';
  const bg = dark ? '#0e0f11' : '#f7f7f9';
  const bgDetail = dark ? '#111113' : '#ffffff';
  const textMain = dark ? '#ededed' : '#111113';
  const textMuted = dark ? '#8a8a93' : '#6b6b6b';
  const hoverBg = dark ? '#ffffff0a' : '#00000008';
  const activeBg = dark ? '#ffffff12' : '#00000012';
  const codeBg = dark ? '#1a1b1e' : '#f4f4f6';

  const selectedRetour = MOCK_RETOURS.find((r) => r.id === selected) ?? null;

  return (
    <div
      style={{
        display: 'flex',
        height: '100%',
        fontFamily: '-apple-system, BlinkMacSystemFont, Inter, sans-serif',
        background: bg,
      }}
    >
      {/* ── LISTE TICKETS RÉSOLUS ── */}
      <div
        style={{
          width: '280px',
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
            Retours
          </span>
          <span
            style={{
              marginLeft: '8px',
              fontSize: '11px',
              color: textMuted,
              background: dark ? '#ffffff0f' : '#0000000a',
              padding: '1px 7px',
              borderRadius: '10px',
            }}
          >
            {MOCK_RETOURS.length}
          </span>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {MOCK_RETOURS.map((r) => {
            const isActive = r.id === selected;
            const noteCfg = NOTE_CONFIG[r.note];
            return (
              <div
                key={r.id}
                onClick={() => setSelected(r.id)}
                style={{
                  padding: '10px 14px',
                  cursor: 'pointer',
                  background: isActive ? activeBg : 'transparent',
                  borderBottom: `1px solid ${border}`,
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
                {/* ID + compétence */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '3px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '11px',
                      color: '#4d8fff',
                      fontWeight: 600,
                    }}
                  >
                    #{r.ticketId}
                  </span>
                  <span
                    style={{
                      fontSize: '10px',
                      padding: '1px 6px',
                      borderRadius: '4px',
                      background: 'rgba(0,85,229,0.1)',
                      color: '#4d8fff',
                      fontWeight: 500,
                    }}
                  >
                    {r.competence}
                  </span>
                </div>
                {/* Titre */}
                <div
                  style={{
                    fontSize: '12px',
                    color: textMain,
                    fontWeight: 500,
                    marginBottom: '5px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {r.ticketTitle}
                </div>
                {/* Meta */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span
                    style={{
                      fontSize: '10px',
                      padding: '2px 7px',
                      borderRadius: '4px',
                      background: noteCfg.bg,
                      color: noteCfg.color,
                      fontWeight: 500,
                    }}
                  >
                    {noteCfg.label}
                  </span>
                  <span style={{ fontSize: '10px', color: textMuted }}>
                    {r.resolvedAt}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── DÉTAIL ANNOTATIONS ── */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          background: bgDetail,
          minWidth: 0,
        }}
      >
        {selectedRetour ? (
          <>
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
              <div style={{ flex: 1, minWidth: 0 }}>
                <span
                  style={{ fontSize: '13px', fontWeight: 600, color: textMain }}
                >
                  #{selectedRetour.ticketId} — {selectedRetour.ticketTitle}
                </span>
              </div>
              <span
                style={{ fontSize: '11px', color: textMuted, flexShrink: 0 }}
              >
                {selectedRetour.duration}
              </span>
              {selectedRetour.hintsUsed > 0 && (
                <span
                  style={{
                    fontSize: '10px',
                    padding: '2px 7px',
                    borderRadius: '4px',
                    background: 'rgba(245,158,11,0.1)',
                    color: '#f59e0b',
                    fontWeight: 500,
                    flexShrink: 0,
                  }}
                >
                  {selectedRetour.hintsUsed} indice
                  {selectedRetour.hintsUsed > 1 ? 's' : ''}
                </span>
              )}
              <span
                style={{
                  fontSize: '11px',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  background: NOTE_CONFIG[selectedRetour.note].bg,
                  color: NOTE_CONFIG[selectedRetour.note].color,
                  fontWeight: 500,
                  flexShrink: 0,
                }}
              >
                {NOTE_CONFIG[selectedRetour.note].label}
              </span>
            </div>

            {/* Annotations */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: textMuted,
                  letterSpacing: '0.5px',
                  marginBottom: '14px',
                }}
              >
                {selectedRetour.annotations.length} ANNOTATION
                {selectedRetour.annotations.length > 1 ? 'S' : ''}
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  maxWidth: '680px',
                }}
              >
                {selectedRetour.annotations.map((a, i) => {
                  const authorCfg = AUTHOR_CONFIG[a.author];
                  return (
                    <div
                      key={i}
                      style={{
                        borderRadius: '7px',
                        border: `1px solid ${border}`,
                        overflow: 'hidden',
                      }}
                    >
                      {/* Ligne de commande si présente */}
                      {a.line && (
                        <div
                          style={{
                            padding: '8px 14px',
                            background: codeBg,
                            fontFamily: 'JetBrains Mono, Fira Code, monospace',
                            fontSize: '12px',
                            color: dark ? '#7eb8ff' : '#0055e5',
                            borderBottom: `1px solid ${border}`,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}
                        >
                          <span style={{ color: textMuted, opacity: 0.5 }}>
                            $
                          </span>
                          {a.line}
                        </div>
                      )}
                      {/* Commentaire */}
                      <div
                        style={{
                          padding: '10px 14px',
                          display: 'flex',
                          gap: '10px',
                          alignItems: 'flex-start',
                        }}
                      >
                        <div
                          style={{
                            width: '22px',
                            height: '22px',
                            borderRadius: '50%',
                            background: authorCfg.color,
                            flexShrink: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            fontSize: '8px',
                            fontWeight: 700,
                            marginTop: '1px',
                          }}
                        >
                          {authorCfg.initials}
                        </div>
                        <div>
                          <span
                            style={{
                              fontSize: '11px',
                              fontWeight: 600,
                              color: authorCfg.color,
                              marginRight: '6px',
                            }}
                          >
                            {a.authorName}
                          </span>
                          <span
                            style={{
                              fontSize: '12px',
                              color: textMuted,
                              lineHeight: 1.6,
                            }}
                          >
                            {a.comment}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: textMuted,
              fontSize: '13px',
            }}
          >
            Sélectionne un ticket
          </div>
        )}
      </div>
    </div>
  );
}
