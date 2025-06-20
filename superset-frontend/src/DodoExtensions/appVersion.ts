import getBootstrapData from 'src/utils/getBootstrapData';
import { APP_VERSION as PLUGIN_APP_VERSION } from 'src/Superstructure/parseEnvFile';

const isStandalone = process.env.type === undefined;

const bootstrapData = getBootstrapData();

export const APP_VERSION = isStandalone
  ? `${bootstrapData.common?.menu_data?.navbar_right?.version_string}_${bootstrapData.common?.menu_data?.navbar_right?.dodo_version}`
  : PLUGIN_APP_VERSION;
