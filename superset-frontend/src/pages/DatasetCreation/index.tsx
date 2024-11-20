/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
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
import {
  AccessList,
  Permission,
} from 'src/DodoExtensions/components/AccessConfigurationModal/types';
import { Role } from 'src/DodoExtensions/onBoarding/types';

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
    default:
      return null;
  }
}

const prevUrl =
  '/tablemodelview/list/?pageIndex=0&sortColumn=changed_on_delta_humanized&sortOrder=desc';

const mockAccessList: AccessList = {
  users: [
    {
      id: 109,
      email: 'hello@HeartFilled.com',
      first_name: 'Name',
      last_name: 'Surname',
      teams: [{ name: 'B2B team' }],
      user_info: [{ country_name: 'Russian Federation' }],
      permission: Permission.Write,
    },
    {
      id: 102,
      email: 'hello@H.com',
      first_name: 'Name1',
      last_name: 'Surname1',
      teams: [{ name: 'B2B team' }],
      user_info: [{ country_name: 'Russian Federation' }],
      permission: Permission.Write,
    },
  ],
  teams: [
    { id: 100, team: 'CVM', permission: Permission.Read },
    { id: 103, team: 'CVM', permission: Permission.Read },
    // { id: 4, team: 'CVM', permission: Permission.Read },
    // { id: 5, team: 'CVM', permission: Permission.Read },
    // { id: 6, team: 'CVM', permission: Permission.Read },
    // { id: 7, team: 'CVM', permission: Permission.Read },
    // { id: 8, team: 'CVM', permission: Permission.Read },
    // { id: 9, team: 'CVM', permission: Permission.Read },
    // { id: 10, team: 'CVM', permission: Permission.Read },
    // { id: 11, team: 'CVM', permission: Permission.Read },
  ],
  roles: [{ id: 202, role: Role.VizualizeData, permission: Permission.Read }],
};

const DEFAULT_ACCESS_LIST: AccessList = { users: [], teams: [], roles: [] };

export default function AddDataset() {
  const [dataset, setDataset] = useReducer<
    Reducer<Partial<DatasetObject> | null, DSReducerActionType>
  >(datasetReducer, null);
  const [hasColumns, setHasColumns] = useState(false);
  const [editPageIsVisible, setEditPageIsVisible] = useState(false);
  const [accessList, setAccessList] = useState<AccessList>(mockAccessList);

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
      accessList={accessList}
      setAccessList={setAccessList}
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
      accessList={accessList}
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
