import { SupersetClient } from '@superset-ui/core';
import { Role } from '../types';

type Params = {
  slug: string;
  roles: Array<Role>;
};

export const putStatementRepository: (params: Params) => Promise<void> =
  async params => {
    const response = await SupersetClient.put({
      url: '/api/v1/onboarding/',
      body: JSON.stringify({
        team_slug: params.slug,
        is_approved: true,
        requested_roles: params.roles,
        last_changed_datetime: new Date(),
      }),
      headers: { 'Content-Type': 'application/json' },
      parseMethod: null,
    });

    await response.json();
  };
