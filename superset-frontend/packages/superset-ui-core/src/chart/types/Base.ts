// DODO was here

import { BinaryQueryObjectFilterClause, ExtraFormData } from '../../query';
import { JsonObject, t } from '../..';

export type HandlerFunction = (...args: unknown[]) => void;

export enum Behavior {
  InteractiveChart = 'INTERACTIVE_CHART',
  NativeFilter = 'NATIVE_FILTER',

  /**
   * Include `DRILL_TO_DETAIL` behavior if plugin handles `contextmenu` event
   * when dimensions are right-clicked on.
   */
  DrillToDetail = 'DRILL_TO_DETAIL',
  DrillBy = 'DRILL_BY',
}

export interface ContextMenuFilters {
  crossFilter?: {
    dataMask: DataMask;
    isCurrentValueSelected?: boolean;
  };
  drillToDetail?: BinaryQueryObjectFilterClause[];
  drillBy?: {
    filters: BinaryQueryObjectFilterClause[];
    groupbyFieldName: string;
    adhocFilterFieldName?: string;
  };
}

export enum AppSection {
  Explore = 'EXPLORE',
  Dashboard = 'DASHBOARD',
  FilterBar = 'FILTER_BAR',
  FilterConfigModal = 'FILTER_CONFIG_MODAL',
  Embedded = 'EMBEDDED',
}

export type FilterState = { value?: any; [key: string]: any };

export type DataMask = {
  extraFormData?: ExtraFormData;
  filterState?: FilterState;
  ownState?: JsonObject;
};

export type SetDataMaskHook = {
  ({ filterState, extraFormData, ownState }: DataMask): void;
};

export interface PlainObject {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export enum ChartLabel {
  Deprecated = 'DEPRECATED',
  Featured = 'FEATURED',
}

export const chartLabelExplanations: Record<ChartLabel, string> = {
  // DODO changed 44612143
  [ChartLabel.Deprecated]: t(
    'This chart uses features or modules which are no longer actively maintained. It will eventually be replaced or removed.',
  ),
  // DODO changed 44612143
  [ChartLabel.Featured]: t(
    'This chart was tested and verified, so the overall experience should be stable.',
  ),
};

export const chartLabelWeight: Record<ChartLabel, { weight: number }> = {
  [ChartLabel.Deprecated]: {
    weight: -0.1,
  },
  [ChartLabel.Featured]: {
    weight: 0.1,
  },
};

export enum AxisType {
  Category = 'category',
  Value = 'value',
  Time = 'time',
  Log = 'log',
}

export interface LegendState {
  [key: string]: boolean;
}

export default {};
