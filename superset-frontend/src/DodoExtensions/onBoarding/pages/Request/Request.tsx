import React, { FC, useCallback, useMemo } from 'react';
import styled from '@emotion/styled';
import { t, useTheme } from '@superset-ui/core';
import { Col, Descriptions, Divider, Row, Space, Tag, Typography } from 'antd';
import Button from '../../../../components/Button';
import { useRequest } from './useRequest';
import Loading from '../../../../components/Loading';

import { userFromEnum } from '../../types';
import { MIN_TEAM_NAME_LENGTH } from '../../consts';
import { getTeamName } from '../../utils/getTeamName';
import { RequestFindTeam } from '../../components/requestFindTeam';

const Wrapper = styled.div`
  padding: 2rem;
`;

const StyledSpace = styled(Space)`
  width: 100%;
`;

const List = styled.ul`
  margin: 0;
  padding-left: 1rem;
`;

const StyledButton = styled(Button)`
  width: 100%;
`;

export const Request: FC = () => {
  const theme = useTheme();

  const {
    isLoading,
    requestData,
    newTeam,
    setNewTeam,
    existingTeam,
    setExistingTeam,
  } = useRequest();

  const tagClosable = useMemo(
    () => !!existingTeam || !!newTeam,
    [existingTeam, newTeam],
  );

  const removeTeam = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      setNewTeam(null);
      setExistingTeam(null);
      e.preventDefault();
    },
    [setExistingTeam, setNewTeam],
  );

  const newTeamOK = useMemo(
    () => newTeam && newTeam?.length >= MIN_TEAM_NAME_LENGTH,
    [newTeam],
  );

  const teamOK = useMemo(
    () => (newTeam && newTeam?.length >= MIN_TEAM_NAME_LENGTH) || existingTeam,
    [existingTeam, newTeam],
  );

  const formatedTeamName = useMemo(() => {
    if (existingTeam) {
      return `${existingTeam.label}`;
    }
    if ((newTeam ?? '').trim().length >= MIN_TEAM_NAME_LENGTH) {
      const name = getTeamName(newTeam, requestData?.userFrom);
      return `${name}`;
    }
    return 'no team';
  }, [existingTeam, newTeam, requestData?.userFrom]);

  return (
    <Wrapper>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <Descriptions
            title="Onboarding request"
            size="small"
            bordered
            column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
            contentStyle={{ backgroundColor: theme.colors.grayscale.light5 }}
          >
            <Descriptions.Item label={t('User from')}>
              {requestData?.userFrom}
            </Descriptions.Item>
            <Descriptions.Item label={t('First Name')}>
              {requestData?.firstName}
            </Descriptions.Item>
            <Descriptions.Item label={t('Last Name')}>
              {requestData?.lastName}
            </Descriptions.Item>
            <Descriptions.Item label={t('email')}>
              {requestData?.email}
            </Descriptions.Item>
            <Descriptions.Item label={t('Role in Dodo Brands')}>
              {requestData?.dodoRole}
            </Descriptions.Item>
            <Descriptions.Item label={t('Current roles')}>
              {requestData?.currentRoles}
            </Descriptions.Item>
            <Descriptions.Item label={t('Requested roles')}>
              {requestData?.requestedRoles}
            </Descriptions.Item>
            <Descriptions.Item label={t('Team')}>
              {requestData?.team}
            </Descriptions.Item>
            <Descriptions.Item label={t('Closed')}>
              {requestData?.isClosed}
            </Descriptions.Item>
            <Descriptions.Item label={t('Request date')}>
              {requestData?.requestDate.toLocaleDateString()}
            </Descriptions.Item>
            <Descriptions.Item label={t('Update date')}>
              {requestData?.updateDate.toLocaleDateString()}
            </Descriptions.Item>
          </Descriptions>

          <Divider />

          <Descriptions
            title="Кому давать какие команды и роли?"
            size="small"
            bordered
            column={{ xxl: 3, xl: 3, lg: 3, md: 1, sm: 1, xs: 1 }}
            contentStyle={{ backgroundColor: theme.colors.grayscale.light5 }}
          >
            <Descriptions.Item label={t('If this is C-level')}>
              {t('give: c_level')}
            </Descriptions.Item>
            <Descriptions.Item label={t('Если это френчайзи')}>
              {t('даем: fr_{фамилия}_{имя}')}
            </Descriptions.Item>
            <Descriptions.Item label={t('Если это сотрудник УК')}>
              {t('даем: по названию команды')}
            </Descriptions.Item>
          </Descriptions>

          <Divider orientation="left">Team search</Divider>

          <Row gutter={24}>
            <Col span={8}>
              <StyledSpace direction="vertical" size="middle">
                <RequestFindTeam
                  userFrom={userFromEnum.Franchisee}
                  newTeam={newTeam}
                  setNewTeam={setNewTeam}
                  existingTeam={existingTeam}
                  setExistingTeam={setExistingTeam}
                />
                {teamOK && (
                  <>
                    <Typography.Paragraph>
                      <Space direction="horizontal" size="small">
                        <Typography.Text>
                          {t(newTeam ? 'New team' : 'Existing team')}
                        </Typography.Text>
                        <Tag
                          color="#ff6900"
                          closable={tagClosable}
                          onClose={removeTeam}
                        >
                          {formatedTeamName}
                        </Tag>
                      </Space>
                    </Typography.Paragraph>
                  </>
                )}

                {newTeamOK && (
                  <StyledButton
                    type="primary"
                    htmlType="button"
                    disabled={!newTeamOK}
                  >
                    {t('Create team')}
                  </StyledButton>
                )}

                {existingTeam && (
                  <StyledButton type="primary" htmlType="button">
                    {t('Check information and update user')}
                  </StyledButton>
                )}
              </StyledSpace>
            </Col>
            <Col span={16}>
              <Descriptions
                size="small"
                bordered
                column={{ xxl: 2, xl: 2, lg: 1, md: 1, sm: 1, xs: 1 }}
                contentStyle={{
                  backgroundColor: theme.colors.grayscale.light5,
                }}
              >
                <Descriptions.Item label={t('Analyse Data')}>
                  <List>
                    <li>{t('Analyze available dashboards')}</li>
                    <li>
                      {t('Gather insights from charts inside a dashboard')}
                    </li>
                  </List>
                </Descriptions.Item>
                <Descriptions.Item label={t('Use Data')}>
                  <List>
                    <li>{t('Create dashboards')}</li>
                    <li>{t('Create charts')}</li>
                  </List>
                </Descriptions.Item>
                <Descriptions.Item label={t('Create Data')}>
                  <List>
                    <li>
                      {t('Create datasets from sources from Data Platform')}
                    </li>
                    <li>{t('Use SQL Lab for your Ad-hoc queries')}</li>
                  </List>
                </Descriptions.Item>
                <Descriptions.Item label={t('Input Data')}>
                  <List>
                    <li>{t('Add your own data sources to Superset')}</li>
                    <li>{t("Use SQL Lab for your Ad-hoc queries'")}</li>
                  </List>
                </Descriptions.Item>
              </Descriptions>
            </Col>
          </Row>
        </>
      )}
    </Wrapper>
  );
};
