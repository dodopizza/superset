// DODO was here
import { Behavior, ChartMetadata, ChartPlugin, t } from '@superset-ui/core';
import controlPanel from './controlPanel';
import transformProps from './transformProps';
import thumbnail from './images/thumbnail.png';

const isStandalone = process.env.type === undefined; // DODO added

export default class TimeFilterPlugin extends ChartPlugin {
  constructor() {
    const metadata = new ChartMetadata({
      name: t('Time filter'),
      description: t('Custom time filter plugin'),
      behaviors: [Behavior.InteractiveChart, Behavior.NativeFilter],
      thumbnail,
      tags: [t('Experimental')],
      datasourceCount: 0,
    });

    super({
      controlPanel,
      loadChart: () =>
        isStandalone
          ? import('./TimeFilterPlugin')
          : import(/* webpackPreload: true */ './TimeFilterPlugin'),
      metadata,
      transformProps,
    });
  }
}
