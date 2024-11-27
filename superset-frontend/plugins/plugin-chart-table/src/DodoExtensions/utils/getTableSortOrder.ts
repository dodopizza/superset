type SortOrder = 'asc' | 'desc';

export const getTableSortOrder = (
  label: string, // column label
  sortDesc: boolean, // order_desc from controlPanel, it affects the order in which the sorting is switched
  isSortedDesc: boolean | undefined, // sort order of specific column
): Record<string, SortOrder> | null => {
  // sort order value is set for the next render after clicking on the cell

  if (isSortedDesc === undefined) {
    return { [label]: sortDesc ? 'desc' : 'asc' };
  }

  if (isSortedDesc === sortDesc) {
    return { [label]: sortDesc ? 'asc' : 'desc' };
  }

  return null;
};
