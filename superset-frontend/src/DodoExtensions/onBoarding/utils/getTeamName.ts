import { userFromEnum } from '../types';

export const getTeamName = (userFrom: userFromEnum, value: string | null) => {
  const v = value?.toUpperCase() ?? '';

  if (userFrom === userFromEnum.Franchisee) {
    return `FRANCHISEE ${v}`;
  }
  return v;
};
