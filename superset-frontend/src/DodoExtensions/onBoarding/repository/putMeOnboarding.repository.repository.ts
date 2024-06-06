import { SupersetClient } from '@superset-ui/core';

export const repoPutMeOnboarding = async (dodoRole: string) => {
  try {
    await SupersetClient.put({
      url: '/api/v1/me/onboarding',
      body: {
        dodo_role: dodoRole,
        onboardingStartedTime: new Date(),
      },
      headers: { 'Content-Type': 'application/json' },
      parseMethod: null,
    });
  } catch (e) {
    console.log(`repoPutMeOnboarding catch error`, e);
  }
};
