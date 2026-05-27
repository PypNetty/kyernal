import React, { useState, useContext, useEffect } from 'react';
import { LayoutCtx } from './Layout';

// --- TYPES ---
type ResourceType = 'doc' | 'man' | 'cours' | 'cheatsheet' | 'video';
type ResourceCategory = 'linux' | 'reseau' | 'securite' | 'web' | 'outils';

interface Resource {
  id: string;
  type: ResourceType;
  category: ResourceCategory;
  title: string;
  description: string;
  url?: string;
  tags: string[];
  ccps: string[]; // CCP concernés
  pinned?: boolean;
}

// --- MOCK ---
const MOCK_RESOURCES: Resource[] = [
  {
    id: '1',
    type: 'doc',
    category: 'linux',
    ccps: ['CCP2'],
    title: 'Arch Wiki — systemd',
    description:
      'Référence complète sur systemd, les services, les timers et le journal.',
    url: 'https://wiki.archlinux.org/title/Systemd',
    tags: ['systemd', 'services'],
    pinned: true,
  },
  {
    id: '2',
    type: 'man',
    category: 'linux',
    ccps: ['CCP2'],
    title: 'man journalctl',
    description: 'Consulter et filtrer les logs du journal systemd.',
    url: 'https://man7.org/linux/man-pages/man1/journalctl.1.html',
    tags: ['logs', 'debug'],
  },
  {
    id: '3',
    type: 'man',
    category: 'linux',
    ccps: ['CCP2'],
    title: 'man find',
    description: 'Recherche de fichiers avec critères avancés.',
    url: 'https://man7.org/linux/man-pages/man1/find.1.html',
    tags: ['fichiers', 'recherche'],
  },
  {
    id: '4',
    type: 'cheatsheet',
    category: 'linux',
    ccps: ['CCP2'],
    title: 'Cheatsheet — commandes disque',
    description: 'df, du, lsblk, fdisk, parted — référence rapide.',
    url: 'https://devhints.io/bash',
    tags: ['disque', 'stockage'],
    pinned: true,
  },
  {
    id: '5',
    type: 'cours',
    category: 'linux',
    ccps: ['CCP2'],
    title: 'Cours — Administration Linux',
    description: 'Module complet en préparation — disponible prochainement.',
    tags: ['linux', 'administration'],
  },
  {
    id: '6',
    type: 'doc',
    category: 'reseau',
    ccps: ['CCP1'],
    title: 'RFC 1035 — DNS',
    description: 'Spécification originale du protocole DNS.',
    url: 'https://www.rfc-editor.org/rfc/rfc1035',
    tags: ['DNS', 'protocole'],
  },
  {
    id: '7',
    type: 'man',
    category: 'reseau',
    ccps: ['CCP1'],
    title: 'man ss',
    description: 'Lister les connexions réseau, ports ouverts et sockets.',
    url: 'https://man7.org/linux/man-pages/man8/ss.8.html',
    tags: ['ports', 'sockets'],
  },
  {
    id: '8',
    type: 'cheatsheet',
    category: 'reseau',
    ccps: ['CCP1'],
    title: 'Cheatsheet — iptables',
    description: 'Règles de base, chaînes INPUT/OUTPUT/FORWARD, NAT.',
    url: 'https://andreafortuna.org/2019/05/08/iptables-a-simple-cheatsheet/',
    tags: ['firewall', 'iptables'],
  },
  {
    id: '9',
    type: 'doc',
    category: 'reseau',
    ccps: ['CCP1'],
    title: 'Bind9 — Configuration DNS',
    description:
      'Documentation officielle Bind9 pour la configuration de zones.',
    url: 'https://bind9.readthedocs.io/',
    tags: ['DNS', 'bind9'],
  },
  {
    id: '10',
    type: 'doc',
    category: 'securite',
    ccps: ['CCP3'],
    title: 'CIS Benchmark — Debian',
    description: 'Guide de durcissement CIS pour Debian Linux.',
    url: 'https://www.cisecurity.org/benchmark/debian_linux',
    tags: ['durcissement', 'CIS'],
    pinned: true,
  },
  {
    id: '11',
    type: 'man',
    category: 'securite',
    ccps: ['CCP3'],
    title: 'man fail2ban-client',
    description: 'Gestion des jails, des IPs bannies et des actions fail2ban.',
    url: 'https://www.fail2ban.org/wiki/index.php/Commands',
    tags: ['fail2ban', 'SSH'],
  },
  {
    id: '12',
    type: 'cheatsheet',
    category: 'securite',
    ccps: ['CCP3'],
    title: 'Cheatsheet — OpenSSH hardening',
    description: 'Paramètres sshd_config recommandés pour la production.',
    url: 'https://infosec.mozilla.org/guidelines/openssh',
    tags: ['SSH', 'durcissement'],
  },
  {
    id: '13',
    type: 'doc',
    category: 'web',
    ccps: ['CCP2'],
    title: 'Apache — doc officielle',
    description:
      'Configuration, modules, virtual hosts et troubleshooting Apache.',
    url: 'https://httpd.apache.org/docs/2.4/',
    tags: ['Apache', 'HTTP'],
  },
  {
    id: '14',
    type: 'doc',
    category: 'web',
    ccps: ['CCP2'],
    title: "Nginx — Beginner's guide",
    description: 'Configuration de base, proxy_pass, SSL et logs Nginx.',
    url: 'https://nginx.org/en/docs/beginners_guide.html',
    tags: ['Nginx', 'proxy'],
  },
  {
    id: '15',
    type: 'cheatsheet',
    category: 'web',
    ccps: ['CCP2'],
    title: 'Cheatsheet — curl',
    description:
      'Options curl les plus utiles pour tester des APIs et des serveurs web.',
    url: 'https://devhints.io/curl',
    tags: ['curl', 'HTTP'],
  },
  {
    id: '16',
    type: 'cheatsheet',
    category: 'outils',
    ccps: ['CCP1', 'CCP2', 'CCP3'],
    title: 'Cheatsheet — vim',
    description: 'Mouvements, modes, recherche et remplacement dans vim.',
    url: 'https://devhints.io/vim',
    tags: ['vim', 'éditeur'],
  },
  {
    id: '17',
    type: 'cheatsheet',
    category: 'outils',
    ccps: ['CCP1', 'CCP2', 'CCP3'],
    title: 'Cheatsheet — tmux',
    description: 'Sessions, fenêtres, panneaux et raccourcis tmux.',
    url: 'https://devhints.io/tmux',
    tags: ['tmux', 'terminal'],
  },
  {
    id: '18',
    type: 'doc',
    category: 'outils',
    ccps: ['CCP2', 'CCP3'],
    title: 'Bash — Guide avancé',
    description:
      'Variables, fonctions, tableaux, substitutions et bonnes pratiques bash.',
    url: 'https://tldp.org/LDP/abs/html/',
    tags: ['bash', 'scripting'],
  },
];

