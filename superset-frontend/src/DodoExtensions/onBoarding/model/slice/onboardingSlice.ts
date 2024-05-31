import {
  ONBOARDING_INIT_ERROR,
  ONBOARDING_INIT_LOADING,
  ONBOARDING_INIT_SUCCESS,
  OnboardingAction,
  OnboardingState,
} from '../types';

const initialState: OnboardingState = {
  isLoading: false,
  loadingError: null,

  isOnboardingFinished: true,
  onboardingStartedTime: null,

  firstName: null,
  lastName: null,
  email: null,
};

export const onboardingSlice = (
  state: OnboardingState = initialState,
  action: OnboardingAction,
) => {
  switch (action.type) {
    case ONBOARDING_INIT_LOADING: {
      return { ...state, isLoading: true };
    }
    case ONBOARDING_INIT_SUCCESS: {
      return { ...state, isLoading: false, ...action.payload };
    }
    case ONBOARDING_INIT_ERROR: {
      return {
        ...state,
        isLoading: false,
        loadingError: action.payload.error,
      };
    }
    default: {
      return state;
    }
  }
};
