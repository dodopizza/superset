import type { Configuration } from 'rollbar';
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

const ERROR_WHITE_LIST: Record<string, 'true'> = {
  'ResizeObserver loop completed with undelivered notifications.': 'true',
  'ResizeObserver loop limit exceeded': 'true',
  'ajax is not defined': 'true',
  "Can't find variable: ajax": 'true',
  "ReferenceError: Can't find variable: ajax": 'true',
  'Script error.': 'true',
  'SyntaxError: Unexpected EOF': 'true',
  '{}': 'true',
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

export const ROLLBAR_CONFIG: Configuration = {
  accessToken: 'd9021ea67e624bcc904ff9deae004565',
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
  checkIgnore: (isUncaught, args, payload: RollbarPayload) => {
    const description = payload?.body?.trace?.exception?.description || '';
    const message = payload?.body?.trace?.exception?.message || '';

    return Boolean(ERROR_WHITE_LIST[description] || ERROR_WHITE_LIST[message]);
  },
};

interface RollbarException {
  description?: string;
  message?: string;
}

interface RollbarTrace {
  exception?: RollbarException;
}

interface RollbarBody {
  trace?: RollbarTrace;
}

interface RollbarPayload {
  body?: RollbarBody;
}
