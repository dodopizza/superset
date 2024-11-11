type SortOrder = 'asc' | 'desc';

export const getTableSortOrder = (
  label: string,
  isSortedDesc: boolean | undefined,
): Record<string, SortOrder> | null => {
  let order: Record<string, SortOrder> | null = null;
  // setting the sort order value for the next render after clicking on the cell
  switch (isSortedDesc) {
    case undefined:
      order = { [label]: 'desc' };
      break;
    case true:
      order = { [label]: 'asc' };
      break;
    case false:
      order = null;
      break;
    default:
      order = null;
  }
  return order;
};
