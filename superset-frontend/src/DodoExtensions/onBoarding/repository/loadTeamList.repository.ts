import { SupersetClient } from '@superset-ui/core';
import { Team, userFromEnum } from '../types';

type ResponseDto = {};

export const loadTeamListRepository = async (
  userFrom: userFromEnum,
  query: string,
): Promise<Array<Team>> => {
  const url = `/api/v1/team/?isExternal=${
    userFrom === userFromEnum.Franchisee
  }&query=${query}`;

  const response = await SupersetClient.get({
    url,
    headers: { 'Content-Type': 'application/json' },
    parseMethod: null,
  });

  const dto: ResponseDto = await response.json();

  return [];
};
