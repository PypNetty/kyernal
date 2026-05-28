export type MessageType = 'incident' | 'formateur' | 'system';
export type MessageStatus = 'unread' | 'read' | 'active';

export interface InboxMessage {
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

export const INBOX_FILTERS = [
  ['all', 'Tous'],
  ['incident', 'Incidents'],
  ['formateur', 'Formateur'],
  ['system', 'Système'],
] as const;

export const MOCK_MESSAGES: InboxMessage[] = [
  { id: '1', type: 'incident', from: 'Klixy Arena', fromInitials: 'K', fromColor: '#0055e5', subject: 'Incident #INC-042 — Apache ne répond plus sur le port 80', preview: 'Le serveur web de la RH ne répond plus depuis ce matin...', body: `Un incident a été détecté sur l'infrastructure RH.\n\n**Contexte :** Le serveur Apache hébergé sur \`srv-rh-01\` ne répond plus aux requêtes HTTP depuis 08h14. Les utilisateurs du service RH signalent une page blanche ou une erreur de connexion.\n\n**Environnement :** Debian 13 · Apache 2.4 · Port 80/443\n\n**Objectif :** Diagnostiquer la panne, identifier la cause racine et remettre le service en ligne. Documente chaque étape dans le terminal.\n\n**Compétence visée :** CCP2 — Exploiter des serveurs Linux`, timestamp: '09:42', status: 'unread', incidentId: 'INC-042', tags: ['CCP2', 'Apache', 'Critique'] },
  { id: '2', type: 'incident', from: 'Klixy Arena', fromInitials: 'K', fromColor: '#0055e5', subject: 'Incident #INC-088 — Problème DNS interne', preview: 'Impossible de résoudre les noms de domaine du lab...', body: `Incident de résolution DNS détecté sur le réseau interne du lab.\n\n**Contexte :** Depuis la dernière mise à jour du resolver, les machines du lab ne parviennent plus à résoudre les noms de domaine internes (\`*.klixy.local\`).\n\n**Environnement :** Bind9 · Ubuntu 22.04 · Réseau 10.0.0.0/24\n\n**Objectif :** Identifier la mauvaise configuration DNS, corriger le fichier de zone ou le resolver, valider avec \`dig\` et \`nslookup\`.\n\n**Compétence visée :** CCP1 — Administrer les composants d'un réseau`, timestamp: 'Hier', status: 'read', incidentId: 'INC-088', tags: ['CCP1', 'DNS', 'Moyen'] },
  { id: '3', type: 'formateur', from: 'Marc Lefebvre', fromInitials: 'ML', fromColor: '#30a46c', subject: 'Retour sur ton lab INC-035 — Bien joué 👍', preview: "J'ai regardé ta session d'hier. Ta démarche de diagnostic était...", body: `Salut Henryck,\n\nJ'ai regardé le replay de ta session sur l'incident #INC-035 (fail2ban). Ta démarche de diagnostic était vraiment solide, tu as commencé par les logs avant de toucher à la config, c'est exactement ce qu'on attend d'un technicien en conditions réelles.\n\nUn point à améliorer : pense à vérifier \`systemctl status\` avant \`journalctl\`, ça te donnera un aperçu plus rapide de l'état du service.\n\nContinue comme ça, tu es bien parti pour le jury. Si tu bloques sur quoi que ce soit, n'hésite pas.\n\nBonne continuation,\nMarc`, timestamp: 'Hier', status: 'read', tags: ['Feedback', 'fail2ban'] },
  { id: '4', type: 'system', from: 'Système', fromInitials: 'S', fromColor: '#8a8a93', subject: 'Votre session VM a expiré', preview: "La VM vm-apprenant-03 a été détruite après 2h d'inactivité...", body: `La machine virtuelle **vm-apprenant-03** associée à l'incident #INC-071 a été automatiquement détruite après 2 heures d'inactivité.\n\nVos actions dans le terminal ont été enregistrées et sont consultables dans l'onglet **Mes tickets**.\n\nVous pouvez relancer une nouvelle session à tout moment depuis l'Inbox.`, timestamp: 'Lun', status: 'read', tags: ['VM', 'Auto-destroy'] },
  { id: '5', type: 'incident', from: 'Klixy Arena', fromInitials: 'K', fromColor: '#0055e5', subject: 'Incident #INC-101 — Espace disque critique sur /var', preview: 'Le volume /var est à 97% de capacité, des services commencent...', body: `Alerte critique : saturation disque imminente.\n\n**Contexte :** Le volume \`/var\` du serveur \`srv-prod-02\` est à 97% de capacité. Des services commencent à dysfonctionner (cron, syslog). Une intervention rapide est nécessaire.\n\n**Environnement :** Debian 13 · LVM · ext4\n\n**Objectif :** Identifier les fichiers/dossiers qui consomment l'espace, nettoyer proprement (logs, cache apt, fichiers temporaires) sans casser les services en cours.\n\n**Compétence visée :** CCP2 — Maintenir un serveur Linux en conditions opérationnelles`, timestamp: 'Lun', status: 'read', incidentId: 'INC-101', tags: ['CCP2', 'Disque', 'Critique'] },
  { id: '6', type: 'formateur', from: 'Marc Lefebvre', fromInitials: 'ML', fromColor: '#30a46c', subject: 'Nouveau module disponible: Sécurité SSH', preview: "J'ai ajouté 3 nouveaux incidents autour du durcissement SSH...", body: `Bonjour Henryck,\n\nJ'ai ajouté 3 nouveaux incidents dans la catégorie **Sécurité SSH** pour compléter ta préparation au bloc CCP3.\n\nLes scénarios couvrent :\n- Désactivation de l'authentification par mot de passe\n- Configuration de fail2ban pour SSH\n- Audit des clés autorisées\n\nCes labs sont marqués "Avancé": prends-les après avoir validé les incidents Apache et DNS.\n\nÀ bientôt,\nMarc`, timestamp: 'Dim', status: 'read', tags: ['CCP3', 'SSH', 'Nouveau'] },
];

export const tagColor = (tag: string): { bg: string; color: string } => {
  if (tag === 'Critique') return { bg: 'rgba(255,80,80,0.12)', color: '#ff6b6b' };
  if (tag === 'Moyen') return { bg: 'rgba(255,180,0,0.12)', color: '#ffb800' };
  if (tag === 'Avancé') return { bg: 'rgba(160,100,255,0.12)', color: '#b06fff' };
  if (tag === 'Nouveau') return { bg: 'rgba(48,164,108,0.12)', color: '#30a46c' };
  if (tag === 'Feedback') return { bg: 'rgba(48,164,108,0.12)', color: '#30a46c' };
  if (['CCP1', 'CCP2', 'CCP3'].includes(tag)) return { bg: 'rgba(0,85,229,0.12)', color: '#4d8fff' };
  return { bg: 'rgba(138,138,147,0.1)', color: '#8a8a93' };
};
