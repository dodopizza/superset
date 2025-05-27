# Документация по представлениям баз данных (Database Views) в DODO

## Содержание

1. [Введение](#введение)
2. [Архитектура](#архитектура)
3. [Основные компоненты](#основные-компоненты)
   - [DatabaseMixin](#databasemixin)
   - [DatabaseView](#databaseview)
   - [Валидаторы](#валидаторы)
4. [DODO-специфичные модификации](#dodo-специфичные-модификации)
   - [Поддержка Kusto](#поддержка-kusto)
   - [Интеграция с системой команд](#интеграция-с-системой-команд)
5. [Процесс работы с базами данных](#процесс-работы-с-базами-данных)
6. [Техническая реализация](#техническая-реализация)
7. [Примеры использования](#примеры-использования)

## Введение

Модуль `views/database` в Superset отвечает за представления баз данных в пользовательском интерфейсе. Он предоставляет классы и функции для отображения, создания, редактирования и удаления баз данных, а также для работы с ними через API.

В DODO этот модуль был расширен для поддержки Kusto и интеграции с системой команд DODO.

## Архитектура

Модуль `views/database` организован следующим образом:

1. **Основные файлы**:
   - `__init__.py` - инициализация модуля
   - `mixins.py` - миксины для представлений баз данных
   - `views.py` - представления для баз данных
   - `validators.py` - валидаторы для форм баз данных

2. **Связанные модули**:
   - `models/core.py` - модель для баз данных
   - `databases/api.py` - API для баз данных
   - `databases/filters.py` - фильтры для баз данных
   - `databases/commands` - команды для работы с базами данных
   - `db_engine_specs` - спецификации движков баз данных

3. **Фронтенд-компоненты**:
   - `superset-frontend/src/views/CRUD/data/database` - компоненты для отображения баз данных
   - `superset-frontend/src/components/DatabaseSelector` - компонент для выбора базы данных

## Основные компоненты

### DatabaseMixin

Миксин `DatabaseMixin` в файле `mixins.py` определяет общие свойства и методы для представлений баз данных:

```python
class DatabaseMixin:
    list_title = _("Databases")
    show_title = _("Show Database")
    add_title = _("Add Database")
    edit_title = _("Edit Database")

    list_columns = [
        "database_name",
        "backend",
        "expose_in_sqllab",
        "allow_run_async",
        "creator",
        "modified",
    ]
    order_columns = [
        "database_name",
        "allow_run_async",
        "allow_dml",
        "modified",
        "allow_file_upload",
        "expose_in_sqllab",
    ]
    add_columns = [
        "database_name",
        "sqlalchemy_uri",
        "cache_timeout",
        "expose_in_sqllab",
        "allow_run_async",
        "allow_file_upload",
        "allow_ctas",
        "allow_cvas",
        "allow_dml",
        "force_ctas_schema",
        "impersonate_user",
        "extra",
        "encrypted_extra",
        "server_cert",
    ]
    search_exclude_columns = (
        "password",
        "tables",
        "created_by",
        "changed_by",
        "queries",
        "saved_queries",
        "encrypted_extra",
        "server_cert",
    )
    edit_columns = add_columns
    show_columns = [
        "tables",
        "cache_timeout",
        "extra",
        "database_name",
        "sqlalchemy_uri",
        "perm",
        "created_by",
        "created_on",
        "changed_by",
        "changed_on",
    ]
    base_order = ("changed_on", "desc")
    description_columns = {
        "sqlalchemy_uri": utils.markdown(
            "Refer to the "
            "[SqlAlchemy docs]"
            "(https://docs.sqlalchemy.org/en/rel_1_2/core/engines.html#"
            "database-urls) "
            "for more information on how to structure your URI.",
            True,
        ),
        "expose_in_sqllab": _("Expose this DB in SQL Lab"),
        "allow_run_async": _(
            "Operate the database in asynchronous mode, meaning "
            "that the queries are executed on remote workers as opposed "
            "to on the web server itself. "
            "This assumes that you have a Celery worker setup as well "
            "as a results backend. Refer to the installation docs "
            "for more information."
        ),
        # ...
    }
    base_filters = [["id", DatabaseFilter, lambda: []]]
    label_columns = {
        "expose_in_sqllab": _("Expose in SQL Lab"),
        "allow_ctas": _("Allow CREATE TABLE AS"),
        "allow_cvas": _("Allow CREATE VIEW AS"),
        "allow_dml": _("Allow DDL/DML"),
        "force_ctas_schema": _("CTAS Schema"),
        "database_name": _("Database"),
        "creator": _("Creator"),
        "changed_on_": _("Last Changed"),
        "sqlalchemy_uri": _("SQLAlchemy URI"),
        "cache_timeout": _("Chart Cache Timeout"),
        "extra": _("Extra"),
        "encrypted_extra": _("Secure Extra"),
        "server_cert": _("Root certificate"),
        "allow_run_async": _("Async Execution"),
        "impersonate_user": _("Impersonate the logged on user"),
        "allow_file_upload": _("Allow Csv Upload"),
        "modified": _("Modified"),
        "backend": _("Backend"),
    }

    def _pre_add_update(self, database: Database) -> None:
        if app.config["PREVENT_UNSAFE_DB_CONNECTIONS"]:
            check_sqlalchemy_uri(make_url_safe(database.sqlalchemy_uri))
        self.check_extra(database)
        self.check_encrypted_extra(database)
        if database.server_cert:
            utils.parse_ssl_cert(database.server_cert)
        database.set_sqlalchemy_uri(database.sqlalchemy_uri)
        security_manager.add_permission_view_menu("database_access", database.perm)

        # add catalog/schema permissions
        if database.db_engine_spec.supports_catalog:
            catalogs = database.get_all_catalog_names()
            for catalog in catalogs:
                security_manager.add_permission_view_menu(
                    "catalog_access",
                    security_manager.get_catalog_perm(database.database_name, catalog),
                )
        else:
            # add a dummy catalog for DBs that don't support them
            catalogs = [None]

        for catalog in catalogs:
            for schema in database.get_all_schema_names(catalog=catalog):
                security_manager.add_permission_view_menu(
                    "schema_access",
                    security_manager.get_schema_perm(
                        database.database_name,
                        catalog,
                        schema,
                    ),
                )

    def pre_add(self, database: Database) -> None:
        self._pre_add_update(database)

    def pre_update(self, database: Database) -> None:
        self._pre_add_update(database)
```

Этот миксин определяет заголовки, столбцы для поиска, отображения и редактирования, а также другие свойства для представлений баз данных. Он также содержит методы для предварительной обработки баз данных перед добавлением и обновлением.

### DatabaseView

Класс `DatabaseView` в файле `views.py` наследуется от `DatabaseMixin` и предоставляет представление для баз данных:

```python
class DatabaseView(
    DeprecateModelViewMixin,
    DatabaseMixin,
    SupersetModelView,
    DeleteMixin,
    YamlExportMixin,
):  # pylint: disable=too-many-ancestors
    datamodel = SQLAInterface(models.Database)

    class_permission_name = "Database"
    method_permission_name = MODEL_VIEW_RW_METHOD_PERMISSION_MAP

    include_route_methods = RouteMethod.CRUD_SET

    add_template = "superset/models/database/add.html"
    edit_template = "superset/models/database/edit.html"
    validators_columns = {
        "sqlalchemy_uri": [sqlalchemy_uri_form_validator],
        "server_cert": [certificate_form_validator],
    }

    yaml_dict_key = "databases"

    @expose("/list/")
    @has_access
    def list(self) -> FlaskResponse:
        return super().render_app_template()
```

Этот класс предоставляет методы для добавления, обновления, удаления и отображения баз данных.

### Валидаторы

Файл `validators.py` содержит валидаторы для форм баз данных:

```python
def sqlalchemy_uri_form_validator(
    form: Form, field: StringField  # pylint: disable=unused-argument
) -> None:
    """
    Check if user has submitted a valid SQLAlchemy URI
    """
    sqlalchemy_uri = field.data
    try:
        if sqlalchemy_uri and current_app.config["PREVENT_UNSAFE_DB_CONNECTIONS"]:
            check_sqlalchemy_uri(make_url_safe(sqlalchemy_uri))
    except Exception as ex:
        logger.warning("Validation error on sqlalchemy_uri: %s", ex)
        raise ValidationError(
            [
                _(
                    "Invalid connection string, a valid string usually follows:"
                    "'DRIVER://USER:PASSWORD@DB-HOST/DATABASE-NAME'"
                    "<p>"
                    "Example:'postgresql://user:password@your-postgres-db/database'"
                    "</p>"
                )
            ]
        ) from ex


def certificate_form_validator(
    form: Form, field: StringField  # pylint: disable=unused-argument
) -> None:
    """
    Check if user has submitted a valid SSL certificate
    """
    certificate = field.data
    try:
        if certificate:
            utils.parse_ssl_cert(certificate)
    except CertificateException as ex:
        raise ValidationError([_("Invalid certificate")]) from ex
```

Эти валидаторы проверяют правильность URI SQLAlchemy и SSL-сертификата.

## DODO-специфичные модификации

### Поддержка Kusto

В DODO была добавлена поддержка Kusto:

1. **KustoEngineSpec**:
   - Добавлена поддержка подключения к Kusto
   - Добавлена поддержка запросов к Kusto
   - Добавлена подсветка синтаксиса для Kusto
   - Файл: `db_engine_specs/kusto.py`

2. **KustoSQLEngineSpec**:
   - Добавлена поддержка SQL-запросов к Kusto
   - Добавлена поддержка специфичных для Kusto функций
   - Файл: `db_engine_specs/kusto.py`

### Интеграция с системой команд

В DODO была добавлена интеграция с системой команд для управления доступом к базам данных:

1. **Фильтрация баз данных по командам**:
   - Базы данных могут быть отфильтрованы по командам пользователя
   - Пользователи видят только базы данных, к которым у их команды есть доступ

2. **Назначение владельцев баз данных**:
   - Базы данных могут быть назначены командам в качестве владельцев
   - Команды могут управлять доступом к своим базам данных

## Процесс работы с базами данных

Процесс работы с базами данных в DODO включает следующие шаги:

1. **Создание базы данных**:
   - Пользователь заполняет форму с информацией о базе данных
   - Пользователь указывает URI SQLAlchemy для подключения к базе данных
   - Пользователь настраивает дополнительные параметры базы данных
   - Пользователь сохраняет базу данных

2. **Просмотр базы данных**:
   - Пользователь может просматривать информацию о базе данных
   - Пользователь может просматривать таблицы и схемы базы данных

3. **Редактирование базы данных**:
   - Пользователь может изменять параметры базы данных
   - Пользователь может изменять URI SQLAlchemy
   - Пользователь может изменять дополнительные параметры базы данных

4. **Удаление базы данных**:
   - Пользователь может удалить базу данных, если у него есть соответствующие права

## Техническая реализация

### DatabaseMixin

```python
class DatabaseMixin:
    list_title = _("Databases")
    show_title = _("Show Database")
    add_title = _("Add Database")
    edit_title = _("Edit Database")

    list_columns = [
        "database_name",
        "backend",
        "expose_in_sqllab",
        "allow_run_async",
        "creator",
        "modified",
    ]
    order_columns = [
        "database_name",
        "allow_run_async",
        "allow_dml",
        "modified",
        "allow_file_upload",
        "expose_in_sqllab",
    ]
    add_columns = [
        "database_name",
        "sqlalchemy_uri",
        "cache_timeout",
        "expose_in_sqllab",
        "allow_run_async",
        "allow_file_upload",
        "allow_ctas",
        "allow_cvas",
        "allow_dml",
        "force_ctas_schema",
        "impersonate_user",
        "extra",
        "encrypted_extra",
        "server_cert",
    ]
    search_exclude_columns = (
        "password",
        "tables",
        "created_by",
        "changed_by",
        "queries",
        "saved_queries",
        "encrypted_extra",
        "server_cert",
    )
    edit_columns = add_columns
    show_columns = [
        "tables",
        "cache_timeout",
        "extra",
        "database_name",
        "sqlalchemy_uri",
        "perm",
        "created_by",
        "created_on",
        "changed_by",
        "changed_on",
    ]
    base_order = ("changed_on", "desc")
    description_columns = {
        "sqlalchemy_uri": utils.markdown(
            "Refer to the "
            "[SqlAlchemy docs]"
            "(https://docs.sqlalchemy.org/en/rel_1_2/core/engines.html#"
            "database-urls) "
            "for more information on how to structure your URI.",
            True,
        ),
        "expose_in_sqllab": _("Expose this DB in SQL Lab"),
        "allow_run_async": _(
            "Operate the database in asynchronous mode, meaning "
            "that the queries are executed on remote workers as opposed "
            "to on the web server itself. "
            "This assumes that you have a Celery worker setup as well "
            "as a results backend. Refer to the installation docs "
            "for more information."
        ),
        # ...
    }
    base_filters = [["id", DatabaseFilter, lambda: []]]
    label_columns = {
        "expose_in_sqllab": _("Expose in SQL Lab"),
        "allow_ctas": _("Allow CREATE TABLE AS"),
        "allow_cvas": _("Allow CREATE VIEW AS"),
        "allow_dml": _("Allow DDL/DML"),
        "force_ctas_schema": _("CTAS Schema"),
        "database_name": _("Database"),
        "creator": _("Creator"),
        "changed_on_": _("Last Changed"),
        "sqlalchemy_uri": _("SQLAlchemy URI"),
        "cache_timeout": _("Chart Cache Timeout"),
        "extra": _("Extra"),
        "encrypted_extra": _("Secure Extra"),
        "server_cert": _("Root certificate"),
        "allow_run_async": _("Async Execution"),
        "impersonate_user": _("Impersonate the logged on user"),
        "allow_file_upload": _("Allow Csv Upload"),
        "modified": _("Modified"),
        "backend": _("Backend"),
    }

    def _pre_add_update(self, database: Database) -> None:
        if app.config["PREVENT_UNSAFE_DB_CONNECTIONS"]:
            check_sqlalchemy_uri(make_url_safe(database.sqlalchemy_uri))
        self.check_extra(database)
        self.check_encrypted_extra(database)
        if database.server_cert:
            utils.parse_ssl_cert(database.server_cert)
        database.set_sqlalchemy_uri(database.sqlalchemy_uri)
        security_manager.add_permission_view_menu("database_access", database.perm)

        # add catalog/schema permissions
        if database.db_engine_spec.supports_catalog:
            catalogs = database.get_all_catalog_names()
            for catalog in catalogs:
                security_manager.add_permission_view_menu(
                    "catalog_access",
                    security_manager.get_catalog_perm(database.database_name, catalog),
                )
        else:
            # add a dummy catalog for DBs that don't support them
            catalogs = [None]

        for catalog in catalogs:
            for schema in database.get_all_schema_names(catalog=catalog):
                security_manager.add_permission_view_menu(
                    "schema_access",
                    security_manager.get_schema_perm(
                        database.database_name,
                        catalog,
                        schema,
                    ),
                )

    def pre_add(self, database: Database) -> None:
        self._pre_add_update(database)

    def pre_update(self, database: Database) -> None:
        self._pre_add_update(database)
```

### DatabaseView

```python
class DatabaseView(
    DeprecateModelViewMixin,
    DatabaseMixin,
    SupersetModelView,
    DeleteMixin,
    YamlExportMixin,
):  # pylint: disable=too-many-ancestors
    datamodel = SQLAInterface(models.Database)

    class_permission_name = "Database"
    method_permission_name = MODEL_VIEW_RW_METHOD_PERMISSION_MAP

    include_route_methods = RouteMethod.CRUD_SET

    add_template = "superset/models/database/add.html"
    edit_template = "superset/models/database/edit.html"
    validators_columns = {
        "sqlalchemy_uri": [sqlalchemy_uri_form_validator],
        "server_cert": [certificate_form_validator],
    }

    yaml_dict_key = "databases"

    @expose("/list/")
    @has_access
    def list(self) -> FlaskResponse:
        return super().render_app_template()
```

### Валидаторы

```python
def sqlalchemy_uri_form_validator(
    form: Form, field: StringField  # pylint: disable=unused-argument
) -> None:
    """
    Check if user has submitted a valid SQLAlchemy URI
    """
    sqlalchemy_uri = field.data
    try:
        if sqlalchemy_uri and current_app.config["PREVENT_UNSAFE_DB_CONNECTIONS"]:
            check_sqlalchemy_uri(make_url_safe(sqlalchemy_uri))
    except Exception as ex:
        logger.warning("Validation error on sqlalchemy_uri: %s", ex)
        raise ValidationError(
            [
                _(
                    "Invalid connection string, a valid string usually follows:"
                    "'DRIVER://USER:PASSWORD@DB-HOST/DATABASE-NAME'"
                    "<p>"
                    "Example:'postgresql://user:password@your-postgres-db/database'"
                    "</p>"
                )
            ]
        ) from ex


def certificate_form_validator(
    form: Form, field: StringField  # pylint: disable=unused-argument
) -> None:
    """
    Check if user has submitted a valid SSL certificate
    """
    certificate = field.data
    try:
        if certificate:
            utils.parse_ssl_cert(certificate)
    except CertificateException as ex:
        raise ValidationError([_("Invalid certificate")]) from ex
```

## Примеры использования

### Получение списка баз данных

```python
from superset.models.core import Database
from superset import db

# Получение всех баз данных
databases = db.session.query(Database).all()

# Вывод информации о базах данных
for database in databases:
    print(f"ID: {database.id}, Name: {database.database_name}")
    print(f"URI: {database.sqlalchemy_uri}")
    print(f"Backend: {database.backend}")
    print(f"Expose in SQL Lab: {database.expose_in_sqllab}")
```

### Создание базы данных

```python
from superset.models.core import Database
from superset import db

# Создание базы данных
database = Database(
    database_name="My Database",
    sqlalchemy_uri="postgresql://user:password@host:5432/database",
    expose_in_sqllab=True,
    allow_run_async=True,
    allow_ctas=True,
    allow_cvas=True,
    allow_dml=True,
    allow_file_upload=True,
)

# Сохранение базы данных
db.session.add(database)
db.session.commit()
```

### Получение таблиц базы данных

```python
from superset.models.core import Database
from superset import db

# Получение базы данных
database = db.session.query(Database).get(1)

# Получение таблиц
tables = database.get_all_table_names()

# Вывод таблиц
for table in tables:
    print(f"Table: {table}")
```

### Получение схем базы данных

```python
from superset.models.core import Database
from superset import db

# Получение базы данных
database = db.session.query(Database).get(1)

# Получение схем
schemas = database.get_all_schema_names()

# Вывод схем
for schema in schemas:
    print(f"Schema: {schema}")
```

### Тестирование подключения к базе данных

```python
from superset.models.core import Database
from superset import db

# Получение базы данных
database = db.session.query(Database).get(1)

# Тестирование подключения
try:
    database.test_connection()
    print("Connection successful")
except Exception as e:
    print(f"Connection failed: {e}")
```
