import { useCallback, useState } from 'react';
import { useGetOnBoardingStep } from './useGetOnBoardingStep';
import { StepOnePopupDto } from '../components/stepOnePopup/stepOnePopup.dto';

import { updateStorageTimeOfTheLastShow } from './localStorageUtils';
import { Team, userFromEnum } from '../types';
import { repoUpdateOnboardingStartedTimeAndRole } from '../repository/updateOnboardingStartedTimeAndRole.repository';
import { repoLoadTeamList } from '../repository/loadTeamList.repository';

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

  let beforeSendToBackendQuery = '';
  const loadTeamList = async (userFrom: userFromEnum, query: string) => {
    try {
      setTeamIsLoading(true);
      beforeSendToBackendQuery = query;
      const list = await repoLoadTeamList(userFrom, query);

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
