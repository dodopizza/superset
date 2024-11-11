// DODO was here
import {
  CustomControlItem, // DODO added 30135470
  DEFAULT_SORT_SERIES_DATA,
  sections,
} from '@superset-ui/chart-controls';
import { ChartDataResponseResult, isSavedMetric, t } from '@superset-ui/core';
import {
  OrientationType,
  EchartsTimeseriesSeriesType,
  EchartsTimeseriesFormData,
} from './types';
import {
  DEFAULT_LEGEND_FORM_DATA,
  DEFAULT_TITLE_FORM_DATA,
} from '../constants';

// @ts-ignore
export const DEFAULT_FORM_DATA: EchartsTimeseriesFormData = {
  ...DEFAULT_LEGEND_FORM_DATA,
  ...DEFAULT_TITLE_FORM_DATA,
  ...DEFAULT_SORT_SERIES_DATA,
  annotationLayers: sections.annotationLayers,
  area: false,
  forecastEnabled: sections.FORECAST_DEFAULT_DATA.forecastEnabled,
  forecastInterval: sections.FORECAST_DEFAULT_DATA.forecastInterval,
  forecastPeriods: sections.FORECAST_DEFAULT_DATA.forecastPeriods,
  forecastSeasonalityDaily:
    sections.FORECAST_DEFAULT_DATA.forecastSeasonalityDaily,
  forecastSeasonalityWeekly:
    sections.FORECAST_DEFAULT_DATA.forecastSeasonalityWeekly,
  forecastSeasonalityYearly:
    sections.FORECAST_DEFAULT_DATA.forecastSeasonalityYearly,
  logAxis: false,
  markerEnabled: false,
  markerSize: 6,
  minorSplitLine: false,
  opacity: 0.2,
  orderDesc: true,
  rowLimit: 10000,
  seriesType: EchartsTimeseriesSeriesType.Line,
  stack: false,
  tooltipTimeFormat: 'smart_date',
  truncateYAxis: false,
  yAxisBounds: [null, null],
  zoomable: false,
  richTooltip: true,
  xAxisLabelRotation: 0,
  groupby: [],
  showValue: false,
  onlyTotal: false,
  percentageThreshold: 0,
  orientation: OrientationType.vertical,
  sort_series_type: 'sum',
  sort_series_ascending: false,
};

export const TIME_SERIES_DESCRIPTION_TEXT: string = t(
  'When using other than adaptive formatting, labels may overlap',
);

// DODO added start 33638561
export const CONTROL_PANEL_COLUMN_CONFIG: CustomControlItem = {
  name: 'column_config',
  config: {
    type: 'ColumnConfigControl',
    label: t('Customize Metrics'),
    width: 400,
    height: 175,
    renderTrigger: true,
    configFormLayout: {
      '0': [['d3NumberFormat'], ['exportAsTime']],
      '1': [],
      '2': [],
      '3': [],
    },
    shouldMapStateToProps() {
      return true;
    },
    mapStateToProps(explore, _, chart) {
      // Showing metrics instead of columns
      const colnames = [...(chart?.latestQueryFormData?.metrics ?? [])].map(
        metric => (isSavedMetric(metric) ? metric : metric?.label),
      );
      const coltypes = Array.from({ length: colnames.length }, () => 0);
      const newQueriesResponse = {
        ...(chart?.queriesResponse?.[0] ?? {}),
        colnames,
        coltypes,
      };
      return {
        queryResponse: newQueriesResponse as
          | ChartDataResponseResult
          | undefined,
      };
    },
  },
};
// DODO added stop 33638561
