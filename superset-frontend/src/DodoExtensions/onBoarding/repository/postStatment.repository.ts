import { SupersetClient } from '@superset-ui/core';
import { StepTwoPopupDto } from '../components/stepTwoPopup/stepTwoPopup.dto';
import { UserFromEnum } from '../types';
import { OnboardingFinishSuccessPayload } from '../model/types/start.types';

type RequestDto = {
  isNewTeam: boolean;
  team: string;
  team_slug: string;
  isExternal: boolean;
  request_roles: Array<string>;
};

type ResponseDto = {
  result: {
    isOnboardingFinished: boolean;
  };
};

export const postStatementRepository = async (
  popupDto: StepTwoPopupDto,
): Promise<OnboardingFinishSuccessPayload> => {
  const requestDto: RequestDto = {
    isNewTeam: popupDto.isNewTeam,
    isExternal: popupDto.userFrom === UserFromEnum.Franchisee,
    team: popupDto.teamName,
    team_slug: popupDto.teamSlug,
    request_roles: popupDto.roles,
  };

  const response = await SupersetClient.post({
    url: '/api/v1/statement/',
    body: JSON.stringify(requestDto),
    headers: { 'Content-Type': 'application/json' },
    parseMethod: null,
  });

  const responseDto: ResponseDto = await response.json();

  return {
    isOnboardingFinished: responseDto.result.isOnboardingFinished,
  };
};
