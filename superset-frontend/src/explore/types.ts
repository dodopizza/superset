// DODO was here
import {
  QueryData,
  QueryFormData,
  AnnotationData,
  AdhocMetric,
  JsonObject,
  PlainObject, // DODO added 44136746
} from '@superset-ui/core';
import {
  ColumnMeta,
  ControlStateMapping,
  Dataset,
} from '@superset-ui/chart-controls';
import { DatabaseObject } from 'src/views/CRUD/types';
import { UserWithPermissionsAndRoles } from 'src/types/bootstrapTypes';
import { Slice } from 'src/types/Chart';

export type SaveActionType = 'overwrite' | 'saveas';

export type ChartStatus =
  | 'loading'
  | 'rendered'
  | 'failed'
  | 'stopped'
  | 'success';

interface ChartStateDodoExtended {
  extraFormData?: PlainObject; // DODO added 44136746
}
export interface ChartState extends ChartStateDodoExtended {
  id: number;
  annotationData?: AnnotationData;
  annotationError?: Record<string, string>;
  annotationQuery?: Record<string, AbortController>;
  chartAlert: string | null;
  chartStatus: ChartStatus | null;
  chartStackTrace?: string | null;
  chartUpdateEndTime: number | null;
  chartUpdateStartTime: number;
  lastRendered: number;
  latestQueryFormData: Partial<QueryFormData>;
  sliceFormData: QueryFormData | null;
  queryController: AbortController | null;
  queriesResponse: QueryData | null;
  triggerQuery: boolean;
}

export type OptionSortType = Partial<
  ColumnMeta & AdhocMetric & { saved_metric_name: string }
>;

export type Datasource = Dataset & {
  database?: DatabaseObject;
  datasource?: string;
  catalog?: string | null;
  schema?: string;
  is_sqllab_view?: boolean;
  extra?: string;
};

export interface ExplorePageInitialData {
  dataset: Dataset;
  form_data: QueryFormData;
  slice: Slice | null;
  metadata?: {
    created_on_humanized: string;
    changed_on_humanized: string;
    owners: string[];
    created_by?: string;
    changed_by?: string;
  };
  saveAction?: SaveActionType | null;
}

export interface ExploreResponsePayload {
  result: ExplorePageInitialData & { message: string };
}

export interface ExplorePageState {
  user: UserWithPermissionsAndRoles;
  common: {
    flash_messages: string[];
    conf: JsonObject;
    locale: string;
  };
  charts: { [key: number]: ChartState };
  datasources: { [key: string]: Dataset };
  explore: {
    can_add: boolean;
    can_download: boolean;
    can_overwrite: boolean;
    isDatasourceMetaLoading: boolean;
    isStarred: boolean;
    triggerRender: boolean;
    // duplicate datasource in exploreState - it's needed by getControlsState
    datasource: Dataset;
    controls: ControlStateMapping;
    form_data: QueryFormData;
    hiddenFormData?: Partial<QueryFormData>;
    slice: Slice;
    controlsTransferred: string[];
    standalone: boolean;
    force: boolean;
    common: JsonObject;
  };
  sliceEntities?: JsonObject; // propagated from Dashboard view
}
