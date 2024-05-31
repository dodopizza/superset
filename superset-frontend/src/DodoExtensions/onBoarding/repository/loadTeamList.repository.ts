import { Role, Team, userFromEnum } from '../types';

export const repoLoadTeamList = async (
  userFrom: userFromEnum,
  query: string,
): Promise<Array<Team>> => {
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
