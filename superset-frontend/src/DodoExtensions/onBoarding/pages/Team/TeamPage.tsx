import React, { FC } from 'react';
import styled from '@emotion/styled';
import { Descriptions } from 'antd';
import { t, useTheme } from '@superset-ui/core';
import Loading from '../../../../components/Loading';
import { useTeamPage } from './useTeamPage';
import CheckboxControl from '../../../../explore/components/controls/CheckboxControl';

const Wrapper = styled.div`
  padding: 2rem;
`;

export const TeamPage: FC = () => {
  const theme = useTheme();

  const { isLoading, data } = useTeamPage();

  return (
    <Wrapper>
      {isLoading ? (
        <Loading />
      ) : (
        <Descriptions
          title={t('Team')}
          size="small"
          bordered
          column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
          labelStyle={{ width: '25%' }}
          contentStyle={{ backgroundColor: theme.colors.grayscale.light5 }}
        >
          <Descriptions.Item label={t('Name')}>{data?.name}</Descriptions.Item>
          <Descriptions.Item label={t('Franchisee')}>
            <CheckboxControl hovered value={data?.isExternal} disabled />
          </Descriptions.Item>
          <Descriptions.Item label="Slug">{data?.slug}</Descriptions.Item>
          <Descriptions.Item label="Roles">{data?.roles}</Descriptions.Item>
          <Descriptions.Item label="Members count">
            {data?.membersCount}
          </Descriptions.Item>
        </Descriptions>
      )}
    </Wrapper>
  );
};
