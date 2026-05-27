import React, { useState } from 'react';

// --- TYPES ---
type MessageType = 'incident' | 'formateur' | 'system';
type MessageStatus = 'unread' | 'read' | 'active';

interface InboxMessage {
  id: string;
  type: MessageType;
  from: string;
  fromInitials: string;
  fromColor: string;
  subject: string;
  preview: string;
  body: string;
  timestamp: string;
  status: MessageStatus;
  incidentId?: string;
  tags?: string[];
}

// --- DONNÉES MOCK ---
const MOCK_MESSAGES: InboxMessage[] = [
  {
    id: '1',
    type: 'incident',
    from: 'Klixy Arena',
    fromInitials: 'K',
    fromColor: '#0055e5',
    subject: 'Incident #INC-042 — Apache ne répond plus sur le port 80',
    preview: 'Le serveur web de la RH ne répond plus depuis ce matin...',
    body: `Un incident a été détecté sur l'infrastructure RH.

**Contexte :** Le serveur Apache hébergé sur \`srv-rh-01\` ne répond plus aux requêtes HTTP depuis 08h14. Les utilisateurs du service RH signalent une page blanche ou une erreur de connexion.

**Environnement :** Debian 13 · Apache 2.4 · Port 80/443

**Objectif :** Diagnostiquer la panne, identifier la cause racine et remettre le service en ligne. Documente chaque étape dans le terminal.

**Compétence visée :** CCP2 — Exploiter des serveurs Linux`,
    timestamp: '09:42',
    status: 'unread',
    incidentId: 'INC-042',
    tags: ['CCP2', 'Apache', 'Critique'],
  },
  {
    id: '2',
    type: 'incident',
    from: 'Klixy Arena',
    fromInitials: 'K',
    fromColor: '#0055e5',
    subject: 'Incident #INC-088 — Problème DNS interne',
    preview: 'Impossible de résoudre les noms de domaine du lab...',
    body: `Incident de résolution DNS détecté sur le réseau interne du lab.

**Contexte :** Depuis la dernière mise à jour du resolver, les machines du lab ne parviennent plus à résoudre les noms de domaine internes (\`*.klixy.local\`).

**Environnement :** Bind9 · Ubuntu 22.04 · Réseau 10.0.0.0/24

**Objectif :** Identifier la mauvaise configuration DNS, corriger le fichier de zone ou le resolver, valider avec \`dig\` et \`nslookup\`.

**Compétence visée :** CCP1 — Administrer les composants d'un réseau`,
    timestamp: 'Hier',
    status: 'read',
    incidentId: 'INC-088',
    tags: ['CCP1', 'DNS', 'Moyen'],
  },
  {
    id: '3',
    type: 'formateur',
    from: 'Marc Lefebvre',
    fromInitials: 'ML',
    fromColor: '#30a46c',
    subject: 'Retour sur ton lab INC-035 — Bien joué 👍',
    preview:
      "J'ai regardé ta session d'hier. Ta démarche de diagnostic était...",
    body: `Salut Henryck,

J'ai regardé le replay de ta session sur l'incident #INC-035 (fail2ban). Ta démarche de diagnostic était vraiment solide, tu as commencé par les logs avant de toucher à la config, c'est exactement ce qu'on attend d'un technicien en conditions réelles.

Un point à améliorer : pense à vérifier \`systemctl status\` avant \`journalctl\`, ça te donnera un aperçu plus rapide de l'état du service.

Continue comme ça, tu es bien parti pour le jury. Si tu bloques sur quoi que ce soit, n'hésite pas.

Bonne continuation,
Marc`,
    timestamp: 'Hier',
    status: 'read',
    tags: ['Feedback', 'fail2ban'],
  },
  {
    id: '4',
    type: 'system',
    from: 'Système',
    fromInitials: 'S',
    fromColor: '#8a8a93',
    subject: 'Votre session VM a expiré',
    preview: "La VM vm-apprenant-03 a été détruite après 2h d'inactivité...",
    body: `La machine virtuelle **vm-apprenant-03** associée à l'incident #INC-071 a été automatiquement détruite après 2 heures d'inactivité.

Vos actions dans le terminal ont été enregistrées et sont consultables dans l'onglet **Mes tickets**.

Vous pouvez relancer une nouvelle session à tout moment depuis l'Inbox.`,
    timestamp: 'Lun',
    status: 'read',
    tags: ['VM', 'Auto-destroy'],
  },
  {
    id: '5',
    type: 'incident',
    from: 'Klixy Arena',
    fromInitials: 'K',
    fromColor: '#0055e5',
    subject: 'Incident #INC-101 — Espace disque critique sur /var',
    preview: 'Le volume /var est à 97% de capacité, des services commencent...',
    body: `Alerte critique : saturation disque imminente.

**Contexte :** Le volume \`/var\` du serveur \`srv-prod-02\` est à 97% de capacité. Des services commencent à dysfonctionner (cron, syslog). Une intervention rapide est nécessaire.

**Environnement :** Debian 13 · LVM · ext4

**Objectif :** Identifier les fichiers/dossiers qui consomment l'espace, nettoyer proprement (logs, cache apt, fichiers temporaires) sans casser les services en cours.

**Compétence visée :** CCP2 — Maintenir un serveur Linux en conditions opérationnelles`,
    timestamp: 'Lun',
    status: 'read',
    incidentId: 'INC-101',
    tags: ['CCP2', 'Disque', 'Critique'],
  },
  {
    id: '6',
    type: 'formateur',
    from: 'Marc Lefebvre',
    fromInitials: 'ML',
    fromColor: '#30a46c',
    subject: 'Nouveau module disponible: Sécurité SSH',
    preview: "J'ai ajouté 3 nouveaux incidents autour du durcissement SSH...",
    body: `Bonjour Henryck,

J'ai ajouté 3 nouveaux incidents dans la catégorie **Sécurité SSH** pour compléter ta préparation au bloc CCP3.

Les scénarios couvrent :
- Désactivation de l'authentification par mot de passe
- Configuration de fail2ban pour SSH
- Audit des clés autorisées

Ces labs sont marqués "Avancé": prends-les après avoir validé les incidents Apache et DNS.

À bientôt,
Marc`,
    timestamp: 'Dim',
    status: 'read',
    tags: ['CCP3', 'SSH', 'Nouveau'],
  },
];

