// DODO was here
import React from 'react';
import { useDrag } from 'react-dnd';
import { css, Metric, styled } from '@superset-ui/core';
import { ColumnMeta } from '@superset-ui/chart-controls';
import { DndItemType } from 'src/explore/components/DndItemType';
import {
  StyledColumnOption,
  StyledMetricOption,
} from 'src/explore/components/optionRenderers';
import Icons from 'src/components/Icons';

import { DatasourcePanelDndItem } from '../types';

const DatasourceItemContainer = styled.div`
  ${({ theme }) => css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: ${theme.gridUnit * 6}px;
    padding: 0 ${theme.gridUnit}px;

    // hack to make the drag preview image corners rounded
    transform: translate(0, 0);
    background-color: inherit;
    border-radius: 4px;

    > div {
      min-width: 0;
      margin-right: ${theme.gridUnit * 2}px;
    }
  `}
`;

interface DatasourcePanelDragOptionProps extends DatasourcePanelDndItem {
  labelRef?: React.RefObject<any>;
  showTooltip?: boolean;
}

type MetricOption = Omit<Metric, 'id'> & {
  label?: string;
};

export default function DatasourcePanelDragOption(
  props: DatasourcePanelDragOptionProps,
) {
  const { labelRef, showTooltip, type, value } = props;
  console.log('propsXX', props);

  const [{ isDragging }, drag] = useDrag({
    item: {
      value: props.value,
      type: props.type,
    },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const optionProps = {
    labelRef,
    showTooltip: !isDragging && showTooltip,
    showType: true,
  };

  return (
    <DatasourceItemContainer data-test="DatasourcePanelDragOption" ref={drag}>
      {type === DndItemType.Column ? (
        <StyledColumnOption column={value as ColumnMeta} {...optionProps} />
      ) : (
        <StyledMetricOption metric={value as MetricOption} {...optionProps} />
      )}
      <Icons.Drag />
    </DatasourceItemContainer>
  );
}
