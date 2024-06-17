import { Descriptions } from 'antd';
import { t, useTheme } from '@superset-ui/core';
import React, { FC } from 'react';
import CheckboxControl from '../../../../../explore/components/controls/CheckboxControl';
import { userFromEnum } from '../../../types';

type Props = {
  data?: {
    userFrom: userFromEnum;
    firstName: string;
    lastName: string;
    email: string;
    dodoRole: string;
    currentRoles: string;
    requestedRoles: string;
    team: string;
    requestDate: Date;
    isClosed: boolean;
    updateDate: Date;
  };
};

export const RequestData: FC<Props> = ({ data }) => {
  const theme = useTheme();

  return (
    <Descriptions
      title="Onboarding request"
      size="small"
      bordered
      column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
      labelStyle={{ width: '25%' }}
      contentStyle={{ backgroundColor: theme.colors.grayscale.light5 }}
    >
      <Descriptions.Item label={t('User from')}>
        {data?.userFrom}
      </Descriptions.Item>
      <Descriptions.Item label={t('First Name')}>
        {data?.firstName}
      </Descriptions.Item>
      <Descriptions.Item label={t('Last Name')}>
        {data?.lastName}
      </Descriptions.Item>
      <Descriptions.Item label={t('email')}>{data?.email}</Descriptions.Item>
      <Descriptions.Item label={t('Role in Dodo Brands')}>
        {data?.dodoRole}
      </Descriptions.Item>
      <Descriptions.Item label={t('Current roles')}>
        {data?.currentRoles}
      </Descriptions.Item>
      <Descriptions.Item label={t('Requested roles')}>
        {data?.requestedRoles}
      </Descriptions.Item>
      <Descriptions.Item label={t('Team')}>{data?.team}</Descriptions.Item>
      <Descriptions.Item label={t('Closed')}>
        <CheckboxControl hovered value={data?.isClosed} disabled />
      </Descriptions.Item>
      <Descriptions.Item label={t('Request date')}>
        {data?.requestDate.toLocaleDateString()}
      </Descriptions.Item>
      <Descriptions.Item label={t('Update date')}>
        {data?.updateDate.toLocaleDateString()}
      </Descriptions.Item>
    </Descriptions>
  );
};
