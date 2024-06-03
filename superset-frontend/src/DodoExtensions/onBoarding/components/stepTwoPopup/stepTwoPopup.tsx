import React, { FC } from 'react';
import { Space, Typography } from 'antd';
import { styled } from '@superset-ui/core';
import { Col, Row } from 'src/components';
import { Radio } from 'src/components/Radio';
import Modal from '../../../../components/Modal';
import { userFromEnum } from '../../types';
import { SelectRoles } from './components/selectRoles';
import { CreateOrFindTeam } from './components/createOrFindTeam';
import { ButtonWithTopMargin } from '../styles';
import { useStepTwoPopup } from './useStepTwoPopup';
import { StepTwoPopupDto } from './stepTwoPopup.dto';

const Wrapper = styled.div`
  padding: 1.5rem;
`;

type Props = {
  onClose: () => void;
  onSubmit: (dto: StepTwoPopupDto) => void;
};

const userFromOptions = [userFromEnum.Franchisee, userFromEnum.ManagingCompany];

export const StepTwoPopup: FC<Props> = ({ onClose, onSubmit }) => {
  const {
    userFrom,
    toggleUseFrom,
    newTeam,
    existingTeam,
    setRoles,
    setNewTeam,
    setExistingTeam,
    noTeam,
    roles,
    formatedTeamName,
    submit,
  } = useStepTwoPopup(onSubmit);

  const { Title } = Typography;

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

            {/* <RoleInformation /> */}

            <Typography.Title level={5}>
              Are you a franchisee or from a Managing Company?
            </Typography.Title>

            <Space direction="vertical" size="small">
              <Radio.Group
                name="userFrom"
                value={userFrom}
                onChange={toggleUseFrom}
                options={userFromOptions}
              />
              <span />
            </Space>

            <CreateOrFindTeam
              newTeam={newTeam}
              existingTeam={existingTeam}
              userFrom={userFrom}
              setRoles={setRoles}
              setNewTeam={setNewTeam}
              setExistingTeam={setExistingTeam}
              formatedTeamName={formatedTeamName}
            />

            <SelectRoles
              noTeam={noTeam}
              existingTeam={!!existingTeam}
              isFranchisee={userFrom === userFromEnum.Franchisee}
              roles={roles}
              setRoles={setRoles}
            />

            <ButtonWithTopMargin
              type="primary"
              htmlType="submit"
              buttonSize="default"
              disabled={noTeam || roles.length === 0}
              onClick={submit}
            >
              Finish onboarding
            </ButtonWithTopMargin>
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
