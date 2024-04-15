import { styled } from '@superset-ui/core';
import React, { FC } from 'react';

const Flag = styled.i`
  margin-top: 2px;
`;

type Props = {
  language: string;
  style?: Record<string, string>;
};

const StyledFlag: FC<Props> = ({ language = 'gb', style = {} }) => (
  <div style={style} className="f16">
    <Flag className={`flag ${language}`} />
  </div>
);

export { StyledFlag };
