import { getOnboardingStorageInfo } from './localStorageUtils';

const oneDayPassed = (date?: Date): boolean => {
  const ONE_DAY_LATER_DISTANCE = 24 * 60 * 60 * 1000;

  if (date) {
    if (new Date(Number(date) + ONE_DAY_LATER_DISTANCE) >= new Date()) {
      return false;
    }
  }
  return true;
};

type getStepOneType = (
  isOnboardingFinished: boolean,
  user: {
    OnboardingStartedTime: Date;
  },
) => number | null;

export const getInitialOnBoardingStep: getStepOneType = (
  isOnboardingFinished,
  user,
) => {
  const storageInfo = getOnboardingStorageInfo();

  // const { isOnboardingFinished } = useSelector(isOnboardingFinishedSelector);

  let step = null;

  if (!isOnboardingFinished) {
    if (user.OnboardingStartedTime) {
      if (oneDayPassed(storageInfo.theTimeOfTheLastShow)) {
        step = 2;
      }
    }
    if (oneDayPassed(storageInfo.theTimeOfTheLastShow)) {
      step = 1;
    }
  }

  return step;
};
