export const repoPutMeOnboarding = async (roleOrTeam: string) => {
  // TODO - waiting backend API ready
  try {
    console.log(
      `step one - updating OnboardingStartedTime and Role & Team:${roleOrTeam}`,
    );

    // await SupersetClient.put({
    //   url: '/api/v1/me/onboarding',
    //   body: JSON.stringify(dto),
    //   parseMethod: null,
    // });

    await new Promise(resolve => setTimeout(resolve, 1000));
  } catch (e) {
    console.log(`repoUpdateOnboardingStartedTimeAndRole catch error`, e);
  }
};
