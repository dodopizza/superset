// DODO created 45025582
import {
  getTimeFormatter,
  getTimeFormatterForGranularity,
  smartDateFormatter,
  TimeGranularity,
} from '@superset-ui/core';

export const getDateFormatter = (
  timeFormat: string,
  granularity?: TimeGranularity,
  fallbackFormat?: string | null,
) =>
  timeFormat === smartDateFormatter.id
    ? getTimeFormatterForGranularity(granularity)
    : getTimeFormatter(timeFormat ?? fallbackFormat);
