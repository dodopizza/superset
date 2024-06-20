import { Dispatch } from '@reduxjs/toolkit';
import {
  ONBOARDING_REQUEST_LIST_ERROR,
  ONBOARDING_REQUEST_LIST_LOADING,
  ONBOARDING_REQUEST_LIST_SUCCESS,
} from '../types/requestList.types';
import { getStatementRepository } from '../../repository/getStatement';

export function loadRequestList() {
  return async function (dispatch: Dispatch) {
    try {
      dispatch({
        type: ONBOARDING_REQUEST_LIST_LOADING,
      });

      const data = await getStatementRepository();

      dispatch({
        type: ONBOARDING_REQUEST_LIST_SUCCESS,
        payload: data,
      });
    } catch (e) {
      dispatch({
        type: ONBOARDING_REQUEST_LIST_ERROR,
        payload: {
          error: e.message,
        },
      });
    }
  };
}
