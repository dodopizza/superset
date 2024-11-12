// DODO was here
import { AntdDropdown, Typography } from 'src/components';
import { Menu } from 'src/components/Menu';
import React, { FC } from 'react';
import {
  DataMaskState,
  FilterSet,
  HandlerFunction,
  styled,
  useTheme,
  t,
} from '@superset-ui/core';
import Icons from 'src/components/Icons';
import Button from 'src/components/Button';
import { Tooltip } from 'src/components/Tooltip';
import CheckboxControl from 'src/explore/components/controls/CheckboxControl';
import FiltersHeader from './FiltersHeader';
import { getFilterBarTestId } from '../utils';

const HeaderButton = styled(Button)`
  padding: 0;
`;

const TitleText = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const IconsBlock = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  & > *,
  & > button.superset-button {
    ${({ theme }) => `margin-left: ${theme.gridUnit * 2}px`};
  }
`;

export type FilterSetUnitProps = {
  editMode?: boolean;
  isApplied?: boolean;
  isPrimary?: boolean;
  filterSet?: FilterSet;
  filterSetName?: string;
  dataMaskSelected?: DataMaskState;
  setFilterSetName?: (name: string) => void;
  onDelete?: HandlerFunction;
  onEdit?: HandlerFunction;
  onRebuild?: HandlerFunction;
  onSetPrimary?: HandlerFunction;
  isPrimaryFilterSet?: boolean;
  setIsPrimaryFilterSet?: (value: boolean) => void;
};

const FilterSetUnit: FC<FilterSetUnitProps> = ({
  editMode,
  setFilterSetName,
  onDelete,
  onEdit,
  filterSetName,
  dataMaskSelected,
  filterSet,
  isApplied,
  onRebuild,
  isPrimary,
  onSetPrimary,
  isPrimaryFilterSet,
  setIsPrimaryFilterSet,
}) => {
  const theme = useTheme();

  const menu = (
    <Menu>
      <Menu.Item onClick={onEdit}>{t('Edit')}</Menu.Item>
      <Menu.Item onClick={onSetPrimary}>
        <Tooltip
          placement="right"
          title={t(
            'You can set the primary filter set to be applied automatically',
          )}
        >
          {t('Set as primary')}
        </Tooltip>
      </Menu.Item>
      <Menu.Item onClick={onRebuild}>
        <Tooltip placement="right" title={t('Remove invalid filters')}>
          {t('Rebuild')}
        </Tooltip>
      </Menu.Item>
      <Menu.Item onClick={onDelete} danger>
        {t('Delete')}
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <TitleText>
        <Typography.Text
          strong
          editable={{
            editing: editMode,
            icon: <span />,
            onChange: setFilterSetName,
          }}
        >
          {filterSet?.name ?? filterSetName}
        </Typography.Text>
        <IconsBlock>
          {isPrimary && (
            <Icons.StarOutlined
              iconSize="m"
              iconColor={theme.colors.alert.dark1}
            />
          )}
          {isApplied && (
            <Icons.CheckOutlined
              iconSize="m"
              iconColor={theme.colors.success.base}
            />
          )}
          {onDelete && (
            <AntdDropdown
              overlay={menu}
              placement="bottomRight"
              trigger={['click']}
            >
              <HeaderButton
                onClick={e => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                {...getFilterBarTestId('filter-set-menu-button')}
                buttonStyle="link"
                buttonSize="xsmall"
              >
                <Icons.EllipsisOutlined iconSize="m" />
              </HeaderButton>
            </AntdDropdown>
          )}
        </IconsBlock>
      </TitleText>
      {editMode && setIsPrimaryFilterSet && (
        <CheckboxControl
          hovered
          label={t('Set as primary')}
          description={t(
            'You can set the primary filter set to be applied automatically',
          )}
          value={isPrimaryFilterSet}
          onChange={(value: boolean) => setIsPrimaryFilterSet(value)}
        />
      )}
      <FiltersHeader
        filterSet={filterSet}
        dataMask={filterSet?.dataMask ?? dataMaskSelected}
      />
    </>
  );
};

export default FilterSetUnit;
