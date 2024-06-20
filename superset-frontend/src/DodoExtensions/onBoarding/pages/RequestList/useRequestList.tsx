import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { RequestListType } from './types';
import { FetchDataConfig } from '../../../../components/ListView';
import { getUserInfo } from '../../model/selector/getUserInfo';
import { loadRequestList } from '../../model/actions/loadRequestList';

const currentNumber = Number(new Date());

type State = {
  loading: boolean;
  collection: RequestListType[];
  count: number;
};

export const useRequestList = () => {
  const dispatch = useDispatch();
  const user = useSelector(getUserInfo);
  const history = useHistory();

  if (!user.roles.Admin) {
    history.push('/superset/welcome/');
  }

  const fetchData = useCallback((config: FetchDataConfig) => {
    dispatch(loadRequestList(config));
  }, []);

  return {
    fetchData,
  };
};
