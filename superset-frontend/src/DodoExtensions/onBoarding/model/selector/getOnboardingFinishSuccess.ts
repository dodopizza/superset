import { OnboardingStartState } from '../types/start.types';

export const getOnboardingFinishSuccess = (state: {
  onboardingStart: OnboardingStartState;
}) => state.onboardingStart.finishSuccess;
