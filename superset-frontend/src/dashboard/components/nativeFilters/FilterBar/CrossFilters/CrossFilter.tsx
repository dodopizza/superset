// DODO was here

import { useCallback } from 'react';
import { css, useTheme } from '@superset-ui/core';
import { CrossFilterIndicator } from 'src/dashboard/components/nativeFilters/selectors';
import { useDispatch } from 'react-redux';
import { setDirectPathToChild } from 'src/dashboard/actions/dashboardState';
import { FilterBarOrientation } from 'src/dashboard/types';
import { updateDataMask } from 'src/dataMask/actions';
import { bootstrapData } from 'src/preamble'; // DODO added
import CrossFilterTag from './CrossFilterTag';
import CrossFilterTitle from './CrossFilterTitle';

const locale = bootstrapData?.common?.locale || 'en'; // DODO added

// DODO added
const getLocalisedFilterName = (filter: CrossFilterIndicator): string =>
  filter[locale === 'ru' ? 'nameRU' : 'name'] ||
  filter.name ||
  filter.nameRU ||
  '<undefined>';

const CrossFilter = (props: {
  filter: CrossFilterIndicator;
  orientation: FilterBarOrientation;
  last?: boolean;
}) => {
  const { filter, orientation, last } = props;
  const theme = useTheme();
  const dispatch = useDispatch();

  const handleHighlightFilterSource = useCallback(
    (path?: string[]) => {
      if (path) {
        dispatch(setDirectPathToChild(path));
      }
    },
    [dispatch],
  );

  const handleRemoveCrossFilter = (chartId: number) => {
    dispatch(
      updateDataMask(chartId, {
        extraFormData: {
          filters: [],
        },
        filterState: {
          value: null,
          selectedValues: null,
        },
      }),
    );
  };

  return (
    <div
      key={`${filter.name}${filter.emitterId}`}
      css={css`
        ${orientation === FilterBarOrientation.Vertical
          ? `
            display: block;
            margin-bottom: ${theme.gridUnit * 4}px;
          `
          : `
            display: flex;
          `}
      `}
    >
      <CrossFilterTitle
        title={getLocalisedFilterName(filter)} // DODO changed
        orientation={orientation || FilterBarOrientation.Horizontal}
        onHighlightFilterSource={() => handleHighlightFilterSource(filter.path)}
      />
      {(filter.column || filter.value) && (
        <CrossFilterTag
          filter={filter}
          orientation={orientation}
          removeCrossFilter={handleRemoveCrossFilter}
        />
      )}
      {last && (
        <span
          data-test="cross-filters-divider"
          css={css`
            ${orientation === FilterBarOrientation.Horizontal
              ? `
                width: 1px;
                height: 22px;
                margin-left: ${theme.gridUnit * 4}px;
                margin-right: ${theme.gridUnit}px;
              `
              : `
                width: 100%;
                height: 1px;
                display: block;
                margin-bottom: ${theme.gridUnit * 4}px;
                margin-top: ${theme.gridUnit * 4}px;
            `}
            background: ${theme.colors.grayscale.light2};
          `}
        />
      )}
    </div>
  );
};

export default CrossFilter;
