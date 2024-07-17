import {
  DataRecord,
  DataRecordValue,
  getValueFormatter,
} from '@superset-ui/core';
import { BubbleDodoTransformProps } from './types';

const DEFAULT_MAX_BUBBLE_SIZE = '25';
const DEFAULT_BUBBLE_SIZE = 10;

const getIntPositive = (value: string) => {
  const asInt = parseInt(value, 10);
  return asInt > 0 ? asInt : 0;
};

const getFormatter = (d3Format: string) =>
  getValueFormatter(undefined, {}, {}, d3Format, undefined);

const defaultDimension = 'no dimension';

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
      xAxisName,
      yAxisName,
      xLogScale,
      yLogScale,
      xNameGapInPixel,
      xNameLocation,
      yNameGapInPixel,
      yNameLocation,
      xAxisFormat,
      yAxisFormat,
      sizeFormat,
      labelLocation,
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
    ...new Set(rawData.map(item => item[series] ?? defaultDimension)),
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
      .filter(item => (item[series] ?? defaultDimension) === dimension)
      .map(item => {
        const absoluteSize = Number(item[bubbleSizeInfo]);
        const size = absoluteSize
          ? absoluteSize * sizeCoefficient
          : DEFAULT_BUBBLE_SIZE;

        return [
          item[axisXInfo],
          item[axisYInfo],
          size,
          absoluteSize,
          item[entity],
        ];
      });
    data.push(dimensionData);
  });

  const marginTop = getIntPositive(marginTopInPixel);
  const xNameGap = getIntPositive(xNameGapInPixel);
  const yNameGap = getIntPositive(yNameGapInPixel);
  const xAxisFormatter = getFormatter(xAxisFormat);
  const yAxisFormatter = getFormatter(yAxisFormat);
  const sizeFormatter = getFormatter(sizeFormat);

  return {
    height,
    width,
    data,
    showLabels,
    showDimension,
    marginTop,
    dimensionList,
    scrollDimensions,
    xAxisName,
    yAxisName,
    xLogScale,
    yLogScale,
    xNameGap,
    xNameLocation,
    yNameGap,
    yNameLocation,
    xAxisFormatter,
    yAxisFormatter,
    sizeFormatter,
    labelLocation,
  };
}
