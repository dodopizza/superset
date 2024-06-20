import { useForm } from 'antd/es/form/Form';
import React, { ChangeEvent, FC, useCallback } from 'react';
import { Typography } from 'antd';
import { t } from '@superset-ui/core';
import Modal from '../../../../../components/Modal';
import { Role, userFromEnum } from '../../../types';
import { Form, FormItem } from '../../../../../components/Form';
import { Input } from '../../../../../components/Input';
import Button from '../../../../../components/Button';
import { getTeamName } from '../../../utils/getTeamName';
import { Select } from '../../../../../components';
import { SelectProps } from '../../../../../components/Select/types';
import { getTeamSlug } from '../../../utils/getTeamSlug';

export type CreateTeamModalDto = {
  userFrom?: userFromEnum;
  name: string | null;
  teamName: string;
  teamTag: string;
  roles: Array<Role>;
};

const RolesList: SelectProps['options'] = [
  {
    label: `${Role.AnalyseData}`,
    value: Role.AnalyseData,
  },
  {
    label: `${Role.UseData}`,
    value: Role.UseData,
  },
  {
    label: `${Role.CreateData}`,
    value: Role.CreateData,
  },
  {
    label: `${Role.InputData}`,
    value: Role.InputData,
  },
];

type Props = {
  onCloseModal: () => void;
  onSubmit: (data: CreateTeamModalDto) => void;
  data: CreateTeamModalDto;
};

export const CreateTeamModal: FC<Props> = ({
  onCloseModal,
  onSubmit,
  data,
}) => {
  const [form] = useForm();

  const setNameAndTag = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      form.setFieldsValue({
        teamName: getTeamName(event.target.value, data.userFrom),
        teamTag: getTeamSlug(event.target.value, data.userFrom),
      });
    },
    [data.userFrom, form],
  );

  return (
    <Modal
      title="Create new team"
      show
      onHide={onCloseModal}
      footer={
        <Button htmlType="submit" form="create-team-modal">
          {t('Next')}
        </Button>
      }
    >
      <Form
        layout="vertical"
        form={form}
        name="create-team-modal"
        onFinish={onSubmit}
        initialValues={data}
      >
        <Typography.Title level={4}>
          {t('New team will be created')}
        </Typography.Title>
        <FormItem
          name="name"
          label={t('Team Name')}
          rules={[{ required: true }]}
        >
          <Input onChange={setNameAndTag} />
        </FormItem>
        <FormItem
          name="teamName"
          label={t('Full Team Name')}
          rules={[{ required: true }]}
        >
          <Input disabled />
        </FormItem>
        <FormItem
          name="teamTag"
          label={t('Team Tag')}
          rules={[{ required: true }]}
        >
          <Input disabled />
        </FormItem>

        <FormItem name="roles" label="Roles" rules={[{ required: true }]}>
          <Select
            mode="multiple"
            allowClear
            placeholder={t('Roles')}
            options={RolesList}
            oneLine={false}
            maxTagCount={10}
          />
        </FormItem>
      </Form>
    </Modal>
  );
};
