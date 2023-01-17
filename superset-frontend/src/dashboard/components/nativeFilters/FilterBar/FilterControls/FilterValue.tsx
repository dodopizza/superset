// DODO-changed
import React, { useEffect, useRef, useState } from 'react';
import {
  QueryFormData,
  SuperChart,
  DataMask,
  t,
  styled,
  Behavior,
  ChartDataResponseResult,
  JsonObject,
  getChartMetadataRegistry,
} from '@superset-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { areObjectsEqual } from 'src/reduxUtils';
import { getChartDataRequest } from 'src/chart/chartAction';
import { getChartDataRequest as getChartDataRequestPlugin } from 'src/Superstructure/chart/chartAction';
import Loading from 'src/components/Loading';
import BasicErrorAlert from 'src/components/ErrorMessage/BasicErrorAlert';
import { FeatureFlag, isFeatureEnabled } from 'src/featureFlags';
import { waitForAsyncData } from 'src/middleware/asyncEvent';
import { ClientErrorObject } from 'src/utils/getClientErrorObject';
import { RootState } from 'src/dashboard/types';
import { dispatchFocusAction } from './utils';
import { FilterProps } from './types';
import { getFormData } from '../../utils';
import { useCascadingFilters } from './state';
import { checkIsMissingRequiredValue } from '../utils';

const HEIGHT = 32;

// Overrides superset-ui height with min-height
const StyledDiv = styled.div`
  & > div {
    height: auto !important;
    min-height: ${HEIGHT}px;
  }
`;

