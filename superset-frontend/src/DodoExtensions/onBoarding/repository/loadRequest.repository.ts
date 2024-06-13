import { ActionRequestSuccessPayload } from '../model/types/request.types';

export const repoLoadRequest = async (
  id: string,
): Promise<ActionRequestSuccessPayload | null> => {
  try {
    return await new Promise(resolve =>
      setTimeout(
        () =>
          resolve({
            firstName: 'first name',
            lastName: 'last name',
            email: 'email',
            team: 'team name',
            requestDate: new Date(),
            updateDate: new Date(),
            requestedRoles: [],
            currentRoles: [],
            isClosed: false,
            dodoRole: 'dodo role',
          }),
        2000,
      ),
    );
  } catch (e) {
    console.log(`repoLoadTeamList catch error`, e);
    return null;
  }
};
