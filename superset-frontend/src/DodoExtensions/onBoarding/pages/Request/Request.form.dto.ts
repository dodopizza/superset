export type RequestFormDto = {
  firstName: string;
  lastName: string;
  email: string;
  dodoRole: string;
  currentRoles: Array<string>;
  requestedRoles: Array<string>;
  team: string;
  requestDate: Date;
  isClosed: boolean;
  updateDate: Date;
};
