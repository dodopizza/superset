import { SupersetClient } from '@superset-ui/core';
import rison from 'rison';
import { Team, UserFromEnum } from '../types';
import { getRoleFromString } from '../utils/getRoleFromString';

enum Operation {
  contains = 'ct_name',
  equals = 'eq_external',
}

type ResponseDtoRecord = {
  id: number;
  isExternal: boolean;
  name: string;
  slug: string;
  roles: Array<{ name: string }>;
};

type ResponseDto = {
  result: Array<ResponseDtoRecord>;
};

const fromDtoFactory = (dtoRecord: ResponseDtoRecord): Team => ({
  value: dtoRecord.slug,
  label: dtoRecord.name,
  roles: dtoRecord.roles.map(role => getRoleFromString(role)),
});

export const getTeamsRepository = async (
  userFrom: UserFromEnum,
  query: string,
): Promise<Array<Team>> => {
  const filterExps = [
    { col: 'name', opr: Operation.contains, value: query },
    {
      col: 'isExternal',
      opr: Operation.equals,
      value: userFrom === UserFromEnum.Franchisee ? 1 : 0,
    },
  ];

  const queryParams = rison.encode_uri({ filters: filterExps });

  const url = `/api/v1/team/?q=${queryParams}`;

  const response = await SupersetClient.get({
    url,
    headers: { 'Content-Type': 'application/json' },
    parseMethod: null,
  });

  const dto: ResponseDto = await response.json();

  return dto.result.map(item => fromDtoFactory(item));
};