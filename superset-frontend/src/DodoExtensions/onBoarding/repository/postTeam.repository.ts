import { SupersetClient } from '@superset-ui/core';
import { UserFromEnum } from '../types';

type Params = {
  userFrom: UserFromEnum;
  name: string;
  slug: string;
  roles: Array<string>;
};

export const postTeamRepository = async (params: Params): Promise<void> => {
  await SupersetClient.post({
    url: '/api/v1/team/',
    body: JSON.stringify({
      isExternal: params.userFrom === UserFromEnum.Franchisee ? 1 : 0,
      name: params.name,
      slug: params.slug,
      roles: params.roles,
    }),
    headers: { 'Content-Type': 'application/json' },
    parseMethod: null,
  });
};
