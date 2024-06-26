import React, { FC } from 'react';
import styled from '@emotion/styled';
import Loading from '../../../../components/Loading';

const Wrapper = styled.div`
  padding: 2rem;
`;

export const TeamPage: FC = () => {
  const isLoading = false;
  return <Wrapper>{isLoading ? <Loading /> : <div>team</div>}</Wrapper>;
};
