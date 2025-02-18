// DODO was here
// DODO created 44728892
import {
  AdhocMetricSimple,
  Column,
  Datasource,
  isAdhocMetricSQL,
  isSavedMetric,
  Maybe,
  Metric,
  QueryFormData,
  QueryFormMetric,
} from '@superset-ui/core';

type Source = Metric | Column | AdhocMetricSimple['column'];

export const getMetricDescription = (
  formData: QueryFormData & { metric: QueryFormMetric | undefined },
  datasource: Datasource,
  locale: string,
): Maybe<string> | undefined => {
  const { viz_type, metric } = formData;
  if (!viz_type.startsWith('big_number') || !metric) return undefined;

  if (isAdhocMetricSQL(metric)) return undefined;

  const isMetricSaved = isSavedMetric(metric);

  const metricName = isMetricSaved ? metric : metric?.column.column_name;
  if (!metricName) return undefined;

  const formattedLocale = locale.toLocaleUpperCase();
  const localizedKey = `description_${formattedLocale}` as
    | 'description_EN'
    | 'description_RU';

  const getDescription = (
    source: Source | undefined,
  ): Maybe<string> | undefined =>
    source?.[localizedKey] ||
    source?.description_RU ||
    source?.description_EN ||
    source?.description;

  const { metrics: datasourceMetrics, columns } = datasource;

  if (isMetricSaved) {
    const dataSourceMetric = datasourceMetrics.find(
      metric => metric.metric_name === metricName,
    );
    return getDescription(dataSourceMetric);
  }

  const column = columns.find(column => column.column_name === metricName);
  return getDescription(column);
};
