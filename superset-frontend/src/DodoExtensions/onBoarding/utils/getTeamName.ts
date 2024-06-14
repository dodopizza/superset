import { userFromEnum } from '../types';

export const getTeamName = (value: string | null, userFrom?: userFromEnum) => {
  const v = value?.toUpperCase() ?? '';

  if (userFrom === userFromEnum.Franchisee) {
    return `FRANCHISEE ${v}`;
  }
  return v;
};
