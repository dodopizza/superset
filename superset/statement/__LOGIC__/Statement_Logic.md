# Документация по модулю Statement в DODO

## Содержание

1. [Введение](#введение)
2. [Архитектура](#архитектура)
3. [Основные компоненты](#основные-компоненты)
   - [Модель Statement](#модель-statement)
   - [API для Statement](#api-для-statement)
   - [Схемы](#схемы)
   - [Фильтры](#фильтры)
4. [DODO-специфичная функциональность](#dodo-специфичная-функциональность)
   - [Процесс онбординга](#процесс-онбординга)
   - [Управление ролями](#управление-ролями)
   - [Интеграция с командами](#интеграция-с-командами)
5. [Техническая реализация](#техническая-реализация)
6. [Примеры использования](#примеры-использования)

## Введение

Модуль `statement` в Superset - это DODO-специфичный модуль, который был добавлен для поддержки процесса онбординга новых пользователей в DODO. Он позволяет управлять заявками пользователей на получение доступа к системе, назначение ролей и привязку к командам.

Модуль был добавлен в рамках задачи #32839641 и является полностью DODO-специфичным, то есть отсутствует в стандартной версии Superset.

## Архитектура

Модуль `statement` организован следующим образом:

1. **Основные файлы**:
   - `__init__.py` - инициализация модуля
   - `api.py` - API для работы с заявками (Statement)
   - `filters.py` - фильтры для заявок
   - `schemas.py` - схемы для валидации и сериализации данных

2. **Связанные модули**:
   - `models/statement.py` - модель для заявок
   - `commands/statement` - команды для работы с заявками
   - `daos/statement.py` - DAO для работы с заявками
   - `views/statement` - представления для заявок

3. **Фронтенд-компоненты**:
   - `superset-frontend/src/DodoExtensions/onBoarding` - компоненты для онбординга
   - `superset-frontend/src/DodoExtensions/onBoarding/repository` - репозитории для работы с API

## Основные компоненты

### Модель Statement

Модель `Statement` представляет заявку пользователя на получение доступа к системе. Она содержит информацию о пользователе, запрашиваемых ролях, команде и статусе заявки.

```python
class Statement(Model):  # pylint: disable=too-few-public-methods
    """Dodo teams for Superset"""

    __tablename__ = "statements"

    id = Column(Integer, primary_key=True)
    user = relationship(
        security_manager.user_model,
        secondary=statement_user,
        passive_deletes=True,
        backref="statements",
    )
    finished = Column(Boolean, default=False)
    team = Column(String, nullable=False)
    is_new_team = Column(Boolean, default=False)
    team_slug = Column(String, nullable=False)
    is_external = Column(Boolean, nullable=False)
    created_datetime = Column(DateTime, default=datetime.utcnow())
    request_roles = relationship(security_manager.role_model, secondary=statement_roles)
    last_changed_datetime = Column(DateTime, default=datetime.utcnow())
```

Модель имеет следующие основные поля:
- `id` - идентификатор заявки
- `user` - пользователь, создавший заявку
- `finished` - флаг, указывающий, завершена ли заявка
- `team` - название команды
- `is_new_team` - флаг, указывающий, является ли команда новой
- `team_slug` - слаг команды
- `is_external` - флаг, указывающий, является ли пользователь внешним (франчайзи)
- `created_datetime` - дата и время создания заявки
- `request_roles` - запрашиваемые роли
- `last_changed_datetime` - дата и время последнего изменения заявки

### API для Statement

API для работы с заявками реализовано в файле `api.py` и предоставляет следующие эндпоинты:

1. **GET /api/v1/statement/** - получение списка заявок
2. **GET /api/v1/statement/{id}** - получение заявки по идентификатору
3. **POST /api/v1/statement/** - создание новой заявки
4. **PUT /api/v1/statement/{id}** - обновление заявки

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
```

### Схемы

Схемы для валидации и сериализации данных реализованы в файле `schemas.py`:

```python
class CustomDodoRoles(Enum):
    CHECK_DATA = "readonly"
    CREATE_DATA = "Create data"
    VIZUALIZE_DATA = "Vizualize data"


class RolesSchema(Schema):
    id = fields.Int()
    name = fields.String()


class UserSchema(Schema):
    id = fields.Int()
    username = fields.String()
    first_name = fields.String()
    last_name = fields.String()
    email = fields.String()
    roles = fields.List(fields.Nested(RolesSchema))


class StatementGetResponseSchema(Schema):
    id = fields.Int()
    user = fields.List(fields.Nested(UserSchema()))
    finished = fields.Boolean()
    team = fields.String()
    is_new_team = fields.Boolean()
    team_slug = fields.String()
    is_external = fields.Boolean()
    created_datetime = fields.DateTime()
    request_roles = fields.List(fields.String(validate=CustomDodoRoles))
    last_changed_datetime = fields.DateTime()


class StatementGetSchema(Schema):
    is_external = fields.Boolean()
    query = fields.String()


class StatementPutSchema(Schema):
    team_slug = fields.String()
    is_approved = fields.Boolean()
    request_roles = fields.List(fields.String(validate=CustomDodoRoles))
```

### Фильтры

Фильтры для заявок реализованы в файле `filters.py`:

```python
class StatementIDFilter(BaseFilter):
    name = "statement_id"
    arg_name = "statement_id"

    def apply(self, query, value):
        return query.filter(Statement.id == value)


class StatementUserFirstNameFilter(RelatedFieldFilter):
    name = "user.first_name"
    arg_name = "user_first_name"
    datamodel = SQLAInterface(Statement)
    rel_model = "user"
    pk_field = "id"
    pk_field_type = int
```

## DODO-специфичная функциональность

### Процесс онбординга

Модуль `statement` используется для поддержки процесса онбординга новых пользователей в DODO. Процесс онбординга включает следующие шаги:

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

Модуль `statement` позволяет управлять ролями пользователей в DODO. В DODO определены следующие специфичные роли:

```python
class CustomDodoRoles(Enum):
    CHECK_DATA = "readonly"
    CREATE_DATA = "Create data"
    VIZUALIZE_DATA = "Vizualize data"
```

Эти роли определяют уровень доступа пользователя к системе:
- `CHECK_DATA` (readonly) - доступ только для чтения
- `CREATE_DATA` (Create data) - возможность создавать данные
- `VIZUALIZE_DATA` (Vizualize data) - возможность создавать визуализации

### Интеграция с командами

Модуль `statement` интегрирован с системой команд DODO. Каждая заявка связана с командой, к которой пользователь хочет присоединиться. Команды в DODO имеют следующие атрибуты:

- `team` - название команды
- `team_slug` - слаг команды (используется для идентификации команды в URL)
- `is_new_team` - флаг, указывающий, является ли команда новой

При обработке заявки пользователь привязывается к указанной команде, что позволяет организовать доступ к данным на основе принадлежности к команде.

## Техническая реализация

### Создание заявки

```python
@expose("/", methods=("POST",))
@protect()
@safe
@statsd_metrics
def post(self) -> Response:
    """Creates a new Statement"""
    try:
        item = self.add_model_schema.load(request.json)
    # This validates custom Schema with custom validations
    except ValidationError as error:
        logger.warning("validate data failed to add new statement")
        return self.response_400(message=error.messages)
    try:
        user_id = g.user.id
        item["user"] = [user_id]
        item["finished"] = False
        item["created_datetime"] = datetime.datetime.utcnow().isoformat()
        CreateStatementCommand(item).run()
        finished_onboarding = UserInfoDAO.finish_onboarding()
        return self.response(
            201, result={"is_onboarding_finished": finished_onboarding}
        )
    except StatementInvalidError as ex:
        return self.response_422(message=ex.normalized_messages())
    except StatementCreateFailedError as ex:
        logger.error(
            "Error creating model %s: %s",
            self.__class__.__name__,
            str(ex),
            exc_info=True,
        )
        return self.response_422(message=str(ex))
```

### Получение заявки

```python
@expose("/<pk>", methods=("GET",))
@protect()
@safe
@statsd_metrics
# pylint: disable=arguments-differ
def get(self, pk: int) -> Response:
    """Gets a Statement by ID"""
    try:
        statement = StatementDAO.get_by_id(pk)
        user = statement.user[0]
        dodo_role = UserInfoDAO.get_dodo_role(user.id)
        result = {
            "id": statement.id,
            "user": [
                {
                    "id": user.id,
                    "username": user.username,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "email": user.email,
                    "roles": [{"id": role.id, "name": role.name} for role in user.roles],
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
        }
        return self.response(200, result=result)
    except StatementNotFoundError as ex:
        return self.response_404(message=str(ex))
```

### Обновление заявки

```python
@expose("/<pk>", methods=("PUT",))
@protect()
@safe
@statsd_metrics
def put(self, pk: int) -> Response:  # pylint: disable=too-many-locals
    """Updates a Statement"""
    try:
        statement = StatementDAO.get_by_id(pk)
        item = self.edit_model_schema.load(request.json)
        team_slug = item.get("team_slug")
        is_approved = item.get("is_approved")
        request_roles = item.get("request_roles")
        if is_approved:
            # Approve statement
            user = statement.user[0]
            # Update user roles
            roles = []
            for role_name in request_roles:
                role = security_manager.find_role(role_name)
                if role:
                    roles.append(role)
            user.roles = roles
            # Update team
            team = TeamDAO.get_by_slug(team_slug)
            if not team:
                # Create team
                team_item = {"team": statement.team, "slug": team_slug}
                team = UpdateTeamCommand(team_item).run()
            # Add user to team
            team.users.append(user)
            # Mark statement as finished
            item["finished"] = True
            item["last_changed_datetime"] = datetime.datetime.utcnow().isoformat()
            UpdateStatementCommand(pk, item).run()
            return self.response(200, id=pk, result=item)
        # Just update statement
        item["last_changed_datetime"] = datetime.datetime.utcnow().isoformat()
        UpdateStatementCommand(pk, item).run()
        return self.response(200, id=pk, result=item)
    except StatementNotFoundError as ex:
        return self.response_404(message=str(ex))
    except StatementForbiddenError:
        return self.response_403()
    except StatementInvalidError as ex:
        return self.response_422(message=ex.normalized_messages())
    except StatementUpdateFailedError as ex:
        logger.error(
            "Error updating model %s: %s",
            self.__class__.__name__,
            str(ex),
            exc_info=True,
        )
        return self.response_422(message=str(ex))
```

## Примеры использования

### Создание заявки

```python
from superset.commands.statement.create import CreateStatementCommand

# Создание заявки
item = {
    "user": [1],  # ID пользователя
    "team": "Data Engineering",
    "is_new_team": False,
    "team_slug": "data-engineering",
    "is_external": False,
    "request_roles": ["readonly", "Create data"],
    "finished": False,
    "created_datetime": "2023-01-01T00:00:00",
    "last_changed_datetime": "2023-01-01T00:00:00",
}

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

# Обновление заявки
item = {
    "team_slug": "data-engineering",
    "is_approved": True,
    "request_roles": ["readonly", "Create data"],
}

UpdateStatementCommand(1, item).run()
```

### Использование в DODO

В DODO модуль `statement` используется для поддержки процесса онбординга новых пользователей. Примеры использования:

1. **Создание заявки через API**:
   ```javascript
   // Фронтенд-код для создания заявки
   const requestDto = {
     is_new_team: false,
     is_external: false,
     team: "Data Engineering",
     team_slug: "data-engineering",
     request_roles: ["readonly", "Create data"],
   };

   const response = await SupersetClient.post({
     url: '/api/v1/statement/',
     body: JSON.stringify(requestDto),
     headers: { 'Content-Type': 'application/json' },
     parseMethod: null,
   });

   const responseDto = await response.json();
   ```

2. **Получение заявки через API**:
   ```javascript
   // Фронтенд-код для получения заявки
   const response = await SupersetClient.get({
     url: `/api/v1/statement/${id}`,
     headers: { 'Content-Type': 'application/json' },
     parseMethod: null,
   });

   const dto = await response.json();
   ```

3. **Обновление заявки через API**:
   ```javascript
   // Фронтенд-код для обновления заявки
   const response = await SupersetClient.put({
     url: `/api/v1/statement/${id}`,
     body: JSON.stringify({
       team_slug: "data-engineering",
       is_approved: true,
       request_roles: ["readonly", "Create data"],
     }),
     headers: { 'Content-Type': 'application/json' },
     parseMethod: null,
   });

   const dto = await response.json();
   ```
