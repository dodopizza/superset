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
  const datasource =
    (chart && chart.form_data && datasources[chart.form_data.datasource]) ||
    PLACEHOLDER_DATASOURCE;
  const { colorScheme, colorNamespace, datasetsStatus } = dashboardState;
  const labelColors = dashboardInfo?.metadata?.label_colors || {};
  const sharedLabelColors = dashboardInfo?.metadata?.shared_label_colors || {};
  // note: this method caches filters if possible to prevent render cascades
  const formData = getFormDataWithExtraFilters({
    layout: dashboardLayout.present,
    chart,
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

  return {
    chart,
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
