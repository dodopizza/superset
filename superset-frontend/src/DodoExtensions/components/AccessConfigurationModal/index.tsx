import React, { useEffect, useRef, useState } from 'react';
import { Maybe, styled, t } from '@superset-ui/core';
import Modal from 'src/components/Modal';
import Button from 'src/components/Button';
import { List } from 'src/components';
import Badge from 'src/components/Badge';
import Collapse from 'src/components/Collapse';
import withToasts from 'src/components/MessageToasts/withToasts';
import {
  AccessOption,
  ExtendedAccessOption,
  Permission,
  ExtendedAccessList,
  AccessList,
} from './types';
import {
  getUserOptions,
  getRoleOptions,
  getTeamOptions,
  checkForInclusion,
  extendAccessList,
  addToAccessList,
  updateAccessList,
  deleteFromAccessList,
  toggleDeletion,
  changePermission,
  getChangesCount,
  diminishExtendedAccessList,
} from './utils';
import AccessOptionItem from './components/AccessOption';
import AccessOptionSearch from './components/AccessOptionSearch';

const DEFAULT_ACCESS_LIST: AccessList = { users: [], teams: [], roles: [] };

const StyledCollapse = styled(Collapse)`
  .ant-collapse-content-box {
    padding: 0;
  }
`;

const StyledList = styled(List)<{ hasScroll: boolean }>`
  overflow-y: ${({ hasScroll }) => (hasScroll ? 'auto' : 'visible')};
  max-height: ${({ hasScroll }) =>
    hasScroll ? 'calc(100dvh - 378px)' : 'unset'};
  padding-block: 16px;
  border-top: 1px solid ${({ theme }) => theme.colors.grayscale.light3};
`;

const StyledListItem = styled(List.Item)<{
  isNew: boolean;
  isDeleted: boolean;
}>`
  padding-inline: 16px;
  background-color: ${({ theme, isNew, isDeleted }) => {
    if (isDeleted) return theme.colors.error.light1;
    if (isNew) return theme.colors.success.light1;
    return 'transparent';
  }};
  p {
    opacity: ${({ isDeleted }) => (isDeleted ? '0.3' : '1')};
    transition: opacity ${({ theme }) => `${theme.transitionTiming}s`};
  }
  transition: background-color ${({ theme }) => `${theme.transitionTiming}s`};
`;

interface IProps {
  entityName: Maybe<string> | undefined;
  accessList: AccessList | undefined;
  onSave: (accessList: AccessList) => Promise<void> | void;
  addDangerToast: (value: string) => void;
  show: boolean;
  onHide: () => void;
  defaultActivePanel?: 'users' | 'teams' | 'roles';
}

