import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import DashboardApp from '../App';
import { MainComponentProps } from '../../types/global';

const DODOPIZA_DEFAULT_DASHBOARD = 209;
const DRINKIT_DEFAULT_DASHBOARD = 507;
const DONER_DEFAULT_DASHBOARD = 0; // todo

export default function Main({
  navigation,
  store,
  basename,
  businessId,
}: MainComponentProps) {
  window.featureFlags = {
    ...window.featureFlags,
    DYNAMIC_PLUGINS: false,
    GLOBAL_ASYNC_QUERIES: true,
    // DYNAMIC_PLUGINS: true,
    DASHBOARD_NATIVE_FILTERS: true,
    DASHBOARD_CROSS_FILTERS: true,
    DASHBOARD_NATIVE_FILTERS_SET: false,
  };

  const START_DASHBOARD =
    businessId === 'dodopizza'
      ? DODOPIZA_DEFAULT_DASHBOARD
      : businessId === 'drinkit'
      ? DRINKIT_DEFAULT_DASHBOARD
      : DONER_DEFAULT_DASHBOARD;

  return navigation ? (
    <>
      <Switch>
        {navigation.routes.map((mappedRoute, index) => (
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
        <Redirect to={`${basename}${START_DASHBOARD}`} />
      </Switch>
    </>
  ) : (
    <div>There is no navigation defined</div>
  );
}
