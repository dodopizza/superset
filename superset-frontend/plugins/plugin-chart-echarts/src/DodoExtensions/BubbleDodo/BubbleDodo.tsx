import React, { useMemo } from 'react';
import Echart from '../../components/Echart';
import { BubbleDodoComponentProps } from './types';

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

  const option = useMemo(
    () => ({
      tooltip: {
        show: true,
        formatter(param: { data: Array<number | string> }) {
          return `${param.data[3]} <br/> 
                    x:${param.data[0]} <br/> 
                    y:${param.data[1]} <br/>
                    size:${param.data[2]}`;
        },
        position: 'top',
      },
      legend,
      grid,
      xAxis: {
        type: xLogScale ? 'log' : 'value',
        name: xAxisName,
        nameLocation: xNameLocation,
        nameGap: xNameGap,
        scale: true,
        nameTextStyle: {
          fontWeight: 'bold',
        },
      },
      yAxis: {
        type: yLogScale ? 'log' : 'value',
        name: yAxisName,
        nameLocation: yNameLocation,
        nameGap: yNameGap,
        scale: true,
        nameTextStyle: {
          fontWeight: 'bold',
        },
      },
      series: dimensionList.map((dimension, index) => ({
        name: dimension,
        symbolSize(data: Array<number | string>) {
          return data[2];
        },
        data: data[index],
        type: 'scatter',
        label: {
          show: showLabels,
          // Text of labels.
          formatter(param: { data: Array<number | string> }) {
            return param.data[3];
          },
          position: 'top',
        },
      })),
    }),
    [
      data,
      dimensionList,
      grid,
      legend,
      showLabels,
      xAxisName,
      xLogScale,
      xNameGap,
      xNameLocation,
      yAxisName,
      yLogScale,
      yNameGap,
      yNameLocation,
    ],
  );

  return (
    <Echart refs={refs} height={height} width={width} echartOptions={option} />
  );
}
