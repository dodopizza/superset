import { getAnalytics, logEvent } from 'firebase/analytics';
import type { Analytics } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import { UAParser } from 'ua-parser-js';
import { firebaseConfig } from './constants';

export interface IGenericData {
  currency?: string;
  deviceType?: string;
  platform?: string;
  location?: string;
}

const app = initializeApp(firebaseConfig);

// Declare the analytics variable with the correct type
let analytics: Analytics | null = null;

// Check if we are in a browser environment before initializing analytics
if (typeof window !== 'undefined') {
  // Initialize Firebase Analytics only on the client side
  analytics = getAnalytics(app);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const logAnalyticsEvent = (
  eventName: string,
  params?: Record<string, any>,
) => {
  const APP_VERSION = '1.0.1';
  const uaParser = new UAParser();
  const device = uaParser.getDevice();
  const os = uaParser.getOS();
  const genericData: IGenericData = !device.type
    ? {
        platform: 'desktop',
        deviceType: '',
      }
    : {
        platform: os.name?.toLowerCase(),
        deviceType: `${device.vendor} ${device.model}`,
      };

  const fullParams = { ...params, ...genericData, app_version: APP_VERSION };

  if (analytics) {
    logEvent(analytics, eventName, fullParams);
  } else {
    console.warn(
      'Analytics is not initialized (likely running on the server).',
    );
  }
  console.warn('Finished Logging event');
};
