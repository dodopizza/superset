import React, { FC } from 'react';
import { t } from '@superset-ui/core';
import { useSelector } from 'react-redux';
import SubMenu from '../../../../features/home/SubMenu';
import { useTeamList } from './useTeamList';
import ListView from '../../../../components/ListView';
import { columns, filters, initialSort } from './consts';
import { getTeamListPending } from '../../model/selectors/getTeamListPending';
import { getTeamListData } from '../../model/selectors/getTeamListData';

const PAGE_SIZE = 10;

const TeamListPage: FC = () => {
  const { fetchData } = useTeamList();

  const data = useSelector(getTeamListData);
  const loading = useSelector(getTeamListPending);

  return (
    <div>
      <SubMenu name={t('Teams')} buttons={[]} />
      <ListView
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

export { TeamListPage };
