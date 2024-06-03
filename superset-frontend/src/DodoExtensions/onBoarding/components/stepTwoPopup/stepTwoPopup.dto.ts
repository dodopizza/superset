import { Role, userFromEnum } from '../../types';

export type StepTwoPopupDto = {
  userFrom: userFromEnum;
  isNewTeam: boolean;
  teamName: string;
  teamTag: string;
  roles: Array<Role>;
};
