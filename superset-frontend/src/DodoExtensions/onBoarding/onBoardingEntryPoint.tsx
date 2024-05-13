import React, { FC, useCallback, useState } from 'react';

import { BootstrapUser } from '../../types/bootstrapTypes';
import { getStepOneInfo } from './utils/getStepOneInfo';
import { StepOnePopup } from './components/stepOnePopup/stepOnePopup';
import { StepOnePopupDto } from './components/stepOnePopup/stepOnePopup.dto';
import { updateFIO } from './utils/onboardingService';

type OnBoardingEntryPointProps = {
  user: BootstrapUser & {
    IsOnboardingFinished: boolean;
  };
};

const OnBoardingEntryPoint: FC<OnBoardingEntryPointProps> = ({ user }) => {
  const { showStepOne } = getStepOneInfo(user);
  const [step, setStep] = useState<number | null>(showStepOne ? 1 : null);
  const [fioUpdating, setFioUpdating] = useState<boolean>(false);

  const closeOnboarding = useCallback(() => {
    setStep(null);
  }, []);

  const toStepTwo = async (stepOneDto: StepOnePopupDto) => {
    if (
      user.firstName !== stepOneDto.firstName ||
      user.lastName !== stepOneDto.lastName
    ) {
      await updateFIO(
        stepOneDto.firstName,
        stepOneDto.lastName,
        setFioUpdating,
      );
    }
    setStep(2);
  };

  if (step === 1) {
    return (
      <StepOnePopup
        isUpdating={fioUpdating}
        onClose={closeOnboarding}
        firstName={user.firstName}
        lastName={user.lastName}
        email={user.email ?? ''}
        onNextStep={toStepTwo}
      />
    );
  }

  return null;
};

export { OnBoardingEntryPoint };
