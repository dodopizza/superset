// DODO was here
import React, { useMemo } from 'react';
import {
  css,
  DataMaskState,
  DataMaskStateWithId,
  styled,
  t,
} from '@superset-ui/core';
import Button from 'src/components/Button';
import { isNullish } from 'src/utils/common';
import { rgba } from 'emotion-rgba';
import { getFilterBarTestId } from '../index';

interface ActionButtonsProps {
  onApply: () => void;
  onClearAll: () => void;
  dataMaskSelected: DataMaskState;
  dataMaskApplied: DataMaskStateWithId;
  isApplyDisabled: boolean;
}

const ActionButtonsContainer = styled.div`
  ${({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    justify-content: space-between;
    padding: 4px 16px 0 16px;

    position: relative;

    background: linear-gradient(
      ${rgba(theme.colors.grayscale.light5, 0)},
      ${theme.colors.grayscale.light5} ${theme.opacity.mediumLight}
    );

    pointer-events: none;

    & > button {
      pointer-events: auto;
      margin: 0;

      &:first-child {
        padding: 0;
      }
    }

    && > .filter-clear-all-button {
      color: ${theme.colors.grayscale.base};
      margin-left: 0;
      &:hover {
        color: ${theme.colors.primary.dark1};
      }

      &[disabled],
      &[disabled]:hover {
        color: ${theme.colors.grayscale.light1};
      }
    }
  `};
`;

export const ActionButtons = ({
  onApply,
  onClearAll,
  dataMaskApplied,
  dataMaskSelected,
  isApplyDisabled,
}: ActionButtonsProps) => {
  const isClearAllEnabled = useMemo(
    () =>
      Object.values(dataMaskApplied).some(
        filter =>
          !isNullish(dataMaskSelected[filter.id]?.filterState?.value) ||
          (!dataMaskSelected[filter.id] &&
            !isNullish(filter.filterState?.value)),
      ),
    [dataMaskApplied, dataMaskSelected],
  );

  return (
    <ActionButtonsContainer>
      <Button
        disabled={!isClearAllEnabled}
        buttonStyle="link"
        buttonSize="small"
        className="filter-clear-all-button"
        onClick={onClearAll}
        {...getFilterBarTestId('clear-button')}
      >
        {t('Clear all')}
      </Button>
      <Button
        disabled={isApplyDisabled}
        buttonStyle="primary"
        htmlType="submit"
        className="filter-apply-button"
        onClick={onApply}
        {...getFilterBarTestId('apply-button')}
      >
        {t('Apply filters')}
      </Button>
    </ActionButtonsContainer>
  );
};
