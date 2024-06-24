import { Team } from '../../types';

export const ONBOARDING_TEAMS_LOADING = 'ONBOARDING_TEAMS_LOADING';
export const ONBOARDING_TEAMS_SUCCESS = 'ONBOARDING_TEAMS_SUCCESS';
export const ONBOARDING_TEAMS_ERROR = 'ONBOARDING_TEAMS_ERROR';
export const ONBOARDING_TEAMS_CLEAR = 'ONBOARDING_TEAMS_CLEAR';

export const ONBOARDING_CREATE_TEAM_PENDING = 'ONBOARDING_CREATE_TEAM_PENDING';
export const ONBOARDING_CREATE_TEAM_SUCCESS = 'ONBOARDING_CREATE_TEAM_SUCCESS';
export const ONBOARDING_CREATE_TEAM_ERROR = 'ONBOARDING_CREATE_TEAM_ERROR';

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

type ActionTeamsClear = {
  type: typeof ONBOARDING_TEAMS_CLEAR;
};

type ActionCreateTeamPending = {
  type: typeof ONBOARDING_CREATE_TEAM_PENDING;
};

type ActionCreateTeamSuccess = {
  type: typeof ONBOARDING_CREATE_TEAM_SUCCESS;
};

type ActionCreateTeamError = {
  type: typeof ONBOARDING_CREATE_TEAM_ERROR;
  payload: { error: string };
};

type OnboardingTeamAction =
  | ActionTeamsLoading
  | ActionTeamsSuccess
  | ActionTeamsError
  | ActionTeamsClear
  | ActionCreateTeamPending
  | ActionCreateTeamSuccess
  | ActionCreateTeamError;

type OnboardingTeamState = {
  teamsIsLoading: boolean;
  teams: Array<Team>;
  teamsLoadingError: string | null;

  createTeamPending: boolean;
  createTeamError: string | null;
};

export type { OnboardingTeamState, OnboardingTeamAction };
