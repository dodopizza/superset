import React, { useState } from 'react';
import { Typography } from 'antd';
import CheckboxControl from '../../../../explore/components/controls/CheckboxControl';

const useSelectRoles = () => {
  const [isAnalyzeData, setIsAnalyzeData] = useState(false);

  const Component = () => (
    <>
      <Typography.Text>
        Which use cases are you interested in using Superset for?
      </Typography.Text>
      <CheckboxControl
        hovered
        label="Analyze data"
        description="Analyze available dashboards. Gather insights from charts inside a dashboard"
        value={isAnalyzeData}
        onChange={setIsAnalyzeData}
      />
      <CheckboxControl
        hovered
        label="Create dashboards and charts"
        description="Create dashboards. Create charts"
        value={false}
        // onChange={v => this.setState({ showMarkers: v })}
      />
      <CheckboxControl
        hovered
        label="Create datasets from data from Data Platform"
        description="Create datasets from sources from Data Platform. Use SQL Lab for your Ad-hoc queries"
        value={false}
        // onChange={v => this.setState({ showMarkers: v })}
      />
      <CheckboxControl
        hovered
        label="Create datasets from data from isolated databases"
        description="Add your own data sources to Superset. Use SQL Lab for your Ad-hoc queries"
        value={false}
        // onChange={v => this.setState({ showMarkers: v })}
      />
    </>
  );

  return {
    SelectRole: Component,
  };
};

export { useSelectRoles };
