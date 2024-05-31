import React, { FC, memo, useCallback, useMemo } from 'react';
import { AutoComplete, Input, Space, Tag as TagAnt, Typography } from 'antd';
import { styled } from '@superset-ui/core';
import { debounce } from 'lodash';
import { Role, Team } from '../../types';

const StyledSpace = styled(Space)`
  width: 100%;
`;

const SEARCH_TEAM_DELAY = 500;

type Props = {
  newTeam: string | null;
  existingTeam: any | null;
  teamList: Array<Team>;
  loadTeamList: (query: string) => Promise<void>;
  setExistingTeam: (value: any | null) => void;
  setNewTeam: (value: string | null) => void;
  teamIsLoading: boolean;
  setRoles: (roles: Array<Role>) => void;
};

export const CreateOrFindTeam: FC<Props> = memo(
  ({
    newTeam,
    existingTeam,
    teamList,
    loadTeamList,
    setNewTeam,
    setExistingTeam,
    teamIsLoading,
    setRoles,
  }) => {
    const debouncedLoadTeamList = useMemo(
      () => debounce((value: string) => loadTeamList(value), SEARCH_TEAM_DELAY),
      [loadTeamList],
    );

    const teamName = useMemo(() => {
      if (existingTeam) {
        return existingTeam.label;
      }
      if (newTeam) {
        return newTeam;
      }
      return null;
    }, [existingTeam, newTeam]);

    const handleTeamChange: (value: string, option: any) => void = useCallback(
      (value, option) => {
        if (!!option.value && !!option.label) {
          setExistingTeam(option);
          setNewTeam(null);
          setRoles(option.roles);
        } else {
          if (value) {
            const reg = /^-?\w*(\.\w*)?$/;
            if (reg.test(value)) {
              setNewTeam(value);
            }
          } else {
            setNewTeam(null);
            setRoles([]);
          }
          setExistingTeam(null);
        }
      },
      [],
    );

    const tagClosable = useMemo(
      () => !!existingTeam || !!newTeam,
      [existingTeam, newTeam],
    );

    const removeTeam = useCallback(
      (e: React.MouseEvent<HTMLElement>) => {
        setNewTeam(null);
        setExistingTeam(null);
        setRoles([]);
        e.preventDefault();
      },
      [setExistingTeam, setNewTeam, setRoles],
    );

    const teamDescription = useMemo(() => {
      if (existingTeam) {
        return `Since [${existingTeam.label}] is a known tag, you can enter the team automatically.`;
      }
      if (newTeam) {
        return `Since [${newTeam}] is a new tag, Superset admins will have to evaluate this request.`;
      }
      return '';
    }, [existingTeam, newTeam]);

    return (
      <>
        <Typography.Title level={5}>Create of find your team</Typography.Title>

        <StyledSpace direction="vertical" size="small">
          <Typography.Text type="secondary">
            All C-level people please select ‘c_level’
          </Typography.Text>

          <AutoComplete
            value={teamName}
            options={teamList}
            style={{ width: '100%' }}
            onSearch={debouncedLoadTeamList}
            onChange={handleTeamChange}
          >
            <Input.Search
              placeholder="your team"
              loading={teamIsLoading}
              allowClear
              enterButton
              size="large"
            />
          </AutoComplete>

          <Space direction="horizontal" size="small">
            <Typography.Text>Your team name is</Typography.Text>
            <TagAnt color="#ff6900" closable={tagClosable} onClose={removeTeam}>
              {teamName ?? 'no team'}
            </TagAnt>
          </Space>

          {teamDescription && (
            <Typography.Text type="secondary">
              {teamDescription}
            </Typography.Text>
          )}
        </StyledSpace>
      </>
    );
  },
);
