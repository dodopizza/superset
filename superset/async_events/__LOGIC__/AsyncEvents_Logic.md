# Документация по асинхронным событиям (Async Events) в DODO

## Содержание

1. [Введение](#введение)
2. [Архитектура](#архитектура)
3. [Стандартная функциональность](#стандартная-функциональность)
4. [DODO-специфичная функциональность](#dodo-специфичная-функциональность)
5. [Техническая реализация](#техническая-реализация)
6. [API](#api)

## Введение

Модуль `async_events` предоставляет механизм для асинхронной обработки запросов и уведомления клиентов о результатах выполнения длительных операций в Superset. Этот механизм позволяет выполнять тяжелые запросы в фоновом режиме, не блокируя пользовательский интерфейс, и уведомлять пользователя о завершении операции.

В DODO этот механизм используется для оптимизации работы с большими объемами данных и улучшения пользовательского опыта при работе с дашбордами.

## Архитектура

Модуль состоит из следующих основных компонентов:

1. **Менеджер асинхронных запросов** (`async_query_manager.py`):
   - `AsyncQueryManager` - основной класс для управления асинхронными запросами
   - Отвечает за инициализацию, выполнение и отслеживание асинхронных задач
   - Взаимодействует с Redis для хранения и передачи событий

2. **API** (`api.py`):
   - `AsyncEventsRestApi` - REST API для работы с асинхронными событиями
   - Предоставляет эндпоинты для получения событий клиентами

3. **Фабрика менеджера** (`async_query_manager_factory.py`):
   - Создает и настраивает экземпляр `AsyncQueryManager`
   - Интегрируется с конфигурацией Superset

4. **Клиентская часть** (в `superset-frontend/src/middleware/asyncEvent.ts`):
   - Обрабатывает асинхронные события на стороне клиента
   - Поддерживает два транспорта: polling (опрос) и WebSocket

## Стандартная функциональность

Стандартная функциональность модуля `async_events` включает:

1. **Асинхронное выполнение запросов**:
   - Запуск длительных операций в фоновом режиме
   - Отслеживание статуса выполнения задач
   - Уведомление клиентов о завершении операций

2. **Транспорты для передачи событий**:
   - Polling (периодический опрос сервера)
   - WebSocket (для реального времени)

3. **Кэширование результатов**:
   - Сохранение результатов запросов в кэше
   - Предоставление URL для получения результатов

4. **Обработка ошибок**:
   - Передача информации об ошибках клиенту
   - Логирование проблем на сервере

## DODO-специфичная функциональность

В результате анализа кода **не обнаружено DODO-специфичных изменений или расширений** в модуле `async_events`. Весь код в этом модуле является стандартным для Superset.

Однако, в клиентской части (фронтенд) есть некоторые DODO-специфичные компоненты, которые взаимодействуют с асинхронными событиями:

1. **Логирование API запросов** (в `superset-frontend/packages/superset-ui-core/src/DodoExtensions/api/utils.ts`):
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

   Эта функция используется для логирования API запросов в консоль браузера, что помогает при отладке и разработке.

2. **Кастомный API клиент** (в `superset-frontend/packages/superset-ui-core/src/DodoExtensions/api/index.ts`):
   Реализует кастомный клиент для работы с API Superset, который может использоваться для асинхронных запросов.

Эти компоненты не изменяют базовую функциональность модуля `async_events`, но расширяют возможности взаимодействия с ним на стороне клиента.

## Техническая реализация

### Менеджер асинхронных запросов

Класс `AsyncQueryManager` отвечает за управление асинхронными запросами:

```python
class AsyncQueryManager:
    MAX_EVENT_COUNT = 100
    STATUS_PENDING = "pending"
    STATUS_RUNNING = "running"
    STATUS_ERROR = "error"
    STATUS_DONE = "done"

    def __init__(self) -> None:
        super().__init__()
        self._redis: redis.Redis  # type: ignore
        self._stream_prefix: str = ""
        self._stream_limit: Optional[int]
        self._stream_limit_firehose: Optional[int]
        self._jwt_cookie_name: str = ""
        self._jwt_cookie_secure: bool = False
        self._jwt_cookie_domain: Optional[str]
        self._jwt_cookie_samesite: Optional[Literal["None", "Lax", "Strict"]] = None
        self._jwt_secret: str
        self._load_chart_data_into_cache_job: Any = None
        self._load_explore_json_into_cache_job: Any = None
```

Основные методы:

1. `init_job` - инициализирует новую асинхронную задачу
2. `read_events` - читает события из Redis
3. `update_job` - обновляет статус задачи
4. `submit_explore_json_job` - запускает задачу для получения данных в формате JSON
5. `submit_chart_data_job` - запускает задачу для получения данных для графика

### Клиентская часть

Клиентская часть реализована в файле `superset-frontend/src/middleware/asyncEvent.ts` и предоставляет следующие функции:

1. `init` - инициализирует систему асинхронных событий
2. `waitForAsyncData` - ожидает завершения асинхронной операции
3. `processEvents` - обрабатывает полученные события
4. `fetchEvents` - получает события с сервера

```typescript
export const waitForAsyncData = async (asyncResponse: AsyncEvent) =>
  new Promise((resolve, reject) => {
    const jobId = asyncResponse.job_id;
    const listener = async (asyncEvent: AsyncEvent) => {
      switch (asyncEvent.status) {
        case JOB_STATUS.DONE: {
          let { data, status } = await fetchCachedData(asyncEvent);
          data = ensureIsArray(data);
          if (status === 'success') {
            resolve(data);
          } else {
            reject(data);
          }
          break;
        }
        case JOB_STATUS.ERROR: {
          const err = parseErrorJson(asyncEvent);
          reject(err);
          break;
        }
        default: {
          logging.warn('received event with status', asyncEvent.status);
        }
      }
      removeListener(jobId);
    };
    addListener(jobId, listener);
  });
```

## API

### Получение асинхронных событий

```
GET /api/v1/async_event/
```

Параметры запроса:
- `last_id` (опционально): ID последнего полученного события

Возвращает список новых событий с момента `last_id`.

### Формат события

```json
{
  "id": "1518951480106-0",
  "channel_id": "999",
  "job_id": "foo123",
  "user_id": "1",
  "status": "done",
  "errors": [],
  "result_url": "/api/v1/chart/data/cache-key-1"
}
```

Возможные статусы:
- `pending` - задача ожидает выполнения
- `running` - задача выполняется
- `error` - произошла ошибка
- `done` - задача успешно завершена

### Получение результатов

После получения события со статусом `done`, клиент может получить результаты по URL, указанному в поле `result_url`.
