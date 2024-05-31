export const repoUpdateOnboardingStartedTimeAndRole = async (
  roleOrTeam: string,
) => {
  // TODO - waiting backend API ready
  try {
    console.log(
      `step one - updating OnboardingStartedTime and Role & Team:${roleOrTeam}`,
    );

    await new Promise(resolve => setTimeout(resolve, 1000));
  } catch (e) {
    console.log(`repoUpdateOnboardingStartedTimeAndRole catch error`, e);
  }
};
