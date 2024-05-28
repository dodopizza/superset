import React, { FC, useCallback, useMemo } from 'react';
import { AutoComplete, Input, Space, Tag as TagAnt, Typography } from 'antd';
import { styled } from '@superset-ui/core';
import { Col, Row } from 'src/components';
import { Radio } from 'src/components/Radio';
import { RadioChangeEvent } from 'antd/lib/radio';
import { debounce } from 'lodash';
import { StepOnePopupDto } from '../stepOnePopup/stepOnePopup.dto';
import Modal from '../../../../components/Modal';
import { RoleInformation } from './roleInformation';
import { Team } from '../../types';

const SEARCH_TEAM_DELAY = 500;

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
  const [userFrom, setUserFrom] = React.useState<userFromType>(
    userFromType.Franchisee,
  );
  const [newTeam, setNewTeam] = React.useState<string | null>(null);
  const [existingTeam, setExistingTeam] = React.useState<any | null>(null);

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
    return newTeam;
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

  // console.log(`userFrom: ${userFrom}`);

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
            <Space direction="vertical" size="small">
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
              <Paragraph type="secondary">
                <Typography.Text>
                  Create of find your team&nbsp;
                </Typography.Text>
                (all C-level people please select ‘c_level’)
              </Paragraph>

              <AutoComplete
                value={teamName}
                options={teamList}
                style={{ width: '100%' }}
                onSearch={debouncedLoadTeamList}
                onChange={handleTeamChange}
              >
                <Input.Search
                  // size="large"
                  placeholder="your team"
                  loading={teamIsLoading}
                />
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
                {/* <Tag */}
                {/*  name={teamName ?? 'no team'} */}
                {/*  editable={tagClosable} */}
                {/*  index={0} */}
                {/*  onDelete={tagClosable ? removeTeam : undefined} */}
                {/* /> */}
              </Space>
              <Paragraph type="secondary">{teamDescription}</Paragraph>
            </Space>
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
