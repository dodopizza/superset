// DODO was here
import React from 'react';
import { useHistory } from 'react-router-dom';
import Button from 'src/components/Button';
import { t } from '@superset-ui/core';
import { useSingleViewResource } from 'src/views/CRUD/hooks';
import { logEvent } from 'src/logger/actions';
import withToasts from 'src/components/MessageToasts/withToasts';
import {
  LOG_ACTIONS_DATASET_CREATION_EMPTY_CANCELLATION,
  LOG_ACTIONS_DATASET_CREATION_DATABASE_CANCELLATION,
  LOG_ACTIONS_DATASET_CREATION_SCHEMA_CANCELLATION,
  LOG_ACTIONS_DATASET_CREATION_TABLE_CANCELLATION,
  LOG_ACTIONS_DATASET_CREATION_SUCCESS,
} from 'src/logger/LogUtils';
import { DatasetObject } from '../types';

interface FooterProps {
  url: string;
  addDangerToast: () => void;
  datasetObject?: Partial<DatasetObject> | null;
  onDatasetAdd?: (dataset: DatasetObject) => void;
  hasColumns?: boolean;
  datasets?: (string | null | undefined)[] | undefined;
}

const INPUT_FIELDS = ['db', 'schema', 'table_name'];
const LOG_ACTIONS = [
  LOG_ACTIONS_DATASET_CREATION_EMPTY_CANCELLATION,
  LOG_ACTIONS_DATASET_CREATION_DATABASE_CANCELLATION,
  LOG_ACTIONS_DATASET_CREATION_SCHEMA_CANCELLATION,
  LOG_ACTIONS_DATASET_CREATION_TABLE_CANCELLATION,
];

function Footer({
  datasetObject,
  addDangerToast,
  hasColumns = false,
  datasets,
}: FooterProps) {
  const history = useHistory();
  const { createResource } = useSingleViewResource<Partial<DatasetObject>>(
    'dataset',
    t('dataset'),
    addDangerToast,
  );

  const createLogAction = (dataset: Partial<DatasetObject>) => {
    let totalCount = 0;
    const value = Object.keys(dataset).reduce((total, key) => {
      if (INPUT_FIELDS.includes(key) && dataset[key]) {
        totalCount += 1;
      }
      return totalCount;
    }, 0);

    return LOG_ACTIONS[value];
  };

  const cancelButtonOnClick = () => {
    if (!datasetObject) {
      logEvent(LOG_ACTIONS_DATASET_CREATION_EMPTY_CANCELLATION, {});
    } else {
      const logAction = createLogAction(datasetObject);
      logEvent(logAction, datasetObject);
    }
    history.goBack();
  };

  const tooltipText = t('Select a database table.');

  const onSave = () => {
    if (datasetObject) {
      console.log(datasetObject);
      const data = {
        database: datasetObject.db?.id,
        schema: datasetObject.schema,
        table_name: datasetObject.table_name,
        access_list: datasetObject.access_list, // DODO added 39843425
      };
      createResource(data).then(response => {
        if (!response) {
          return;
        }
        if (typeof response === 'number') {
          logEvent(LOG_ACTIONS_DATASET_CREATION_SUCCESS, datasetObject);
          // When a dataset is created the response we get is its ID number
          history.push(`/chart/add/?dataset=${datasetObject.table_name}`);
        }
      });
    }
  };

  const CREATE_DATASET_TEXT = t('Create dataset and create chart');
  const disabledCheck =
    !datasetObject?.table_name ||
    !hasColumns ||
    datasets?.includes(datasetObject?.table_name);

  return (
    <>
      <Button onClick={cancelButtonOnClick}>{t('Cancel')}</Button>
      <Button
        buttonStyle="primary"
        disabled={disabledCheck}
        tooltip={!datasetObject?.table_name ? tooltipText : undefined}
        onClick={onSave}
      >
        {CREATE_DATASET_TEXT}
      </Button>
    </>
  );
}

export default withToasts(Footer);
