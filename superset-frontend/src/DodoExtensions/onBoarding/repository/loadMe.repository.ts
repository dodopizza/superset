import { makeApi } from '@superset-ui/core';
import { OnboardingSuccessPayload } from '../model/types';

type OnboardingMeResponseDto = {
  result: {
    email: string;
    first_name: string;
    id: number;
    is_active: boolean;
    is_anonymous: boolean;
    last_name: string;
    username: string;
  };
};

export const repoLoadMe: () => Promise<OnboardingSuccessPayload> = async () => {
  const getMe = makeApi<void, OnboardingMeResponseDto>({
    method: 'GET',
    endpoint: '/api/v1/me/',
  });
  const dto = await getMe();

  return {
    isOnboardingFinished: false, // TODO - get real response
    firstName: dto.result.first_name,
    lastName: dto.result.last_name,
    email: dto.result.email,
  };
};
