import {
  ChartDataResponseResult,
  ChartProps,
  DataRecordValue,
  QueryFormData,
  ValueFormatter,
} from '@superset-ui/core';

type BubbleDodoFormData = QueryFormData & {
  maxBubbleSize: string;
  showLabels: boolean;

  showDimension: boolean;
  marginTopInPixel: string;
  scrollDimensions: boolean;

  xLogScale: boolean;
  xAxisName: string;
  xNameLocation: string;
  xNameGapInPixel: string;
  xAxisFormat: string;

  yLogScale: boolean;
  yAxisName: string;
  yNameLocation: string;
  yNameGapInPixel: string;
  yAxisFormat: string;

  sizeFormat: string;
};

export interface BubbleDodoTransformProps extends ChartProps {
  formData: BubbleDodoFormData;
  queriesData: ChartDataResponseResult[];
}

export type BubbleDodoComponentProps = {
  height: number;
  width: number;
  dimensionList: DataRecordValue[];
  data: DataRecordValue[][][];
  showLabels: boolean;
  showDimension: boolean;
  marginTop: number;
  scrollDimensions: boolean;
  xLogScale: boolean;
  yLogScale: boolean;
  xAxisName: string;
  yAxisName: string;
  xNameGap: number;
  xNameLocation: string;
  yNameGap: number;
  yNameLocation: string;
  xAxisFormatter: ValueFormatter;
  yAxisFormatter: ValueFormatter;
  sizeFormatter: ValueFormatter;
};
