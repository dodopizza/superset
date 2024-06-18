import { Dispatch } from '@reduxjs/toolkit';
import { StepTwoPopupDto } from '../../components/stepTwoPopup/stepTwoPopup.dto';
import {
  ONBOARDING_FINISH_ERROR,
  ONBOARDING_FINISH_SUCCESS,
  ONBOARDING_FINISH_UPDATING,
} from '../types/start.types';
import { repoFinishOnboarding } from '../../repository/finishOnboarding';

export function finishOnBoarding(dto: StepTwoPopupDto) {
  return async function (dispatch: Dispatch) {
    try {
      dispatch({
        type: ONBOARDING_FINISH_UPDATING,
      });

      await repoFinishOnboarding(dto);

      dispatch({
        type: ONBOARDING_FINISH_SUCCESS,
      });
    } catch (e) {
      dispatch({
        type: ONBOARDING_FINISH_ERROR,
        payload: {
          error: e.message,
        },
      });
    }
  };
}
