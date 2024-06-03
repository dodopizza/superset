import { useCallback, useState } from 'react';
import { useGetOnBoardingStep } from './useGetOnBoardingStep';
import { StepOnePopupDto } from '../components/stepOnePopup/stepOnePopup.dto';

import { updateStorageTimeOfTheLastShow } from './localStorageUtils';
import { repoUpdateOnboardingStartedTimeAndRole } from '../repository/updateOnboardingStartedTimeAndRole.repository';

export const useOnboarding = () => {
  const [step, setStep] = useState<number | null>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  useGetOnBoardingStep(step, setStep);

  const closeOnboarding = useCallback(() => {
    updateStorageTimeOfTheLastShow();
    setStep(null);
  }, []);

  const toStepTwo = async (stepOneDto: StepOnePopupDto) => {
    try {
      setIsUpdating(true);

      console.log('stepOneDto', stepOneDto);
      await repoUpdateOnboardingStartedTimeAndRole(stepOneDto.roleOrTeam);

      setStep(2);
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    step,
    isUpdating,
    closeOnboarding,
    toStepTwo,
  };
};
