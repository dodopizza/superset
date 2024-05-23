import React, { FC, useCallback, useMemo } from 'react';
import { Typography } from 'antd';
import { styled } from '@superset-ui/core';
import { Col, Row } from 'src/components';
import { Radio } from 'src/components/Radio';
import { RadioChangeEvent } from 'antd/lib/radio';
import { StepOnePopupDto } from '../stepOnePopup/stepOnePopup.dto';
import Modal from '../../../../components/Modal';
import { RoleInformation } from './roleInformation';

const Wrapper = styled.div`
  padding: 1.5rem;
`;

enum userFromType {
  Franchisee = 'Franchisee',
  ManagingCompany = 'Managing Company',
}

type Props = {
  isUpdating?: boolean;
  onClose: () => void;
  onSubmit?: (dto: StepOnePopupDto) => void;
};

export const StepTwoPopup: FC<Props> = ({ onClose }) => {
  const [userFrom, setUserFrom] = React.useState<userFromType>(
    userFromType.Franchisee,
  );
  const { Title, Paragraph } = Typography;

  const toggleUseFrom = useCallback(
    ({ target: { value } }: RadioChangeEvent) => setUserFrom(value),
    [],
  );

  const userFormOptions = useMemo(
    () => [userFromType.Franchisee, userFromType.ManagingCompany],
    [],
  );

  console.log(`userFrom: ${userFrom}`);

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
            <Title level={3}>Tell us why you are here</Title>
            <RoleInformation />
            <Paragraph>
              Are you a franchisee or from a Managing Company?
            </Paragraph>

            <Radio.Group
              name="userFrom"
              value={userFrom}
              onChange={toggleUseFrom}
              options={userFormOptions}
            />
          </Col>
          <Col span={10}>
            <img
              src="/static/assets/images/onBoardingStepTwo.png"
              alt="onBoardingStepOne"
              width="100%"
            />
          </Col>
        </Row>
      </Wrapper>
    </Modal>
  );
};
