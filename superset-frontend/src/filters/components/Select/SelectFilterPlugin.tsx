/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
/* eslint-disable no-param-reassign */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AppSection,
  DataMask,
  ensureIsArray,
  ExtraFormData,
  finestTemporalGrainFormatter,
  GenericDataType,
  getColumnLabel,
  JsonObject,
  t,
  tn,
} from '@superset-ui/core';
import { LabeledValue as AntdLabeledValue } from 'antd/lib/select';
import debounce from 'lodash/debounce';
import { useImmerReducer } from 'use-immer';
import { Select } from 'src/components';
import { SLOW_DEBOUNCE } from 'src/constants';
import { hasOption, propertyComparator } from 'src/components/Select/utils';
import { FilterBarOrientation } from 'src/dashboard/types';
import { isEqual, uniqWith } from 'lodash';
import { PluginFilterSelectProps, SelectValue } from './types';
import { FilterPluginStyle, StatusMessage, StyledFormItem } from '../common';
import { getDataRecordFormatter, getSelectExtraFormData } from '../../utils';

type DataMaskAction =
  | { type: 'ownState'; ownState: JsonObject }
  | {
      type: 'filterState';
      __cache: JsonObject;
      extraFormData: ExtraFormData;
      filterState: { value: SelectValue; label?: string };
    };

function reducer(
  draft: DataMask & { __cache?: JsonObject },
  action: DataMaskAction,
) {
  switch (action.type) {
    case 'ownState':
      draft.ownState = {
        ...draft.ownState,
        ...action.ownState,
      };
      return draft;
    case 'filterState':
      draft.extraFormData = action.extraFormData;
      // eslint-disable-next-line no-underscore-dangle
      draft.__cache = action.__cache;
      draft.filterState = { ...draft.filterState, ...action.filterState };
      return draft;
    default:
      return draft;
  }
}

