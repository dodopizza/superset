// DODO was here
import { DatabaseObject } from 'src/components/DatabaseSelector';
import { AccessList } from 'src/DodoExtensions/components/AccessConfigurationModal/types'; // DODO added 39843425

export enum DatasetActionType {
  selectDatabase,
  selectSchema,
  selectTable,
  changeDataset,
  setAccessList,
}

export interface DatasetObject {
  db: DatabaseObject & { owners: [number] };
  schema?: string | null;
  dataset_name: string;
  table_name?: string | null;
  explore_url?: string;
  access_list?: AccessList; // DODO added 39843425
}

export interface DatasetReducerPayloadType {
  name: string;
  value?: string;
}

export type Schema = {
  schema?: string | null | undefined;
};

export type DSReducerActionType =
  | {
      type: DatasetActionType.selectDatabase;
      payload: Partial<DatasetObject>;
    }
  | {
      type:
        | DatasetActionType.changeDataset
        | DatasetActionType.selectSchema
        | DatasetActionType.selectTable
        | DatasetActionType.setAccessList; // DODO added 39843425
      payload: DatasetReducerPayloadType;
    };
