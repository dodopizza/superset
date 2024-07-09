import {
  ChartDataResponseResult,
  ChartProps,
  DataRecordValue,
  QueryFormData,
} from '@superset-ui/core';

type BubbleDodoFormData = QueryFormData & {
  maxBubbleSize: string;
  showLabels: boolean;
  showDimension: boolean;
  marginTopInPixel: string;
  scrollDimensions: boolean;
  xLogScale: boolean;
  yLogScale: boolean;
  xAxisName: string;
  yAxisName: string;
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
};
