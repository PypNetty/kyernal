import type { UserProfile } from '../../arena/layout/context/types';

export const DEFAULT_ORGANIZATION = 'Klixy Formation';

/** Profil apprenant de démonstration aligné avec les données métier (inbox, projets). */
export const DEFAULT_LEARNER_PROFILE: UserProfile = {
  name: 'Henryck Paris',
  initials: 'HP',
  role: 'Apprenant · DevOps Systèmes & Réseaux',
  organization: DEFAULT_ORGANIZATION,
};

const DEMO_EMAIL_PATTERN =
  /^(test|demo|apprenant|user|admin)([._-].*)?@/i;

export function isDemoLearnerEmail(email: string): boolean {
  return DEMO_EMAIL_PATTERN.test(email.trim().toLowerCase());
}

function buildInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase() || 'HP';
}

export function deriveLearnerProfileFromEmail(email: string): UserProfile {
  const normalized = email.trim().toLowerCase();

  if (isDemoLearnerEmail(normalized)) {
    return { ...DEFAULT_LEARNER_PROFILE };
  }

  const local = normalized.split('@')[0] ?? '';
  const parts = local.split(/[._-]+/).filter(Boolean);

  let name: string;
  if (parts.length >= 2) {
    name = parts
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
      .join(' ');
  } else if (parts.length === 1) {
    const p = parts[0];
    name = p.charAt(0).toUpperCase() + p.slice(1).toLowerCase();
  } else {
    return { ...DEFAULT_LEARNER_PROFILE };
  }

  return {
    name,
    initials: buildInitials(name),
    role: DEFAULT_LEARNER_PROFILE.role,
    organization: DEFAULT_ORGANIZATION,
  };
}

/** Complète une session stockée avant l’ajout du champ organization. */
export function normalizeStoredUser(user: UserProfile): UserProfile {
  const looksLikeDemoName =
    /^test(\s+apprenant)?$/i.test(user.name.trim()) ||
    user.name.trim().toLowerCase() === 'apprenant';

  if (looksLikeDemoName) {
    return { ...DEFAULT_LEARNER_PROFILE };
  }

  return {
    ...DEFAULT_LEARNER_PROFILE,
    ...user,
    organization: user.organization ?? DEFAULT_ORGANIZATION,
    role: user.role?.trim() || DEFAULT_LEARNER_PROFILE.role,
  };
}
