import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { t } from '@superset-ui/core';
import { loadRequest } from '../../model/actions/loadRequest';
import { getRequestLoading } from '../../model/selector/getRequestLoading';
import { getRequestData } from '../../model/selector/getRequestData';
import { MIN_TEAM_NAME_LENGTH } from '../../consts';
import { getTeamName } from '../../utils/getTeamName';
import { CreateTeamModalDto } from './components/CreateTeamModal';
import { ConfirmCreateTeamModalDto } from './components/ConfirmCreateTeamModal';
import { UpdateUserDto } from './components/UpdateUser';
import { getTeamSlug } from '../../utils/getTeamSlug';
import {
  ONBOARDING_CREATE_TEAM_ERROR_CLEAR,
  ONBOARDING_TEAMS_CLEAR,
} from '../../model/types/team.types';
import { createTeam } from '../../model/actions/createTeam';
import { UserFromEnum } from '../../types';
import { getCreateTeamData } from '../../model/selector/getCreateTeamData';
import { useToasts } from '../../../../components/MessageToasts/withToasts';
import { getCreateTeamError } from '../../model/selector/getCreateTeamError';
import { closeRequest } from '../../model/actions/closeRequest';

export const useRequest = () => {
  const [newTeam, setNewTeam] = useState<string | null>(null);
  const [existingTeam, setExistingTeam] = useState<any | null>(null);

  const [isCreateTeam, setIsCreateTeam] = useState<boolean>(false);
  const [isConfirmCreateTeam, setIsConfirmCreateTeam] =
    useState<boolean>(false);
  const [isUpdateUser, setIsUpdateUser] = useState<boolean>(false);

  const [confirmCreateTeamData, setConfirmCreateTeamData] =
    useState<ConfirmCreateTeamModalDto | null>(null);
  const [updateUserData, setUpdateUserData] = useState<UpdateUserDto | null>(
    null,
  );

  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const isLoading = useSelector(getRequestLoading);
  const requestData = useSelector(getRequestData);

  const createdTeamData = useSelector(getCreateTeamData);
  const createdTeamError = useSelector(getCreateTeamError);

  const toast = useToasts();

  useEffect(() => {
    dispatch({ type: ONBOARDING_TEAMS_CLEAR });
    dispatch(loadRequest(id));
  }, [dispatch, id]);

  useEffect(() => {
    // Команда создана успешно
    if (createdTeamData) {
      toast.addSuccessToast(t('Team has been created successfully.'));

      setExistingTeam({
        value: createdTeamData.slug,
        label: createdTeamData.name,
        roles: createdTeamData.roles,
      });
      setNewTeam(null);

      setIsConfirmCreateTeam(false);

      setUpdateUserData({
        userName: `${requestData?.firstName} ${requestData?.lastName} (${requestData?.email})`,
        teamName: createdTeamData.name,
        teamSlug: createdTeamData.slug,
        currentRoles: requestData?.currentRoles,
        requestedRoles: createdTeamData.roles,
        dodoRole: requestData?.dodoRole,
      });

      setIsUpdateUser(true);
    }
  }, [createdTeamData]);

  useEffect(() => {
    // Ошибка при создании команды
    if (createdTeamError) {
      toast.addDangerToast(t('An error occurred while creating the team'));
    }
  }, [createdTeamError]);

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
      userFrom: requestData?.userFrom ?? UserFromEnum.Unknown,
      name: newTeam,
      teamName: getTeamName(newTeam, requestData?.userFrom),
      teamSlug: getTeamSlug(newTeam, requestData?.userFrom),
      roles: [],
    }),
    [newTeam, requestData?.userFrom],
  );

  const openConfirmCreateTeam = useCallback((data: CreateTeamModalDto) => {
    setIsCreateTeam(false);
    dispatch({ type: ONBOARDING_CREATE_TEAM_ERROR_CLEAR });
    setConfirmCreateTeamData({
      teamName: data.teamName,
      teamSlug: data.teamSlug,
      roles: data.roles,
      userFrom: data.userFrom,
    });
    setIsConfirmCreateTeam(true);
  }, []);

  const createTeamInHook = useCallback(
    (value: ConfirmCreateTeamModalDto) => {
      dispatch(
        createTeam({
          name: value.teamName,
          roles: value.roles,
          slug: value.teamSlug,
          userFrom: value.userFrom,
        }),
      );
    },
    [confirmCreateTeamData, requestData],
  );

  const closeConfirmCreateTeam = useCallback(
    () => setIsConfirmCreateTeam(false),
    [],
  );

  const showUpdateUser = useCallback(() => {
    setUpdateUserData({
      userName: `${requestData?.firstName} ${requestData?.lastName} (${requestData?.email})`,
      teamName: existingTeam.label,
      teamSlug: existingTeam.value,
      currentRoles: requestData?.currentRoles,
      requestedRoles: existingTeam.roles,
      dodoRole: requestData?.dodoRole,
    });
    setIsUpdateUser(true);
  }, [requestData, existingTeam]);

  const closeUpdateUser = useCallback(() => setIsUpdateUser(false), []);

  const updateUser = useCallback(() => {
    if (updateUserData?.teamSlug && updateUserData.requestedRoles) {
      dispatch(
        closeRequest({
          slug: updateUserData.teamSlug,
          roles: updateUserData.requestedRoles,
        }),
      );
    }
    setIsUpdateUser(false);
  }, [updateUserData]);

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
    createTeamInHook,
    closeConfirmCreateTeam,
    confirmCreateTeamData,
    showUpdateUser,
    isUpdateUser,
    closeUpdateUser,
    updateUserData,
    updateUser,
    createdTeamError,
  };
};
