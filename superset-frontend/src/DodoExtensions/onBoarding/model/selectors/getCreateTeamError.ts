import { OnboardingTeamState } from '../types/team.types';

export const getCreateTeamError = (state: {
  onboardingTeam: OnboardingTeamState;
}) => state.onboardingTeam.createTeamError;
