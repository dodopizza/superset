import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { RadioChangeEvent } from 'antd/lib/radio';
import { useDispatch } from 'react-redux';
import { t } from '@superset-ui/core';
import { Role, userFromEnum } from '../../types';
import { MIN_TEAM_NAME_LENGTH } from '../../consts';
import { getTeamName } from '../../utils/getTeamName';
import { getTeamSlug } from '../../utils/getTeamSlug';
import { finishOnBoarding } from '../../model/actions/finishOnBoarding';
import { ONBOARDING_TEAMS_CLEAR } from '../../model/types/team.types';

export const useStepTwoPopup = () => {
  const [userFrom, setUserFrom] = useState<userFromEnum>(
    userFromEnum.Franchisee,
  );
  const [newTeam, setNewTeam] = useState<string | null>(null);
  const [existingTeam, setExistingTeam] = useState<any | null>(null);

  const [roles, setRoles] = useState<Array<Role>>([]);

  const dispatch = useDispatch();

  const toggleUseFrom = useCallback(
    ({ target: { value } }: RadioChangeEvent) => {
      setUserFrom(value);
      setExistingTeam(null);
      setNewTeam(null);
      setRoles([]);
      dispatch({ type: ONBOARDING_TEAMS_CLEAR });
    },
    [],
  );

  const noTeam = useMemo(
    () => !existingTeam && (newTeam ?? '').trim().length < MIN_TEAM_NAME_LENGTH,
    [existingTeam, newTeam],
  );

  useEffect(() => {
    if (noTeam) {
      setRoles([]);
    }
  }, [noTeam]);

  const formatedTeamName = useMemo(() => {
    if (existingTeam) {
      return `${existingTeam.label}`;
    }
    if ((newTeam ?? '').trim().length >= MIN_TEAM_NAME_LENGTH) {
      const name = getTeamName(newTeam, userFrom);
      return `${name}`;
    }
    return 'no team';
  }, [existingTeam, newTeam, userFrom]);

  const formatedSlug = useMemo(() => {
    if (existingTeam) {
      return existingTeam.value;
    }
    if ((newTeam ?? '').trim().length >= MIN_TEAM_NAME_LENGTH) {
      return getTeamSlug(newTeam, userFrom);
    }
    return 'no slug';
  }, [existingTeam, newTeam, userFrom]);

  const submit = useCallback(
    () =>
      dispatch(
        finishOnBoarding({
          userFrom,
          isNewTeam: !!newTeam,
          teamName: formatedTeamName,
          teamSlug: formatedSlug,
          roles,
        }),
      ),
    [dispatch, userFrom, newTeam, formatedTeamName, formatedSlug, roles],
  );

  const removeTeam = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      setNewTeam(null);
      setExistingTeam(null);
      setRoles([]);
      e.preventDefault();
      dispatch({ type: ONBOARDING_TEAMS_CLEAR });
    },
    [setExistingTeam, setNewTeam, setRoles],
  );

  const tagClosable = useMemo(
    () => !!existingTeam || !!newTeam,
    [existingTeam, newTeam],
  );

  const teamDescription = useMemo(() => {
    if (existingTeam) {
      return `[${existingTeam.label} (${existingTeam.value}] ${t(
        'is a known command, so you can enter the team automatically.',
      )}`;
    }
    if ((newTeam ?? '').trim().length >= MIN_TEAM_NAME_LENGTH) {
      const name = getTeamName(newTeam, userFrom);
      const slug = getTeamSlug(newTeam, userFrom);
      return `[${name} (${slug})] ${t(
        'is a new team, so Superset admins will have to evaluate this request.',
      )}`;
    }
    return '';
  }, [existingTeam, newTeam, userFrom]);

  return {
    userFrom,
    toggleUseFrom,
    newTeam,
    existingTeam,
    setRoles,
    setNewTeam,
    setExistingTeam,
    noTeam,
    roles,
    formatedTeamName,
    submit,
    removeTeam,
    tagClosable,
    teamDescription,
  };
};
