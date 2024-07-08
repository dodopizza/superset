import { DataRecord, DataRecordValue } from '@superset-ui/core';
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
      series, // dimension on form
      entity, // entity on form
      showLabels,
    },
  } = chartProps;

  // console.log(`transformProps chartProps`, chartProps);
  // console.log(`transformProps queriesData`, queriesData);

  const rawData: Array<DataRecord> = (queriesData[0].data || []).filter(
    item =>
      item[axisXInfo] !== null &&
      item[axisXInfo] !== undefined &&
      item[axisYInfo] !== null &&
      item[axisYInfo] !== undefined,
  );

  const dimensionList: DataRecordValue[] = [
    ...new Set(rawData.map(item => item[series])),
  ];

  // console.log(`transformProps dimensionList`, dimensionList);

  let minSize = Infinity;
  let maxSize = -Infinity;
  rawData.forEach(item => {
    const size = Number(item[bubbleSizeInfo]);
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

  // const data = rawData.map(item => {
  //   const absoluteSize = Number(item[getAxisColumnName(bubbleSizeInfo)]);
  //   const size = absoluteSize
  //     ? absoluteSize * sizeCoefficient
  //     : DEFAULT_BUBBLE_SIZE;
  //
  //   return [
  //     item[getAxisColumnName(axisXInfo)],
  //     item[getAxisColumnName(axisYInfo)],
  //     size,
  //     item[series],
  //   ];
  // });

  const data: DataRecordValue[][][] = [];

  dimensionList.forEach(dimension => {
    const dimensionData = rawData
      .filter(
        item => item[series] === dimension,
        // item[axisXInfo] !== null &&
        // item[axisXInfo] !== undefined &&
        // item[axisYInfo] !== null &&
        // item[axisYInfo] !== undefined,
      )
      .map(item => {
        const absoluteSize = Number(item[bubbleSizeInfo]);
        const size = absoluteSize
          ? absoluteSize * sizeCoefficient
          : DEFAULT_BUBBLE_SIZE;

        return [item[axisXInfo], item[axisYInfo], size];
      });
    data.push(dimensionData);
  });

  // console.log(`transformProps dimensionList`, dimensionList);
  console.log(`transformProps rawData`, rawData);
  console.log(`transformProps data`, data);

  return {
    height,
    width,
    data,
    showLabels,
    dimensionList,
  };
}
