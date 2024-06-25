import React from 'react';
import { t } from '@superset-ui/core';
import { FilterOperator, Filters } from '../../../../components/ListView';
import CheckboxControl from '../../../../explore/components/controls/CheckboxControl';
import { Tooltip } from '../../../../components/Tooltip';

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
    id: 'name',
    Cell: (props: any) => (
      <Tooltip
        id="team-list-name-tooltip"
        title={props.value}
        placement="bottom"
      >
        <span>{props.value}</span>
      </Tooltip>
    ),
    Header: t('Name'),
    accessor: 'name',
    // disableSortBy: true,
    hidden: false,
  },
  {
    id: 'slug',
    Cell: (props: any) => (
      <Tooltip
        id="team-list-slug-tooltip"
        title={props.value}
        placement="bottom"
      >
        <span>{props.value}</span>
      </Tooltip>
    ),
    Header: 'slug',
    accessor: 'slug',
    // disableSortBy: true,
    hidden: false,
  },
  {
    id: 'roles',
    Cell: (props: any) => (
      <Tooltip
        id="team-list-roles-tooltip"
        title={props.value}
        placement="bottom"
      >
        <span>{props.value}</span>
      </Tooltip>
    ),
    Header: t('Roles'),
    accessor: 'roles',
    disableSortBy: true,
    hidden: false,
  },
  {
    id: 'members',
    Cell: (props: any) => <span>{props.value}</span>,
    Header: t('Members'),
    accessor: 'membersCount',
    // disableSortBy: true,
    hidden: false,
  },
  {
    id: 'franchisee',
    Cell: (props: any) => (
      <div style={{ textAlign: 'center' }}>
        <CheckboxControl hovered value={!props.value} disabled />
      </div>
    ),
    Header: t('Franchisee'),
    accessor: 'isExternal',
    size: 'xs',
  },
];

export const filters: Filters = [
  {
    id: 'id',
    Header: 'id',
    key: 'id',
    input: 'search',
    operator: FilterOperator.equals,
  },
  {
    id: 'name',
    Header: t('name'),
    key: 'name',
    input: 'search',
    operator: FilterOperator.contains,
  },
  {
    id: 'slug',
    Header: t('slug'),
    key: 'slug',
    input: 'search',
    operator: FilterOperator.contains,
  },
  {
    id: 'franchisee',
    Header: t('Franchisee'),
    key: 'isExternal',
    input: 'select',
    operator: FilterOperator.equals,
    unfilteredLabel: t('Any'),
    selects: [
      { label: t('Yes'), value: true },
      { label: t('No'), value: false },
    ],
  },
];

export const initialSort = [{ id: 'id', desc: false }];
