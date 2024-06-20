import { SupersetClient } from '@superset-ui/core';
import { ActionRequestListSuccessPayload } from '../model/types/requestList.types';
import { parseRoles } from './utils/parseRoles';

type ResponseDto = {
  count: number;
  result: Array<{
    id: number;
    // need first name
    // need last name
    // need email
    // need current roles
    request_roles: string;
    team: string;
    team_slug: string;
    created_datetime: string;
    finished: boolean;

    // not need isExternal: boolean;
    // not need isNewTeam: boolean;
    // not need last_changed_datetime: string;
    // not need user_id: number;
  }>;
};

export const getStatementRepository =
  async (): Promise<ActionRequestListSuccessPayload> => {
    const url = `/api/v1/statement/`;

    const response = await SupersetClient.get({
      url,
      headers: { 'Content-Type': 'application/json' },
      parseMethod: null,
    });

    const dto: ResponseDto = await response.json();

    return {
      count: dto.count,
      rows: dto.result.map(item => ({
        id: item.id,
        firstName: 'mock first name',
        lastName: 'mock last name',
        email: 'mock email',
        team: `${item.team} (${item.team_slug})`,
        requestedRoles: parseRoles(item.request_roles).join(', '),
        isClosed: item.finished,
        requestDate: new Date(item.created_datetime),
      })),
    };
  };
