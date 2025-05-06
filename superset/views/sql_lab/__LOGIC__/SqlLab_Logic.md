# Документация по представлениям SQL Lab (SQL Lab Views) в DODO

## Содержание

1. [Введение](#введение)
2. [Архитектура](#архитектура)
3. [Основные компоненты](#основные-компоненты)
   - [SavedQueryView](#savedqueryview)
   - [SavedQueryViewApi](#savedqueryviewapi)
   - [SqlJsonPayloadSchema](#sqljsonpayloadschema)
4. [DODO-специфичные модификации](#dodo-специфичные-модификации)
   - [Поддержка экспорта в XLSX](#поддержка-экспорта-в-xlsx)
   - [Локализация состояний запросов](#локализация-состояний-запросов)
5. [Процесс работы с SQL Lab](#процесс-работы-с-sql-lab)
6. [Техническая реализация](#техническая-реализация)
7. [Примеры использования](#примеры-использования)

## Введение

Модуль `views/sql_lab` в Superset отвечает за представления SQL Lab в пользовательском интерфейсе. Он предоставляет классы и функции для отображения, создания, редактирования и удаления сохраненных запросов, а также для работы с ними через API.

В DODO этот модуль был расширен для поддержки экспорта в XLSX и локализации состояний запросов.

## Архитектура

Модуль `views/sql_lab` организован следующим образом:

1. **Основные файлы**:
   - `__init__.py` - инициализация модуля
   - `views.py` - представления для SQL Lab
   - `schemas.py` - схемы для валидации и сериализации данных

2. **Связанные модули**:
   - `models/sql_lab.py` - модели для SQL Lab
   - `sqllab/api.py` - API для SQL Lab
   - `sqllab/command_status.py` - статусы выполнения команд
   - `sqllab/exceptions.py` - исключения для SQL Lab
   - `sqllab/execution_context_convertor.py` - конвертер контекста выполнения
   - `sqllab/limiting_factor.py` - факторы ограничения результатов
   - `sqllab/query_render.py` - рендеринг запросов
   - `sqllab/schemas.py` - схемы для валидации и сериализации данных
   - `sqllab/sqllab_execution_context.py` - контекст выполнения SQL Lab
   - `sqllab/sql_json_executer.py` - исполнитель запросов
   - `sqllab/utils.py` - утилиты для SQL Lab
   - `sqllab/validators.py` - валидаторы для SQL Lab

3. **Фронтенд-компоненты**:
   - `superset-frontend/src/SqlLab` - компоненты для отображения SQL Lab
   - `superset-frontend/src/components/SqlEditor` - компоненты для редактирования SQL

## Основные компоненты

### SavedQueryView

Класс `SavedQueryView` в файле `views.py` наследуется от `BaseSupersetView` и предоставляет представление для сохраненных запросов:

```python
class SavedQueryView(DeprecateModelViewMixin, BaseSupersetView):
    route_base = "/savedqueryview"
    class_permission_name = "SavedQuery"

    @expose("/list/")
    @has_access
    def list(self) -> FlaskResponse:
        return super().render_app_template()
```

Этот класс предоставляет метод для отображения списка сохраненных запросов.

### SavedQueryViewApi

Класс `SavedQueryViewApi` в файле `views.py` наследуется от `SupersetModelView` и `DeleteMixin` и предоставляет API для сохраненных запросов:

```python
class SavedQueryViewApi(DeprecateModelViewMixin, SupersetModelView, DeleteMixin):  # pylint: disable=too-many-ancestors
    datamodel = SQLAInterface(SavedQuery)
    include_route_methods = RouteMethod.CRUD_SET
    route_base = "/savedqueryviewapi"
    class_permission_name = "SavedQuery"

    include_route_methods = {
        RouteMethod.API_READ,
        RouteMethod.API_CREATE,
        RouteMethod.API_UPDATE,
        RouteMethod.API_GET,
    }

    method_permission_name = MODEL_VIEW_RW_METHOD_PERMISSION_MAP

    add_columns = ["label", "db_id", "schema", "description", "sql", "extra_json"]
    edit_columns = add_columns
    show_columns = add_columns + ["id"]

    @has_access_api
    @expose("show/<pk>")
    def show(self, pk: int) -> FlaskResponse:
        return super().show(pk)
```

Этот класс предоставляет методы для добавления, обновления, удаления и отображения сохраненных запросов через API.

### SqlJsonPayloadSchema

Класс `SqlJsonPayloadSchema` в файле `schemas.py` определяет схему для валидации и сериализации данных запросов:

```python
class SqlJsonPayloadSchema(Schema):
    database_id = fields.Integer(required=True)
    sql = fields.String(required=True)
    client_id = fields.String(allow_none=True)
    queryLimit = fields.Integer(allow_none=True)
    sql_editor_id = fields.String(allow_none=True)
    schema = fields.String(allow_none=True)
    tab = fields.String(allow_none=True)
    ctas_method = fields.String(allow_none=True)
    templateParams = fields.String(allow_none=True)
    tmp_table_name = fields.String(allow_none=True)
    select_as_cta = fields.Boolean(allow_none=True)
    json = fields.Boolean(allow_none=True)
    runAsync = fields.Boolean(allow_none=True)
    expand_data = fields.Boolean(allow_none=True)
```

Эта схема определяет поля для валидации и сериализации данных запросов.

## DODO-специфичные модификации

### Поддержка экспорта в XLSX

В DODO была добавлена поддержка экспорта результатов запросов в формате XLSX:

1. **SqlResultExportCommand**:
   - Добавлена поддержка экспорта результатов запросов в формате XLSX
   - Добавлен импорт `ChartDataResultFormat` из `superset.common.chart_data`
   - Добавлен импорт `excel` из `superset.utils`
   - Задача: #44136746
   - Файл: `commands/sql_lab/export.py`

   ```python
   from superset.common.chart_data import ChartDataResultFormat  # dodo added 44136746
   from superset.utils import excel  # dodo added 44136746
   ```

2. **Фронтенд-компоненты**:
   - Добавлена кнопка для экспорта результатов запросов в формате XLSX
   - Добавлена обработка экспорта в формате XLSX
   - Файлы:
     - `superset-frontend/src/SqlLab/components/ResultSet.tsx`
     - `superset-frontend/src/SqlLab/actions/sqlLab.ts`

### Локализация состояний запросов

В DODO была добавлена локализация состояний запросов:

1. **Локализация состояний запросов**:
   - Добавлена локализация состояний запросов на русский язык
   - Файл: `superset-frontend/src/SqlLab/constants.ts`

   ```typescript
   // DODO added 44611022
   export const STATUS_OPTIONS_LOCALIZED = {
     ru: {
       [STATUS_OPTIONS.success]: 'Успешно',
       [STATUS_OPTIONS.failed]: 'Ошибка',
       [STATUS_OPTIONS.running]: 'Выполняется',
       [STATUS_OPTIONS.stopped]: 'Остановлено',
       [STATUS_OPTIONS.pending]: 'В очереди',
       [STATUS_OPTIONS.fetching]: 'Получение данных',
       [STATUS_OPTIONS.timed_out]: 'Таймаут',
       [STATUS_OPTIONS.scheduled]: 'Запланировано',
     },
   };
   ```

2. **Локализация статусов**:
   - Добавлена локализация статусов на русский язык
   - Файл: `superset-frontend/src/SqlLab/components/QueryTable.tsx`

   ```typescript
   // DODO added 44611022
   const getLocalizedStatus = (status: string) => {
     const locale = getSharedLabelWithBrowserLocale();
     if (locale && STATUS_OPTIONS_LOCALIZED[locale] && STATUS_OPTIONS_LOCALIZED[locale][status]) {
       return STATUS_OPTIONS_LOCALIZED[locale][status];
     }
     return status;
   };
   ```

## Процесс работы с SQL Lab

Процесс работы с SQL Lab в DODO включает следующие шаги:

1. **Создание запроса**:
   - Пользователь выбирает базу данных
   - Пользователь выбирает схему
   - Пользователь пишет SQL-запрос
   - Пользователь выполняет запрос

2. **Выполнение запроса**:
   - Запрос отправляется на сервер
   - Сервер выполняет запрос
   - Сервер возвращает результаты запроса

3. **Просмотр результатов**:
   - Пользователь просматривает результаты запроса
   - Пользователь может экспортировать результаты в различных форматах (CSV, JSON, XLSX)

4. **Сохранение запроса**:
   - Пользователь может сохранить запрос для повторного использования
   - Пользователь может просматривать и редактировать сохраненные запросы

## Техническая реализация

### SavedQueryView

```python
class SavedQueryView(DeprecateModelViewMixin, BaseSupersetView):
    route_base = "/savedqueryview"
    class_permission_name = "SavedQuery"

    @expose("/list/")
    @has_access
    def list(self) -> FlaskResponse:
        return super().render_app_template()
```

### SavedQueryViewApi

```python
class SavedQueryViewApi(DeprecateModelViewMixin, SupersetModelView, DeleteMixin):  # pylint: disable=too-many-ancestors
    datamodel = SQLAInterface(SavedQuery)
    include_route_methods = RouteMethod.CRUD_SET
    route_base = "/savedqueryviewapi"
    class_permission_name = "SavedQuery"

    include_route_methods = {
        RouteRoute.API_READ,
        RouteRoute.API_CREATE,
        RouteRoute.API_UPDATE,
        RouteRoute.API_GET,
    }

    method_permission_name = MODEL_VIEW_RW_METHOD_PERMISSION_MAP

    add_columns = ["label", "db_id", "schema", "description", "sql", "extra_json"]
    edit_columns = add_columns
    show_columns = add_columns + ["id"]

    @has_access_api
    @expose("show/<pk>")
    def show(self, pk: int) -> FlaskResponse:
        return super().show(pk)
```

### SqlJsonPayloadSchema

```python
class SqlJsonPayloadSchema(Schema):
    database_id = fields.Integer(required=True)
    sql = fields.String(required=True)
    client_id = fields.String(allow_none=True)
    queryLimit = fields.Integer(allow_none=True)
    sql_editor_id = fields.String(allow_none=True)
    schema = fields.String(allow_none=True)
    tab = fields.String(allow_none=True)
    ctas_method = fields.String(allow_none=True)
    templateParams = fields.String(allow_none=True)
    tmp_table_name = fields.String(allow_none=True)
    select_as_cta = fields.Boolean(allow_none=True)
    json = fields.Boolean(allow_none=True)
    runAsync = fields.Boolean(allow_none=True)
    expand_data = fields.Boolean(allow_none=True)
```

### SqlResultExportCommand

```python
class SqlResultExportCommand(BaseCommand):
    def __init__(
        self,
        query_id: int,
        format: ChartDataResultFormat = ChartDataResultFormat.CSV,  # dodo added 44136746
        query_dao: QueryDAO = QueryDAO(),
    ):
        self._query_id = query_id
        self._format = format  # dodo added 44136746
        self._query_dao = query_dao

    def run(self) -> dict[str, Any]:
        self.validate()

        query = self._query_dao.find_by_id(self._query_id)
        if not query:
            raise QueryNotFoundException()

        if not security_manager.can_access_datasource(
            database=query.database, query=query, view_name=self.__class__.__name__
        ):
            raise QueryIsForbiddenToAccessException()

        if query.status != QueryStatus.SUCCESS:
            raise QueryNotSuccessfulException(
                f"Query with id {self._query_id} is in status {query.status} and cannot be exported."
            )

        if not query.results_key:
            raise QueryResultsNotFoundException()

        try:
            blob = results_backend.get(query.results_key)
            if not blob:
                raise QueryResultsNotFoundException()

            payload = utils.zlib_decompress(
                blob, decode=not results_backend_use_msgpack
            )
            obj = _deserialize_results_payload(
                payload, query, cast(bool, results_backend_use_msgpack)
            )

            if self._format == ChartDataResultFormat.XLSX:  # dodo added 44136746
                return {
                    "data": excel.df_to_excel(obj["data"]),
                    "name": f"query_{query.id}_results.xlsx",
                    "type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                }  # dodo added 44136746

            return {
                "data": csv.df_to_escaped_csv(obj["data"], index=False),
                "name": f"query_{query.id}_results.csv",
                "type": "text/csv",
            }
        except Exception as ex:
            raise SqlLabExportException() from ex
```

## Примеры использования

### Получение списка сохраненных запросов

```python
from superset.models.sql_lab import SavedQuery
from superset import db

# Получение всех сохраненных запросов
saved_queries = db.session.query(SavedQuery).all()

# Вывод информации о сохраненных запросах
for query in saved_queries:
    print(f"ID: {query.id}, Label: {query.label}")
    print(f"Database: {query.database.database_name}")
    print(f"Schema: {query.schema}")
    print(f"SQL: {query.sql}")
```

### Создание сохраненного запроса

```python
from superset.models.sql_lab import SavedQuery
from superset import db
from superset.models.core import Database

# Получение базы данных
database = db.session.query(Database).get(1)

# Создание сохраненного запроса
saved_query = SavedQuery(
    label="My Query",
    database=database,
    schema="public",
    sql="SELECT * FROM my_table",
    description="My query description",
)

# Сохранение запроса
db.session.add(saved_query)
db.session.commit()
```

### Выполнение запроса

```python
from superset.commands.sql_lab.execute import ExecuteSqlCommand

# Выполнение запроса
execution_payload = {
    "database_id": 1,
    "sql": "SELECT * FROM my_table",
    "client_id": "client_id_123",
    "schema": "public",
    "async_flag": False,
}

command = ExecuteSqlCommand(execution_payload)
command_result = command.run()

# Вывод результатов
for row in command_result["data"]:
    print(row)
```

### Экспорт результатов запроса

```python
from superset.commands.sql_lab.export import SqlResultExportCommand
from superset.common.chart_data import ChartDataResultFormat

# Экспорт результатов запроса в формате CSV
command = SqlResultExportCommand(query_id=1, format=ChartDataResultFormat.CSV)
csv_data = command.run()

# Экспорт результатов запроса в формате XLSX
command = SqlResultExportCommand(query_id=1, format=ChartDataResultFormat.XLSX)
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

2. **Создание визуализации на основе результатов запроса**:
   ```python
   from superset.commands.sql_lab.execute import ExecuteSqlCommand
   from superset.models.slice import Slice
   from superset import db

   # Выполнение запроса
   execution_payload = {
       "database_id": 1,
       "sql": "SELECT region, SUM(sales) as total_sales FROM sales GROUP BY region ORDER BY total_sales DESC",
       "client_id": "client_id_123",
       "schema": "public",
       "async_flag": False,
   }

   command = ExecuteSqlCommand(execution_payload)
   command_result = command.run()

   # Создание визуализации
   slice = Slice(
       slice_name="Sales by Region",
       datasource_type="table",
       datasource_id=1,
       viz_type="bar",
       params="""
       {
           "viz_type": "bar",
           "groupby": ["region"],
           "metrics": ["total_sales"],
           "row_limit": 10000
       }
       """,
   )

   # Сохранение визуализации
   db.session.add(slice)
   db.session.commit()
   ```
