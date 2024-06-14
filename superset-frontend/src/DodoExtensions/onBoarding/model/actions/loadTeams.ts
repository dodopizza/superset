import { Dispatch } from '@reduxjs/toolkit';
import { userFromEnum } from '../../types';

import { repoLoadTeamList } from '../../repository/loadTeamList.repository';
import {
  ONBOARDING_TEAMS_ERROR,
  ONBOARDING_TEAMS_LOADING,
  ONBOARDING_TEAMS_SUCCESS,
} from '../types/team.types';

let beforeSendToBackendQuery = '';

export function loadTeams(userFrom: userFromEnum, query: string) {
  return async function (dispatch: Dispatch) {
    try {
      dispatch({
        type: ONBOARDING_TEAMS_LOADING,
      });

      beforeSendToBackendQuery = query;
      const data = await repoLoadTeamList(userFrom, query);

      // to handle backend raise condition
      if (query === beforeSendToBackendQuery) {
        dispatch({
          type: ONBOARDING_TEAMS_SUCCESS,
          payload: data,
        });
      }
    } catch (e) {
      dispatch({
        type: ONBOARDING_TEAMS_ERROR,
        payload: {
          error: e.message,
        },
      });
    }
  };
}
