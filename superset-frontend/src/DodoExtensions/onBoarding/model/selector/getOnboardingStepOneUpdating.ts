import { OnboardingState } from '../types';

export const getOnboardingStepOneUpdating = (state: {
  onboarding: OnboardingState;
}) => state.onboarding.stepOneUpdating;
