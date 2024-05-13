import { ONBOARDING_STEP_ONE_LOCAL_STORAGE_KEY } from '../consts';
import { OnBoardingStepOneStorageInfo } from '../types';

export const getStepOneStorageInfo: () => OnBoardingStepOneStorageInfo = () => {
  const fromStorage = localStorage.getItem(
    ONBOARDING_STEP_ONE_LOCAL_STORAGE_KEY,
  );

  if (fromStorage) {
    const info: OnBoardingStepOneStorageInfo = JSON.parse(
      fromStorage,
      (key: string, value: any) => {
        if (key === 'theTimeOfTheLastShow') {
          return new Date(value);
        }
        return value;
      },
    );

    return info;
  }

  return {
    theTimeOfTheLastShow: undefined,
  };
};

export const setStepOneStorageInfo = () => {};
