import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StepOnePopupDto } from '../components/stepOnePopup/stepOnePopup.dto';

import {
  getOnboardingStorageInfo,
  updateStorageTimeOfTheLastShow,
} from './localStorageUtils';
import { repoPutMeOnboarding } from '../repository/putMeOnboarding.repository.repository';
import { initOnboarding } from '../model/actions/initOnboarding';
import { getIsOnboardingFinished } from '../model/selector/getIsOnboardingFinished';
import { getOnboardingStartedTime } from '../model/selector/getOnboardingStartedTime';
import { getOnboardingFinishSuccess } from '../model/selector/getOnboardingFinishSuccess';

const oneDayPassed = (date?: Date): boolean => {
  const ONE_DAY_LATER_DISTANCE = 24 * 60 * 60 * 1000;

  if (date) {
    if (new Date(Number(date) + ONE_DAY_LATER_DISTANCE) >= new Date()) {
      return false;
    }
  }
  return true;
};

export const useOnboarding = () => {
  const [step, setStep] = useState<number | null>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const dispatch = useDispatch();
  const isOnboardingFinished = useSelector(getIsOnboardingFinished);
  const onboardingStartedTime = useSelector(getOnboardingStartedTime);
  const isFinishSuccess = useSelector(getOnboardingFinishSuccess);

  const storageInfo = getOnboardingStorageInfo();

  useEffect(() => {
    dispatch(initOnboarding());
  }, [dispatch]);

  if (isFinishSuccess) {
    if (step !== null) {
      setStep(null);
    }
  } else if (!isOnboardingFinished) {
    if (onboardingStartedTime) {
      if (oneDayPassed(storageInfo.theTimeOfTheLastShow)) {
        if (step !== 2) {
          setStep(2);
        }
      }
    } else if (oneDayPassed(storageInfo.theTimeOfTheLastShow)) {
      if (step === null) {
        setStep(1);
      }
    }
  }

  const closeOnboarding = useCallback(() => {
    updateStorageTimeOfTheLastShow();
    setStep(null);
  }, []);

  const toStepTwo = async (stepOneDto: StepOnePopupDto) => {
    try {
      setIsUpdating(true);

      await repoPutMeOnboarding(stepOneDto.roleOrTeam);

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
