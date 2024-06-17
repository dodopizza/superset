import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { loadRequest } from '../../model/actions/loadRequest';
import { getRequestLoading } from '../../model/selector/getRequestLoading';
import { getRequestData } from '../../model/selector/getRequestData';
import { MIN_TEAM_NAME_LENGTH } from '../../consts';
import { getTeamName } from '../../utils/getTeamName';
import { CreateTeamModalDto } from './components/CreateTeamModal';
import { getTeamTag } from '../../utils/getTeamTag';

export const useRequest = () => {
  const [newTeam, setNewTeam] = useState<string | null>(null);
  const [existingTeam, setExistingTeam] = useState<any | null>(null);

  const [isCreateTeam, setIsCreateTeam] = useState<boolean>(false);
  const [isConfirmCreateTeam, setIsConfirmCreateTeam] =
    useState<boolean>(false);

  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const isLoading = useSelector(getRequestLoading);
  const requestData = useSelector(getRequestData);

  useEffect(() => {
    dispatch(loadRequest(id));
  }, [dispatch, id]);

  const showCreateTeam = useCallback(() => setIsCreateTeam(true), []);
  const closeCreateTeam = useCallback(() => setIsCreateTeam(false), []);

  const tagClosable = useMemo(
    () => !!existingTeam || !!newTeam,
    [existingTeam, newTeam],
  );

  const removeTeam = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      setNewTeam(null);
      setExistingTeam(null);
      e.preventDefault();
    },
    [setExistingTeam, setNewTeam],
  );

  const newTeamOK = useMemo(
    () => newTeam && newTeam?.length >= MIN_TEAM_NAME_LENGTH,
    [newTeam],
  );

  const teamOK = useMemo(
    () => (newTeam && newTeam?.length >= MIN_TEAM_NAME_LENGTH) || existingTeam,
    [existingTeam, newTeam],
  );

  const formatedTeamName = useMemo(() => {
    if (existingTeam) {
      return `${existingTeam.label}`;
    }
    if ((newTeam ?? '').trim().length >= MIN_TEAM_NAME_LENGTH) {
      const name = getTeamName(newTeam, requestData?.userFrom);
      return `${name}`;
    }
    return 'no team';
  }, [existingTeam, newTeam, requestData?.userFrom]);

  const createTeamData: CreateTeamModalDto = useMemo(
    () => ({
      userFrom: requestData?.userFrom,
      name: newTeam,
      teamName: getTeamName(newTeam, requestData?.userFrom),
      teamTag: getTeamTag(newTeam, requestData?.userFrom),
      roles: [],
    }),
    [newTeam, requestData?.userFrom],
  );

  const openConfirmCreateTeam = useCallback((data: CreateTeamModalDto) => {
    setIsCreateTeam(false);
    setIsConfirmCreateTeam(true);
  }, []);

  const createTeam = useCallback(() => {
    setIsConfirmCreateTeam(false);
  }, []);

  const closeConfirmCreateTeam = useCallback(
    () => setIsConfirmCreateTeam(false),
    [],
  );

  return {
    isLoading,
    requestData: requestData ?? undefined,
    newTeam,
    setNewTeam,
    existingTeam,
    setExistingTeam,
    isCreateTeam,
    showCreateTeam,
    closeCreateTeam,
    tagClosable,
    removeTeam,
    newTeamOK,
    teamOK,
    formatedTeamName,
    createTeamData,
    openConfirmCreateTeam,
    isConfirmCreateTeam,
    createTeam,
    closeConfirmCreateTeam,
  };
};
