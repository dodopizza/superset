import { makeApi } from '@superset-ui/core';
import { Dispatch } from '@reduxjs/toolkit';
import { ONBOARDING_INIT } from '../types';
import { User } from '../../../../types/bootstrapTypes';

export function initOnboarding() {
  return async function (dispatch: Dispatch) {
    const getMe = makeApi<void, User>({
      method: 'GET',
      endpoint: '/api/v1/me/',
    });
    const res = await getMe();
    console.log('getMe, res', res);

    // dispatch();
    // getMe()
    //   .then(res => {
    //     console.log('getMe, res', res);
    //   })
    //   .catch(() => {});

    dispatch({
      type: ONBOARDING_INIT,
      payload: {
        isOnboardingFinished: false,
        fromInitOnboarding: true,
      },
    });
    // return SupersetClient.get({ endpoint: `/kv/${urlId}` })
    //   .then(({ json }) =>
    //     dispatch(
    //       addQueryEditor({
    //         name: json.name ? json.name : t('Shared query'),
    //         dbId: json.dbId ? parseInt(json.dbId, 10) : null,
    //         schema: json.schema ? json.schema : null,
    //         autorun: json.autorun ? json.autorun : false,
    //         sql: json.sql ? json.sql : 'SELECT ...',
    //         templateParams: json.templateParams,
    //       }),
    //     ),
    //   )
    //   .catch(() => dispatch(addDangerToast(ERR_MSG_CANT_LOAD_QUERY)));
  };
}
