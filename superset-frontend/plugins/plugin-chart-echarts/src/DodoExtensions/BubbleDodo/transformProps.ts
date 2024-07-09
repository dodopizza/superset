import { DataRecord, DataRecordValue } from '@superset-ui/core';
import { BubbleDodoTransformProps } from './types';

const DEFAULT_MAX_BUBBLE_SIZE = '25';
const DEFAULT_BUBBLE_SIZE = 10;

export default function transformProps(chartProps: BubbleDodoTransformProps) {
  const {
    height,
    width,
    queriesData,
    formData: {
      series, // dimension on form
      entity, // entity on form
      x: axisXInfo,
      y: axisYInfo,
      size: bubbleSizeInfo,
      maxBubbleSize,
      showLabels,
      showDimension,
      marginTopInPixel,
      scrollDimensions,
    },
  } = chartProps;

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

  const data: DataRecordValue[][][] = [];

  dimensionList.forEach(dimension => {
    const dimensionData = rawData
      .filter(item => item[series] === dimension)
      .map(item => {
        const absoluteSize = Number(item[bubbleSizeInfo]);
        const size = absoluteSize
          ? absoluteSize * sizeCoefficient
          : DEFAULT_BUBBLE_SIZE;

        return [item[axisXInfo], item[axisYInfo], size, item[entity]];
      });
    data.push(dimensionData);
  });

  console.log(`transformProps data`, data);

  const marginAsInt = parseInt(marginTopInPixel, 10);
  const marginTop = marginAsInt > 0 ? marginAsInt : 0;

  return {
    height,
    width,
    data,
    showLabels,
    showDimension,
    marginTop,
    dimensionList,
    scrollDimensions,
  };
}
