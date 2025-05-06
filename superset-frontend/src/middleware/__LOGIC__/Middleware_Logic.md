# Документация по компонентам и функциям в Middleware

## Содержание

1. [Введение](#введение)
2. [Logger Middleware](#logger-middleware)
   - [Логирование событий](#логирование-событий)
   - [Отправка данных](#отправка-данных)
3. [Async Event Middleware](#async-event-middleware)
   - [Обработка асинхронных событий](#обработка-асинхронных-событий)
   - [Транспорты для событий](#транспорты-для-событий)
4. [Интеграция с DODO](#интеграция-с-dodo)
5. [Тестирование](#тестирование)

## Введение

Директория `middleware` содержит компоненты и функции для обработки промежуточных слоев в приложении Superset. Middleware используются для перехвата и обработки действий перед тем, как они достигнут редьюсеров, что позволяет реализовать такие функции, как логирование, обработка асинхронных событий и другие.

## Logger Middleware

### Логирование событий

**Описание**: Middleware для логирования событий в приложении.

**Ключевые файлы**:

- `superset-frontend/src/middleware/loggerMiddleware.js`

**Пример кода**:

```javascript
const loggerMiddleware = store => next => action => {
  if (action.type !== LOG_EVENT) {
    return next(action);
  }

  const { dashboardInfo, explore, impressionId, dashboardLayout, sqlLab } =
    store.getState();
  let logMetadata = {
    impression_id: impressionId,
    version: 'v2',
  };
  if (dashboardInfo?.id) {
    logMetadata = {
      source: 'dashboard',
      source_id: dashboardInfo.id,
      ...logMetadata,
    };
  } else if (explore?.slice) {
    logMetadata = {
      source: 'explore',
      source_id: explore.slice ? explore.slice.slice_id : 0,
      ...logMetadata,
    };
  } else if (sqlLab) {
    const editor = sqlLab.queryEditors.find(
      ({ id }) => id === sqlLab.tabHistory.slice(-1)[0],
    );
    logMetadata = {
      source: 'sqlLab',
      source_id: editor?.id,
      db_id: editor?.dbId,
      schema: editor?.schema,
    };
  }

  const { eventName } = action.payload;
  let { eventData = {} } = action.payload;
  eventData = {
    ...logMetadata,
    ts: new Date().getTime(),
    event_name: eventName,
    ...eventData,
  };
  if (LOG_EVENT_TYPE_TIMING.has(eventName)) {
    eventData = {
      ...eventData,
      event_type: 'timing',
      trigger_event: lastEventId,
    };
  } else {
    lastEventId = nanoid();
    eventData = {
      ...eventData,
      event_type: 'user',
      event_id: lastEventId,
      visibility: document.visibilityState,
    };
  }

  if (eventData.target_id && dashboardLayout?.present?.[eventData.target_id]) {
    const { meta } = dashboardLayout.present[eventData.target_id];
    // chart name or tab/header text
    eventData.target_name = meta.chartId ? meta.sliceName : meta.text;
  }

  logMessageQueue.append(eventData);
  return eventData;
};
```

### Отправка данных

**Описание**: Функции для отправки данных логирования на сервер.

**Ключевые файлы**:

- `superset-frontend/src/middleware/loggerMiddleware.js`

**Пример кода**:

```javascript
const LOG_ENDPOINT = '/superset/log/?explode=events';
const sendBeacon = events => {
  if (events.length <= 0) {
    return;
  }

  let endpoint = LOG_ENDPOINT;
  const { source, source_id } = events[0];
  // backend logs treat these request params as first-class citizens
  if (source === 'dashboard') {
    endpoint += `&dashboard_id=${source_id}`;
  } else if (source === 'slice') {
    endpoint += `&slice_id=${source_id}`;
  }

  if (navigator.sendBeacon) {
    const formData = new FormData();
    formData.append('events', safeStringify(events));
    if (SupersetClient.getGuestToken()) {
      // if we have a guest token, we need to send it for auth via the form
      formData.append('guest_token', SupersetClient.getGuestToken());
    }
    navigator.sendBeacon(endpoint, formData);
  } else {
    SupersetClient.post({
      endpoint,
      postPayload: { events },
      parseMethod: null,
    });
  }
};
```

**Очередь сообщений**:

```javascript
// beacon API has data size limit = 2^16.
// assume avg each log entry has 2^6 characters
const MAX_EVENTS_PER_REQUEST = 1024;
const logMessageQueue = new DebouncedMessageQueue({
  callback: sendBeacon,
  sizeThreshold: MAX_EVENTS_PER_REQUEST,
  delayThreshold: 1000,
});
```

## Async Event Middleware

### Обработка асинхронных событий

**Описание**: Middleware для обработки асинхронных событий в приложении.

**Ключевые файлы**:

- `superset-frontend/src/middleware/asyncEvent.ts`

**Пример кода**:

```typescript
export const init = (appConfig?: AppConfig) => {
  if (!isFeatureEnabled(FeatureFlag.GlobalAsyncQueries)) return;
  if (pollingTimeoutId) clearTimeout(pollingTimeoutId);

  listenersByJobId = {};
  retriesByJobId = {};
  lastReceivedEventId = null;

  config = appConfig || getBootstrapData().common.conf;
  transport = config.GLOBAL_ASYNC_QUERIES_TRANSPORT || TRANSPORT_POLLING;
  pollingDelayMs = config.GLOBAL_ASYNC_QUERIES_POLLING_DELAY || 500;

  try {
    lastReceivedEventId = localStorage.getItem(LOCALSTORAGE_KEY);
  } catch (err) {
    logging.warn('Failed to fetch last event Id from localStorage');
  }

  if (transport === TRANSPORT_POLLING) {
    loadEventsFromApi();
  }
  if (transport === TRANSPORT_WS) {
    wsConnect();
  }
};
```

### Транспорты для событий

**Описание**: Различные транспорты для передачи асинхронных событий.

**Ключевые файлы**:

- `superset-frontend/src/middleware/asyncEvent.ts`

**Пример кода**:

```typescript
const TRANSPORT_POLLING = 'polling';
const TRANSPORT_WS = 'ws';
const JOB_STATUS = {
  PENDING: 'pending',
  RUNNING: 'running',
  ERROR: 'error',
  DONE: 'done',
};
```

## Интеграция с DODO

**Описание**: Интеграция middleware с DODO-специфичными компонентами.

**DODO-модификации**:

- **44611022**: Добавлена функция логирования для API запросов

**Ключевые файлы**:

- `superset-frontend/packages/superset-ui-core/src/DodoExtensions/api/utils.ts`

**Пример кода**:

```typescript
// DODO added 44611022
import { AxiosRequestConfig } from 'axios';

const logger = (params: AxiosRequestConfig, isEnabled = false) => {
  if (isEnabled) {
    console.groupCollapsed(`${params.url} [${params.method}]`);
    console.log('data', params.data);
    console.log('data JSON:', JSON.stringify(params.data));
    console.log('headers', params.headers);
    console.log('headers JSON:', JSON.stringify(params.headers));
    console.groupEnd();
  }
};
```

**Использование в API**:

```typescript
async authanticateInDodoInner() {
  const { FRONTEND_LOGGER, ORIGIN_URL, CREDS } = this.config;
  const FULL_URL = `${ORIGIN_URL}${API_V1}/security/login`;

  const params = {
    method: 'post' as AxiosRequestConfig['method'],
    data: CREDS,
    headers: {},
    url: FULL_URL,
  };

  logger(params, FRONTEND_LOGGER);

  try {
    const {
      data,
      data: { access_token },
    } = await axios(params);
    this.auth.token = access_token;
    this.auth.Authorization = `Bearer ${access_token}`;
    return data;
  } catch (error) {
    return error;
  }
}
```

## Тестирование

**Описание**: Тесты для middleware.

**Ключевые файлы**:

- `superset-frontend/src/middleware/logger.test.js`
- `superset-frontend/src/middleware/asyncEvent.test.ts`

**Пример кода**:

```javascript
describe('logger middleware', () => {
  const next = sinon.spy();
  const mockStore = {
    getState: () => ({
      dashboardInfo: {
        id: 1,
      },
      impressionId: 'impression_id',
    }),
  };
  const action = {
    type: LOG_EVENT,
    payload: {
      eventName: LOG_ACTIONS_LOAD_CHART,
      eventData: {
        key: 'value',
        start_offset: 100,
      },
    },
  };

  let postStub;
  beforeEach(() => {
    postStub = sinon.stub(SupersetClient, 'post');
  });
  afterEach(() => {
    next.resetHistory();
    postStub.restore();
  });

  it('should include ts, start_offset, event_name, impression_id, source, and source_id in every event', () => {
    const clock = sinon.useFakeTimers();
    logger(mockStore)(next)(action);
    clock.tick(2000);

    expect(SupersetClient.post.callCount).toBe(1);
    const { events } = SupersetClient.post.getCall(0).args[0].postPayload;
    const mockEventdata = action.payload.eventData;
    const mockEventname = action.payload.eventName;
    expect(events[0]).toMatchObject({
      key: mockEventdata.key,
      event_name: mockEventname,
      impression_id: mockStore.getState().impressionId,
      source: 'dashboard',
      source_id: mockStore.getState().dashboardInfo.id,
      event_type: 'timing',
    });

    expect(typeof events[0].ts).toBe('number');
    expect(typeof events[0].start_offset).toBe('number');
  });
});
```
