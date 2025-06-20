/* eslint-disable theme-colors/no-literal-colors */
// DODO was here
// DODO created 45047288
import { styled } from '@superset-ui/core';
import getBootstrapData from 'src/utils/getBootstrapData';
import { APP_VERSION as PLUGIN_APP_VERSION } from 'src/Superstructure/parseEnvFile';

const isStandalone = process.env.type === undefined;

const bootstrapData = getBootstrapData();

export const APP_VERSION = isStandalone
  ? `${bootstrapData.common?.menu_data?.navbar_right?.version_string}_${bootstrapData.common?.menu_data?.navbar_right?.dodo_version}`
  : PLUGIN_APP_VERSION;

const StyledVersion = styled.div`
  color: #ccc;
  font-size: 8px;
  position: absolute;
  top: 4px;
  right: 6px;
`;

export const Version = () => <StyledVersion>{APP_VERSION}</StyledVersion>;
