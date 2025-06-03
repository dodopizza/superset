// DODO was here
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Filter, t } from '@superset-ui/core';
import { bootstrapData } from 'src/preamble'; // DODO added 44120742
import { Layout, LayoutItem, RootState } from 'src/dashboard/types';
import { useChartIds } from 'src/dashboard/util/charts/useChartIds';
import { CHART_TYPE } from 'src/dashboard/util/componentTypes';
import { DASHBOARD_ROOT_ID } from 'src/dashboard/util/constants';

// DODO added start 44120742
const locale = bootstrapData?.common?.locale || 'en';
const localisedSliceNameOverrideField =
  locale === 'en' ? 'sliceNameOverride' : 'sliceNameOverrideRU';
const localisedSliceNameField = locale === 'en' ? 'sliceName' : 'sliceNameRU';
// DODO added stop 44120742

const extractTabLabel = (tab?: LayoutItem) =>
  tab?.meta?.text || tab?.meta?.defaultText || '';
const extractChartLabel = (chart?: LayoutItem) =>
  chart?.meta?.[localisedSliceNameOverrideField] || // DODO added 44120742
  chart?.meta?.[localisedSliceNameField] || // DODO added 44120742
  chart?.meta?.sliceNameOverride ||
  chart?.meta?.sliceNameOverrideRU || // DODO added 44120742
  chart?.meta?.sliceName ||
  chart?.meta?.sliceNameRU || // DODO added 44120742
  chart?.id ||
  '';

export const useFilterScope = (filter: Filter) => {
  const layout = useSelector<RootState, Layout>(
    state => state.dashboardLayout.present,
  );
  const chartIds = useChartIds();

  return useMemo(() => {
    let topLevelTabs: string[] | undefined;
    const topElementId = layout[DASHBOARD_ROOT_ID].children[0];
    if (topElementId.startsWith('TABS-')) {
      topLevelTabs = layout[topElementId].children;
    }

    // no charts in scope
    if (filter.scope.rootPath.length === 0) {
      return undefined;
    }

    // all charts in scope
    // no charts excluded and no top level tabs
    // OR no charts excluded and every top level tab is in rootPath
    if (
      filter.scope.excluded.length === 0 &&
      (filter.scope.rootPath[0] === DASHBOARD_ROOT_ID ||
        topLevelTabs?.every(topLevelTab =>
          filter.scope.rootPath.includes(topLevelTab),
        ))
    ) {
      return { all: [t('All charts')] };
    }

    // no charts excluded and not every top level tab in scope
    // returns "TAB1, TAB2"
    if (filter.scope.excluded.length === 0 && topLevelTabs) {
      return {
        tabs: filter.scope.rootPath
          .map(tabId => extractTabLabel(layout[tabId]))
          .filter(Boolean),
      };
    }

    const layoutCharts = Object.values(layout).filter(
      layoutElement => layoutElement.type === CHART_TYPE,
    );

    // no top level tabs, charts excluded
    // returns "CHART1, CHART2"
    if (filter.scope.rootPath[0] === DASHBOARD_ROOT_ID) {
      return {
        charts: chartIds
          .filter(chartId => !filter.scope.excluded.includes(chartId))
          .map(chartId => {
            const layoutElement = layoutCharts.find(
              layoutChart => layoutChart.meta.chartId === chartId,
            );
            return extractChartLabel(layoutElement);
          })
          .filter(Boolean),
      };
    }

    // top level tabs, charts excluded
    // returns "TAB1, TAB2, CHART1"
    if (topLevelTabs) {
      // We start assuming that all charts are in scope for all tabs in the root path
      const topLevelTabsInFullScope = [...filter.scope.rootPath];
      const layoutChartElementsInTabsInScope = layoutCharts.filter(
        element =>
          element.parents?.some(parent =>
            topLevelTabsInFullScope.includes(parent),
          ),
      );
      // Exclude the tabs that contain excluded charts
      filter.scope.excluded.forEach(chartId => {
        const excludedIndex = topLevelTabsInFullScope.findIndex(
          tabId =>
            layoutChartElementsInTabsInScope
              .find(chart => chart.meta.chartId === chartId)
              ?.parents?.includes(tabId),
        );
        if (excludedIndex > -1) {
          topLevelTabsInFullScope.splice(excludedIndex, 1);
        }
      });
      // Handle charts that are in scope but belong to excluded tabs.
      const chartsInExcludedTabs = chartIds
        .filter(chartId => !filter.scope.excluded.includes(chartId))
        .reduce((acc: LayoutItem[], chartId) => {
          const layoutChartElementInExcludedTab =
            layoutChartElementsInTabsInScope.find(
              element =>
                element.meta.chartId === chartId &&
                element.parents?.every(
                  parent => !topLevelTabsInFullScope.includes(parent),
                ),
            );
          if (layoutChartElementInExcludedTab) {
            acc.push(layoutChartElementInExcludedTab);
          }
          return acc;
        }, []);
      // Join tab names and chart names
      return {
        tabs: topLevelTabsInFullScope
          .map(tabId => extractTabLabel(layout[tabId]))
          .filter(Boolean),
        charts: chartsInExcludedTabs.map(extractChartLabel).filter(Boolean),
      };
    }

    return undefined;
  }, [chartIds, filter.scope.excluded, filter.scope.rootPath, layout]);
};
