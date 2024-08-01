import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { message } from 'antd';
import { loadTeamPage } from '../../model/actions/loadTeamPage';
import { getTeamPagePending } from '../../model/selectors/getTeamPagePending';
import { getTeamPageData } from '../../model/selectors/getTeamPageData';

export const useTeamPage = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector(getTeamPagePending);
  const data = useSelector(getTeamPageData);

  const { id } = useParams<{ id: string }>();

  const removeFromTeam = useCallback((id: number) => {
    message.success(`prosseed removing${id}`);
  }, []);

  useEffect(() => {
    dispatch(loadTeamPage(id));
  }, [dispatch, id]);

  return { isLoading, data, removeFromTeam };
};
