import { ChartMetadata, ChartPlugin, t } from '@superset-ui/core';
import thumbnail from '../../Bubble/images/thumbnail.png';
import transformProps from '../../Bubble/transformProps';
import buildQuery from '../../Bubble/buildQuery';
import controlPanel from '../../Bubble/controlPanel';
import example1 from '../../Bubble/images/example1.png';
import example2 from '../../Bubble/images/example2.png';
import {
  EchartsBubbleChartProps,
  EchartsBubbleFormData,
} from '../../Bubble/types';

// TODO: Implement cross filtering
export default class EchartsBubbleChartDodoPlugin extends ChartPlugin<
  EchartsBubbleFormData,
  EchartsBubbleChartProps
> {
  constructor() {
    super({
      buildQuery,
      controlPanel,
      loadChart: () => import('../../Bubble/EchartsBubble'),
      metadata: new ChartMetadata({
        category: t('Correlation'),
        credits: ['https://echarts.apache.org'],
        description: t(
          'Visualizes a metric across three dimensions of data in a single chart (X axis, Y axis, and bubble size). Bubbles from the same group can be showcased using bubble color.',
        ),
        exampleGallery: [{ url: example1 }, { url: example2 }],
        name: `${t('Bubble Chart')} Dodo`,
        tags: [
          t('Multi-Dimensions'),
          t('Comparison'),
          t('Scatter'),
          t('Time'),
          t('Trend'),
          t('ECharts'),
          t('Featured'),
        ],
        thumbnail,
        deprecated: true,
      }),
      transformProps,
    });
  }
}
