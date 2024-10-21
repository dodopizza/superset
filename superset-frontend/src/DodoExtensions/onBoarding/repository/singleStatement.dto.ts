export type SingleStatementDto = {
  result: {
    created_datetime: string;
    dodo_role: string;
    finished: boolean;
    id: number;
    isExternal: boolean;
    isNewTeam: boolean;
    last_changed_datetime: string;
    request_roles: Array<string>;
    team: string;
    team_slug: string;
    user: Array<{
      email: string;
      first_name: string;
      id: number;
      last_name: string;
      roles: Array<{
        id: 1;
        name: 'Admin';
      }>;
      username: 'admin';
    }>;
  };
};
