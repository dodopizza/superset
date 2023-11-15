// DODO changed
// labelRU

import { GenericDataType } from './QueryResponse';

export interface AdhocColumn {
  hasCustomLabel?: boolean;
  label?: string;
  labelRU?: string;
  labelEN?: string;
  optionName?: string;
  sqlExpression: string;
  expressionType: 'SQL';
}

/**
 * A column that is physically defined in datasource.
 */
export type PhysicalColumn = string;

/**
 * Column information defined in datasource.
 */
export interface Column {
  id: number;
  type?: string;
  type_generic?: GenericDataType;
  column_name: string;
  groupby?: boolean;
  is_dttm?: boolean;
  filterable?: boolean;
  verbose_name?: string | null;
  description?: string | null;
  expression?: string | null;
  database_expression?: string | null;
  python_date_format?: string | null;
}

export default {};

export function isPhysicalColumn(
  column?: AdhocColumn | PhysicalColumn,
): column is PhysicalColumn {
  return typeof column === 'string';
}

export function isAdhocColumn(column?: AdhocColumn | PhysicalColumn) {
  return (column as AdhocColumn)?.sqlExpression !== undefined;
}
