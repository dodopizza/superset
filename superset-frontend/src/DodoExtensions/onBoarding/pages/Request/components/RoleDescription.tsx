import { Descriptions } from 'antd';
import { t } from '@superset-ui/core';
import React from 'react';
import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';

const List = styled.ul`
  margin: 0;
  padding-left: 1rem;
`;

export const RoleDescription = () => {
  const theme = useTheme();
  return (
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
          <li>{t('Gather insights from charts inside a dashboard')}</li>
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
          <li>{t('Create datasets from sources from Data Platform')}</li>
          <li>{t('Use SQL Lab for your Ad-hoc queries')}</li>
        </List>
      </Descriptions.Item>
      <Descriptions.Item label={t('Input Data')}>
        <List>
          <li>{t('Add your own data sources to Superset')}</li>
          <li>{t('Use SQL Lab for your Ad-hoc queries')}</li>
        </List>
      </Descriptions.Item>
    </Descriptions>
  );
};