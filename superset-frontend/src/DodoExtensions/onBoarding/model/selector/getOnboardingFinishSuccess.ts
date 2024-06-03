import { OnboardingState } from '../types';

export const getOnboardingFinishSuccess = (state: {
  onboarding: OnboardingState;
}) => state.onboarding.finishSuccess;
