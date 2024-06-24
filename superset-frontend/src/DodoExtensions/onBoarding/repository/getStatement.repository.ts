import { SupersetClient } from '@superset-ui/core';
import { ActionRequestSuccessPayload } from '../model/types/request.types';
import { userFromEnum } from '../types';

type ResponseDto = {
  result: {
    created_datetime: string;
    dodo_role: string;
    finished: boolean;
    id: number;
    isExternal: boolean;
    isNewTeam: boolean;
    last_changed_datetime: string;
    request_roles: Array<string>;
    team: string;
    team_slug: string;
    user: Array<{
      email: string;
      first_name: string;
      id: number;
      last_name: string;
      roles: Array<{
        id: 1;
        name: 'Admin';
      }>;
      username: 'admin';
    }>;
  };
};

export const getStatementRepository = async (
  id: string,
): Promise<ActionRequestSuccessPayload | null> => {
  const url = `/api/v1/statement/${id}`;

  const response = await SupersetClient.get({
    url,
    headers: { 'Content-Type': 'application/json' },
    parseMethod: null,
  });

  const dto: ResponseDto = await response.json();

  return {
    userFrom: dto.result.isExternal
      ? userFromEnum.Franchisee
      : userFromEnum.ManagingCompany,
    firstName: dto.result.user.at(0)?.first_name ?? '',
    lastName: dto.result.user.at(0)?.last_name ?? '',
    email: dto.result.user.at(0)?.email ?? '',
    dodoRole: dto.result.dodo_role,
    currentRoles: dto.result.user.at(0)?.roles.map(role => role.name) ?? [],
    requestedRoles: dto.result.request_roles,
    team: `${dto.result.team} (${dto.result.team_slug})`,
    requestDate: new Date(dto.result.created_datetime),
    isClosed: dto.result.finished,
    updateDate: new Date(dto.result.last_changed_datetime),
  };
};
