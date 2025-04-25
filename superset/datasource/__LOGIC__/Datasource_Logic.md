# Документация по источникам данных (Datasource) в DODO

## Содержание

1. [Введение](#введение)
2. [Архитектура](#архитектура)
3. [Стандартная функциональность](#стандартная-функциональность)
4. [DODO-специфичная функциональность](#dodo-специфичная-функциональность)
5. [Техническая реализация](#техническая-реализация)
6. [Примеры использования](#примеры-использования)

## Введение

Модуль `datasource` предоставляет API для работы с источниками данных в Superset. Источники данных (Datasource) - это абстракция, которая представляет таблицы, запросы и другие источники данных, которые могут быть использованы для создания визуализаций.

В DODO этот модуль расширен для поддержки локализации и дополнительных метаданных, что позволяет создавать более информативные и удобные для пользователя визуализации.

## Архитектура

Модуль `datasource` организован следующим образом:

1. **API** (`api.py`):
   - `DatasourceRestApi` - REST API для работы с источниками данных
   - Предоставляет эндпоинты для получения данных из источников данных

2. **Базовые классы**:
   - `BaseDatasource` - базовый класс для всех источников данных (определен в `superset/connectors/sqla/models.py`)
   - Определяет общий интерфейс для всех источников данных

3. **Реализации**:
   - `SqlaTable` - источник данных для SQL-таблиц (определен в `superset/connectors/sqla/models.py`)
   - `Query` - источник данных для SQL-запросов (определен в `superset/models/sql_lab.py`)
   - `SavedQuery` - источник данных для сохраненных запросов (определен в `superset/models/sql_lab.py`)

## Стандартная функциональность

Стандартная функциональность модуля `datasource` включает:

1. **Получение данных из источников**:
   - Получение значений колонок
   - Получение метаданных колонок
   - Получение образцов данных

2. **Работа с метаданными**:
   - Получение информации о колонках
   - Получение информации о метриках
   - Получение информации о типах данных

3. **Валидация**:
   - Проверка доступа к источникам данных
   - Проверка корректности запросов

## DODO-специфичная функциональность

В DODO модуль `datasource` был расширен для поддержки локализации и дополнительных метаданных. Основные DODO-специфичные изменения:

1. **Утилиты для работы с описаниями источников данных**:
   - Функция `extractDatasourceDescriptions` для извлечения и отображения описаний источников данных
   - Функция `extendDatasourceDescriptions` для расширения описаний источников данных
   - Добавлены в рамках задачи #44728892

   ```typescript
   // DODO was here
   // DODO created 44728892
   import {
     AdhocMetricSimple,
     Column,
     isAdhocMetricSQL,
     isSavedMetric,
     Maybe,
     Metric,
     QueryFormMetric,
   } from '@superset-ui/core';

   type Source = Metric | Column | AdhocMetricSimple['column'];

   export const extractDatasourceDescriptions = (
     queryFormMetrics: QueryFormMetric[], // Chart Metrics
     datasourceMetrics: Metric[],
     datasourceColumns: Column[],
     locale: string,
   ): Record<string, string> => {
     const descriptions: Record<string, string> = {};

     const localizedKey = `description_${locale}` as
       | 'description_en'
       | 'description_ru';

     const datasource = [...datasourceMetrics, ...datasourceColumns];
     const datasourceMap = datasource.reduce(
       (acc: Record<string, Source>, source) => {
         const sourceName =
           'metric_name' in source ? source.metric_name : source.column_name;
         acc[sourceName] = source;
         return acc;
       },
       {},
     );

     const getDescription = (source: Source): Maybe<string> | undefined =>
       source[localizedKey] ||
       source.description_ru ||
       source.description_en ||
       source.description;

     const addDescriptionToDictionary = (metric: QueryFormMetric) => {
       if (isAdhocMetricSQL(metric)) return;

       const metricName = isSavedMetric(metric)
         ? metric
         : metric.column.column_name;
       if (!metricName) return;

       const source = datasourceMap[metricName];
       if (!source) return;

       const description = getDescription(source);
       if (!description) return;

       descriptions[metricName] = description;

       const label = isSavedMetric(metric) ? source.verbose_name : metric.label;
       if (label) descriptions[label] = description;
     };
   ```

2. **Расширение функциональности для экспорта данных**:
   - Добавлена поддержка экспорта данных в формате XLSX
   - Добавлено в рамках задачи #44611022

   ```javascript
   import FileSaver from 'file-saver'; // DODO added 44611022
   import {
     API_HANDLER, // DODO added 44611022
     buildQueryContext,
     ensureIsArray,
     getChartBuildQueryRegistry,
     getChartMetadataRegistry,
     SupersetClient,
   } from '@superset-ui/core';
   ```

Эти изменения позволяют создавать более информативные и удобные для пользователя визуализации, с поддержкой локализации и дополнительных метаданных.

## Техническая реализация

### DatasourceRestApi

REST API для работы с источниками данных:

```python
class DatasourceRestApi(BaseSupersetApi):
    allow_browser_login = True
    class_permission_name = "Datasource"
    resource_name = "datasource"
    openapi_spec_tag = "Datasources"

    @expose(
        "/<datasource_type>/<int:datasource_id>/column/<column_name>/values/",
        methods=("GET",),
    )
    @protect()
    @safe
    @statsd_metrics
    @event_logger.log_this_with_context(
        action=lambda self, *args, **kwargs: f"{self.__class__.__name__}"
        f".get_column_values",
        log_to_statsd=False,
    )
    def get_column_values(
        self, datasource_type: str, datasource_id: int, column_name: str
    ) -> FlaskResponse:
        """
        Retrieves the values for a column in a datasource
        ---
        get:
          summary: Retrieves the values for a column in a datasource
          parameters:
          - in: path
            schema:
              type: string
            name: datasource_type
          - in: path
            schema:
              type: integer
            name: datasource_id
          - in: path
            schema:
              type: string
            name: column_name
          responses:
            200:
              description: Query result
              content:
                application/json:
                  schema:
                    $ref: "#/components/schemas/QueryRestApi.get_results"
            400:
              $ref: '#/components/responses/400'
            401:
              $ref: '#/components/responses/401'
            404:
              $ref: '#/components/responses/404'
            500:
              $ref: '#/components/responses/500'
        """
        try:
            datasource = DatasourceDAO.get_datasource(
                DatasourceType(datasource_type), datasource_id
            )
        except DatasourceTypeNotSupportedError:
            return self.response_404()
        except DatasourceNotFound:
            return self.response_404()

        try:
            security_manager.raise_for_access(datasource=datasource)
        except SupersetSecurityException as ex:
            return self.response(403, message=str(ex))

        row_limit = apply_max_row_limit(app.config["FILTER_SELECT_ROW_LIMIT"])
        try:
            payload = datasource.values_for_column(column_name=column_name, limit=row_limit)
            return self.response(200, result=payload)
        except SupersetException as ex:
            return self.response(400, message=str(ex))
```

### Утилиты для работы с описаниями источников данных

Функция `extractDatasourceDescriptions` для извлечения и отображения описаний источников данных:

```typescript
export const extractDatasourceDescriptions = (
  queryFormMetrics: QueryFormMetric[], // Chart Metrics
  datasourceMetrics: Metric[],
  datasourceColumns: Column[],
  locale: string,
): Record<string, string> => {
  const descriptions: Record<string, string> = {};

  const localizedKey = `description_${locale}` as
    | 'description_en'
    | 'description_ru';

  const datasource = [...datasourceMetrics, ...datasourceColumns];
  const datasourceMap = datasource.reduce(
    (acc: Record<string, Source>, source) => {
      const sourceName =
        'metric_name' in source ? source.metric_name : source.column_name;
      acc[sourceName] = source;
      return acc;
    },
    {},
  );

  const getDescription = (source: Source): Maybe<string> | undefined =>
    source[localizedKey] ||
    source.description_ru ||
    source.description_en ||
    source.description;

  const addDescriptionToDictionary = (metric: QueryFormMetric) => {
    if (isAdhocMetricSQL(metric)) return;

    const metricName = isSavedMetric(metric)
      ? metric
      : metric.column.column_name;
    if (!metricName) return;

    const source = datasourceMap[metricName];
    if (!source) return;

    const description = getDescription(source);
    if (!description) return;

    descriptions[metricName] = description;

    const label = isSavedMetric(metric) ? source.verbose_name : metric.label;
    if (label) descriptions[label] = description;
  };

  queryFormMetrics.forEach(addDescriptionToDictionary);

  return descriptions;
};
```

Функция `extendDatasourceDescriptions` для расширения описаний источников данных:

```typescript
export const extendDatasourceDescriptions = (
  datasourceDesriptions: Record<string, string>,
  groupBy: QueryFormColumn[],
  series: SeriesOption[],
): Record<string, string> => {
  if (!groupBy.length) return datasourceDesriptions;

  const extendedDatasourceDesriptions = {
    ...datasourceDesriptions,
  };

  series.forEach(option => {
    const { id } = option;

    if (typeof id !== 'string') return;

    const metricName = id.split(', ')[0];

    if (extendedDatasourceDesriptions[metricName]) {
      extendedDatasourceDesriptions[id] =
        extendedDatasourceDesriptions[metricName];
    }
  });

  return extendedDatasourceDesriptions;
};
```

## Примеры использования

### Получение значений колонки

```python
from superset.daos.datasource import DatasourceDAO
from superset.utils.core import DatasourceType

# Получение источника данных
datasource = DatasourceDAO.get_datasource(DatasourceType.TABLE, 1)

# Получение значений колонки
values = datasource.values_for_column(column_name="country", limit=100)
```

### Использование утилит для работы с описаниями источников данных

```typescript
import { extractDatasourceDescriptions, extendDatasourceDescriptions } from '@superset-ui/chart-controls';

// Извлечение описаний источников данных
const descriptions = extractDatasourceDescriptions(
  queryFormMetrics,
  datasourceMetrics,
  datasourceColumns,
  'ru', // Используем русскую локаль
);

// Расширение описаний источников данных
const extendedDescriptions = extendDatasourceDescriptions(
  descriptions,
  groupBy,
  series,
);

// Использование описаний для отображения тултипов
const tooltips = series.map(option => {
  const { id } = option;
  if (typeof id !== 'string') return null;
  
  return {
    id,
    description: extendedDescriptions[id],
  };
});
```
