import { SupersetClient } from '@superset-ui/core';
import { Role, Team } from '../types';

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
    // await SupersetClient.postForm(
    //   '/userinfoeditview/form',
    //   { first_name: `${firstName}1`, last_name: `${lastName}1` },
    //   '_self',
    // );
  } catch (e) {
    console.log(`repoUpdateFIO catch error`, e);
  }
};

export const repoUpdateOnboardingStartedTimeAndRole = async (
  roleOrTeam: string,
) => {
  // TODO - waiting backend API ready
  try {
    console.log(
      `step one - updating OnboardingStartedTime and Role & Team:${roleOrTeam}`,
    );

    await new Promise(resolve => setTimeout(resolve, 1000));
  } catch (e) {
    console.log(`repoUpdateOnboardingStartedTimeAndRole catch error`, e);
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
