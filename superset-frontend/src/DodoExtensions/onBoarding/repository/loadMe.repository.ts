import { makeApi } from '@superset-ui/core';
import { OnboardingSuccessPayload } from '../model/types';

type OnboardingMeResponseDto = {
  result: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    is_onboarding_finished: boolean; // TODO - get real response
    onboarding_started_time: Date | null; // TODO - get real response
  };
};

export const repoLoadMe: () => Promise<OnboardingSuccessPayload> = async () => {
  const getMe = makeApi<void, OnboardingMeResponseDto>({
    method: 'GET',
    endpoint: '/api/v1/me/',
  });
  const dto = await getMe();

  return {
    isOnboardingFinished: dto.result.is_onboarding_finished ?? false, // TODO - delete default with real response
    onboardingStartedTime: dto.result.onboarding_started_time ?? null, // TODO - delete default with real response
    firstName: dto.result.first_name,
    lastName: dto.result.last_name,
    email: dto.result.email,
  };
};
