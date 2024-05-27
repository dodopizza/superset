import { BusinessId, RouteConfig } from '../types/global';

export const DODOPIZA_DEFAULT_DASHBOARD_ID = 209;
export const DRINKIT_DEFAULT_DASHBOARD_ID = 507;
export const DONER_DEFAULT_DASHBOARD_ID = undefined; // todo

type Params = {
  businessId: BusinessId;
  routes: RouteConfig[];
};

export const getDefaultDashboard = ({ businessId, routes }: Params) => {
  const firstDashboard =
    routes.length > 0 ? routes.at(0)?.idOrSlug ?? undefined : undefined;

  switch (businessId) {
    case 'dodopizza':
      if (
        routes.find(item => item.idOrSlug === DODOPIZA_DEFAULT_DASHBOARD_ID)
      ) {
        return DODOPIZA_DEFAULT_DASHBOARD_ID;
      }
      break;
    case 'drinkit':
      if (routes.find(item => item.idOrSlug === DRINKIT_DEFAULT_DASHBOARD_ID)) {
        return DRINKIT_DEFAULT_DASHBOARD_ID;
      }
      break;
    case 'doner42':
      if (routes.find(item => item.idOrSlug === DONER_DEFAULT_DASHBOARD_ID)) {
        return DONER_DEFAULT_DASHBOARD_ID;
      }
      break;
    default:
      return undefined;
  }

  return firstDashboard;
};
