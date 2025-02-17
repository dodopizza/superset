// DODO was here
import rison from 'rison';
import {
  JsonObject,
  NO_TIME_RANGE,
  SupersetClient,
  TimeRangeEndType,
} from '@superset-ui/core';
import { getClientErrorObject } from 'src/utils/getClientErrorObject';
import { useSelector } from 'react-redux';
import { API_HANDLER } from 'src/Superstructure/api';
import {
  CALENDAR_RANGE_VALUES_SET,
  COMMON_RANGE_VALUES_SET,
  customTimeRangeDecode,
  dttmToMoment,
} from '.';
import { FrameType } from '../types';
import { MOMENT_FORMAT_UI_DODO } from '../../../../../DodoExtensions/explore/components/controls/DateFilterControl/utils/constants';

export const SEPARATOR = ' : ';

export const buildTimeRangeString = (since: string, until: string): string =>
  `${since}${SEPARATOR}${until}`;

const formatDateEndpoint = (dttm: string, isStart?: boolean): string =>
  dttm.replace('T00:00:00', '') || (isStart ? '-∞' : '∞');

export const formatTimeRange = (
  timeRange: string,
  timeRangeEndType: TimeRangeEndType,
  columnPlaceholder = 'col',
) => {
  const splitDateRange = timeRange.split(SEPARATOR);
  if (splitDateRange.length === 1) return timeRange;
  const endInclusion = timeRangeEndType === 'included' ? '≤' : '<';
  return `${formatDateEndpoint(
    splitDateRange[0],
    true,
  )} ≤ ${columnPlaceholder} ${endInclusion} ${formatDateEndpoint(
    splitDateRange[1],
  )}`;
};

export const guessFrame = (timeRange: string): FrameType => {
  if (COMMON_RANGE_VALUES_SET.has(timeRange)) {
    return 'Common';
  }
  if (CALENDAR_RANGE_VALUES_SET.has(timeRange)) {
    return 'Calendar';
  }
  if (timeRange === NO_TIME_RANGE) {
    return 'No filter';
  }
  // DODO commented
  // if (customTimeRangeDecode(timeRange).matchedFlag) {
  //   return 'Custom';
  // }
  // DODO added

  const decode = customTimeRangeDecode(timeRange);

  if (decode.matchedFlag) {
    if (
      decode.customRange.untilMode === 'specific' &&
      decode.customRange.untilDatetime
    ) {
      const until = new Date(decode.customRange.untilDatetime);
      if (
        until.getHours() === 23 &&
        until.getMinutes() === 59 &&
        until.getSeconds() === 59
      ) {
        return 'CustomUntilInclude';
      }
    }
    return 'Custom';
  }
  return 'Advanced';
};

export const fetchTimeRange = async (
  timeRange: string,
  timeRangeEndType: TimeRangeEndType,
  columnPlaceholder = 'col',
) => {
  const query = rison.encode_uri(timeRange);
  const endpoint = `/api/v1/time_range/?q=${query}`;
  try {
    if (process.env.type === undefined) {
      const response = await SupersetClient.get({ endpoint });
      // DODO added start #11681438
      const since = dttmToMoment(response?.json?.result?.since).format(
        MOMENT_FORMAT_UI_DODO,
      );
      const until = dttmToMoment(response?.json?.result?.until).format(
        MOMENT_FORMAT_UI_DODO,
      );
      // DODO added stop #11681438
      const timeRangeString = buildTimeRangeString(since, until); // DODO changed #11681438

      return {
        value: formatTimeRange(
          timeRangeString,
          timeRangeEndType,
          columnPlaceholder,
        ),
      };
    }
    const response = await API_HANDLER.SupersetClient({
      method: 'get',
      url: endpoint,
    });
    // DODO added start #11681438 and #35283561
    const since = dttmToMoment(response?.result?.since).format(
      MOMENT_FORMAT_UI_DODO,
    );
    const until = dttmToMoment(response?.result?.until).format(
      MOMENT_FORMAT_UI_DODO,
    );
    // DODO added stop #11681438 and #35283561
    const timeRangeString = buildTimeRangeString(since, until); // DODO changed #11681438

    return {
      value: formatTimeRange(
        timeRangeString,
        timeRangeEndType,
        columnPlaceholder,
      ),
    };
  } catch (response) {
    const clientError = await getClientErrorObject(response);
    return {
      error: clientError.message || clientError.error || response.statusText,
    };
  }
};

export function useDefaultTimeFilter() {
  return (
    useSelector(
      (state: JsonObject) => state?.common?.conf?.DEFAULT_TIME_FILTER,
    ) ?? NO_TIME_RANGE
  );
}
