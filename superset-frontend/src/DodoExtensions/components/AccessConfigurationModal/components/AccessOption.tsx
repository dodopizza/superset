import React from 'react';
import { Select, Space } from 'src/components';
import { css, HandlerFunction, styled, t } from '@superset-ui/core';
import { Tooltip } from 'src/components/Tooltip';
import Icons from 'src/components/Icons';
import {
  ExtendedAccessOption,
  isTeamAccess,
  isUserAccess,
  Permission,
} from '../types';

const PERMISSION_OPTIONS: { value: Permission; label: string }[] = [
  { value: Permission.Read, label: t('Reader') },
  { value: Permission.Write, label: t('Editor') },
];

const AccessOptionWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const StyledSelect = styled(Select)<{ isPermChanged: boolean }>`
  min-width: 110px;

  ${({ theme, isPermChanged }) =>
    isPermChanged &&
    css`
      .ant-select-selector {
        background-color: ${theme.colors.primary.light1} !important;
      }
    `}
`;

const StyledParagraph = styled.p`
  margin: 0;
`;

const StyledSpan = styled.span`
  font-weight: ${({ theme }) => theme.typography.weights.bold};
`;

const PermissionSelect = ({
  permission,
  onChange,
  disabled,
  isPermChanged,
}: {
  permission: Permission;
  onChange: HandlerFunction;
  disabled: boolean;
  isPermChanged: boolean;
}) =>
  isPermChanged ? (
    <Tooltip title={t('Permission is changed')} placement="left">
      <StyledSelect
        isPermChanged={isPermChanged}
        value={permission}
        options={PERMISSION_OPTIONS}
        onChange={onChange}
        disabled={disabled}
        allowClear={false}
        showSearch={false}
      />
    </Tooltip>
  ) : (
    <StyledSelect
      isPermChanged={isPermChanged}
      value={permission}
      options={PERMISSION_OPTIONS}
      onChange={onChange}
      disabled={disabled}
      allowClear={false}
      showSearch={false}
    />
  );

const AccessOptionItem = ({
  accessOption,
  handleDelete,
  onChangePermission,
  isPermChanged,
}: {
  accessOption: ExtendedAccessOption;
  handleDelete: HandlerFunction;
  onChangePermission: (
    accessOption: ExtendedAccessOption,
    permission: Permission,
  ) => void;
  isPermChanged: boolean;
}) => {
  const { permission, isDeleted, isNew } = accessOption;

  if (isUserAccess(accessOption)) {
    const { first_name, last_name, email, user_info, teams } = accessOption;
    const teamsText = teams.length
      ? teams.map(team => team.name).join(', ')
      : 'no teams';
    return (
      <AccessOptionWrapper>
        <Space direction="vertical" size={2}>
          <StyledParagraph>
            <StyledSpan>
              {first_name} {last_name}
            </StyledSpan>
            {' - '}
            {user_info[0].country_name || 'no country'}
          </StyledParagraph>
          <StyledParagraph>
            <StyledSpan>{email}</StyledSpan> - {teamsText}
          </StyledParagraph>
        </Space>
        <Space direction="horizontal">
          <PermissionSelect
            isPermChanged={isPermChanged && !isDeleted && !isNew}
            disabled={isDeleted}
            permission={permission}
            onChange={(value: Permission) =>
              onChangePermission(accessOption, value)
            }
          />
          <Tooltip
            title={isDeleted ? t('Undo the action') : t('Delete')}
            placement="top"
          >
            <span role="button" tabIndex={0} onClick={handleDelete}>
              {isDeleted ? <Icons.UndoOutlined /> : <Icons.Trash />}
            </span>
          </Tooltip>
        </Space>
      </AccessOptionWrapper>
    );
  }

  if (isTeamAccess(accessOption)) {
    return (
      <AccessOptionWrapper>
        <StyledParagraph>
          <StyledSpan>{t('Team')}:</StyledSpan> {accessOption.team}
        </StyledParagraph>
        <Space direction="horizontal">
          <PermissionSelect
            isPermChanged={isPermChanged && !isDeleted && !isNew}
            disabled={isDeleted}
            permission={permission}
            onChange={(value: Permission) =>
              onChangePermission(accessOption, value)
            }
          />
          <Tooltip
            title={isDeleted ? t('Undo the action') : t('Delete')}
            placement="top"
          >
            <span role="button" tabIndex={0} onClick={handleDelete}>
              {isDeleted ? <Icons.UndoOutlined /> : <Icons.Trash />}
            </span>
          </Tooltip>
        </Space>
      </AccessOptionWrapper>
    );
  }

  return (
    <AccessOptionWrapper>
      <StyledParagraph>
        <StyledSpan>{t('Role')}:</StyledSpan> {accessOption.role}
      </StyledParagraph>
      <Space direction="horizontal">
        <PermissionSelect
          isPermChanged={isPermChanged && !isDeleted && !isNew}
          disabled={isDeleted}
          permission={permission}
          onChange={(value: Permission) =>
            onChangePermission(accessOption, value)
          }
        />
        <Tooltip
          title={isDeleted ? t('Undo the action') : t('Delete')}
          placement="top"
        >
          <span role="button" tabIndex={0} onClick={handleDelete}>
            {isDeleted ? <Icons.UndoOutlined /> : <Icons.Trash />}
          </span>
        </Tooltip>
      </Space>
    </AccessOptionWrapper>
  );
};

export default AccessOptionItem;
