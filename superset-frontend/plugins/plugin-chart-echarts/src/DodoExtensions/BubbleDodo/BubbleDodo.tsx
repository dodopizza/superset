import React from 'react';
import Echart from '../../components/Echart';
import { BubbleDodoComponentProps } from './types';

export default function BubbleDodo({
  height,
  width,
  data,
  // @ts-ignore
  refs,
  ...rest
}: BubbleDodoComponentProps) {
  const option = {
    xAxis: {},
    yAxis: {},
    series: [
      {
        symbolSize: 20,
        data,
        type: 'scatter',
      },
    ],
  };

  console.log(`BubbleDodo rest`, rest);

  return (
    <Echart
      // eventHandlers={eventHandlers}
      // selectedValues={selectedValues}
      refs={refs}
      height={height}
      width={width}
      echartOptions={option}
    />
  );
}
