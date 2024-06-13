import {
  ONBOARDING_REQUEST_ERROR,
  ONBOARDING_REQUEST_LOADING,
  ONBOARDING_REQUEST_SUCCESS,
  OnboardingRequestAction,
  OnboardingRequestState,
} from '../types/request.types';

const initialState: OnboardingRequestState = {
  requestIsLoading: false,
  loadingRequestError: null,
  requestData: null,
};

export const onboardingRequestSlice = (
  state: OnboardingRequestState = initialState,
  action: OnboardingRequestAction,
): OnboardingRequestState => {
  switch (action.type) {
    case ONBOARDING_REQUEST_LOADING: {
      return { ...state, requestIsLoading: true };
    }
    case ONBOARDING_REQUEST_SUCCESS: {
      return { ...state, requestIsLoading: false, requestData: action.payload };
    }
    case ONBOARDING_REQUEST_ERROR: {
      return {
        ...state,
        requestIsLoading: false,
        loadingRequestError: action.payload.error,
      };
    }

    default: {
      return state;
    }
  }
};
