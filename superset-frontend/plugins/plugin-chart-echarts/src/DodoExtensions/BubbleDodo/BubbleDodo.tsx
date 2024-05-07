import React from 'react';
import Echart from '../../components/Echart';
import { BubbleDodoComponentProps } from './types';

// const CLUSTER_COUNT = 6;
// const DIENSIION_CLUSTER_INDEX = 2;
// const COLOR_ALL = [
//   '#37A2DA',
//   '#e06343',
//   '#37a354',
//   '#b55dba',
//   '#b5bd48',
//   '#8378EA',
//   '#96BFFF',
// ];
// const pieces = [];
// for (let i = 0; i < CLUSTER_COUNT; i++) {
//   pieces.push({
//     value: i,
//     label: `cluster ${i}`,
//     color: COLOR_ALL[i],
//   });
// }

export default function BubbleDodo({
  height,
  width,
  data,
  showLabels,
  // @ts-ignore
  refs,
  ...rest
}: BubbleDodoComponentProps) {
  const option = {
    title: {
      text: 'ECharts Getting Started Example',
    },
    tooltip: {
      show: true,
      // Text of labels.
      formatter(param: { data: Array<number | string> }) {
        return `${param.data[3]} <br/> 
                    x:${param.data[0]} <br/> 
                    y:${param.data[1]}`;
      },
      position: 'top',
    },
    legend: {
      data: ['one', 'two'],
    },
    xAxis: {},
    yAxis: {},
    series: [
      {
        name: 'one',
        symbolSize(data: Array<number | string>) {
          return data[2];
        },
        data: data.slice(1, 100),
        type: 'scatter',
        // emphasis: {
        //   // focus: 'series',
        //   label: {
        //     show: true,
        //     formatter(param) {
        //       return param.data[3];
        //     },
        //     position: 'top',
        //   },
        // },
        label: {
          show: showLabels,
          // Text of labels.
          formatter(param: { data: Array<number | string> }) {
            return param.data[3];
          },
          position: 'top',
        },
      },
      {
        name: 'two',
        symbolSize(data: number) {
          return data[2];
        },
        data: data.slice(101),
        type: 'scatter',
        // emphasis: {
        //   // focus: 'series',
        //   label: {
        //     show: true,
        //     formatter(param) {
        //       return param.data[3];
        //     },
        //     position: 'top',
        //   },
        // },
        label: {
          show: showLabels,
          // Text of labels.
          formatter(param: { data: Array<number | string> }) {
            return param.data[3];
          },
          position: 'top',
        },
      },
    ],
  };

  // const option = {
  //   dataset: [
  //     {
  //       source: data,
  //     },
  //     {
  //       transform: {
  //         type: 'ecStat:clustering',
  //         // print: true,
  //         config: {
  //           clusterCount: CLUSTER_COUNT,
  //           outputType: 'single',
  //           outputClusterIndexDimension: DIENSIION_CLUSTER_INDEX,
  //         },
  //       },
  //     },
  //   ],
  //   tooltip: {
  //     position: 'top',
  //   },
  //   visualMap: {
  //     type: 'piecewise',
  //     top: 'middle',
  //     min: 0,
  //     max: CLUSTER_COUNT,
  //     left: 10,
  //     splitNumber: CLUSTER_COUNT,
  //     dimension: DIENSIION_CLUSTER_INDEX,
  //     pieces,
  //   },
  //   grid: {
  //     left: 120,
  //   },
  //   xAxis: {},
  //   yAxis: {},
  //   series: {
  //     type: 'scatter',
  //     encode: { tooltip: [0, 1] },
  //     symbolSize: 15,
  //     itemStyle: {
  //       borderColor: '#555',
  //     },
  //     datasetIndex: 1,
  //   },
  // };
  //
  // debugger;

  return (
    <Echart
      // eventHandlers={eventHandlers}
      // selectedValues={selectedValues}
      refs={refs}
      height={height}
      width={width}
      echartOptions={option}
      // ecStatTransformRegister="clustering"
    />
  );
}
