import { API_HANDLER } from 'src/Superstructure/api';
import {
  shouldUseLegacyApi,
  getLegacyEndpointType,
  getExploreUrl,
  buildV1ChartDataPayload,
} from 'src/explore/exploreUtils';

export const getCSV = async (url: string, payload: Record<string, any>) => {
  const urlNoProtocol = url.replace(/^https?\:\/\//i, "");

  const response = await API_HANDLER.SupersetClientNoApi({
    method: 'post',
    url: urlNoProtocol.split('/superset')[1],
    body: payload,
  });

  if (response && response.result) {
    return response.result[0]
  }

  return null
}

export const exportChart = ({
  formData,
  resultFormat = 'json',
  resultType = 'full',
  force = false,
  ownState = {},
}: any) => {
  let url;
  let payload;
  if (shouldUseLegacyApi(formData)) {
    const endpointType = getLegacyEndpointType({ resultFormat, resultType });
    url = getExploreUrl({
      formData,
      endpointType,
      allowDomainSharding: false,
    });
    payload = formData;
  } else {
    url = '/api/v1/chart/data';
    payload = buildV1ChartDataPayload({
      formData,
      force,
      resultFormat,
      resultType,
      ownState,
    } as any);
  }
  return getCSV(url, payload);
};
