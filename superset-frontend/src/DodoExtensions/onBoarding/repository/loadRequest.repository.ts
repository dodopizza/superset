import { ActionRequestSuccessPayload } from '../model/types/request.types';
import { userFromEnum } from '../types';

export const loadRequestRepository = async (
  id: string,
): Promise<ActionRequestSuccessPayload | null> => {
  try {
    return await new Promise(resolve =>
      setTimeout(
        () =>
          resolve({
            userFrom: userFromEnum.Franchisee,
            firstName: 'Артем',
            lastName: 'Казаков',
            email: 'art.kazakov@dodobrands.io',
            dodoRole: 'Data Platform',
            currentRoles: 'Gamma, Public dashboards',
            requestedRoles: 'Analyse Data, Input Data',
            team: 'CVM | cvm',
            requestDate: new Date(),
            isClosed: false,
            updateDate: new Date(),
          }),
        2000,
      ),
    );
  } catch (e) {
    console.log(`repoLoadTeamList catch error`, e);
    return null;
  }
};
