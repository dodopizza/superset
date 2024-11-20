// DODO was here
import {
  BuildQuery,
  buildQueryContext,
  GenericDataType,
  getColumnLabel,
  isPhysicalColumn,
  QueryObject,
  QueryObjectFilterClause,
} from '@superset-ui/core';
import { DEFAULT_FORM_DATA, PluginFilterSelectQueryFormData } from './types';

const buildQuery: BuildQuery<PluginFilterSelectQueryFormData> = (
  formData: PluginFilterSelectQueryFormData,
  options,
) => {
  const { search, coltypeMap } = options?.ownState || {};
  const { sortAscending, sortMetric } = { ...DEFAULT_FORM_DATA, ...formData };
  return buildQueryContext(formData, baseQueryObject => {
    // const { columns = [], filters = [] } = baseQueryObject; //DODO commented 29749076

    // DODO added start 29749076
    const { filters = [] } = baseQueryObject;
    let { columns = [] } = baseQueryObject;

    if (
      formData.viz_type === 'filter_select_by_id' &&
      formData.groupbyid?.length > 0
    ) {
      columns = [...columns, ...formData.groupbyid];
    }
    // DODO added stop 29749076

    const extraFilters: QueryObjectFilterClause[] = [];
    if (search) {
      columns.filter(isPhysicalColumn).forEach(column => {
        const label = getColumnLabel(column);
        if (
          coltypeMap[label] === GenericDataType.STRING ||
          (coltypeMap[label] === GenericDataType.NUMERIC &&
            !Number.isNaN(Number(search)))
        ) {
          extraFilters.push({
            col: column,
            op: 'ILIKE',
            val: `%${search}%`,
          });
        }
      });
    }

    const sortColumns = sortMetric ? [sortMetric] : columns;
    const query: QueryObject[] = [
      {
        ...baseQueryObject,
        columns,
        metrics: sortMetric ? [sortMetric] : [],
        filters: filters.concat(extraFilters),
        orderby:
          sortMetric || sortAscending !== undefined
            ? sortColumns.map(column => [column, !!sortAscending])
            : [],
      },
    ];
    return query;
  });
};

export default buildQuery;
