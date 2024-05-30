import React, { FC, useCallback, useMemo, useState } from 'react';
import { Space, Typography } from 'antd';
import { styled } from '@superset-ui/core';
import { Col, Row } from 'src/components';
import { Radio } from 'src/components/Radio';
import { RadioChangeEvent } from 'antd/lib/radio';

import { StepOnePopupDto } from '../stepOnePopup/stepOnePopup.dto';
import Modal from '../../../../components/Modal';
import { RoleInformation } from './roleInformation';
import { Role, Team } from '../../types';
import { SelectRoles } from './selectRoles';
import { CreateOrFindTeam } from './createOrFindTeam';
import { ButtonWithTopMargin } from '../styles';

const Wrapper = styled.div`
  padding: 1.5rem;
`;

enum userFromType {
  Franchisee = 'Franchisee',
  ManagingCompany = 'Managing Company',
}

type Props = {
  loadTeamList: (query: string) => Promise<void>;
  teamList: Array<Team>;
  teamIsLoading: boolean;
  isUpdating?: boolean;
  onClose: () => void;
  onSubmit?: (dto: StepOnePopupDto) => void;
};

export const StepTwoPopup: FC<Props> = ({
  onClose,
  teamList,
  teamIsLoading,
  loadTeamList,
}) => {
  const [userFrom, setUserFrom] = useState<userFromType>(
    userFromType.Franchisee,
  );
  const [newTeam, setNewTeam] = useState<string | null>(null);
  const [existingTeam, setExistingTeam] = useState<any | null>(null);

  const [roles, setRoles] = useState<Array<Role>>([]);

  const toggleUseFrom = useCallback(
    ({ target: { value } }: RadioChangeEvent) => setUserFrom(value),
    [],
  );

  const userFormOptions = useMemo(
    () => [userFromType.Franchisee, userFromType.ManagingCompany],
    [],
  );

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

            <RoleInformation />

            <Typography.Title level={5}>
              Are you a franchisee or from a Managing Company?
            </Typography.Title>

            <Space direction="vertical" size="small">
              <Radio.Group
                name="userFrom"
                value={userFrom}
                onChange={toggleUseFrom}
                options={userFormOptions}
              />
              <span />
            </Space>

            <CreateOrFindTeam
              newTeam={newTeam}
              existingTeam={existingTeam}
              teamList={teamList}
              loadTeamList={loadTeamList}
              setExistingTeam={setExistingTeam}
              setNewTeam={setNewTeam}
              teamIsLoading={teamIsLoading}
              setRoles={setRoles}
            />

            <SelectRoles
              noTeam={!existingTeam && !newTeam}
              existingTeam={!!existingTeam}
              isFranchisee={userFrom === userFromType.Franchisee}
              roles={roles}
              setRoles={setRoles}
            />

            <ButtonWithTopMargin
              type="primary"
              htmlType="submit"
              buttonSize="default"
              disabled={(!existingTeam && !newTeam) || roles.length === 0}
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