// --- ICÔNES ---
const IconIncident = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const IconFormateur = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
const IconSystem = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
const IconFilter = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);
const IconMore = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="5" cy="12" r="1" />
    <circle cx="12" cy="12" r="1" />
    <circle cx="19" cy="12" r="1" />
  </svg>
);

const IconTag = () => (
  <svg
    width="11"
    height="11"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
);

// --- TAG COLORS ---
const tagColor = (tag: string): { bg: string; color: string } => {
  if (tag === 'Critique')
    return { bg: 'rgba(255,80,80,0.12)', color: '#ff6b6b' };
  if (tag === 'Moyen') return { bg: 'rgba(255,180,0,0.12)', color: '#ffb800' };
  if (tag === 'Avancé')
    return { bg: 'rgba(160,100,255,0.12)', color: '#b06fff' };
  if (tag === 'Nouveau')
    return { bg: 'rgba(48,164,108,0.12)', color: '#30a46c' };
  if (tag === 'Feedback')
    return { bg: 'rgba(48,164,108,0.12)', color: '#30a46c' };
  if (['CCP1', 'CCP2', 'CCP3'].includes(tag))
    return { bg: 'rgba(0,85,229,0.12)', color: '#4d8fff' };
  return { bg: 'rgba(138,138,147,0.1)', color: '#8a8a93' };
};

