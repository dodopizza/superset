import { SupersetClient } from '@superset-ui/core';

export const repoUpdateFIO = async (firstName: string, lastName: string) => {
  try {
    const form = new FormData();
    form.append(`first_name`, firstName);
    form.append(`last_name`, lastName);

    await SupersetClient.post({
      url: '/userinfoeditview/form',
      body: form,
      parseMethod: null,
    });
    // await SupersetClient.postForm(
    //   '/userinfoeditview/form',
    //   { first_name: `${firstName}1`, last_name: `${lastName}1` },
    //   '_self',
    // );
  } catch (e) {
    console.log(`repoUpdateFIO catch error`, e);
  }
};