export default function PluginFilterSelect(props: PluginFilterSelectProps) {
  const {
    coltypeMap,
    data,
    filterState,
    formData,
    height,
    isRefreshing,
    width,
    setDataMask,
    setHoveredFilter,
    unsetHoveredFilter,
    setFocusedFilter,
    unsetFocusedFilter,
    setFilterActive,
    appSection,
    showOverflow,
    parentRef,
    inputRef,
    filterBarOrientation,
  } = props;
  const {
    enableEmptyFilter,
    multiSelect,
    showSearch,
    inverseSelection,
    defaultToFirstItem,
    searchAllOptions,
  } = formData;

  const groupby = useMemo(
    () => ensureIsArray(formData.groupby).map(getColumnLabel),
    [formData.groupby],
  );
  // DODO added start 29749076
  const groupbyid = useMemo(
    () => ensureIsArray(formData.groupbyid).map(getColumnLabel),
    [formData.groupbyid],
  );
  // DODO added stop 29749076

  const [col] = groupby;
  const [colid] = formData.vizType === 'filter_select_by_id' ? groupbyid : []; // DODO added 29749076
  const [initialColtypeMap] = useState(coltypeMap);
  const [search, setSearch] = useState('');
  const [dataMask, dispatchDataMask] = useImmerReducer(reducer, {
    extraFormData: {},
    filterState,
  });
  const datatype: GenericDataType = coltypeMap[col];
  const labelFormatter = useMemo(
    () =>
      getDataRecordFormatter({
        timeFormatter: finestTemporalGrainFormatter(data.map(el => el.col)),
      }),
    [data],
  );

  // DODO added start 29749076
  const OptionsKeyByValue = useMemo(() => {
    const map = new Map();

    // DODO added start 29749076
    // make list of value for one label in case same label with different id column
    // console.log(`uniqueOptions data`, data);
    if (formData.vizType === 'filter_select_by_id') {
      const [valueField] = groupbyid;
      const [labelField] = groupby;
      data.forEach(row => {
        const value = row[valueField];
        const label = row[labelField];

        if (!map.has(label)) {
          map.set(label, []);
        }

        map.get(label).push(value);
      });
    }
    // DODO added stop 29749076
    return map;
  }, [data, formData.vizType, groupby, groupbyid]);
  // DODO stop start 29749076

  const updateDataMask = useCallback(
    (values: SelectValue) => {
      const emptyFilter =
        enableEmptyFilter && !inverseSelection && !values?.length;

      const suffix = inverseSelection && values?.length ? t(' (excluded)') : '';

      // DODO added start 29749076
      let valuesToFilter:
        | null
        | undefined
        | (string | number | boolean | null)[] = [];
      if (
        formData.vizType === 'filter_select_by_id' &&
        values &&
        values?.length > 0
      ) {
        values.forEach(value => {
          if (OptionsKeyByValue.has(value)) {
            valuesToFilter?.push(...OptionsKeyByValue.get(value));
          }
        });
      } else {
        valuesToFilter = values;
      }
      // DODO added stop 29749076

      // debugger;
      dispatchDataMask({
        type: 'filterState',
        __cache: filterState,
        extraFormData: getSelectExtraFormData(
          // col, // DODO commented 29749076
          colid ?? col, // DODO added 29749076
          // values, // DODO commented 29749076
          valuesToFilter, // DODO changed 29749076
          emptyFilter,
          inverseSelection,
        ),
        filterState: {
          ...filterState,
          label: values?.length
            ? `${(values || [])
                .map(value => labelFormatter(value, datatype))
                .join(', ')}${suffix}`
            : undefined,
          value:
            appSection === AppSection.FILTER_CONFIG_MODAL && defaultToFirstItem
              ? undefined
              : values,
        },
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      appSection,
      col,
      datatype,
      defaultToFirstItem,
      dispatchDataMask,
      enableEmptyFilter,
      inverseSelection,
      JSON.stringify(filterState),
      labelFormatter,
    ],
  );

  const isDisabled =
    appSection === AppSection.FILTER_CONFIG_MODAL && defaultToFirstItem;

  const onSearch = useMemo(
    () =>
      debounce((search: string) => {
        setSearch(search);
        if (searchAllOptions) {
          dispatchDataMask({
            type: 'ownState',
            ownState: {
              coltypeMap: initialColtypeMap,
              search,
            },
          });
        }
      }, SLOW_DEBOUNCE),
    [dispatchDataMask, initialColtypeMap, searchAllOptions],
  );

  const handleBlur = useCallback(() => {
    unsetFocusedFilter();
  }, [unsetFocusedFilter]);

  const handleChange = useCallback(
    (value?: SelectValue | number | string) => {
      const values = value === null ? [null] : ensureIsArray(value);

      if (values.length === 0) {
        updateDataMask(null);
      } else {
        updateDataMask(values);
      }
    },
    [updateDataMask],
  );

  const placeholderText =
    data.length === 0
      ? t('No data')
      : tn('%s option', '%s options', data.length, data.length);

  const formItemExtra = useMemo(() => {
    if (filterState.validateMessage) {
      return (
        <StatusMessage status={filterState.validateStatus}>
          {filterState.validateMessage}
        </StatusMessage>
      );
    }
    return undefined;
  }, [filterState.validateMessage, filterState.validateStatus]);

  const uniqueOptions = useMemo(() => {
    let allOptions = [...data];
    // DODO added start 29749076
    if (formData.vizType === 'filter_select_by_id') {
      const [labelField] = groupby;
      allOptions = [
        ...data.map(el => ({
          [labelField]: el[labelField],
        })),
      ];
    }
    // DODO added stop 29749076

    return uniqWith(allOptions, isEqual).map(row => {
      const [value] = groupby.map(col => row[col]);

      return {
        label: labelFormatter(value, datatype), // DODO commented 29749076
        value,
        isNewOption: false,
      };
    });
  }, [data, datatype, formData.vizType, groupby, groupbyid, labelFormatter]);

  const options = useMemo(() => {
    if (search && !multiSelect && !hasOption(search, uniqueOptions, true)) {
      uniqueOptions.unshift({
        label: search,
        value: search,
        isNewOption: true,
      });
    }
    return uniqueOptions;
  }, [multiSelect, search, uniqueOptions]);

  const sortComparator = useCallback(
    (a: AntdLabeledValue, b: AntdLabeledValue) => {
      const labelComparator = propertyComparator('label');
      if (formData.sortAscending) {
        return labelComparator(a, b);
      }
      return labelComparator(b, a);
    },
    [formData.sortAscending],
  );

  useEffect(() => {
    if (defaultToFirstItem && filterState.value === undefined) {
      // initialize to first value if set to default to first item
      const firstItem: SelectValue = data[0]
        ? (groupby.map(col => data[0][col]) as string[])
        : null;
      // firstItem[0] !== undefined for a case when groupby changed but new data still not fetched
      // TODO: still need repopulate default value in config modal when column changed
      if (firstItem?.[0] !== undefined) {
        updateDataMask(firstItem);
      }
    } else if (isDisabled) {
      // empty selection if filter is disabled
      updateDataMask(null);
    } else {
      // reset data mask based on filter state
      updateDataMask(filterState.value);
    }
  }, [
    col,
    isDisabled,
    defaultToFirstItem,
    enableEmptyFilter,
    inverseSelection,
    updateDataMask,
    data,
    groupby,
    JSON.stringify(filterState.value),
  ]);

  useEffect(() => {
    setDataMask(dataMask);
  }, [JSON.stringify(dataMask)]);

  return (
    <FilterPluginStyle height={height} width={width}>
      <StyledFormItem
        validateStatus={filterState.validateStatus}
        extra={formItemExtra}
      >
        <Select
          allowClear
          allowNewOptions
          allowSelectAll={!searchAllOptions}
          // @ts-ignore
          value={filterState.value || []}
          disabled={isDisabled}
          getPopupContainer={
            showOverflow
              ? () => (parentRef?.current as HTMLElement) || document.body
              : (trigger: HTMLElement) =>
                  (trigger?.parentNode as HTMLElement) || document.body
          }
          showSearch={showSearch}
          mode={multiSelect ? 'multiple' : 'single'}
          placeholder={placeholderText}
          onSearch={onSearch}
          onBlur={handleBlur}
          onFocus={setFocusedFilter}
          onMouseEnter={setHoveredFilter}
          onMouseLeave={unsetHoveredFilter}
          // @ts-ignore
          onChange={handleChange}
          ref={inputRef}
          loading={isRefreshing}
          oneLine={filterBarOrientation === FilterBarOrientation.HORIZONTAL}
          invertSelection={inverseSelection}
          options={options}
          sortComparator={sortComparator}
          onDropdownVisibleChange={setFilterActive}
        />
      </StyledFormItem>
    </FilterPluginStyle>
  );
}
