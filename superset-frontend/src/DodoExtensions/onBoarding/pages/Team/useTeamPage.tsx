import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { loadTeamPage } from '../../model/actions/loadTeamPage';

export const useTeamPage = () => {
  const dispatch = useDispatch();

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    dispatch(loadTeamPage(id));
  }, [id]);
};
