import React, { FC } from 'react';
import { useForm } from 'antd/es/form/Form';
import styled from '@emotion/styled';
import { t } from '@superset-ui/core';
import { Col, Row } from 'src/components';
import { Divider, Typography } from 'antd';
import { Form, FormItem } from '../../../../components/Form';
import { Input } from '../../../../components/Input';
import Button from '../../../../components/Button';
import { useRequest } from './useRequest';
import Loading from '../../../../components/Loading';
import { RoleInformation } from './components/roleInformation';
import { RequestFindTeam } from './components/requestFindTeam';
import { userFromEnum } from '../../types';

const Wrapper = styled.div`
  padding: 0 2rem 2rem 2rem;
`;

export const Request: FC = () => {
  const [form] = useForm();

  const {
    isLoading,
    requestData,
    newTeam,
    setNewTeam,
    existingTeam,
    setExistingTeam,
  } = useRequest();

  const { Title } = Typography;

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
          <Title level={3}>{t('Onboarding request')}</Title>
          <Row gutter={12}>
            <Col span={12}>
              <FormItem name="firstName" label={t('First Name')}>
                <Input readOnly />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem name="lastName" label={t('Last Name')}>
                <Input readOnly />
              </FormItem>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={12}>
              <FormItem name="email" label={t('email')}>
                <Input readOnly />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem name="dodoRole" label={t('Role in Dodo Brands')}>
                <Input readOnly />
              </FormItem>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={12}>
              <FormItem name="currentRoles" label={t('Current roles')}>
                <Input readOnly />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem name="requestedRoles" label={t('Requested roles')}>
                <Input readOnly />
              </FormItem>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={12}>
              <FormItem name="team" label={t('Team')}>
                <Input readOnly />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem name="isClosed" label={t('Closed')}>
                <Input readOnly />
              </FormItem>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={12}>
              <FormItem name="requestDate" label={t('Request date')}>
                <Input readOnly />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem name="updateDate" label={t('Update date')}>
                <Input readOnly />
              </FormItem>
            </Col>
          </Row>

          <Divider orientation="left">Information search</Divider>

          <Row gutter={48}>
            <Col span={10}>
              <Typography.Title level={5}>Поиск команд:</Typography.Title>
              <RequestFindTeam
                userFrom={userFromEnum.Franchisee}
                newTeam={newTeam}
                setNewTeam={setNewTeam}
                existingTeam={existingTeam}
                setExistingTeam={setExistingTeam}
              />
            </Col>
            <Col span={14}>
              <RoleInformation />
            </Col>
          </Row>

          <Button type="primary" htmlType="submit">
            {t('Save')}
          </Button>
        </Form>
      )}
    </Wrapper>
  );
};
