import {
  ONBOARDING_CREATE_TEAM_CLEAR,
  ONBOARDING_CREATE_TEAM_ERROR,
  ONBOARDING_CREATE_TEAM_PENDING,
  ONBOARDING_CREATE_TEAM_SUCCESS,
  ONBOARDING_TEAMS_CLEAR,
  ONBOARDING_TEAMS_ERROR,
  ONBOARDING_TEAMS_LOADING,
  ONBOARDING_TEAMS_SUCCESS,
  OnboardingTeamAction,
  OnboardingTeamState,
} from '../types/team.types';

const initialState: OnboardingTeamState = {
  teamsIsLoading: false,
  teams: [],
  teamsLoadingError: null,

  createTeamPending: false,
  createTeamError: null,
  createTeamData: null,
};

export const onboardingTeamSlice = (
  state: OnboardingTeamState = initialState,
  action: OnboardingTeamAction,
): OnboardingTeamState => {
  switch (action.type) {
    case ONBOARDING_TEAMS_LOADING: {
      return { ...state, teamsIsLoading: true };
    }
    case ONBOARDING_TEAMS_SUCCESS: {
      return { ...state, teamsIsLoading: false, teams: action.payload };
    }
    case ONBOARDING_TEAMS_ERROR: {
      return {
        ...state,
        teamsIsLoading: false,
        teamsLoadingError: action.payload.error,
      };
    }
    case ONBOARDING_TEAMS_CLEAR: {
      return {
        ...state,
        teams: [],
      };
    }

    case ONBOARDING_CREATE_TEAM_PENDING: {
      return {
        ...state,
        createTeamPending: true,
        createTeamError: null,
        createTeamData: null,
      };
    }
    case ONBOARDING_CREATE_TEAM_SUCCESS: {
      return {
        ...state,
        createTeamPending: false,
        createTeamError: null,
        createTeamData: action.payload,
      };
    }
    case ONBOARDING_CREATE_TEAM_ERROR: {
      return {
        ...state,
        createTeamPending: false,
        createTeamData: null,
        createTeamError: action.payload.error,
      };
    }
    case ONBOARDING_CREATE_TEAM_CLEAR: {
      return {
        ...state,
        createTeamPending: false,
        createTeamError: null,
        createTeamData: null,
      };
    }

    default: {
      return state;
    }
  }
};
