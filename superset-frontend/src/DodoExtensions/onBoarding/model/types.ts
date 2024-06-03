import { Team } from '../types';

export const ONBOARDING_INIT_LOADING = 'ONBOARDING_INIT_LOADING';
export const ONBOARDING_INIT_SUCCESS = 'ONBOARDING_INIT_SUCCESS';
export const ONBOARDING_INIT_ERROR = 'ONBOARDING_INIT_ERROR';

export const ONBOARDING_TEAMS_LOADING = 'ONBOARDING_TEAMS_LOADING';
export const ONBOARDING_TEAMS_SUCCESS = 'ONBOARDING_TEAMS_SUCCESS';
export const ONBOARDING_TEAMS_ERROR = 'ONBOARDING_TEAMS_ERROR';

export type OnboardingSuccessPayload = {
  isOnboardingFinished: boolean;
  onboardingStartedTime: Date | null;
  firstName: string;
  lastName: string;
  email: string;
};

type ActionInitLoading = {
  type: typeof ONBOARDING_INIT_LOADING;
};

type ActionInitError = {
  type: typeof ONBOARDING_INIT_ERROR;
  payload: { error: string };
};

type ActionInitSuccess = {
  type: typeof ONBOARDING_INIT_SUCCESS;
  payload: OnboardingSuccessPayload;
};

type ActionTeamsLoading = {
  type: typeof ONBOARDING_TEAMS_LOADING;
};

type ActionTeamsSuccess = {
  type: typeof ONBOARDING_TEAMS_SUCCESS;
  payload: Team[];
};

type ActionTeamsError = {
  type: typeof ONBOARDING_TEAMS_ERROR;
  payload: { error: string };
};

export type OnboardingAction =
  | ActionInitLoading
  | ActionInitSuccess
  | ActionInitError
  | ActionTeamsLoading
  | ActionTeamsSuccess
  | ActionTeamsError;

export type OnboardingState = {
  isLoading: boolean;
  loadingError: string | null;

  onboardingStartedTime: Date | null;
  isOnboardingFinished: boolean;

  firstName: string | null;
  lastName: string | null;
  email: string | null;

  teamsIsLoading: boolean;
  teams: Array<Team>;
  teamsLoadingError: string | null;
};
