import { userFromEnum } from '../types';

export const getTeamSlug = (userFrom: userFromEnum, value: string | null) => {
  const v = value?.toLowerCase().replace(/ /g, '_') ?? '';

  if (userFrom === userFromEnum.Franchisee) {
    return `fr_${v}`;
  }
  return v;
};
