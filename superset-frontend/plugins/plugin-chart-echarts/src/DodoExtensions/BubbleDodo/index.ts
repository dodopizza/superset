import { ChartMetadata, ChartPlugin, t } from '@superset-ui/core';
import controlPanel from './controlPanel';
import thumbnail from './images/thumbnail.png';
import transformProps from './transformProps';
import buildQuery from './buildQuery';

const metadata = new ChartMetadata({
  category: t('Correlation'),
  credits: ['https://echarts.apache.org'],
  description: t(
    'Visualizes a metric across three dimensions of data in a single chart (X axis, Y axis, and bubble size). Bubbles from the same group can be showcased using bubble color.',
  ),
  // exampleGallery: [{ url: example }],
  name: t('EChart Bubble Chart'),
  tags: [
    // t('Multi-Dimensions'),
    t('Scatter'),
    t('Popular'),
    t('ECharts'),
    t('DODOIS_friendly'),
  ],
  thumbnail,
  // useLegacyApi: true,
});

export default class EChartBubbleChartDodo extends ChartPlugin {
  constructor() {
    super({
      loadChart: () => import('./BubbleDodo'),
      metadata,
      buildQuery,
      transformProps,
      controlPanel,
    });
  }
}
