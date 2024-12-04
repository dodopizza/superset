// DODO was here
import React from 'react';
import { css, styled, t, useTheme } from '@superset-ui/core';
import Popover from 'src/components/Popover';
import { ColumnTypeLabel } from '@superset-ui/chart-controls';
import { Tooltip } from 'src/components/Tooltip';
import Icons from 'src/components/Icons';
import ColumnConfigPopover, {
  ColumnConfigPopoverProps,
} from './ColumnConfigPopover';

// DODO added start 41390650
const InfoIcon = styled(Icons.InfoCircleOutlined)`
  ${({ theme }) => css`
    &.anticon {
      font-size: unset;
      .anticon {
        margin-left: 4px;
        line-height: unset;
        vertical-align: unset;
        color: ${theme.colors.grayscale.base};
      }
    }
  `}
`;

const ColumnLabel = styled.span`
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: middle;
`;
// DODO added stop 41390650

export type ColumnConfigItemProps = ColumnConfigPopoverProps;

export default React.memo(function ColumnConfigItem({
  column,
  onChange,
  configFormLayout,
  width,
  height,
}: ColumnConfigItemProps) {
  const { colors, gridUnit } = useTheme();
  const caretWidth = gridUnit * 6;
  const hasExportAsTime = column.config?.exportAsTime; // DODO added 41390650
  return (
    <Popover
      title={column.name}
      content={() => (
        <ColumnConfigPopover
          column={column}
          onChange={onChange}
          configFormLayout={configFormLayout}
        />
      )}
      trigger="click"
      placement="right"
      overlayInnerStyle={{ width, height }}
      overlayClassName="column-config-popover"
    >
      <div
        css={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          padding: `${gridUnit}px ${2 * gridUnit}px`,
          borderBottom: `1px solid ${colors.grayscale.light2}`,
          position: 'relative',
          paddingRight: caretWidth,
          '&:last-child': {
            borderBottom: 'none',
          },
          '&:hover': {
            background: colors.grayscale.light4,
          },
          '> .fa': {
            color: colors.grayscale.light2,
          },
          '&:hover > .fa': {
            color: colors.grayscale.light1,
          },
        }}
      >
        <ColumnTypeLabel type={column.type} />
        <ColumnLabel>{column.name}</ColumnLabel>
        {/* DODO added 41390650 */}
        {hasExportAsTime && (
          <Tooltip
            title={t('This metric will be exported as time')}
            placement="top"
          >
            <InfoIcon />
          </Tooltip>
        )}
        <i
          className="fa fa-caret-right"
          css={{
            position: 'absolute',
            right: 3 * gridUnit,
            top: 3 * gridUnit,
          }}
        />
      </div>
    </Popover>
  );
});
