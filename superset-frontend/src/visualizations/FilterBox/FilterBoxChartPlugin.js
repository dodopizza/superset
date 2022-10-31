// DODO-changed
import { t, ChartMetadata, ChartPlugin } from '@superset-ui/core';
import transformProps from './transformProps';
import thumbnail from './images/thumbnail.png';
// DODO todo: -> use different import when standalone and plugin
import controlPanel from 'src/visualizations/FilterBox/controlPanel';
// import controlPanel from 'src/Superstructure/visualizations/FilterBox/controlPanel';

const metadata = new ChartMetadata({
  category: t('Tools'),
  name: t('Filter box'),
  description: t(`Chart component that lets you add a custom filter UI in your dashboard. When added to dashboard, a filter box lets users specify specific values or ranges to filter charts by. The charts that each filter box is applied to can be fine tuned as well in the dashboard view.

    Note that this plugin is being replaced with the new Filters feature that lives in the dashboard view itself. It's easier to use and has more capabilities!`),
  thumbnail,
  useLegacyApi: true,
});

export default class FilterBoxChartPlugin extends ChartPlugin {
  constructor() {
    super({
      controlPanel,
      metadata,
      transformProps,
      loadChart: () => import('./FilterBox.jsx'),
    });
  }
}
