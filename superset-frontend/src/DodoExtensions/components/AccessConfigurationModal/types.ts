import { Role } from '../../onBoarding/types';

export enum Permission {
  Read = 'read',
  Write = 'write',
}

interface UserAccess {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  teams: Array<{ name: string }>;
  user_info: Array<{ country_name: string | null }>;
  permission: Permission;
}
interface ExtendedUserAccess extends UserAccess {
  isDeleted: boolean;
  isNew: boolean;
}

interface TeamAccess {
  id: number;
  team: string;
  permission: Permission;
}
interface ExtendedTeamAccess extends TeamAccess {
  isDeleted: boolean;
  isNew: boolean;
}

interface RoleAccess {
  id: number;
  role: Role;
  permission: Permission;
}
interface ExtendedRoleAccess extends RoleAccess {
  isDeleted: boolean;
  isNew: boolean;
}

export type AccessOption = UserAccess | TeamAccess | RoleAccess;

export type ExtendedAccessOption =
  | ExtendedUserAccess
  | ExtendedTeamAccess
  | ExtendedRoleAccess;

export interface AccessList {
  users: UserAccess[];
  teams: TeamAccess[];
  roles: RoleAccess[];
}

export interface ExtendedAccessList {
  users: ExtendedUserAccess[];
  teams: ExtendedTeamAccess[];
  roles: ExtendedRoleAccess[];
}

export const isUserAccess = (value: any): value is UserAccess =>
  typeof value === 'object' && 'first_name' in value;

export const isTeamAccess = (value: any): value is TeamAccess =>
  typeof value === 'object' && 'team' in value;

export const isRoleAccess = (value: any): value is RoleAccess =>
  typeof value === 'object' && 'role' in value;
