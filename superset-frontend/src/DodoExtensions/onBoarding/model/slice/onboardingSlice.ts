import { ONBOARDING_INIT, OnboardingState } from '../types';

type Action = {
  type: string;
  payload: any;
};

const initialState: OnboardingState = {
  isOnboardingFinished: true,
};

export const onboardingReducer = (
  state: OnboardingState = initialState,
  action: Action,
) => {
  switch (action.type) {
    case ONBOARDING_INIT: {
      return action.payload;
    }
    default: {
      return state;
    }
  }
};
