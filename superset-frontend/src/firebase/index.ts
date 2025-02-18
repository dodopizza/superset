import { getAnalytics, logEvent } from 'firebase/analytics';
import type { Analytics } from 'firebase/analytics';
import type { Firestore } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  Timestamp,
} from 'firebase/firestore';
import { UAParser } from 'ua-parser-js';
import { APP_VERSION } from '../constants';
import { IFirebaseConfig } from './constants';

interface IGenericData {
  app_version: string;
  deployment_mode: 'standalone' | 'plugin';
  deviceType: string;
  platform: string;
  timestamp: Timestamp;
  userAgent: string;
}

interface IFirebaseService {
  init: (config: IFirebaseConfig) => void;
  logEvent: (eventName: string, params?: object) => void;
  updateGenericData: (genericData?: IGenericData) => void;
  genericData: IGenericData;
  logError: (errorDetails: object) => void; // New method for error logging
}

const isStandalone = process.env.type === undefined;

export const FirebaseService: IFirebaseService = (() => {
  let analytics: Analytics;
  let firestore: Firestore; // Firestore instance

  const uaParser = new UAParser();
  const device = uaParser.getDevice();
  const os = uaParser.getOS();

  let genericData: IGenericData = {
    app_version: APP_VERSION,
    deployment_mode: isStandalone ? 'standalone' : 'plugin',
    deviceType: !device.type ? '' : `${device.vendor} ${device.model}`,
    platform: !device.type ? 'desktop' : (os.name ?? '').toLowerCase(),
    timestamp: Timestamp.now(), // Add a Firestore timestamp
    userAgent: navigator.userAgent, // Add user agent for context
  };

  const locationData = window
    ? {
        origin: window.location.origin,
        pathname: window.location.pathname,
        search: window.location.search || '',
      }
    : {};

  return {
    init: (config: IFirebaseConfig) => {
      const app = initializeApp(config);
      analytics = getAnalytics(app);
      firestore = getFirestore(app); // Initialize Firestore
    },
    logEvent: (eventName: string, params: object) => {
      logEvent(analytics, eventName, params);
    },
    updateGenericData: (data: Partial<IGenericData> = {}) => {
      genericData = { ...genericData, ...data };
    },
    get genericData() {
      return genericData;
    },
    logError: (errorDetails: object) => {
      const errorLog = {
        ...errorDetails,
        ...genericData, // Include generic data like device type, platform, etc.
        ...locationData,
      };

      // Write the error log to Firestore
      addDoc(collection(firestore, 'frontend-errors'), errorLog)
        .then(() => {
          console.log('Error logged successfully:', errorDetails);
        })
        .catch((err: any) => {
          console.error('Failed to log error:', err);
        });
    },
  };
})();
