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
  const [popoverLabelEN, setPopoverLabelEN] = useState(defaultPopoverLabel);
  const [popoverLabelRU, setPopoverLabelRU] = useState(defaultPopoverLabelRU);
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [isTitleEditDisabled, setIsTitleEditDisabled] = useState(true);
  const [canHaveCustomLabel, setCanHaveCustomLabel] = useState(false);

  console.log('isTitleEditDisabled', isTitleEditDisabled);

  let initialPopoverLabel = defaultPopoverLabel;
  let initialPopoverLabelEN = defaultPopoverLabel;
  let initialPopoverLabelRU = defaultPopoverLabelRU;

  if (editedColumn && isColumnMeta(editedColumn)) {
    console.log('isColumnMeta which column', editedColumn);
    initialPopoverLabel = editedColumn.verbose_name || editedColumn.column_name;
    initialPopoverLabelEN =
      editedColumn.verbose_name_EN || editedColumn.column_name;
    initialPopoverLabelRU =
      editedColumn.verbose_name_RU || editedColumn.column_name;
  } else if (editedColumn && isAdhocColumn(editedColumn)) {
    console.log('isAdhocColumn which column', editedColumn);
    initialPopoverLabel = editedColumn.label || defaultPopoverLabel;
    initialPopoverLabelEN = editedColumn.labelEN || defaultPopoverLabel;
    initialPopoverLabelRU = editedColumn.labelRU || defaultPopoverLabelRU;
  }

  useEffect(() => {
    if (editedColumn && isColumnMeta(editedColumn)) {
      console.log('isColumnMeta which column', editedColumn);
      setCanHaveCustomLabel(false);
    } else if (editedColumn && isAdhocColumn(editedColumn)) {
      console.log('isAdhocColumn which column', editedColumn);
      setCanHaveCustomLabel(true);
    }
  }, [editedColumn]);

  useEffect(() => {
    console.log('initialPopoverLabel', initialPopoverLabel);
    console.log('initialPopoverLabelEN', initialPopoverLabelEN);
    console.log('initialPopoverLabelRU', initialPopoverLabelRU);
    console.log('----');
    setPopoverLabel(initialPopoverLabel);
    setPopoverLabelEN(initialPopoverLabelEN);
    setPopoverLabelRU(initialPopoverLabelRU);
  }, [
    initialPopoverLabel,
    initialPopoverLabelEN,
    initialPopoverLabelRU,
    popoverVisible,
  ]);

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
            console.log('ColumnSelectPopover edit', e);
            return onColumnEdit(e);
          }}
          label={popoverLabel}
          labelEN={popoverLabelEN}
          labelRU={popoverLabelRU}
          setLabel={(v: any) => {
            setPopoverLabel(v);
            setPopoverLabelEN(v);
          }}
          setLabelEN={(v: any) => {
            setPopoverLabel(v);
            setPopoverLabelEN(v);
          }}
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
      popoverLabelEN,
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
  }, []);

  const onLabelRUChange = useCallback((value: string) => {
    console.log('onLabelRUChange', value);
    setPopoverLabelRU(value);
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
          {canHaveCustomLabel && (
            <>
              <TitleWrapper>
                <TitleLabel id="edit-column-label-en">EN:</TitleLabel>
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
                <TitleLabel id="edit-column-label-ru">RU:</TitleLabel>
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
          {!canHaveCustomLabel && (
            <>
              <TitleWrapper>
                <TitleLabel id="cannot-edit-column-label-en">
                  EN <small>(dataset)</small>:
                </TitleLabel>
                <TitleLabel>{popoverLabel}</TitleLabel>
              </TitleWrapper>
              <TitleWrapper>
                <TitleLabel id="cannot-edit-column-label-en">
                  RU <small>(датасет)</small>:
                </TitleLabel>
                <TitleLabel>{popoverLabelRU}</TitleLabel>
              </TitleWrapper>
            </>
          )}
        </>
      )}
      destroyTooltipOnHide
    >
      {children}
    </ControlPopover>
  );
};

export default ColumnSelectPopoverTrigger;
