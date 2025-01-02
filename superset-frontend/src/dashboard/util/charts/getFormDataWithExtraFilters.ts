// DODO was here
import {
  DataMaskStateWithId,
  DataRecordFilters,
  JsonObject,
  PartialFilters,
} from '@superset-ui/core';
import { ChartConfiguration, ChartQueryPayload } from 'src/dashboard/types';
import { getExtraFormData } from 'src/dashboard/components/nativeFilters/utils';
import { areObjectsEqual } from 'src/reduxUtils';
import getEffectiveExtraFilters from './getEffectiveExtraFilters';
import { getAllActiveFilters } from '../activeAllDashboardFilters';

// We cache formData objects so that our connected container components don't always trigger
// render cascades. we cannot leverage the reselect library because our cache size is >1
const cachedFiltersByChart = {};
const cachedFormdataByChart = {};

export interface GetFormDataWithExtraFiltersArguments {
  chartConfiguration: ChartConfiguration;
  chart: ChartQueryPayload;
  filters: DataRecordFilters;
  colorScheme?: string;
  colorNamespace?: string;
  sliceId: number;
  dataMask: DataMaskStateWithId;
  nativeFilters: PartialFilters;
  extraControls: Record<string, string | boolean | null>;
  labelColors?: Record<string, string>;
  sharedLabelColors?: Record<string, string>;
  allSliceIds: number[];
}

// this function merge chart's formData with dashboard filters value,
// and generate a new formData which will be used in the new query.
// filters param only contains those applicable to this chart.
export default function getFormDataWithExtraFilters({
  chart,
  filters,
  nativeFilters,
  chartConfiguration,
  colorScheme,
  colorNamespace,
  sliceId,
  dataMask,
  extraControls,
  labelColors,
  sharedLabelColors,
  allSliceIds,
}: GetFormDataWithExtraFiltersArguments) {
  // if dashboard metadata + filters have not changed, use cache if possible
  const cachedFormData = cachedFormdataByChart[sliceId];
  if (
    cachedFiltersByChart[sliceId] === filters &&
    areObjectsEqual(cachedFormData?.color_scheme, colorScheme, {
      ignoreUndefined: true,
    }) &&
    areObjectsEqual(cachedFormData?.color_namespace, colorNamespace, {
      ignoreUndefined: true,
    }) &&
    areObjectsEqual(cachedFormData?.label_colors, labelColors, {
      ignoreUndefined: true,
    }) &&
    areObjectsEqual(cachedFormData?.shared_label_colors, sharedLabelColors, {
      ignoreUndefined: true,
    }) &&
    !!cachedFormData &&
    areObjectsEqual(cachedFormData?.dataMask, dataMask, {
      ignoreUndefined: true,
    }) &&
    areObjectsEqual(cachedFormData?.extraControls, extraControls, {
      ignoreUndefined: true,
    }) &&
    // DODO added start 36195582
    // table_order_by only exists on front in the Table viz, for export
    areObjectsEqual(
      cachedFormData?.table_order_by,
      chart?.form_data?.table_order_by,
      {
        ignoreUndefined: true,
      },
    )
    // DODO added stop 36195582
  ) {
    return cachedFormData;
  }

  let extraData: { extra_form_data?: JsonObject } = {};
  const activeFilters = getAllActiveFilters({
    chartConfiguration,
    dataMask,
    nativeFilters,
    allSliceIds,
  });
  const filterIdsAppliedOnChart = Object.entries(activeFilters)
    .filter(([, { scope }]) => scope.includes(chart.id))
    .map(([filterId]) => filterId);
  if (filterIdsAppliedOnChart.length) {
    extraData = {
      extra_form_data: getExtraFormData(dataMask, filterIdsAppliedOnChart),
    };
  }

  const formData = {
    ...chart.form_data,
    label_colors: labelColors,
    shared_label_colors: sharedLabelColors,
    ...(colorScheme && { color_scheme: colorScheme }),
    extra_filters: getEffectiveExtraFilters(filters),
    ...extraData,
    ...extraControls,
  };

  cachedFiltersByChart[sliceId] = filters;
  cachedFormdataByChart[sliceId] = { ...formData, dataMask, extraControls };

  return formData;
}
