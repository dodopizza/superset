import { makeApi } from '@superset-ui/core';
import { OnboardingSuccessPayload } from '../model/types';
import { MeOnboardingResponseDto } from './meOnboarding.response.dto';

export const repoGetMeOnboarding: () => Promise<OnboardingSuccessPayload> =
  async () => {
    const getMe = makeApi<void, MeOnboardingResponseDto>({
      method: 'GET',
      endpoint: '/api/v1/me/onboarding',
    });
    const dto = await getMe();

    return {
      id: dto.result.id,
      isOnboardingFinished: dto.result.isOnboardingFinished ?? false,
      onboardingStartedTime:
        dto.result.onboardingStartedTime instanceof Date
          ? dto.result.onboardingStartedTime
          : null,
      firstName: dto.result.first_name,
      lastName: dto.result.last_name,
      email: dto.result.email,
    };
  };
