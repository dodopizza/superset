# Документация по представлениям заявок (Statement Views) в DODO

## Содержание

1. [Введение](#введение)
2. [Архитектура](#архитектура)
3. [Основные компоненты](#основные-компоненты)
   - [StatementMixin](#statementmixin)
   - [StatementModelView](#statementmodelview)
4. [DODO-специфичные модификации](#dodo-специфичные-модификации)
   - [Процесс онбординга](#процесс-онбординга)
   - [Управление ролями](#управление-ролями)
   - [Интеграция с командами](#интеграция-с-командами)
5. [Процесс работы с заявками](#процесс-работы-с-заявками)
6. [Техническая реализация](#техническая-реализация)
7. [Примеры использования](#примеры-использования)

## Введение

Модуль `views/statement` в Superset отвечает за представления заявок (Statement) в пользовательском интерфейсе. Он предоставляет классы и функции для отображения, создания, редактирования и удаления заявок, а также для работы с ними через API.

Этот модуль является полностью DODO-специфичным и был добавлен для поддержки процесса онбординга новых пользователей в DODO. Он позволяет управлять заявками пользователей на получение доступа к системе, назначение ролей и привязку к командам.

## Архитектура

Модуль `views/statement` организован следующим образом:

1. **Основные файлы**:
   - `__init__.py` - инициализация модуля
   - `mixin.py` - миксины для представлений заявок
   - `views.py` - представления для заявок

2. **Связанные модули**:
   - `models/statement.py` - модель для заявок
   - `statement/api.py` - API для заявок
   - `statement/filters.py` - фильтры для заявок
   - `statement/schemas.py` - схемы для валидации и сериализации данных
   - `commands/statement` - команды для работы с заявками
   - `daos/statement.py` - DAO для работы с заявками

3. **Фронтенд-компоненты**:
   - `superset-frontend/src/DodoExtensions/onBoarding` - компоненты для онбординга
   - `superset-frontend/src/DodoExtensions/onBoarding/repository` - репозитории для работы с API

## Основные компоненты

### StatementMixin

Миксин `StatementMixin` в файле `mixin.py` определяет общие свойства и методы для представлений заявок:

```python
class StatementMixin:  # pylint: disable=too-few-public-methods
    list_title = _("Statements")
    show_title = _("Show Statement")
    add_title = _("Add Statement")
    edit_title = _("Edit Statement")

    list_columns = [
        "user",
        "finished",
        "team",
        "is_new_team",
        "team_slug",
        "is_external",
        "created_datetime",
        "request_roles",
        "last_changed_datetime",
    ]
    label_columns = {
        "is_external": _("is_external"),
        "team": _("Team"),
        "is_new_team": _("is_new_team"),
        "team_slug": _("Team slug"),
        "finished": _("Finished"),
        "user": _("User"),
        "request_roles": _("Request roles"),
        "created_datetime": _("Created datetime"),
        "last_changed_datetime": _("Last changed datetime"),
    }
```

Этот миксин определяет заголовки, столбцы для отображения и метки для представлений заявок.

### StatementModelView

Класс `StatementModelView` в файле `views.py` наследуется от `StatementMixin` и `SupersetModelView` и предоставляет представление для заявок:

```python
class StatementModelView(StatementMixin, SupersetModelView):  # pylint: disable=too-many-ancestors
    route_base = "/onboarding/request"
    datamodel = SQLAInterface(StatementModel)
    class_permission_name = "Statement"
    method_permission_name = MODEL_VIEW_RW_METHOD_PERMISSION_MAP

    include_route_methods = RouteMethod.CRUD_SET | {RouteMethod.API_READ}

    @has_access
    @expose("/list")
    def list(self) -> FlaskResponse:
        return super().render_app_template()

    @has_access
    @expose("/edit/<pk>", methods=("GET",))
    def edit(self, pk: int) -> FlaskResponse:
        return super().render_app_template()
```

Этот класс предоставляет методы для отображения списка заявок и редактирования заявок.

## DODO-специфичные модификации

### Процесс онбординга

Модуль `views/statement` используется для поддержки процесса онбординга новых пользователей в DODO. Процесс онбординга включает следующие шаги:

1. **Выбор роли в DODO**:
   - Пользователь выбирает свою роль в DODO (например, "readonly", "Create data", "Vizualize data")
   - Эта информация сохраняется в таблице `user_info`

2. **Создание заявки**:
   - Пользователь создает заявку на получение доступа к системе
   - Указывает, является ли он внешним пользователем (франчайзи)
   - Выбирает команду или создает новую
   - Выбирает запрашиваемые роли

3. **Обработка заявки**:
   - Администратор просматривает заявку
   - Может одобрить или отклонить заявку
   - При одобрении пользователю назначаются запрашиваемые роли и он привязывается к команде

4. **Завершение онбординга**:
   - После обработки заявки процесс онбординга считается завершенным
   - Пользователь получает доступ к системе с назначенными ролями

### Управление ролями

Модуль `views/statement` позволяет управлять ролями пользователей в DODO. В DODO определены следующие специфичные роли:

```python
class CustomDodoRoles(Enum):
    CHECK_DATA = "readonly"
    CREATE_DATA = "Create data"
    VIZUALIZE_DATA = "Vizualize data"
```

Эти роли используются для определения уровня доступа пользователей к системе:
- `CHECK_DATA` (readonly) - роль для пользователей, которым нужен только доступ на чтение
- `CREATE_DATA` (Create data) - роль для пользователей, которым нужен доступ на создание данных
- `VIZUALIZE_DATA` (Vizualize data) - роль для пользователей, которым нужен доступ на создание визуализаций

### Интеграция с командами

Модуль `views/statement` интегрирован с модулем `team` для управления командами пользователей:

1. **Создание команды**:
   - При создании заявки пользователь может выбрать существующую команду или создать новую
   - Если пользователь создает новую команду, то в заявке устанавливается флаг `is_new_team`

2. **Привязка пользователя к команде**:
   - При обработке заявки пользователь привязывается к указанной команде
   - Если команда новая, то она создается

3. **Управление доступом команды**:
   - Команды могут иметь различные уровни доступа к ресурсам системы
   - Администраторы могут управлять доступом команд

## Процесс работы с заявками

Процесс работы с заявками в DODO включает следующие шаги:

1. **Создание заявки**:
   - Пользователь создает заявку через API
   - Указывает необходимую информацию (команда, роли, флаг внешнего пользователя)
   - Заявка сохраняется в базе данных

2. **Просмотр заявок**:
   - Администратор просматривает список заявок
   - Может фильтровать заявки по различным параметрам (пользователь, команда, статус)

3. **Обработка заявки**:
   - Администратор открывает заявку для редактирования
   - Может одобрить или отклонить заявку
   - При одобрении пользователю назначаются запрашиваемые роли и он привязывается к команде

4. **Завершение заявки**:
   - После обработки заявка помечается как завершенная
   - Пользователь получает доступ к системе с назначенными ролями

## Техническая реализация

### StatementMixin

```python
class StatementMixin:  # pylint: disable=too-few-public-methods
    list_title = _("Statements")
    show_title = _("Show Statement")
    add_title = _("Add Statement")
    edit_title = _("Edit Statement")

    list_columns = [
        "user",
        "finished",
        "team",
        "is_new_team",
        "team_slug",
        "is_external",
        "created_datetime",
        "request_roles",
        "last_changed_datetime",
    ]
    label_columns = {
        "is_external": _("is_external"),
        "team": _("Team"),
        "is_new_team": _("is_new_team"),
        "team_slug": _("Team slug"),
        "finished": _("Finished"),
        "user": _("User"),
        "request_roles": _("Request roles"),
        "created_datetime": _("Created datetime"),
        "last_changed_datetime": _("Last changed datetime"),
    }
```

### StatementModelView

```python
class StatementModelView(StatementMixin, SupersetModelView):  # pylint: disable=too-many-ancestors
    route_base = "/onboarding/request"
    datamodel = SQLAInterface(StatementModel)
    class_permission_name = "Statement"
    method_permission_name = MODEL_VIEW_RW_METHOD_PERMISSION_MAP

    include_route_methods = RouteMethod.CRUD_SET | {RouteMethod.API_READ}

    @has_access
    @expose("/list")
    def list(self) -> FlaskResponse:
        return super().render_app_template()

    @has_access
    @expose("/edit/<pk>", methods=("GET",))
    def edit(self, pk: int) -> FlaskResponse:
        return super().render_app_template()
```

### StatementRestApi

```python
class StatementRestApi(BaseSupersetModelRestApi):
    datamodel = SQLAInterface(Statement)

    RouteMethod.REST_MODEL_VIEW_CRUD_SET.add(RouteMethod.RELATED)
    resource_name = "statement"
    allow_browser_login = True

    class_permission_name = "Statement"
    method_permission_name = MODEL_API_RW_METHOD_PERMISSION_MAP

    list_columns = [
        "id",
        "user.id",
        "user.first_name",
        "user.last_name",
        "user.email",
        "finished",
        "team",
        "is_new_team",
        "team_slug",
        "is_external",
        "created_datetime",
        "request_roles.name",
        "request_roles.id",
        "last_changed_datetime",
    ]

    search_columns = ("id", "user", "finished", "team")

    order_columns = [
        "id",
        "team",
        "user",
        "created_datetime",
        "finished",
    ]

    @expose("/<pk>", methods=("GET",))
    @protect()
    @safe
    @statsd_metrics
    # pylint: disable=arguments-differ
    def get(self, pk: int) -> Response:
        """Gets a Statement by ID
        ---
        get:
          description: >-
            Get a statement by ID
          parameters:
          - in: path
            schema:
              type: integer
            name: pk
            description: The ID of the statement
          responses:
            200:
              description: Statement
              content:
                application/json:
                  schema:
                    type: object
                    properties:
                      result:
                        $ref: '#/components/schemas/StatementGetResponseSchema'
            400:
              $ref: '#/components/responses/400'
            401:
              $ref: '#/components/responses/401'
            403:
              $ref: '#/components/responses/403'
            404:
              $ref: '#/components/responses/404'
        """
        try:
            statement = StatementDAO.get_by_id(pk)
            user = statement.user[0]
            dodo_role = UserInfoDAO.get_dodo_role(user.id)
            return self.response(
                200,
                result={
                    "id": statement.id,
                    "user": [
                        {
                            "id": user.id,
                            "username": user.username,
                            "first_name": user.first_name,
                            "last_name": user.last_name,
                            "email": user.email,
                            "roles": [
                                {"id": role.id, "name": role.name}
                                for role in user.roles
                            ],
                        }
                    ],
                    "finished": statement.finished,
                    "team": statement.team,
                    "is_new_team": statement.is_new_team,
                    "team_slug": statement.team_slug,
                    "is_external": statement.is_external,
                    "created_datetime": statement.created_datetime,
                    "request_roles": [role.name for role in statement.request_roles],
                    "last_changed_datetime": statement.last_changed_datetime,
                    "dodo_role": dodo_role,
                },
            )
        except StatementNotFoundError:
            return self.response_404()
```

## Примеры использования

### Получение списка заявок

```python
from superset.models.statement import Statement
from superset import db

# Получение всех заявок
statements = db.session.query(Statement).all()

# Вывод информации о заявках
for statement in statements:
    print(f"ID: {statement.id}")
    print(f"User: {statement.user[0].username}")
    print(f"Team: {statement.team}")
    print(f"Is External: {statement.is_external}")
    print(f"Request Roles: {[role.name for role in statement.request_roles]}")
    print(f"Finished: {statement.finished}")
    print(f"Created: {statement.created_datetime}")
```

### Создание заявки

```python
from superset.commands.statement.create import CreateStatementCommand
from superset import db
from superset.models.core import User
from superset.security.manager import get_user_roles

# Получение пользователя
user = db.session.query(User).get(1)

# Создание заявки
item = {
    "user": [user.id],
    "team": "My Team",
    "is_new_team": True,
    "team_slug": "my-team",
    "is_external": False,
    "request_roles": ["readonly", "Create data"],
    "finished": False,
}

# Выполнение команды создания заявки
CreateStatementCommand(item).run()
```

### Получение заявки

```python
from superset.daos.statement import StatementDAO

# Получение заявки по ID
statement = StatementDAO.get_by_id(1)

# Вывод информации о заявке
print(f"ID: {statement.id}")
print(f"User: {statement.user[0].username}")
print(f"Team: {statement.team}")
print(f"Is External: {statement.is_external}")
print(f"Request Roles: {[role.name for role in statement.request_roles]}")
print(f"Finished: {statement.finished}")
print(f"Created: {statement.created_datetime}")
```

### Обновление заявки

```python
from superset.commands.statement.update import UpdateStatementCommand
from superset.security.manager import get_user_roles

# Обновление заявки
item = {
    "team_slug": "my-team",
    "is_approved": True,
    "request_roles": ["readonly", "Create data"],
}

# Выполнение команды обновления заявки
UpdateStatementCommand(1, item).run()
```

### Использование в DODO

В DODO модуль `views/statement` используется для поддержки процесса онбординга новых пользователей. Примеры использования:

1. **Создание заявки на доступ**:
   ```typescript
   import { SupersetClient } from '@superset-ui/core';

   // Создание заявки
   const response = await SupersetClient.post({
     url: '/api/v1/statement/',
     body: JSON.stringify({
       team: 'My Team',
       is_new_team: true,
       team_slug: 'my-team',
       is_external: false,
       request_roles: ['readonly', 'Create data'],
     }),
     headers: { 'Content-Type': 'application/json' },
   });

   const result = await response.json();
   console.log('Statement created:', result);
   ```

2. **Получение списка заявок**:
   ```typescript
   import { SupersetClient } from '@superset-ui/core';
   import rison from 'rison';

   // Получение списка заявок
   const queryParams = rison.encode({
     order_column: 'created_datetime',
     order_direction: 'desc',
     page: 0,
     page_size: 10,
   });

   const response = await SupersetClient.get({
     url: `/api/v1/statement/?q=${queryParams}`,
     headers: { 'Content-Type': 'application/json' },
   });

   const result = await response.json();
   console.log('Statements:', result.result);
   ```

3. **Обработка заявки**:
   ```typescript
   import { SupersetClient } from '@superset-ui/core';

   // Обработка заявки
   const response = await SupersetClient.put({
     url: '/api/v1/statement/1',
     body: JSON.stringify({
       team_slug: 'my-team',
       is_approved: true,
       request_roles: ['readonly', 'Create data'],
     }),
     headers: { 'Content-Type': 'application/json' },
   });

   const result = await response.json();
   console.log('Statement updated:', result);
   ```
