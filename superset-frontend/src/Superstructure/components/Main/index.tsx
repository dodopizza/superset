import { Redirect, Route, Switch } from 'react-router-dom';
import { FeatureFlag } from '@superset-ui/core';
import DashboardApp from '../App';
import { MainComponentProps } from '../../types/global';

export default function Main({
  routes,
  store,
  basename,
  startDashboardId = 0,
}: MainComponentProps) {
  window.featureFlags = {
    ...window.featureFlags,
    [FeatureFlag.ChartPluginsExperimental]: true,
    [FeatureFlag.DynamicPlugins]: false,
    [FeatureFlag.GlobalAsyncQueries]: true,
    [FeatureFlag.DashboardNativeFiltersSet]: true,
    [FeatureFlag.TaggingSystem]: false,
    [FeatureFlag.DashboardCrossFilters]: true,
  };
  window.htmlSanitization = false; // for handlebars viz

  return routes ? (
    <>
      <Switch>
        {routes.map((mappedRoute, index) => (
          <Route
            key={`${mappedRoute.idOrSlug}-${index}`}
            path={`${basename}${mappedRoute.idOrSlug}`}
          >
            <DashboardApp
              store={store}
              dashboardIdOrSlug={mappedRoute.idOrSlug}
            />
          </Route>
        ))}
        <Redirect to={`${basename}${startDashboardId}`} />
      </Switch>
    </>
  ) : (
    <div>There is no navigation defined</div>
  );
}
