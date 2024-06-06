import React, { FC } from 'react';
import { StepOnePopup } from './components/stepOnePopup/stepOnePopup';
import { StepTwoPopup } from './components/stepTwoPopup/stepTwoPopup';
import { useOnboarding } from './utils/useOnboarding';

const OnBoardingEntryPoint: FC = () => {
  const { step, toStepTwo, closeOnboarding } = useOnboarding();

  if (process.env.type !== undefined) {
    return null;
  }

  if (step === 1) {
    return <StepOnePopup onClose={closeOnboarding} onNextStep={toStepTwo} />;
  }
  if (step === 2) {
    return <StepTwoPopup onClose={closeOnboarding} />;
  }

  return null;
};

export { OnBoardingEntryPoint };
