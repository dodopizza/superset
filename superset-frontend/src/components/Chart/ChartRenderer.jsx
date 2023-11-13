/* eslint-disable no-lonely-if */
/* eslint-disable camelcase */
/* eslint-disable no-restricted-syntax */
// DODO was here
import { snakeCase, isEqual } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { SuperChart, logging, Behavior, t } from '@superset-ui/core';
import { Logger, LOG_ACTIONS_RENDER_CHART } from 'src/logger/LogUtils';
// DODO-changed
import {
  EmptyStateBig as EmptyStateBigPlugin,
  EmptyStateSmall as EmptyStateSmallPlugin,
} from 'src/Superstructure/components/EmptyState';

import { EmptyStateBig, EmptyStateSmall } from 'src/components/EmptyState';
import { LimitWarning } from 'src/Superstructure/components/LimitWarning';

const propTypes = {
  annotationData: PropTypes.object,
  actions: PropTypes.object,
  chartId: PropTypes.number.isRequired,
  datasource: PropTypes.object,
  initialValues: PropTypes.object,
  formData: PropTypes.object.isRequired,
  latestQueryFormData: PropTypes.object,
  labelColors: PropTypes.object,
  sharedLabelColors: PropTypes.object,
  height: PropTypes.number,
  width: PropTypes.number,
  setControlValue: PropTypes.func,
  vizType: PropTypes.string.isRequired,
  triggerRender: PropTypes.bool,
  // state
  chartAlert: PropTypes.string,
  chartStatus: PropTypes.string,
  queriesResponse: PropTypes.arrayOf(PropTypes.object),
  triggerQuery: PropTypes.bool,
  chartIsStale: PropTypes.bool,
  // dashboard callbacks
  addFilter: PropTypes.func,
  setDataMask: PropTypes.func,
  onFilterMenuOpen: PropTypes.func,
  onFilterMenuClose: PropTypes.func,
  ownState: PropTypes.object,
  postTransformProps: PropTypes.func,
  source: PropTypes.oneOf(['dashboard', 'explore']),
};

const BLANK = {};

const BIG_NO_RESULT_MIN_WIDTH = 300;
const BIG_NO_RESULT_MIN_HEIGHT = 220;

const behaviors = [Behavior.INTERACTIVE_CHART];

const defaultProps = {
  addFilter: () => BLANK,
  onFilterMenuOpen: () => BLANK,
  onFilterMenuClose: () => BLANK,
  initialValues: BLANK,
  setControlValue() {},
  triggerRender: false,
};

class ChartRenderer extends React.Component {
  constructor(props) {
    super(props);
    this.hasQueryResponseChange = false;

    this.handleAddFilter = this.handleAddFilter.bind(this);
    this.handleRenderSuccess = this.handleRenderSuccess.bind(this);
    this.handleRenderFailure = this.handleRenderFailure.bind(this);
    this.handleSetControlValue = this.handleSetControlValue.bind(this);

    this.hooks = {
      onAddFilter: this.handleAddFilter,
      onError: this.handleRenderFailure,
      setControlValue: this.handleSetControlValue,
      onFilterMenuOpen: this.props.onFilterMenuOpen,
      onFilterMenuClose: this.props.onFilterMenuClose,
      setDataMask: dataMask => {
        this.props.actions?.updateDataMask(this.props.chartId, dataMask);
      },
    };
  }

  shouldComponentUpdate(nextProps) {
    const resultsReady =
      nextProps.queriesResponse &&
      ['success', 'rendered'].indexOf(nextProps.chartStatus) > -1 &&
      !nextProps.queriesResponse?.[0]?.error;

    if (resultsReady) {
      this.hasQueryResponseChange =
        nextProps.queriesResponse !== this.props.queriesResponse;
      return (
        this.hasQueryResponseChange ||
        !isEqual(nextProps.datasource, this.props.datasource) ||
        nextProps.annotationData !== this.props.annotationData ||
        nextProps.ownState !== this.props.ownState ||
        nextProps.filterState !== this.props.filterState ||
        nextProps.height !== this.props.height ||
        nextProps.width !== this.props.width ||
        nextProps.triggerRender ||
        nextProps.labelColors !== this.props.labelColors ||
        nextProps.sharedLabelColors !== this.props.sharedLabelColors ||
        nextProps.formData.color_scheme !== this.props.formData.color_scheme ||
        nextProps.formData.stack !== this.props.formData.stack ||
        nextProps.cacheBusterProp !== this.props.cacheBusterProp
      );
    }
    return false;
  }

