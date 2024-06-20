import React from 'react';
import { t } from '@superset-ui/core';
import Icons from 'src/components/Icons';
import { Link } from 'react-router-dom';
import moment from 'moment';
import CheckboxControl from '../../../../explore/components/controls/CheckboxControl';
import { StyledActions } from './styled';
import { Tooltip } from '../../../../components/Tooltip';
import {
  CardSortSelectOption,
  FilterOperator,
  Filters,
} from '../../../../components/ListView';
import { REQUEST_PAGE_URL } from '../../consts';

// ------------
// size: xs, xl, xxl
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
  },
  {
    Cell: (props: any) => <span>{props.value}</span>,
    Header: t('Last name'),
    accessor: 'lastName',
  },
  {
    Cell: (props: any) => <span>{props.value}</span>,
    Header: t('Email'),
    accessor: 'email',
  },
  {
    Cell: (props: any) => (
      <Tooltip
        id="requested-roles-tooltip"
        title={props.value}
        placement="bottom"
      >
        <span>{props.value}</span>
      </Tooltip>
    ),
    Header: t('Requested roles'),
    accessor: 'requestedRoles',
  },
  {
    Cell: (props: any) => (
      <Tooltip id="team-tooltip" title={props.value} placement="bottom">
        <span>{props.value}</span>
      </Tooltip>
    ),
    Header: t('Team'),
    accessor: 'team',
  },
  {
    Cell: (props: any) => <span>{moment.utc(props.value).fromNow()}</span>,
    Header: t('Request date'),
    accessor: 'requestDate',
    size: 'xs',
  },
  {
    Cell: (props: any) => (
      <div style={{ textAlign: 'center' }}>
        <CheckboxControl hovered value={!!props.value} disabled />
      </div>
    ),
    Header: t('Closed'),
    accessor: 'isClosed',
    size: 'xs',
  },
  {
    Cell: ({ row: { original } }: any) => {
      const openEditModal = () => {};

      return (
        <StyledActions className="actions">
          <Tooltip
            id="edit-action-tooltip"
            title={t('Edit')}
            placement="bottom"
          >
            <Link to={REQUEST_PAGE_URL.replace(':id', original.id)}>
              <span
                role="button"
                tabIndex={0}
                className="action-button"
                onClick={openEditModal}
              >
                <Icons.EditAlt data-test="edit-alt" />
              </span>
            </Link>
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
    key: 'id',
    input: 'search',
    operator: FilterOperator.chartAllText,
  },
  {
    id: 'firstName',
    Header: t('First name'),
    key: 'firstName',
    input: 'search',
    operator: FilterOperator.chartAllText,
  },
  {
    id: 'lastName',
    Header: t('Last name'),
    key: 'lastName',
    input: 'search',
    operator: FilterOperator.chartAllText,
  },
  {
    id: 'email',
    Header: t('email'),
    key: 'email',
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
