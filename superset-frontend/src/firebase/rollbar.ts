import type { Configuration } from 'rollbar';
import { APP_VERSION } from 'src/DodoExtensions/appVersion';

type Env = 'production' | 'development' | 'local';
const ENV_MAP: Record<string, Env> = {
  'analytics.dodois': 'production',
  'officemanager.dodopizza': 'production',
  'officemanager.drinkit': 'production',

  'superset-spr.d.yandex.dodois': 'development',
  'superset-fof.d.yandex.dodois': 'development',
  'spr.d.yandex.dodois': 'development',
  'superset.d.yandex.dodois': 'development',

  localhost: 'local',
};
const DOMAIN_ARRAY = Object.keys(ENV_MAP);

const ERROR_WHITE_LIST: Record<string, 'true'> = {
  'ResizeObserver loop completed with undelivered notifications.': 'true',
  'ResizeObserver loop limit exceeded': 'true',
  'ajax is not defined': 'true',
  "Can't find variable: ajax": 'true',
  "ReferenceError: Can't find variable: ajax": 'true',
  'Script error.': 'true',
  'SyntaxError: Unexpected EOF': 'true',
  '{}': 'true',
  'Uncaught SyntaxError: Invalid or unexpected token': 'true',
  'Possible source map configuration error: line and column number combination not found in source map':
    'true',
};

const isPlugin = process.env.type !== undefined;

const getEnv = (): string => {
  if (typeof window === 'undefined') return 'undefined';

  const { hostname } = window.location;

  const domain = DOMAIN_ARRAY.find(domain => hostname.startsWith(domain));
  if (!domain) return 'undefined';

  let env = ENV_MAP[domain];
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
    const traceMessage = payload?.body?.trace?.exception?.message || '';
    const message = payload?.body?.message?.body?.message || '';

    return Boolean(
      ERROR_WHITE_LIST[description] ||
        ERROR_WHITE_LIST[traceMessage] ||
        ERROR_WHITE_LIST[message],
    );
  },
};

interface RollbarBody {
  trace?: {
    exception?: {
      description?: string;
      message?: string;
    };
  };
  message?: {
    body?: {
      message?: string;
    };
  };
}

interface RollbarPayload {
  body?: RollbarBody;
}
