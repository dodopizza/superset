import { OnboardingState } from '../types';

export const getIsOnboardingFinished = (state: {
  onboarding: OnboardingState;
}) => state.onboarding.isOnboardingFinished;
