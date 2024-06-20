import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { FetchDataConfig } from '../../../../components/ListView';
import { getUserInfo } from '../../model/selector/getUserInfo';
import { loadRequestList } from '../../model/actions/loadRequestList';

export const useRequestList = () => {
  const dispatch = useDispatch();
  const user = useSelector(getUserInfo);
  const history = useHistory();

  if (!user.roles.Admin) {
    history.push('/superset/welcome/');
  }

  const fetchData = useCallback(
    (config: FetchDataConfig) => {
      dispatch(loadRequestList(config));
    },
    [dispatch],
  );

  return {
    fetchData,
  };
};
