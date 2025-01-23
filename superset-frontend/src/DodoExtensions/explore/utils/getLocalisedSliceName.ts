import Chart from 'src/types/Chart';

export const getLocalisedSliceName = (chart: Chart, locale: string): string => {
  const localisedTitle = `slice_name${locale === 'en' ? '' : '_RU'}` as
    | 'slice_name'
    | 'slice_name_RU';
  return chart[localisedTitle] || chart.slice_name || chart.slice_name_RU || '';
};
