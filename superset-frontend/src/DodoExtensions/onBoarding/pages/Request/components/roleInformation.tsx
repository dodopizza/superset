import React, { FC } from 'react';
import { Col, List, Row, Typography } from 'antd';

const analyseData: Array<string> = [
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

const ifCLevel: Array<string> = ['give: c_level'];

const ifFranchisees: Array<string> = ['даем: fr_{фамилия}_{имя}'];

const ifManagementCompany: Array<string> = ['даем: по названию команды'];

const RoleInfo: FC<{ title?: string; text?: string; data: Array<string> }> = ({
  title,
  text = 'What can you do with this role:',
  data,
}) => (
  <Typography.Paragraph>
    <List
      header={
        <>
          {title && <Typography.Title level={5}>{title}</Typography.Title>}
          <Typography.Text underline>{text}</Typography.Text>
        </>
      }
      dataSource={data}
      renderItem={(item: string) => <List.Item>{item}</List.Item>}
    />
  </Typography.Paragraph>
);

export const RoleInformation = () => (
  <>
    <Typography.Title level={5}>
      Кому давать какие команды и роли?
    </Typography.Title>
    <Row gutter={12}>
      <Col span={8}>
        <RoleInfo text="If this is C-level:" data={ifCLevel} />
      </Col>
      <Col span={8}>
        <RoleInfo text="Если это френчайзи:" data={ifFranchisees} />
      </Col>
      <Col span={8}>
        <RoleInfo text="Если это сотрудник УК:" data={ifManagementCompany} />
      </Col>
    </Row>
    <Row gutter={12}>
      <Col span={6}>
        <RoleInfo title="Analyse Data" data={analyseData} />
      </Col>
      <Col span={6}>
        <RoleInfo title="Use Data" data={useData} />
      </Col>
      <Col span={6}>
        <RoleInfo title="Create Data" data={createData} />
      </Col>
      <Col span={6}>
        <RoleInfo title="Input Data" data={inputData} />
      </Col>
    </Row>
  </>
);
