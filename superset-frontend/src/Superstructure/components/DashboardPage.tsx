import React, { FC, useRef, useEffect, useState, Suspense } from 'react';
import {
  CategoricalColorNamespace,
  FeatureFlag,
  getSharedLabelColor,
  isFeatureEnabled,
  t,
  useTheme,
} from '@superset-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { Global } from '@emotion/react';
import { useToasts } from 'src/components/MessageToasts/withToasts';
import Loading from 'src/components/Loading';
import FilterBoxMigrationModal from 'src/dashboard/components/FilterBoxMigrationModal';
import {
  useDashboard,
  useDashboardCharts,
  useDashboardDatasets,
} from 'src/Superstructure/hooks/apiResources';
import { hydrateDashboard } from 'src/dashboard/actions/hydrate';
import { setDatasources } from 'src/dashboard/actions/datasources';
import injectCustomCss from 'src/dashboard/util/injectCustomCss';
import setupPlugins from 'src/setup/setupPlugins';
import { UserWithPermissionsAndRoles } from 'src/types/bootstrapTypes';
import { addWarningToast } from 'src/components/MessageToasts/actions';

import {
  getItem,
  setItem,
  LocalStorageKeys,
} from 'src/utils/localStorageHelpers';
import {
  FILTER_BOX_MIGRATION_STATES,
  FILTER_BOX_TRANSITION_SNOOZE_DURATION,
} from 'src/explore/constants';
import { URL_PARAMS } from 'src/constants';
import { getUrlParam } from 'src/utils/urlUtils';
import { canUserEditDashboard } from 'src/dashboard/util/findPermission';
import { getFilterSets } from 'src/dashboard/actions/nativeFilters';
import { setDatasetsStatus } from 'src/dashboard/actions/dashboardState';
import {
  getFilterValue,
  getPermalinkValue,
} from 'src/dashboard/components/nativeFilters/FilterBar/keyValue';
import { filterCardPopoverStyle } from 'src/dashboard/styles';

import { bootstrapData } from 'src/preamble';

export const MigrationContext = React.createContext(
  FILTER_BOX_MIGRATION_STATES.NOOP,
);

setupPlugins();
const DashboardContainer = React.lazy(
  () =>
    import(
      /* webpackChunkName: "DashboardContainer" */
      /* webpackPreload: true */
      'src/Superstructure/components/DashboardContainer'
    ),
  // 'src/dashboard/containers/Dashboard'
);

const originalDocumentTitle = document.title;

type PageProps = {
  idOrSlug: string;
};

