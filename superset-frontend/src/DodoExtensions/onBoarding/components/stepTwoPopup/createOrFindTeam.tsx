import React, { FC, memo, useCallback, useMemo } from 'react';
import { AutoComplete, Input, Space, Tag as TagAnt, Typography } from 'antd';
import { styled } from '@superset-ui/core';
import { debounce } from 'lodash';
import { Role, Team, userFromEnum } from '../../types';
import { getTeamName } from '../../utils/getTeamName';
import { getTeamTag } from '../../utils/getTeamTag';
import { MAX_NAME_LENGTH, MIN_NAME_LENGTH } from '../../consts';

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
  userFrom: userFromEnum;
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
    userFrom,
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
            // const reg = /^-?\d*(\.\d*)?$/;
            const reg = /^-?[0-9a-zA-Z ]*(\.[0-9a-zA-Z ]*)?$/;
            if (reg.test(value) && value.length <= MAX_NAME_LENGTH) {
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
        return `Since [${existingTeam.label} (${existingTeam.value}] is a known command, you can enter the team automatically.`;
      }
      if ((newTeam ?? '').trim().length >= MIN_NAME_LENGTH) {
        const name = getTeamName(userFrom, newTeam);
        const tag = getTeamTag(userFrom, newTeam);
        return `Since [${name} (${tag})] is a new command, Superset admins will have to evaluate this request.`;
      }
      return '';
    }, [newTeam, existingTeam]);

    const teamOnlyName = useMemo(() => {
      if (existingTeam) {
        return `${existingTeam.label}`;
      }
      if ((newTeam ?? '').trim().length >= MIN_NAME_LENGTH) {
        const name = getTeamName(userFrom, newTeam);
        return `${name}`;
      }
      return null;
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
              {teamOnlyName ?? 'no team'}
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
