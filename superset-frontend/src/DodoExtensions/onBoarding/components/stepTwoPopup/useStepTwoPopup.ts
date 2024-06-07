import { useCallback, useEffect, useMemo, useState } from 'react';
import { RadioChangeEvent } from 'antd/lib/radio';
import { useDispatch } from 'react-redux';
import { Role, userFromEnum } from '../../types';
import { MIN_TEAM_NAME_LENGTH } from '../../consts';
import { getTeamName } from '../../utils/getTeamName';
import { getTeamTag } from '../../utils/getTeamTag';
import { finishOnBoarding } from '../../model/actions/finishOnBoarding';

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
      const name = getTeamName(userFrom, newTeam);
      return `${name}`;
    }
    return 'no team';
  }, [existingTeam, newTeam, userFrom]);

  const formatedTag = useMemo(() => {
    if (existingTeam) {
      return existingTeam.value;
    }
    if ((newTeam ?? '').trim().length >= MIN_TEAM_NAME_LENGTH) {
      return getTeamTag(userFrom, newTeam);
    }
    return 'no tag';
  }, [existingTeam, newTeam, userFrom]);

  const submit = useCallback(
    () =>
      dispatch(
        finishOnBoarding({
          userFrom,
          isNewTeam: !!newTeam,
          teamName: formatedTeamName,
          teamTag: formatedTag,
          roles,
        }),
      ),
    [userFrom, newTeam, formatedTeamName, formatedTag, roles],
  );

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
  };
};
