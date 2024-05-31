export const ONBOARDING_INIT_LOADING = 'ONBOARDING_INIT_LOADING';
export const ONBOARDING_INIT_SUCCESS = 'ONBOARDING_INIT_SUCCESS';
export const ONBOARDING_INIT_ERROR = 'ONBOARDING_INIT_ERROR';

export type OnboardingSuccessPayload = {
  isOnboardingFinished: boolean;
  firstName: string;
  lastName: string;
  email: string;
};

type ActionLoading = {
  type: typeof ONBOARDING_INIT_LOADING;
};

type ActionError = {
  type: typeof ONBOARDING_INIT_ERROR;
  payload: { error: string };
};

type ActionSuccess = {
  type: typeof ONBOARDING_INIT_SUCCESS;
  payload: OnboardingSuccessPayload;
};

export type OnboardingAction = ActionLoading | ActionSuccess | ActionError;

export type OnboardingState = {
  isLoading: boolean;
  loadingError: string | null;

  isOnboardingFinished: boolean;

  firstName: string | null;
  lastName: string | null;
  email: string | null;
};
