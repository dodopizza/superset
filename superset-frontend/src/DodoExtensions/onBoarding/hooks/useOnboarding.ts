import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StepOnePopupDto } from '../components/stepOnePopup/stepOnePopup.dto';

import {
  getOnboardingStorageInfo,
  updateStorageTimeOfTheLastShow,
} from '../utils/localStorageUtils';
import { initOnboarding } from '../model/actions/initOnboarding';
import { getIsOnboardingFinished } from '../model/selector/getIsOnboardingFinished';
import { getOnboardingStartedTime } from '../model/selector/getOnboardingStartedTime';
import { stepOneFinish } from '../model/actions/stepOneFinish';

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

  const dispatch = useDispatch();
  const isOnboardingFinished = useSelector(getIsOnboardingFinished);
  const onboardingStartedTime = useSelector(getOnboardingStartedTime);

  const storageInfo = getOnboardingStorageInfo();

  useEffect(() => {
    dispatch(initOnboarding());
  }, [dispatch]);

  if (isOnboardingFinished) {
    if (step !== null) {
      setStep(null);
    }
  } else if (onboardingStartedTime) {
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

  const closeOnboarding = useCallback(() => {
    updateStorageTimeOfTheLastShow();
    setStep(null);
  }, []);

  const toStepTwo = async (stepOneDto: StepOnePopupDto) => {
    dispatch(stepOneFinish(stepOneDto.DodoRole));
  };

  return {
    step,
    closeOnboarding,
    toStepTwo,
  };
};
