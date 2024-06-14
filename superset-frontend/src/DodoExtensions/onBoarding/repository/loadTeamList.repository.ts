import { Role, Team, userFromEnum } from '../types';

export const loadTeamListRepository = async (
  userFrom: userFromEnum,
  query: string,
): Promise<Array<Team>> => {
  try {
    return await new Promise(resolve =>
      setTimeout(
        () =>
          resolve([
            {
              label: `CVM (cvm)`,
              value: `cvm`,
              roles: [
                Role.AnalyseData,
                Role.UseData,
                Role.InputData,
                Role.CreateData,
              ],
            },
            {
              label: `IMF (imf)`,
              value: `imf`,
              roles: [Role.AnalyseData, Role.UseData, Role.InputData],
            },
            {
              label: `B2B`,
              value: `b2b`,
              roles: [Role.AnalyseData, Role.UseData],
            },
            {
              label: `EURASIA`,
              value: `eurasia`,
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
