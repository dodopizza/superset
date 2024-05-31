import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Space, Typography } from 'antd';
import { styled } from '@superset-ui/core';
import { Col, Row } from 'src/components';
import { Radio } from 'src/components/Radio';
import { RadioChangeEvent } from 'antd/lib/radio';

import { StepOnePopupDto } from '../stepOnePopup/stepOnePopup.dto';
import Modal from '../../../../components/Modal';
import { Role, Team, userFromEnum } from '../../types';
import { SelectRoles } from './selectRoles';
import { CreateOrFindTeam } from './createOrFindTeam';
import { ButtonWithTopMargin } from '../styles';
import { MIN_NAME_LENGTH } from '../../consts';

const Wrapper = styled.div`
  padding: 1.5rem;
`;

type Props = {
  loadTeamList: (userFrom: userFromEnum, query: string) => Promise<void>;
  teamList: Array<Team>;
  teamIsLoading: boolean;
  isUpdating?: boolean;
  onClose: () => void;
  onSubmit?: (dto: StepOnePopupDto) => void;
};

const userFromOptions = [userFromEnum.Franchisee, userFromEnum.ManagingCompany];

export const StepTwoPopup: FC<Props> = ({
  onClose,
  teamList,
  teamIsLoading,
  loadTeamList,
}) => {
  const [userFrom, setUserFrom] = useState<userFromEnum>(
    userFromEnum.Franchisee,
  );
  const [newTeam, setNewTeam] = useState<string | null>(null);
  const [existingTeam, setExistingTeam] = useState<any | null>(null);

  const [roles, setRoles] = useState<Array<Role>>([]);

  const toggleUseFrom = useCallback(
    ({ target: { value } }: RadioChangeEvent) => {
      setUserFrom(value);
      setExistingTeam(null);
      setNewTeam(null);
      setRoles([]);
    },
    [],
  );

  const loadTeamsByUserFrom = useCallback(
    (query: string) => loadTeamList(userFrom, query),
    [],
  );

  const noTeam = useMemo(
    () => !existingTeam && (newTeam ?? '').trim().length < MIN_NAME_LENGTH,
    [existingTeam, newTeam],
  );

  useEffect(() => {
    if (noTeam) {
      setRoles([]);
    }
  }, [noTeam]);

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
              teamList={teamList}
              teamIsLoading={teamIsLoading}
              userFrom={userFrom}
              setRoles={setRoles}
              setNewTeam={setNewTeam}
              loadTeamList={loadTeamsByUserFrom}
              setExistingTeam={setExistingTeam}
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
