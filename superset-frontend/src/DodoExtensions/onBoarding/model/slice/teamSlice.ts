import {
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

    default: {
      return state;
    }
  }
};
