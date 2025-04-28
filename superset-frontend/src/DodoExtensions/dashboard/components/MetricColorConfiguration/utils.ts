import { ChartDataResponseResult, isSavedMetric } from '@superset-ui/core';
import { DatasourcesState } from 'src/dashboard/types';
import { ChartState } from 'src/explore/types';
import { bootstrapData } from 'src/preamble';

const locale = bootstrapData?.common?.locale || 'en';

const exploreJsonVizes: Record<string, 'true'> = {
  bubble: 'true',
};

/**
 * Extracts all metrics from dashboard charts
 * @param charts Dashboard charts
 * @returns Array of metric names
 */
export const getDashboardMetrics = (charts: {
  [key: number]: ChartState;
}): string[] =>
  Object.values(charts).reduce((result: string[], chart) => {
    if (!chart.queriesResponse) return result;

    (chart.queriesResponse as ChartDataResponseResult[]).forEach(response => {
      const vizType = chart.latestQueryFormData.viz_type;
      if (vizType === 'table' || vizType === 'pivot_table_v2') return;

      if (response.colnames && Array.isArray(response.colnames)) {
        result.push(...response.colnames);
      }

      const metricsForDataIteration = [];

      if (Array.isArray(chart.latestQueryFormData?.groupby)) {
        metricsForDataIteration.push(...chart.latestQueryFormData?.groupby);
      }

      // bubble_v2
      if (chart.latestQueryFormData?.series) {
        metricsForDataIteration.push(chart.latestQueryFormData.series);
      }

      // sankey_v2
      if (chart.latestQueryFormData?.source) {
        metricsForDataIteration.push(chart.latestQueryFormData.source);
      }

      // graph_chart
      if (chart.latestQueryFormData?.target) {
        metricsForDataIteration.push(chart.latestQueryFormData.target);
      }

      // sunburst_v2
      if (Array.isArray(chart.latestQueryFormData?.columns)) {
        metricsForDataIteration.push(...chart.latestQueryFormData.columns);
      }

      // explore json vizes
      if (exploreJsonVizes[vizType || '']) {
        metricsForDataIteration.push('key');
      }

      if (metricsForDataIteration.length) {
        const metricNames = metricsForDataIteration.map(metric =>
          isSavedMetric(metric) ? metric : metric.label ?? '',
        );

        response.data.forEach(entry => {
          metricNames.forEach(metric => {
            const metricValue = Array.isArray(entry[metric])
              ? // @ts-ignore
                entry[metric].join(', ')
              : entry[metric];
            if (
              metricValue &&
              (typeof metricValue === 'string' ||
                typeof metricValue === 'number')
            ) {
              result.push(String(metricValue));
            }
          });
        });
      }
    });

    return result;
  }, []);

/**
 * Creates a translation map for metrics and columns
 * @param datasources Datasources with metrics and columns
 * @returns Map of original names to translated names
 */
export const getTranslationsMap = (
  datasources: DatasourcesState = {},
): Record<string, string> => {
  const translations: Record<string, string> = {};

  // Collect translations from all datasources
  Object.values(datasources).forEach(datasource => {
    // Add translations for metrics
    if (Array.isArray(datasource?.metrics)) {
      datasource.metrics.forEach((metric: any) => {
        // For Russian language use verbose_name_ru
        if (locale === 'ru' && metric.verbose_name_ru) {
          translations[metric.metric_name] = metric.verbose_name_ru;
        }
        // For English and other languages use verbose_name
        else if (
          metric.verbose_name &&
          metric.metric_name !== metric.verbose_name
        ) {
          translations[metric.metric_name] = metric.verbose_name;
        }

        // If metric is displayed by name but has verbose_name
        if (metric.verbose_name && metric.metric_name !== metric.verbose_name) {
          translations[metric.verbose_name] =
            locale === 'ru' && metric.verbose_name_ru
              ? metric.verbose_name_ru
              : metric.metric_name;
        }
      });
    }

    // Add translations for columns
    if (Array.isArray(datasource?.columns)) {
      datasource.columns.forEach(column => {
        // For Russian language use verbose_name_ru
        if (locale === 'ru' && column.verbose_name_ru) {
          translations[column.column_name] = column.verbose_name_ru;
        }
        // For English and other languages use verbose_name
        else if (
          column.verbose_name &&
          column.column_name !== column.verbose_name
        ) {
          translations[column.column_name] = column.verbose_name;
        }

        // If column is displayed by name but has verbose_name
        if (column.verbose_name && column.column_name !== column.verbose_name) {
          translations[column.verbose_name] =
            locale === 'ru' && column.verbose_name_ru
              ? column.verbose_name_ru
              : column.column_name;
        }
      });
    }
  });

  return translations;
};
