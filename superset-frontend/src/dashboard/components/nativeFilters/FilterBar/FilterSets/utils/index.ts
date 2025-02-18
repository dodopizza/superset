// DODO was here

import shortid from 'shortid';
import { DataMaskState, FilterSet, t } from '@superset-ui/core';
import { areObjectsEqual } from 'src/reduxUtils';

export const generateFiltersSetId = () => `FILTERS_SET-${shortid.generate()}`;

export const APPLY_FILTERS_HINT = t('Please apply filter changes');

export const getFilterValueForDisplay = (
  value?: string[] | null | string | number | Record<string, any>,
  column?: string, // DODO added 30434273
): string => {
  if (value === null || value === undefined) {
    return '';
  }
  if (typeof value === 'string' || typeof value === 'number') {
    return `${value}`;
  }
  if (Array.isArray(value)) {
    // DODO added start 30434273
    if (typeof value[0] === 'object' && column && column in value[0]) {
      return value.map(val => val[column]).join(', ');
    }
    // DODO added stop 30434273
    return value.join(', ');
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return t('Unknown value');
};

export const findExistingFilterSet = ({
  filterSetFilterValues,
  dataMaskSelected,
}: {
  filterSetFilterValues: FilterSet[];
  dataMaskSelected: DataMaskState;
}) =>
  filterSetFilterValues.find(({ dataMask: dataMaskFromFilterSet = {} }) => {
    const dataMaskSelectedEntries = Object.entries(dataMaskSelected);
    return dataMaskSelectedEntries.every(([id, filterFromSelectedFilters]) => {
      const isEqual = areObjectsEqual(
        filterFromSelectedFilters.filterState,
        dataMaskFromFilterSet?.[id]?.filterState,
        {
          ignoreUndefined: true,
          ignoreNull: true,
          ignoreFields: ['validateStatus'], // DODO added 30434273
        },
      );
      const hasSamePropsNumber =
        dataMaskSelectedEntries.length ===
        Object.keys(dataMaskFromFilterSet ?? {}).length;
      return isEqual && hasSamePropsNumber;
    });
  });

// DODO added 30434273
export const hasFilterTranslations = (filterType: string): boolean =>
  filterType === 'filter_select_with_translation' ||
  filterType === 'filter_select_by_id_with_translation';
