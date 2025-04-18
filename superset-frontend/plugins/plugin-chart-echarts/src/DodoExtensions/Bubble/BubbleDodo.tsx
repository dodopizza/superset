import { useMemo } from 'react';
import { EChartsCoreOption } from 'echarts';
import Echart from '../../components/Echart';
import { BubbleDodoComponentProps } from './types';

const getNumber = (value: number | string) =>
  typeof value === 'number' ? value : parseFloat(value);

const X_INDEX = 0;
const Y_INDEX = 1;
const SIZE_INDEX = 2;
const ABSOLUTE_SIZE_INDEX = 3;
const ENTRY_INDEX = 4;
const DEFAULT_LABEL_FONT_SIZE = 12;

export default function BubbleDodo({
  height,
  width,
  dimensionList,
  data,
  showLabels,
  showDimension,
  marginTop,
  scrollDimensions,
  xAxisName,
  yAxisName,
  xLogScale,
  yLogScale,
  xNameLocation,
  xNameGap,
  yNameLocation,
  yNameGap,
  xAxisFormatter,
  yAxisFormatter,
  sizeFormatter,
  labelLocation,
  labelFontSize,
  labelColor,
  tooltipLabels,
  refs,
}: BubbleDodoComponentProps) {
  const grid = useMemo(
    () =>
      marginTop > 0
        ? {
            top: marginTop,
          }
        : undefined,
    [marginTop],
  );

  const legend = useMemo(
    () => ({
      data: showDimension ? [...dimensionList] : [],
      type: scrollDimensions ? 'scroll' : undefined,
    }),
    [dimensionList, scrollDimensions, showDimension],
  );

  const tooltip = useMemo(
    () => ({
      appendToBody: true,
      show: true,
      formatter(param: { data: Array<number | string> }) {
        const x = getNumber(param.data[X_INDEX]);
        const y = getNumber(param.data[Y_INDEX]);
        const size = getNumber(param.data[ABSOLUTE_SIZE_INDEX]);
        return `${param.data[ENTRY_INDEX]} <br/> 
                    ${tooltipLabels.x}: ${xAxisFormatter(x)} <br/> 
                    ${tooltipLabels.y}: ${yAxisFormatter(y)} <br/>
                    ${tooltipLabels.size}: ${sizeFormatter(size)}`;
      },
      position: 'top',
    }),
    [
      tooltipLabels.x,
      tooltipLabels.y,
      tooltipLabels.size,
      xAxisFormatter,
      yAxisFormatter,
      sizeFormatter,
    ],
  );

  const xAxis = useMemo(
    () => ({
      type: xLogScale ? 'log' : 'value',
      name: xAxisName,
      nameLocation: xNameLocation,
      nameGap: xNameGap,
      scale: true,
      nameTextStyle: {
        fontWeight: 'bold',
      },
      axisLabel: {
        hideOverlap: true,
        formatter: xAxisFormatter,
      },
    }),
    [xAxisFormatter, xAxisName, xLogScale, xNameGap, xNameLocation],
  );

  const yAxis = useMemo(
    () => ({
      type: yLogScale ? 'log' : 'value',
      name: yAxisName,
      nameLocation: yNameLocation,
      nameGap: yNameGap,
      scale: true,
      nameTextStyle: {
        fontWeight: 'bold',
      },
      axisLabel: {
        hideOverlap: true,
        formatter: yAxisFormatter,
      },
    }),
    [yAxisFormatter, yAxisName, yLogScale, yNameGap, yNameLocation],
  );

  const series = useMemo(
    () =>
      dimensionList.map((dimension, index) => ({
        name: dimension,
        symbolSize(data: Array<number | string>) {
          return data[SIZE_INDEX];
        },
        data: data[index],
        type: 'scatter',
        label: {
          show: showLabels,
          // Text of labels.
          formatter(param: { data: Array<number | string> }) {
            return param.data[ENTRY_INDEX];
          },
          position: labelLocation ?? 'top',
          fontSize: getNumber(labelFontSize) || DEFAULT_LABEL_FONT_SIZE,
          color: labelColor || undefined,
        },
      })),
    [data, dimensionList, labelLocation, showLabels],
  );

  const option: EChartsCoreOption = useMemo(
    () => ({
      tooltip,
      legend,
      grid,
      xAxis,
      yAxis,
      series,
    }),
    [grid, legend, series, tooltip, xAxis, yAxis],
  );

  return (
    <Echart refs={refs} height={height} width={width} echartOptions={option} />
  );
}
