export const getTableSortOrder = (
  label: string,
  isSortedDesc: boolean | undefined,
): Record<string, string> | null => {
  let order: Record<string, string> | null = null;
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
