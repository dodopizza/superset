// DODO was here
import {
  ColorFormatters,
  getColorFormatters,
  getColorFormattersWithConditionalMessage,
  Metric,
} from '@superset-ui/chart-controls';
import {
  GenericDataType,
  getMetricLabel,
  extractTimegrain,
  QueryFormData,
  getValueFormatter,
  isSavedMetric, // DODO added 30135470
} from '@superset-ui/core';
import { BigNumberTotalChartProps, BigNumberVizProps } from '../types';
import { getDateFormatter, parseMetricValue } from '../utils';
import { Refs } from '../../types';

export default function transformProps(
  chartProps: BigNumberTotalChartProps,
): BigNumberVizProps {
  const {
    width,
    height,
    queriesData,
    formData,
    rawFormData,
    hooks,
    datasource: {
      currencyFormats = {},
      columnFormats = {},
      metrics: datasourceMetrics = [], // DODO added 30135470
    },
  } = chartProps;
  const {
    headerFontSize,
    metric = 'value',
    subheader = '',
    subheaderFontSize,
    forceTimestampFormatting,
    timeFormat,
    yAxisFormat,
    conditionalFormatting,
    currencyFormat,
    // DODO add start #32232659
    conditionalFormattingMessage,
    conditionalMessageFontSize,
    alignment,
    // DODO add stop #32232659
  } = formData;
  const refs: Refs = {};
  const { data = [], coltypes = [] } = queriesData[0];
  const granularity = extractTimegrain(rawFormData as QueryFormData);
  const metricName = getMetricLabel(metric);
  const formattedSubheader = subheader;
  const bigNumber =
    data.length === 0 ? null : parseMetricValue(data[0][metricName]);

  let metricEntry: Metric | undefined;
  if (chartProps.datasource?.metrics) {
    metricEntry = chartProps.datasource.metrics.find(
      metricItem => metricItem.metric_name === metric,
    );
  }

  const formatTime = getDateFormatter(
    timeFormat,
    granularity,
    metricEntry?.d3format,
  );

  // DODO added start 30135470
  const columnConfigImmitation = {
    [isSavedMetric(metric) ? metric : metric.label || '']: {
      d3NumberFormat: yAxisFormat,
    },
  };
  // DODO added stop 30135470

  const numberFormatter = getValueFormatter(
    metric,
    currencyFormats,
    columnFormats,
    yAxisFormat,
    currencyFormat,
    // DODO added start 30135470
    undefined,
    datasourceMetrics,
    columnConfigImmitation,
    // DODO added stop 30135470
  );

  const headerFormatter =
    coltypes[0] === GenericDataType.TEMPORAL ||
    coltypes[0] === GenericDataType.STRING ||
    forceTimestampFormatting
      ? formatTime
      : numberFormatter;

  const { onContextMenu } = hooks;

  const defaultColorFormatters = [] as ColorFormatters;

  const colorThresholdFormatters =
    getColorFormatters(conditionalFormatting, data, false) ??
    defaultColorFormatters;

  // DODO added #32232659  start
  const conditionalMessageColorFormatters =
    getColorFormattersWithConditionalMessage(conditionalFormattingMessage) ??
    defaultColorFormatters;
  // DODO #32232659  stop

  return {
    width,
    height,
    bigNumber,
    headerFormatter,
    headerFontSize,
    subheaderFontSize,
    subheader: formattedSubheader,
    onContextMenu,
    refs,
    colorThresholdFormatters,
    // DODO added #32232659
    conditionalMessageColorFormatters,
    conditionalMessageFontSize,
    alignment,
  };
}
