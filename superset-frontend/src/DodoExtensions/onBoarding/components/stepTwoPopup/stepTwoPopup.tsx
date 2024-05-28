import React, { FC, useCallback, useMemo } from 'react';
import { AutoComplete, Space, Typography } from 'antd';
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

  const { Title, Paragraph } = Typography;

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

  // console.log(`userFrom: ${userFrom}`);

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
              <span>teamIsLoading: {teamIsLoading && 'loading'}</span>
              <AutoComplete
                options={teamList}
                style={{ width: '100%' }}
                onSelect={console.log}
                onSearch={debouncedLoadTeamList}
                placeholder="your team"
              />
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
