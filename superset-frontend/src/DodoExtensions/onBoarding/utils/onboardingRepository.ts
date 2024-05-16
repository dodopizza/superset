import { SupersetClient } from '@superset-ui/core';

export const repoUpdateFIO = async (firstName: string, lastName: string) => {
  try {
    const form = new FormData();
    form.append(`first_name`, firstName);
    form.append(`last_name`, lastName);

    await SupersetClient.post({
      url: '/userinfoeditview/form',
      body: form,
      parseMethod: null,
    });
  } catch (e) {
    console.log(`updateFIO catch error`, e);
  }
};

export const repoUpdateOnboardingStartedTime = async () => {
  // TODO - waiting backend API ready
  try {
    console.log(`step one - updating OnboardingStartedTime`);

    await new Promise(resolve => setTimeout(resolve, 1000));
  } catch (e) {
    console.log(`OnboardingStartedTime catch error`, e);
  }
};
