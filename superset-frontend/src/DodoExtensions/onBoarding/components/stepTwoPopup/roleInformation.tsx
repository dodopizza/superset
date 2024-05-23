import { List, Typography } from 'antd';
import React from 'react';
import { styled } from '@superset-ui/core';
import Popover from '../../../../components/Popover';

const RoleText = styled(Typography.Text)`
  cursor: help;
`;

const data = [
  'Racing car sprays burning fuel into crowd.',
  'Japanese princess to wed commoner.',
  'Australian walks 100km after outback crash.',
  'Man charged over missing wedding girl.',
  'Los Angeles battles huge wildfires.',
];

const content = (
  <>
    <Typography.Paragraph>
      <Typography.Title level={4}>Check Data</Typography.Title>
      <Typography.Text underline>
        What can you do with this role:
      </Typography.Text>
      <Typography.Text>Analyze available dashboards</Typography.Text>
      <Typography.Text>
        Gather insights from charts inside a dashboard
      </Typography.Text>
      <List
        header={<div>Header</div>}
        footer={<div>Footer</div>}
        bordered
        dataSource={data}
        renderItem={item => (
          <List.Item>
            <Typography.Text mark>[ITEM]</Typography.Text> {item}
          </List.Item>
        )}
      />
    </Typography.Paragraph>
    <p>Content</p>
    <p>Content</p>
  </>
);

const RoleInformation = () => {
  const { Paragraph } = Typography;
  return (
    <Paragraph type="secondary">
      You can read about Superset roles&nbsp;
      <Popover content={content} title="Superset roles overview">
        <RoleText underline>here</RoleText>
      </Popover>
    </Paragraph>
  );
};

export { RoleInformation };
