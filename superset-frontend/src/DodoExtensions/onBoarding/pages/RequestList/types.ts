export type RequestListType = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  currentRoles: Array<string>;
  requestedRoles: Array<string>;
  team: string;
  requestDate: Date;
  isClosed: boolean;
};
