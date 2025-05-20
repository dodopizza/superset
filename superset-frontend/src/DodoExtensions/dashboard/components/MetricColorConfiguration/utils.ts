import {
  ChartDataResponseResult,
  isSavedMetric,
  SqlaFormData,
} from '@superset-ui/core';
import {
  DatasourcesState,
  DashboardLayout,
  LayoutItem,
} from 'src/dashboard/types';
import { ChartState } from 'src/explore/types';
import { bootstrapData } from 'src/preamble';

const locale = bootstrapData?.common?.locale || 'en';

const exploreJsonVizes: Record<string, 'true'> = {
  bubble: 'true',
  line: 'true',
};

const excludedVizes: Record<string, 'true'> = {
  table: 'true',
  pivot_table_v2: 'true',
  handlebars: 'true',
  big_number: 'true',
  big_number_total: 'true',
};

type ChartInfo = { id: number; name: string; type: string };

/**
 * Processes dashboard charts to extract metrics and build a map of metrics to charts
 * @param charts Dashboard charts
 * @param dashboardLayout Dashboard layout with chart metadata
 * @returns Object with metrics array and metricsToChartsMap
 */

export const processDashboardCharts = (
  charts: { [key: number]: ChartState },
  dashboardLayout: DashboardLayout,
): {
  dashboardMetricsSet: Set<string>;
  metricsToChartsMap: Record<string, ChartInfo[]>;
} => {
  const dashboardMetricsSet = new Set<string>();
  const metricsToChartsMap: Record<string, ChartInfo[]> = {};

  const layoutMap = Object.values(dashboardLayout).reduce(
    (acc: Record<number, LayoutItem>, item) => {
      const chartId = item?.meta?.chartId;
      if (!chartId) return acc;
      return { ...acc, [chartId]: item };
    },
    {},
  );

  /**
   * Adds a metric to the set and maps it to the corresponding chart.
   */
  const addMetric = (metric: string, chartInfo: ChartInfo) => {
    if (!metric) return;

    // Add to metrics set
    dashboardMetricsSet.add(metric);

    // Add to metrics-to-charts map without duplicates
    if (!metricsToChartsMap[metric]) {
      metricsToChartsMap[metric] = [chartInfo];
    } else if (!metricsToChartsMap[metric].some(c => c.id === chartInfo.id)) {
      metricsToChartsMap[metric].push(chartInfo);
    }
  };

  /**
   * Extracts metrics from the form data and adds them to the map.
   */
  const extractMetricsFromFormData = (
    formData: Partial<SqlaFormData>,
  ): string[] => {
    if (!formData) return [];

    const metricsForDataIteration: string[] = [];

    if (Array.isArray(formData.groupby)) {
      metricsForDataIteration.push(
        ...formData.groupby.map(metric =>
          isSavedMetric(metric) ? metric : metric.label || '',
        ),
      );
    }

    if (formData.series) {
      metricsForDataIteration.push(formData.series);
    }

    if (formData.source) {
      metricsForDataIteration.push(formData.source);
    }

    if (formData.target) {
      metricsForDataIteration.push(formData.target);
    }

    if (Array.isArray(formData.columns)) {
      metricsForDataIteration.push(
        ...formData.columns.map(column =>
          isSavedMetric(column) ? column : column.label || '',
        ),
      );
    }

    if (exploreJsonVizes[formData.viz_type || '']) {
      metricsForDataIteration.push('key');
    }

    return metricsForDataIteration;
  };

  /**
   * Processes a single chart's query response to extract metrics.
   */
  const processChartResponse = (
    response: ChartDataResponseResult,
    chartInfo: ChartInfo,
    metricsForDataIteration: string[],
  ) => {
    const { colnames, data } = response;

    // Add column names as metrics
    if (Array.isArray(colnames)) {
      colnames.forEach(colname => addMetric(colname, chartInfo));
    }

    // Process data values for metrics
    if (data && Array.isArray(data)) {
      data.forEach(entry => {
        metricsForDataIteration.forEach(key => {
          const value = entry[key];
          const metricValue = Array.isArray(value) ? value.join(', ') : value;
          if (
            metricValue &&
            (typeof metricValue === 'string' || typeof metricValue === 'number')
          ) {
            addMetric(String(metricValue), chartInfo);
          }
        });
      });
    }
  };

  // Process all charts
  Object.values(charts).forEach(chart => {
    if (!chart.queriesResponse) return;

    // Get chart name from layout item
    const layoutItem = layoutMap[chart.id];

    const chartName =
      (locale === 'ru' && layoutItem?.meta?.sliceNameOverrideRU) ||
      (locale === 'ru' && layoutItem?.meta?.sliceNameRU) ||
      layoutItem?.meta?.sliceNameOverride ||
      layoutItem?.meta?.sliceName ||
      `Chart ${chart.id}`;

    const chartInfo: ChartInfo = {
      id: chart.id,
      name: chartName,
      type: chart.latestQueryFormData?.viz_type || 'unknown',
    };

    // Skip certain visualization types
    const vizType = chart.latestQueryFormData?.viz_type;
    if (excludedVizes[vizType || '']) return;

    // Process each query response
    (chart.queriesResponse as ChartDataResponseResult[]).forEach(response => {
      const metricsForDataIteration = extractMetricsFromFormData(
        chart.latestQueryFormData,
      );
      processChartResponse(response, chartInfo, metricsForDataIteration);
    });
  });

  return {
    dashboardMetricsSet,
    metricsToChartsMap,
  };
};

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
