import React, { FC, useEffect } from 'react';
import { makeApi } from '@superset-ui/core';
import { useDispatch } from 'react-redux';
import { BootstrapUser, User } from '../../types/bootstrapTypes';
import { StepOnePopup } from './components/stepOnePopup/stepOnePopup';
import { StepTwoPopup } from './components/stepTwoPopup/stepTwoPopup';
import { useOnboarding } from './useOnboarding';
import { initOnboarding } from './model/actions/initOnboarding';

type OnBoardingEntryPointProps = {
  user: BootstrapUser & {
    IsOnboardingFinished: boolean;
    OnboardingStartedTime: Date;
  };
};

const OnBoardingEntryPoint: FC<OnBoardingEntryPointProps> = ({ user }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    // const getMe = makeApi<void, User>({
    //   method: 'GET',
    //   endpoint: '/api/v1/me/',
    // });
    // const me = getMe();
    // console.log(`useEffect me`, me);

    dispatch(initOnboarding());
  }, [dispatch]);

  const {
    step,
    toStepTwo,
    closeOnboarding,
    isUpdating,
    teamList,
    teamIsLoading,
    loadTeamList,
  } = useOnboarding(user);

  if (step === 1) {
    return (
      <StepOnePopup
        isUpdating={isUpdating}
        onClose={closeOnboarding}
        firstName={user.firstName}
        lastName={user.lastName}
        email={user.email ?? ''}
        roleAndTeam=""
        onNextStep={toStepTwo}
      />
    );
  }
  if (step === 2) {
    return (
      <StepTwoPopup
        onClose={closeOnboarding}
        teamList={teamList}
        loadTeamList={loadTeamList}
        teamIsLoading={teamIsLoading}
      />
    );
  }

  return null;
};

export { OnBoardingEntryPoint };
