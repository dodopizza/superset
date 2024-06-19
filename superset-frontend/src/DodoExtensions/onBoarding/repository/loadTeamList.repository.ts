import { SupersetClient } from '@superset-ui/core';
import rison from 'rison';
import { Role, Team, userFromEnum } from '../types';

enum Operation {
  contains = 'ct_name',
  equals = 'eq_external',
}

type ResponseDtoRecord = {
  id: number;
  isExternal: boolean;
  name: string;
  roles: Array<{ id: number; name: string }>;
};

type ResponseDto = {
  result: Array<ResponseDtoRecord>;
};

const fromDtoFactory = (dtoRecord: ResponseDtoRecord): Team => {
  const getRole = ({ name }: { id: number; name: string }): Role => {
    switch (name) {
      case Role.AnalyseData: {
        return Role.AnalyseData;
      }
      case Role.CreateData: {
        return Role.CreateData;
      }
      case Role.UseData: {
        return Role.UseData;
      }
      case Role.InputData: {
        return Role.InputData;
      }
      default:
        return Role.Unknown;
    }
  };

  return {
    value: `${dtoRecord.id}`,
    label: dtoRecord.name,
    roles: dtoRecord.roles.map(role => getRole(role)),
  };
};

export const loadTeamListRepository = async (
  userFrom: userFromEnum,
  query: string,
): Promise<Array<Team>> => {
  const filterExps = [
    { col: 'name', opr: Operation.contains, value: query },
    {
      col: 'isExternal',
      opr: Operation.equals,
      value: userFrom === userFromEnum.Franchisee ? 1 : 0,
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
