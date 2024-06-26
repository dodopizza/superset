import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { loadTeamPage } from '../../model/actions/loadTeamPage';
import { getTeamPagePending } from '../../model/selectors/getTeamPagePending';
import { getTeamPageData } from '../../model/selectors/getTeamPageData';

export const useTeamPage = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector(getTeamPagePending);
  const data = useSelector(getTeamPageData);

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    dispatch(loadTeamPage(id));
  }, [id]);

  return { isLoading, data };
};
