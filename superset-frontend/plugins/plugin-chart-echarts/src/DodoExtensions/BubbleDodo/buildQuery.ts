import {
  buildQueryContext,
  QueryFormColumn,
  QueryFormData,
} from '@superset-ui/core';
import { BuildFinalQueryObjects } from 'packages/superset-ui-core/src/query/buildQueryContext';

export default function buildQuery(formData: QueryFormData) {
  const columnModify: BuildFinalQueryObjects = baseQueryObject => {
    // function  extractQueryFields ignore 'entity' column, so we add them here
    // if we add 'entity' column in extractQueryFields we can affect another charts

    const columns: QueryFormColumn[] = baseQueryObject.columns ?? [];
    const entity = formData.entity?.trim();
    if (entity) {
      columns.push(entity);
    }

    return [{ ...baseQueryObject, columns }];
  };

  return buildQueryContext(formData, columnModify);
}
