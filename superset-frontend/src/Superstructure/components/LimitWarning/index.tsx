import React from 'react';
import { LimitMessageWrapper, Alert, StyledH4 } from './styles';

import { RowWrapper } from 'src/Superstructure/components/common/Wrappers/RowWrapper';
import { ColumnWrapper } from 'src/Superstructure/components/common/Wrappers/ColumnWrapper';

const LIMIT_WARNING_HEADER = 'Измените параметры фильтров';
const LIMIT_WARNING_BODY = 'Визуальный элемент не может быть отрисован, так как количество данных выборки превысило лимит.';

const InfoIcon = () => (
  <div>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="#fcc700"
      className="bi bi-info-circle"
      viewBox="0 0 16 16"
    >
      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
      <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
    </svg>
  </div>
);

const LimitWarning = () => (
  <LimitMessageWrapper>
    <Alert>
      <RowWrapper>
        <ColumnWrapper classes="col-md-1 tinycolumn">
          <InfoIcon />
        </ColumnWrapper>
        <ColumnWrapper classes="col-md-11">
          <StyledH4>{LIMIT_WARNING_HEADER}</StyledH4>
        </ColumnWrapper>
      </RowWrapper>
      <RowWrapper>
        <ColumnWrapper classes="col-md-11 offset-md-1">
          {LIMIT_WARNING_BODY}
        </ColumnWrapper>
      </RowWrapper>
    </Alert>
  </LimitMessageWrapper>
);

export { LimitWarning };
