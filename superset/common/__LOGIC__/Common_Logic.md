# Документация по общим компонентам (Common) в DODO

## Содержание

1. [Введение](#введение)
2. [Архитектура](#архитектура)
3. [Стандартная функциональность](#стандартная-функциональность)
4. [DODO-специфичная функциональность](#dodo-специфичная-функциональность)
5. [Основные компоненты](#основные-компоненты)
6. [Примеры использования](#примеры-использования)

## Введение

Модуль `common` содержит общие компоненты и утилиты, которые используются в различных частях Superset. Эти компоненты предоставляют базовую функциональность для работы с запросами, контекстами запросов, тегами и другими общими элементами.

В DODO этот модуль используется как основа для многих функций, включая локализацию и дополнительные возможности визуализации.

## Архитектура

Модуль `common` организован в несколько основных компонентов:

1. **Контекст запроса** (`query_context.py`, `query_context_processor.py`, `query_context_factory.py`):
   - Классы и функции для работы с контекстом запроса данных
   - Обработка запросов и подготовка данных для визуализаций

2. **Объект запроса** (`query_object.py`, `query_object_factory.py`):
   - Классы и функции для работы с объектами запроса
   - Определение параметров запроса данных

3. **Действия с запросами** (`query_actions.py`):
   - Функции для выполнения различных действий с запросами
   - Обработка результатов запросов

4. **Теги** (`tags.py`):
   - Функции для работы с тегами
   - Добавление тегов к объектам

5. **Утилиты** (`utils/`):
   - Различные утилиты для работы с данными
   - Функции для обработки DataFrame и других структур данных

## Стандартная функциональность

Стандартная функциональность модуля `common` включает:

1. **Обработка запросов**:
   - Создание и выполнение запросов к источникам данных
   - Обработка результатов запросов
   - Кэширование результатов

2. **Работа с контекстом запроса**:
   - Создание контекста запроса
   - Обработка параметров запроса
   - Подготовка данных для визуализаций

3. **Работа с тегами**:
   - Добавление тегов к объектам
   - Синхронизация тегов
   - Поиск объектов по тегам

4. **Утилиты для работы с данными**:
   - Обработка DataFrame
   - Объединение данных
   - Форматирование данных

## DODO-специфичная функциональность

В модуле `common` обнаружена одна DODO-специфичная модификация:

1. **Поддержка локализации в результатах запросов** (`chart_data.py`):
   - Добавлен класс `ChartDataResultLanguage` для указания языка результатов запроса
   - Поддерживаются языки `RU` (русский) и `EN` (английский)

```python
# dodo added 44120742
class ChartDataResultLanguage(StrEnum):
    """
    Chart data response language
    """

    RU = "ru"
    EN = "en"
```

Эта модификация позволяет указывать язык для результатов запроса, что используется для локализации названий и описаний колонок и других элементов в визуализациях.

Кроме того, в клиентской части (фронтенд) есть несколько DODO-специфичных компонентов в директории `superset-frontend/src/DodoExtensions/Common/`, которые предоставляют общие компоненты для работы с локализацией и другими DODO-специфичными функциями.

## Основные компоненты

### Контекст запроса

Класс `QueryContext` предоставляет контекст для выполнения запросов:

```python
class QueryContext:
    """
    The query context contains the query object and additional fields necessary
    to retrieve the data payload for a given viz.
    """

    cache_type: ClassVar[str] = "df"
    enforce_numerical_metrics: ClassVar[bool] = True

    datasource: BaseDatasource
    queries: list[QueryObject]
    force: bool
    custom_cache_timeout: Optional[int]
    result_type: Optional[ChartDataResultType]
    result_format: Optional[ChartDataResultFormat]
    language: Optional[Language]
```

### Объект запроса

Класс `QueryObject` определяет параметры запроса данных:

```python
class QueryObject:
    """
    The query object's schema matches the interfaces of DB connectors like sqla
    and druid. The query objects are constructed on the client.
    """

    granularity: Optional[str]
    from_dttm: Optional[datetime]
    to_dttm: Optional[datetime]
    is_timeseries: bool
    time_shift: Optional[str]
    groupby: list[str]
    metrics: list[Metric]
    row_limit: int
    row_offset: int
    filter: list[QueryObjectFilterClause]
    timeseries_limit: int
    timeseries_limit_metric: Optional[Metric]
    order_desc: bool
    extras: dict[str, Any]
    columns: list[Column]
    orderby: list[OrderBy]
    post_processing: list[dict[str, Any]]
    datasource: Optional[BaseDatasource]
    applied_time_extras: dict[str, str]
```

### Действия с запросами

Функции в `query_actions.py` выполняют различные действия с запросами:

```python
def _get_full(query_context: QueryContext, query_object: QueryObject, force: bool) -> dict[str, Any]:
    """
    Returns the full results of the query object.
    """
    result = _get_results(query_context, query_object, force)
    df = result["df"]
    status = result["status"]
    if status != QueryStatus.FAILED:
        result["data"] = df.to_dict(orient="records")
    return result
```

### Теги

Функции в `tags.py` работают с тегами:

```python
def add_types(metadata: MetaData) -> None:
    """
    Add type tags to dashboards, charts, and datasets.
    """
    tag = metadata.tables["tag"]
    tagged_object = metadata.tables["tagged_object"]
    columns = ["tag_id", "object_id", "object_type"]

    # add type tags to dashboards
    add_types_to_dashboards(metadata, tag, tagged_object, columns)

    # add type tags to charts
    add_types_to_charts(metadata, tag, tagged_object, columns)

    # add type tags to datasets
    add_types_to_datasets(metadata, tag, tagged_object, columns)
```

## Примеры использования

### Создание контекста запроса

```python
from superset.common.query_context import QueryContext
from superset.common.query_object import QueryObject
from superset.connectors.sqla.models import SqlaTable

datasource = SqlaTable.get_datasource_by_name(
    datasource_name="example_table",
    schema="public",
    database_name="example_db",
)

query_object = QueryObject(
    granularity="day",
    metrics=["count"],
    groupby=["column1"],
    time_range="Last week",
)

query_context = QueryContext(
    datasource=datasource,
    queries=[query_object],
    force=False,
)

result = query_context.get_payload()
```

### Использование тегов

```python
from superset.common.tags import add_types, add_owners, add_favorites
from superset.models.helpers import get_metadata

metadata = get_metadata()

# Добавление тегов типов
add_types(metadata)

# Добавление тегов владельцев
add_owners(metadata)

# Добавление тегов избранного
add_favorites(metadata)
```

### Использование локализации в результатах запроса

```python
from superset.common.chart_data import ChartDataResultLanguage
from superset.common.query_context import QueryContext

query_context = QueryContext(
    datasource=datasource,
    queries=[query_object],
    force=False,
    language=ChartDataResultLanguage.RU,  # Указание русского языка для результатов
)

result = query_context.get_payload()
```
