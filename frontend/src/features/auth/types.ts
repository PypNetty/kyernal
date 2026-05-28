import type { UserProfile } from '../arena/layout/context/types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthSession {
  token: string;
  email: string;
  user: UserProfile;
}
