import { OnboardingTeamState } from '../types/team.types';

export const getCreateTeamData = (state: {
  onboardingTeam: OnboardingTeamState;
}) => state.onboardingTeam.createTeamData;
