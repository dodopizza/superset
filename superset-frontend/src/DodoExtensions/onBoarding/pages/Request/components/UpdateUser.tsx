import { t, useTheme } from '@superset-ui/core';
import React, { FC } from 'react';
import Modal from 'src/components/Modal';
import { Descriptions } from 'antd';
import Button from '../../../../../components/Button';

export type UpdateUserDto = {
  userName: string;
  dodoRole?: string;
  currentRoles?: Array<string>;
  requestedRoles?: Array<string>;
  teamName?: string;
};

type Props = {
  onSubmit: () => void;
  onCloseModal: () => void;
  data: UpdateUserDto | null;
};

export const UpdateUser: FC<Props> = ({ onCloseModal, onSubmit, data }) => {
  const theme = useTheme();
  return (
    <Modal
      title="User update"
      show
      onHide={onCloseModal}
      footer={
        <Button htmlType="submit" form="create-team-modal" onClick={onSubmit}>
          {t('Apply roles and link to a team')}
        </Button>
      }
    >
      <Descriptions
        size="small"
        bordered
        column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
        contentStyle={{
          backgroundColor: theme.colors.grayscale.light5,
        }}
      >
        <Descriptions.Item label={t('User')}>
          {data?.userName}
        </Descriptions.Item>
        <Descriptions.Item label={t('Role in Dodo Brands')}>
          {data?.dodoRole}
        </Descriptions.Item>
        <Descriptions.Item label={t('Current Roles')}>
          {data?.currentRoles?.join(', ')}
        </Descriptions.Item>
        <Descriptions.Item label={t('New Roles')}>
          {data?.requestedRoles?.join(', ')}
        </Descriptions.Item>
        <Descriptions.Item label={t('Team')}>
          {data?.teamName}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};
