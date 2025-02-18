export interface IFirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
}

const PROD_CONFIG: IFirebaseConfig = {
  apiKey: 'AIzaSyDQrzGxBseb-tjYNxQbcYK2U4s1GzdWq-Q',
  authDomain: 'superset-prod-bcac8.firebaseapp.com',
  projectId: 'superset-prod-bcac8',
  storageBucket: 'superset-prod-bcac8.firebasestorage.app',
  messagingSenderId: '940775662277',
  appId: '1:940775662277:web:ebcc5428a3b4918f8b46ac',
  measurementId: 'G-VRTSQP6NTT',
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
  'analytics.dodois.': PROD_CONFIG,
  'officemanager.dodopizza.': PROD_CONFIG,
  'officemanager.drinkit.': PROD_CONFIG,

  'superset.d.yandex.dodois.': DEV_CONFIG,
  'spr.d.yandex.dodois.': DEV_CONFIG,
  'localhost.': DEV_CONFIG,
};

const getConfig = (): IFirebaseConfig | undefined => {
  if (typeof window === 'undefined') return undefined;

  const { hostname } = window.location;

  // Extract the domain without the top-level domain (TLD) + "." in the end
  const domainParts = hostname.split('.');
  if (domainParts.length > 1) {
    domainParts.pop(); // Remove the top-level domain
  }
  const mainDomain = `${domainParts.join('.')}.`;

  return CONFIG_MAP[mainDomain];
};

export const firebaseConfig = getConfig();
