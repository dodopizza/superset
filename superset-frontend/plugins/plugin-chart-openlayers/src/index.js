import { t, ChartMetadata, ChartPlugin } from '@superset-ui/core';
import thumbnail from './images/thumbnail.png';
import example1 from './images/MapBox.jpg';
import example2 from './images/MapBox2.jpg';
import controlPanel from './controlPanel';

const metadata = new ChartMetadata({
  category: t('Map'),
  credits: ['https://openlayers.org/'],
  description: '',
  exampleGallery: [
    { url: example1, description: t('Light mode') },
    { url: example2, description: t('Dark mode') },
  ],
  name: t('OpenLayers'),
  tags: [
    t('Business'),
    t('Intensity'),
    t('Legacy'),
    t('Density'),
    t('Scatter'),
    t('Transformable'),
  ],
  thumbnail,
  useLegacyApi: true,
});

export default class OpenLayersChartPlugin extends ChartPlugin {
  constructor() {
    super({
      loadChart: () => import('./OpenLayers'),
      loadTransformProps: () => import('./transformProps'),
      metadata,
      controlPanel,
    });
  }
}
