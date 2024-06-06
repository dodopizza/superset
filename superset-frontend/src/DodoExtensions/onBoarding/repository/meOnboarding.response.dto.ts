export type MeOnboardingResponseDto = {
  result: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    isOnboardingFinished?: boolean | null;
    onboardingStartedTime: Date | null;
  };
};
