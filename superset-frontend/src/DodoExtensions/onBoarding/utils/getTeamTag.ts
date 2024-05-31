import { userFromEnum } from '../types';

export const getTeamTag = (userFrom: userFromEnum, value: string | null) => {
  const v = value?.toLowerCase().replace(' ', '_') ?? '';

  if (userFrom === userFromEnum.Franchisee) {
    return `fr_${v}`;
  }
  return v;
};
