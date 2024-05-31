import { OnboardingState } from '../types';

export const getOnboardingStartedTime = (state: {
  onboarding: OnboardingState;
}) => ({
  firstName: state.onboarding.firstName,
  lastName: state.onboarding.lastName,
  email: state.onboarding.email,
});
