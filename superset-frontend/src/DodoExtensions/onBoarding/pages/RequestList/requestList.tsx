import React, { FC } from 'react';
import { t } from '@superset-ui/core';
import { useSelector } from 'react-redux';
import ListView from '../../../../components/ListView';
import { useRequestList } from './useRequestList';
import type { RequestListType } from './types';
import { columns, initialSort } from './consts';
import SubMenu from '../../../../features/home/SubMenu';
import { getRequestListData } from '../../model/selectors/getRequestListData';
import { getRequestListLoading } from '../../model/selectors/getRequestListLoading';

const PAGE_SIZE = 10;

const RequestListPage: FC = () => {
  const { fetchData, filters } = useRequestList();

  const data = useSelector(getRequestListData);
  const loading = useSelector(getRequestListLoading);

  return (
    <div>
      <SubMenu name={t('Requests')} buttons={[]} />
      <ListView<RequestListType>
        className="request-list-view"
        columns={columns}
        count={data?.count ?? 0}
        data={data?.rows ?? []}
        fetchData={fetchData}
        filters={filters}
        initialSort={initialSort}
        loading={loading}
        pageSize={PAGE_SIZE}
        defaultViewMode="table"
      />
    </div>
  );
};

export { RequestListPage };
