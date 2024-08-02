import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { message } from 'antd';
import { debounce } from 'lodash';
import { loadTeamPage } from '../../model/actions/loadTeamPage';
import { getTeamPagePending } from '../../model/selectors/getTeamPagePending';
import { getTeamPageData } from '../../model/selectors/getTeamPageData';
import { SEARCH_MEMBER_DELAY } from '../../consts';
import { loadUsers } from '../../model/actions/loadUsers';
import { getUserSearchPending } from '../../model/selectors/getUserSearchPending';
import { getUserSearchData } from '../../model/selectors/getUserSearchData';
import { ONBOARDING_USER_SEARCH_CLEAR } from '../../model/types/userSearch.types';

export const useTeamPage = () => {
  const [memberToAdd, setMemberToAdd] = useState<{
    value: string;
    label: string;
  } | null>(null);

  const dispatch = useDispatch();
  const isLoading = useSelector(getTeamPagePending);
  const data = useSelector(getTeamPageData);
  const membersIsLoading = useSelector(getUserSearchPending);

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
          dispatch(loadUsers(value));
        }
      }, SEARCH_MEMBER_DELAY),
    [dispatch],
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
    return () => {
      dispatch({ type: ONBOARDING_USER_SEARCH_CLEAR });
    };
  }, [dispatch, id]);

  const memberList = useSelector(getUserSearchData);

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
