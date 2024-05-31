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
              label: `ADMIN`,
              value: `admin`,
              roles: [
                Role.AnalyseData,
                Role.UseData,
                Role.InputData,
                Role.CreateData,
              ],
            },
            {
              label: `ALFA`,
              value: `alfa`,
              roles: [Role.AnalyseData, Role.UseData, Role.InputData],
            },
            {
              label: `BETTA`,
              value: `betta`,
              roles: [Role.AnalyseData, Role.UseData],
            },
            {
              label: `GAMMA`,
              value: `gamma`,
              roles: [Role.AnalyseData],
            },
            {
              label: `CODE MONKEYS`,
              value: `code_monkeys`,
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
