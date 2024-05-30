import { makeApi, SupersetClient } from '@superset-ui/core';
import { Role, Team } from '../types';
import { User } from '../../../types/bootstrapTypes';

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
            {
              label: `admin`,
              value: `admin`,
              roles: [
                Role.AnalyseData,
                Role.UseData,
                Role.InputData,
                Role.CreateData,
              ],
            },
            {
              label: `alfa`,
              value: `alfa`,
              roles: [Role.AnalyseData, Role.UseData, Role.InputData],
            },
            {
              label: `betta`,
              value: `betta`,
              roles: [Role.AnalyseData, Role.UseData],
            },
            {
              label: `gamma`,
              value: `gamma`,
              roles: [Role.AnalyseData],
            },
          ]),
        2000,
      ),
    );
  } catch (e) {
    console.log(`repoLoadTeamList catch error`, e);
    return [];
  }
};

export const repoLoadMe = async () => {
  const getMe = makeApi<void, User>({
    method: 'GET',
    endpoint: '/api/v1/me/',
  });
  const res = await getMe();
  console.log('getMe, res', res);
};
