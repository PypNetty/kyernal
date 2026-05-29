import type { AuthSession } from '../types';
import { getFormationById } from '../data/formations';
import { normalizeStoredUser } from './learnerProfile';

const STORAGE_KEY = 'kyernal.auth';

function normalizeStoredSession(session: AuthSession): AuthSession {
  const user = normalizeStoredUser(session.user);

  if (session.formationId) {
    const formation = getFormationById(session.formationId);
    if (formation) {
      return {
        ...session,
        user: {
          ...user,
          organization: formation.name,
          role: formation.roleLabel,
        },
      };
    }
  }

  return {
    ...session,
    user: { ...user, organization: undefined },
    formationId: undefined,
  };
}

export function getStoredSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthSession;
    if (!parsed?.token || !parsed?.user?.name) return null;
    return normalizeStoredSession(parsed);
  } catch {
    return null;
  }
}

export function setStoredSession(session: AuthSession): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearStoredSession(): void {
  localStorage.removeItem(STORAGE_KEY);
}
