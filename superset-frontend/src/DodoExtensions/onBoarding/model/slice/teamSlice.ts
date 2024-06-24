import {
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
      return { ...state, createTeamPending: true };
    }
    case ONBOARDING_CREATE_TEAM_SUCCESS: {
      return { ...state, createTeamPending: false };
    }
    case ONBOARDING_CREATE_TEAM_ERROR: {
      return {
        ...state,
        createTeamPending: false,
        createTeamError: action.payload.error,
      };
    }

    default: {
      return state;
    }
  }
};