// TODO: duplicated logic from the store
const getUserLocaleForPlugin = () => {
  function getPageLanguage() {
    if (!document) {
      return null;
    }
    const select = document.querySelector('#changeLanguage select');
    // @ts-ignore
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

export const DashboardPage: FC<PageProps> = ({ idOrSlug }: PageProps) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const user = useSelector<any, UserWithPermissionsAndRoles>(
    state => state.user,
  );
  const { addDangerToast } = useToasts();

  let finalDashboardLanguage = 'en';

  if (process.env.type === undefined) {
    finalDashboardLanguage =
      (bootstrapData && bootstrapData.common && bootstrapData.common.locale) ||
      'en';
  } else {
    finalDashboardLanguage = getUserLocaleForPlugin();
  }

  const { result: dashboard, error: dashboardApiError } =
    useDashboard(idOrSlug);
  const { result: charts, error: chartsApiError } = useDashboardCharts(
    idOrSlug,
    finalDashboardLanguage,
  );
  const {
    result: datasets,
    error: datasetsApiError,
    status,
  } = useDashboardDatasets(idOrSlug, finalDashboardLanguage);
  const isDashboardHydrated = useRef(false);

  const error = dashboardApiError || chartsApiError;
  const readyToRender = Boolean(dashboard && charts);
  const migrationStateParam = getUrlParam(
    URL_PARAMS.migrationState,
  ) as FILTER_BOX_MIGRATION_STATES;
  const isMigrationEnabled = isFeatureEnabled(
    FeatureFlag.ENABLE_FILTER_BOX_MIGRATION,
  );
  const { dashboard_title, css, metadata, id = 0 } = dashboard || {};
  const [filterboxMigrationState, setFilterboxMigrationState] = useState(
    migrationStateParam || FILTER_BOX_MIGRATION_STATES.NOOP,
  );

  useEffect(() => {
    dispatch(setDatasetsStatus(status));
  }, [dispatch, status]);

  useEffect(() => {
    // should convert filter_box to filter component?
    const hasFilterBox =
      charts &&
      charts.some(chart => chart.form_data?.viz_type === 'filter_box');
    const canEdit = dashboard && canUserEditDashboard(dashboard, user);

    if (canEdit) {
      // can user edit dashboard?
      if (metadata?.native_filter_configuration) {
        setFilterboxMigrationState(
          isMigrationEnabled
            ? FILTER_BOX_MIGRATION_STATES.CONVERTED
            : FILTER_BOX_MIGRATION_STATES.NOOP,
        );
        return;
      }

      // set filterbox migration state if has filter_box in the dash:
      if (hasFilterBox) {
        if (isMigrationEnabled) {
          // has url param?
          if (
            migrationStateParam &&
            Object.values(FILTER_BOX_MIGRATION_STATES).includes(
              migrationStateParam,
            )
          ) {
            setFilterboxMigrationState(migrationStateParam);
            return;
          }

          // has cookie?
          const snoozeDash = getItem(
            LocalStorageKeys.filter_box_transition_snoozed_at,
            {},
          );
          if (
            Date.now() - (snoozeDash[id] || 0) <
            FILTER_BOX_TRANSITION_SNOOZE_DURATION
          ) {
            setFilterboxMigrationState(FILTER_BOX_MIGRATION_STATES.SNOOZED);
            return;
          }

          setFilterboxMigrationState(FILTER_BOX_MIGRATION_STATES.UNDECIDED);
        } else if (isFeatureEnabled(FeatureFlag.DASHBOARD_NATIVE_FILTERS)) {
          dispatch(
            addWarningToast(
              t(
                'filter_box will be deprecated ' +
                  'in a future version of Superset. ' +
                  'Please replace filter_box by dashboard filter components.',
              ),
            ),
          );
        }
      }
    }
  }, [readyToRender]);

  useEffect(() => {
    // eslint-disable-next-line consistent-return
    async function getDataMaskApplied() {
      const permalinkKey = getUrlParam(URL_PARAMS.permalinkKey);
      const nativeFilterKeyValue = getUrlParam(URL_PARAMS.nativeFiltersKey);
      let dataMaskFromUrl = nativeFilterKeyValue || {};

      const isOldRison = getUrlParam(URL_PARAMS.nativeFilters);

      if (permalinkKey) {
        const permalinkValue = await getPermalinkValue(permalinkKey);
        if (permalinkValue) {
          dataMaskFromUrl = permalinkValue.state.filterState;
        }
      } else if (nativeFilterKeyValue) {
        dataMaskFromUrl = await getFilterValue(id, nativeFilterKeyValue);
      }
      if (isOldRison) {
        dataMaskFromUrl = isOldRison;
      }

      if (readyToRender) {
        if (!isDashboardHydrated.current) {
          isDashboardHydrated.current = true;
          if (isFeatureEnabled(FeatureFlag.DASHBOARD_NATIVE_FILTERS_SET)) {
            // only initialize filterset once
            dispatch(getFilterSets(id));
          }
        }
        dispatch(
          hydrateDashboard(
            dashboard,
            charts,
            filterboxMigrationState,
            dataMaskFromUrl,
          ),
        );
      }
      return null;
    }
    if (id) getDataMaskApplied();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readyToRender, filterboxMigrationState]);

  useEffect(() => {
    if (dashboard_title) {
      document.title = dashboard_title;
    }
    return () => {
      document.title = originalDocumentTitle;
    };
  }, [dashboard_title]);

  useEffect(() => {
    if (typeof css === 'string') {
      // returning will clean up custom css
      // when dashboard unmounts or changes
      return injectCustomCss(css);
    }
    return () => {};
  }, [css]);

  useEffect(
    () => () => {
      // clean up label color
      const categoricalNamespace = CategoricalColorNamespace.getNamespace(
        metadata?.color_namespace,
      );
      categoricalNamespace.resetColors();
      getSharedLabelColor().clear();
    },
    [metadata?.color_namespace],
  );

  useEffect(() => {
    if (datasetsApiError) {
      addDangerToast(
        t('Error loading chart datasources. Filters may not work correctly.'),
      );
    } else {
      dispatch(setDatasources(datasets));
    }
  }, [addDangerToast, datasets, datasetsApiError, dispatch]);

  if (error) throw error; // caught in error boundary
  if (!readyToRender) return <Loading />;

  return (
    <Suspense fallback={<Loading />}>
      <Global styles={filterCardPopoverStyle(theme)} />
      <FilterBoxMigrationModal
        show={filterboxMigrationState === FILTER_BOX_MIGRATION_STATES.UNDECIDED}
        hideFooter={!isMigrationEnabled}
        onHide={() => {
          // cancel button: only snooze this visit
          setFilterboxMigrationState(FILTER_BOX_MIGRATION_STATES.SNOOZED);
        }}
        onClickReview={() => {
          setFilterboxMigrationState(FILTER_BOX_MIGRATION_STATES.REVIEWING);
        }}
        onClickSnooze={() => {
          const snoozedDash = getItem(
            LocalStorageKeys.filter_box_transition_snoozed_at,
            {},
          );
          setItem(LocalStorageKeys.filter_box_transition_snoozed_at, {
            ...snoozedDash,
            [id]: Date.now(),
          });
          setFilterboxMigrationState(FILTER_BOX_MIGRATION_STATES.SNOOZED);
        }}
      />

      <MigrationContext.Provider value={filterboxMigrationState}>
        <DashboardContainer />
      </MigrationContext.Provider>
    </Suspense>
  );
};

export default DashboardPage;