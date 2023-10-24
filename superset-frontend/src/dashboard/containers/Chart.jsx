// DODO was here
// alteredDashboardLanguage
import { bindActionCreators } from 'redux';
import { bootstrapData } from 'src/preamble';
import { connect } from 'react-redux';
import {
  toggleExpandSlice,
  setFocusedFilterField,
  unsetFocusedFilterField,
} from 'src/dashboard/actions/dashboardState';
import { updateComponents } from 'src/dashboard/actions/dashboardLayout';
import { changeFilter } from 'src/dashboard/actions/dashboardFilters';
import {
  addSuccessToast,
  addDangerToast,
} from 'src/components/MessageToasts/actions';
import { refreshChart } from 'src/components/Chart/chartAction';
import { logEvent } from 'src/logger/actions';
import {
  getActiveFilters,
  getAppliedFilterValues,
} from 'src/dashboard/util/activeDashboardFilters';
import getFormDataWithExtraFilters from 'src/dashboard/util/charts/getFormDataWithExtraFilters';
import Chart from 'src/dashboard/components/gridComponents/Chart';
import { PLACEHOLDER_DATASOURCE } from 'src/dashboard/constants';

const EMPTY_OBJECT = {};

function mapStateToProps(
  {
    charts: chartQueries,
    dashboardInfo,
    dashboardState,
    dashboardLayout,
    dataMask,
    datasources,
    sliceEntities,
    nativeFilters,
    common,
  },
  ownProps,
) {
  const { id, extraControls, setControlValue } = ownProps;
  const chart = chartQueries[id] || EMPTY_OBJECT;
  const {
    form_data: {
      metrics: chartMetrics = null,
      groupbyColumns: chartColumns = null,
    } = {
      metrics: [],
    },
  } = chart;

  let alteredDashboardLanguage = 'en';

  // TODO: duplicated logic from the store
  const getUserLocaleForPlugin = () => {
    function getPageLanguage() {
      if (!document) {
        return null;
      }
      const select = document.querySelector('#changeLanguage select');
      const selectedLanguage = select ? select.value : null;
      return selectedLanguage;
    }
    const getLocaleForSuperset = () => {
      const dodoisLanguage = getPageLanguage();
      console.log('dodoisLanguage containers/Chart', dodoisLanguage);
      if (dodoisLanguage) {
        if (dodoisLanguage === 'ru-RU') return 'ru';
        return 'en';
      }
      return 'en';
    };

    return getLocaleForSuperset();
  };

  console.log('containers/Chart [ process.env.type => ', process.env.type, ']');

  // ENRTYPOINT DASHBOARD LANGUAGE
  if (process.env.type === undefined) {
    alteredDashboardLanguage =
      (bootstrapData && bootstrapData.common && bootstrapData.common.locale) ||
      'en';
  } else {
    alteredDashboardLanguage = getUserLocaleForPlugin();
  }

  const datasource =
    (chart && chart.form_data && datasources[chart.form_data.datasource]) ||
    PLACEHOLDER_DATASOURCE;
  const { colorScheme, colorNamespace, datasetsStatus } = dashboardState;
  const labelColors = dashboardInfo?.metadata?.label_colors || {};
  const sharedLabelColors = dashboardInfo?.metadata?.shared_label_colors || {};

  const neededLabelArrayFromMetrics =
    chartMetrics && chartMetrics.length
      ? chartMetrics.map(m => {
          if (typeof m === 'string') {
            return m;
          }
          return {
            ...m,
            label: m.label,
            labelRU: m.labelRU,
            hasCustomLabel: m.hasCustomLabel,
          };
        })
      : [];

  const neededLabelArrayFromColumns =
    chartColumns && chartColumns.length
      ? chartColumns.map(c => {
          if (typeof c === 'string') {
            return c;
          }
          return {
            ...c,
            label: c.label,
            labelRU: c.labelRU,
          };
        })
      : [];

  console.groupCollapsed('Chart labels');
  console.log('chart', chart);
  console.log('chartMetrics', chartMetrics);
  console.log('neededLabelArrayFromMetrics', neededLabelArrayFromMetrics);
  console.log('chartColumns', chartColumns);
  console.log('neededLabelArrayFromColumns', neededLabelArrayFromColumns);
  console.groupEnd();

  const getCorrectLabelsArray = (
    dashboardLanguage,
    columns,
    labelsArrayMetrics,
    labelsArrayColumns,
  ) => {
    const allLabels = [...labelsArrayMetrics, ...labelsArrayColumns];
    const alteredColumns = columns
      .map(c => {
        if (typeof c === 'string') return c;

        const foundItems = allLabels.filter(
          lab =>
            typeof label !== 'string' &&
            (lab.label === c || lab.label === c.label),
        );

        if (foundItems && foundItems.length) {
          return foundItems
            .map(item => {
              const { label, labelRU } = item;
              return dashboardLanguage === 'ru' ? labelRU || label : label;
            })
            .flat();
        }

        return c;
      })
      .flat();

    return alteredColumns;
  };

  const detectDataType = arr => {
    let isSimple = true;

    if (arr && arr.length) {
      arr.forEach(v => {
        if ('key' in v && 'values' in v) isSimple = false;
      });
    }

    return isSimple;
  };

  const handleSimpleArray = (data, allLabels) => {
    console.groupCollapsed('handleSimpleArray');
    console.log('data', data);
    console.log('allLabels', allLabels);
    console.groupEnd();

    return data
      .map(d => {
        const foundItems = allLabels.filter(
          lab => typeof lab !== 'string' && d[lab.label] !== undefined,
        );

        console.groupCollapsed('handleSimpleArray foundItems');
        console.log('foundItems', foundItems);

        if (foundItems && foundItems.length) {
          let tempCollection = {};

          foundItems.forEach(item => {
            const { label, labelRU } = item;
            const obj = {
              [label]: d[label],
              [labelRU || label]: d[label],
            };
            tempCollection = {
              ...tempCollection,
              ...obj,
            };
          });
          const returningObj = {
            ...d,
            ...tempCollection,
          };
          console.log('initial', d);
          console.log('returningObj', returningObj);
          console.groupEnd();

          return returningObj;
        }
        console.log('returning data, no alternation', d);
        console.groupEnd();
        return d;
      })
      .flat();
  };

  const handleNotSimpleArray = (data, allLabels) => {
    console.groupCollapsed('handleNotSimpleArray');
    console.log('data', data);
    console.log('allLabels', allLabels);
    console.groupEnd();
    return data
      .map(d => {
        const { key } = d;

        const foundItems = allLabels.filter(
          lab => typeof lab !== 'string' && key === lab.label,
        );
        console.groupCollapsed('handleNotSimpleArray foundItems');
        console.log('foundItems', foundItems);

        if (foundItems && foundItems.length) {
          const { label, labelRU } = foundItems[0];
          const returningObj = {
            ...d,
            key: labelRU || label,
          };
          console.log('initial', d);
          console.log('returningObj', returningObj);
          console.groupEnd();
          return returningObj;
        }

        console.log('returning data, no alternation', d);
        console.groupEnd();
        return {
          ...d,
        };
      })
      .flat();
  };

  const getCorrectData = (data, labelsArrayMetrics, labelsArrayColumns) => {
    const allLabels = [...labelsArrayMetrics, ...labelsArrayColumns];
    const arrIsSimple = detectDataType(data);
    let alteredData = [];

    if (arrIsSimple) {
      alteredData = handleSimpleArray(data, allLabels);
    } else {
      alteredData = handleNotSimpleArray(data, allLabels);
    }

    return alteredData;
  };

  const alteredChart = {
    ...chart,
    queriesResponse: chart.queriesResponse
      ? chart.queriesResponse.map(qResp => ({
          ...qResp,
          colnames: getCorrectLabelsArray(
            alteredDashboardLanguage,
            qResp.colnames || [],
            neededLabelArrayFromMetrics,
            neededLabelArrayFromColumns,
          ),
          data:
            qResp.data && qResp.data.length
              ? getCorrectData(
                  qResp.data || [],
                  neededLabelArrayFromMetrics,
                  neededLabelArrayFromColumns,
                )
              : [],
        }))
      : null,
  };

  if (alteredChart && alteredChart.chartStatus === 'success') {
    console.groupCollapsed('Altered Chart');
    console.log('chart', chart);
    console.log('alteredChart', alteredChart);
    console.groupEnd();
  }
  // note: this method caches filters if possible to prevent render cascades
  const formData = getFormDataWithExtraFilters({
    layout: dashboardLayout.present,
    chart: alteredChart,
    // eslint-disable-next-line camelcase
    chartConfiguration: dashboardInfo.metadata?.chart_configuration,
    charts: chartQueries,
    filters: getAppliedFilterValues(id),
    colorScheme,
    colorNamespace,
    sliceId: id,
    nativeFilters,
    dataMask,
    extraControls,
    labelColors,
    sharedLabelColors,
  });

  formData.dashboardId = dashboardInfo.id;

  return {
    chart: alteredChart,
    datasource,
    labelColors,
    sharedLabelColors,
    slice: sliceEntities.slices[id],
    timeout: dashboardInfo.common.conf.SUPERSET_WEBSERVER_TIMEOUT,
    filters: getActiveFilters() || EMPTY_OBJECT,
    formData,
    editMode: dashboardState.editMode,
    isExpanded: !!dashboardState.expandedSlices[id],
    supersetCanExplore: !!dashboardInfo.superset_can_explore,
    supersetCanShare: !!dashboardInfo.superset_can_share,
    supersetCanCSV: !!dashboardInfo.superset_can_csv,
    sliceCanEdit: !!dashboardInfo.slice_can_edit,
    ownState: dataMask[id]?.ownState,
    filterState: dataMask[id]?.filterState,
    maxRows: common.conf.SQL_MAX_ROW,
    setControlValue,
    filterboxMigrationState: dashboardState.filterboxMigrationState,
    datasetsStatus,
    dashboardLanguage: alteredDashboardLanguage,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      updateComponents,
      addSuccessToast,
      addDangerToast,
      toggleExpandSlice,
      changeFilter,
      setFocusedFilterField,
      unsetFocusedFilterField,
      refreshChart,
      logEvent,
    },
    dispatch,
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Chart);
