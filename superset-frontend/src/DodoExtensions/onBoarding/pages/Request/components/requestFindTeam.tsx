import React, { FC, memo } from 'react';
import { AutoComplete, Input } from 'antd';
import { t } from '@superset-ui/core';
import { useSelector } from 'react-redux';
import { userFromEnum } from '../../../types';
import { getTeamsData } from '../../../model/selector/getTeamsData';
import { useTeam } from '../../../hooks/useTeam';

type Props = {
  newTeam: string | null;
  existingTeam: any | null;
  setExistingTeam: (value: any | null) => void;
  setNewTeam: (value: string | null) => void;
  userFrom: userFromEnum;
};

export const RequestFindTeam: FC<Props> = memo(
  ({ newTeam, existingTeam, setNewTeam, setExistingTeam, userFrom }) => {
    const { teamsIsLoading, teams } = useSelector(getTeamsData);

    const { debouncedLoadTeamList, handleTeamChange, teamNameOnAutoComplete } =
      useTeam({
        userFrom,
        newTeam,
        existingTeam,
        setNewTeam,
        setExistingTeam,
      });

    return (
      <AutoComplete
        value={teamNameOnAutoComplete}
        options={teams}
        style={{ width: '100%' }}
        onSearch={debouncedLoadTeamList}
        onChange={handleTeamChange}
      >
        <Input.Search
          placeholder={t('your team')}
          loading={teamsIsLoading}
          allowClear
          enterButton
          size="large"
        />
      </AutoComplete>
    );
  },
);
