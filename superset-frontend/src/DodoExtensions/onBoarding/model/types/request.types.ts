import { userFromEnum } from '../../types';

export const ONBOARDING_REQUEST_LOADING = 'ONBOARDING_REQUEST_LOADING';
export const ONBOARDING_REQUEST_SUCCESS = 'ONBOARDING_REQUEST_SUCCESS';
export const ONBOARDING_REQUEST_ERROR = 'ONBOARDING_REQUEST_ERROR';

type ActionRequestLoading = {
  type: typeof ONBOARDING_REQUEST_LOADING;
};

type ActionRequestError = {
  type: typeof ONBOARDING_REQUEST_ERROR;
  payload: { error: string };
};

type ActionRequestSuccessPayload = {
  userFrom: userFromEnum;
  firstName: string;
  lastName: string;
  email: string;
  dodoRole: string;
  currentRoles: Array<string>;
  requestedRoles: Array<string>;
  team: string;
  requestDate: Date;
  isClosed: boolean;
  updateDate: Date;
};

type ActionRequestSuccess = {
  type: typeof ONBOARDING_REQUEST_SUCCESS;
  payload: ActionRequestSuccessPayload;
};

type OnboardingRequestAction =
  | ActionRequestLoading
  | ActionRequestError
  | ActionRequestSuccess;

type OnboardingRequestState = {
  requestIsLoading: boolean;
  loadingRequestError: string | null;
  requestData: ActionRequestSuccessPayload | null;
};

export {
  OnboardingRequestState,
  OnboardingRequestAction,
  ActionRequestSuccessPayload,
};
