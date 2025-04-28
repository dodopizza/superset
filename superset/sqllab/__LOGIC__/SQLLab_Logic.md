# Документация по модулю SQL Lab в DODO

## Содержание

1. [Введение](#введение)
2. [Архитектура](#архитектура)
3. [Основные компоненты](#основные-компоненты)
   - [API](#api)
   - [Контекст выполнения](#контекст-выполнения)
   - [Исполнитель запросов](#исполнитель-запросов)
   - [Рендеринг запросов](#рендеринг-запросов)
   - [Схемы](#схемы)
   - [Утилиты](#утилиты)
   - [Валидаторы](#валидаторы)
4. [DODO-специфичные модификации](#dodo-специфичные-модификации)
5. [Процесс выполнения запроса](#процесс-выполнения-запроса)
6. [Техническая реализация](#техническая-реализация)
7. [Примеры использования](#примеры-использования)

## Введение

SQL Lab - это интерактивный инструмент для выполнения SQL-запросов в Superset. Он позволяет пользователям писать и выполнять SQL-запросы, просматривать результаты, сохранять запросы для повторного использования и визуализировать результаты.

В DODO SQL Lab используется для анализа данных, отладки запросов и создания визуализаций на основе результатов запросов. Модуль `sqllab` в Superset содержит бэкенд-компоненты для поддержки функциональности SQL Lab.

## Архитектура

Модуль `sqllab` организован следующим образом:

1. **Основные файлы**:
   - `__init__.py` - инициализация модуля
   - `api.py` - API для работы с SQL Lab
   - `command_status.py` - статусы выполнения команд
   - `exceptions.py` - исключения для SQL Lab
   - `execution_context_convertor.py` - конвертер контекста выполнения
   - `limiting_factor.py` - факторы ограничения результатов
   - `query_render.py` - рендеринг запросов
   - `schemas.py` - схемы для валидации и сериализации данных
   - `sqllab_execution_context.py` - контекст выполнения SQL Lab
   - `sql_json_executer.py` - исполнитель запросов
   - `utils.py` - утилиты для SQL Lab
   - `validators.py` - валидаторы для SQL Lab

2. **Связанные модули**:
   - `commands/sql_lab` - команды для SQL Lab
   - `models/sql_lab.py` - модели для SQL Lab
   - `sql_parse.py` - парсинг SQL-запросов
   - `sql_lab.py` - основная функциональность SQL Lab

## Основные компоненты

### API

API для SQL Lab реализовано в файле `api.py` и предоставляет следующие эндпоинты:

1. **GET /api/v1/sqllab/** - получение данных для инициализации SQL Lab
2. **POST /api/v1/sqllab/execute/** - выполнение SQL-запроса
3. **POST /api/v1/sqllab/estimate/** - оценка стоимости выполнения SQL-запроса
4. **POST /api/v1/sqllab/format/** - форматирование SQL-запроса
5. **GET /api/v1/sqllab/results/{key}** - получение результатов выполнения SQL-запроса

```python
class SqlLabRestApi(BaseSupersetApi):
    method_permission_name = MODEL_API_RW_METHOD_PERMISSION_MAP
    datamodel = SQLAInterface(Query)

    resource_name = "sqllab"
    allow_browser_login = True

    class_permission_name = "SQLLab"

    estimate_model_schema = EstimateQueryCostSchema()
    execute_model_schema = ExecutePayloadSchema()
    format_model_schema = FormatQueryPayloadSchema()

    apispec_parameter_schemas = {
        "sql_lab_get_results_schema": sql_lab_get_results_schema,
    }
    openapi_spec_tag = "SQL Lab"
    openapi_spec_component_schemas = (
        EstimateQueryCostSchema,
        ExecutePayloadSchema,
        QueryExecutionResponseSchema,
        SQLLabBootstrapSchema,
    )
```

### Контекст выполнения

Контекст выполнения SQL Lab реализован в файле `sqllab_execution_context.py` и представляет собой класс `SqlJsonExecutionContext`, который содержит всю информацию, необходимую для выполнения SQL-запроса:

```python
@dataclass
class SqlJsonExecutionContext:
    """
    Context for executing a SQL query.
    """

    database_id: int
    schema: str | None
    catalog: str | None
    sql: str
    client_id: str
    user_id: int | None
    async_flag: bool
    tmp_table_name: str | None
    select_as_cta: bool
    ctas_method: CtasMethod | None
    start_time: float
    tab_id: str | None
    session_id: str | None
    status: str
    sql_editor_id: str | None
    template_params: dict[str, Any] | None
    limit: int | None
    limiting_factor: LimitingFactor | None
    select_as_cta_used: bool
    query: Query | None
    database: Database | None
    expand_data: bool
    query_limit: int | None
    rows_in_result: int | None
    errors: list[dict[str, Any]] | None
    result: SqlResults | None
    from_data: bool
    query_id: int | None
    applied_template_params: dict[str, Any] | None
```

### Исполнитель запросов

Исполнитель запросов реализован в файле `sql_json_executer.py` и представляет собой классы `SqlJsonExecutor`, `SynchronousSqlJsonExecutor` и `ASynchronousSqlJsonExecutor`, которые отвечают за выполнение SQL-запросов:

```python
class SqlJsonExecutor:
    """
    Executes the sql query in the given execution context.
    """

    def execute(
        self,
        execution_context: SqlJsonExecutionContext,
        rendered_query: str,
        logger: logging.Logger,
    ) -> SqlJsonExecutionStatus:
        """
        Execute the sql query in the given execution context.
        """
        raise NotImplementedError()


class SynchronousSqlJsonExecutor(SqlJsonExecutor):
    """
    Executes the sql query in a synchronous way.
    """

    def execute(
        self,
        execution_context: SqlJsonExecutionContext,
        rendered_query: str,
        logger: logging.Logger,
    ) -> SqlJsonExecutionStatus:
        """
        Execute the sql query in a synchronous way.
        """
        try:
            with self._create_execution_context(execution_context, rendered_query):
                return self._execute(execution_context, rendered_query, logger)
        except Exception as ex:
            # ...
            return SqlJsonExecutionStatus.FAILED


class ASynchronousSqlJsonExecutor(SqlJsonExecutor):
    """
    Executes the sql query in an asynchronous way.
    """

    def execute(
        self,
        execution_context: SqlJsonExecutionContext,
        rendered_query: str,
        logger: logging.Logger,
    ) -> SqlJsonExecutionStatus:
        """
        Execute the sql query in an asynchronous way.
        """
        try:
            with self._create_execution_context(execution_context, rendered_query):
                return self._execute(execution_context, rendered_query, logger)
        except Exception as ex:
            # ...
            return SqlJsonExecutionStatus.FAILED
```

### Рендеринг запросов

Рендеринг запросов реализован в файле `query_render.py` и представляет собой класс `SqlQueryRenderImpl`, который отвечает за рендеринг SQL-запросов с учетом шаблонных параметров:

```python
class SqlQueryRenderImpl:
    """
    Renders a SQL query with the given template parameters.
    """

    def render(
        self,
        sql: str,
        database: Database,
        template_params: dict[str, Any] | None = None,
    ) -> tuple[str, dict[str, Any] | None]:
        """
        Render the SQL query with the given template parameters.
        """
        if template_params is None:
            template_params = {}

        template_processor = get_template_processor(
            database=database, query=sql, **template_params
        )
        rendered_query = template_processor.process_template(sql)
        applied_template_params = template_processor.applied_params

        return rendered_query, applied_template_params
```

### Схемы

Схемы для SQL Lab реализованы в файле `schemas.py` и используются для валидации и сериализации данных:

```python
class EstimateQueryCostSchema(Schema):
    database_id = fields.Integer(
        required=True, metadata={"description": "The database id"}
    )
    sql = fields.String(
        required=True, metadata={"description": "The SQL query to estimate"}
    )
    template_params = fields.Dict(
        keys=fields.String(), metadata={"description": "The SQL query template params"}
    )
    catalog = fields.String(
        allow_none=True, metadata={"description": "The database catalog"}
    )
    schema = fields.String(
        allow_none=True, metadata={"description": "The database schema"}
    )


class ExecutePayloadSchema(Schema):
    database_id = fields.Integer(
        required=True, metadata={"description": "The database id"}
    )
    sql = fields.String(
        required=True, metadata={"description": "The SQL query to execute"}
    )
    client_id = fields.String(
        required=True, metadata={"description": "The client id"}
    )
    # ...
```

### Утилиты

Утилиты для SQL Lab реализованы в файле `utils.py` и предоставляют различные вспомогательные функции:

```python
def bootstrap_sqllab_data(user_id: int | None) -> dict[str, Any]:
    tabs_state: list[Any] = []
    active_tab: Any = None
    databases: dict[int, Any] = {}
    for database in DatabaseDAO.find_all():
        databases[database.id] = {
            k: v for k, v in database.to_json().items() if k in DATABASE_KEYS
        }
        databases[database.id]["backend"] = database.backend
    # ...
    return {
        "tab_state_ids": tabs_state,
        "databases": databases,
        "queries": queries,
        "active_tab": active_tab,
    }


def apply_display_max_row_configuration_if_require(
    sql_results: dict[str, Any],
) -> dict[str, Any]:
    # ...
    return sql_results


def write_ipc_buffer(key: str, payload: dict[str, Any]) -> None:
    # ...
```

### Валидаторы

Валидаторы для SQL Lab реализованы в файле `validators.py` и используются для проверки доступа к запросам:

```python
class CanAccessQueryValidatorImpl(CanAccessQueryValidator):
    def validate(self, query: Query) -> None:
        security_manager.raise_for_access(query=query)
```

## DODO-специфичные модификации

В DODO модуль `sqllab` был расширен для поддержки специфичных для DODO функций:

1. **Поддержка экспорта в XLSX**:
   - В файле `commands/sql_lab/export.py` добавлена поддержка экспорта результатов запросов в формате XLSX (добавлено в рамках задачи #44136746)
   - Добавлен импорт `ChartDataResultFormat` из `superset.common.chart_data` (добавлено в рамках задачи #44136746)
   - Добавлен импорт `excel` из `superset.utils` (добавлено в рамках задачи #44136746)

```python
# dodo added 44136746
from superset.common.chart_data import ChartDataResultFormat
from superset.utils import core as utils, csv, excel  # dodo added 44136746

# ...

# dodo added 44136746
if self._result_format == ChartDataResultFormat.XLSX:
    data = excel.df_to_excel(df, **config["EXCEL_EXPORT"])
```

2. **Изменения в API**:
   - В файле `api.py` изменены импорты для поддержки экспорта в XLSX (добавлено в рамках задачи #44136746)

```python
from superset.common.chart_data import ChartDataResultFormat  # dodo added 44136746
from superset.views.base import (  # dodo changed 44136746
    CsvResponse,
    generate_download_headers,
    json_success,
    XlsxResponse,
)
```

3. **Локализация**:
   - В фронтенд-части SQL Lab добавлена локализация для русского языка
   - Добавлена локализация состояний запросов и статусов

## Процесс выполнения запроса

Процесс выполнения SQL-запроса в SQL Lab включает следующие шаги:

1. **Инициализация SQL Lab**:
   - Получение данных для инициализации SQL Lab с помощью эндпоинта `GET /api/v1/sqllab/`
   - Загрузка списка баз данных, сохраненных запросов и состояния вкладок

2. **Выполнение запроса**:
   - Отправка запроса на выполнение с помощью эндпоинта `POST /api/v1/sqllab/execute/`
   - Создание контекста выполнения `SqlJsonExecutionContext`
   - Рендеринг запроса с учетом шаблонных параметров
   - Выбор исполнителя запросов (синхронный или асинхронный) в зависимости от настроек
   - Выполнение запроса и получение результатов

3. **Получение результатов**:
   - Если запрос выполняется синхронно, результаты возвращаются сразу
   - Если запрос выполняется асинхронно, результаты можно получить с помощью эндпоинта `GET /api/v1/sqllab/results/{key}`

4. **Экспорт результатов**:
   - Экспорт результатов в различных форматах (CSV, JSON, XLSX)

## Техническая реализация

### Контекст выполнения SQL Lab

```python
@dataclass
class SqlJsonExecutionContext:
    """
    Context for executing a SQL query.
    """

    database_id: int
    schema: str | None
    catalog: str | None
    sql: str
    client_id: str
    user_id: int | None
    async_flag: bool
    tmp_table_name: str | None
    select_as_cta: bool
    ctas_method: CtasMethod | None
    start_time: float
    tab_id: str | None
    session_id: str | None
    status: str
    sql_editor_id: str | None
    template_params: dict[str, Any] | None
    limit: int | None
    limiting_factor: LimitingFactor | None
    select_as_cta_used: bool
    query: Query | None
    database: Database | None
    expand_data: bool
    query_limit: int | None
    rows_in_result: int | None
    errors: list[dict[str, Any]] | None
    result: SqlResults | None
    from_data: bool
    query_id: int | None
    applied_template_params: dict[str, Any] | None

    def __post_init__(self) -> None:
        self.status = self.status or QueryStatus.PENDING
        self.start_time = self.start_time or now_as_float()
        self.user_id = self.user_id or get_user_id()
        self.expand_data = self.expand_data or False
        self.from_data = self.from_data or False
        self.errors = self.errors or []
        self.result = self.result or {}
```

### Исполнитель запросов

```python
class SynchronousSqlJsonExecutor(SqlJsonExecutor):
    """
    Executes the sql query in a synchronous way.
    """

    def execute(
        self,
        execution_context: SqlJsonExecutionContext,
        rendered_query: str,
        logger: logging.Logger,
    ) -> SqlJsonExecutionStatus:
        """
        Execute the sql query in a synchronous way.
        """
        try:
            with self._create_execution_context(execution_context, rendered_query):
                return self._execute(execution_context, rendered_query, logger)
        except Exception as ex:
            logger.error(
                "Error while executing query %s: %s",
                execution_context.client_id,
                str(ex),
                exc_info=True,
            )
            execution_context.status = QueryStatus.FAILED
            execution_context.errors.append({"message": str(ex)})
            return SqlJsonExecutionStatus.FAILED

    def _execute(
        self,
        execution_context: SqlJsonExecutionContext,
        rendered_query: str,
        logger: logging.Logger,
    ) -> SqlJsonExecutionStatus:
        """
        Execute the sql query in a synchronous way.
        """
        execution_context.status = QueryStatus.RUNNING
        execution_context.query = self._create_query(execution_context, rendered_query)
        try:
            with contextlib.closing(execution_context.database.get_sqla_engine()) as engine:
                # ...
                data = self._get_data(execution_context, cursor, logger)
                execution_context.status = QueryStatus.SUCCESS
                execution_context.query.status = QueryStatus.SUCCESS
                execution_context.result = data
                db.session.commit()
                return SqlJsonExecutionStatus.SUCCESS
        except Exception as ex:
            # ...
            execution_context.status = QueryStatus.FAILED
            execution_context.query.status = QueryStatus.FAILED
            execution_context.errors.append({"message": str(ex)})
            db.session.commit()
            return SqlJsonExecutionStatus.FAILED
```

### API для выполнения запросов

```python
@expose("/execute/", methods=("POST",))
@protect()
@safe
@statsd_metrics
@requires_json
@event_logger.log_this_with_context(
    action=lambda self, *args, **kwargs: f"{self.__class__.__name__}.execute_sql",
    log_to_statsd=False,
)
def execute(self) -> Response:
    """
    Executes a SQL query.
    ---
    post:
      summary: Executes a SQL query.
      description: >-
        Executes a SQL query. This query is associated with a
        user and a database engine. The query is stored
        in the superset backend and associated with a user.
      requestBody:
        description: SQL query to execute
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ExecutePayloadSchema'
      responses:
        200:
          description: Query execution result
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/QueryExecutionResponseSchema'
        400:
          $ref: '#/components/responses/400'
        401:
          $ref: '#/components/responses/401'
        403:
          $ref: '#/components/responses/403'
        404:
          $ref: '#/components/responses/404'
        500:
          $ref: '#/components/responses/500'
    """
    try:
        execution_payload = self.execute_model_schema.load(request.json)
    except ValidationError as error:
        return self.response_400(message=error.messages)

    try:
        command = ExecuteSqlCommand(execution_payload)
        command_result = command.run()
        return self.response(200, **command_result)
    except QueryIsForbiddenToAccessException as ex:
        return self.response_403(message=str(ex))
    except SqlLabException as ex:
        return self.response_400(message=str(ex))
    except Exception as ex:
        logger.error(
            "Error when executing SQL query: %s",
            str(ex),
            exc_info=True,
        )
        return self.response_500(message=str(ex))
```

## Примеры использования

### Инициализация SQL Lab

```python
from superset.sqllab.utils import bootstrap_sqllab_data

# Получение данных для инициализации SQL Lab
user_id = 1
data = bootstrap_sqllab_data(user_id)

# Вывод информации о базах данных
for db_id, db_info in data["databases"].items():
    print(f"Database ID: {db_id}, Name: {db_info['database_name']}")

# Вывод информации о запросах
for query in data["queries"]:
    print(f"Query ID: {query['id']}, Status: {query['status']}")

# Вывод информации о вкладках
for tab in data["tab_state_ids"]:
    print(f"Tab ID: {tab['id']}, Label: {tab['label']}")
```

### Выполнение запроса

```python
from superset.commands.sql_lab.execute import ExecuteSqlCommand

# Создание контекста выполнения
execution_payload = {
    "database_id": 1,
    "sql": "SELECT * FROM users LIMIT 10",
    "client_id": "client_id_123",
    "schema": "public",
    "sql_editor_id": "editor_id_123",
    "tab_id": "tab_id_123",
    "async_flag": False,
    "select_as_cta": False,
    "ctas_method": "TABLE",
    "template_params": {},
}

# Выполнение запроса
command = ExecuteSqlCommand(execution_payload)
command_result = command.run()

# Вывод результатов
print(f"Status: {command_result['status']}")
print(f"Query ID: {command_result['query']['id']}")
print(f"Rows: {command_result['query']['rows']}")
print(f"Data: {command_result['data']}")
```

### Экспорт результатов

```python
from superset.commands.sql_lab.export import SqlResultExportCommand
from superset.common.chart_data import ChartDataResultFormat

# Экспорт результатов в CSV
command = SqlResultExportCommand(
    query_id=1,
    result_format=ChartDataResultFormat.CSV,
)
csv_data = command.run()

# Экспорт результатов в JSON
command = SqlResultExportCommand(
    query_id=1,
    result_format=ChartDataResultFormat.JSON,
)
json_data = command.run()

# Экспорт результатов в XLSX (DODO-специфичная функциональность)
command = SqlResultExportCommand(
    query_id=1,
    result_format=ChartDataResultFormat.XLSX,
)
xlsx_data = command.run()
```

### Использование в DODO

В DODO SQL Lab используется для анализа данных, отладки запросов и создания визуализаций на основе результатов запросов. Примеры использования:

1. **Анализ данных**:
   ```python
   from superset.commands.sql_lab.execute import ExecuteSqlCommand

   # Выполнение запроса для анализа данных
   execution_payload = {
       "database_id": 1,
       "sql": "SELECT region, SUM(sales) as total_sales FROM sales GROUP BY region ORDER BY total_sales DESC",
       "client_id": "client_id_123",
       "schema": "public",
       "async_flag": False,
   }

   command = ExecuteSqlCommand(execution_payload)
   command_result = command.run()

   # Вывод результатов
   for row in command_result["data"]:
       print(f"Region: {row['region']}, Total Sales: {row['total_sales']}")
   ```

2. **Экспорт данных в XLSX**:
   ```python
   from superset.commands.sql_lab.export import SqlResultExportCommand
   from superset.common.chart_data import ChartDataResultFormat

   # Экспорт результатов в XLSX
   command = SqlResultExportCommand(
       query_id=1,
       result_format=ChartDataResultFormat.XLSX,
   )
   xlsx_data = command.run()

   # Сохранение данных в файл
   with open("sales_report.xlsx", "wb") as f:
       f.write(xlsx_data)
   ```
