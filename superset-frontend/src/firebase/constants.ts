export interface IFirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
}

const STANDALONE_PROD_CONFIG: IFirebaseConfig = {
  apiKey: 'AIzaSyDXn8X8G9vVCw_b8AZWSupI3T_aLLK7L4Y',
  authDomain: 'superset-dodobrands.firebaseapp.com',
  projectId: 'superset-dodobrands',
  storageBucket: 'superset-dodobrands.firebasestorage.app',
  messagingSenderId: '1083382993878',
  appId: '1:1083382993878:web:285f3dfa11c518e8438a77',
  measurementId: 'G-DBW4DYJ5T1',
};

const PLUGIN_PROD_CONFIG: IFirebaseConfig = {
  apiKey: 'AIzaSyDXn8X8G9vVCw_b8AZWSupI3T_aLLK7L4Y',
  authDomain: 'superset-dodobrands.firebaseapp.com',
  projectId: 'superset-dodobrands',
  storageBucket: 'superset-dodobrands.firebasestorage.app',
  messagingSenderId: '1083382993878',
  appId: '1:1083382993878:web:969235a583e3a811438a77',
  measurementId: 'G-24HLQYT7KE',
};

const DEV_CONFIG: IFirebaseConfig = {
  apiKey: 'AIzaSyCb3ug-gT-7ArBr7VogXbJLz9qovXjL4Ic',
  authDomain: 'superset-dodo.firebaseapp.com',
  projectId: 'superset-dodo',
  storageBucket: 'superset-dodo.firebasestorage.app',
  messagingSenderId: '430305624426',
  appId: '1:430305624426:web:34d7465fbd7eb5bfade513',
  measurementId: 'G-CFEM8XE8MC',
};

const CONFIG_MAP: Record<string, IFirebaseConfig> = {
  'analytics.dodois': STANDALONE_PROD_CONFIG,
  'officemanager.dodopizza': PLUGIN_PROD_CONFIG,
  'officemanager.drinkit': PLUGIN_PROD_CONFIG,

  'superset.d.yandex.dodois': DEV_CONFIG,
  'spr.d.yandex.dodois': DEV_CONFIG,
  localhost: DEV_CONFIG,
};
const DOMAIN_ARRAY = Object.keys(CONFIG_MAP);

const getConfig = (): IFirebaseConfig | undefined => {
  if (typeof window === 'undefined') return undefined;

  const { hostname } = window.location;

  const domain = DOMAIN_ARRAY.find(domain => hostname.startsWith(domain));
  if (!domain) return undefined;

  const config = CONFIG_MAP[domain];

  if (config) console.log(`Firebase project ID: ${config.projectId}`);
  else console.error(`Firebase config is not found for domain: ${domain}`);

  return config;
};

export const firebaseConfig = getConfig();
