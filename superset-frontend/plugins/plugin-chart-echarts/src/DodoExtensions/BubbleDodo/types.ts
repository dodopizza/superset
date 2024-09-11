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
  labelLocation: string;
  labelFontSize: string;
  labelColor?: {
    a: number;
    r: number;
    b: number;
    g: number;
  };
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
  labelLocation: string;
  labelFontSize: string;
  labelColor?: string;
  tooltipLabels: { x: string; y: string; size: string };
};
