// DODO was here

import React from 'react';
import { styled } from '@superset-ui/core';
import {
  MetricOption,
  ColumnOption,
  MetricOptionProps,
  ColumnOptionProps,
} from '@superset-ui/chart-controls';

const OptionContainer = styled.div`
  width: 100%;
  > span {
    display: flex;
    align-items: center;
  }

  .option-label {
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    & ~ i {
      margin-left: ${({ theme }) => theme.gridUnit}px;
    }
  }
  .type-label {
    margin-right: ${({ theme }) => theme.gridUnit * 3}px;
    width: ${({ theme }) => theme.gridUnit * 7}px;
    display: inline-block;
    text-align: center;
    font-weight: ${({ theme }) => theme.typography.weights.bold};
  }
`;

export const StyledMetricOption = (props: MetricOptionProps) => (
  <OptionContainer>
    <MetricOption {...props} />
  </OptionContainer>
);

export const StyledColumnOption = (props: ColumnOptionProps) => (
  <OptionContainer>
    <ColumnOption {...props} />
  </OptionContainer>
);
