import React, { useEffect } from 'react';
import ecStat from 'echarts-stat';
import Echart from '../../components/Echart';
import { BubbleDodoComponentProps } from './types';

const CLUSTER_COUNT = 6;
const DIENSIION_CLUSTER_INDEX = 2;
const COLOR_ALL = [
  '#37A2DA',
  '#e06343',
  '#37a354',
  '#b55dba',
  '#b5bd48',
  '#8378EA',
  '#96BFFF',
];
const pieces = [];
for (let i = 0; i < CLUSTER_COUNT; i++) {
  pieces.push({
    value: i,
    label: `cluster ${i}`,
    color: COLOR_ALL[i],
  });
}

export default function BubbleDodo({
  height,
  width,
  data,
  // @ts-ignore
  refs,
  ...rest
}: BubbleDodoComponentProps) {
  // const option1 = {
  //   xAxis: {},
  //   yAxis: {},
  //   series: [
  //     {
  //       symbolSize: 20,
  //       data,
  //       type: 'scatter',
  //     },
  //   ],
  // };

  const option = {
    dataset: [
      {
        source: data,
      },
      {
        transform: {
          type: 'ecStat:clustering',
          // print: true,
          config: {
            clusterCount: CLUSTER_COUNT,
            outputType: 'single',
            outputClusterIndexDimension: DIENSIION_CLUSTER_INDEX,
          },
        },
      },
    ],
    tooltip: {
      position: 'top',
    },
    visualMap: {
      type: 'piecewise',
      top: 'middle',
      min: 0,
      max: CLUSTER_COUNT,
      left: 10,
      splitNumber: CLUSTER_COUNT,
      dimension: DIENSIION_CLUSTER_INDEX,
      pieces,
    },
    grid: {
      left: 120,
    },
    xAxis: {},
    yAxis: {},
    series: {
      type: 'scatter',
      encode: { tooltip: [0, 1] },
      symbolSize: 15,
      itemStyle: {
        borderColor: '#555',
      },
      datasetIndex: 1,
    },
  };

  return (
    <Echart
      // eventHandlers={eventHandlers}
      // selectedValues={selectedValues}
      refs={refs}
      height={height}
      width={width}
      echartOptions={option}
      ecStatTransformRegister="clustering"
    />
  );
}
