import React, { FC } from 'react';
import { t } from '@superset-ui/core';
import { useSelector } from 'react-redux';
import ListView from '../../../../components/ListView';
import { useRequestList } from './useRequestList';
import type { RequestListType } from './types';
import { columns, filters, initialSort } from './consts';
import SubMenu from '../../../../features/home/SubMenu';
import { getRequestListData } from '../../model/selector/getRequestListData';
import { getRequestListLoading } from '../../model/selector/getRequestListLoading';

const PAGE_SIZE = 10;

const RequestList: FC = () => {
  const { fetchData } = useRequestList();

  const data = useSelector(getRequestListData);
  const loading = useSelector(getRequestListLoading);

  return (
    <div>
      <SubMenu name={t('Заявки')} buttons={[]} />
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

export { RequestList };
