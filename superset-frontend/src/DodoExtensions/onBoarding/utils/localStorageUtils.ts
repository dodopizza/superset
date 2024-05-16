import { ONBOARDING_LOCAL_STORAGE_KEY } from '../consts';
import { OnBoardingStorageInfo } from '../types';

export const getOnboardingStorageInfo: () => OnBoardingStorageInfo = () => {
  const fromStorage = localStorage.getItem(ONBOARDING_LOCAL_STORAGE_KEY);

  if (fromStorage) {
    const info: OnBoardingStorageInfo = JSON.parse(
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

export const updateStorageTimeOfTheLastShow = () => {
  const info: OnBoardingStorageInfo = {
    theTimeOfTheLastShow: new Date(),
  };

  localStorage.setItem(ONBOARDING_LOCAL_STORAGE_KEY, JSON.stringify(info));
};
