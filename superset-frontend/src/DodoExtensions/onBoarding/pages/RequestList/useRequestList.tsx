import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { RequestListType } from './types';
import {
  FetchDataConfig,
  FilterOperator,
} from '../../../../components/ListView';
import { getUserInfo } from '../../model/selector/getUserInfo';

const currentNumber = Number(new Date());

// const charts: Array<RequestListType> = [];
//
// for (let i = 1; i <= 50; i += 1) {
//   charts.push({
//     id: i,
//     firstName: `firstName ${i}`,
//     lastName: `last Name ${i}`,
//     email: `email@example.com ${i}`,
//     currentRoles: ['Admin'],
//     requestedRoles: [],
//     team: `team-${i}`,
//     requestDate: new Date(currentNumber - i * 60 * 60 * 1000),
//     isClosed: true,
//   });
// }

type State = {
  loading: boolean;
  collection: RequestListType[];
  count: number;
};

export const useRequestList = () => {
  const [state, setState] = useState<State>({
    count: 0,
    collection: [],
    loading: false,
  });

  const user = useSelector(getUserInfo);
  const history = useHistory();

  if (!user.roles.Admin) {
    history.push('/superset/welcome/');
  }

  function updateState(update: Partial<State>) {
    setState(currentState => ({ ...currentState, ...update }));
  }

  const fetchData = useCallback(
    ({
      pageIndex,
      pageSize,
      sortBy,
      filters: filterValues,
    }: FetchDataConfig) => {
      updateState({
        loading: true,
      });

      let charts: Array<RequestListType> = [];

      const start = pageIndex * pageSize;
      for (let i = start; i < start + pageSize; i += 1) {
        charts.push({
          id: i,
          firstName: `firstName ${i}`,
          lastName: `last Name ${i}`,
          email: `email@example.com ${i}`,
          currentRoles: ['Admin'],
          requestedRoles: [],
          team: `team-${i}`,
          requestDate: new Date(currentNumber - i * 60 * 60 * 1000),
          isClosed: i % 2 === 0,
        });
      }

      const sort = sortBy.at(0);
      if (sort) {
        charts = charts.sort((a, b) => {
          const v1 = a[sort.id];
          const v2 = b[sort.id];
          if (sort.desc) {
            return v1 >= v2 ? 1 : -1;
          }
          return v2 > v1 ? 1 : -1;
        });
      }

      const filterExps = filterValues.map(({ id, operator: opr, value }) => ({
        col: id,
        opr,
        value:
          value && typeof value === 'object' && 'value' in value
            ? value.value
            : value,
      }));

      if (filterExps.length > 0) {
        charts = charts.filter(row =>
          filterExps.every(flt => {
            const rowValue = row[flt.col];
            switch (flt.opr) {
              case FilterOperator.chartAllText: {
                // @ts-ignore
                return `${rowValue}`.includes(flt.value);
              }
              case FilterOperator.requestIsClosed: {
                return rowValue === flt.value;
              }
              default: {
                return false;
              }
            }
          }),
        );
      }

      updateState({
        collection: charts,
        count: 100,
        loading: false,
      });
    },
    [],
  );

  return {
    loading: state.loading,
    count: state.count,
    collection: [...state.collection],
    fetchData,
  };
};
