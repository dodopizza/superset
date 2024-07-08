import {
  ChartDataResponseResult,
  ChartProps,
  DataRecordValue,
  QueryFormData,
} from '@superset-ui/core';

type BubbleDodoFormData = QueryFormData & {
  maxBubbleSize: string;
  showLabels: boolean;
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
};