const FilterValue: React.FC<FilterProps> = ({
  dataMaskSelected,
  filter,
  directPathToChild,
  onFilterSelectionChange,
  inView = true,
}) => {
  const { id, targets, filterType, adhoc_filters, time_range } = filter;
  const metadata = getChartMetadataRegistry().get(filterType);
  const cascadingFilters = useCascadingFilters(id, dataMaskSelected);
  const isDashboardRefreshing = useSelector<RootState, boolean>(
    state => state.dashboardState.isRefreshing,
  );
  const dashboardId = useSelector<RootState, number | null>(
    state => {
      //@ts-ignore
      const dashbId = state.dashboardInfo.id || null;
      console.log('dashbId Filter value', dashbId)
      if (dashbId) return dashbId
      return null
    },
  );
  console.log('Filter value dashboardIdXX:', dashboardId)

  const [state, setState] = useState<ChartDataResponseResult[]>([]);
  const [error, setError] = useState<string>('');
  const [formData, setFormData] = useState<Partial<QueryFormData>>({
    inView: false,
  });
  const [ownState, setOwnState] = useState<JsonObject>({});
  const [inViewFirstTime, setInViewFirstTime] = useState(inView);
  const inputRef = useRef<HTMLInputElement>(null);
  const [target] = targets;
  const {
    datasetId,
    column = {},
  }: Partial<{ datasetId: number; column: { name?: string } }> = target;
  const { name: groupby } = column;
  const hasDataSource = !!datasetId;
  const [isLoading, setIsLoading] = useState<boolean>(hasDataSource);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!inViewFirstTime && inView) {
      setInViewFirstTime(true);
    }
  }, [inView, inViewFirstTime, setInViewFirstTime]);

  useEffect(() => {
    if (!inViewFirstTime) {
      return;
    }
    const newFormData = getFormData({
      ...filter,
      datasetId,
      cascadingFilters,
      groupby,
      inputRef,
      adhoc_filters,
      time_range,
    });
    const filterOwnState = filter.dataMask?.ownState || {};

    if (
      !isRefreshing &&
      (!areObjectsEqual(formData, newFormData) ||
        !areObjectsEqual(ownState, filterOwnState) ||
        isDashboardRefreshing)
    ) {
      setFormData(newFormData);
      setOwnState(filterOwnState);
      if (!hasDataSource) {
        return;
      }
      setIsRefreshing(true);

      if (process.env.business) {
        getChartDataRequestPlugin({
          formData: newFormData,
          force: false,
          // requestParams: { dashboardId: 0 },
          ownState: filterOwnState,
        })
          .then(({ result }) => {
            setState(result);
            setError('');
            setIsRefreshing(false);
            setIsLoading(false);
          })
          .catch((error: Response) => {
            setError(error.statusText);
            setIsRefreshing(false);
            setIsLoading(false);
          });
      } else {
        getChartDataRequest({
          formData: newFormData,
          force: false,
          // requestParams: { dashboardId: 0 },
          ownState: filterOwnState,
        }).then(({ response, json }) => {
          console.log('getChartDataRequest FilterValue')
          console.log('GLOBAL_ASYNC_QUERIES', isFeatureEnabled(FeatureFlag.GLOBAL_ASYNC_QUERIES))
          console.log('json', json)
          console.log('response', response)
          console.log('____')
          if (isFeatureEnabled(FeatureFlag.GLOBAL_ASYNC_QUERIES)) {
            // deal with getChartDataRequest transforming the response data
            const result = 'result' in json ? json.result[0] : json;

            if (response.status === 200) {
              setIsRefreshing(false);
              setIsLoading(false);
              setState([result]);
            } else if (response.status === 202) {
              waitForAsyncData(result)
                .then((asyncResult: ChartDataResponseResult[]) => {
                  setIsRefreshing(false);
                  setIsLoading(false);
                  setState(asyncResult);
                })
                .catch((error: ClientErrorObject) => {
                  setError(
                    error.message || error.error || t('Check configuration'),
                  );
                  setIsRefreshing(false);
                  setIsLoading(false);
                });
            } else {
              throw new Error(
                `Received unexpected response status (${response.status}) while fetching chart data`,
              );
            }
          } else {
            setState(json.result);
            setError('');
            setIsRefreshing(false);
            setIsLoading(false);
            }
          })
          .catch((error: Response) => {
            setError(error.statusText);
            setIsRefreshing(false);
            setIsLoading(false);
          });
      }
    }
  }, [
    inViewFirstTime,
    cascadingFilters,
    datasetId,
    groupby,
    JSON.stringify(filter),
    hasDataSource,
    isRefreshing,
    isDashboardRefreshing,
    // dashboardId
  ]);

  useEffect(() => {
    if (directPathToChild?.[0] === filter.id) {
      // wait for Cascade Popover to open
      const timeout = setTimeout(() => {
        inputRef?.current?.focus();
      }, 200);
      return () => clearTimeout(timeout);
    }
    return undefined;
  }, [inputRef, directPathToChild, filter.id]);

  const setDataMask = (dataMask: DataMask) =>
    onFilterSelectionChange(filter, dataMask);

  const setFocusedFilter = () => dispatchFocusAction(dispatch, id);
  const unsetFocusedFilter = () => dispatchFocusAction(dispatch);

  if (error) {
    return (
      <BasicErrorAlert
        title={t('Cannot load filter')}
        body={error}
        level="error"
      />
    );
  }
  const isMissingRequiredValue = checkIsMissingRequiredValue(
    filter,
    filter.dataMask?.filterState,
  );
  const filterState = {
    ...filter.dataMask?.filterState,
    validateStatus: isMissingRequiredValue && 'error',
  };

  return (
    <StyledDiv data-test="form-item-value">
      {isLoading ? (
        <Loading position="inline-centered" />
      ) : (
        <SuperChart
          height={HEIGHT}
          width="100%"
          formData={formData}
          // For charts that don't have datasource we need workaround for empty placeholder
          queriesData={hasDataSource ? state : [{ data: [{}] }]}
          chartType={filterType}
          behaviors={[Behavior.NATIVE_FILTER]}
          filterState={filterState}
          ownState={filter.dataMask?.ownState}
          enableNoResults={metadata?.enableNoResults}
          isRefreshing={isRefreshing}
          hooks={{ setDataMask, setFocusedFilter, unsetFocusedFilter }}
        />
      )}
    </StyledDiv>
  );
};

export default FilterValue;
