// DODO was here

import prettyMsFormatter from 'pretty-ms';
import NumberFormatter from '../NumberFormatter';
import { NumberFormatFunction } from '../types'; // DODO added 44136746

export default function createDurationFormatter(
  config: {
    description?: string;
    id?: string;
    label?: string;
    multiplier?: number;
    formatFunc?: NumberFormatFunction; // DODO added 44136746
  } & prettyMsFormatter.Options = {},
) {
  const {
    description,
    id,
    label,
    multiplier = 1,
    formatFunc, // DODO added 44136746
    ...prettyMsOptions
  } = config;

  return new NumberFormatter({
    description,
    // formatFunc: value => prettyMsFormatter(value * multiplier, prettyMsOptions),
    // DODO changed 44136746
    formatFunc:
      formatFunc ??
      (value => prettyMsFormatter(value * multiplier, prettyMsOptions)),
    id: id ?? 'duration_format',
    label: label ?? `Duration formatter`,
  });
}
