export type ResourceType = 'doc' | 'man' | 'cours' | 'cheatsheet' | 'video';
export type ResourceCategory = 'linux' | 'reseau' | 'securite' | 'web' | 'outils';

export interface Resource {
  id: string;
  type: ResourceType;
  category: ResourceCategory;
  title: string;
  description: string;
  url?: string;
  tags: string[];
  ccps: string[];
  pinned?: boolean;
}

export const APPRENANT_CCPS = ['CCP2', 'CCP3'];
export const ALL_CCPS = ['CCP1', 'CCP2', 'CCP3'];

export const CATEGORY_LABELS: Record<ResourceCategory, string> = {
  linux: 'Linux',
  reseau: 'Réseau',
  securite: 'Sécurité',
  web: 'Web',
  outils: 'Outils',
};

export const MOCK_RESOURCES: Resource[] = [
  { id: '1', type: 'doc', category: 'linux', ccps: ['CCP2'], title: 'Arch Wiki — systemd', description: 'Référence complète sur systemd, les services, les timers et le journal.', url: 'https://wiki.archlinux.org/title/Systemd', tags: ['systemd', 'services'], pinned: true },
  { id: '2', type: 'man', category: 'linux', ccps: ['CCP2'], title: 'man journalctl', description: 'Consulter et filtrer les logs du journal systemd.', url: 'https://man7.org/linux/man-pages/man1/journalctl.1.html', tags: ['logs', 'debug'] },
  { id: '3', type: 'man', category: 'linux', ccps: ['CCP2'], title: 'man find', description: 'Recherche de fichiers avec critères avancés.', url: 'https://man7.org/linux/man-pages/man1/find.1.html', tags: ['fichiers', 'recherche'] },
  { id: '4', type: 'cheatsheet', category: 'linux', ccps: ['CCP2'], title: 'Cheatsheet — commandes disque', description: 'df, du, lsblk, fdisk, parted — référence rapide.', url: 'https://devhints.io/bash', tags: ['disque', 'stockage'], pinned: true },
  { id: '5', type: 'cours', category: 'linux', ccps: ['CCP2'], title: 'Cours — Administration Linux', description: 'Module complet en préparation — disponible prochainement.', tags: ['linux', 'administration'] },
  { id: '6', type: 'doc', category: 'reseau', ccps: ['CCP1'], title: 'RFC 1035 — DNS', description: 'Spécification originale du protocole DNS.', url: 'https://www.rfc-editor.org/rfc/rfc1035', tags: ['DNS', 'protocole'] },
  { id: '7', type: 'man', category: 'reseau', ccps: ['CCP1'], title: 'man ss', description: 'Lister les connexions réseau, ports ouverts et sockets.', url: 'https://man7.org/linux/man-pages/man8/ss.8.html', tags: ['ports', 'sockets'] },
  { id: '8', type: 'cheatsheet', category: 'reseau', ccps: ['CCP1'], title: 'Cheatsheet — iptables', description: 'Règles de base, chaînes INPUT/OUTPUT/FORWARD, NAT.', url: 'https://andreafortuna.org/2019/05/08/iptables-a-simple-cheatsheet/', tags: ['firewall', 'iptables'] },
  { id: '9', type: 'doc', category: 'reseau', ccps: ['CCP1'], title: 'Bind9 — Configuration DNS', description: 'Documentation officielle Bind9 pour la configuration de zones.', url: 'https://bind9.readthedocs.io/', tags: ['DNS', 'bind9'] },
  { id: '10', type: 'doc', category: 'securite', ccps: ['CCP3'], title: 'CIS Benchmark — Debian', description: 'Guide de durcissement CIS pour Debian Linux.', url: 'https://www.cisecurity.org/benchmark/debian_linux', tags: ['durcissement', 'CIS'], pinned: true },
  { id: '11', type: 'man', category: 'securite', ccps: ['CCP3'], title: 'man fail2ban-client', description: 'Gestion des jails, des IPs bannies et des actions fail2ban.', url: 'https://www.fail2ban.org/wiki/index.php/Commands', tags: ['fail2ban', 'SSH'] },
  { id: '12', type: 'cheatsheet', category: 'securite', ccps: ['CCP3'], title: 'Cheatsheet — OpenSSH hardening', description: 'Paramètres sshd_config recommandés pour la production.', url: 'https://infosec.mozilla.org/guidelines/openssh', tags: ['SSH', 'durcissement'] },
  { id: '13', type: 'doc', category: 'web', ccps: ['CCP2'], title: 'Apache — doc officielle', description: 'Configuration, modules, virtual hosts et troubleshooting Apache.', url: 'https://httpd.apache.org/docs/2.4/', tags: ['Apache', 'HTTP'] },
  { id: '14', type: 'doc', category: 'web', ccps: ['CCP2'], title: "Nginx — Beginner's guide", description: 'Configuration de base, proxy_pass, SSL et logs Nginx.', url: 'https://nginx.org/en/docs/beginners_guide.html', tags: ['Nginx', 'proxy'] },
  { id: '15', type: 'cheatsheet', category: 'web', ccps: ['CCP2'], title: 'Cheatsheet — curl', description: 'Options curl les plus utiles pour tester des APIs et des serveurs web.', url: 'https://devhints.io/curl', tags: ['curl', 'HTTP'] },
  { id: '16', type: 'cheatsheet', category: 'outils', ccps: ['CCP1', 'CCP2', 'CCP3'], title: 'Cheatsheet — vim', description: 'Mouvements, modes, recherche et remplacement dans vim.', url: 'https://devhints.io/vim', tags: ['vim', 'éditeur'] },
  { id: '17', type: 'cheatsheet', category: 'outils', ccps: ['CCP1', 'CCP2', 'CCP3'], title: 'Cheatsheet — tmux', description: 'Sessions, fenêtres, panneaux et raccourcis tmux.', url: 'https://devhints.io/tmux', tags: ['tmux', 'terminal'] },
  { id: '18', type: 'doc', category: 'outils', ccps: ['CCP2', 'CCP3'], title: 'Bash — Guide avancé', description: 'Variables, fonctions, tableaux, substitutions et bonnes pratiques bash.', url: 'https://tldp.org/LDP/abs/html/', tags: ['bash', 'scripting'] },
];
