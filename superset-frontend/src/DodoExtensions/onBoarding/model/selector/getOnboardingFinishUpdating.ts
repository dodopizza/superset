import { OnboardingState } from '../types';

export const getOnboardingFinishUpdating = (state: {
  onboarding: OnboardingState;
}) => state.onboarding.finishUpdating;
