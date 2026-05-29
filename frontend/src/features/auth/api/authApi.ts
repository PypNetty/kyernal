import {
  clearStoredSession,
  getStoredSession,
  setStoredSession,
} from '../lib/authStorage';
import { getFormationById } from '../data/formations';
import { deriveLearnerProfileFromEmail } from '../lib/learnerProfile';
import type {
  AuthSession,
  LoginCredentials,
  SelectFormationInput,
} from '../types';

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

export async function selectFormation(
  input: SelectFormationInput,
): Promise<AuthSession> {
  await delay(200);

  const session = getStoredSession();
  if (!session) {
    throw new Error('Session expirée. Reconnectez-vous.');
  }

  const formation = getFormationById(input.formationId);
  if (!formation) {
    throw new Error('Formation invalide.');
  }

  const updated: AuthSession = {
    ...session,
    formationId: formation.id,
    learningGoal: input.learningGoal?.trim() || undefined,
    user: {
      ...session.user,
      organization: formation.name,
      role: formation.roleLabel,
    },
  };

  setStoredSession(updated);
  return updated;
}

export function logout(): void {
  clearStoredSession();
}