// --- COMPOSANT PRINCIPAL ---
export default function InboxPanel({ dark }: { dark: boolean }) {
  const [selected, setSelected] = useState<string>('1');
  const [messages, setMessages] = useState<InboxMessage[]>(MOCK_MESSAGES);
  const [filter, setFilter] = useState<'all' | MessageType>('all');

  const border = dark ? '#27282b' : '#e8e8e5';
  const bg = dark ? '#0e0f11' : '#f7f7f9';
  const bgDetail = dark ? '#111113' : '#ffffff';
  const textMain = dark ? '#ededed' : '#111113';
  const textMuted = dark ? '#8a8a93' : '#6b6b6b';
  const hoverBg = dark ? '#ffffff0a' : '#00000008';
  const activeBg = dark ? '#ffffff12' : '#00000012';

  const filtered = messages.filter(
    (m) => filter === 'all' || m.type === filter,
  );
  const selectedMsg = messages.find((m) => m.id === selected) ?? null;
  const unreadCount = messages.filter((m) => m.status === 'unread').length;

  const handleSelect = (id: string) => {
    setSelected(id);
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: 'read' } : m)),
    );
  };

  const typeIcon = (type: MessageType) => {
    if (type === 'incident') return <IconIncident />;
    if (type === 'formateur') return <IconFormateur />;
    return <IconSystem />;
  };

  // Rendu du corps du message avec markdown basique
  const renderBody = (body: string) => {
    return body.split('\n').map((line, i) => {
      // Gras **texte**
      const parts = line.split(/\*\*(.*?)\*\*/g).map((part, j) =>
        j % 2 === 1 ? (
          <strong key={j} style={{ color: textMain, fontWeight: 600 }}>
            {part}
          </strong>
        ) : (
          <span key={j}>{part}</span>
        ),
      );
      // Code inline `code`
      const finalParts = parts.map((part, j) => {
        if (typeof part === 'string') {
          return part.split(/`(.*?)`/g).map((p, k) =>
            k % 2 === 1 ? (
              <code
                key={k}
                style={{
                  background: dark ? '#1e2030' : '#f0f0f5',
                  color: dark ? '#7eb8ff' : '#0055e5',
                  padding: '1px 5px',
                  borderRadius: '3px',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                }}
              >
                {p}
              </code>
            ) : (
              p
            ),
          );
        }
        return part;
      });
      return (
        <p
          key={i}
          style={{
            margin: line === '' ? '0 0 8px 0' : '0 0 4px 0',
            lineHeight: 1.7,
            fontSize: '13px',
            color: line.startsWith('**') ? textMain : textMuted,
          }}
        >
          {finalParts}
        </p>
      );
    });
  };

  return (
    <div
      style={{
        display: 'flex',
        height: '100%',
        fontFamily: '-apple-system, BlinkMacSystemFont, Inter, sans-serif',
        background: bg,
      }}
    >
      {/* ── COLONNE LISTE ── */}
      <div
        style={{
          width: '300px',
          flexShrink: 0,
          borderRight: `1px solid ${border}`,
          display: 'flex',
          flexDirection: 'column',
          background: bg,
        }}
      >
        {/* Header liste */}
        <div
          style={{
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            padding: '0 16px',
            borderBottom: `1px solid ${border}`,
            gap: '8px',
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
            Boîte de réception
          </span>
          {unreadCount > 0 && (
            <span
              style={{
                background: '#0055e5',
                color: '#fff',
                fontSize: '10px',
                fontWeight: 700,
                padding: '1px 6px',
                borderRadius: '10px',
              }}
            >
              {unreadCount}
            </span>
          )}
          <button
            style={{
              width: '26px',
              height: '26px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              color: textMuted,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '5px',
            }}
            title="Filtrer"
          >
            <IconFilter />
          </button>
        </div>

        {/* Filtres rapides */}
        <div
          style={{
            display: 'flex',
            gap: '4px',
            padding: '8px 12px',
            borderBottom: `1px solid ${border}`,
          }}
        >
          {(
            [
              ['all', 'Tous'],
              ['incident', 'Incidents'],
              ['formateur', 'Formateur'],
              ['system', 'Système'],
            ] as const
          ).map(([val, label]) => (
            <button
              key={val}
              onClick={() => setFilter(val)}
              style={{
                padding: '3px 8px',
                fontSize: '11px',
                fontWeight: 500,
                borderRadius: '5px',
                border: 'none',
                cursor: 'pointer',
                background:
                  filter === val
                    ? dark
                      ? '#ffffff18'
                      : '#00000012'
                    : 'transparent',
                color: filter === val ? textMain : textMuted,
                transition: 'background 0.1s',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Liste des messages */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {filtered.map((msg) => {
            const isActive = msg.id === selected;
            const isUnread = msg.status === 'unread';
            return (
              <div
                key={msg.id}
                onClick={() => handleSelect(msg.id)}
                style={{
                  padding: '10px 14px',
                  cursor: 'pointer',
                  background: isActive ? activeBg : 'transparent',
                  borderBottom: `1px solid ${border}`,
                  transition: 'background 0.1s',
                  position: 'relative',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.background = hoverBg;
                }}
                onMouseLeave={(e) => {
                  if (!isActive)
                    e.currentTarget.style.background = 'transparent';
                }}
              >
                {/* Indicateur non-lu */}
                {isUnread && (
                  <div
                    style={{
                      position: 'absolute',
                      left: '5px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '5px',
                      height: '5px',
                      borderRadius: '50%',
                      background: '#0055e5',
                    }}
                  />
                )}

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                  }}
                >
                  {/* Avatar */}
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: msg.fromColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontSize: '10px',
                      fontWeight: 700,
                      flexShrink: 0,
                      marginTop: '1px',
                    }}
                  >
                    {msg.fromInitials}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Ligne 1 : expéditeur + timestamp */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '2px',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '12px',
                          fontWeight: isUnread ? 600 : 500,
                          color: textMain,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                        }}
                      >
                        <span style={{ color: msg.fromColor, opacity: 0.8 }}>
                          {typeIcon(msg.type)}
                        </span>
                        {msg.from}
                      </span>
                      <span
                        style={{
                          fontSize: '11px',
                          color: textMuted,
                          flexShrink: 0,
                        }}
                      >
                        {msg.timestamp}
                      </span>
                    </div>

                    {/* Ligne 2 : sujet */}
                    <div
                      style={{
                        fontSize: '12px',
                        fontWeight: isUnread ? 600 : 400,
                        color: isUnread ? textMain : textMuted,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        marginBottom: '3px',
                      }}
                    >
                      {msg.subject}
                    </div>

                    {/* Ligne 3 : preview */}
                    <div
                      style={{
                        fontSize: '11px',
                        color: textMuted,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        opacity: 0.7,
                      }}
                    >
                      {msg.preview}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── PANNEAU DÉTAIL ── */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          background: bgDetail,
          minWidth: 0,
        }}
      >
        {selectedMsg ? (
          <>
            {/* Header détail */}
            <div
              style={{
                height: '48px',
                display: 'flex',
                alignItems: 'center',
                padding: '0 20px',
                borderBottom: `1px solid ${border}`,
                gap: '10px',
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
                {selectedMsg.subject}
              </span>
              <button
                style={{
                  width: '26px',
                  height: '26px',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  color: textMuted,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <IconMore />
              </button>
            </div>

            {/* Corps du message */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
              {/* Meta expéditeur */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '20px',
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: selectedMsg.fromColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: '12px',
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {selectedMsg.fromInitials}
                </div>
                <div>
                  <div
                    style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: textMain,
                    }}
                  >
                    {selectedMsg.from}
                  </div>
                  <div style={{ fontSize: '11px', color: textMuted }}>
                    {selectedMsg.timestamp}
                  </div>
                </div>

                {/* Tags */}
                {selectedMsg.tags && (
                  <div
                    style={{
                      display: 'flex',
                      gap: '5px',
                      marginLeft: 'auto',
                      flexWrap: 'wrap',
                      justifyContent: 'flex-end',
                    }}
                  >
                    {selectedMsg.tags.map((tag) => {
                      const c = tagColor(tag);
                      return (
                        <span
                          key={tag}
                          style={{
                            padding: '2px 7px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: 500,
                            background: c.bg,
                            color: c.color,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <IconTag />
                          {tag}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Séparateur */}
              <div
                style={{
                  height: '1px',
                  background: border,
                  marginBottom: '20px',
                }}
              />

              {/* Corps */}
              <div style={{ maxWidth: '640px' }}>
                {renderBody(selectedMsg.body)}
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
            Sélectionne un message
          </div>
        )}
      </div>
    </div>
  );
}
