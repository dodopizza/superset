import { useSelector } from 'react-redux';
import { getOnboardingStorageInfo } from './localStorageUtils';
import { getIsOnboardingFinished } from '../model/selector/getIsOnboardingFinished';
import { getOnboardingStartedTime } from '../model/selector/getOnboardingStartedTime';

const oneDayPassed = (date?: Date): boolean => {
  const ONE_DAY_LATER_DISTANCE = 24 * 60 * 60 * 1000;

  if (date) {
    if (new Date(Number(date) + ONE_DAY_LATER_DISTANCE) >= new Date()) {
      return false;
    }
  }
  return true;
};

export const useGetOnBoardingStep = (
  step: number | null,
  setStep: (value: number | null) => void,
) => {
  const isOnboardingFinished = useSelector(getIsOnboardingFinished);
  const onboardingStartedTime = useSelector(getOnboardingStartedTime);

  const storageInfo = getOnboardingStorageInfo();

  if (!isOnboardingFinished) {
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
};
