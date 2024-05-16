import { useCallback, useState } from 'react';
import { getInitialOnBoardingStep } from './utils/getInitialOnBoardingStep';
import { StepOnePopupDto } from './components/stepOnePopup/stepOnePopup.dto';
import {
  repoUpdateFIO,
  repoUpdateOnboardingStartedTime,
} from './utils/onboardingRepository';
import { updateStorageTimeOfTheLastShow } from './utils/localStorageUtils';

export const useOnboarding = (user: {
  IsOnboardingFinished: boolean;
  OnboardingStartedTime: Date;
  firstName: string;
  lastName: string;
}) => {
  const [step, setStep] = useState<number | null>(
    getInitialOnBoardingStep(user),
  );
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const closeOnboarding = useCallback(() => {
    updateStorageTimeOfTheLastShow();
    setStep(null);
  }, []);

  const toStepTwo = async (stepOneDto: StepOnePopupDto) => {
    try {
      setIsUpdating(true);
      if (
        user.firstName !== stepOneDto.firstName ||
        user.lastName !== stepOneDto.lastName
      ) {
        await repoUpdateFIO(stepOneDto.firstName, stepOneDto.lastName);
      }

      await repoUpdateOnboardingStartedTime();

      setStep(2);
    } finally {
      setIsUpdating(false);
    }
  };

  return { step, isUpdating, closeOnboarding, toStepTwo };
};
