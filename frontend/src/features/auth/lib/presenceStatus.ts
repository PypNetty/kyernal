import type { PresenceStatus } from '../types';

export type PresenceActivity = {
  dndEnabled: boolean;
  vmActive: boolean;
  readingContent: boolean;
  workingOnTicket: boolean;
};

export function derivePresenceStatus(activity: PresenceActivity): PresenceStatus {
  if (activity.dndEnabled) return 'dnd';
  if (activity.vmActive) return 'pratique';
  if (activity.readingContent) return 'cours';
  if (activity.workingOnTicket) return 'travail';
  return 'actif';
}

export function getPresenceActivityFromRoute(pathname: string): {
  readingContent: boolean;
  workingOnTicket: boolean;
} {
  return {
    readingContent: pathname.startsWith('/ressources'),
    workingOnTicket:
      pathname.startsWith('/tickets/') && pathname !== '/tickets',
  };
}
