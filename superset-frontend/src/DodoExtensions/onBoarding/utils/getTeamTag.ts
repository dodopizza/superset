import { userFromEnum } from '../types';

export const getTeamTag = (value: string | null, userFrom?: userFromEnum) => {
  const v = value?.toLowerCase().replace(/ /g, '_') ?? '';

  if (userFrom === userFromEnum.Franchisee) {
    return `fr_${v}`;
  }
  return v;
};
