import { useCallback, useState } from 'react';
import { RequestListType } from './types';
import { FetchDataConfig } from '../../../../components/ListView';

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

      const charts: Array<RequestListType> = [];

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
          isClosed: true,
        });
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