// CCP de l'apprenant (viendra du backend)
const APPRENANT_CCPS = ['CCP2', 'CCP3'];

// --- CONFIG ---
const TYPE_CONFIG: Record<
  ResourceType,
  { label: string; color: string; bg: string; icon: React.ReactNode }
> = {
  doc: {
    label: 'Doc',
    color: '#4d8fff',
    bg: 'rgba(0,85,229,0.1)',
    icon: (
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
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    ),
  },
  man: {
    label: 'Man',
    color: '#22d3ee',
    bg: 'rgba(34,211,238,0.1)',
    icon: (
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
        <polyline points="4 17 10 11 4 5" />
        <line x1="12" y1="19" x2="20" y2="19" />
      </svg>
    ),
  },
  cours: {
    label: 'Cours',
    color: '#a78bfa',
    bg: 'rgba(167,139,250,0.1)',
    icon: (
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
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    ),
  },
  cheatsheet: {
    label: 'Cheatsheet',
    color: '#30a46c',
    bg: 'rgba(48,164,108,0.1)',
    icon: (
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
        <line x1="8" y1="6" x2="21" y2="6" />
        <line x1="8" y1="12" x2="21" y2="12" />
        <line x1="8" y1="18" x2="21" y2="18" />
        <line x1="3" y1="6" x2="3.01" y2="6" />
        <line x1="3" y1="12" x2="3.01" y2="12" />
        <line x1="3" y1="18" x2="3.01" y2="18" />
      </svg>
    ),
  },
  video: {
    label: 'Vidéo',
    color: '#f97316',
    bg: 'rgba(249,115,22,0.1)',
    icon: (
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
        <polygon points="23 7 16 12 23 17 23 7" />
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
      </svg>
    ),
  },
};

