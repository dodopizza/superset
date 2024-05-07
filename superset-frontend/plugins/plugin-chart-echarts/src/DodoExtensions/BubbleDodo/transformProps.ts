import { DataRecord } from '@superset-ui/core';
import { BubbleDodoTransformProps } from './types';

const getAxisColumnName: (axisInfo: string | { labelEN: string }) => string =
  axisInfo => {
    if (typeof axisInfo === 'string') {
      return axisInfo;
    }
    return axisInfo.labelEN;
  };

const DEFAULT_MAX_BUBBLE_SIZE = '25';
const DEFAULT_BUBBLE_SIZE = 10;

export default function transformProps(chartProps: BubbleDodoTransformProps) {
  const {
    height,
    width,
    queriesData,
    formData: {
      x: axisXInfo,
      y: axisYInfo,
      size: bubbleSizeInfo,
      maxBubbleSize,
      series,
      showLabels,
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
  const sizeCoefficient =
    Number(maxBubbleSize || DEFAULT_MAX_BUBBLE_SIZE) / deltaSize;

  const data = rawData.map(item => {
    const absoluteSize = Number(item[getAxisColumnName(bubbleSizeInfo)]);
    const size = absoluteSize
      ? absoluteSize * sizeCoefficient
      : DEFAULT_BUBBLE_SIZE;

    return [
      item[getAxisColumnName(axisXInfo)],
      item[getAxisColumnName(axisYInfo)],
      size,
      item[series],
    ];
  });

  console.log(`transformProps chartProps`, chartProps);
  // console.log(`transformProps rawData`, rawData);
  console.log(`transformProps data`, data);

  return {
    height,
    width,
    data,
    showLabels,
  };
}
