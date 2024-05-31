import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getInitialOnBoardingStep } from './utils/getInitialOnBoardingStep';
import { StepOnePopupDto } from './components/stepOnePopup/stepOnePopup.dto';
import {
  repoLoadTeamList,
  repoUpdateFIO,
  repoUpdateOnboardingStartedTime,
} from './repository/onboardingRepository';
import { updateStorageTimeOfTheLastShow } from './utils/localStorageUtils';
import { Team } from './types';
import { isOnboardingFinishedSelector } from './model/selector/isOnboardingFinishedSelector';

export const useOnboarding = (user: {
  IsOnboardingFinished: boolean;
  OnboardingStartedTime: Date;
  firstName: string;
  lastName: string;
}) => {
  const [step, setStep] = useState<number | null>(null);
  const [teamIsLoading, setTeamIsLoading] = useState<boolean>(false);
  const [teamList, setTeamList] = useState<Array<Team>>([]);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const isOnboardingFinished = useSelector(isOnboardingFinishedSelector);

  useEffect(() => {
    setStep(getInitialOnBoardingStep(isOnboardingFinished, user));
  }, [isOnboardingFinished]);

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

  let beforeSendToBackendQuery = '';
  const loadTeamList = async (query: string) => {
    try {
      setTeamIsLoading(true);
      beforeSendToBackendQuery = query;
      const list = await repoLoadTeamList(query);

      // to handle backend raise condition
      if (query === beforeSendToBackendQuery) {
        setTeamList(list);
      }
    } finally {
      setTeamIsLoading(false);
    }
  };

  return {
    step,
    isUpdating,
    closeOnboarding,
    toStepTwo,
    loadTeamList,
    teamIsLoading,
    teamList,
  };
};
