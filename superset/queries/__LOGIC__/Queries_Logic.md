# Документация по модулю запросов (Queries) в DODO

## Содержание

1. [Введение](#введение)
2. [Архитектура](#архитектура)
3. [Основные компоненты](#основные-компоненты)
   - [API запросов](#api-запросов)
   - [Фильтры запросов](#фильтры-запросов)
   - [Схемы запросов](#схемы-запросов)
   - [Сохраненные запросы](#сохраненные-запросы)
4. [DODO-специфичные модификации](#dodo-специфичные-модификации)
5. [Техническая реализация](#техническая-реализация)
6. [Примеры использования](#примеры-использования)

## Введение

Модуль `queries` в Superset отвечает за управление запросами к базам данных, их выполнение, сохранение и получение результатов. Он включает в себя API для работы с запросами, фильтры для ограничения доступа к запросам, схемы для валидации и сериализации данных, а также функциональность для работы с сохраненными запросами.

В DODO этот модуль используется для стандартных операций с запросами, а также для некоторых специфичных операций, связанных с Kusto и другими источниками данных, используемыми в DODO.

## Архитектура

Модуль `queries` организован следующим образом:

1. **Основные файлы**:
   - `__init__.py` - инициализация модуля
   - `api.py` - API для работы с запросами
   - `filters.py` - фильтры для ограничения доступа к запросам
   - `schemas.py` - схемы для валидации и сериализации данных

2. **Подмодули**:
   - `saved_queries` - подмодуль для работы с сохраненными запросами
     - `api.py` - API для работы с сохраненными запросами
     - `filters.py` - фильтры для ограничения доступа к сохраненным запросам
     - `schemas.py` - схемы для валидации и сериализации данных сохраненных запросов

3. **Связанные модули**:
   - `models/sql_lab.py` - модели для запросов и сохраненных запросов
   - `daos/query.py` - DAO для работы с запросами
   - `commands/query` - команды для работы с запросами

## Основные компоненты

### API запросов

API запросов реализовано в файле `superset/queries/api.py` и предоставляет следующие эндпоинты:

1. **GET /api/v1/query/** - получение списка запросов
2. **GET /api/v1/query/{id}** - получение информации о запросе по ID
3. **GET /api/v1/query/related/{key}** - получение связанных объектов
4. **GET /api/v1/query/distinct/{column}** - получение уникальных значений колонки
5. **POST /api/v1/query/stop** - остановка выполнения запроса
6. **GET /api/v1/query/updated_since** - получение запросов, обновленных после указанного времени

```python
class QueryRestApi(BaseSupersetModelRestApi):
    datamodel = SQLAInterface(Query)

    resource_name = "query"

    class_permission_name = "Query"
    method_permission_name = MODEL_API_RW_METHOD_PERMISSION_MAP

    allow_browser_login = True
    include_route_methods = {
        RouteMethod.GET,
        RouteMethod.GET_LIST,
        RouteMethod.RELATED,
        RouteMethod.DISTINCT,
        "stop_query",
        "get_updated_since",
    }

    apispec_parameter_schemas = {
        "queries_get_updated_since_schema": queries_get_updated_since_schema,
    }
    apispec_parameter_schemas = {
        "queries_get_updated_since_schema": queries_get_updated_since_schema,
    }
    openapi_spec_tag = "Queries"
    openapi_spec_methods = openapi_spec_methods_override

    list_columns = [
        "id",
        "changed_on",
        "database.database_name",
        "executed_sql",
        "rows",
        "schema",
        "sql",
        "sql_tables",
        "status",
        "tab_name",
        "user.first_name",
        "user.id",
        "user.last_name",
        "start_time",
        "end_time",
        "tmp_table_name",
        "tracking_url",
    ]
    show_columns = [
        "id",
        "changed_on",
        "client_id",
        "database.id",
        "database.database_name",
        "end_time",
        "error_message",
        "executed_sql",
        "limit",
        "progress",
        "results_key",
        "rows",
        "schema",
        "select_as_cta",
        "select_as_cta_used",
        "select_sql",
        "sql",
        "sql_editor_id",
        "status",
        "tab_name",
        "tmp_schema_name",
        "tmp_table_name",
        "tracking_url",
        "start_time",
        "user_id",
    ]
```

### Фильтры запросов

Фильтры запросов реализованы в файле `superset/queries/filters.py` и используются для ограничения доступа к запросам:

```python
class QueryFilter(BaseFilter):  # pylint: disable=too-few-public-methods
    def apply(self, query: BaseQuery, value: Any) -> BaseQuery:
        """
        Filter queries to only those owned by current user. If
        can_access_all_queries permission is set a user can list all queries

        :returns: query
        """
        if not security_manager.can_access_all_queries():
            query = query.filter(Query.user_id == get_user_id())
        return query
```

### Схемы запросов

Схемы запросов реализованы в файле `superset/queries/schemas.py` и используются для валидации и сериализации данных:

```python
class QuerySchema(Schema):
    """
    Schema for the ``Query`` model.
    """

    changed_on = fields.DateTime()
    database = fields.Nested(DatabaseSchema)
    end_time = fields.Float(attribute="end_time")
    executed_sql = fields.String()
    id = fields.Int()
    rows = fields.Int()
    schema = fields.String()
    sql = fields.String()
    sql_tables = fields.Method("get_sql_tables")
    start_time = fields.Float(attribute="start_time")
    status = fields.String()
    tab_name = fields.String()
    tmp_table_name = fields.String()
    tracking_url = fields.String()
    user = fields.Nested(UserSchema(exclude=["username"]))

    class Meta:  # pylint: disable=too-few-public-methods
        model = Query
        load_instance = True
        include_relationships = True

    def get_sql_tables(self, obj: Query) -> list[Table]:
        return obj.sql_tables
```

### Сохраненные запросы

Сохраненные запросы реализованы в подмодуле `superset/queries/saved_queries` и предоставляют следующие возможности:

1. **API для работы с сохраненными запросами**:
   - GET /api/v1/saved_query/ - получение списка сохраненных запросов
   - GET /api/v1/saved_query/{id} - получение информации о сохраненном запросе по ID
   - POST /api/v1/saved_query/ - создание нового сохраненного запроса
   - PUT /api/v1/saved_query/{id} - обновление сохраненного запроса
   - DELETE /api/v1/saved_query/{id} - удаление сохраненного запроса
   - POST /api/v1/saved_query/export/ - экспорт сохраненных запросов
   - POST /api/v1/saved_query/import/ - импорт сохраненных запросов
   - POST /api/v1/saved_query/bulk_delete/ - массовое удаление сохраненных запросов

2. **Фильтры для ограничения доступа к сохраненным запросам**:
   - SavedQueryFilter - базовый фильтр для сохраненных запросов
   - SavedQueryFavoriteFilter - фильтр для избранных сохраненных запросов
   - SavedQueryAllTextFilter - фильтр для поиска по тексту в сохраненных запросах
   - SavedQueryTagNameFilter - фильтр для поиска по имени тега
   - SavedQueryTagIdFilter - фильтр для поиска по ID тега

3. **Схемы для валидации и сериализации данных сохраненных запросов**:
   - get_export_ids_schema - схема для экспорта сохраненных запросов
   - get_delete_ids_schema - схема для удаления сохраненных запросов

## DODO-специфичные модификации

В DODO модуль `queries` был расширен для поддержки специфичных источников данных и функциональности:

1. **Поддержка Kusto**:
   - В `db_engine_specs/kusto.py` добавлены методы для работы с Kusto:
     - `convert_dttm` - конвертация даты и времени в формат Kusto
     - `is_readonly_query` - проверка, является ли запрос только для чтения
     - `is_select_query` - проверка, является ли запрос SELECT-запросом

```python
@classmethod
def convert_dttm(
    cls, target_type: str, dttm: datetime, db_extra: Optional[dict[str, Any]] = None
) -> Optional[str]:
    sqla_type = cls.get_sqla_column_type(target_type)

    if isinstance(sqla_type, types.Date):
        return f"""datetime({dttm.date().isoformat()})"""
    if isinstance(sqla_type, types.DateTime):
        return f"""datetime({dttm.isoformat(timespec="microseconds")})"""

    return None

@classmethod
def is_readonly_query(cls, parsed_query: ParsedQuery) -> bool:
    """
    Pessimistic readonly, 100% sure statement won't mutate anything.
    """
    return KustoKqlEngineSpec.is_select_query(
        parsed_query
    ) or parsed_query.sql.startswith(".show")

@classmethod
def is_select_query(cls, parsed_query: ParsedQuery) -> bool:
    return not parsed_query.sql.startswith(".")
```

2. **Модификации для DODO-специфичных чартов**:
   - В `plugins/plugin-chart-echarts/src/DodoExtensions/Bubble/buildQuery.ts` добавлена функция для построения запроса для пузырьковой диаграммы:

```typescript
export default function buildQuery(formData: QueryFormData) {
  const columnModify: BuildFinalQueryObjects = baseQueryObject => {
    // function  extractQueryFields ignore 'entity' column, so we add them here
    // if we add 'entity' column in extractQueryFields we can affect another charts

    const columns: QueryFormColumn[] = baseQueryObject.columns ?? [];
    const entity = formData.entity?.trim();
    if (entity) {
      columns.push(entity);
    }

    return [{ ...baseQueryObject, columns }];
  };

  return buildQueryContext(formData, columnModify);
}
```

   - В `plugins/plugin-chart-echarts/src/DodoExtensions/BarDodo/buildQuery.ts` добавлена функция для построения запроса для столбчатой диаграммы:

```typescript
// DODO created 45525377
export default function buildQuery(formData: QueryFormData) {
  const { metric, sort_by_metric } = formData;
  return buildQueryContext(formData, baseQueryObject => [
    {
      ...baseQueryObject,
      ...(sort_by_metric && { orderby: [[metric, false]] }),
    },
  ]);
}
```

## Техническая реализация

### Модель Query

Модель `Query` используется для хранения информации о запросах:

```python
class Query(
    SqlTablesMixin,
    ExtraJSONMixin,
    ExploreMixin,
    Model,
):
    """ORM model for SQL query

    Now that SQL Lab support multi-statement execution, an entry in this
    table may represent multiple SQL statements executed sequentially"""

    __tablename__ = "query"
    type = "query"
    id = Column(Integer, primary_key=True)
    client_id = Column(String(11), unique=True, nullable=False)
    query_language = "sql"
    database_id = Column(Integer, ForeignKey("dbs.id"), nullable=False)
    database = relationship(
        "Database",
        foreign_keys=[database_id],
        backref=backref("queries", cascade="all, delete-orphan"),
    )
    user_id = Column(Integer, ForeignKey("ab_user.id"), nullable=True)
    user = relationship(
        security_manager.user_model,
        foreign_keys=[user_id],
        backref="queries",
    )
    start_time = Column(Float)
    end_time = Column(Float)
    sql = Column(Text)
    executed_sql = Column(Text)
    sql_editor_id = Column(String(256))
    tab_name = Column(String(256))
    status = Column(String(16))
    schema = Column(String(256))
    catalog = Column(String(256), nullable=True, default=None)
    progress = Column(Integer, default=0)
    rows = Column(Integer)
    error_message = Column(Text)
    select_as_cta = Column(Boolean)
    select_as_cta_used = Column(Boolean, default=False)
    ctas_method = Column(String(16))
    tmp_table_name = Column(String(256))
    tmp_schema_name = Column(String(256))
    results_key = Column(String(64), nullable=True)
    tracking_url = Column(Text)
    extra_json = Column(Text)
    limiting_factor = Column(String(32))
    limit = Column(Integer)
```

### Модель SavedQuery

Модель `SavedQuery` используется для хранения информации о сохраненных запросах:

```python
class SavedQuery(
    SqlTablesMixin,
    AuditMixinNullable,
    ExtraJSONMixin,
    ImportExportMixin,
    Model,
):
    """ORM model for SQL query"""

    __tablename__ = "saved_query"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("ab_user.id"), nullable=True)
    db_id = Column(Integer, ForeignKey("dbs.id"), nullable=True)
    schema = Column(String(128))
    catalog = Column(String(256), nullable=True, default=None)
    label = Column(String(256))
    description = Column(Text)
    sql = Column(MediumText())
    template_parameters = Column(Text)
    user = relationship(
        security_manager.user_model,
        backref=backref("saved_queries", cascade="all, delete-orphan"),
        foreign_keys=[user_id],
    )
    database = relationship(
        "Database",
        foreign_keys=[db_id],
        backref=backref("saved_queries", cascade="all, delete-orphan"),
    )
```

### DAO для запросов

DAO для запросов реализовано в файле `superset/daos/query.py`:

```python
class QueryDAO(BaseDAO[Query]):
    base_filter = QueryFilter

    @staticmethod
    def save_metadata(query: Query, payload: dict[str, Any]) -> None:
        # pull relevant data from payload and store in extra_json
        columns = payload.get("columns", {})
        for col in columns:
            if "name" in col:
                col["column_name"] = col.get("name")
        db.session.add(query)
        query.set_extra_json_key("columns", columns)

    @staticmethod
    def get_queries_changed_after(last_updated_ms: Union[float, int]) -> list[Query]:
        # UTC date time, same that is stored in the DB.
        last_updated_dt = datetime.utcfromtimestamp(last_updated_ms / 1000)

        return (
            db.session.query(Query)
            .filter(Query.user_id == get_user_id(), Query.changed_on >= last_updated_dt)
            .all()
        )

    @staticmethod
    def stop_query(client_id: str) -> None:
        query = db.session.query(Query).filter_by(client_id=client_id).one_or_none()
        if not query:
            raise QueryNotFoundException(f"Query with client_id {client_id} not found")

        if query.status in [
            QueryStatus.FAILED,
            QueryStatus.SUCCESS,
            QueryStatus.TIMED_OUT,
        ]:
            logger.warning(
                "Query with client_id could not be stopped: query already complete",
            )
            return

        if not sql_lab.cancel_query(query):
            raise SupersetCancelQueryException("Could not cancel query")

        query.status = QueryStatus.STOPPED
        query.end_time = now_as_float()


class SavedQueryDAO(BaseDAO[SavedQuery]):
    base_filter = SavedQueryFilter
```

## Примеры использования

### Получение списка запросов

```python
from superset.daos.query import QueryDAO

# Получение запросов, обновленных после указанного времени
last_updated_ms = 1600000000000  # Unix timestamp в миллисекундах
queries = QueryDAO.get_queries_changed_after(last_updated_ms)

# Вывод информации о запросах
for query in queries:
    print(f"ID: {query.id}")
    print(f"SQL: {query.sql}")
    print(f"Status: {query.status}")
    print(f"Rows: {query.rows}")
    print(f"Start time: {query.start_time}")
    print(f"End time: {query.end_time}")
    print("---")
```

### Остановка выполнения запроса

```python
from superset.daos.query import QueryDAO
from superset.exceptions import QueryNotFoundException, SupersetCancelQueryException

try:
    # Остановка выполнения запроса по client_id
    client_id = "abcde12345"
    QueryDAO.stop_query(client_id)
    print(f"Query with client_id {client_id} stopped successfully")
except QueryNotFoundException:
    print(f"Query with client_id {client_id} not found")
except SupersetCancelQueryException:
    print(f"Could not cancel query with client_id {client_id}")
```

### Работа с сохраненными запросами

```python
from superset.daos.query import SavedQueryDAO
from superset.models.sql_lab import SavedQuery

# Создание нового сохраненного запроса
saved_query = SavedQuery(
    user_id=1,
    db_id=1,
    schema="public",
    label="My Saved Query",
    description="This is my saved query",
    sql="SELECT * FROM my_table",
)
SavedQueryDAO.create(saved_query)

# Получение сохраненного запроса по ID
saved_query = SavedQueryDAO.find_by_id(1)
if saved_query:
    print(f"Label: {saved_query.label}")
    print(f"SQL: {saved_query.sql}")
    print(f"Description: {saved_query.description}")
    print(f"Schema: {saved_query.schema}")
    print(f"User ID: {saved_query.user_id}")
    print(f"Database ID: {saved_query.db_id}")
else:
    print("Saved query not found")

# Обновление сохраненного запроса
if saved_query:
    saved_query.label = "Updated Label"
    saved_query.description = "Updated description"
    saved_query.sql = "SELECT * FROM my_table WHERE id = 1"
    SavedQueryDAO.update(saved_query)
    print("Saved query updated successfully")

# Удаление сохраненного запроса
if saved_query:
    SavedQueryDAO.delete(saved_query)
    print("Saved query deleted successfully")
```
