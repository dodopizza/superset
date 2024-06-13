import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loadRequest } from '../../model/actions/loadRequest';

export const useRequest = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadRequest(''));
  }, []);
};
