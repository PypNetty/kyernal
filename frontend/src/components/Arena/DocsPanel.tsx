import React, { useState, useContext } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { LayoutCtx } from './Layout';

// --- TYPES ---
interface DocPage {
  id: string;
  title: string;
  folder: string;
  content: string;
  related?: string[]; // ids de pages liées
}

interface DocFolder {
  id: string;
  label: string;
  icon: React.ReactNode;
}

// --- ICÔNES ---
const IconFolder = () => (
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
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
);
const IconFile = () => (
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
);
const IconChevron = ({ open }: { open: boolean }) => (
  <svg
    width="10"
    height="10"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{
      transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
      transition: 'transform 0.15s',
    }}
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const IconCopy = () => (
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
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);
const IconSearch = () => (
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
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const IconLink = () => (
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
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

// --- DOSSIERS ---
const FOLDERS: DocFolder[] = [
  { id: 'services', label: 'Services', icon: <IconFolder /> },
  { id: 'reseau', label: 'Réseau', icon: <IconFolder /> },
  { id: 'securite', label: 'Sécurité', icon: <IconFolder /> },
  { id: 'systeme', label: 'Système', icon: <IconFolder /> },
];

// --- CONTENU MOCK ---
const DOCS: DocPage[] = [
  // SERVICES
  {
    id: 'apache',
    folder: 'services',
    title: 'Apache HTTP Server',
    related: ['nginx', 'systemd', 'logs-systeme'],
    content: `# Apache HTTP Server

Apache est le serveur web le plus utilisé au monde. Il gère les requêtes HTTP/HTTPS et sert les fichiers statiques ou les applications dynamiques.

## Commandes essentielles

\`\`\`bash
# Vérifier le statut du service
systemctl status apache2

# Démarrer / Arrêter / Redémarrer
systemctl start apache2
systemctl stop apache2
systemctl restart apache2

# Recharger la config sans interruption
systemctl reload apache2

# Tester la syntaxe de la configuration
apachectl configtest
\`\`\`

## Fichiers de configuration

| Fichier | Rôle |
|---|---|
| \`/etc/apache2/apache2.conf\` | Configuration principale |
| \`/etc/apache2/sites-available/\` | Virtual hosts disponibles |
| \`/etc/apache2/sites-enabled/\` | Virtual hosts actifs (symlinks) |
| \`/etc/apache2/mods-enabled/\` | Modules actifs |

## Virtual Hosts

Un virtual host permet de servir plusieurs sites depuis un même serveur.

\`\`\`apache
<VirtualHost *:80>
    ServerName monsite.local
    DocumentRoot /var/www/monsite

    <Directory /var/www/monsite>
        AllowOverride All
        Require all granted
    </Directory>

    ErrorLog \${APACHE_LOG_DIR}/monsite_error.log
    CustomLog \${APACHE_LOG_DIR}/monsite_access.log combined
</VirtualHost>
\`\`\`

## Activer / désactiver un site

\`\`\`bash
a2ensite monsite.conf    # Activer
a2dissite monsite.conf   # Désactiver
systemctl reload apache2
\`\`\`

## Logs

\`\`\`bash
# Erreurs en temps réel
tail -f /var/log/apache2/error.log

# Accès
tail -f /var/log/apache2/access.log

# Filtrer les erreurs critiques
grep -i "crit\|error" /var/log/apache2/error.log | tail -20
\`\`\`

## Diagnostic rapide d'une panne

\`\`\`bash
# 1. Le service tourne-t-il ?
systemctl status apache2

# 2. Quel processus occupe le port 80 ?
ss -tlnp | grep :80

# 3. La config est-elle valide ?
apachectl configtest

# 4. Quelles sont les dernières erreurs ?
tail -n 50 /var/log/apache2/error.log
\`\`\`

> **[[Systemd]]** — pour comprendre la gestion des services
> **[[Logs système]]** — pour maîtriser journalctl
`,
  },
  {
    id: 'nginx',
    folder: 'services',
    title: 'Nginx',
    related: ['apache', 'systemd'],
    content: `# Nginx

Nginx est un serveur web haute performance, souvent utilisé comme reverse proxy ou load balancer.

## Commandes essentielles

\`\`\`bash
systemctl status nginx
systemctl restart nginx
systemctl reload nginx

# Tester la configuration
nginx -t
\`\`\`

## Structure de configuration

\`\`\`bash
/etc/nginx/
├── nginx.conf          # Config principale
├── sites-available/    # Blocs server disponibles
├── sites-enabled/      # Actifs (symlinks)
└── conf.d/             # Configs additionnelles
\`\`\`

## Bloc server de base

\`\`\`nginx
server {
    listen 80;
    server_name monsite.local;
    root /var/www/monsite;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }

    error_log /var/log/nginx/monsite_error.log;
    access_log /var/log/nginx/monsite_access.log;
}
\`\`\`

## Reverse Proxy

\`\`\`nginx
location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
\`\`\`

## Erreur 502 Bad Gateway

L'erreur 502 signifie que Nginx ne peut pas joindre l'upstream (souvent PHP-FPM ou une app Node).

\`\`\`bash
# Vérifier l'upstream
systemctl status php8.2-fpm

# Logs Nginx
tail -50 /var/log/nginx/error.log
\`\`\`
`,
  },
  {
    id: 'systemd',
    folder: 'services',
    title: 'Systemd',
    related: ['logs-systeme'],
    content: `# Systemd

Systemd est le gestionnaire de services et d'initialisation des systèmes Linux modernes.

## Commandes de base

\`\`\`bash
# État d'un service
systemctl status <service>

# Démarrer / Arrêter / Redémarrer
systemctl start <service>
systemctl stop <service>
systemctl restart <service>
systemctl reload <service>   # Recharge la config sans redémarrage

# Activer au démarrage
systemctl enable <service>
systemctl disable <service>

# Lister les services en échec
systemctl --failed
\`\`\`

## Lire les logs avec journalctl

\`\`\`bash
# Logs d'un service
journalctl -u apache2

# En temps réel
journalctl -u apache2 -f

# Depuis la dernière heure
journalctl -u apache2 --since "1 hour ago"

# Les 50 dernières lignes
journalctl -u apache2 -n 50

# Depuis le dernier démarrage
journalctl -u apache2 -b
\`\`\`

## Créer un service custom

\`\`\`ini
# /etc/systemd/system/monapp.service
[Unit]
Description=Mon Application
After=network.target

[Service]
User=www-data
WorkingDirectory=/opt/monapp
ExecStart=/opt/monapp/monapp
Restart=always

[Install]
WantedBy=multi-user.target
\`\`\`

\`\`\`bash
systemctl daemon-reload
systemctl enable --now monapp
\`\`\`
`,
  },
  {
    id: 'fail2ban',
    folder: 'securite',
    title: 'fail2ban',
    related: ['ssh-hardening'],
    content: `# fail2ban

fail2ban surveille les logs et bannit automatiquement les IPs suspectes.

## Commandes essentielles

\`\`\`bash
# État général
fail2ban-client status

# État d'un jail spécifique
fail2ban-client status sshd

# Débannir une IP
fail2ban-client set sshd unbanip 192.168.1.100

# Bannir manuellement
fail2ban-client set sshd banip 192.168.1.200
\`\`\`

## Configuration

\`\`\`bash
# Ne jamais modifier jail.conf directement
# Utiliser jail.local
cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
\`\`\`

\`\`\`ini
# /etc/fail2ban/jail.local
[DEFAULT]
bantime  = 1h
findtime = 10m
maxretry = 5
ignoreip = 127.0.0.1/8 ::1

[sshd]
enabled = true
port    = ssh
logpath = %(sshd_log)s
\`\`\`

## Diagnostic

\`\`\`bash
# Logs fail2ban
tail -f /var/log/fail2ban.log

# IPs actuellement bannies
fail2ban-client status sshd | grep "Banned IP"

# Tester un filtre
fail2ban-regex /var/log/auth.log /etc/fail2ban/filter.d/sshd.conf
\`\`\`
`,
  },
  {
    id: 'ssh-hardening',
    folder: 'securite',
    title: 'Durcissement SSH',
    related: ['fail2ban'],
    content: `# Durcissement SSH

La configuration par défaut de SSH n'est pas suffisante pour la production.

## Paramètres essentiels dans sshd_config

\`\`\`bash
# /etc/ssh/sshd_config

# Désactiver l'auth par mot de passe
PasswordAuthentication no
PermitEmptyPasswords no

# Désactiver le login root direct
PermitRootLogin no

# Limiter les utilisateurs autorisés
AllowUsers deployer admin

# Changer le port par défaut (sécurité par l'obscurité)
Port 2222

# Timeout d'inactivité
ClientAliveInterval 300
ClientAliveCountMax 2

# Désactiver X11 et TCP forwarding si inutiles
X11Forwarding no
AllowTcpForwarding no
\`\`\`

\`\`\`bash
# Tester la configuration avant de recharger
sshd -t

# Recharger (ne ferme pas les sessions actives)
systemctl reload sshd
\`\`\`

## Générer une paire de clés

\`\`\`bash
# Sur le client
ssh-keygen -t ed25519 -C "user@machine"

# Copier la clé publique sur le serveur
ssh-copy-id -i ~/.ssh/id_ed25519.pub user@serveur
\`\`\`

> ⚠️ Toujours tester la connexion dans un second terminal avant de fermer la session courante.
`,
  },
  {
    id: 'dns',
    folder: 'reseau',
    title: 'DNS — Notions essentielles',
    related: ['bind9'],
    content: `# DNS — Notions essentielles

Le DNS (Domain Name System) traduit les noms de domaine en adresses IP.

## Outils de diagnostic

\`\`\`bash
# Résolution DNS
dig mondomaine.com
dig mondomaine.com A        # Enregistrement A
dig mondomaine.com MX       # Enregistrement MX
dig @8.8.8.8 mondomaine.com # Forcer un serveur DNS

# Résolution inverse
dig -x 93.184.216.34

# nslookup (interactif)
nslookup mondomaine.com
nslookup mondomaine.com 8.8.8.8

# Vérifier la résolution locale
cat /etc/resolv.conf
cat /etc/hosts
\`\`\`

## Types d'enregistrements

| Type | Rôle |
|---|---|
| A | Nom → IPv4 |
| AAAA | Nom → IPv6 |
| CNAME | Alias vers un autre nom |
| MX | Serveur de mail |
| TXT | Informations texte (SPF, DKIM...) |
| NS | Serveurs de noms autoritaires |
| PTR | IP → Nom (résolution inverse) |

## Fichier resolv.conf

\`\`\`bash
# /etc/resolv.conf
nameserver 8.8.8.8
nameserver 1.1.1.1
search mondomaine.local
\`\`\`
`,
  },
  {
    id: 'bind9',
    folder: 'reseau',
    title: 'Bind9 — Serveur DNS',
    related: ['dns'],
    content: `# Bind9 — Serveur DNS

Bind9 est le serveur DNS de référence sous Linux.

## Installation

\`\`\`bash
apt install bind9 bind9utils
systemctl enable --now named
\`\`\`

## Structure des fichiers

\`\`\`bash
/etc/bind/
├── named.conf              # Config principale
├── named.conf.options      # Options globales
├── named.conf.local        # Zones locales
└── zones/                  # Fichiers de zone
\`\`\`

## Déclarer une zone

\`\`\`bash
# /etc/bind/named.conf.local
zone "klixy.local" {
    type master;
    file "/etc/bind/zones/klixy.local.db";
};
\`\`\`

## Fichier de zone

\`\`\`dns
; /etc/bind/zones/klixy.local.db
$TTL 604800
@   IN  SOA ns1.klixy.local. admin.klixy.local. (
            2024010101  ; Serial
            604800      ; Refresh
            86400       ; Retry
            2419200     ; Expire
            604800 )    ; Negative Cache TTL

@       IN  NS  ns1.klixy.local.
ns1     IN  A   192.168.1.10
www     IN  A   192.168.1.20
mail    IN  A   192.168.1.30
\`\`\`

## Vérification

\`\`\`bash
# Vérifier la config
named-checkconf

# Vérifier un fichier de zone
named-checkzone klixy.local /etc/bind/zones/klixy.local.db

# Recharger
systemctl reload named
\`\`\`
`,
  },
  {
    id: 'logs-systeme',
    folder: 'systeme',
    title: 'Logs système',
    related: ['systemd'],
    content: `# Logs système

Savoir lire les logs est une compétence fondamentale pour diagnostiquer une panne rapidement.

## journalctl — logs systemd

\`\`\`bash
# Logs en temps réel
journalctl -f

# Logs d'un service
journalctl -u nginx -f

# Depuis la dernière heure
journalctl --since "1 hour ago"

# Niveau d'urgence (err, warning, info...)
journalctl -p err

# Dernier démarrage système
journalctl -b
\`\`\`

## Fichiers de logs classiques

| Fichier | Contenu |
|---|---|
| \`/var/log/syslog\` | Logs système généraux |
| \`/var/log/auth.log\` | Authentifications, sudo, SSH |
| \`/var/log/kern.log\` | Logs du kernel |
| \`/var/log/apache2/error.log\` | Erreurs Apache |
| \`/var/log/nginx/error.log\` | Erreurs Nginx |
| \`/var/log/fail2ban.log\` | Actions fail2ban |

## Commandes utiles

\`\`\`bash
# Dernières lignes
tail -n 50 /var/log/syslog

# En temps réel
tail -f /var/log/syslog

# Filtrer par mot-clé
grep -i "error\|crit\|fail" /var/log/syslog

# Combiner
tail -n 200 /var/log/syslog | grep -i error
\`\`\`

## Rotation des logs

\`\`\`bash
# Forcer une rotation manuelle
logrotate -f /etc/logrotate.conf

# Voir la config de rotation d'Apache
cat /etc/logrotate.d/apache2
\`\`\`
`,
  },
  {
    id: 'gestion-disque',
    folder: 'systeme',
    title: 'Gestion du disque',
    related: [],
    content: `# Gestion du disque

## Espace disque

\`\`\`bash
# Vue globale des partitions
df -h

# Espace utilisé par dossier (tri par taille)
du -sh /* 2>/dev/null | sort -rh | head -20

# Trouver les gros fichiers
find / -type f -size +100M 2>/dev/null | sort -k5 -rn

# Taille d'un dossier spécifique
du -sh /var/log
\`\`\`

## Partitions et volumes

\`\`\`bash
# Lister les blocs
lsblk

# Lister les partitions avec UUID
blkid

# Monter une partition
mount /dev/sdb1 /mnt/data

# Monter au démarrage (fstab)
echo "UUID=xxxx /mnt/data ext4 defaults 0 2" >> /etc/fstab
\`\`\`

## Nettoyage courant

\`\`\`bash
# Nettoyer le cache apt
apt autoremove
apt clean

# Lister les anciens kernels
dpkg --list | grep linux-image

# Supprimer un ancien kernel
apt purge linux-image-5.10.0-xx-amd64

# Vider les logs systemd anciens
journalctl --vacuum-time=7d
journalctl --vacuum-size=100M
\`\`\`
`,
  },
];

// --- RÉSOLUTION DES LIENS [[...]] ---
function resolveWikiLinks(
  content: string,
  onNavigate: (id: string) => void,
  dark: boolean,
): string {
  // On retourne le contenu tel quel — le rendu se fait dans le composant Markdown
  return content;
}

// --- COMPOSANT CODE BLOCK avec copie ---
function CodeBlock({
  code,
  language,
  dark,
  textMuted,
  border,
}: {
  code: string;
  language?: string;
  dark: boolean;
  textMuted: string;
  border: string;
}) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div style={{ position: 'relative', marginBottom: '12px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '6px 12px',
          background: dark ? '#09090b' : '#1a1b1e',
          borderRadius: '6px 6px 0 0',
          borderBottom: `1px solid ${dark ? '#27272a' : '#2a2b2e'}`,
        }}
      >
        <span
          style={{
            fontSize: '10px',
            color: '#52525b',
            fontFamily: 'JetBrains Mono, monospace',
          }}
        >
          {language ?? 'bash'}
        </span>
        <button
          onClick={handleCopy}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: copied ? '#30a46c' : '#52525b',
            fontSize: '10px',
            transition: 'color 0.15s',
          }}
        >
          <IconCopy />
          {copied ? 'Copié !' : 'Copier'}
        </button>
      </div>
      <pre
        style={{
          margin: 0,
          padding: '14px 16px',
          background: dark ? '#09090b' : '#111113',
          borderRadius: '0 0 6px 6px',
          overflow: 'auto',
          fontSize: '12px',
          lineHeight: 1.6,
          fontFamily: 'JetBrains Mono, Fira Code, monospace',
          color: dark ? '#e4e4e7' : '#e4e4e7',
        }}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}