const IconExternal = () => (
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
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);
const IconLock = () => (
  <svg
    width="10"
    height="10"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
const IconEye = () => (
  <svg
    width="10"
    height="10"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

// --- COMPOSANT CARTE ---
function ResourceCard({
  r,
  dark,
  textMain,
  textMuted,
  cardBorder,
  onOpen,
  views,
}: {
  r: Resource;
  dark: boolean;
  textMain: string;
  textMuted: string;
  cardBorder: string;
  onOpen: (r: Resource) => void;
  views: number;
}) {
  const [hovered, setHovered] = useState(false);
  const typeCfg = TYPE_CONFIG[r.type];
  const isComingSoon = r.type === 'cours' && !r.url;
  const isRelevant = r.ccps.some((c) => APPRENANT_CCPS.includes(c));

  return (
    <div
      onClick={() => !isComingSoon && onOpen(r)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '12px 14px',
        borderRadius: '7px',
        border: `1px solid ${
          hovered && !isComingSoon
            ? dark
              ? '#ffffff22'
              : '#00000020'
            : isRelevant
              ? dark
                ? '#ffffff14'
                : '#00000010'
              : cardBorder
        }`,
        background: isRelevant
          ? dark
            ? '#13141a'
            : '#fafffe'
          : dark
            ? '#111113'
            : '#ffffff',
        cursor: isComingSoon ? 'default' : 'pointer',
        transition: 'border 0.1s, transform 0.1s',
        opacity: isComingSoon ? 0.55 : 1,
        transform: hovered && !isComingSoon ? 'translateY(-1px)' : 'none',
        position: 'relative',
      }}
    >
      {/* Bandeau CCP si pertinent */}
      {isRelevant && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            display: 'flex',
            gap: '2px',
            padding: '4px 8px',
          }}
        >
          {r.ccps
            .filter((c) => APPRENANT_CCPS.includes(c))
            .map((c) => (
              <span
                key={c}
                style={{
                  fontSize: '9px',
                  padding: '1px 5px',
                  borderRadius: '3px',
                  background: 'rgba(0,85,229,0.15)',
                  color: '#4d8fff',
                  fontWeight: 700,
                }}
              >
                {c}
              </span>
            ))}
        </div>
      )}

      {/* Type + actions */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          marginBottom: '6px',
          paddingRight: isRelevant ? '40px' : '0',
        }}
      >
        <span
          style={{
            fontSize: '10px',
            padding: '2px 6px',
            borderRadius: '4px',
            background: typeCfg.bg,
            color: typeCfg.color,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          {typeCfg.icon} {typeCfg.label}
        </span>

        <span
          style={{
            marginLeft: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          {/* Compteur de vues */}
          {views > 0 && (
            <span
              style={{
                fontSize: '10px',
                color: textMuted,
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
              }}
            >
              <IconEye /> {views}
            </span>
          )}
          {isComingSoon && (
            <span
              style={{
                fontSize: '10px',
                color: textMuted,
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
              }}
            >
              <IconLock /> Bientôt
            </span>
          )}
          {!isComingSoon && hovered && (
            <span style={{ color: textMuted }}>
              <IconExternal />
            </span>
          )}
        </span>
      </div>

      {/* Titre */}
      <div
        style={{
          fontSize: '13px',
          fontWeight: 600,
          color: textMain,
          marginBottom: '4px',
        }}
      >
        {r.title}
      </div>

      {/* Description */}
      <div
        style={{
          fontSize: '12px',
          color: textMuted,
          lineHeight: 1.5,
          marginBottom: '8px',
        }}
      >
        {r.description}
      </div>

      {/* Tags */}
      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
        {r.tags.map((tag) => (
          <span
            key={tag}
            style={{
              fontSize: '10px',
              padding: '1px 6px',
              borderRadius: '4px',
              background: dark ? '#ffffff08' : '#0000000a',
              color: textMuted,
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

// --- COMPOSANT PRINCIPAL ---
export default function RessourcesPanel() {
  const { dark } = useContext(LayoutCtx);
  const [ccpFilter, setCcpFilter] = useState<string>('mes-ccps');
  const [search, setSearch] = useState('');
  // Compteur de vues : Record<resourceId, count>
  const [views, setViews] = useState<Record<string, number>>({});

  // Charger les vues depuis localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('klixy_resource_views');
      if (saved) setViews(JSON.parse(saved));
    } catch {}
  }, []);

  const handleOpen = (r: Resource) => {
    if (!r.url) return;
    const updated = { ...views, [r.id]: (views[r.id] ?? 0) + 1 };
    setViews(updated);
    try {
      localStorage.setItem('klixy_resource_views', JSON.stringify(updated));
    } catch {}
    window.open(r.url, '_blank');
  };

  const border = dark ? '#1f1f1f' : '#e8e8e5';
  const bg = dark ? '#0e0f11' : '#f7f7f9';
  const textMain = dark ? '#ededed' : '#111113';
  const textMuted = dark ? '#8a8a93' : '#6b6b6b';
  const inputBg = dark ? '#17181a' : '#f0f0ee';
  const cardBorder = dark ? '#27282b' : '#e8e8e5';

  const ALL_CCPS = ['CCP1', 'CCP2', 'CCP3'];

  const filtered = MOCK_RESOURCES.filter((r) => {
    const matchCcp =
      ccpFilter === 'all'
        ? true
        : ccpFilter === 'mes-ccps'
          ? r.ccps.some((c) => APPRENANT_CCPS.includes(c))
          : r.ccps.includes(ccpFilter);
    const matchSearch =
      search === '' ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchCcp && matchSearch;
  });

  // Tri : pertinents (CCP apprenant) en premier, puis par vues décroissantes
  const sorted = [...filtered].sort((a, b) => {
    const aRel = a.ccps.some((c) => APPRENANT_CCPS.includes(c)) ? 1 : 0;
    const bRel = b.ccps.some((c) => APPRENANT_CCPS.includes(c)) ? 1 : 0;
    if (bRel !== aRel) return bRel - aRel;
    return (views[b.id] ?? 0) - (views[a.id] ?? 0);
  });

  // Grouper par catégorie
  const grouped = sorted.reduce<Record<string, Resource[]>>((acc, r) => {
    const cats: Record<ResourceCategory, string> = {
      linux: 'Linux',
      reseau: 'Réseau',
      securite: 'Sécurité',
      web: 'Web',
      outils: 'Outils',
    };
    const key = cats[r.category];
    if (!acc[key]) acc[key] = [];
    acc[key].push(r);
    return acc;
  }, {});

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
        <span style={{ fontSize: '13px', fontWeight: 600, color: textMain }}>
          Ressources
        </span>
        <span
          style={{
            fontSize: '11px',
            color: textMuted,
            background: dark ? '#ffffff0f' : '#0000000a',
            padding: '1px 7px',
            borderRadius: '10px',
          }}
        >
          {filtered.length}
        </span>
        <div
          style={{
            marginLeft: 'auto',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke={textMuted}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ position: 'absolute', left: '8px', pointerEvents: 'none' }}
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher..."
            style={{
              paddingLeft: '26px',
              paddingRight: '10px',
              height: '28px',
              borderRadius: '6px',
              border: `1px solid ${border}`,
              background: inputBg,
              color: textMain,
              fontSize: '12px',
              outline: 'none',
              width: '180px',
            }}
          />
        </div>
      </div>

      {/* Filtres CCP */}
      <div
        style={{
          display: 'flex',
          gap: '4px',
          padding: '8px 20px',
          borderBottom: `1px solid ${border}`,
          flexShrink: 0,
        }}
      >
        {(
          [
            ['mes-ccps', `Mes CCP (${APPRENANT_CCPS.join(', ')})`],
            ['all', 'Tout'],
            ...ALL_CCPS.map((c) => [c, c]),
          ] as [string, string][]
        ).map(([val, label]) => (
          <button
            key={val}
            onClick={() => setCcpFilter(val)}
            style={{
              padding: '3px 10px',
              fontSize: '11px',
              fontWeight: 500,
              borderRadius: '5px',
              border: 'none',
              cursor: 'pointer',
              flexShrink: 0,
              background:
                ccpFilter === val
                  ? dark
                    ? '#ffffff18'
                    : '#00000012'
                  : 'transparent',
              color: ccpFilter === val ? textMain : textMuted,
              transition: 'background 0.1s',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Grille */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
        {Object.entries(grouped).map(([cat, items]) => (
          <div key={cat} style={{ marginBottom: '24px' }}>
            <div
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: textMuted,
                letterSpacing: '0.5px',
                marginBottom: '10px',
              }}
            >
              {cat.toUpperCase()}
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '8px',
              }}
            >
              {items.map((r) => (
                <ResourceCard
                  key={r.id}
                  r={r}
                  dark={dark}
                  textMain={textMain}
                  textMuted={textMuted}
                  cardBorder={cardBorder}
                  onOpen={handleOpen}
                  views={views[r.id] ?? 0}
                />
              ))}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              color: textMuted,
              fontSize: '13px',
              paddingTop: '40px',
            }}
          >
            Aucune ressource trouvée
          </div>
        )}
      </div>
    </div>
  );
}
