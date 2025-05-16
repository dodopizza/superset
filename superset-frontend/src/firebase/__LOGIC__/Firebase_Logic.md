# Документация по компонентам и функциям в Firebase

## Содержание

1. [Введение](#введение)
2. [Конфигурация Firebase](#конфигурация-firebase)
   - [Константы и конфигурация](#константы-и-конфигурация)
   - [Настройка Firebase](#настройка-firebase)
3. [Firebase Analytics](#firebase-analytics)
   - [Логирование событий](#логирование-событий)
   - [Сбор данных](#сбор-данных)
4. [Интеграция с Rollbar](#интеграция-с-rollbar)
   - [Конфигурация Rollbar](#конфигурация-rollbar)
   - [Использование в приложении](#использование-в-приложении)
5. [Логирование ошибок](#логирование-ошибок)
   - [Логирование в Firestore](#логирование-в-firestore)
   - [Интеграция с компонентами](#интеграция-с-компонентами)

## Введение

Директория `firebase` содержит компоненты и функции для интеграции с сервисами Firebase, которые используются в проекте DODO Superset. Эта директория полностью специфична для DODO и содержит код для аналитики, логирования ошибок и интеграции с Rollbar.

## Конфигурация Firebase

### Константы и конфигурация

**Описание**: Константы и конфигурация для подключения к Firebase.

**Ключевые файлы**:

- `superset-frontend/src/firebase/constants.ts`

**Пример кода**:

```typescript
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
```

**Выбор конфигурации в зависимости от домена**:

```typescript
const CONFIG_MAP: Record<string, IFirebaseConfig> = {
  'analytics.dodois': STANDALONE_PROD_CONFIG,
  'officemanager.dodopizza': PLUGIN_PROD_CONFIG,
  'officemanager.drinkit': PLUGIN_PROD_CONFIG,

  'superset-spr.d.yandex.dodois': DEV_CONFIG,
  'superset-fof.d.yandex.dodois': DEV_CONFIG,
  'spr.d.yandex.dodois': DEV_CONFIG,
  'superset.d.yandex.dodois': DEV_CONFIG,

  localhost: DEV_CONFIG,
};

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
```

### Настройка Firebase

**Описание**: Функция для инициализации Firebase.

**Ключевые файлы**:

- `superset-frontend/src/firebase/setupFirebase.ts`

**Пример кода**:

```typescript
import { FirebaseService } from '.';
import { firebaseConfig } from './constants';

const setupFirebase = () => {
  if (firebaseConfig) FirebaseService.init(firebaseConfig);
};

export default setupFirebase;
```

**Интеграция с приложением**:

```typescript
import setupFirebase from './firebase/setupFirebase'; // DODO added 47015293

// В функции инициализации приложения
setupFirebase();
```

## Firebase Analytics

### Логирование событий

**Описание**: Функции для логирования событий в Firebase Analytics.

**Ключевые файлы**:

- `superset-frontend/src/firebase/index.ts`

**Пример кода**:

```typescript
import { getAnalytics, logEvent } from 'firebase/analytics';
import type { Analytics } from 'firebase/analytics';

// ...

export const FirebaseService: IFirebaseService = (() => {
  let analytics: Analytics;

  // ...

  return {
    // ...
    logEvent: (eventName: string, params: object) => {
      logEvent(analytics, eventName, params);
    },
    // ...
  };
})();
```

**Использование в компонентах**:

```typescript
// Пример логирования изменения режима просмотра
const handleModeChange = (
  newMode: 'table' | 'card',
  e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>,
) => {
  e.currentTarget.blur(); // Ensure the button loses focus
  setMode(newMode); // Update the mode

  // Log the event using FirebaseService
  FirebaseService.logEvent('view_mode_change', {
    new_mode: newMode,
    previous_mode: mode,
  });
};
```

### Сбор данных

**Описание**: Сбор общих данных о пользователе и устройстве.

**Ключевые файлы**:

- `superset-frontend/src/firebase/index.ts`

**Пример кода**:

```typescript
interface IGenericData {
  app_version: string;
  deployment_mode: 'standalone' | 'plugin';
  deviceType: string;
  platform: string;
  timestamp: Timestamp;
  userAgent: string;
}

export const FirebaseService: IFirebaseService = (() => {
  // ...

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

  // ...

  return {
    // ...
    updateGenericData: (data: Partial<IGenericData> = {}) => {
      genericData = { ...genericData, ...data };
    },
    get genericData() {
      return genericData;
    },
    // ...
  };
})();
```

## Интеграция с Rollbar

### Конфигурация Rollbar

**Описание**: Конфигурация для интеграции с сервисом Rollbar для отслеживания ошибок.

**DODO-модификации**:

- **47015293**: Добавлена интеграция с Rollbar

**Ключевые файлы**:

- `superset-frontend/src/firebase/rollbar.ts`

**Пример кода**:

```typescript
import type { Configuration } from 'rollbar';
import { APP_VERSION } from 'src/constants';

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

// ...

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
```

### Использование в приложении

**Описание**: Интеграция Rollbar в приложение.

**Ключевые файлы**:

- `superset-frontend/src/views/App.tsx`
- `superset-frontend/src/Superstructure/components/App.jsx`

**Пример кода**:

```typescript
import { ROLLBAR_CONFIG } from 'src/firebase/rollbar'; // DODO added 47015293

// ...

const App = () => (
  // DODO added 47015293 (RollbarProvider, RollbarErrorBoundary)
  <RollbarProvider config={ROLLBAR_CONFIG}>
    <RollbarErrorBoundary>
      <Router>
        <ScrollToTop />
        <LocationPathnameLogger />
        <RootContextProviders>
          <GlobalStyles />
          {/* DODO changed 47383817 */}
          <Content />
        </RootContextProviders>
      </Router>
    </RollbarErrorBoundary>
  </RollbarProvider>
);
```

## Логирование ошибок

### Логирование в Firestore

**Описание**: Функции для логирования ошибок в Firestore.

**Ключевые файлы**:

- `superset-frontend/src/firebase/index.ts`

**Пример кода**:

```typescript
export const FirebaseService: IFirebaseService = (() => {
  // ...

  let firestore: Firestore; // Firestore instance

  // ...

  return {
    // ...
    logError: (errorDetails: object) => {
      // const errorLog = {
      //   ...errorDetails,
      //   ...genericData, // Include generic data like device type, platform, etc.
      //   ...locationData,
      // };
      // Write the error log to Firestore
      // addDoc(collection(firestore, 'frontend-errors'), errorLog)
      //   .then(() => {
      //     console.log('Error logged successfully:', errorDetails);
      //   })
      //   .catch((err: any) => {
      //     console.error('Failed to log error:', err);
      //   });
    },
  };
})();
```

### Интеграция с компонентами

**Описание**: Интеграция логирования ошибок с компонентами приложения.

**Ключевые файлы**:

- `superset-frontend/src/components/ErrorBoundary/index.tsx`
- `superset-frontend/src/components/MessageToasts/Toast.tsx`
- `superset-frontend/src/preamble.ts`

**Пример кода в ErrorBoundary**:

```typescript
import { FirebaseService } from 'src/firebase'; // DODO added 47015293

// ...

componentDidCatch(error: Error, info: ErrorInfo): void {
  this.props.onError?.(error, info);

  // DODO added start 47015293
  // @ts-ignore
  const erroredFile = this.props?.children?._source
    ? // @ts-ignore
      this.props?.children?._source?.fileName
    : null;

  // Log the error to Firestore
  const errorDetails = {
    message: error.message || 'No message available',
    stack: error.stack || 'No stack trace available',
    componentStack: info.componentStack || 'No component stack available',
    erroredFile: erroredFile || 'Errored File is unknown',
  };

  FirebaseService.logError(errorDetails); // Log the error to Firestore
  // DODO added stop 47015293

  this.setState({ error, info });
}
```

**Пример кода в Toast**:

```typescript
if (toast.toastType === ToastType.Warning) {
  icon = <Icons.WarningSolid css={StyledIcon} />;
  className = 'toast--warning';
} else if (toast.toastType === ToastType.Danger) {
  icon = <Icons.ErrorSolid css={StyledIcon} />;
  className = 'toast--danger';
  FirebaseService.logError({ message: toast.text }); // DODO added 47015293
} else if (toast.toastType === ToastType.Info) {
  icon = <Icons.InfoSolid css={StyledIcon} />;
  className = 'toast--info';
}
```

**Пример кода в preamble.ts**:

```typescript
document.addEventListener('visibilitychange', () => {
  // we only care about the tab becoming visible, not vice versa
  if (document.visibilityState !== 'visible') return;

  getMe().catch(e => {
    FirebaseService.logError(e); // DODO added 47015293
    // ignore error, SupersetClient will redirect to login on a 401
  });
});
```