const AccessConfigurationModal = ({
  entityName,
  accessList = DEFAULT_ACCESS_LIST,
  onSave,
  addDangerToast,
  show,
  onHide,
  defaultActivePanel = 'users',
}: IProps) => {
  const [newAccessList, setNewAccessList] = useState<ExtendedAccessList>(() =>
    extendAccessList(accessList),
  );
  const prevAccessListRef = useRef<ExtendedAccessList>(newAccessList);
  const { users, teams, roles } = newAccessList;
  const { userChangesCount, teamChangesCount, roleChangesCount } =
    getChangesCount(prevAccessListRef.current, newAccessList);

  // to sync prop and state
  useEffect(() => {
    const extendedAccessList = extendAccessList(accessList);
    setNewAccessList(extendedAccessList);
    prevAccessListRef.current = extendedAccessList;
  }, [accessList]);

  const modalTitle = entityName
    ? `${t('Access')} - ${entityName}`
    : t('Access');

  const handleClose = () => {
    // reset changes
    setNewAccessList(prevAccessListRef.current);
    onHide();
  };

  const handleSave = async () => {
    // removing deleted options, setting isNew to false
    const updatedAccessList = updateAccessList(newAccessList);
    await onSave(diminishExtendedAccessList(updatedAccessList));
  };

  const addNewAccessOption = (
    accessOption: AccessOption,
    dangerMessage: string,
  ) => {
    if (checkForInclusion(newAccessList, accessOption)) {
      addDangerToast(dangerMessage);
      return;
    }
    const extendedAccessOption: ExtendedAccessOption = {
      ...accessOption,
      isDeleted: false,
      isNew: true,
    };
    setNewAccessList(prev => addToAccessList(prev, extendedAccessOption));
  };

  const handleDelete = (accessOption: ExtendedAccessOption) => () => {
    if (accessOption.isNew) {
      const updatedAccessList = deleteFromAccessList(
        newAccessList,
        accessOption,
      );
      setNewAccessList(updatedAccessList);
    } else {
      const updatedList = toggleDeletion(newAccessList, accessOption);
      setNewAccessList(updatedList);
    }
  };

  const onChangePermission = (
    accessOption: ExtendedAccessOption,
    permission: Permission,
  ) => {
    const updatedList = changePermission(
      newAccessList,
      accessOption,
      permission,
    );
    setNewAccessList(updatedList);
  };

  const footer = (
    <>
      <Button buttonSize="small" onClick={handleClose}>
        {t('Cancel')}
      </Button>
      <Button
        buttonSize="small"
        buttonStyle="primary"
        onClick={handleSave}
        disabled={!userChangesCount && !teamChangesCount && !roleChangesCount}
      >
        {t('Save')}
      </Button>
    </>
  );

  return (
    <Modal
      show={show}
      title={modalTitle}
      footer={footer}
      onHide={handleClose}
      width="700px"
      responsive
    >
      <StyledCollapse defaultActiveKey={defaultActivePanel} accordion>
        <Collapse.Panel
          header={`${t('Users with access')} (${users.length})`}
          key="users"
          extra={
            <Badge count={userChangesCount} title={t('Number of changes')} />
          }
        >
          <AccessOptionSearch
            getOptions={getUserOptions}
            addNewAccessOption={addNewAccessOption}
            placeholder={t('Search for users')}
            dangerMessage={t(
              'This user has already been added to the access list',
            )}
          />
          <StyledList
            hasScroll={users.length > 1}
            dataSource={users}
            renderItem={(accessOption: ExtendedAccessOption, index) => (
              <StyledListItem
                key={`User-${accessOption.id}`}
                isNew={accessOption.isNew}
                isDeleted={accessOption.isDeleted}
              >
                <AccessOptionItem
                  isPermChanged={
                    accessOption.permission !==
                    prevAccessListRef?.current.users[index]?.permission
                  }
                  accessOption={accessOption}
                  handleDelete={handleDelete(accessOption)}
                  onChangePermission={onChangePermission}
                />
              </StyledListItem>
            )}
          />
        </Collapse.Panel>

        <Collapse.Panel
          header={`${t('Teams with access')} (${teams.length})`}
          key="teams"
          extra={
            <Badge count={teamChangesCount} title={t('Number of changes')} />
          }
        >
          <AccessOptionSearch
            getOptions={getTeamOptions}
            addNewAccessOption={addNewAccessOption}
            placeholder={t('Search for teams')}
            dangerMessage={t(
              'This team has already been added to the access list',
            )}
          />
          <StyledList
            hasScroll={teams.length > 1}
            dataSource={teams}
            renderItem={(accessOption: ExtendedAccessOption, index) => (
              <StyledListItem
                key={`Team-${accessOption.id}`}
                isNew={accessOption.isNew}
                isDeleted={accessOption.isDeleted}
              >
                <AccessOptionItem
                  isPermChanged={
                    accessOption.permission !==
                    prevAccessListRef?.current.teams[index]?.permission
                  }
                  accessOption={accessOption}
                  handleDelete={handleDelete(accessOption)}
                  onChangePermission={onChangePermission}
                />
              </StyledListItem>
            )}
          />
        </Collapse.Panel>

        <Collapse.Panel
          header={`${t('Roles with access')} (${roles.length})`}
          key="roles"
          extra={
            <Badge count={roleChangesCount} title={t('Number of changes')} />
          }
        >
          <AccessOptionSearch
            getOptions={getRoleOptions}
            addNewAccessOption={addNewAccessOption}
            placeholder={t('Search for roles')}
            dangerMessage={t(
              'This role has already been added to the access list',
            )}
          />
          <StyledList
            hasScroll={roles.length > 1}
            dataSource={roles}
            renderItem={(accessOption: ExtendedAccessOption, index) => (
              <StyledListItem
                key={`Role-${accessOption.id}`}
                isNew={accessOption.isNew}
                isDeleted={accessOption.isDeleted}
              >
                <AccessOptionItem
                  isPermChanged={
                    accessOption.permission !==
                    prevAccessListRef?.current.roles[index]?.permission
                  }
                  accessOption={accessOption}
                  handleDelete={handleDelete(accessOption)}
                  onChangePermission={onChangePermission}
                />
              </StyledListItem>
            )}
          />
        </Collapse.Panel>
      </StyledCollapse>
    </Modal>
  );
};

export default withToasts(AccessConfigurationModal);
