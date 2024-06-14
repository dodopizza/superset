import { Team } from '../../types';

export const ONBOARDING_TEAMS_LOADING = 'ONBOARDING_TEAMS_LOADING';
export const ONBOARDING_TEAMS_SUCCESS = 'ONBOARDING_TEAMS_SUCCESS';
export const ONBOARDING_TEAMS_ERROR = 'ONBOARDING_TEAMS_ERROR';

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

type OnboardingTeamAction =
  | ActionTeamsLoading
  | ActionTeamsSuccess
  | ActionTeamsError;

type OnboardingTeamState = {
  teamsIsLoading: boolean;
  teams: Array<Team>;
  teamsLoadingError: string | null;
};

export type { OnboardingTeamState, OnboardingTeamAction };
