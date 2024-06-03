import { OnboardingState } from '../types';

export const getTeamsData = (state: { onboarding: OnboardingState }) => ({
  teamsIsLoading: state.onboarding.teamsIsLoading,
  teams: state.onboarding.teams,
});
