import { SupersetClient } from '@superset-ui/core';
import { OnboardingStepOneSuccessPayload } from '../model/types/start.types';

type ResponseDto = {
  result: {
    dodo_role: string;
    onboardingStartedTime: string;
  };
};

export const putMeOnboardingRepository: (
  dodoRole: string,
) => Promise<OnboardingStepOneSuccessPayload> = async (dodoRole: string) => {
  const response = await SupersetClient.put({
    url: '/api/v1/onboarding/',
    body: JSON.stringify({
      dodo_role: dodoRole,
      onboardingStartedTime: new Date(),
    }),
    headers: { 'Content-Type': 'application/json' },
    parseMethod: null,
  });

  const dto: ResponseDto = await response.json();

  return {
    onboardingStartedTime: dto.result.onboardingStartedTime,
  };
};
