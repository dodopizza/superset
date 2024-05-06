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
    formData: {
      x: axisXInfo,
      y: axisYInfo,
      size: bubbleSizeInfo,
      max_bubble_size = '25',
    },
  } = chartProps;

  console.log(`transformProps chartProps`, chartProps);

  const rawData: Array<DataRecord> = queriesData[0].data || [];

  let minSize = Infinity;
  let maxSize = -Infinity;
  rawData.forEach(item => {
    const size = Number(item[getAxisColumnName(bubbleSizeInfo)]);
    if (size > maxSize) {
      maxSize = size;
    }
    if (size < minSize) {
      minSize = size;
    }
  });
  const deltaSize = maxSize - minSize;
  const sizeCoefficient = Number(max_bubble_size) / deltaSize;

  const data = rawData.map(item => {
    const absoluteSize = Number(item[getAxisColumnName(bubbleSizeInfo)]);
    const size = absoluteSize ? absoluteSize * sizeCoefficient : 25;

    return [
      item[getAxisColumnName(axisXInfo)],
      item[getAxisColumnName(axisYInfo)],
      size,
    ];
  });

  console.log(`transformProps chartProps`, chartProps);
  console.log(`transformProps rawData`, rawData);
  console.log(`transformProps data`, data);

  return {
    height,
    width,
    data,
  };
}
