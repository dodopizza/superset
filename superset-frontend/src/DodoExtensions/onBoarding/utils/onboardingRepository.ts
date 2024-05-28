import { SupersetClient } from '@superset-ui/core';
import { Team } from '../types';

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
    console.log(`repoUpdateFIO catch error`, e);
  }
};

export const repoUpdateOnboardingStartedTime = async () => {
  // TODO - waiting backend API ready
  try {
    console.log(`step one - updating OnboardingStartedTime`);

    await new Promise(resolve => setTimeout(resolve, 1000));
  } catch (e) {
    console.log(`repoUpdateOnboardingStartedTime catch error`, e);
  }
};

export const repoLoadTeamList = async (query: string): Promise<Array<Team>> => {
  try {
    return await new Promise(resolve =>
      setTimeout(
        () =>
          resolve([
            { label: `team one label`, value: `team one value` },
            { label: `team two label`, value: `team two value` },
            { label: `one more label`, value: `one more value` },
          ]),
        2000,
      ),
    );
  } catch (e) {
    console.log(`repoLoadTeamList catch error`, e);
    return [];
  }
};
