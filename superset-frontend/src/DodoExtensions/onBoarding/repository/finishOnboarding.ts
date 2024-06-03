import { StepTwoPopupDto } from '../components/stepTwoPopup/stepTwoPopup.dto';

export const repoFinishOnboarding = async (
  dto: StepTwoPopupDto,
): Promise<void> => {
  try {
    console.log(`finish onboarding:`, dto);
    await new Promise(resolve => setTimeout(resolve, 2000));

    // await SupersetClient.post({
    //   url: '/to-do',
    //   body: JSON.stringify(dto),
    //   parseMethod: null,
    // });
  } catch (error) {
    console.log(`finishOnboarding catch error`, error);
  }
};
