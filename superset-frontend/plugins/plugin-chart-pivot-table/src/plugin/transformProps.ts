// DODO was here
import { bootstrapData } from 'src/preamble'; // DODO added 38403772
import {
  ChartProps,
  DataRecord,
  extractTimegrain,
  GenericDataType,
  getTimeFormatter,
  QueryFormData,
  smartDateFormatter,
  // DODO added #34239342
  smartDateFormatter_dot_ddmmyyyy,
  TimeFormats,
} from '@superset-ui/core';
import {
  getColorFormatters,
  extractDatasourceDescriptions, // DODO added 38403772
} from '@superset-ui/chart-controls';
// DODO changed 38087840
import { DateFormatter, MetricsLayoutEnum } from '../types';

const locale = bootstrapData?.common?.locale || 'en'; // DODO added 38403772
const { DATABASE_DATETIME } = TimeFormats;

function isNumeric(key: string, data: DataRecord[] = []) {
  return data.every(
    record =>
      record[key] === null ||
      record[key] === undefined ||
      typeof record[key] === 'number',
  );
}

// DODO added start #35514397
const getPinnedColumnIndexes = (
  groupbyRows: Array<string>,
  columnConfig: Record<string, { pinColumn: boolean }> | undefined,
): Array<number> => {
  if (!columnConfig) return [];

  const indexes: number[] = [];

  groupbyRows.forEach((row: string, index: number) => {
    if (columnConfig[row]?.pinColumn) indexes.push(index);
  });

  return indexes;
};
// DODO added stop #35514397

// DODO added 38087840
const METRIC_KEY = 'Metric';

export default function transformProps(chartProps: ChartProps<QueryFormData>) {
  /**
   * This function is called after a successful response has been
   * received from the chart data endpoint, and is used to transform
   * the incoming data prior to being sent to the Visualization.
   *
   * The transformProps function is also quite useful to return
   * additional/modified props to your data viz component. The formData
   * can also be accessed from your PivotTableChart.tsx file, but
   * doing supplying custom props here is often handy for integrating third
   * party libraries that rely on specific props.
   *
   * A description of properties in `chartProps`:
   * - `height`, `width`: the height/width of the DOM element in which
   *   the chart is located
   * - `formData`: the chart data request payload that was sent to the
   *   backend.
   * - `queriesData`: the chart data response payload that was received
   *   from the backend. Some notable properties of `queriesData`:
   *   - `data`: an array with data, each row with an object mapping
   *     the column/alias to its value. Example:
   *     `[{ col1: 'abc', metric1: 10 }, { col1: 'xyz', metric1: 20 }]`
   *   - `rowcount`: the number of rows in `data`
   *   - `query`: the query that was issued.
   *
   * Please note: the transformProps function gets cached when the
   * application loads. When making changes to the `transformProps`
   * function during development with hot reloading, changes won't
   * be seen until restarting the development server.
   */
  const {
    width,
    height,
    queriesData,
    formData,
    rawFormData,
    hooks: { setDataMask = () => {}, onContextMenu },
    filterState,
    datasource: {
      verboseMap = {},
      columnFormats = {},
      currencyFormats = {},
      metrics: datasourceMetrics, // DODO added 38403772
      columns: datasourceColumns, // DODO added 38403772
    },
    emitCrossFilters,
  } = chartProps;
  const { data, colnames, coltypes } = queriesData[0];
  const {
    groupbyRows,
    groupbyColumns,
    metrics,
    tableRenderer,
    colOrder,
    rowOrder,
    // DODO added #35514397
    columnConfig,
    aggregateFunction,
    transposePivot,
    combineMetric,
    rowSubtotalPosition,
    colSubtotalPosition,
    colTotals,
    colSubTotals,
    rowTotals,
    rowSubTotals,
    valueFormat,
    dateFormat,
    metricsLayout,
    conditionalFormatting,
    timeGrainSqla,
    currencyFormat,
  } = formData;
  const { selectedFilters } = filterState;
  const granularity = extractTimegrain(rawFormData);

  const dateFormatters = colnames
    .filter(
      (colname: string, index: number) =>
        coltypes[index] === GenericDataType.TEMPORAL,
    )
    .reduce(
      (
        acc: Record<string, DateFormatter | undefined>,
        temporalColname: string,
      ) => {
        let formatter: DateFormatter | undefined;
        // DODO changed start #34239342
        if (
          dateFormat === smartDateFormatter.id ||
          dateFormat === smartDateFormatter_dot_ddmmyyyy.id
        ) {
          if (granularity) {
            // time column use formats based on granularity
            formatter = getTimeFormatter(dateFormat, granularity);
            // DODO changed stop #34239342
          } else if (isNumeric(temporalColname, data)) {
            formatter = getTimeFormatter(DATABASE_DATETIME);
          } else {
            // if no column-specific format, print cell as is
            formatter = String;
          }
        } else if (dateFormat) {
          formatter = getTimeFormatter(dateFormat);
        }
        if (formatter) {
          acc[temporalColname] = formatter;
        }
        return acc;
      },
      {},
    );
  const metricColorFormatters = getColorFormatters(conditionalFormatting, data);
  // DODO added start 38087840
  const group = transposePivot ? groupbyColumns : groupbyRows;
  const isRowsLayout = metricsLayout === MetricsLayoutEnum.ROWS;
  const groupWithMetric = combineMetric
    ? [...group, METRIC_KEY]
    : [METRIC_KEY, ...group];
  const columns = !isRowsLayout ? group : groupWithMetric;
  const pinnedColumns = getPinnedColumnIndexes(columns, columnConfig);
  // DODO added stop 38087840
  // DODO added start 38403772
  const datasourceDescriptions = extractDatasourceDescriptions(
    metrics,
    datasourceMetrics,
    datasourceColumns,
    locale,
  );
  // DODO added stop 38403772

  return {
    width,
    height,
    data,
    groupbyRows,
    groupbyColumns,
    // DODO added #35514397
    pinnedColumns,
    metrics,
    tableRenderer,
    colOrder,
    rowOrder,
    aggregateFunction,
    transposePivot,
    combineMetric,
    rowSubtotalPosition,
    colSubtotalPosition,
    colTotals,
    colSubTotals,
    rowTotals,
    rowSubTotals,
    valueFormat,
    currencyFormat,
    emitCrossFilters,
    setDataMask,
    selectedFilters,
    verboseMap,
    columnFormats,
    currencyFormats,
    metricsLayout,
    metricColorFormatters,
    dateFormatters,
    onContextMenu,
    timeGrainSqla,
    datasourceDescriptions, // DODO added 38403772
  };
}
