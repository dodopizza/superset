import React, { FC } from 'react';
import styled from '@emotion/styled';
import Loading from '../../../../components/Loading';
import { useTeamPage } from './useTeamPage';

const Wrapper = styled.div`
  padding: 2rem;
`;

export const TeamPage: FC = () => {
  const isLoading = false;

  useTeamPage();

  return <Wrapper>{isLoading ? <Loading /> : <div>team</div>}</Wrapper>;
};
