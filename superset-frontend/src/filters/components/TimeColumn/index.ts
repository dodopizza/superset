// DODO was here
import { Behavior, ChartMetadata, ChartPlugin, t } from '@superset-ui/core';
import buildQuery from './buildQuery';
import controlPanel from './controlPanel';
import transformProps from './transformProps';
import thumbnail from './images/thumbnail.png';

const isStandalone = process.env.type === undefined; // DODO added

export default class FilterTimeColumnPlugin extends ChartPlugin {
  constructor() {
    const metadata = new ChartMetadata({
      name: t('Time column'),
      description: t('Time column filter plugin'),
      behaviors: [Behavior.InteractiveChart, Behavior.NativeFilter],
      tags: [t('Experimental')],
      thumbnail,
    });

    super({
      buildQuery,
      controlPanel,
      loadChart: () =>
        isStandalone
          ? import('./TimeColumnFilterPlugin')
          : import(/* webpackPreload: true */ './TimeColumnFilterPlugin'),
      metadata,
      transformProps,
    });
  }
}
