import { useState, useEffect } from 'react';
import { SupersetClient, t } from '@superset-ui/core';
import { useToasts } from 'src/components/MessageToasts/withToasts';

export const useHasUserTeam = (id: string): boolean => {
  const [hasTeam, setHasTeam] = useState(true);
  const toast = useToasts();

  useEffect(() => {
    SupersetClient.get({
      url: '/api/v1/me/team',
      headers: { 'Content-Type': 'application/json' },
      parseMethod: null,
    })
      .then(response => response.json())
      .then(dto => {
        setHasTeam(Boolean(dto.result.team));
      })
      .catch(() => {
        toast.addDangerToast(t(`An error occurred while checking user's team`));
      });
  }, [id, toast]);

  return hasTeam;
};