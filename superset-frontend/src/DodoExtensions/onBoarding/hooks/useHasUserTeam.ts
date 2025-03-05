import { useState, useEffect } from 'react';
import { SupersetClient, t } from '@superset-ui/core';
import { useToasts } from 'src/components/MessageToasts/withToasts';

export const useHasUserTeam = (
  id: number | undefined,
  enabled: boolean,
): boolean => {
  const [hasTeam, setHasTeam] = useState(true);
  const toast = useToasts();

  useEffect(() => {
    if (enabled && id) {
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
          toast.addDangerToast(
            t(`An error occurred while checking user's team`),
          );
        });
    }
  }, [id, toast, enabled]);

  return hasTeam;
};
