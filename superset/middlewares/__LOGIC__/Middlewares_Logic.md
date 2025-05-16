# Документация по промежуточным слоям (Middlewares) в DODO

## Содержание

1. [Введение](#введение)
2. [Архитектура](#архитектура)
3. [Стандартная функциональность](#стандартная-функциональность)
4. [DODO-специфичная функциональность](#dodo-специфичная-функциональность)
5. [Техническая реализация](#техническая-реализация)
6. [Примеры использования](#примеры-использования)

## Введение

Модуль `middlewares` предоставляет промежуточные слои (middleware) для обработки HTTP-запросов и ответов в Superset. Промежуточные слои позволяют перехватывать и модифицировать запросы и ответы до и после их обработки основным приложением.

В DODO этот модуль используется для логирования запросов и ответов, что помогает в отладке и мониторинге приложения.

## Архитектура

Модуль `middlewares` организован следующим образом:

1. **Логгер** (`middleware_logger.py`):
   - `LoggerMiddleware` - промежуточный слой для логирования запросов и ответов
   - Логирует ошибки и информацию о запросах и ответах

2. **Фронтенд-middleware**:
   - `loggerMiddleware.js` - промежуточный слой для логирования событий на фронтенде
   - `asyncEvent.ts` - промежуточный слой для обработки асинхронных событий

## Стандартная функциональность

Стандартная функциональность модуля `middlewares` включает:

1. **Логирование запросов и ответов**:
   - Логирование ошибок (статус-коды 4xx и 5xx)
   - Логирование информации о запросах (метод, URL, тело запроса)
   - Логирование информации о ответах (статус-код, тело ответа)

2. **Обработка асинхронных событий**:
   - Обработка асинхронных событий на фронтенде
   - Поддержка различных транспортов для событий (polling, WebSocket)

3. **Логирование событий на фронтенде**:
   - Логирование пользовательских событий
   - Логирование событий времени выполнения
   - Отправка событий на сервер

## DODO-специфичная функциональность

В DODO модуль `middlewares` был расширен для поддержки дополнительного логирования и интеграции с системами DODO. Основные DODO-специфичные изменения:

1. **Логирование API-запросов**:
   - Добавлена функция логирования для API-запросов
   - Добавлено в рамках задачи #44611022

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

2. **Интеграция с API-обработчиком DODO**:
   - Модификация функций для работы с API-обработчиком DODO
   - Добавлено в рамках задачи #44611022

   ```typescript
   export const createFilterKey = (
     dashId: string | number,
     value: string,
     tabId?: string,
   ) =>
     // DODO changed 44611022
     (isStandalone
       ? SupersetClient.post({
           endpoint: assembleEndpoint(dashId, undefined, tabId),
           jsonPayload: { value },
         })
       : API_HANDLER.SupersetClient({
           method: 'post',
           url: assembleEndpoint(dashId, undefined, tabId),
           jsonPayload: { value },
         })
     )
       .then(r => (isStandalone ? r.json : r).key as string)
       .catch(err => {
         logging.error(err);
         return null;
       });
   ```

Эти изменения позволяют лучше интегрировать Superset с системами DODO и обеспечивают более подробное логирование для отладки и мониторинга.

## Техническая реализация

### LoggerMiddleware

Промежуточный слой для логирования запросов и ответов:

```python
class LoggerMiddleware(BaseHTTPMiddleware):
    def __init__(self) -> None:
        pass

    def _get_request_body(self, request: Request) -> dict[str, Any]:
        """Extract request body safely."""
        try:
            return request.get_json(silent=True) or {}
        except Exception:  # pylint: disable=broad-except
            return {}

    def _get_response_body(self, response: Response) -> dict[str, Any]:
        """Extract response body safely."""
        try:
            return json.loads(response.get_data(as_text=True)) or {}
        except Exception:  # pylint: disable=broad-except
            return {}

    def dispatch(
        self, request: Request, call_next: Callable[[Request], Response]
    ) -> Response:
        response = call_next(request)

        if 400 <= response.status_code < 600:
            logger.error(
                "Error response - status: %s",
                response.status_code,
                extra={
                    "method": request.method,
                    "url": request.url,
                    "status_code": response.status_code,
                    "is_authenticated": current_user.is_authenticated,
                    "request": {
                        "body": self._get_request_body(request),
                        "args": dict(request.args),
                    },
                    "response": {"body": self._get_response_body(response)},
                },
                exc_info=True,
            )

        return response
```

### Логирование API-запросов

Функция для логирования API-запросов:

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

### Логирование событий на фронтенде

Промежуточный слой для логирования событий на фронтенде:

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

// beacon API has data size limit = 2^16.
// assume avg each log entry has 2^6 characters
const MAX_EVENTS_PER_REQUEST = 1024;
const logMessageQueue = new DebouncedMessageQueue({
  callback: sendBeacon,
  sizeThreshold: MAX_EVENTS_PER_REQUEST,
  delayThreshold: 1000,
});
let lastEventId = 0;
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

### Обработка асинхронных событий

Промежуточный слой для обработки асинхронных событий:

```typescript
type AsyncEvent = {
  id?: string | null;
  channel_id: string;
  job_id: string;
  user_id?: string;
  status: string;
  errors?: SupersetError[];
  result_url: string | null;
};

type CachedDataResponse = {
  status: string;
  data: any;
};
type AppConfig = Record<string, any>;
type ListenerFn = (asyncEvent: AsyncEvent) => Promise<any>;

const TRANSPORT_POLLING = 'polling';
const TRANSPORT_WS = 'ws';
const JOB_STATUS = {
  PENDING: 'pending',
  RUNNING: 'running',
  ERROR: 'error',
  DONE: 'done',
};

let config: AppConfig;
let transport: string;
let pollingDelayMs: number;
let pollingTimeoutId: number | null = null;
let lastReceivedEventId: string | null = null;
let listenersByJobId: Record<string, ListenerFn[]> = {};
let retriesByJobId: Record<string, number> = {};
const LOCALSTORAGE_KEY = 'last-async-event-id';
const MAX_RETRIES = 6;

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

## Примеры использования

### Настройка LoggerMiddleware

```python
from flask import Flask
from flask_http_middleware import MiddlewareManager
from superset.middlewares.middleware_logger import LoggerMiddleware

app = Flask(__name__)
middleware_manager = MiddlewareManager(app)
middleware_manager.add_middleware(LoggerMiddleware())
```

### Использование логирования API-запросов

```typescript
import { logger } from '@superset-ui/core';

// Использование функции логирования
const params = {
  method: 'post',
  data: { name: 'John', age: 30 },
  headers: { 'Content-Type': 'application/json' },
  url: 'https://api.example.com/users',
};

logger(params, true);
```

### Использование логирования событий на фронтенде

```javascript
import { LOG_EVENT } from 'src/logger/actions';
import { LOG_ACTIONS_RENDER_CHART } from 'src/logger/LogUtils';

// Отправка события логирования
store.dispatch({
  type: LOG_EVENT,
  payload: {
    eventName: LOG_ACTIONS_RENDER_CHART,
    eventData: {
      chart_id: 123,
      viz_type: 'bar',
      start_offset: 100,
      ts: new Date().getTime(),
    },
  },
});
```

### Использование обработки асинхронных событий

```typescript
import { init, addListener, removeListener } from 'src/middleware/asyncEvent';

// Инициализация обработчика асинхронных событий
init();

// Добавление слушателя для асинхронного события
const listener = async (event) => {
  console.log('Received event:', event);
  if (event.status === 'DONE') {
    console.log('Job completed successfully');
  } else if (event.status === 'ERROR') {
    console.error('Job failed:', event.errors);
  }
};

// Добавление слушателя для конкретного задания
addListener('job-123', listener);

// Удаление слушателя
removeListener('job-123', listener);
```