  handleAddFilter(col, vals, merge = true, refresh = true) {
    this.props.addFilter(col, vals, merge, refresh);
  }

  handleRenderSuccess() {
    const { actions, chartStatus, chartId, vizType } = this.props;
    if (['loading', 'rendered'].indexOf(chartStatus) < 0) {
      actions.chartRenderingSucceeded(chartId);
    }

    // only log chart render time which is triggered by query results change
    // currently we don't log chart re-render time, like window resize etc
    if (this.hasQueryResponseChange) {
      actions.logEvent(LOG_ACTIONS_RENDER_CHART, {
        slice_id: chartId,
        viz_type: vizType,
        start_offset: this.renderStartTime,
        ts: new Date().getTime(),
        duration: Logger.getTimestamp() - this.renderStartTime,
      });
    }
  }

  handleRenderFailure(error, info) {
    const { actions, chartId } = this.props;
    logging.warn(error);
    actions.chartRenderingFailed(
      error.toString(),
      chartId,
      info ? info.componentStack : null,
    );

    // only trigger render log when query is changed
    if (this.hasQueryResponseChange) {
      actions.logEvent(LOG_ACTIONS_RENDER_CHART, {
        slice_id: chartId,
        has_err: true,
        error_details: error.toString(),
        start_offset: this.renderStartTime,
        ts: new Date().getTime(),
        duration: Logger.getTimestamp() - this.renderStartTime,
      });
    }
  }

  handleSetControlValue(...args) {
    const { setControlValue } = this.props;
    if (setControlValue) {
      setControlValue(...args);
    }
  }

