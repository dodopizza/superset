import React, { FC } from 'react';
import { Col, Row } from 'src/components';
import { Typography } from 'antd';
import { styled, t } from '@superset-ui/core';
import { Link } from 'react-router-dom';
import Modal from '../../../../components/Modal';

const Wrapper = styled.div`
  padding: 1.5rem;
`;

type Props = {
  onClose: () => void;
};

export const StepThreePopup: FC<Props> = ({ onClose }) => {
  const { Title, Paragraph } = Typography;

  console.log(`StepThreePopup render`);

  return (
    <Modal
      show
      title={t('You are welcome to Superset')}
      hideFooter
      onHide={onClose}
      width="1000px"
    >
      <Wrapper>
        <Row gutter={32}>
          <Col span={14}>
            <Title level={3}>{t('You request created')}</Title>
            <Paragraph type="secondary">
              {t(
                'Request will be proceed by administrators. You can see your requests in',
              )}
              <Link to="/superset/profile/" target="_blank">
                &nbsp;{t('profile')}.
              </Link>
            </Paragraph>
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
    </Modal>
  );
};