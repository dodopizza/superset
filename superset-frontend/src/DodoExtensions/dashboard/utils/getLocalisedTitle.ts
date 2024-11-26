import { Dashboard } from '../../../dashboard/types';

export const getLocalisedTitle = <T>(dashboard: T, locale: string): string => {
  const localisedTitle = `dashboard_title${locale === 'en' ? '' : '_RU'}` as
    | 'dashboard_title'
    | 'dashboard_title_RU';
  return (
    (dashboard as Dashboard)[localisedTitle] ||
    (dashboard as Dashboard).dashboard_title ||
    (dashboard as Dashboard).dashboard_title_RU ||
    ''
  );
};