  render() {
    const {
      chartAlert,
      chartStatus,
      chartId,
      formData: { row_limit },
    } = this.props;

    // Skip chart rendering
    if (chartStatus === 'loading' || !!chartAlert || chartStatus === null) {
      return null;
    }

    this.renderStartTime = Logger.getTimestamp();

    const {
      width,
      height,
      datasource,
      annotationData,
      initialValues,
      ownState,
      filterState,
      chartIsStale,
      formData,
      latestQueryFormData,
      queriesResponse,
      postTransformProps,
      dashboardLanguage,
      chartName,
    } = this.props;

    console.log('this.propssasas', this.props);

    let alteredVerboseMap = {};

    const metricsArray = datasource.metrics;
    const columnsArray = datasource.columns;

    console.groupCollapsed('Altered Verbose Map', chartName);
    console.log('metricsArray', metricsArray);
    console.log('columnsArray', columnsArray);

    for (const property in datasource.verbose_map) {
      let finalNameFromDataset = datasource.verbose_map[property];

      const foundMetric = metricsArray.filter(
        metric => metric.metric_name === property,
      );

      const foundColumn = columnsArray.filter(
        column => column.column_name === property,
      );

      if (foundMetric.length) {
        const { verbose_name, verbose_name_RU } = foundMetric[0];
        finalNameFromDataset =
          dashboardLanguage === 'ru'
            ? verbose_name_RU || verbose_name
            : verbose_name;
      } else if (foundColumn.length) {
        const { verbose_name, verbose_name_RU, column_name } = foundColumn[0];
        finalNameFromDataset =
          dashboardLanguage === 'ru'
            ? verbose_name_RU || verbose_name || column_name
            : verbose_name || column_name;
      }

      console.log('foundMetric', foundMetric);
      console.log('foundColumn', foundColumn);
      console.log('property', property);
      console.log('finalNameFromDataset', finalNameFromDataset);
      console.log('____');

      alteredVerboseMap = {
        ...alteredVerboseMap,
        [property]: finalNameFromDataset,
      };
    }

    console.log('alteredVerboseMap', alteredVerboseMap);
    console.groupEnd();
    console.log('');

    const getFinalNameForMetric = (metric, dashboardLanguage) =>
      dashboardLanguage === 'ru'
        ? metric.verbose_name_RU || metric.verbose_name
        : metric.verbose_name;

    const alteredDatasource = {
      ...datasource,
      verbose_map: alteredVerboseMap,
      columns: datasource.columns.map(column => ({
        ...column,
        verbose_name:
          dashboardLanguage === 'ru'
            ? column.verbose_name_RU || column.verbose_name
            : column.verbose_name,
        description:
          dashboardLanguage === 'ru'
            ? column.description_RU || column.description
            : column.description,
      })),
      metrics: datasource.metrics.map(metric => ({
        ...metric,
        verbose_name: getFinalNameForMetric(metric, dashboardLanguage),
        description:
          dashboardLanguage === 'ru'
            ? metric.description_RU || metric.description
            : metric.description,
      })),
    };

    const currentFormData =
      chartIsStale && latestQueryFormData ? latestQueryFormData : formData;

    const alteredFormData = {
      ...currentFormData,
      groupbyColumns:
        currentFormData.groupbyColumns && currentFormData.groupbyColumns.length
          ? currentFormData.groupbyColumns.map(c => {
              if (typeof c === 'string') {
                return c;
              }
              return {
                ...c,
                label: dashboardLanguage === 'ru' ? c.labelRU : c.label,
              };
            })
          : [],
      metrics:
        currentFormData.metrics && currentFormData.metrics.length
          ? currentFormData.metrics.map(m => {
              if (typeof m === 'string') {
                return m;
              }
              return {
                ...m,
                label: dashboardLanguage === 'ru' ? m.labelRU : m.label,
              };
            })
          : [],
    };

    console.groupCollapsed('ALL ALTERED', chartName);
    console.log('datasource', datasource);
    console.log('alteredDatasource', alteredDatasource);
    console.log('+_+_+_+');
    console.log('currentFormData', currentFormData);
    console.log('alteredFormData', alteredFormData);
    console.log('+_+_+_+');
    console.log('Queries Response', queriesResponse);
    console.log('datasource.verbose_map', datasource.verbose_map);
    console.log('alteredVerboseMap', alteredVerboseMap);
    console.log('+_+_+_+');
    console.groupEnd();
    console.log('');

    const vizType = alteredFormData.viz_type || this.props.vizType;

    const rowCount = Number(queriesResponse[0].rowcount) || 0;

    const rowLimit = Number(row_limit) || 0;

    // It's bad practice to use unprefixed `vizType` as classnames for chart
    // container. It may cause css conflicts as in the case of legacy table chart.
    // When migrating charts, we should gradually add a `superset-chart-` prefix
    // to each one of them.
    const snakeCaseVizType = snakeCase(vizType);
    const chartClassName =
      vizType === 'table'
        ? `superset-chart-${snakeCaseVizType}`
        : snakeCaseVizType;

    const webpackHash =
      process.env.WEBPACK_MODE === 'development'
        ? `-${
            // eslint-disable-next-line camelcase
            typeof __webpack_require__ !== 'undefined' &&
            // eslint-disable-next-line camelcase, no-undef
            typeof __webpack_require__.h === 'function' &&
            // eslint-disable-next-line no-undef
            __webpack_require__.h()
          }`
        : '';

    let noResultsComponent;
    const noResultTitle = t('No results were returned for this query');
    const noResultDescription =
      this.props.source === 'explore'
        ? t(
            'Make sure that the controls are configured properly and the datasource contains data for the selected time range',
          )
        : undefined;
    const noResultImage = 'chart.svg';

    console.log('ChartRenderer [ process.env.type => ', process.env.type, ']');

    if (width > BIG_NO_RESULT_MIN_WIDTH && height > BIG_NO_RESULT_MIN_HEIGHT) {
      if (process.env.type === undefined) {
        noResultsComponent = (
          <EmptyStateBig
            title={noResultTitle}
            description={noResultDescription}
            image={noResultImage}
          />
        );
      } else {
        noResultsComponent = (
          <EmptyStateBigPlugin
            title={noResultTitle}
            description={noResultDescription}
            image={noResultImage}
          />
        );
      }
    } else {
      if (process.env.type === undefined) {
        noResultsComponent = (
          <EmptyStateSmall title={noResultTitle} image={noResultImage} />
        );
      } else {
        noResultsComponent = (
          <EmptyStateSmallPlugin title={noResultTitle} image={noResultImage} />
        );
      }
    }

    if (rowCount > 0 && rowLimit > 0 && rowCount >= rowLimit) {
      return <LimitWarning limit={rowLimit} />;
    }

    return (
      <SuperChart
        disableErrorBoundary
        key={`${chartId}${webpackHash}`}
        id={`chart-id-${chartId}`}
        className={chartClassName}
        chartType={vizType}
        width={width}
        height={height}
        annotationData={annotationData}
        datasource={alteredDatasource}
        initialValues={initialValues}
        formData={alteredFormData}
        ownState={ownState}
        filterState={filterState}
        hooks={this.hooks}
        behaviors={behaviors}
        queriesData={queriesResponse}
        onRenderSuccess={this.handleRenderSuccess}
        onRenderFailure={this.handleRenderFailure}
        noResults={noResultsComponent}
        postTransformProps={postTransformProps}
      />
    );
  }
}

ChartRenderer.propTypes = propTypes;
ChartRenderer.defaultProps = defaultProps;

export default ChartRenderer;
