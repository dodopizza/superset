import { Role, userFromEnum } from '../../types';

export type StepTwoPopupDto = {
  userFrom: userFromEnum;
  isNewTeam: boolean;
  teamName: string;
  teamSlug: string;
  roles: Array<Role>;
};
