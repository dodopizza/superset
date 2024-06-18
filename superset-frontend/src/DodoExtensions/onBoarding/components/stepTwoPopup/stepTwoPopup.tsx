import React, { FC, useCallback, useMemo } from 'react';
import { Space, Tag as TagAnt, Typography } from 'antd';
import { styled, t } from '@superset-ui/core';
import { Col, Row } from 'src/components';
import { Radio } from 'src/components/Radio';
import { useSelector } from 'react-redux';
import Modal from '../../../../components/Modal';
import { userFromEnum } from '../../types';
import { SelectRoles } from './components/selectRoles';
import { ButtonWithTopMargin } from '../styles';
import { useStepTwoPopup } from './useStepTwoPopup';
import { getOnboardingFinishUpdating } from '../../model/selector/getOnboardingFinishUpdating';
import Loading from '../../../../components/Loading';
import { RequestFindTeam } from '../RequestFindTeam/requestFindTeam';
import { MIN_TEAM_NAME_LENGTH } from '../../consts';
import { getTeamName } from '../../utils/getTeamName';
import { getTeamTag } from '../../utils/getTeamTag';

const Wrapper = styled.div`
  padding: 1.5rem;
`;

const StyledSpace = styled(Space)`
  width: 100%;
`;

type Props = {
  onClose: () => void;
};

const userFromOptions = [
  { label: t(userFromEnum.Franchisee), value: userFromEnum.Franchisee },
  {
    label: t(userFromEnum.ManagingCompany),
    value: userFromEnum.ManagingCompany,
  },
];

export const StepTwoPopup: FC<Props> = ({ onClose }) => {
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
  } = useStepTwoPopup();

  const isFinishUpdating = useSelector(getOnboardingFinishUpdating);
  const { Title } = Typography;

  const tagClosable = useMemo(
    () => !!existingTeam || !!newTeam,
    [existingTeam, newTeam],
  );

  const removeTeam = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      setNewTeam(null);
      setExistingTeam(null);
      setRoles([]);
      e.preventDefault();
    },
    [setExistingTeam, setNewTeam, setRoles],
  );

  const teamDescription = useMemo(() => {
    if (existingTeam) {
      return `[${existingTeam.label} (${existingTeam.value}] ${t(
        'is a known command, so you can enter the team automatically.',
      )}`;
    }
    if ((newTeam ?? '').trim().length >= MIN_TEAM_NAME_LENGTH) {
      const name = getTeamName(userFrom, newTeam);
      const tag = getTeamTag(userFrom, newTeam);
      return `[${name} (${tag})] ${t(
        'is a new team, so Superset admins will have to evaluate this request.',
      )}`;
    }
    return '';
  }, [existingTeam, newTeam, userFrom]);

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
            <Title level={3}>{t('Tell us why you are here')}</Title>

            {/* <RoleInformation /> */}

            <Typography.Title level={5}>
              {t('Are you a franchisee or from a Managing Company?')}
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

            {/* <CreateOrFindTeam */}
            {/*  newTeam={newTeam} */}
            {/*  existingTeam={existingTeam} */}
            {/*  userFrom={userFrom} */}
            {/*  setRoles={setRoles} */}
            {/*  setNewTeam={setNewTeam} */}
            {/*  setExistingTeam={setExistingTeam} */}
            {/*  formatedTeamName={formatedTeamName} */}
            {/* /> */}

            <>
              <Typography.Title level={5}>
                {t('Create of find your team')}
              </Typography.Title>

              <StyledSpace direction="vertical" size="small">
                <Typography.Text type="secondary">
                  {t('All C-level people please select ‘c_level’')}
                </Typography.Text>

                <RequestFindTeam
                  newTeam={newTeam}
                  existingTeam={existingTeam}
                  userFrom={userFrom}
                  setExistingTeam={setExistingTeam}
                  setNewTeam={setNewTeam}
                  setRoles={setRoles}
                />

                <Space direction="horizontal" size="small">
                  <Typography.Text>{t('Your team name is')}</Typography.Text>
                  <TagAnt
                    color="#ff6900"
                    closable={tagClosable}
                    onClose={removeTeam}
                  >
                    {formatedTeamName}
                  </TagAnt>
                </Space>

                {teamDescription && (
                  <Typography.Text type="secondary">
                    {teamDescription}
                  </Typography.Text>
                )}
              </StyledSpace>
            </>

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
              loading={isFinishUpdating}
            >
              {t('Finish onboarding')}
            </ButtonWithTopMargin>
          </Col>
          <Col span={10}>
            <img
              src="/static/assets/images/onBoardingStepTwo.png"
              alt="onBoardingStepTwo"
              width="100%"
            />
          </Col>
        </Row>
      </Wrapper>
      {isFinishUpdating && <Loading />}
    </Modal>
  );
};
