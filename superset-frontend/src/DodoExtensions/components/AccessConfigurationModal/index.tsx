import React, { useRef, useState } from 'react';
import { Maybe, styled, t } from '@superset-ui/core';
import Modal from 'src/components/Modal';
import Button from 'src/components/Button';
import { List, Badge } from 'src/components';
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

const StyledCollapse = styled(Collapse)`
  .ant-collapse-content-box {
    padding: 0;
  }
`;

const StyledBadge = styled(Badge)`
  .ant-badge-count {
    // right: unset;
    // left: -35px;
    background-color: ${({ theme }) => theme.colors.primary.base};
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
  accessList: AccessList;
  onSave: (accessList: AccessList) => Promise<void> | void;
  addDangerToast: (value: string) => void;
  show: boolean;
  onHide: () => void;
}

const AccessConfigurationModal = ({
  entityName,
  accessList,
  onSave,
  addDangerToast,
  show,
  onHide,
}: IProps) => {
  const [newAccessList, setNewAccessList] = useState<ExtendedAccessList>(() =>
    extendAccessList(accessList),
  );
  const prevAccessListRef = useRef<ExtendedAccessList>(newAccessList);
  const { users, teams, roles } = newAccessList;
  const { userChangesCount, teamChangesCount, roleChangesCount } =
    getChangesCount(prevAccessListRef.current, newAccessList);

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

    setNewAccessList(updatedAccessList);
    prevAccessListRef.current = updatedAccessList;

    await onSave(diminishExtendedAccessList(updatedAccessList));

    onHide();
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
        // tooltip="Изменение прав доступа будет возможно после создания датасета"
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
      <StyledCollapse defaultActiveKey="1" accordion>
        <Collapse.Panel
          header={`${t('Users with access')} (${users.length})`}
          key="1"
          extra={
            <StyledBadge
              count={userChangesCount}
              title={t('Number of changes')}
            />
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
          key="2"
          extra={
            <StyledBadge
              count={teamChangesCount}
              title={t('Number of changes')}
            />
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
          key="3"
          extra={
            <StyledBadge
              count={roleChangesCount}
              title={t('Number of changes')}
            />
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
