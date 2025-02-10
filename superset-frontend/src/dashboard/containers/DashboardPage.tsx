// DODO was here
import { createContext, lazy, FC, useEffect, useMemo, useRef } from 'react';
import { Global } from '@emotion/react';
import { useHistory } from 'react-router-dom';
import { t, useTheme } from '@superset-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { bootstrapData } from 'src/preamble'; // DODO added 44120742
import { useToasts } from 'src/components/MessageToasts/withToasts';
import Loading from 'src/components/Loading';
import {
  useDashboard,
  useDashboardCharts,
  useDashboardDatasets,
} from 'src/hooks/apiResources';
import { hydrateDashboard } from 'src/dashboard/actions/hydrate';
import { setDatasources } from 'src/dashboard/actions/datasources';
import injectCustomCss from 'src/dashboard/util/injectCustomCss';

import { LocalStorageKeys, setItem } from 'src/utils/localStorageHelpers';
import { URL_PARAMS } from 'src/constants';
import { getUrlParam } from 'src/utils/urlUtils';
import { setDatasetsStatus } from 'src/dashboard/actions/dashboardState';
import {
  getFilterValue,
  getPermalinkValue,
} from 'src/dashboard/components/nativeFilters/FilterBar/keyValue';
import DashboardContainer from 'src/dashboard/containers/Dashboard';

import { nanoid } from 'nanoid';
import { RootState } from '../types';
import {
  chartContextMenuStyles,
  filterCardPopoverStyle,
  focusStyle,
  headerStyles,
  chartHeaderStyles,
} from '../styles';
import SyncDashboardState, {
  getDashboardContextLocalStorage,
} from '../components/SyncDashboardState';

const locale = bootstrapData?.common?.locale || 'en'; // DODO added 44120742

export const DashboardPageIdContext = createContext('');

const DashboardBuilder = lazy(
  () =>
    import(
      /* webpackChunkName: "DashboardContainer" */
      /* webpackPreload: true */
      'src/dashboard/components/DashboardBuilder/DashboardBuilder'
    ),
);

const originalDocumentTitle = document.title;
const fallBackPageTitle = 'Superset dashboard'; // DODO added 44120742

type PageProps = {
  idOrSlug: string;
};

export const DashboardPage: FC<PageProps> = ({ idOrSlug }: PageProps) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const history = useHistory();
  const dashboardPageId = useMemo(() => nanoid(), []);
  const hasDashboardInfoInitiated = useSelector<RootState, Boolean>(
    ({ dashboardInfo }) =>
      dashboardInfo && Object.keys(dashboardInfo).length > 0,
  );
  const { addDangerToast } = useToasts();
  const { result: dashboard, error: dashboardApiError } =
    useDashboard(idOrSlug);
  const { result: charts, error: chartsApiError } = useDashboardCharts(
    idOrSlug,
    locale, // DODO added 44120742
  );
  const {
    result: datasets,
    error: datasetsApiError,
    status,
    // } = useDashboardDatasets(idOrSlug);
  } = useDashboardDatasets(idOrSlug, locale); // DODO changed 44120742
  const isDashboardHydrated = useRef(false);

  const error = dashboardApiError || chartsApiError;
  const readyToRender = Boolean(dashboard && charts);
  // const { dashboard_title, css, id = 0 } = dashboard || {};
  const { dashboard_title, dashboard_title_RU, css, id = 0 } = dashboard || {}; // DODO changed 44120742

  useEffect(() => {
    // mark tab id as redundant when user closes browser tab - a new id will be
    // generated next time user opens a dashboard and the old one won't be reused
    const handleTabClose = () => {
      const dashboardsContexts = getDashboardContextLocalStorage();
      setItem(LocalStorageKeys.DashboardExploreContext, {
        ...dashboardsContexts,
        [dashboardPageId]: {
          ...dashboardsContexts[dashboardPageId],
          isRedundant: true,
        },
      });
    };
    window.addEventListener('beforeunload', handleTabClose);
    return () => {
      window.removeEventListener('beforeunload', handleTabClose);
    };
  }, [dashboardPageId]);

  useEffect(() => {
    dispatch(setDatasetsStatus(status));
  }, [dispatch, status]);

  useEffect(() => {
    // eslint-disable-next-line consistent-return
    async function getDataMaskApplied() {
      const permalinkKey = getUrlParam(URL_PARAMS.permalinkKey);
      const nativeFilterKeyValue = getUrlParam(URL_PARAMS.nativeFiltersKey);
      const isOldRison = getUrlParam(URL_PARAMS.nativeFilters);

      let dataMask = nativeFilterKeyValue || {};
      // activeTabs is initialized with undefined so that it doesn't override
      // the currently stored value when hydrating
      let activeTabs: string[] | undefined;
      if (permalinkKey) {
        const permalinkValue = await getPermalinkValue(permalinkKey);
        if (permalinkValue) {
          ({ dataMask, activeTabs } = permalinkValue.state);
        }
      } else if (nativeFilterKeyValue) {
        dataMask = await getFilterValue(id, nativeFilterKeyValue);
      }
      if (isOldRison) {
        dataMask = isOldRison;
      }

      if (readyToRender) {
        if (!isDashboardHydrated.current) {
          isDashboardHydrated.current = true;
        }
        dispatch(
          hydrateDashboard({
            history,
            dashboard,
            charts,
            activeTabs,
            dataMask,
          }),
        );
      }
      return null;
    }
    if (id) getDataMaskApplied();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readyToRender]);

  // useEffect(() => {
  //   if (dashboard_title) {
  //     document.title = dashboard_title;
  //   }
  //   return () => {
  //     document.title = originalDocumentTitle;
  //   };
  // }, [dashboard_title]);

  // DODO changed 44120742
  useEffect(() => {
    const localisedTitle =
      locale === 'ru' ? dashboard_title_RU : dashboard_title;

    document.title =
      localisedTitle ||
      dashboard_title ||
      dashboard_title_RU ||
      fallBackPageTitle;

    return () => {
      document.title = originalDocumentTitle;
    };
  }, [dashboard_title, dashboard_title_RU]);

  useEffect(() => {
    if (typeof css === 'string') {
      // returning will clean up custom css
      // when dashboard unmounts or changes
      return injectCustomCss(css);
    }
    return () => {};
  }, [css]);

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
  if (!readyToRender || !hasDashboardInfoInitiated) return <Loading />;

  return (
    <>
      <Global
        styles={[
          filterCardPopoverStyle(theme),
          headerStyles(theme),
          chartContextMenuStyles(theme),
          focusStyle(theme),
          chartHeaderStyles(theme),
        ]}
      />
      <SyncDashboardState dashboardPageId={dashboardPageId} />
      <DashboardPageIdContext.Provider value={dashboardPageId}>
        <DashboardContainer>
          <DashboardBuilder />
        </DashboardContainer>
      </DashboardPageIdContext.Provider>
    </>
  );
};

export default DashboardPage;
