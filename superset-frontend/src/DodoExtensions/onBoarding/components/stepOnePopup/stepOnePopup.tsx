import React, { FC } from 'react';
import { Col, Row } from 'src/components';
import { Typography } from 'antd';
import { styled } from '@superset-ui/core';
import Modal from '../../../../components/Modal';
import { Form, FormItem } from '../../../../components/Form';
import { StepOnePopupDto } from './stepOnePopup.dto';
import { Input } from '../../../../components/Input';
import Loading from '../../../../components/Loading';
import { ButtonWithTopMargin } from '../styles';

const Wrapper = styled.div`
  padding: 1.5rem;
`;

type Props = {
  isUpdating: boolean;
  firstName: string;
  lastName: string;
  email: string;
  roleAndTeam: string;
  onClose: () => void;
  onNextStep: (dto: StepOnePopupDto) => void;
};

export const StepOnePopup: FC<Props> = ({
  isUpdating,
  firstName,
  lastName,
  email,
  roleAndTeam,
  onNextStep,
  onClose,
}) => {
  const { Title, Paragraph } = Typography;

  return (
    <Modal
      show
      title="You are welcome to superset"
      hideFooter
      onHide={onClose}
      width="1000px"
    >
      <Wrapper>
        <Row gutter={32}>
          <Col span={14}>
            <Title level={3}>Tell us more about yourself</Title>
            <Paragraph type="secondary">
              All the data is from DodoIS. You cannot change email, however if
              there are issues with your first name or last name, feel free to
              change them.
            </Paragraph>
            <Form
              name="stepOne"
              onFinish={onNextStep}
              autoComplete="off"
              layout="vertical"
            >
              <Row gutter={16}>
                <Col span={12}>
                  <FormItem
                    label="First name"
                    name="firstName"
                    initialValue={firstName}
                  >
                    <Input disabled />
                  </FormItem>
                </Col>

                <Col span={12}>
                  <FormItem
                    label="Last name"
                    name="lastName"
                    initialValue={lastName}
                  >
                    <Input disabled />
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <FormItem label="email" name="email" initialValue={email}>
                    <Input disabled />
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <FormItem
                    label="Role and team"
                    name="roleAndTeam"
                    rules={[
                      {
                        required: true,
                        message: 'Please input your role and team!',
                      },
                    ]}
                    initialValue={roleAndTeam}
                  >
                    <Input />
                  </FormItem>
                </Col>
              </Row>
              <ButtonWithTopMargin type="primary" htmlType="submit">
                Next step
              </ButtonWithTopMargin>
            </Form>
          </Col>

          <Col span={10}>
            <img
              src="/static/assets/images/onBoardingStepOne.png"
              alt="onBoardingStepOne"
              width="100%"
            />
          </Col>
        </Row>
      </Wrapper>
      {isUpdating && <Loading />}
    </Modal>
  );
};
