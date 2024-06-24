import { Dispatch } from '@reduxjs/toolkit';
import {
  ONBOARDING_CREATE_TEAM_ERROR,
  ONBOARDING_CREATE_TEAM_PENDING,
  ONBOARDING_CREATE_TEAM_SUCCESS,
} from '../types/team.types';
import { postTeamRepository } from '../../repository/postTeam.repository';
import { Role, UserFromEnum } from '../../types';

type Params = {
  userFrom: UserFromEnum;
  name: string;
  slug: string;
  roles: Array<Role>;
};

export function createTeam(params: Params) {
  return async function (dispatch: Dispatch) {
    try {
      dispatch({
        type: ONBOARDING_CREATE_TEAM_PENDING,
      });

      await postTeamRepository(params);

      dispatch({
        type: ONBOARDING_CREATE_TEAM_SUCCESS,
        payload: {
          slug: params.slug,
          name: params.name,
          roles: params.roles,
        },
      });
    } catch (response) {
      const { statusText } = response;
      const error = await response.json();

      dispatch({
        type: ONBOARDING_CREATE_TEAM_ERROR,
        payload: {
          error: `${statusText}:${JSON.stringify(error)}`,
        },
      });
    }
  };
}
