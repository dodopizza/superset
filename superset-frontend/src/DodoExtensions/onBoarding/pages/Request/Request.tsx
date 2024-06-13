import React, { FC } from 'react';
import { useForm } from 'antd/es/form/Form';
import styled from '@emotion/styled';
import { t } from '@superset-ui/core';
import { Form, FormItem } from '../../../../components/Form';
import { Input } from '../../../../components/Input';
import Button from '../../../../components/Button';
import { useRequest } from './useRequest';
import Loading from '../../../../components/Loading';

const Wrapper = styled.div`
  padding: 2rem;
`;

// const layout = {
//   labelCol: { span: 4 },
//   wrapperCol: { span: 20 },
// };

export const Request: FC = () => {
  const [form] = useForm();

  const { isLoading, requestData } = useRequest();

  const onFinish = console.log;

  return (
    <Wrapper>
      {isLoading ? (
        <Loading />
      ) : (
        <Form
          form={form}
          name="request-form"
          onFinish={onFinish}
          initialValues={requestData}
          layout="vertical"
        >
          <FormItem name="firstName" label={t('First Name')}>
            <Input disabled />
          </FormItem>
          <FormItem name="lastName" label={t('Last Name')}>
            <Input disabled />
          </FormItem>
          <FormItem name="email" label={t('email')}>
            <Input disabled />
          </FormItem>

          <Button type="primary" htmlType="submit">
            {t('Save')}
          </Button>
        </Form>
      )}
    </Wrapper>
  );
};
