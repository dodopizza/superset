import { Dashboard } from '../../../dashboard/types';

export const getLocalisedTitle = <
  T extends Pick<Dashboard, 'dashboard_title' | 'dashboard_title_RU'>,
>(
  dashboard: T,
  locale: string,
): string => {
  const localisedTitle = `dashboard_title${locale === 'en' ? '' : '_RU'}` as
    | 'dashboard_title'
    | 'dashboard_title_RU';
  return (
    dashboard[localisedTitle] ||
    dashboard.dashboard_title ||
    dashboard.dashboard_title_RU ||
    ''
  );
};
