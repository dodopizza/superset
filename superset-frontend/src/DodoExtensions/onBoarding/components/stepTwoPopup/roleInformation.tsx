import { List, Typography } from 'antd';
import React, { FC } from 'react';
import { styled } from '@superset-ui/core';
import Popover from '../../../../components/Popover';

const RoleText = styled(Typography.Text)`
  cursor: help;
`;

const checkData: Array<string> = [
  'Analyze available dashboards',
  'Gather insights from charts inside a dashboard',
];

const createData: Array<string> = [
  'Create datasets from sources from Data Platform',
  'Use SQL Lab for your Ad-hoc queries',
];

const useData: Array<string> = ['Create dashboards', 'Create charts'];

const inputData: Array<string> = [
  'Add your own data sources to Superset',
  'Use SQL Lab for your Ad-hoc queries',
];

const StyledList = styled(List)`
  & .ant-list-header {
    border: none;
  }

  & .ant-list-item {
    border: none;
  }
`;

const RoleInfo: FC<{ title: string; data: Array<string> }> = ({
  title,
  data,
}) => (
  <Typography.Paragraph>
    <StyledList
      header={
        <>
          <Typography.Title level={5}>{title}</Typography.Title>
          <Typography.Text underline>
            What can you do with this role:
          </Typography.Text>
        </>
      }
      dataSource={data}
      renderItem={(item: string) => <List.Item>{item}</List.Item>}
    />
  </Typography.Paragraph>
);

const content = (
  <>
    <RoleInfo title="Check Data" data={checkData} />
    <RoleInfo title="Create Data" data={createData} />
    <RoleInfo title="Use Data" data={useData} />
    <RoleInfo title="Input Data" data={inputData} />
  </>
);

const RoleInformation = () => {
  const { Paragraph } = Typography;
  return (
    <Paragraph type="secondary">
      You can read about Superset roles&nbsp;
      <Popover
        content={content}
        title={
          <Typography.Title level={4}>Superset roles overview</Typography.Title>
        }
      >
        <RoleText underline>here</RoleText>
      </Popover>
    </Paragraph>
  );
};

export { RoleInformation };
