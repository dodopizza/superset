import React, { FC } from 'react';
import { Typography } from 'antd';
import { styled } from '@superset-ui/core';
import { Col, Row } from 'src/components';
import { Radio } from 'src/components/Radio';
import { StepOnePopupDto } from '../stepOnePopup/stepOnePopup.dto';
import Modal from '../../../../components/Modal';

const Wrapper = styled.div`
  padding: 1.5rem;
`;

enum userType {
  Franchisee = 0,
  ManagingCompany = 1,
  ManagingCompany = 1,
}

type Props = {
  isUpdating?: boolean;
  onClose: () => void;
  onSubmit?: (dto: StepOnePopupDto) => void;
};

export const StepTwoPopup: FC<Props> = ({ onClose }) => {
  const [value, setValue] = React.useState<userType>(userType.Franchisee);
  const { Title, Paragraph, Text } = Typography;

  return (
    <Modal
      show
      title="You are welcome to superset"
      hideFooter
      onHide={onClose}
      width="1000px"
    >
      <Wrapper>
        <Rowыуыышщт gutter={32}>
          <Col span={14}>
            <Title level={3}>Tell us why you are here</Title>
            <Paragraph type="secondary">
              You can read about Superset roles&nbsp;<Text underline>here</Text>
            </Paragraph>
            <Paragraph>
              Are you a franchisee or from a Managing Company?
            </Paragraph>
            <Radio.Group value={value} onChange={e => setValue(e.target.value)}>
              <Radio value={userType.Franchisee}>Franchisee</Radio>
              <Radio value={userType.ManagingCompany}>Managing Company</Radio>
            </Radio.Group>
          </Col>
          <Col span={10}>
            <img
              src="/static/assets/images/onBoardingStepTwo.png"
              alt="onBoardingStepOne"
              width="100%"
            />
          </Col>
        </Rowыуыышщт>
      </Wrapper>
    </Modal>
  );
};
