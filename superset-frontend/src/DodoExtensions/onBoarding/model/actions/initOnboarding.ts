import { Dispatch } from '@reduxjs/toolkit';
import {
  ONBOARDING_INIT_ERROR,
  ONBOARDING_INIT_LOADING,
  ONBOARDING_INIT_SUCCESS,
} from '../types';
import { repoGetMeOnboarding } from '../../repository/getMeOnboarding.repository';

export function initOnboarding() {
  return async function (dispatch: Dispatch) {
    try {
      dispatch({
        type: ONBOARDING_INIT_LOADING,
      });

      const data = await repoGetMeOnboarding();

      dispatch({
        type: ONBOARDING_INIT_SUCCESS,
        payload: data,
      });
    } catch (e) {
      dispatch({
        type: ONBOARDING_INIT_ERROR,
        payload: {
          error: e.message,
        },
      });
    }
  };
}
