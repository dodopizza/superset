import React, { FC, useCallback, useMemo, useState } from 'react';
import { AutoComplete, Input, Space, Tag as TagAnt, Typography } from 'antd';
import { styled } from '@superset-ui/core';
import { Col, Row } from 'src/components';
import { Radio } from 'src/components/Radio';
import { RadioChangeEvent } from 'antd/lib/radio';
import { debounce } from 'lodash';
import { StepOnePopupDto } from '../stepOnePopup/stepOnePopup.dto';
import Modal from '../../../../components/Modal';
import { RoleInformation } from './roleInformation';
import { Role, Team } from '../../types';
import { UseSelectRoles, useSelectRoles } from './useSelectRoles';

const SEARCH_TEAM_DELAY = 500;

const Wrapper = styled.div`
  padding: 1.5rem;
`;

const StyledSpace = styled(Space)`
  width: 100%;
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

  const [isAnalyzeData, setIsAnalyzeData] = useState(true);
  const [isCreateDashboards, setIsCreateDashboards] = useState(false);
  const [isCreateDatasetDataPlatform, setIsCreateDatasetDataPlatform] =
    useState(true);
  const [isCreateDatasetIsolatedDB, setIsCreateDatasetIsolatedDB] =
    useState(false);

  const [roles, setRoles] = useState<Array<Role>>([]);

  const toggleUseFrom = useCallback(
    ({ target: { value } }: RadioChangeEvent) => setUserFrom(value),
    [],
  );

  const userFormOptions = useMemo(
    () => [userFromType.Franchisee, userFromType.ManagingCompany],
    [],
  );

  const debouncedLoadTeamList = useMemo(
    () => debounce((value: string) => loadTeamList(value), SEARCH_TEAM_DELAY),
    [loadTeamList],
  );

  const handleTeamChange: (value: string, option: any) => void = useCallback(
    (value, option) => {
      if (!!option.value && !!option.label) {
        setExistingTeam(option);
        setNewTeam(null);
      } else {
        if (value) {
          setNewTeam(value);
        } else {
          setNewTeam(null);
        }
        setExistingTeam(null);
      }
    },
    [],
  );

  const teamName = useMemo(() => {
    if (existingTeam) {
      return existingTeam.label;
    }
    if (newTeam) {
      return newTeam;
    }
    return null;
  }, [existingTeam, newTeam]);

  const tagClosable = useMemo(
    () => !!existingTeam || !!newTeam,
    [existingTeam, newTeam],
  );

  const teamDescription = useMemo(() => {
    if (existingTeam) {
      return `Since [${existingTeam.label}] is a known tag, you can enter the team automatically.`;
    }
    if (newTeam) {
      return `Since [${newTeam}] is a new tag, Superset admins will have to evaluate this request.`;
    }
    return '';
  }, [existingTeam, newTeam]);

  const removeTeam = useCallback((e: React.MouseEvent<HTMLElement>) => {
    setNewTeam(null);
    setExistingTeam(null);
    e.preventDefault();
  }, []);

  console.log(`roles: ${JSON.stringify(roles)}`);

  // console.log(
  //   `isAnalyzeData:${isAnalyzeData} isCreateDashboards:${isCreateDashboards} isCreateDatasetDataPlatform:${isCreateDatasetDataPlatform} isCreateDatasetIsolatedDB:${isCreateDatasetIsolatedDB}`,
  // );

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
              {/* <Typography.Text> */}
              {/*  Are you a franchisee or from a Managing Company? */}
              {/* </Typography.Text> */}
              <Radio.Group
                name="userFrom"
                value={userFrom}
                onChange={toggleUseFrom}
                options={userFormOptions}
              />
              <span />
            </Space>

            <Typography.Title level={5}>
              Create of find your team
            </Typography.Title>

            <StyledSpace direction="vertical" size="small">
              <Typography.Text type="secondary">
                All C-level people please select ‘c_level’
              </Typography.Text>

              <AutoComplete
                value={teamName}
                options={teamList}
                style={{ width: '100%' }}
                onSearch={debouncedLoadTeamList}
                onChange={handleTeamChange}
              >
                <Input.Search placeholder="your team" loading={teamIsLoading} />
              </AutoComplete>

              <Space direction="horizontal" size="small">
                <Typography.Text>Your team name is</Typography.Text>
                <TagAnt
                  color="#ff6900"
                  closable={tagClosable}
                  onClose={removeTeam}
                >
                  {teamName ?? 'no team'}
                </TagAnt>
              </Space>

              {teamDescription && (
                <Typography.Text type="secondary">
                  {teamDescription}
                </Typography.Text>
              )}
            </StyledSpace>

            <UseSelectRoles
              noTeam={!teamName}
              existingTeam={!!existingTeam}
              isFranchisee={userFrom === userFromType.Franchisee}
              roles={roles}
              setRoles={setRoles}
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
