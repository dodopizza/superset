import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { loadRequest } from '../../model/actions/loadRequest';
import { getRequestLoading } from '../../model/selector/getRequestLoading';
import { getRequestData } from '../../model/selector/getRequestData';

export const useRequest = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const isLoading = useSelector(getRequestLoading);
  const requestData = useSelector(getRequestData);

  useEffect(() => {
    dispatch(loadRequest(id));
  }, [dispatch, id]);

  return { isLoading, requestData: requestData ?? undefined };
};
