import {
  clearStoredSession,
  getStoredSession,
  setStoredSession,
} from '../lib/authStorage';
import { deriveLearnerProfileFromEmail } from '../lib/learnerProfile';
import type { AuthSession, LoginCredentials } from '../types';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function login(
  credentials: LoginCredentials,
): Promise<AuthSession> {
  await delay(300);

  const email = credentials.email.trim().toLowerCase();
  const password = credentials.password;

  if (!email.includes('@')) {
    throw new Error('Adresse e-mail invalide.');
  }
  if (!password.trim()) {
    throw new Error('Mot de passe requis.');
  }

  const session: AuthSession = {
    token: `mock-${crypto.randomUUID()}`,
    email,
    user: deriveLearnerProfileFromEmail(email),
  };

  setStoredSession(session);
  return session;
}

export function getSession(): AuthSession | null {
  return getStoredSession();
}

export function logout(): void {
  clearStoredSession();
}
