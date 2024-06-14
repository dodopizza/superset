import { userFromEnum } from '../../types';

export type RequestFormDto = {
  userFrom: userFromEnum;
  firstName: string;
  lastName: string;
  email: string;
  dodoRole: string;
  currentRoles: string;
  requestedRoles: string;
  team: string;
  requestDate: Date;
  isClosed: boolean;
  updateDate: Date;
};
