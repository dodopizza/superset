import React, { FC, memo } from 'react';
import { AutoComplete, Input } from 'antd';
import { t } from '@superset-ui/core';
import { useSelector } from 'react-redux';
import { Role, UserFromEnum } from '../../types';
import { getTeamsData } from '../../model/selectors/getTeamsData';
import { useTeam } from './useTeam';

type Props = {
  newTeam: string | null;
  existingTeam: any | null;
  setExistingTeam: (value: any | null) => void;
  setNewTeam: (value: string | null) => void;
  userFrom: UserFromEnum;
  setRoles?: (value: Array<Role>) => void;
  disabled?: boolean;
};

export const RequestFindTeam: FC<Props> = memo(
  ({
    newTeam,
    existingTeam,
    setNewTeam,
    setExistingTeam,
    userFrom,
    setRoles,
    disabled,
  }) => {
    const { teamsIsLoading, teams } = useSelector(getTeamsData);

    const { debouncedLoadTeamList, handleTeamChange, teamNameOnAutoComplete } =
      useTeam({
        userFrom,
        newTeam,
        existingTeam,
        setNewTeam,
        setExistingTeam,
        setRoles,
      });

    return (
      <AutoComplete
        value={teamNameOnAutoComplete}
        options={teams}
        style={{ width: '100%' }}
        onSearch={debouncedLoadTeamList}
        onChange={handleTeamChange}
        disabled={disabled}
      >
        <Input.Search
          placeholder={t('enter team')}
          loading={teamsIsLoading}
          allowClear
          enterButton
          size="large"
        />
      </AutoComplete>
    );
  },
);
