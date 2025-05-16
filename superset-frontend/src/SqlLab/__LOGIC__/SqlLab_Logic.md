# Документация по DODO-специфичным компонентам и функциям в SqlLab

## Содержание

1. [Введение](#введение)
2. [Локализация](#локализация)
   - [Локализация состояний запросов](#локализация-состояний-запросов)
   - [Локализация статусов](#локализация-статусов)
3. [Форматирование SQL](#форматирование-sql)
4. [Хранение состояния](#хранение-состояния)
5. [Прочие модификации](#прочие-модификации)

## Введение

Данный документ содержит информацию о компонентах и функциях, которые были добавлены или модифицированы командой DODO в директории `SqlLab` проекта Superset. Каждая модификация помечена идентификатором изменения (например, "DODO 44611022").

## Локализация

### Локализация состояний запросов

**Описание**: Добавлены локализованные строки для состояний запросов.

**Ключевые файлы**:

- `superset-frontend/src/SqlLab/constants.ts`

**Пример кода**:

```typescript
export const STATE_TYPE_MAP: Record<string, Type> = {
  offline: 'danger',
  failed: 'danger',
  pending: 'info',
  fetching: 'info',
  running: 'warning',
  stopped: 'danger',
  success: 'success',
};

export const STATE_TYPE_MAP_LOCALIZED = {
  offline: t('offline'),
  failed: t('failed'),
  pending: t('pending'),
  fetching: t('fetching'),
  running: t('running'),
  stopped: t('stopped'),
  success: t('success'),
};
```

### Локализация статусов

**Описание**: Добавлены локализованные строки для статусов запросов.

**Ключевые файлы**:

- `superset-frontend/src/SqlLab/constants.ts`

**Пример кода**:

```typescript
export const STATUS_OPTIONS = {
  success: 'success',
  failed: 'failed',
  running: 'running',
  offline: 'offline',
  pending: 'pending',
};

export const STATUS_OPTIONS_LOCALIZED = {
  success: t('success'),
  failed: t('failed'),
  running: t('running'),
  offline: t('offline'),
  pending: t('pending'),
};
```

## Форматирование SQL

**Описание**: Функциональность для форматирования SQL-запросов.

**Ключевые файлы**:

- `superset-frontend/src/SqlLab/actions/sqlLab.js`
- `superset/sqllab/api.py`

**Пример кода**:

```javascript
export function formatQuery(queryEditor) {
  return function (dispatch, getState) {
    const { sql } = getUpToDateQuery(getState(), queryEditor);
    return SupersetClient.post({
      endpoint: `/api/v1/sqllab/format_sql/`,
      // TODO (betodealmeida): pass engine as a parameter for better formatting
      body: JSON.stringify({ sql }),
      headers: { 'Content-Type': 'application/json' },
    }).then(({ json }) => {
      dispatch(queryEditorSetSql(queryEditor, json.result));
    });
  };
}
```

## Хранение состояния

**Описание**: Механизмы для хранения состояния SQL Lab в локальном хранилище браузера.

**DODO-модификации**:

- Оптимизация хранения состояния для уменьшения использования локального хранилища

**Ключевые файлы**:

- `superset-frontend/src/SqlLab/utils/reduxStateToLocalStorageHelper.ts`
- `superset-frontend/src/SqlLab/middlewares/persistSqlLabStateEnhancer.js`
- `superset-frontend/src/SqlLab/constants.ts`

**Пример кода**:

```typescript
const PERSISTENT_QUERY_EDITOR_KEYS = new Set([
  'version',
  'remoteId',
  'autorun',
  'dbId',
  'height',
  'id',
  'latestQueryId',
  'northPercent',
  'queryLimit',
  'schema',
  'selectedText',
  'southPercent',
  'sql',
  'templateParams',
  'name',
  'hideLeftBar',
]);
```

**Константы для хранения**:

```typescript
// kilobyte storage
export const KB_STORAGE = 1024;
export const BYTES_PER_CHAR = 2;

// browser's localStorage max usage constants
export const LOCALSTORAGE_MAX_QUERY_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours
export const LOCALSTORAGE_MAX_USAGE_KB = 5 * 1024; // 5M
export const LOCALSTORAGE_MAX_QUERY_RESULTS_KB = 1 * 1024; // 1M
export const LOCALSTORAGE_WARNING_THRESHOLD = 0.9;
export const LOCALSTORAGE_WARNING_MESSAGE_THROTTLE_MS = 8000; // danger type toast duration
```

## Прочие модификации

### Автодополнение в редакторе SQL

**Описание**: Механизм автодополнения в редакторе SQL с поддержкой схем, таблиц и колонок.

**Ключевые файлы**:

- `superset-frontend/src/SqlLab/components/AceEditorWrapper/useKeywords.ts`
- `superset-frontend/src/SqlLab/constants.ts`

**Пример кода**:

```typescript
// autocomplete score weights
export const SQL_KEYWORD_AUTOCOMPLETE_SCORE = 100;
export const SQL_FUNCTIONS_AUTOCOMPLETE_SCORE = 90;
export const SCHEMA_AUTOCOMPLETE_SCORE = 60;
export const TABLE_AUTOCOMPLETE_SCORE = 55;
export const COLUMN_AUTOCOMPLETE_SCORE = 50;
```

### Мониторинг использования локального хранилища

**Описание**: Механизм для мониторинга использования локального хранилища и предупреждения пользователя при приближении к лимиту.

**Ключевые файлы**:

- `superset-frontend/src/SqlLab/components/App/index.tsx`

**Пример кода**:

```typescript
componentDidUpdate() {
  const { localStorageUsageInKilobytes, actions, queries } = this.props;
  const queryCount = Object.keys(queries || {}).length || 0;
  if (
    localStorageUsageInKilobytes >=
    LOCALSTORAGE_WARNING_THRESHOLD * LOCALSTORAGE_MAX_USAGE_KB
  ) {
    this.showLocalStorageUsageWarning(
      localStorageUsageInKilobytes,
      queryCount,
    );
  }
  if (localStorageUsageInKilobytes > 0 && !this.hasLoggedLocalStorageUsage) {
    const eventData = {
      current_usage: localStorageUsageInKilobytes,
      query_count: queryCount,
    };
    actions.logEvent(
      LOG_ACTIONS_SQLLAB_MONITOR_LOCAL_STORAGE_USAGE,
      eventData,
    );
    this.hasLoggedLocalStorageUsage = true;
  }
}
```

### Поддержка локализации в компонентах

**Описание**: Добавлена поддержка локализации в различных компонентах SQL Lab.

**DODO-модификации**:

- **44611022**: Добавлена настройка локали по умолчанию (русский язык)

**Ключевые файлы**:

- `superset-frontend/src/preamble.ts`

**Пример кода**:

```typescript
// DODO added start 44611022
const root = document.getElementById('app');
const dataBootstrap = root
  ? JSON.parse(root.getAttribute('data-bootstrap') || '{}')
  : {};

bootstrapData = {
  ...dataBootstrap,
  common: {
    ...dataBootstrap?.common,
    locale: dataBootstrap?.common?.locale || 'ru',
  },
};
// DODO added stop 44611022
```
