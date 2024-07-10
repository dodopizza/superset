import React, { useMemo } from 'react';
import { EChartsCoreOption } from 'echarts';
import Echart from '../../components/Echart';
import { BubbleDodoComponentProps } from './types';

const getNumber = (value: number | string) =>
  typeof value === 'number' ? value : parseFloat(value);

const xIndex = 0;
const yIndex = 1;
const sizeIndex = 2;
const absoluteSizeIndex = 3;
const entryIndex = 4;

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
  // @ts-ignore
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
      show: true,
      formatter(param: { data: Array<number | string> }) {
        const x = getNumber(param.data[xIndex]);
        const y = getNumber(param.data[yIndex]);
        const size = getNumber(param.data[absoluteSizeIndex]);
        return `${param.data[entryIndex]} <br/> 
                    x: ${xAxisFormatter(x)} <br/> 
                    y: ${yAxisFormatter(y)} <br/>
                    size: ${sizeFormatter(size)}`;
      },
      position: 'top',
    }),
    [sizeFormatter, xAxisFormatter, yAxisFormatter],
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
    }),
    [xAxisName, xLogScale, xNameGap, xNameLocation],
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
    }),
    [yAxisName, yLogScale, yNameGap, yNameLocation],
  );

  const series = useMemo(
    () =>
      dimensionList.map((dimension, index) => ({
        name: dimension,
        symbolSize(data: Array<number | string>) {
          return data[sizeIndex];
        },
        data: data[index],
        type: 'scatter',
        label: {
          show: showLabels,
          // Text of labels.
          formatter(param: { data: Array<number | string> }) {
            return param.data[entryIndex];
          },
          position: 'top',
        },
      })),
    [data, dimensionList, showLabels],
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
