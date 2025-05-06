# Документация по безопасности (Security) в DODO

## Содержание

1. [Введение](#введение)
2. [Архитектура](#архитектура)
3. [Основные компоненты](#основные-компоненты)
   - [SupersetSecurityManager](#supersetsecuritymanager)
   - [Безопасность аналитических баз данных](#безопасность-аналитических-баз-данных)
   - [Гостевые токены](#гостевые-токены)
   - [API безопасности](#api-безопасности)
4. [Контроль доступа](#контроль-доступа)
   - [Роли и разрешения](#роли-и-разрешения)
   - [Доступ к данным](#доступ-к-данным)
   - [Безопасность на уровне строк](#безопасность-на-уровне-строк)
5. [DODO-специфичные модификации](#dodo-специфичные-модификации)
6. [Техническая реализация](#техническая-реализация)
7. [Примеры использования](#примеры-использования)

## Введение

Модуль `security` в Superset отвечает за управление безопасностью и контролем доступа в приложении. Он включает в себя механизмы аутентификации, авторизации, управления ролями и разрешениями, а также безопасность на уровне данных.

В DODO этот модуль используется для обеспечения безопасности и контроля доступа к данным и функциональности приложения, с некоторыми специфичными для DODO модификациями и расширениями.

## Архитектура

Модуль `security` организован следующим образом:

1. **Основные файлы**:
   - `__init__.py` - инициализация модуля
   - `manager.py` - основной класс `SupersetSecurityManager` для управления безопасностью
   - `analytics_db_safety.py` - проверка безопасности подключений к базам данных
   - `guest_token.py` - поддержка гостевых токенов для встраивания
   - `api.py` - API для работы с безопасностью

2. **Связанные модули**:
   - `row_level_security` - безопасность на уровне строк
   - `commands/security` - команды для работы с безопасностью
   - `daos/security.py` - DAO для работы с безопасностью

## Основные компоненты

### SupersetSecurityManager

`SupersetSecurityManager` - это основной класс для управления безопасностью в Superset. Он расширяет `SecurityManager` из Flask-AppBuilder и предоставляет дополнительные функции для управления безопасностью в Superset.

Основные функции `SupersetSecurityManager`:

1. **Управление ролями и разрешениями**:
   - Создание и настройка ролей (Admin, Alpha, Gamma, sql_lab)
   - Управление разрешениями для ролей
   - Проверка доступа к ресурсам

2. **Управление доступом к данным**:
   - Доступ к базам данных
   - Доступ к схемам
   - Доступ к источникам данных
   - Безопасность на уровне строк

3. **Аутентификация и авторизация**:
   - Поддержка различных методов аутентификации
   - Проверка разрешений для действий
   - Поддержка гостевых токенов для встраивания

```python
class SupersetSecurityManager(SecurityManager):
    userstatschartview = None
    READ_ONLY_MODEL_VIEWS = {"Database", "DynamicPlugin"}

    USER_MODEL_VIEWS = {
        "RegisterUserModelView",
        "UserDBModelView",
        "UserLDAPModelView",
        "UserInfoEditView",
        "UserOAuthModelView",
        "UserOIDModelView",
        "UserRemoteUserModelView",
    }

    GAMMA_READ_ONLY_MODEL_VIEWS = {
        "Dataset",
        "Datasource",
    } | READ_ONLY_MODEL_VIEWS

    ADMIN_ONLY_VIEW_MENUS = {
        "AccessRequestsModelView",
        "Manage",
        "SQL Lab",
        "Queries",
        "Refresh Druid Metadata",
        "ResetPasswordView",
        "RoleModelView",
        "Row Level Security",
        "Security",
        "SQL Lab",
    }
    # ...
```

### Безопасность аналитических баз данных

Модуль `analytics_db_safety.py` отвечает за проверку безопасности подключений к базам данных. Он предотвращает использование небезопасных диалектов SQLAlchemy, которые могут представлять угрозу безопасности.

```python
# list of unsafe SQLAlchemy dialects
BLOCKLIST = {
    # sqlite creates a local DB, which allows mapping server's filesystem
    re.compile(r"sqlite(?:\+[^\s]*)?$"),
    # shillelagh allows opening local files (eg, 'SELECT * FROM "csv:///etc/passwd"')
    re.compile(r"shillelagh$"),
    re.compile(r"shillelagh\+apsw$"),
}


def check_sqlalchemy_uri(uri: URL) -> None:
    if not feature_flag_manager.is_feature_enabled("ENABLE_SUPERSET_META_DB"):
        BLOCKLIST.add(re.compile(r"superset$"))

    for blocklist_regex in BLOCKLIST:
        if not re.match(blocklist_regex, uri.drivername):
            continue
        try:
            dialect = uri.get_dialect().__name__
        except (NoSuchModuleError, ValueError):
            dialect = uri.drivername

        raise SupersetSecurityException(
            SupersetError(
                error_type=SupersetErrorType.DATABASE_SECURITY_ACCESS_ERROR,
                message=_(
                    "%(dialect)s cannot be used as a data source for security reasons.",
                    dialect=dialect,
                ),
                level=ErrorLevel.ERROR,
            )
        )
```

### Гостевые токены

Модуль `guest_token.py` предоставляет поддержку гостевых токенов для встраивания Superset в другие приложения. Он определяет типы данных и классы для работы с гостевыми токенами.

```python
class GuestTokenUser(TypedDict, total=False):
    username: str
    first_name: str
    last_name: str


class GuestTokenResourceType(StrEnum):
    DASHBOARD = "dashboard"


class GuestTokenResource(TypedDict):
    type: GuestTokenResourceType
    id: Union[str, int]


GuestTokenResources = list[GuestTokenResource]


class GuestTokenRlsRule(TypedDict):
    dataset: Optional[str]
    clause: str


class GuestToken(TypedDict):
    iat: float
    exp: float
    user: GuestTokenUser
    resources: GuestTokenResources
    rls_rules: list[GuestTokenRlsRule]


class GuestUser(AnonymousUserMixin):
    """
    Used as the "anonymous" user in case of guest authentication (embedded)
    """

    is_guest_user = True

    @property
    def is_authenticated(self) -> bool:
        """
        This is set to true because guest users should be considered authenticated,
        at least in most places. The treatment of this flag is kind of inconsistent.
        """
        return True

    @property
    def is_anonymous(self) -> bool:
        """
        This is set to false because lots of code assumes that
        if user.is_anonymous, then role = Public
        But guest users need to have their own role independent of Public.
        """
        return False
```

### API безопасности

Модуль `api.py` предоставляет API для работы с безопасностью в Superset. Он включает в себя эндпоинты для управления разрешениями, ролями и другими аспектами безопасности.

## Контроль доступа

### Роли и разрешения

Superset использует систему ролей и разрешений для контроля доступа к функциональности приложения. Основные роли:

1. **Admin** - полный доступ ко всем функциям
2. **Alpha** - доступ к большинству функций, кроме административных
3. **Gamma** - ограниченный доступ к функциям
4. **sql_lab** - доступ только к SQL Lab

Каждая роль имеет набор разрешений, которые определяют, какие действия может выполнять пользователь с этой ролью.

### Доступ к данным

Superset контролирует доступ к данным на нескольких уровнях:

1. **Доступ к базам данных** - разрешение `database_access`
2. **Доступ к схемам** - разрешение `schema_access`
3. **Доступ к источникам данных** - разрешение `datasource_access`
4. **Доступ ко всем источникам данных** - разрешение `all_datasource_access`
5. **Доступ ко всем базам данных** - разрешение `all_database_access`
6. **Доступ ко всем запросам** - разрешение `all_query_access`

### Безопасность на уровне строк

Безопасность на уровне строк (Row Level Security, RLS) позволяет ограничивать доступ пользователей к определенным строкам данных в таблицах. Это реализовано через систему фильтров, которые применяются к запросам в зависимости от ролей пользователя.

## DODO-специфичные модификации

В DODO модуль `security` используется в основном в стандартном виде, без значительных модификаций. Однако, есть некоторые специфичные для DODO аспекты:

1. **Интеграция с системой онбординга** - модуль `security` интегрирован с системой онбординга DODO для управления доступом новых пользователей.

2. **Поддержка команд DODO** - модуль `security` поддерживает работу с командами DODO, обеспечивая доступ к данным на основе принадлежности к команде.

3. **Локализация сообщений об ошибках** - сообщения об ошибках безопасности локализованы на русский язык для пользователей DODO.

## Техническая реализация

### Проверка доступа к ресурсам

```python
def can_access(self, permission_name: str, view_name: str) -> bool:
    """
    Return True if the user can access the FAB permission/view, False otherwise.

    Note this method adds protection from has_access failing from missing
    permission/view entries.

    :param permission_name: The FAB permission name
    :param view_name: The FAB view-menu name
    :returns: Whether the user can access the FAB permission/view
    """

    user = g.user
    if user.is_anonymous:
        return self.is_item_public(permission_name, view_name)
    return self._has_view_access(user, permission_name, view_name)
```

### Проверка доступа к источникам данных

```python
def can_access_datasource(
    self, datasource: "BaseDatasource"
) -> bool:
    """
    Return True if the user can access the datasource, False otherwise.

    :param datasource: The datasource to check
    :returns: Whether the user can access the datasource
    """

    try:
        self.raise_for_access(datasource=datasource)
        return True
    except SupersetSecurityException:
        return False
```

### Добавление фильтров безопасности на уровне строк

```python
def add_row_level_security_filters(
    self, query: Select, table: "SqlaTable"
) -> Select:
    """
    Add row level security filters to a query.

    :param query: The query to add the filters to
    :param table: The table to add the filters to
    :return: The query with the filters added
    """
    if not self.can_access_all_datasources():
        filters = []
        for filter_ in table.row_level_security_filters:
            if filter_.roles and self.get_user_roles():
                role_ids = [role.id for role in filter_.roles]
                user_role_ids = [role.id for role in self.get_user_roles()]
                if set(role_ids).issubset(set(user_role_ids)):
                    filters.append(filter_)

        if filters:
            filter_clause = or_(
                *(
                    text(f.clause)
                    for f in filters
                    if f.clause is not None and f.clause != ""
                )
            )
            query = query.where(filter_clause)
    return query
```

### Создание гостевого токена

```python
def create_guest_access_token(
    self,
    user: GuestTokenUser,
    resources: GuestTokenResources,
    rls: list[GuestTokenRlsRule],
) -> bytes:
    secret = current_app.config["GUEST_TOKEN_JWT_SECRET"]
    algo = current_app.config["GUEST_TOKEN_JWT_ALGO"]
    exp_seconds = current_app.config["GUEST_TOKEN_JWT_EXP_SECONDS"]
    audience = self._get_guest_token_jwt_audience()
    # calculate expiration time
    now = self._get_current_epoch_time()
    exp = now + exp_seconds
    claims = {
        "user": user,
        "resources": resources,
        "rls_rules": rls,
        # standard jwt claims:
        "iat": now,  # issued at
        "exp": exp,  # expiration time
        "aud": audience,
        "type": "guest",
    }
    return self.pyjwt_for_guest_token.encode(claims, secret, algorithm=algo)
```

## Примеры использования

### Проверка доступа к дашборду

```python
from superset import security_manager
from superset.models.dashboard import Dashboard

# Получение дашборда
dashboard = Dashboard.get(1)

# Проверка доступа
if security_manager.can_access_dashboard(dashboard):
    # Пользователь имеет доступ к дашборду
    print("Доступ разрешен")
else:
    # Пользователь не имеет доступа к дашборду
    print("Доступ запрещен")
```

### Проверка доступа к источнику данных

```python
from superset import security_manager
from superset.connectors.sqla.models import SqlaTable

# Получение источника данных
datasource = SqlaTable.get_datasource_by_name("example_table", "example_schema", "example_db")

# Проверка доступа
if security_manager.can_access_datasource(datasource):
    # Пользователь имеет доступ к источнику данных
    print("Доступ разрешен")
else:
    # Пользователь не имеет доступа к источнику данных
    print("Доступ запрещен")
```

### Создание гостевого токена для встраивания

```python
from superset import security_manager
from superset.security.guest_token import GuestTokenResourceType

# Создание гостевого токена
token = security_manager.create_guest_access_token(
    user={"username": "guest", "first_name": "Guest", "last_name": "User"},
    resources=[{"type": GuestTokenResourceType.DASHBOARD, "id": 1}],
    rls=[{"dataset": "1", "clause": "user_id = 1"}],
)

# Использование токена для встраивания
print(f"Гостевой токен: {token.decode('utf-8')}")
```

### Проверка безопасности URI базы данных

```python
from sqlalchemy.engine.url import make_url
from superset.security.analytics_db_safety import check_sqlalchemy_uri
from superset.exceptions import SupersetSecurityException

# Проверка безопасности URI
try:
    uri = make_url("postgres://user:password@host:port/database")
    check_sqlalchemy_uri(uri)
    print("URI безопасен")
except SupersetSecurityException as e:
    print(f"URI небезопасен: {e}")
```
