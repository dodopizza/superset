import React, { FC } from 'react';
import { BootstrapUser } from '../../types/bootstrapTypes';
import { StepOnePopup } from './components/stepOnePopup/stepOnePopup';
import { StepTwoPopup } from './components/stepTwoPopup/stepTwoPopup';
import { useOnboarding } from './useOnboarding';

type OnBoardingEntryPointProps = {
  user: BootstrapUser & {
    IsOnboardingFinished: boolean;
    OnboardingStartedTime: Date;
  };
};

const OnBoardingEntryPoint: FC<OnBoardingEntryPointProps> = ({ user }) => {
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
