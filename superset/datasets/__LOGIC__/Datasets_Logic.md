# Документация по датасетам (Datasets) в DODO

## Содержание

1. [Введение](#введение)
2. [Архитектура](#архитектура)
3. [Стандартная функциональность](#стандартная-функциональность)
4. [DODO-специфичная функциональность](#dodo-специфичная-функциональность)
5. [Техническая реализация](#техническая-реализация)
6. [Примеры использования](#примеры-использования)

## Введение

Модуль `datasets` предоставляет API и функциональность для работы с датасетами в Superset. Датасеты - это абстракция, которая представляет таблицы, запросы и другие источники данных, которые могут быть использованы для создания визуализаций.

В DODO этот модуль используется для создания и управления датасетами, которые являются основой для всех визуализаций и дашбордов.

## Архитектура

Модуль `datasets` организован следующим образом:

1. **API** (`api.py`):
   - `DatasetRestApi` - REST API для работы с датасетами
   - Предоставляет эндпоинты для создания, чтения, обновления и удаления датасетов

2. **Фильтры** (`filters.py`):
   - `DatasetCertifiedFilter` - фильтр для сертифицированных датасетов
   - `DatasetIsNullOrEmptyFilter` - фильтр для пустых датасетов

3. **Схемы** (`schemas.py`):
   - Схемы для валидации запросов и сериализации ответов
   - Определяют структуру данных для API

4. **Подмодули**:
   - `columns` - для работы с колонками датасетов
   - `metrics` - для работы с метриками датасетов

## Стандартная функциональность

Стандартная функциональность модуля `datasets` включает:

1. **CRUD-операции**:
   - Создание датасетов
   - Чтение датасетов
   - Обновление датасетов
   - Удаление датасетов

2. **Управление метаданными**:
   - Управление колонками датасетов
   - Управление метриками датасетов
   - Управление описаниями и другими метаданными

3. **Импорт и экспорт**:
   - Импорт датасетов из файлов
   - Экспорт датасетов в файлы

4. **Обновление и кэширование**:
   - Обновление датасетов из источников данных
   - Прогрев кэша для датасетов

## DODO-специфичная функциональность

В результате анализа кода **не обнаружено прямых DODO-специфичных изменений или расширений** в модуле `datasets`. Весь код в этом модуле является стандартным для Superset.

Однако, стоит отметить, что модуль `datasets` тесно связан с модулем `connectors/sqla`, в котором были обнаружены DODO-специфичные изменения, такие как добавление полей для локализации названий и описаний колонок. Эти изменения влияют на работу с датасетами, так как датасеты используют модели из модуля `connectors/sqla`.

Кроме того, на фронтенде есть DODO-специфичные компоненты и утилиты для работы с датасетами, такие как:

1. **Утилиты для работы с описаниями источников данных**:
   - Функция `extractDatasourceDescriptions` для извлечения и отображения описаний источников данных
   - Функция `extendDatasourceDescriptions` для расширения описаний источников данных
   - Добавлены в рамках задачи #44728892

2. **Компоненты для визуализации датасетов**:
   - Модифицированные версии компонентов для визуализации датасетов
   - Поддержка локализации и дополнительных метаданных

Эти компоненты и утилиты используются для создания более информативных и удобных для пользователя визуализаций на основе датасетов.

## Техническая реализация

### DatasetRestApi

REST API для работы с датасетами:

```python
class DatasetRestApi(BaseSupersetModelRestApi):
    datamodel = SQLAInterface(SqlaTable)
    base_filters = [["id", DatasourceFilter, lambda: []]]

    resource_name = "dataset"
    allow_browser_login = True
    class_permission_name = "Dataset"
    method_permission_name = MODEL_API_RW_METHOD_PERMISSION_MAP
    include_route_methods = RouteMethod.REST_MODEL_VIEW_CRUD_SET | {
        RouteMethod.EXPORT,
        RouteMethod.IMPORT,
        RouteMethod.RELATED,
        RouteMethod.DISTINCT,
        "bulk_delete",
        "refresh",
        "related_objects",
        "duplicate",
        "get_or_create_dataset",
        "warm_up_cache",
    }
    show_columns = [
        "changed_by.first_name",
        "changed_by.id",
        "changed_by.last_name",
        "changed_on_delta_humanized",
        "database.database_name",
        "database.id",
        "description",
        "id",
        "kind",
        "owners.first_name",
        "owners.id",
        "owners.last_name",
        "owners.user_info.country_name",
        "owners.active",
        "owners.email",
        "schema",
        "sql",
        "table_name",
    ]
    list_columns = [
        "id",
        "changed_by.first_name",
        "changed_by.last_name",
        "changed_by_name",
        "changed_by_url",
        "changed_on_delta_humanized",
        "changed_on_utc",
        "database.database_name",
        "database.id",
        "datasource_type",
        "description",
        "explore_url",
        "extra",
        "kind",
        "owners.first_name",
        "owners.id",
        "owners.last_name",
        "owners.user_info.country_name",
        "owners.active",
        "owners.email",
        "schema",
        "sql",
        "table_name",
    ]
    add_model_schema = DatasetPostSchema()
    edit_model_schema = DatasetPutSchema()
    duplicate_model_schema = DatasetDuplicateSchema()
    add_columns = ["database", "catalog", "schema", "table_name", "sql", "owners"]
    edit_columns = [
        "table_name",
        "sql",
        "filter_select_enabled",
        "fetch_values_predicate",
        "catalog",
        "schema",
        "description",
        "main_dttm_col",
        "normalize_columns",
        "always_filter_main_dttm",
        "offset",
        "default_endpoint",
        "cache_timeout",
        "is_sqllab_view",
        "template_params",
        "owners",
        "columns",
        "metrics",
        "extra",
    ]
    openapi_spec_tag = "Datasets"

    base_related_field_filters = {
        "owners": [["id", BaseFilterRelatedUsers, lambda: []]],
        "changed_by": [["id", BaseFilterRelatedUsers, lambda: []]],
        "database": [["id", DatabaseFilter, lambda: []]],
    }
    related_field_filters = {
        "owners": RelatedFieldFilter("first_name", FilterRelatedOwners),
        "changed_by": RelatedFieldFilter("first_name", FilterRelatedOwners),
        "database": "database_name",
    }
    search_filters = {
        "sql": [DatasetIsNullOrEmptyFilter],
        "id": [DatasetCertifiedFilter],
    }
    search_columns = [
        "id",
        "database",
        "owners",
        "catalog",
        "schema",
        "sql",
        "table_name",
        "created_by",
        "changed_by",
    ]
    allowed_rel_fields = {"database", "owners", "created_by", "changed_by"}
    allowed_distinct_fields = {"catalog", "schema"}

    extra_fields_rel_fields: dict[str, list[str]] = {
        "owners": ["email", "user_info.country_name", "active"]
    }
```

### DatasetDAO

DAO для работы с датасетами:

```python
class DatasetDAO(BaseDAO[SqlaTable]):
    base_filter = DatasourceFilter

    @staticmethod
    def get_database_by_id(database_id: int) -> Database | None:
        try:
            return db.session.query(Database).filter_by(id=database_id).one_or_none()
        except SQLAlchemyError as ex:  # pragma: no cover
            logger.error("Could not get database by id: %s", str(ex), exc_info=True)
            return None

    @staticmethod
    def get_related_objects(model: SqlaTable) -> dict[str, Any]:
        """Returns objects that are related to the dataset"""
        from superset.daos.chart import ChartDAO
        from superset.daos.dashboard import DashboardDAO

        charts = ChartDAO.find_by_dataset_id(model.id)
        chart_ids = [chart.id for chart in charts]

        dashboards = (
            DashboardDAO.get_by_ids(
                [dashboard.id for dashboard in model.dashboards]
            )
            if model.dashboards
            else []
        )
        dashboard_ids = [dashboard.id for dashboard in dashboards]

        return dict(
            charts=chart_ids,
            dashboards=dashboard_ids,
        )

    @staticmethod
    def validate_uniqueness(
        database: Database,
        table: Table,
        dataset_id: int | None = None,
    ) -> bool:
        # The catalog might not be set even if the database supports catalogs, in case
        # multi-catalog is disabled.
        catalog = table.catalog or database.get_default_catalog()

        dataset_query = db.session.query(SqlaTable).filter(
            SqlaTable.table_name == table.table,
            SqlaTable.schema == table.schema,
            SqlaTable.catalog == catalog,
            SqlaTable.database_id == database.id,
        )

        if dataset_id:
            # make sure the dataset found is different from the target (if any)
            dataset_query = dataset_query.filter(SqlaTable.id != dataset_id)

        return not db.session.query(dataset_query.exists()).scalar()
```

## Примеры использования

### Создание датасета

```python
from superset.daos.dataset import DatasetDAO
from superset.daos.database import DatabaseDAO
from superset.models.core import Database
from superset.sql_parse import Table

# Получение базы данных
database = DatabaseDAO.find_by_id(1)

# Создание датасета
dataset = DatasetDAO.create(
    attributes={
        "table_name": "my_table",
        "database_id": database.id,
        "schema": "public",
        "owners": [1, 2, 3]
    }
)
```

### Обновление датасета

```python
from superset.daos.dataset import DatasetDAO

# Получение датасета
dataset = DatasetDAO.find_by_id(1)

# Обновление датасета
DatasetDAO.update(
    dataset,
    attributes={
        "description": "New description",
        "main_dttm_col": "created_at",
        "columns": [
            {
                "column_name": "id",
                "type": "INTEGER",
                "verbose_name": "ID",
                "verbose_name_ru": "Идентификатор",
                "description": "Unique identifier",
                "description_ru": "Уникальный идентификатор"
            },
            {
                "column_name": "name",
                "type": "VARCHAR",
                "verbose_name": "Name",
                "verbose_name_ru": "Имя",
                "description": "Name of the item",
                "description_ru": "Имя элемента"
            }
        ],
        "metrics": [
            {
                "metric_name": "count",
                "expression": "COUNT(*)",
                "verbose_name": "Count",
                "verbose_name_ru": "Количество",
                "description": "Count of records",
                "description_ru": "Количество записей"
            }
        ]
    }
)
```

### Получение связанных объектов

```python
from superset.daos.dataset import DatasetDAO

# Получение датасета
dataset = DatasetDAO.find_by_id(1)

# Получение связанных объектов
related_objects = DatasetDAO.get_related_objects(dataset)

# Вывод связанных объектов
print(f"Charts: {related_objects['charts']}")
print(f"Dashboards: {related_objects['dashboards']}")
```

### Импорт и экспорт датасетов

```python
from superset.commands.dataset.export import ExportDatasetsCommand
from superset.commands.dataset.importers.dispatcher import ImportDatasetsCommand

# Экспорт датасетов
export_command = ExportDatasetsCommand([1, 2, 3])
exported_datasets = export_command.run()

# Импорт датасетов
import_command = ImportDatasetsCommand(exported_datasets, overwrite=True)
import_command.run()
```
