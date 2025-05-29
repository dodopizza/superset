// DODO was here
import { Behavior, ChartMetadata, ChartPlugin, t } from '@superset-ui/core';
import buildQuery from './buildQuery';
import controlPanel from './controlPanel';
import transformProps from './transformProps';
import thumbnail from './images/thumbnail.png';

const isStandalone = process.env.type === undefined; // DODO added

export default class FilterSelectPlugin extends ChartPlugin {
  constructor() {
    const metadata = new ChartMetadata({
      name: t('Select filter'),
      description: t('Select filter plugin using AntD'),
      behaviors: [Behavior.InteractiveChart, Behavior.NativeFilter],
      enableNoResults: false,
      tags: [t('Experimental')],
      thumbnail,
    });

    super({
      buildQuery,
      controlPanel,
      loadChart: () =>
        isStandalone
          ? import('./SelectFilterPlugin')
          : import(/* webpackPreload: true */ './SelectFilterPlugin'),
      metadata,
      transformProps,
    });
  }
}
