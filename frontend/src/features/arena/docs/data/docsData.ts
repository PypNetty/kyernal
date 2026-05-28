export interface DocPage {
  id: string;
  title: string;
  folder: string;
  content: string;
  related?: string[];
}

export interface DocFolder {
  id: string;
  label: string;
}

export const FOLDERS: DocFolder[] = [
  { id: 'services', label: 'Services' },
  { id: 'reseau', label: 'Réseau' },
  { id: 'securite', label: 'Sécurité' },
  { id: 'systeme', label: 'Système' },
];

export const DOCS: DocPage[] = [
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
grep -i "crit\\|error" /var/log/apache2/error.log | tail -20
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
grep -i "error\\|crit\\|fail" /var/log/syslog

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
