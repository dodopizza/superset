import React from 'react';
import Echart from '../../components/Echart';
import { BubbleDodoComponentProps } from './types';

export default function BubbleDodo({
  height,
  width,
  dimensionList,
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
      right: '10%',
      top: '5%',
      data: [...dimensionList],
    },
    xAxis: {},
    yAxis: {},
    series: dimensionList.map(
      (dimension, index) => ({
        name: dimension,
        // symbolSize: 20,
        symbolSize(data: Array<number | string>) {
          return data[2];
        },
        data: data[index],
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
      }),
      // {
      //   name: 'one',
      //   symbolSize(data: Array<number | string>) {
      //     return data[2];
      //   },
      //   data: data.slice(1, 100),
      //   type: 'scatter',
      //   // emphasis: {
      //   //   // focus: 'series',
      //   //   label: {
      //   //     show: true,
      //   //     formatter(param) {
      //   //       return param.data[3];
      //   //     },
      //   //     position: 'top',
      //   //   },
      //   // },
      //   label: {
      //     show: showLabels,
      //     // Text of labels.
      //     formatter(param: { data: Array<number | string> }) {
      //       return param.data[3];
      //     },
      //     position: 'top',
      //   },
      // },
      // {
      //   name: 'two',
      //   symbolSize(data: number) {
      //     return data[2];
      //   },
      //   data: data.slice(101),
      //   type: 'scatter',
      //   // emphasis: {
      //   //   // focus: 'series',
      //   //   label: {
      //   //     show: true,
      //   //     formatter(param) {
      //   //       return param.data[3];
      //   //     },
      //   //     position: 'top',
      //   //   },
      //   // },
      //   label: {
      //     show: showLabels,
      //     // Text of labels.
      //     formatter(param: { data: Array<number | string> }) {
      //       return param.data[3];
      //     },
      //     position: 'top',
      //   },
      // },
    ),
  };

  console.log(`===option`, option);
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
