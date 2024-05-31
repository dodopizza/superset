import { OnboardingState } from '../types';

export const getOnboardingStartedTime = (state: {
  onboarding: OnboardingState;
}) => state.onboarding.onboardingStartedTime;
