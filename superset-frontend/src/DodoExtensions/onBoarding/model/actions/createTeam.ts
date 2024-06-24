import { Dispatch } from '@reduxjs/toolkit';
import {
  ONBOARDING_CREATE_TEAM_ERROR,
  ONBOARDING_CREATE_TEAM_PENDING,
  ONBOARDING_CREATE_TEAM_SUCCESS,
} from '../types/team.types';
import { postTeamRepository } from '../../repository/postTeam.repository';
import { UserFromEnum } from '../../types';

type Params = {
  userFrom: UserFromEnum;
  name: string;
  slug: string;
  roles: Array<string>;
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
      });
    } catch (e) {
      dispatch({
        type: ONBOARDING_CREATE_TEAM_ERROR,
        payload: {
          error: e.message,
        },
      });
    }
  };
}
