import {
  AdhocMetricSimple,
  Column,
  isAdhocMetricSimple,
  isSavedMetric,
  Maybe,
  Metric,
  QueryFormMetric,
} from '@superset-ui/core';

type Source = Metric | AdhocMetricSimple['column'];

export const extractDatasourceDescriptions = (
  metrics: QueryFormMetric[], // Chart Metrics
  datasourceMetrics: Metric[],
  datasourceColumns: Column[],
  locale: string,
): Record<string, string> => {
  const descriptions: Record<string, string> = {};

  const formattedLocale = locale.toLocaleUpperCase();
  const localizedKey = `description_${formattedLocale}` as
    | 'description_EN'
    | 'description_RU';

  const getDescription = (source: Source): Maybe<string> | undefined =>
    source[localizedKey] ||
    source.description_RU ||
    source.description_EN ||
    source.description;

  const queryFormMetricMap = metrics.reduce(
    (acc: Record<string, QueryFormMetric>, metric) => {
      if (isSavedMetric(metric)) {
        acc[metric] = metric;
      }
      if (isAdhocMetricSimple(metric) && metric.column.column_name) {
        acc[metric.column.column_name] = metric;
      }
      return acc;
    },
    {},
  );
  console.log('metrics', metrics)
  console.log('queryFormMetricMap', queryFormMetricMap)
  // Set for checking metric or column is used in Chart metrics
  // const savedMetricsSet = new Set(
  //   metrics.map(metric => {
  //     if (isSavedMetric(metric)) return metric;

  //     if (isAdhocMetricSimple(metric)) {
  //       const description = getDescription(metric.column);
  //       if (description && metric.label)
  //         descriptions[metric.label] = description;
  //       return metric.column.column_name;
  //     }
  //     return null;
  //   }),
  // );

  const addDescriptionIfUsedInMetrics = (source: Source) => {
    const sourceName =
      'metric_name' in source ? source.metric_name : source.column_name;
    if (!sourceName) return;

    const queryFormMetric = queryFormMetricMap[sourceName];
    if (!queryFormMetric) return;

    const description = getDescription(source);
    if (!description) return;

    if (isSavedMetric(queryFormMetric)) {
      if (!descriptions[sourceName]) descriptions[sourceName] = description;
    } else {
      const columnLabel = queryFormMetric.label;
      if (columnLabel && !descriptions[columnLabel])
        descriptions[columnLabel] = description;
    }
  };

  // const addDescriptionIfUsedInMetrics = (source: Source) => {
  //   const sourceName =
  //     'metric_name' in source ? source.metric_name : source.column_name;
  //   const sourceLabel = source.verbose_name;
  //   if (sourceName && savedMetricsSet.has(sourceName)) {
  //     const description = getDescription(source);
  //     if (description && !descriptions[sourceName])
  //       descriptions[sourceName] = description;
  //     if (description && sourceLabel && !descriptions[sourceLabel])
  //       descriptions[sourceLabel] = description;
  //   }
  // };

  datasourceMetrics.forEach(metric => {
    addDescriptionIfUsedInMetrics(metric);
  });

  datasourceColumns.forEach(column => {
    addDescriptionIfUsedInMetrics(column);
  });

  return descriptions;
};
