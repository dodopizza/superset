import { DataRecord } from '@superset-ui/core';
import { BubbleDodoTransformProps } from './types';

const getAxisColumnName: (axisInfo: string | { labelEN: string }) => string =
  axisInfo => {
    if (typeof axisInfo === 'string') {
      return axisInfo;
    }
    return axisInfo.labelEN;
  };

export default function transformProps(chartProps: BubbleDodoTransformProps) {
  const {
    height,
    width,
    queriesData,
    formData: { x: axisXInfo, y: axisYInfo },
  } = chartProps;

  console.log(`transformProps chartProps`, chartProps);

  const rawData: Array<DataRecord> = queriesData[0].data || [];

  const data = rawData.map(item =>
    // debugger;
    [item[getAxisColumnName(axisXInfo)], item[getAxisColumnName(axisYInfo)]],
  );

  console.log(`transformProps chartProps`, chartProps);
  console.log(`transformProps rawData`, rawData);
  console.log(`transformProps data`, data);

  return {
    height,
    width,
    data,
  };
}
