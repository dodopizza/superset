// DODO was here
import React, { useReducer, Reducer, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useDatasetsList from 'src/features/datasets/hooks/useDatasetLists';
import Header from 'src/features/datasets/AddDataset/Header';
import EditPage from 'src/features/datasets/AddDataset/EditDataset';
import DatasetPanel from 'src/features/datasets/AddDataset/DatasetPanel';
import LeftPanel from 'src/features/datasets/AddDataset/LeftPanel';
import Footer from 'src/features/datasets/AddDataset/Footer';
import {
  DatasetActionType,
  DatasetObject,
  DSReducerActionType,
} from 'src/features/datasets/AddDataset/types';
import DatasetLayout from 'src/features/datasets/DatasetLayout';

type Schema = {
  schema: string;
};

export function datasetReducer(
  state: DatasetObject | null,
  action: DSReducerActionType,
): Partial<DatasetObject> | Schema | null {
  const trimmedState = {
    ...(state || {}),
  };

  switch (action.type) {
    case DatasetActionType.selectDatabase:
      return {
        ...trimmedState,
        ...action.payload,
        schema: null,
        table_name: null,
      };
    case DatasetActionType.selectSchema:
      return {
        ...trimmedState,
        [action.payload.name]: action.payload.value,
        table_name: null,
      };
    case DatasetActionType.selectTable:
      return {
        ...trimmedState,
        [action.payload.name]: action.payload.value,
      };
    case DatasetActionType.changeDataset:
      return {
        ...trimmedState,
        [action.payload.name]: action.payload.value,
      };
    // DODO added start 39843425
    case DatasetActionType.setAccessList:
      return {
        ...trimmedState,
        [action.payload.name]: action.payload.value,
      };
    // DODO added stop 39843425
    default:
      return null;
  }
}

const prevUrl =
  '/tablemodelview/list/?pageIndex=0&sortColumn=changed_on_delta_humanized&sortOrder=desc';

export default function AddDataset() {
  const [dataset, setDataset] = useReducer<
    Reducer<Partial<DatasetObject> | null, DSReducerActionType>
  >(datasetReducer, null);
  const [hasColumns, setHasColumns] = useState(false);
  const [editPageIsVisible, setEditPageIsVisible] = useState(false);

  const { datasets, datasetNames } = useDatasetsList(
    dataset?.db,
    dataset?.schema,
  );

  const { datasetId: id } = useParams<{ datasetId: string }>();
  useEffect(() => {
    if (!Number.isNaN(parseInt(id, 10))) {
      setEditPageIsVisible(true);
    }
  }, [id]);

  const HeaderComponent = () => (
    <Header setDataset={setDataset} title={dataset?.table_name} />
  );

  const LeftPanelComponent = () => (
    <LeftPanel
      setDataset={setDataset}
      dataset={dataset}
      datasetNames={datasetNames}
    />
  );

  const EditPageComponent = () => <EditPage id={id} />;

  const DatasetPanelComponent = () => (
    <DatasetPanel
      tableName={dataset?.table_name}
      dbId={dataset?.db?.id}
      schema={dataset?.schema}
      setHasColumns={setHasColumns}
      datasets={datasets}
    />
  );

  const FooterComponent = () => (
    <Footer
      url={prevUrl}
      datasetObject={dataset}
      hasColumns={hasColumns}
      datasets={datasetNames}
    />
  );

  return (
    <DatasetLayout
      header={HeaderComponent()}
      leftPanel={editPageIsVisible ? null : LeftPanelComponent()}
      datasetPanel={
        editPageIsVisible ? EditPageComponent() : DatasetPanelComponent()
      }
      footer={FooterComponent()}
    />
  );
}
