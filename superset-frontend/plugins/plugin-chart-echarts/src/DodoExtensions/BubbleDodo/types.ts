import {
  ChartDataResponseResult,
  ChartProps,
  DataRecordValue,
  QueryFormData,
} from '@superset-ui/core';

type BubbleDodoFormData = QueryFormData & {};

export interface BubbleDodoTransformProps extends ChartProps {
  formData: BubbleDodoFormData;
  queriesData: ChartDataResponseResult[];
}

export type BubbleDodoComponentProps = {
  height: number;
  width: number;
  formData: BubbleDodoFormData;
  data: DataRecordValue[][];
};
