// DODO was here
import { AdhocFilter, DataMask } from '@superset-ui/core';

interface NativeFilterColumnDodoExtended {
  id?: string; // DODO added 29749076
  nameRu?: string; // DODO added 30434273
}

// DODO changed 30434273
export interface NativeFilterColumn extends NativeFilterColumnDodoExtended {
  name: string;
  displayName?: string;
}

export interface NativeFilterScope {
  rootPath: string[];
  excluded: number[];
}

/** The target of a filter is the datasource/column being filtered */
export interface NativeFilterTarget {
  datasetId: number;
  column: NativeFilterColumn;

  // maybe someday support this?
  // show values from these columns in the filter options selector
  // clarityColumns?: Column[];
}

export enum NativeFilterType {
  NATIVE_FILTER = 'NATIVE_FILTER',
  DIVIDER = 'DIVIDER',
}

export enum DataMaskType {
  NativeFilters = 'nativeFilters',
  CrossFilters = 'crossFilters',
}

export type DataMaskState = { [id: string]: DataMask };

export type DataMaskWithId = { id: string } & DataMask;
export type DataMaskStateWithId = { [filterId: string]: DataMaskWithId };

type FilterSetDodoExtended = {
  isPrimary: boolean;
};

export type FilterSet = {
  id: number;
  name: string;
  nativeFilters: Filters;
  dataMask: DataMaskStateWithId;
} & FilterSetDodoExtended;

export type FilterSets = {
  [filtersSetId: string]: FilterSet;
};

type FilterDodoExtended = {
  nameRu?: string; // DODO added 30434273
  selectTopValue?: number; // DODO added 38368947
};

export type Filter = {
  cascadeParentIds: string[];
  defaultDataMask: DataMask;
  id: string; // randomly generated at filter creation
  name: string;
  scope: NativeFilterScope;
  filterType: string;
  // for now there will only ever be one target
  // when multiple targets are supported, change this to Target[]
  targets: [Partial<NativeFilterTarget>];
  controlValues: {
    [key: string]: any;
  };
  sortMetric?: string | null;
  adhoc_filters?: AdhocFilter[];
  granularity_sqla?: string;
  granularity?: string;
  time_grain_sqla?: string;
  time_range?: string;
  requiredFirst?: boolean;
  tabsInScope?: string[];
  chartsInScope?: number[];
  type: typeof NativeFilterType.NATIVE_FILTER;
  description: string;
} & FilterDodoExtended; // DODO added 30434273

export type FilterWithDataMask = Filter & { dataMask: DataMaskWithId };

export type Divider = Partial<Omit<Filter, 'id' | 'type'>> & {
  id: string;
  title: string;
  description: string;
  type: typeof NativeFilterType.DIVIDER;
};

export function isNativeFilter(
  filterElement: Filter | Divider,
): filterElement is Filter {
  return filterElement.type === NativeFilterType.NATIVE_FILTER;
}

export function isNativeFilterWithDataMask(
  filterElement: Filter | Divider,
): filterElement is FilterWithDataMask {
  return (
    isNativeFilter(filterElement) &&
    (filterElement as FilterWithDataMask).dataMask?.filterState?.value
  );
}

export function isFilterDivider(
  filterElement: Filter | Divider,
): filterElement is Divider {
  return filterElement.type === NativeFilterType.DIVIDER;
}

export type FilterConfiguration = Array<Filter | Divider>;

export type Filters = {
  [filterId: string]: Filter | Divider;
};

export type PartialFilters = {
  [filterId: string]: Partial<Filters[keyof Filters]>;
};

export type NativeFiltersState = {
  filters: Filters;
  filterSets: FilterSets | null; // DODO changed 38080573
  focusedFilterId?: string;
  hoveredFilterId?: string;
  filterSetInPending?: number;
};

export type DashboardComponentMetadata = {
  nativeFilters: NativeFiltersState;
  dataMask: DataMaskStateWithId;
};

export default {};
