import { Dispatch } from '@reduxjs/toolkit';
import { UserFromEnum } from '../../types';

import { getTeamsRepository } from '../../repository/getTeams.repository';
import {
  ONBOARDING_TEAMS_ERROR,
  ONBOARDING_TEAMS_LOADING,
  ONBOARDING_TEAMS_SUCCESS,
} from '../types/team.types';

let beforeSendToBackendQuery = '';

export function loadTeams(userFrom: UserFromEnum, query: string) {
  return async function (dispatch: Dispatch) {
    try {
      dispatch({
        type: ONBOARDING_TEAMS_LOADING,
      });

      beforeSendToBackendQuery = query;

      const data = await getTeamsRepository(userFrom, query);

      // to handle backend raise condition
      if (query === beforeSendToBackendQuery) {
        dispatch({
          type: ONBOARDING_TEAMS_SUCCESS,
          payload: data,
        });
      }
    } catch (e) {
      if (e.status === 404) {
        // No team found
        dispatch({
          type: ONBOARDING_TEAMS_SUCCESS,
          payload: [],
        });
      } else {
        dispatch({
          type: ONBOARDING_TEAMS_ERROR,
          payload: {
            error: e.message,
          },
        });
      }
    }
  };
}
