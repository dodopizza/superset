import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { message } from 'antd';
import { debounce } from 'lodash';
import { loadTeamPage } from '../../model/actions/loadTeamPage';
import { getTeamPagePending } from '../../model/selectors/getTeamPagePending';
import { getTeamPageData } from '../../model/selectors/getTeamPageData';
import { SEARCH_MEMBER_DELAY } from '../../consts';

export const useTeamPage = () => {
  const [memberToAdd, setMemberToAdd] = useState<{
    value: string;
    label: string;
  } | null>(null);

  const dispatch = useDispatch();
  const isLoading = useSelector(getTeamPagePending);
  const data = useSelector(getTeamPageData);
  const membersIsLoading = false;

  const { id } = useParams<{ id: string }>();

  const removeFromTeam = useCallback(
    (memberId: number) => {
      message.success(`proceed removing: ${memberId}`);
      // dispatch remove
      dispatch(loadTeamPage(id));
    },
    [dispatch, id],
  );

  const addToTeam = useCallback(() => {
    message.success(`add to team: ${memberToAdd?.label}`);
    // dispatch add
    setMemberToAdd(null);
    dispatch(loadTeamPage(id));
  }, [dispatch, id, memberToAdd?.label]);

  const debouncedLoadMemberList = useMemo(
    () =>
      debounce((value: string) => {
        if (value.length >= 3) {
          // dispatch(loadTeams(userFrom, value));
          message.success(`loading member list by: ${value}`);
        }
      }, SEARCH_MEMBER_DELAY),
    [],
  );

  const handleMemberSelect: (value: string, option: any) => void = useCallback(
    (value, option) => {
      if (!!option.value && !!option.label) {
        setMemberToAdd(option);
      }
    },
    [],
  );

  const handleOnChangeMember = useCallback((value, option) => {
    if (!option.value || !option.label) {
      setMemberToAdd(null);
    }
  }, []);

  useEffect(() => {
    dispatch(loadTeamPage(id));
  }, [dispatch, id]);

  const memberList = useMemo(
    () => [
      {
        label: 'label',
        value: 'value',
      },
      {
        label: 'label - 2',
        value: 'value2',
      },
      {
        label: 'long long long long long',
        value: 'value3',
      },
    ],
    [],
  );

  return {
    isLoading,
    data,
    removeFromTeam,
    debouncedLoadMemberList,
    memberList,
    membersIsLoading,
    handleMemberSelect,
    memberToAdd,
    handleOnChangeMember,
    addToTeam,
  };
};
