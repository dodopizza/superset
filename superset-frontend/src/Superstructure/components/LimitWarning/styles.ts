import { styled } from '@superset-ui/core';

const StyledH4 = styled.h4`
  margin-top: 0;
`;
const StyledP = styled.p`
  margin-bottom: 10px;
  &:last-child {
    margin-bottom: 0;
  }
`;
const LimitMessageWrapper = styled.div`
  width: 100%;
  height: 100%;
  min-height: 100%;
  display: flex;
  position: absolute;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  padding: 20px;
`;

const Alert = styled.div`
  color: black;
  line-height: 22px;
  border: 1px solid #fcc700;
  background-color: #fff3cd;
  border-radius: 4px;
  padding: 30px;
`;

export {
  StyledH4,
  StyledP,
  LimitMessageWrapper,
  Alert
}
