// DODO was here
import { OptionName } from 'echarts/types/src/util/types';
import {
  AnnotationLayer,
  AxisType,
  ContributionType,
  QueryFormColumn,
  QueryFormData,
  QueryFormMetric,
  TimeFormatter,
  TimeGranularity,
} from '@superset-ui/core';
import {
  BaseChartProps,
  BaseTransformedProps,
  ContextMenuTransformedProps,
  CrossFilterTransformedProps,
  EchartsColumnConfig, // DODO added 30135470
  LegendFormData,
  StackType,
  TitleFormData,
} from '../types';
import { LabelPositionDoDo } from '../DodoExtensions/types';

export enum OrientationType {
  vertical = 'vertical',
  horizontal = 'horizontal',
}

export enum EchartsTimeseriesSeriesType {
  Line = 'line',
  Scatter = 'scatter',
  Smooth = 'smooth',
  Bar = 'bar',
  Start = 'start',
  Middle = 'middle',
  End = 'end',
}

export type EchartsTimeseriesFormData = QueryFormData & {
  annotationLayers: AnnotationLayer[];
  area: boolean;
  colorScheme?: string;
  contributionMode?: ContributionType;
  forecastEnabled: boolean;
  forecastPeriods: number;
  forecastInterval: number;
  forecastSeasonalityDaily: null;
  forecastSeasonalityWeekly: null;
  forecastSeasonalityYearly: null;
  logAxis: boolean;
  markerEnabled: boolean;
  markerSize: number;
  metrics: QueryFormMetric[];
  minorSplitLine: boolean;
  opacity: number;
  orderDesc: boolean;
  rowLimit: number;
  seriesType: EchartsTimeseriesSeriesType;
  stack: StackType;
  timeCompare?: string[];
  tooltipTimeFormat?: string;
  truncateYAxis: boolean;
  yAxisFormat?: string;
  xAxisTimeFormat?: string;
  timeGrainSqla?: TimeGranularity;
  yAxisBounds: [number | undefined | null, number | undefined | null];
  zoomable: boolean;
  richTooltip: boolean;
  xAxisLabelRotation: number;
  groupby: QueryFormColumn[];
  showValue: boolean;
  onlyTotal: boolean;
  showExtraControls: boolean;
  percentageThreshold: number;
  orientation?: OrientationType;
  valueAlign?: LabelPositionDoDo; // DODO added #10688314
  columnConfig?: Record<string, EchartsColumnConfig>; // DODO added 30135470
} & LegendFormData &
  TitleFormData;

export interface EchartsTimeseriesChartProps
  extends BaseChartProps<EchartsTimeseriesFormData> {
  formData: EchartsTimeseriesFormData;
}

export type TimeseriesChartTransformedProps =
  BaseTransformedProps<EchartsTimeseriesFormData> &
    ContextMenuTransformedProps &
    CrossFilterTransformedProps & {
      legendData?: OptionName[];
      xValueFormatter: TimeFormatter | StringConstructor;
      xAxis: {
        label: string;
        type: AxisType;
      };
      onFocusedSeries: (series: string | null) => void;
    };
