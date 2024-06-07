import React, { FC, useCallback } from 'react';
import { FeatureFlag, isFeatureEnabled } from '@superset-ui/core';
import ListView, {
  CardSortSelectOption,
  FetchDataConfig,
  Filters,
  SortColumn,
} from '../../../../components/ListView';
import Chart from '../../../../types/Chart';
import ChartCard from '../../../../features/charts/ChartCard';
import { dangerouslyGetItemDoNotUse } from '../../../../utils/localStorageHelpers';
import { FavoriteStatus } from '../../../../views/CRUD/types';
import { useRequestList } from './useRequestList';
import type { RequestListType } from './types';
import { columns } from './consts';

const PAGE_SIZE = 25;

// const bulkActions: ListViewProps['bulkActions'] = [];
const bulkSelectEnabled = false;

type Props = {
  addDangerToast: (msg: string) => void;
  addSuccessToast: (msg: string) => void;
  user: {
    userId: string | number;
    // firstName: string;
    // lastName: string;
  };
};

const RequestList: FC<Props> = ({
  user: { userId },
  addDangerToast,
  addSuccessToast,
}) => {
  const { loading, count, collection } = useRequestList();

  const sortTypes: CardSortSelectOption[] | undefined = [] ?? [
    {
      id: 'createdDate',
      desc: true,
      label: 'label',
      value: 'recently_modified',
    },
    {
      id: 'createdDate',
      desc: false,
      label: 'label',
      value: 'least_recently_modified',
    },
  ];

  const fetchData: ({
    pageIndex,
    pageSize,
    sortBy,
    filters: filterValues,
  }: FetchDataConfig) => Promise<void> = async () => {
    console.log(`fetchData`);
  };

  const filters: Filters = [];
  const initialSort: SortColumn[] = [];

  const userSettings = dangerouslyGetItemDoNotUse(userId?.toString(), null) as {
    thumbnails: boolean;
  };

  const hasPerm = (perm: string) => true;

  const openChartEditModal: (chart: Chart) => void = () => {};
  const refreshData: () => void = () => {};
  const favoriteStatus: FavoriteStatus = { 1: true };

  const saveFavoriteStatus: (id: number, isStarred: boolean) => void = () => {};
  const handleBulkChartExport = () => {};

  const renderCard = useCallback(
    (chart: Chart) => (
      <ChartCard
        chart={chart}
        showThumbnails={
          userSettings
            ? userSettings.thumbnails
            : isFeatureEnabled(FeatureFlag.THUMBNAILS)
        }
        hasPerm={hasPerm}
        openChartEditModal={openChartEditModal}
        bulkSelectEnabled={bulkSelectEnabled}
        addDangerToast={addDangerToast}
        addSuccessToast={addSuccessToast}
        refreshData={refreshData}
        userId={userId}
        loading={loading}
        favoriteStatus={favoriteStatus[chart.id]}
        saveFavoriteStatus={saveFavoriteStatus}
        handleBulkChartExport={handleBulkChartExport}
      />
    ),
    [
      addDangerToast,
      addSuccessToast,
      bulkSelectEnabled,
      favoriteStatus,
      hasPerm,
      loading,
    ],
  );

  return (
    <div>
      <ListView<RequestListType>
        cardSortSelectOptions={sortTypes} // не сортирует
        // className="chart-list-view"
        columns={columns} // +
        count={count} // +
        data={collection} // +
        fetchData={fetchData}
        filters={filters}
        initialSort={initialSort}
        loading={loading}
        pageSize={PAGE_SIZE}
        renderCard={renderCard}
        showThumbnails={
          userSettings
            ? userSettings.thumbnails
            : isFeatureEnabled(FeatureFlag.THUMBNAILS)
        }
        defaultViewMode={
          isFeatureEnabled(FeatureFlag.LISTVIEWS_DEFAULT_CARD_VIEW)
            ? 'card'
            : 'table'
        }
      />
    </div>
  );
};

export { RequestList };
