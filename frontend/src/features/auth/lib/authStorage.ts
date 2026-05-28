import type { AuthSession } from '../types';
import { normalizeStoredUser } from './learnerProfile';

const STORAGE_KEY = 'kyernal.auth';

export function getStoredSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthSession;
    if (!parsed?.token || !parsed?.user?.name) return null;
    return {
      ...parsed,
      user: normalizeStoredUser(parsed.user),
    };
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
