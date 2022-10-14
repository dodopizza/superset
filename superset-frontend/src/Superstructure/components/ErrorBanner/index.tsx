import React from 'react';
import { ErrorParams } from 'src/Superstructure/types/global';
import { StyledCode, StyledPre } from './styles';

const ErrorBanner = ({ title, body, stackTrace }: ErrorParams) => (
  <div style={{ padding: '2em' }}>
    <h1>{title || 'Error happened =('}</h1>
    <StyledPre>{body}</StyledPre>
    <StyledCode>{stackTrace}</StyledCode>
  </div>
);

export { ErrorBanner };
