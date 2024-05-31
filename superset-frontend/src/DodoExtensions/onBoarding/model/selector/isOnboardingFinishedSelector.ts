import { OnboardingState } from '../types';

export const isOnboardingFinishedSelector = (state: {
  onboarding: OnboardingState;
}) => state.onboarding.isOnboardingFinished;
