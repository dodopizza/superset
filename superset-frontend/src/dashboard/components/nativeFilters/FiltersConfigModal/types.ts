// DODO was here
import {
  AdhocFilter,
  DataMask,
  NativeFilterScope,
  NativeFilterType,
} from '@superset-ui/core';

interface NativeFiltersFormItemDodoExtended {
  columnId?: string; // DODO added 29749076
  nameRu?: string; // DODO added 30434273
  columnRu: string; // DODO added 30434273
}

export interface NativeFiltersFormItem
  extends NativeFiltersFormItemDodoExtended {
  scope: NativeFilterScope;
  name: string;
  filterType: string;
  dataset: {
    value: number;
    label: string;
  };
  column: string;
  columnId?: string; // DODO added 29749076
  selectTopValue?: string; // DODO added 38368947
  controlValues: {
    [key: string]: any;
  };
  requiredFirst: {
    [key: string]: boolean;
  };
  defaultValue: any;
  defaultDataMask: DataMask;
  dependencies?: string[];
  sortMetric: string | null;
  adhoc_filters?: AdhocFilter[];
  time_range?: string;
  granularity_sqla?: string;
  type: typeof NativeFilterType.NATIVE_FILTER;
  description: string;
}

export interface NativeFilterDivider {
  id: string;
  type: typeof NativeFilterType.DIVIDER;
  title: string;
  description: string;
}

export interface NativeFiltersForm {
  filters: Record<string, NativeFiltersFormItem | NativeFilterDivider>;
  changed?: boolean;
}

export type FilterRemoval =
  | null
  | {
      isPending: true; // the filter sticks around for a moment before removal is finalized
      timerId: number; // id of the timer that finally removes the filter
    }
  | { isPending: false };
