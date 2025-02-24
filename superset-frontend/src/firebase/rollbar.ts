import { APP_VERSION } from 'src/constants';

type Env = 'production' | 'development' | 'local';

const ENV_MAP: Record<string, Env> = {
  'analytics.dodois.': 'production',
  'officemanager.dodopizza.': 'production',
  'officemanager.drinkit.': 'production',

  'superset.d.yandex.dodois.': 'development',
  'spr.d.yandex.dodois.': 'development',
  'localhost.': 'local',
};

const isPlugin = process.env.type !== undefined;

const getEnv = (): string => {
  if (typeof window === 'undefined') return 'undefined';

  const { hostname } = window.location;

  // Extract the domain without the top-level domain (TLD) + "." in the end
  const domainParts = hostname.split('.');
  if (domainParts.length > 1) {
    domainParts.pop(); // Remove the top-level domain
  }
  const mainDomain = `${domainParts.join('.')}.`;

  let env = ENV_MAP[mainDomain];
  if (!env) return 'undefined';

  if (isPlugin) env += '-plugin';

  return env;
};

export const ROLLBAR_CONFIG = {
  accessToken: '174d57ae38994b0f9af404174d983082',
  captureUncaught: true,
  captureUnhandledRejections: true,
  payload: {
    environment: getEnv(),
    client: {
      javascript: {
        code_version: APP_VERSION,
      },
    },
  },
  version: APP_VERSION,
};
