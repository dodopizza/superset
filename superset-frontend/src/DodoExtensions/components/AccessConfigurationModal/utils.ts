import { SupersetClient, t } from '@superset-ui/core';
import rison from 'rison';
import {
  AccessOption,
  ExtendedAccessOption,
  isRoleAccess,
  isTeamAccess,
  isUserAccess,
  ExtendedAccessList,
  AccessList,
  Permission,
} from './types';

export const formAccessOptionLabel = (
  option: Omit<AccessOption, 'permission'>,
): string => {
  if (isUserAccess(option)) {
    const teams = option.teams.map(item => item.name).join(', ');
    return `${option.first_name} ${option.last_name} ${
      teams ? `(${teams})` : '(no team)'
    } ${option.email} (${
      option.user_info[0]?.country_name?.toUpperCase() || 'no country'
    })`;
  }

  if (isTeamAccess(option)) {
    return `${t('Team')}: ${option.team}`;
  }

  if (isRoleAccess(option)) {
    return `${t('Role')}: ${option.role}`;
  }

  return '';
};

export const extendAccessList = (
  accessList: AccessList,
): ExtendedAccessList => {
  const extendWithDefaults = <T>(
    item: T,
  ): T & { isDeleted: boolean; isNew: boolean } => ({
    ...item,
    isDeleted: false,
    isNew: false,
  });

  return {
    users: accessList.users.map(extendWithDefaults),
    teams: accessList.teams.map(extendWithDefaults),
    roles: accessList.roles.map(extendWithDefaults),
  };
};

export const diminishExtendedAccessList = (
  extendedAccessList: ExtendedAccessList,
): AccessList => {
  const removeExtendedProps = <T>(
    item: T & { isDeleted: boolean; isNew: boolean },
  ): T => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { isDeleted, isNew, ...accessption } = item;
    return accessption as T;
  };

  return {
    users: extendedAccessList.users.map(removeExtendedProps),
    teams: extendedAccessList.teams.map(removeExtendedProps),
    roles: extendedAccessList.roles.map(removeExtendedProps),
  };
};

export const addToAccessList = (
  accessList: ExtendedAccessList,
  accessOption: ExtendedAccessOption,
): ExtendedAccessList => {
  if (isUserAccess(accessOption)) {
    const users = [...accessList.users, accessOption];
    return { ...accessList, users };
  }
  if (isTeamAccess(accessOption)) {
    const teams = [...accessList.teams, accessOption];
    return { ...accessList, teams };
  }
  const roles = [...accessList.roles, accessOption];
  return { ...accessList, roles };
};

export const updateAccessList = (
  accessList: ExtendedAccessList,
): ExtendedAccessList => {
  const getUpdatedOptions = <T extends ExtendedAccessOption>(
    options: T[],
  ): T[] =>
    options
      .filter(option => !option.isDeleted)
      .map(option => (option.isNew ? { ...option, isNew: false } : option));

  return {
    users: getUpdatedOptions(accessList.users),
    teams: getUpdatedOptions(accessList.teams),
    roles: getUpdatedOptions(accessList.roles),
  };
};

export const deleteFromAccessList = (
  accessList: ExtendedAccessList,
  accessOption: ExtendedAccessOption,
): ExtendedAccessList => {
  if (isUserAccess(accessOption)) {
    const users = accessList.users.filter(
      option => option.id !== accessOption.id,
    );
    return { ...accessList, users };
  }
  if (isTeamAccess(accessOption)) {
    const teams = accessList.teams.filter(
      option => option.id !== accessOption.id,
    );
    return { ...accessList, teams };
  }
  const roles = accessList.roles.filter(
    option => option.id !== accessOption.id,
  );
  return { ...accessList, roles };
};

export const toggleDeletion = (
  accessList: ExtendedAccessList,
  accessOption: ExtendedAccessOption,
): ExtendedAccessList => {
  const toggle = <T extends ExtendedAccessOption>(option: T): T =>
    option.id === accessOption.id
      ? { ...option, isDeleted: !option.isDeleted }
      : option;

  if (isUserAccess(accessOption)) {
    const users = accessList.users.map(toggle);
    return { ...accessList, users };
  }
  if (isTeamAccess(accessOption)) {
    const teams = accessList.teams.map(toggle);
    return { ...accessList, teams };
  }
  const roles = accessList.roles.map(toggle);
  return { ...accessList, roles };
};

