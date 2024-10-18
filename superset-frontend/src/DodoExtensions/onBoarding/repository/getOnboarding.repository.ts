import { makeApi } from '@superset-ui/core';
import { OnboardingSuccessPayload } from '../model/types/start.types';

type ResponseDto = {
  result: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    isOnboardingFinished: boolean;
    onboardingStartedTime: string | null;
  };
};

export const getOnboardingRepository: () => Promise<OnboardingSuccessPayload> =
  async () => {
    const getMe = makeApi<void, ResponseDto>({
      method: 'GET',
      endpoint: '/api/v1/onboarding/',
    });
    const dto = await getMe();

    return {
      id: dto.result.id,
      isOnboardingFinished: dto.result.isOnboardingFinished ?? false,
      onboardingStartedTime: dto.result.onboardingStartedTime,
      firstName: dto.result.first_name,
      lastName: dto.result.last_name,
      email: dto.result.email,
    };
  };
