import { ChartMetadata, ChartPlugin, t } from '@superset-ui/core';
import controlPanel from './controlPanel';
import thumbnail from './images/thumbnail.png';
import transformProps from './transformProps';
import buildQuery from './buildQuery';

const metadata = new ChartMetadata({
  category: t('Correlation'),
  credits: ['https://echarts.apache.org'],
  description: t(
    'Visualizes a metric across three dimensions of data in a single chart (X axis, Y axis, and bubble size).',
  ),
  name: t('EChart Bubble Chart'),
  tags: [t('Scatter'), t('Popular'), t('ECharts'), t('DODOIS_friendly')],
  thumbnail,
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
