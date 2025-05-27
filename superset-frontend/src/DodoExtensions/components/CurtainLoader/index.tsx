// DODO created 48951211
import { addAlpha, styled } from '@superset-ui/core';
import Loading from 'src/components/Loading';

const Wrapper = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) =>
    addAlpha(theme.colors.grayscale.light5, 0.8)};
  z-index: ${({ theme }) => theme.zIndex.max};
`;

interface IProps {
  message: string;
}

const CurtainLoader = ({ message }: IProps) => (
  <Wrapper>
    <Loading position="inline" />
    <p>{message}</p>
  </Wrapper>
);

export default CurtainLoader;
