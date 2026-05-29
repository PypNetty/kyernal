import type { PresenceStatus } from '../types';

export const PRESENCE_STATUSES: {
  id: PresenceStatus;
  label: string;
  color: string;
  background: string;
  description: string;
}[] = [
  {
    id: 'actif',
    label: 'Actif',
    color: '#30a46c',
    background: 'rgba(48,164,108,0.15)',
    description: 'Disponible dans l’Arena',
  },
  {
    id: 'dnd',
    label: 'Ne pas déranger',
    color: '#ef4444',
    background: 'rgba(239,68,68,0.12)',
    description: 'Notifications silencieuses',
  },
  {
    id: 'travail',
    label: 'Travail',
    color: '#5b8def',
    background: 'rgba(91,141,239,0.12)',
    description: 'Ticket en cours',
  },
  {
    id: 'cours',
    label: 'Cours',
    color: '#b06fff',
    background: 'rgba(176,111,255,0.12)',
    description: 'Cours ou ressources ouverts',
  },
  {
    id: 'pratique',
    label: 'Pratique',
    color: '#14b8a6',
    background: 'rgba(20,184,166,0.12)',
    description: 'VM active',
  },
];

export function getPresenceStatusMeta(status: PresenceStatus) {
  return (
    PRESENCE_STATUSES.find((item) => item.id === status) ?? PRESENCE_STATUSES[0]
  );
}
