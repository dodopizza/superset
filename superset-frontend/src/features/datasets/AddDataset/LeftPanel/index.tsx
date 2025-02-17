// DODO was here
import React, {
  useEffect,
  SetStateAction,
  Dispatch,
  useCallback,
  useState,
} from 'react';
import { styled, t } from '@superset-ui/core';
import TableSelector, { TableOption } from 'src/components/TableSelector';
import { DatabaseObject } from 'src/components/DatabaseSelector';
import { emptyStateComponent } from 'src/components/EmptyState';
import { useToasts } from 'src/components/MessageToasts/withToasts';
import { LocalStorageKeys, getItem } from 'src/utils/localStorageHelpers';
import {
  DatasetActionType,
  DatasetObject,
} from 'src/features/datasets/AddDataset/types';
import { Table } from 'src/hooks/apiResources';
import AccessConfigurationModal from 'src/DodoExtensions/components/AccessConfigurationModal';
import { AccessList } from 'src/DodoExtensions/components/AccessConfigurationModal/types'; // DODO added 39843425
import Button from 'src/components/Button'; // DODO added 39843425

interface LeftPanelProps {
  setDataset: Dispatch<SetStateAction<object>>;
  dataset?: Partial<DatasetObject> | null;
  datasetNames?: (string | null | undefined)[] | undefined;
}

const LeftPanelStyle = styled.div`
  ${({ theme }) => `
    padding: ${theme.gridUnit * 4}px;
    height: 100%;
    background-color: ${theme.colors.grayscale.light5};
    position: relative;
    .emptystate {
      height: auto;
      margin-top: ${theme.gridUnit * 17.5}px;
    }
    .section-title {
      margin-top: ${theme.gridUnit * 5.5}px;
      margin-bottom: ${theme.gridUnit * 11}px;
      font-weight: ${theme.typography.weights.bold};
    }
    .table-title {
      margin-top: ${theme.gridUnit * 11}px;
      margin-bottom: ${theme.gridUnit * 6}px;
      font-weight: ${theme.typography.weights.bold};
    }
    .options-list {
      overflow: auto;
      position: absolute;
      bottom: 0;
      top: ${theme.gridUnit * 92.25}px;
      left: ${theme.gridUnit * 3.25}px;
      right: 0;

      .no-scrollbar {
        margin-right: ${theme.gridUnit * 4}px;
      }

      .options {
        cursor: pointer;
        padding: ${theme.gridUnit * 1.75}px;
        border-radius: ${theme.borderRadius}px;
        :hover {
          background-color: ${theme.colors.grayscale.light4}
        }
      }

      .options-highlighted {
        cursor: pointer;
        padding: ${theme.gridUnit * 1.75}px;
        border-radius: ${theme.borderRadius}px;
        background-color: ${theme.colors.primary.dark1};
        color: ${theme.colors.grayscale.light5};
      }

      .options, .options-highlighted {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }
    form > span[aria-label="refresh"] {
      position: absolute;
      top: ${theme.gridUnit * 69}px;
      left: ${theme.gridUnit * 42.75}px;
      font-size: ${theme.gridUnit * 4.25}px;
    }
    .table-form {
      margin-bottom: ${theme.gridUnit * 8}px;
    }
    .loading-container {
      position: absolute;
      top: ${theme.gridUnit * 89.75}px;
      left: 0;
      right: 0;
      text-align: center;
      img {
        width: ${theme.gridUnit * 20}px;
        margin-bottom: ${theme.gridUnit * 2.5}px;
      }
      p {
        color: ${theme.colors.grayscale.light1};
      }
    }
`}
`;

export default function LeftPanel({
  setDataset,
  dataset,
  datasetNames,
}: LeftPanelProps) {
  const { addDangerToast } = useToasts();

  // DODO added start 39843425
  const [showAccessConfiguration, setShowAccessConfiguration] = useState(false);
  const toggleAccessConfigurationModal = () =>
    setShowAccessConfiguration(prev => !prev);
  const handleSaveAccessList = (accessList: AccessList) => {
    setDataset({
      type: DatasetActionType.setAccessList,
      payload: { name: 'access_list', value: accessList },
    });
    toggleAccessConfigurationModal();
  };
  // DODO added stop 39843425

  const setDatabase = useCallback(
    (db: Partial<DatabaseObject>) => {
      setDataset({ type: DatasetActionType.selectDatabase, payload: { db } });
    },
    [setDataset],
  );
  const setSchema = (schema: string) => {
    if (schema) {
      setDataset({
        type: DatasetActionType.selectSchema,
        payload: { name: 'schema', value: schema },
      });
    }
  };
  const setTable = (tableName: string) => {
    setDataset({
      type: DatasetActionType.selectTable,
      payload: { name: 'table_name', value: tableName },
    });
  };
  useEffect(() => {
    const currentUserSelectedDb = getItem(
      LocalStorageKeys.db,
      null,
    ) as DatabaseObject;
    if (currentUserSelectedDb) {
      setDatabase(currentUserSelectedDb);
    }
  }, [setDatabase]);

  const customTableOptionLabelRenderer = useCallback(
    (table: Table) => (
      <TableOption
        table={
          datasetNames?.includes(table.value)
            ? {
                ...table,
                extra: {
                  warning_markdown: t('This table already has a dataset'),
                },
              }
            : table
        }
      />
    ),
    [datasetNames],
  );

  return (
    <LeftPanelStyle>
      <TableSelector
        database={dataset?.db}
        handleError={addDangerToast}
        emptyState={emptyStateComponent(false)}
        onDbChange={setDatabase}
        onSchemaChange={setSchema}
        onTableSelectChange={setTable}
        sqlLabMode={false}
        customTableOptionLabelRenderer={customTableOptionLabelRenderer}
        {...(dataset?.schema && { schema: dataset.schema })}
      />
      {/* DODO added start 39843425 */}
      <Button
        disabled={!dataset?.table_name}
        buttonStyle="tertiary"
        onClick={toggleAccessConfigurationModal}
        style={{ marginTop: '1.5rem' }}
      >
        {t('Access configuration')}
      </Button>
      <AccessConfigurationModal
        entityName={dataset?.table_name}
        accessList={dataset?.access_list}
        onSave={handleSaveAccessList}
        show={showAccessConfiguration}
        onHide={toggleAccessConfigurationModal}
        defaultActivePanel="roles"
      />
      {/* DODO added stop 39843425 */}
    </LeftPanelStyle>
  );
}
