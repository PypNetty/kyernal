import type { UserProfile } from '../arena/layout/context/types';

export type PresenceStatus = 'actif' | 'dnd' | 'travail' | 'cours' | 'pratique';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthSession {
  token: string;
  email: string;
  user: UserProfile;
  formationId?: string;
  learningGoal?: string;
  targetCcps?: string[];
  presenceStatus?: PresenceStatus;
  dndEnabled?: boolean;
}

export interface SelectFormationInput {
  formationId: string;
  learningGoal?: string;
}

export interface UpdateProfileInput {
  formationId: string;
  targetCcps: string[];
  learningGoal?: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
