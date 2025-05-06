# Документация по DODO-специфичным компонентам и функциям в Logger

## Содержание

1. [Введение](#введение)
2. [Логирование событий](#логирование-событий)
   - [Действия логирования](#действия-логирования)
   - [Утилиты логирования](#утилиты-логирования)
3. [Интеграция с API](#интеграция-с-api)
4. [Интеграция с Rollbar](#интеграция-с-rollbar)
5. [Прочие модификации](#прочие-модификации)

## Введение

Данный документ содержит информацию о компонентах и функциях, которые были добавлены или модифицированы командой DODO в директории `logger` проекта Superset. Каждая модификация помечена идентификатором изменения (например, "DODO 47015293").

## Логирование событий

### Действия логирования

**Описание**: Действия для логирования событий в приложении.

**Ключевые файлы**:

- `superset-frontend/src/logger/actions/index.ts`

**Пример кода**:

```typescript
export const LOG_EVENT = 'LOG_EVENT';

export function logEvent(eventName: string, eventData: Record<string, any>) {
  return (dispatch: Dispatch) =>
    dispatch({
      type: LOG_EVENT,
      payload: {
        eventName,
        eventData,
      },
    });
}
```

### Утилиты логирования

**Описание**: Утилиты для логирования различных типов событий.

**Ключевые файлы**:

- `superset-frontend/src/logger/LogUtils.ts`
- `superset-frontend/src/logger/useLogAction.ts`

**Пример кода**:

```typescript
export const LOG_ACTIONS_LOAD_CHART = 'load_chart';
export const LOG_ACTIONS_RENDER_CHART = 'render_chart';
export const LOG_ACTIONS_HIDE_BROWSER_TAB = 'hide_browser_tab';

export const LOG_ACTIONS_MOUNT_DASHBOARD = 'mount_dashboard';
export const LOG_ACTIONS_MOUNT_EXPLORER = 'mount_explorer';

// ...

export const LOG_EVENT_TYPE_TIMING = new Set([
  LOG_ACTIONS_LOAD_CHART,
  LOG_ACTIONS_RENDER_CHART,
  LOG_ACTIONS_HIDE_BROWSER_TAB,
  LOG_ACTIONS_SQLLAB_FETCH_FAILED_QUERY,
  LOG_ACTIONS_SQLLAB_LOAD_TAB_STATE,
]);

export const LOG_EVENT_TYPE_USER = new Set([
  LOG_ACTIONS_MOUNT_DASHBOARD,
  LOG_ACTIONS_SELECT_DASHBOARD_TAB,
  LOG_ACTIONS_EXPLORE_DASHBOARD_CHART,
  LOG_ACTIONS_FORCE_REFRESH_CHART,
  LOG_ACTIONS_EXPORT_CSV_DASHBOARD_CHART,
  LOG_ACTIONS_CHANGE_DASHBOARD_FILTER,
  LOG_ACTIONS_CHANGE_EXPLORE_CONTROLS,
  LOG_ACTIONS_TOGGLE_EDIT_DASHBOARD,
  LOG_ACTIONS_FORCE_REFRESH_DASHBOARD,
  LOG_ACTIONS_PERIODIC_RENDER_DASHBOARD,
  LOG_ACTIONS_MOUNT_EXPLORER,
  LOG_ACTIONS_CONFIRM_OVERWRITE_DASHBOARD_METADATA,
  LOG_ACTIONS_DASHBOARD_DOWNLOAD_AS_IMAGE,
  LOG_ACTIONS_DASHBOARD_DOWNLOAD_AS_PDF,
  LOG_ACTIONS_CHART_DOWNLOAD_AS_IMAGE,
]);
```

**Хук для логирования**:

```typescript
export default function useLogAction(staticEventData: Record<string, any>) {
  const dispatch = useDispatch();
  const logAction = useCallback<typeof logEvent>(
    (type, payload) =>
      dispatch(
        logEvent(type, {
          payload: {
            ...staticEventData,
            ...payload,
          },
        }),
      ),
    [staticEventData, dispatch],
  );

  return logAction;
}
```

## Интеграция с API

**Описание**: Интеграция логирования с API.

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

## Интеграция с Rollbar

**Описание**: Интеграция с сервисом Rollbar для отслеживания ошибок.

**DODO-модификации**:

- **47015293**: Добавлена интеграция с Rollbar

**Ключевые файлы**:

- `superset-frontend/src/views/App.tsx`
- `superset-frontend/src/firebase/rollbar.ts`

**Пример кода**:

```typescript
import { ROLLBAR_CONFIG } from 'src/firebase/rollbar'; // DODO added 47015293
```

## Прочие модификации

### Middleware для логирования

**Описание**: Middleware для логирования событий в Redux.

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
  // ...
};
```

### Логирование в компонентах

**Описание**: Использование логирования в различных компонентах приложения.

**Ключевые файлы**:

- `superset-frontend/src/dashboard/components/Header/index.jsx`

**Пример кода**:

```javascript
import {
  LOG_ACTIONS_PERIODIC_RENDER_DASHBOARD,
  LOG_ACTIONS_FORCE_REFRESH_DASHBOARD,
  LOG_ACTIONS_TOGGLE_EDIT_DASHBOARD,
} from 'src/logger/LogUtils';

// ...

handleRefresh() {
  if (this.props.onRefresh) {
    this.props.logEvent(LOG_ACTIONS_FORCE_REFRESH_DASHBOARD, {
      force: true,
      interval: 0,
    });
    this.props.onRefresh();
  }
}
```
