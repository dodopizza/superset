import React, { FC } from 'react';
import { t } from '@superset-ui/core';
import ListView from '../../../../components/ListView';
import { useRequestList } from './useRequestList';
import type { RequestListType } from './types';
import { columns, filters, initialSort } from './consts';
import SubMenu from '../../../../features/home/SubMenu';

const PAGE_SIZE = 10;

const RequestList: FC = () => {
  const { loading, count, collection, fetchData } = useRequestList();

  return (
    <div>
      <SubMenu name={t('Заявки')} buttons={[]} />
      <ListView<RequestListType>
        className="chart-list-view"
        columns={columns}
        count={count}
        data={collection}
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
