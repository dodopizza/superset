// DODO was here

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AdhocColumn, t, styled } from '@superset-ui/core';
import {
  ColumnMeta,
  isAdhocColumn,
  isColumnMeta,
} from '@superset-ui/chart-controls';
import { ExplorePopoverContent } from 'src/explore/components/ExploreContentPopover';
import EditableTitle from 'src/components/EditableTitle';
import ColumnSelectPopover from './ColumnSelectPopover';
// import { DndColumnSelectPopoverTitle } from './DndColumnSelectPopoverTitle';
import ControlPopover from '../ControlPopover/ControlPopover';

interface ColumnSelectPopoverTriggerProps {
  columns: ColumnMeta[];
  editedColumn?: ColumnMeta | AdhocColumn;
  onColumnEdit: (editedColumn: ColumnMeta | AdhocColumn) => void;
  isControlledComponent?: boolean;
  visible?: boolean;
  togglePopover?: (visible: boolean) => void;
  closePopover?: () => void;
  children: React.ReactNode;
  isTemporal?: boolean;
}

const defaultPopoverLabel = t('My column');
const defaultPopoverLabelRU = t('Моя колонка');
const editableTitleTab = 'sqlExpression';

const ColumnSelectPopoverTrigger = ({
  columns,
  editedColumn,
  onColumnEdit,
  isControlledComponent,
  children,
  isTemporal,
  ...props
}: ColumnSelectPopoverTriggerProps) => {
  const [popoverLabel, setPopoverLabel] = useState(defaultPopoverLabel);
  const [popoverLabelRU, setPopoverLabelRU] = useState(defaultPopoverLabel);
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [isTitleEditDisabled, setIsTitleEditDisabled] = useState(true);
  const [hasCustomLabel, setHasCustomLabel] = useState(false);

  console.log('isTitleEditDisabled', isTitleEditDisabled);
  console.log('hasCustomLabel', hasCustomLabel);

  let initialPopoverLabel = defaultPopoverLabel;
  let initialPopoverLabelRU = defaultPopoverLabelRU;

  if (editedColumn && isColumnMeta(editedColumn)) {
    initialPopoverLabel = editedColumn.verbose_name || editedColumn.column_name;
    initialPopoverLabelRU =
      editedColumn.verbose_name_RU || editedColumn.column_name;
  } else if (editedColumn && isAdhocColumn(editedColumn)) {
    initialPopoverLabel = editedColumn.label || defaultPopoverLabel;
    initialPopoverLabelRU = editedColumn.labelRU || defaultPopoverLabelRU;
  }

  useEffect(() => {
    setPopoverLabel(initialPopoverLabel);
    setPopoverLabelRU(initialPopoverLabelRU);
  }, [initialPopoverLabel, initialPopoverLabelRU, popoverVisible]);

  const togglePopover = useCallback((visible: boolean) => {
    setPopoverVisible(visible);
  }, []);

  const closePopover = useCallback(() => {
    setPopoverVisible(false);
  }, []);

  const { visible, handleTogglePopover, handleClosePopover } =
    isControlledComponent
      ? {
          visible: props.visible,
          handleTogglePopover: props.togglePopover!,
          handleClosePopover: props.closePopover!,
        }
      : {
          visible: popoverVisible,
          handleTogglePopover: togglePopover,
          handleClosePopover: closePopover,
        };

  const getCurrentTab = useCallback((tab: string) => {
    setIsTitleEditDisabled(tab !== editableTitleTab);
  }, []);

  const overlayContent = useMemo(
    () => (
      <ExplorePopoverContent>
        <ColumnSelectPopover
          editedColumn={editedColumn}
          columns={columns}
          onClose={handleClosePopover}
          onChange={(e: any) => {
            console.log('eXXXX', e);
            return onColumnEdit(e);
          }}
          label={popoverLabel}
          labelRU={popoverLabelRU}
          setLabel={setPopoverLabel}
          setLabelRU={setPopoverLabelRU}
          getCurrentTab={getCurrentTab}
          isTemporal={isTemporal}
        />
      </ExplorePopoverContent>
    ),
    [
      columns,
      editedColumn,
      getCurrentTab,
      handleClosePopover,
      isTemporal,
      onColumnEdit,
      popoverLabel,
      popoverLabelRU,
    ],
  );

  const TitleWrapper = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    flex-direction: row;
    margin-bottom: 8px;

    span {
      margin-left: 12px;

      &:first-child {
        margin-left: 0;
      }
    }
  `;
  const TitleLabel = styled.span`
    display: inline-block;
    padding: 0;
  `;

  const onLabelChange = useCallback((value: string) => {
    console.log('onLabelChange', value);
    setPopoverLabel(value);
    setHasCustomLabel(true);
  }, []);

  const onLabelRUChange = useCallback((value: string) => {
    console.log('onLabelRUChange', value);
    setPopoverLabelRU(value);
    setHasCustomLabel(true);
  }, []);

  return (
    <ControlPopover
      trigger="click"
      content={overlayContent}
      defaultVisible={visible}
      visible={visible}
      onVisibleChange={handleTogglePopover}
      title={() => (
        <>
          <TitleWrapper>
            <TitleLabel>EN:</TitleLabel>
            <EditableTitle
              title={popoverLabel}
              canEdit
              emptyText=""
              onSaveTitle={(value: any) => {
                onLabelChange(value);
              }}
              showTooltip={false}
            />
          </TitleWrapper>
          <TitleWrapper>
            <TitleLabel>RU:</TitleLabel>
            <EditableTitle
              title={popoverLabelRU}
              canEdit
              emptyText=""
              onSaveTitle={(value: any) => {
                onLabelRUChange(value);
              }}
              showTooltip={false}
            />
          </TitleWrapper>
        </>
      )}
      destroyTooltipOnHide
    >
      {children}
    </ControlPopover>
  );
};

export default ColumnSelectPopoverTrigger;
