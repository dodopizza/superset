import { getStepOneStorageInfo } from './localStorageUtils';

const oneDayPassed = (date?: Date): boolean => {
  const ONE_DAY_LATER_DISTANCE = 24 * 60 * 60 * 1000;

  if (date) {
    if (new Date(Number(date) + ONE_DAY_LATER_DISTANCE) <= new Date()) {
      return false;
    }
  }
  return true;
};

type getStepOneType = (user: { IsOnboardingFinished: boolean }) => {
  showStepOne: boolean;
};

export const getStepOneInfo: getStepOneType = user => {
  const stepOneStorageInfo = getStepOneStorageInfo();

  let showStepOne = false;
  if (
    !user.IsOnboardingFinished &&
    oneDayPassed(stepOneStorageInfo.theTimeOfTheLastShow)
  ) {
    showStepOne = true;
  }

  return {
    showStepOne,
  };
};
