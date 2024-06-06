import { SupersetClient } from '@superset-ui/core';
import { OnboardingStepOneSuccessPayload } from '../model/types';
import { MeOnboardingResponseDto } from './meOnboarding.response.dto';

export const repoPutMeOnboarding: (
  dodoRole: string,
) => Promise<OnboardingStepOneSuccessPayload> = async (dodoRole: string) => {
  const respose = await SupersetClient.put({
    url: '/api/v1/me/onboarding',
    body: JSON.stringify({
      dodo_role: dodoRole,
      onboardingStartedTime: new Date(),
    }),
    headers: { 'Content-Type': 'application/json' },
    parseMethod: null,
  });

  const dto: MeOnboardingResponseDto = await respose.json();

  return {
    id: dto.result.id,
    onboardingStartedTime:
      dto.result.onboardingStartedTime instanceof Date
        ? dto.result.onboardingStartedTime
        : null,
    firstName: dto.result.first_name,
    lastName: dto.result.last_name,
    email: dto.result.email,
  };
};
