import React from 'react';
import { t } from '@superset-ui/core';
import Icons from 'src/components/Icons';
import CheckboxControl from '../../../../explore/components/controls/CheckboxControl';
import { StyledActions } from './styled';
import ConfirmStatusChange from '../../../../components/ConfirmStatusChange';
import { Tooltip } from '../../../../components/Tooltip';
import {
  CardSortSelectOption,
  FilterOperator,
  Filters,
} from '../../../../components/ListView';

// ------------
// xs, xl, xxl
// ------------
export const columns = [
  {
    id: 'id',
    Cell: (props: any) => <span>{props.value}</span>,
    Header: 'id',
    accessor: 'id',
    size: 'xs',
    // disableSortBy: true,
    hidden: false,
  },
  {
    Cell: (props: any) => <span>{props.value}</span>,
    Header: t('First name'),
    accessor: 'firstName',
    size: 'xs',
  },
  {
    Cell: (props: any) => <span>{props.value}</span>,
    Header: t('Last name'),
    accessor: 'lastName',
    size: 'xs',
  },
  {
    Cell: (props: any) => <span>{props.value}</span>,
    Header: t('Email'),
    accessor: 'email',
    size: 'xs',
  },
  {
    Cell: (props: any) => <span>{props.value.join(', ')}</span>,
    Header: t('Current roles'),
    accessor: 'currentRoles',
    size: 'xl',
  },
  {
    Cell: (props: any) => <span>{props.value.join(', ')}</span>,
    Header: t('Requested roles'),
    accessor: 'requestedRoles',
    size: 'xl',
  },
  {
    Cell: (props: any) => <span>{props.value}</span>,
    Header: t('Team'),
    accessor: 'team',
    size: 'xs',
  },
  {
    Cell: (props: any) => <span>{props.value.toLocaleString()}</span>,
    Header: t('Request date'),
    accessor: 'requestDate',
    size: 'xs',
  },
  {
    Cell: (props: any) => (
      <CheckboxControl hovered value={!!props.value} disabled />
    ),
    Header: t('Closed'),
    accessor: 'isClosed',
    size: 'xs',
  },
  {
    Cell: ({ row: { original } }: any) => {
      const handleDelete = () => {};
      const openEditModal = () => {};

      return (
        <StyledActions className="actions">
          <ConfirmStatusChange
            title={t('Please confirm')}
            description={
              <>
                {t('Are you sure you want to delete request #')}
                <b>{original.id}</b>?
              </>
            }
            onConfirm={handleDelete}
          >
            {confirmDelete => (
              <Tooltip
                id="delete-action-tooltip"
                title={t('Delete')}
                placement="bottom"
              >
                <span
                  data-test="trash"
                  role="button"
                  tabIndex={0}
                  className="action-button"
                  onClick={confirmDelete}
                >
                  <Icons.Trash />
                </span>
              </Tooltip>
            )}
          </ConfirmStatusChange>

          <Tooltip
            id="edit-action-tooltip"
            title={t('Edit')}
            placement="bottom"
          >
            <span
              role="button"
              tabIndex={0}
              className="action-button"
              onClick={openEditModal}
            >
              <Icons.EditAlt data-test="edit-alt" />
            </span>
          </Tooltip>
        </StyledActions>
      );
    },
    Header: t('Actions'),
    id: 'actions',
    disableSortBy: true,
    hidden: false,
  },
];

export const filters: Filters = [
  {
    id: 'id',
    Header: 'id',
    key: 'search',
    input: 'search',
    operator: FilterOperator.chartAllText,
  },
  {
    id: 'firstName',
    Header: t('First name'),
    key: 'search',
    input: 'search',
    operator: FilterOperator.chartAllText,
  },
  {
    id: 'lastName',
    Header: t('Last name'),
    key: 'search',
    input: 'search',
    operator: FilterOperator.chartAllText,
  },
  {
    id: 'email',
    Header: t('email'),
    key: 'search',
    input: 'search',
    operator: FilterOperator.chartAllText,
  },
  {
    id: 'isClosed',
    Header: t('Closed'),
    key: 'isClosed',
    // urlDisplay: 'favorite',
    input: 'select',
    operator: FilterOperator.requestIsClosed,
    unfilteredLabel: t('Any'),
    selects: [
      { label: t('Yes'), value: true },
      { label: t('No'), value: false },
    ],
  },
];

export const sortTypes: CardSortSelectOption[] | undefined = [
  {
    desc: false,
    id: 'id',
    label: 'id',
    value: 'alphabetical',
  },
  {
    desc: true,
    id: 'requestDate',
    label: t('Recently created'),
    value: 'recently_modified',
  },
  {
    desc: false,
    id: 'requestDate',
    label: t('Least recently created'),
    value: 'least_recently_modified',
  },
];

export const initialSort = [{ id: 'id', desc: false }];
