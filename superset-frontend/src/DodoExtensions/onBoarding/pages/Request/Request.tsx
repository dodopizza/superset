import { FC } from 'react';
import { useForm } from 'antd/es/form/Form';
import styled from '@emotion/styled';
import { t } from '@superset-ui/core';
import { Form, FormItem } from '../../../../components/Form';
import { Input } from '../../../../components/Input';
import Button from '../../../../components/Button';
import { useRequest } from './useRequest';

const Wrapper = styled.div`
  padding: 2rem;
`;

const layout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 22 },
};

export const Request: FC = () => {
  const [form] = useForm();

  useRequest();

  const onFinish = console.log;

  return (
    <Wrapper>
      <Form
        {...layout}
        form={form}
        name="request-form"
        initialValues={{ firstName: 'dd' }}
        onFinish={onFinish}
      >
        <FormItem name="firstName" label={t('First Name')}>
          <Input />
        </FormItem>
        <FormItem name="lastName" label={t('Last Name')}>
          <Input />
        </FormItem>
        <FormItem name="email" label={t('email')}>
          <Input />
        </FormItem>

        <Button type="primary" htmlType="submit">
          {t('Save')}
        </Button>
      </Form>
    </Wrapper>
  );
};