// --- COMPOSANT PRINCIPAL ---
export default function DocsPanel() {
  const { dark } = useContext(LayoutCtx);
  const [selectedId, setSelectedId] = useState<string>('apache');
  const [search, setSearch] = useState('');
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({
    services: true,
    reseau: false,
    securite: false,
    systeme: false,
  });

  const border = dark ? '#1f1f1f' : '#e8e8e5';
  // Slightly lighter dark background to be 'less black'
  const bg = dark ? '#111215' : '#f7f7f9';
  const bgContent = dark ? '#09090b' : '#ffffff';
  const textMain = dark ? '#e4e4e7' : '#111113';
  // Slightly lighter muted text for markdown content (not too light)
  const textMuted = dark ? '#9ca3af' : '#7b7b7b';
  const hoverBg = dark ? '#ffffff08' : '#00000007';
  const activeBg = dark ? '#ffffff12' : '#00000012';
  const inputBg = dark ? '#17181a' : '#f0f0ee';
  const treeBorder = dark ? '#27272a' : '#e4e4e4';

  const selectedDoc = DOCS.find((d) => d.id === selectedId) ?? DOCS[0];

  const filteredDocs = search
    ? DOCS.filter(
        (d) =>
          d.title.toLowerCase().includes(search.toLowerCase()) ||
          d.content.toLowerCase().includes(search.toLowerCase()),
      )
    : null;

  const toggleFolder = (id: string) => {
    setOpenFolders((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Rendu Markdown custom
  const mdComponents: Record<string, React.ComponentType<any>> = {
    h1: ({ children }) => (
      <h1
        style={{
          fontSize: '20px',
          fontWeight: 700,
          color: textMain,
          margin: '0 0 16px 0',
          paddingBottom: '10px',
          borderBottom: `1px solid ${border}`,
        }}
      >
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2
        style={{
          fontSize: '15px',
          fontWeight: 600,
          color: textMain,
          margin: '24px 0 10px 0',
        }}
      >
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3
        style={{
          fontSize: '13px',
          fontWeight: 600,
          color: textMain,
          margin: '16px 0 8px 0',
        }}
      >
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p
        style={{
          fontSize: '13px',
          color: textMuted,
          lineHeight: 1.8,
          margin: '0 0 12px 0',
        }}
      >
        {children}
      </p>
    ),
    code: ({ inline, className, children }) => {
      const lang = className?.replace('language-', '');
      if (inline) {
        return (
          <code
            style={{
              background: dark ? '#27272a' : '#f4f4f6',
              color: dark ? '#7eb8ff' : '#0055e5',
              padding: '1px 5px',
              borderRadius: '3px',
              fontSize: '12px',
              fontFamily: 'JetBrains Mono, monospace',
            }}
          >
            {children}
          </code>
        );
      }
      return (
        <CodeBlock
          code={String(children).trim()}
          language={lang}
          dark={dark}
          textMuted={textMuted}
          border={border}
        />
      );
    },
    pre: ({ children }) => <>{children}</>,
    table: ({ children }) => (
      <div style={{ overflowX: 'auto', marginBottom: '16px' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '12px',
          }}
        >
          {children}
        </table>
      </div>
    ),
    th: ({ children }) => (
      <th
        style={{
          padding: '6px 12px',
          textAlign: 'left',
          fontSize: '11px',
          fontWeight: 600,
          color: textMuted,
          borderBottom: `1px solid ${border}`,
          letterSpacing: '0.4px',
        }}
      >
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td
        style={{
          padding: '6px 12px',
          fontSize: '12px',
          color: textMuted,
          borderBottom: `1px solid ${dark ? '#18181b' : '#f4f4f4'}`,
        }}
      >
        {children}
      </td>
    ),
    blockquote: ({ children }) => (
      <blockquote
        style={{
          borderLeft: `3px solid #4d8fff`,
          margin: '12px 0',
          paddingLeft: '14px',
          color: textMuted,
          fontStyle: 'italic',
        }}
      >
        {children}
      </blockquote>
    ),
    ul: ({ children }) => (
      <ul
        style={{
          paddingLeft: '20px',
          margin: '0 0 12px 0',
          color: textMuted,
          fontSize: '13px',
          lineHeight: 1.8,
        }}
      >
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol
        style={{
          paddingLeft: '20px',
          margin: '0 0 12px 0',
          color: textMuted,
          fontSize: '13px',
          lineHeight: 1.8,
        }}
      >
        {children}
      </ol>
    ),
    li: ({ children }) => <li style={{ marginBottom: '2px' }}>{children}</li>,
    strong: ({ children }) => (
      <strong style={{ color: textMain, fontWeight: 600 }}>{children}</strong>
    ),
    a: ({ href, children }) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: '#4d8fff', textDecoration: 'none' }}
      >
        {children}
      </a>
    ),
  };

  // Rendu du contenu avec résolution des liens [[...]]
  const renderContent = (content: string) => {
    // Remplacer [[NomPage]] par des liens cliquables
    const parts = content.split(/(\[\[.*?\]\])/g);
    return parts.map((part, i) => {
      const match = part.match(/^\[\[(.*?)\]\]$/);
      if (match) {
        const title = match[1];
        const target = DOCS.find(
          (d) =>
            d.title === title ||
            d.id === title.toLowerCase().replace(/\s+/g, '-'),
        );
        if (target) {
          return (
            <span
              key={i}
              onClick={() => setSelectedId(target.id)}
              style={{
                color: '#4d8fff',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
              }}
            >
              <IconLink />
              {title}
            </span>
          );
        }
        return (
          <span key={i} style={{ color: '#4d8fff' }}>
            {title}
          </span>
        );
      }
      return (
        <ReactMarkdown
          key={i}
          remarkPlugins={[remarkGfm]}
          components={mdComponents}
        >
          {part}
        </ReactMarkdown>
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
      {/* ── ARBRE DE FICHIERS ── */}
      <div
        style={{
          width: '220px',
          flexShrink: 0,
          borderRight: `1px solid ${border}`,
          display: 'flex',
          flexDirection: 'column',
          background: bg,
        }}
      >
        {/* Header + recherche */}
        <div
          style={{
            padding: '12px 12px 8px',
            borderBottom: `1px solid ${border}`,
          }}
        >
          <div
            style={{
              fontSize: '12px',
              fontWeight: 600,
              color: textMain,
              marginBottom: '8px',
            }}
          >
            Docs
          </div>
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                position: 'absolute',
                left: '8px',
                color: textMuted,
                pointerEvents: 'none',
              }}
            >
              <IconSearch />
            </span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher..."
              style={{
                width: '100%',
                paddingLeft: '26px',
                paddingRight: '8px',
                height: '26px',
                borderRadius: '5px',
                border: `1px solid ${treeBorder}`,
                background: inputBg,
                color: textMain,
                fontSize: '11px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
        </div>

        {/* Arbre ou résultats de recherche */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '6px 0' }}>
          {search && filteredDocs ? (
            // Résultats de recherche
            filteredDocs.length > 0 ? (
              filteredDocs.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => {
                    setSelectedId(doc.id);
                    setSearch('');
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '7px',
                    padding: '5px 12px',
                    cursor: 'pointer',
                    background:
                      doc.id === selectedId ? activeBg : 'transparent',
                    color: textMuted,
                    fontSize: '12px',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = hoverBg;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      doc.id === selectedId ? activeBg : 'transparent';
                  }}
                >
                  <span style={{ color: textMuted, opacity: 0.6 }}>
                    <IconFile />
                  </span>
                  {doc.title}
                </div>
              ))
            ) : (
              <div
                style={{
                  padding: '12px',
                  fontSize: '12px',
                  color: textMuted,
                  textAlign: 'center',
                }}
              >
                Aucun résultat
              </div>
            )
          ) : (
            // Arbre de dossiers
            FOLDERS.map((folder) => {
              const pages = DOCS.filter((d) => d.folder === folder.id);
              const isOpen = openFolders[folder.id];
              return (
                <div key={folder.id}>
                  {/* Dossier */}
                  <div
                    onClick={() => toggleFolder(folder.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '5px 10px',
                      cursor: 'pointer',
                      color: textMuted,
                      fontSize: '12px',
                      fontWeight: 500,
                      userSelect: 'none',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = hoverBg;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <IconChevron open={isOpen} />
                    <span style={{ color: textMuted, opacity: 0.7 }}>
                      <IconFolder />
                    </span>
                    {folder.label}
                    <span
                      style={{
                        marginLeft: 'auto',
                        fontSize: '10px',
                        opacity: 0.5,
                      }}
                    >
                      {pages.length}
                    </span>
                  </div>
                  {/* Pages */}
                  {isOpen &&
                    pages.map((page) => (
                      <div
                        key={page.id}
                        onClick={() => setSelectedId(page.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '7px',
                          padding: '4px 10px 4px 28px',
                          cursor: 'pointer',
                          background:
                            page.id === selectedId ? activeBg : 'transparent',
                          color: page.id === selectedId ? textMain : textMuted,
                          fontSize: '12px',
                          borderLeft: `1px solid ${treeBorder}`,
                          marginLeft: '16px',
                          transition: 'background 0.1s',
                        }}
                        onMouseEnter={(e) => {
                          if (page.id !== selectedId)
                            e.currentTarget.style.background = hoverBg;
                        }}
                        onMouseLeave={(e) => {
                          if (page.id !== selectedId)
                            e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        <span style={{ opacity: 0.5 }}>
                          <IconFile />
                        </span>
                        {page.title}
                      </div>
                    ))}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── CONTENU MARKDOWN ── */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          background: bgContent,
          minWidth: 0,
        }}
      >
        {/* Header page */}
        <div
          style={{
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            padding: '0 24px',
            borderBottom: `1px solid ${border}`,
            flexShrink: 0,
            gap: '10px',
          }}
        >
          <span style={{ fontSize: '13px', fontWeight: 600, color: textMain }}>
            {selectedDoc.title}
          </span>
          {selectedDoc.related && selectedDoc.related.length > 0 && (
            <div
              style={{
                marginLeft: 'auto',
                display: 'flex',
                gap: '5px',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '10px', color: textMuted }}>
                Voir aussi :
              </span>
              {selectedDoc.related.map((relId) => {
                const rel = DOCS.find((d) => d.id === relId);
                if (!rel) return null;
                return (
                  <button
                    key={relId}
                    onClick={() => setSelectedId(relId)}
                    style={{
                      fontSize: '10px',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      border: `1px solid ${border}`,
                      background: 'transparent',
                      color: '#4d8fff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px',
                    }}
                  >
                    <IconLink />
                    {rel.title}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Contenu */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '28px 36px',
            maxWidth: '760px',
          }}
        >
          {renderContent(selectedDoc.content)}
        </div>
      </div>
    </div>
  );
}
