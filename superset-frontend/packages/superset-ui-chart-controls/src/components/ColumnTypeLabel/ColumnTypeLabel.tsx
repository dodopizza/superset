/* eslint-disable no-nested-ternary */
// DODO was here
import { ReactNode } from 'react';
import { css, GenericDataType, styled, t } from '@superset-ui/core';
import { ClockCircleOutlined, QuestionOutlined } from '@ant-design/icons';
// TODO: move all icons to superset-ui/core
import FunctionSvg from './type-icons/field_derived.svg';
import BooleanSvg from './type-icons/field_boolean.svg';
import StringSvg from './type-icons/field_abc.svg';
import NumSvg from './type-icons/field_num.svg';

export type ColumnLabelExtendedType = 'expression' | '';

export type ColumnTypeLabelProps = {
  type?: ColumnLabelExtendedType | GenericDataType;
};

const TypeIconWrapper = styled.div`
  ${({ theme }) => css`
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: max-content; // DODO added 44136746
    width: ${theme.gridUnit * 6}px;
    height: ${theme.gridUnit * 6}px;
    margin-right: ${theme.gridUnit}px;

    && svg {
      margin-right: 0;
      margin-left: 0;
      width: 100%;
      height: 100%;
    }
  `};
`;

export function ColumnTypeLabel({ type }: ColumnTypeLabelProps) {
  let typeIcon: ReactNode = (
    <QuestionOutlined aria-label={t('unknown type icon')} />
  );

  if (type === '' || type === 'expression') {
    typeIcon = <FunctionSvg aria-label={t('function type icon')} />;
  } else if (type === GenericDataType.String) {
    typeIcon = <StringSvg aria-label={t('string type icon')} />;
  } else if (type === GenericDataType.Numeric) {
    typeIcon = <NumSvg aria-label={t('numeric type icon')} />;
  } else if (type === GenericDataType.Boolean) {
    typeIcon = <BooleanSvg aria-label={t('boolean type icon')} />;
  } else if (type === GenericDataType.Temporal) {
    typeIcon = <ClockCircleOutlined aria-label={t('temporal type icon')} />;
  }

  return <TypeIconWrapper>{typeIcon}</TypeIconWrapper>;
}

export default ColumnTypeLabel;
