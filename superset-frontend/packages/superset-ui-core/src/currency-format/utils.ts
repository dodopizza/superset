// DODO was here
import {
  Currency,
  CurrencyFormatter,
  ensureIsArray,
  getNumberFormatter,
  isAdhocMetricSimple, // DODO added 30135470
  isAdhocMetricSQL, // DODO added 30135470
  isSavedMetric,
  Metric, // DODO added 30135470
  QueryFormMetric,
  ValueFormatter,
} from '@superset-ui/core';

export const buildCustomFormatters = (
  metrics: QueryFormMetric | QueryFormMetric[] | undefined,
  savedCurrencyFormats: Record<string, Currency>,
  savedColumnFormats: Record<string, string>,
  d3Format: string | undefined,
  currencyFormat: Currency | undefined,
  datasourceMetrics?: Metric[], // DODO added 30135470
  columnConfig?: Record<string, any>, // DODO added 30135470
) => {
  const metricsArray = ensureIsArray(metrics);
  return metricsArray.reduce((acc, metric) => {
    if (isSavedMetric(metric)) {
      // DODO added start 30135470
      const configFormat = columnConfig?.[metric]?.d3NumberFormat;
      const metricNumberFormat = datasourceMetrics?.find(
        datasourceMetric => datasourceMetric.metric_name === metric,
      )?.number_format;
      // DODO added stop 30135470
      const actualD3Format =
        configFormat || // DODO added 30135470
        metricNumberFormat || // DODO added 30135470
        d3Format ||
        savedColumnFormats[metric];
      const actualCurrencyFormat = currencyFormat?.symbol
        ? currencyFormat
        : savedCurrencyFormats[metric];
      return actualCurrencyFormat
        ? {
            ...acc,
            [metric]: new CurrencyFormatter({
              d3Format: actualD3Format,
              currency: actualCurrencyFormat,
            }),
          }
        : {
            ...acc,
            [metric]: getNumberFormatter(actualD3Format),
          };
    }
    // DODO added start 30135470
    if (isAdhocMetricSimple(metric) || isAdhocMetricSQL(metric)) {
      const label = metric?.label || '';
      const configFormat = columnConfig?.[label]?.d3NumberFormat;
      if (!configFormat) return acc;
      return {
        ...acc,
        [label]: getNumberFormatter(configFormat),
      };
    }
    // DODO added stop 30135470
    return acc;
  }, {});
};

export const getCustomFormatter = (
  customFormatters: Record<string, ValueFormatter>,
  metrics: QueryFormMetric | QueryFormMetric[] | undefined,
  key?: string,
) => {
  const metricsArray = ensureIsArray(metrics);
  if (metricsArray.length === 1 && isSavedMetric(metricsArray[0])) {
    return customFormatters[metricsArray[0]];
  }
  return key ? customFormatters[key] : undefined;
};

export const getValueFormatter = (
  metrics: QueryFormMetric | QueryFormMetric[] | undefined,
  savedCurrencyFormats: Record<string, Currency>,
  savedColumnFormats: Record<string, string>,
  d3Format: string | undefined,
  currencyFormat: Currency | undefined,
  key?: string,
  datasourceMetrics?: Metric[], // DODO added 30135470
  columnConfig?: Record<string, any>, // DODO added 30135470
) => {
  const customFormatter = getCustomFormatter(
    buildCustomFormatters(
      metrics,
      savedCurrencyFormats,
      savedColumnFormats,
      d3Format,
      currencyFormat,
      datasourceMetrics,
      columnConfig, // DODO added 30135470
    ),
    metrics,
    key,
  );

  if (customFormatter) {
    return customFormatter;
  }
  if (currencyFormat?.symbol) {
    return new CurrencyFormatter({ currency: currencyFormat, d3Format });
  }
  return getNumberFormatter(d3Format);
};
