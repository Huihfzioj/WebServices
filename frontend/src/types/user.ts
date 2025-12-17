export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  citizenId?: number;
  firstName?: string;
  lastName?: string;
  birthDate?: string;
  birthPlace?: string;
  gender?: 'MALE' | 'FEMALE';
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export const ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.USER]: "Citizen",
  [UserRole.ADMIN]: "Administrator",
  [UserRole.SUPER_ADMIN]: "Super Administrator",
};
