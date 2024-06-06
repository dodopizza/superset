import { Team } from '../types';

export const ONBOARDING_INIT_LOADING = 'ONBOARDING_INIT_LOADING';
export const ONBOARDING_INIT_SUCCESS = 'ONBOARDING_INIT_SUCCESS';
export const ONBOARDING_INIT_ERROR = 'ONBOARDING_INIT_ERROR';

export const ONBOARDING_TEAMS_LOADING = 'ONBOARDING_TEAMS_LOADING';
export const ONBOARDING_TEAMS_SUCCESS = 'ONBOARDING_TEAMS_SUCCESS';
export const ONBOARDING_TEAMS_ERROR = 'ONBOARDING_TEAMS_ERROR';

export const ONBOARDING_FINISH_UPDATING = 'ONBOARDING_FINISH_UPDATING';
export const ONBOARDING_FINISH_SUCCESS = 'ONBOARDING_FINISH_SUCCESS';
export const ONBOARDING_FINISH_ERROR = 'ONBOARDING_FINISH_ERROR';

export const ONBOARDING_STEP_ONE_FINISH_UPDATING =
  'ONBOARDING_STEP_ONE_FINISH_UPDATING';
export const ONBOARDING_STEP_ONE_FINISH_SUCCESS =
  'ONBOARDING_STEP_ONE_FINISH_SUCCESS';
export const ONBOARDING_STEP_ONE_FINISH_ERROR =
  'ONBOARDING_STEP_ONE_FINISH_ERROR';

export type OnboardingSuccessPayload = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  isOnboardingFinished: boolean;
  onboardingStartedTime: Date | null;
};

export type OnboardingStepOneSuccessPayload = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  onboardingStartedTime: Date | null;
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

type ActionFinishUpdating = {
  type: typeof ONBOARDING_FINISH_UPDATING;
};

type ActionFinishSuccess = {
  type: typeof ONBOARDING_FINISH_SUCCESS;
};

type ActionFinishError = {
  type: typeof ONBOARDING_FINISH_ERROR;
  payload: { error: string };
};

type ActionStepOneFinishUpdating = {
  type: typeof ONBOARDING_STEP_ONE_FINISH_UPDATING;
};

type ActionStepOneFinishSuccess = {
  type: typeof ONBOARDING_STEP_ONE_FINISH_SUCCESS;
  payload: OnboardingStepOneSuccessPayload;
};

type ActionStepOneFinishError = {
  type: typeof ONBOARDING_STEP_ONE_FINISH_ERROR;
  payload: { error: string };
};

export type OnboardingAction =
  | ActionInitLoading
  | ActionInitSuccess
  | ActionInitError
  | ActionTeamsLoading
  | ActionTeamsSuccess
  | ActionTeamsError
  | ActionFinishUpdating
  | ActionFinishSuccess
  | ActionFinishError
  | ActionStepOneFinishUpdating
  | ActionStepOneFinishSuccess
  | ActionStepOneFinishError;

export type OnboardingState = {
  isLoading: boolean;
  loadingError: string | null;

  onboardingStartedTime: Date | null;
  isOnboardingFinished: boolean;

  id: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;

  stepOneUpdating: boolean;
  stepOneError: string | null;

  teamsIsLoading: boolean;
  teams: Array<Team>;
  teamsLoadingError: string | null;

  finishUpdating: boolean;
  finishSuccess: boolean;
  finishSuccessError: string | null;
};