export const changePermission = (
  accessList: ExtendedAccessList,
  accessOption: ExtendedAccessOption,
  permission: Permission,
): ExtendedAccessList => {
  const change = <T extends ExtendedAccessOption>(option: T): T =>
    option.id === accessOption.id ? { ...option, permission } : option;

  if (isUserAccess(accessOption)) {
    const users = accessList.users.map(change);
    return { ...accessList, users };
  }
  if (isTeamAccess(accessOption)) {
    const teams = accessList.teams.map(change);
    return { ...accessList, teams };
  }
  const roles = accessList.roles.map(change);
  return { ...accessList, roles };
};

export const checkForInclusion = (
  accessList: ExtendedAccessList,
  accessOption: AccessOption,
): boolean => {
  if (isUserAccess(accessOption)) {
    return accessList.users.some(user => user.id === accessOption.id);
  }
  if (isTeamAccess(accessOption)) {
    return accessList.teams.some(team => team.id === accessOption.id);
  }
  return accessList.roles.some(role => role.id === accessOption.id);
};

export const getChangesCount = (
  prevAccessList: ExtendedAccessList,
  accessList: ExtendedAccessList,
): {
  userChangesCount: number;
  teamChangesCount: number;
  roleChangesCount: number;
} => {
  const countChanges = (
    prevAccessOptions: ExtendedAccessOption[],
    accessOptions: ExtendedAccessOption[],
  ): number => {
    let count = 0;
    count += accessOptions.length - prevAccessOptions.length;

    prevAccessOptions.forEach((prevOption, i) => {
      if (accessOptions[i].isDeleted) {
        count += 1;
        return;
      }
      if (prevOption.permission !== accessOptions[i].permission) count += 1;
    });

    return count;
  };

  return {
    userChangesCount: countChanges(prevAccessList.users, accessList.users),
    teamChangesCount: countChanges(prevAccessList.teams, accessList.teams),
    roleChangesCount: countChanges(prevAccessList.roles, accessList.roles),
  };
};

enum UserOperation {
  contains = 'usr_name',
}

export const getUserOptions = async (
  query: string,
): Promise<Omit<AccessOption, 'permission'>[]> => {
  const filterExps = [
    { col: 'first_name', opr: UserOperation.contains, value: query },
  ];

  const queryParams = rison.encode_uri({ filters: filterExps });

  const url = `/api/v1/user/?q=${queryParams}`;

  const response = await SupersetClient.get({
    url,
    headers: { 'Content-Type': 'application/json' },
    parseMethod: null,
  });

  const dto = await response.json();

  return dto.result;
};

enum TeamOperation {
  contains = 'ct_name',
}

interface TeamDto {
  id: number;
  isExternal: boolean;
  name: string;
  slug: string;
  roles: Array<{ name: string }>;
}

export const getTeamOptions = async (
  query: string,
): Promise<Omit<AccessOption, 'permission'>[]> => {
  const filterExps = [
    { col: 'name', opr: TeamOperation.contains, value: query },
  ];

  const queryParams = rison.encode_uri({ filters: filterExps });

  const url = `/api/v1/team/?q=${queryParams}`;

  const response = await SupersetClient.get({
    url,
    headers: { 'Content-Type': 'application/json' },
    parseMethod: null,
  });

  const dto = await response.json();

  const result = (dto.result as TeamDto[]).map(team => ({
    id: team.id,
    team: team.name,
  }));

  return result;
};

export const getRoleOptions = async (
  query: string,
): Promise<Omit<AccessOption, 'permission'>[]> => {
  const filterExps = [
    { col: 'first_name', opr: TeamOperation.contains, value: query },
  ];

  const queryParams = rison.encode_uri({ filters: filterExps });

  const url = `/api/v1/user/?q=${queryParams}`;

  const response = await SupersetClient.get({
    url,
    headers: { 'Content-Type': 'application/json' },
    parseMethod: null,
  });

  const dto = await response.json();

  return dto.result;
};
