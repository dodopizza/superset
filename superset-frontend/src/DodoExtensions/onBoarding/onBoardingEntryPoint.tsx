import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { StepOnePopup } from './components/stepOnePopup/stepOnePopup';
import { StepTwoPopup } from './components/stepTwoPopup/stepTwoPopup';
import { useOnboarding } from './utils/useOnboarding';
import { initOnboarding } from './model/actions/initOnboarding';

const OnBoardingEntryPoint: FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
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
  } = useOnboarding();

  if (step === 1) {
    return (
      <StepOnePopup
        isUpdating={isUpdating}
        onClose={closeOnboarding}
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
