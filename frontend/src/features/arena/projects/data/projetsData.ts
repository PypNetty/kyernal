export type UserRole = 'apprenant' | 'formateur' | 'recruteur';
export type ProjectStatus = 'en-cours' | 'termine' | 'pause' | 'brouillon';
export type ProjectVisibility = 'public' | 'prive' | 'formation';

export interface ProjectDeliverable {
  label: string;
  done: boolean;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  visibility: ProjectVisibility;
  owner: string;
  ownerInitials: string;
  ownerColor: string;
  tags: string[];
  deliverables: ProjectDeliverable[];
  updatedAt: string;
  labsLinked?: string[];
  formationModule?: string;
}

export const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Infrastructure Haute Disponibilité',
    description:
      "Mise en place d'une infrastructure HA avec load balancer Nginx, deux serveurs web en backend et monitoring Prometheus/Grafana.",
    status: 'en-cours',
    visibility: 'public',
    owner: 'Henryck Paris',
    ownerInitials: 'HP',
    ownerColor: '#30a46c',
    tags: ['Linux', 'Nginx', 'HA', 'Monitoring'],
    deliverables: [
      { label: "Schéma d'architecture", done: true },
      { label: 'Configuration Nginx load balancer', done: true },
      { label: 'Mise en place Prometheus', done: false },
      { label: 'Dashboard Grafana', done: false },
      { label: 'Documentation technique', done: false },
    ],
    updatedAt: "Aujourd'hui",
    labsLinked: ['INC-042', 'INC-021'],
    formationModule: 'CCP2',
  },
  {
    id: '2',
    title: "Durcissement d'un serveur Debian",
    description:
      "Checklist complète de sécurisation d'un serveur Debian 12 : SSH, fail2ban, iptables, auditd, suppression des services inutiles.",
    status: 'termine',
    visibility: 'public',
    owner: 'Henryck Paris',
    ownerInitials: 'HP',
    ownerColor: '#30a46c',
    tags: ['Sécurité', 'Debian', 'SSH', 'fail2ban'],
    deliverables: [
      { label: 'Checklist de durcissement', done: true },
      { label: "Script d'automatisation bash", done: true },
      { label: "Rapport d'audit avant/après", done: true },
    ],
    updatedAt: 'Mar',
    labsLinked: ['INC-035', 'INC-077'],
    formationModule: 'CCP3',
  },
  {
    id: '3',
    title: 'Dossier Professionnel TSSR',
    description:
      'Constitution du dossier professionnel pour la certification TSSR — deux situations professionnelles documentées.',
    status: 'en-cours',
    visibility: 'formation',
    owner: 'Henryck Paris',
    ownerInitials: 'HP',
    ownerColor: '#30a46c',
    tags: ['TSSR', 'Certification', 'DP'],
    deliverables: [
      { label: 'Situation professionnelle 1', done: true },
      { label: 'Situation professionnelle 2', done: false },
      { label: 'Relecture formateur', done: false },
    ],
    updatedAt: 'Hier',
    formationModule: 'CCP1 + CCP2 + CCP3',
  },
  {
    id: '4',
    title: 'Homelab — Cluster Proxmox',
    description:
      'Documentation de mon homelab personnel : cluster Proxmox 3 nœuds, réseau WireGuard mesh, self-hosting de services.',
    status: 'pause',
    visibility: 'prive',
    owner: 'Henryck Paris',
    ownerInitials: 'HP',
    ownerColor: '#30a46c',
    tags: ['Proxmox', 'Homelab', 'WireGuard', 'Self-hosting'],
    deliverables: [
      { label: 'Schéma réseau', done: true },
      { label: 'Documentation Proxmox', done: false },
      { label: 'Guide WireGuard mesh', done: false },
    ],
    updatedAt: 'Lun',
  },
];

export const STATUS_CONFIG: Record<
  ProjectStatus,
  { label: string; color: string; bg: string }
> = {
  'en-cours': { label: 'En cours', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  termine: { label: 'Terminé', color: '#30a46c', bg: 'rgba(48,164,108,0.1)' },
  pause: { label: 'En pause', color: '#8a8a93', bg: 'rgba(138,138,147,0.1)' },
  brouillon: { label: 'Brouillon', color: '#6b7280', bg: 'rgba(107,114,128,0.1)' },
};

export const VISIBILITY_ICONS: Record<ProjectVisibility, string> = {
  public: '🌐',
  prive: '🔒',
  formation: '🎓',
};

export const VISIBILITY_CONFIG: Record<ProjectVisibility, { label: string; color: string }> = {
  public: { label: 'Public', color: '#30a46c' },
  prive: { label: 'Privé', color: '#8a8a93' },
  formation: { label: 'Formation', color: '#4d8fff' },
};

export const ROLE_LABELS: Record<UserRole, string> = {
  apprenant: 'Apprenant',
  formateur: 'Formateur',
  recruteur: 'Recruteur',
};

export function filterByRole(projects: Project[], role: UserRole): Project[] {
  if (role === 'recruteur') {
    return projects.filter((project) => project.visibility === 'public');
  }
  return projects;
}
