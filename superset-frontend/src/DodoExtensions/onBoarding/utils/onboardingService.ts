import { SupersetClient } from '@superset-ui/core';

export const updateFIO = async (
  firstName: string,
  lastName: string,
  setFioUpdating: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  try {
    setFioUpdating(true);

    const form = new FormData();
    form.append(`first_name`, firstName);
    form.append(`last_name`, lastName);

    await SupersetClient.post({
      url: '/userinfoeditview/form',
      body: form,
      parseMethod: null,
    });
  } catch (e) {
    console.log(`updateFIO catch error`, e);
  } finally {
    setFioUpdating(false);
  }
};
