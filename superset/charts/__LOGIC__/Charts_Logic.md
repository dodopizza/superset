# Документация по графикам (Charts) в DODO

## Содержание

1. [Введение](#введение)
2. [Архитектура](#архитектура)
3. [Стандартная функциональность](#стандартная-функциональность)
4. [DODO-специфичная функциональность](#dodo-специфичная-функциональность)
5. [Техническая реализация](#техническая-реализация)
6. [API](#api)

## Введение

Модуль `charts` предоставляет функциональность для работы с графиками и визуализациями в Superset. Графики являются основным способом визуализации данных в Superset и могут быть добавлены на дашборды для создания комплексных аналитических представлений.

В DODO этот модуль используется для создания и управления различными типами визуализаций, которые помогают аналитикам и бизнес-пользователям анализировать данные и принимать решения.

## Архитектура

Модуль состоит из следующих основных компонентов:

1. **API** (`charts/api.py`):
   - `ChartRestApi` - REST API для работы с графиками
   - Предоставляет эндпоинты для создания, чтения, обновления и удаления графиков
   - Поддерживает экспорт и импорт графиков

2. **Схемы** (`charts/schemas.py`):
   - Схемы для валидации запросов и сериализации ответов
   - Схемы для описания контекста запроса данных
   - Схемы для описания операций постобработки данных

3. **Фильтры** (`charts/filters.py`):
   - Фильтры для поиска и фильтрации графиков

4. **Постобработка** (`charts/post_processing.py`):
   - Функции для постобработки данных после выполнения запроса
   - Поддержка агрегации, сортировки, фильтрации и других операций

## Стандартная функциональность

Стандартная функциональность модуля `charts` включает:

1. **Управление графиками**:
   - Создание, чтение, обновление и удаление графиков
   - Экспорт и импорт графиков
   - Дублирование графиков

2. **Получение данных для графиков**:
   - Выполнение запросов к источникам данных
   - Кэширование результатов запросов
   - Асинхронное получение данных для больших запросов

3. **Постобработка данных**:
   - Агрегация данных
   - Сортировка и фильтрация
   - Расчет скользящих средних и других статистических показателей
   - Преобразование данных для специфических типов визуализаций

## DODO-специфичная функциональность

В результате анализа кода **не обнаружено DODO-специфичных изменений или расширений** в бэкенд-модуле `charts`. Весь код в этом модуле является стандартным для Superset.

Однако, в клиентской части (фронтенд) есть несколько DODO-специфичных компонентов, которые расширяют функциональность графиков:

1. **DODO-специфичные типы графиков**:
   - `EchartsBarChartPluginDodo` - модифицированная версия столбчатой диаграммы
   - `EchartsBubbleChartDodoPlugin` - модифицированная версия пузырьковой диаграммы

2. **Дополнительные возможности визуализации**:
   - Условное форматирование для графиков
   - Дополнительные настройки отображения меток
   - Поддержка логарифмической шкалы для осей

Эти компоненты находятся в директории `superset-frontend/plugins/plugin-chart-echarts/src/DodoExtensions/` и расширяют стандартные типы графиков Superset.

### Примеры DODO-специфичных компонентов

#### EchartsBarChartPluginDodo

```typescript
// DODO created 45525377
export default class EchartsBarChartPluginDodo extends ChartPlugin<
  EchartsBarFormData,
  EchartsBarChartProps
> {
  constructor() {
    super({
      buildQuery,
      controlPanel,
      loadChart: () => import('./EchartsBarChart'),
      metadata: new ChartMetadata({
        label: ChartLabel.Deprecated,
        behaviors: [Behavior.InteractiveChart],
        credits: ['https://echarts.apache.org'],
        description: 'Bar Chart (Apache ECharts) with D3 format support',
        name: t('Echarts Bar Chart'),
        exampleGallery: [],
        tags: [t('Popular'), t('ECharts'), t('DODOIS_friendly')],
        thumbnail,
      }),
      transformProps,
    });
  }
}
```

#### EchartsBubbleChartDodoPlugin

```typescript
export default class EchartsBubbleChartDodoPlugin extends ChartPlugin {
  constructor() {
    super({
      loadChart: () => import('./BubbleDodo'),
      metadata,
      buildQuery,
      transformProps,
      controlPanel,
    });
  }
}
```

## Техническая реализация

### API для работы с графиками

API для работы с графиками реализовано в классе `ChartRestApi`:

```python
class ChartRestApi(BaseSupersetModelRestApi):
    datamodel = SQLAInterface(Slice)
    include_route_methods = RouteMethod.REST_MODEL_VIEW_CRUD_SET | {
        RouteMethod.EXPORT,
        RouteMethod.IMPORT,
        RouteMethod.RELATED,
        "bulk_delete",
        "data",
        "data_from_cache",
        "warm_up_cache",
        "cache_screenshot",
        "screenshot",
        "favorite_status",
        "thumbnail",
        "duplicate",
    }
    # ...
```

### Схемы для валидации запросов

Схемы для валидации запросов на получение данных для графиков:

```python
class ChartDataQueryContextSchema(Schema):
    datasource = fields.Nested(ChartDataDatasourceSchema)
    queries = fields.List(fields.Nested(ChartDataQueryObjectSchema))
    force = fields.Boolean(
        metadata={"description": "Should the queries be forced to load from the source"},
    )
    result_type = fields.String(
        validate=validate.OneOf(
            choices=("full", "query", "results", "samples"),
        ),
        metadata={
            "description": "Type of results to return",
        },
    )
    result_format = fields.String(
        validate=validate.OneOf(choices=("json", "csv", "xlsx")),
        metadata={
            "description": "Format of results to return",
        },
    )
```

### Постобработка данных

Функции для постобработки данных:

```python
def _apply_rolling(
    df: pd.DataFrame,
    rolling_type: str,
    columns: Dict[str, str],
    window: int,
    min_periods: Optional[int],
    center: bool,
    win_type: Optional[str],
) -> pd.DataFrame:
    """
    Apply rolling window calculations on the dataset.
    """
    # ...
```

## API

### Получение данных для графика

```
POST /api/v1/chart/data
```

Тело запроса:

```json
{
  "datasource": {
    "id": 1,
    "type": "table"
  },
  "queries": [
    {
      "columns": ["column1", "column2"],
      "metrics": ["metric1", "metric2"],
      "filters": [],
      "orderby": [["column1", true]],
      "time_range": "Last week"
    }
  ],
  "force": false,
  "result_type": "full",
  "result_format": "json"
}
```

### Экспорт графика

```
GET /api/v1/chart/export/?q={"ids":[1,2,3]}
```

### Импорт графика

```
POST /api/v1/chart/import/
```

### Прогрев кэша для графика

```
POST /api/v1/chart/warm_up_cache
```

Тело запроса:

```json
{
  "chart_id": 1,
  "dashboard_id": 1,
  "extra_filters": []
}
```
