import { OnboardingTeamState } from '../types/team.types';

export const getTeamsData = (state: {
  onboardingTeam: OnboardingTeamState;
}) => ({
  teamsIsLoading: state.onboardingTeam.teamsIsLoading,
  teams: state.onboardingTeam.teams,
});
