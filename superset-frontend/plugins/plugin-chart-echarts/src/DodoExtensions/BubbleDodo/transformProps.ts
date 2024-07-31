import {
  DataRecord,
  DataRecordValue,
  getValueFormatter,
} from '@superset-ui/core';
import { BubbleDodoTransformProps } from './types';

const DEFAULT_MAX_BUBBLE_SIZE = '25';
const DEFAULT_BUBBLE_SIZE = 10;

// from https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
function rgbToHex(r: number, g: number, b: number) {
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

// https://stackoverflow.com/questions/2049230/convert-rgba-color-to-rgb
function buildNewRgbWithoutOpacity(
  rgba: { red: number; green: number; blue: number; alpha: number },
  background: { red: number; green: number; blue: number; alpha: number } = {
    red: 255,
    green: 255,
    blue: 255,
    alpha: 1,
  },
): { red: number; green: number; blue: number } {
  const red = Math.round(
    (1 - rgba.alpha) * background.red + rgba.alpha * rgba.red,
  );
  const green = Math.round(
    (1 - rgba.alpha) * background.green + rgba.alpha * rgba.green,
  );
  const blue = Math.round(
    (1 - rgba.alpha) * background.blue + rgba.alpha * rgba.blue,
  );

  return { red, green, blue };
}

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
      labelFontSize,
      labelColor,
    },
  } = chartProps;

  let labelColorHEX;
  if (labelColor) {
    const withoutAlfa = buildNewRgbWithoutOpacity({
      red: labelColor.r,
      green: labelColor.g,
      blue: labelColor.b,
      alpha: labelColor.a,
    });
    labelColorHEX = rgbToHex(
      withoutAlfa.red,
      withoutAlfa.green,
      withoutAlfa.blue,
    );
  }

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
    labelFontSize,
    labelColor: labelColorHEX,
  };
}
