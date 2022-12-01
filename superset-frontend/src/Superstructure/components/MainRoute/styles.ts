import { styled } from '@superset-ui/core';

const AnalyticsMainWrapper = styled.div`
  flex: 1;
  position: relative;
  margin-top: 24px;
  margin-right: 32px;
  margin-bottom: 24px;
  margin-left: 32px;
`;

const StyledH4 = styled.h4`
  margin-top: 0;
`;

const StyledP = styled.p`
  margin-bottom: 10px;
  &:last-child {
    margin-bottom: 0;
  }
`;

const Alert = styled.div`
  color: black;
  line-height: 22px;
  border: 1px solid #91d5ff;
  margin-bottom: 14px;
  background-color: #d9edf7;
  border-radius: 4px;
  padding: 30px;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
`;

export {
  AnalyticsMainWrapper,
  StyledH4,
  StyledP,
  Alert,
  ButtonsWrapper,
};
