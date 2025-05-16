# Документация по модулю Team в DODO

## Содержание

1. [Введение](#введение)
2. [Архитектура](#архитектура)
3. [Основные компоненты](#основные-компоненты)
   - [Модель Team](#модель-team)
   - [API для команд](#api-для-команд)
   - [Фильтры](#фильтры)
   - [Схемы](#схемы)
4. [DODO-специфичная функциональность](#dodo-специфичная-функциональность)
   - [Управление командами](#управление-командами)
   - [Интеграция с онбордингом](#интеграция-с-онбордингом)
   - [Роли и разрешения](#роли-и-разрешения)
5. [Процесс работы с командами](#процесс-работы-с-командами)
6. [Техническая реализация](#техническая-реализация)
7. [Примеры использования](#примеры-использования)

## Введение

Модуль `team` в Superset - это DODO-специфичный модуль, который был добавлен для поддержки работы с командами в DODO. Он позволяет создавать команды, добавлять в них пользователей, назначать роли и управлять доступом к ресурсам на основе принадлежности к команде.

Модуль был добавлен в рамках задачи #32839638 и является полностью DODO-специфичным, то есть отсутствует в стандартной версии Superset.

## Архитектура

Модуль `team` организован следующим образом:

1. **Основные файлы**:
   - `__init__.py` - инициализация модуля
   - `api.py` - API для работы с командами
   - `filters.py` - фильтры для команд
   - `schemas.py` - схемы для валидации и сериализации данных

2. **Связанные модули**:
   - `models/team.py` - модель для команд
   - `commands/team` - команды для работы с командами
   - `daos/team.py` - DAO для работы с командами
   - `views/team` - представления для команд

3. **Фронтенд-компоненты**:
   - `superset-frontend/src/DodoExtensions/onBoarding/pages/TeamList` - страница для управления командами
   - `superset-frontend/src/DodoExtensions/onBoarding/components` - компоненты для работы с командами
   - `superset-frontend/src/DodoExtensions/onBoarding/repository` - репозитории для работы с API команд

## Основные компоненты

### Модель Team

Модель `Team` представляет команду в DODO. Она содержит информацию о названии команды, ее участниках, ролях и других атрибутах.

```python
team_users = Table(
    "team_users",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("team_id", Integer, ForeignKey("teams.id", ondelete="CASCADE")),
    Column("user_id", Integer, ForeignKey("ab_user.id", ondelete="CASCADE")),
)


class Team(Model):  # pylint: disable=too-few-public-methods
    """Dodo teams for Superset"""

    __tablename__ = "teams"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    is_external = Column(Boolean, nullable=False)
    slug = Column(String, unique=True)
    roles = relationship(security_manager.role_model, secondary=team_roles)
    participants = relationship(
        security_manager.user_model,
        secondary=team_users,
        passive_deletes=True,
        backref="teams",
    )
```

Модель имеет следующие основные поля:
- `id` - идентификатор команды
- `name` - название команды
- `is_external` - флаг, указывающий, является ли команда внешней (франчайзи)
- `slug` - слаг команды (используется для идентификации команды в URL)
- `roles` - роли, назначенные команде
- `participants` - участники команды

### API для команд

API для работы с командами реализовано в файле `api.py` и предоставляет следующие эндпоинты:

1. **GET /api/v1/team/** - получение списка команд
2. **GET /api/v1/team/{id}** - получение команды по идентификатору
3. **POST /api/v1/team/** - создание новой команды
4. **PUT /api/v1/team/{id}** - обновление команды
5. **DELETE /api/v1/team/{id}** - удаление команды
6. **POST /api/v1/team/add_user** - добавление пользователя в команду
7. **DELETE /api/v1/team/remove_user** - удаление пользователя из команды

```python
class TeamRestApi(BaseSupersetModelRestApi):
    datamodel = SQLAInterface(Team)

    include_route_methods = RouteMethod.REST_MODEL_VIEW_CRUD_SET | {
        "add_user",
        "remove_user",
    }
    resource_name = "team"
    allow_browser_login = True

    class_permission_name = "Team"
    method_permission_name = MODEL_API_RW_METHOD_PERMISSION_MAP

    search_columns = ("id", "slug", "is_external", "name")

    search_filters = {
        "name": [TeamNameFilter],
        "is_external": [TeamExternalFilter],
        "id": [TeamIDFilter],
        "slug": [TeamSlugFilter],
    }

    list_columns = [
        "id",
        "name",
        "is_external",
        "slug",
        "roles.id",
        "roles.name",
        "participants.first_name",
        "participants.last_name",
        "participants.id",
    ]
```

### Фильтры

Фильтры для команд реализованы в файле `filters.py`:

1. **TeamIDFilter** - фильтр по идентификатору команды:
   ```python
   class TeamIDFilter(BaseFilter):  # pylint: disable=too-few-public-methods
       name = _("id")
       arg_name = "eq_id_team"

       def apply(self, query: Query, value: Any) -> Query:
           if value:
               return query.filter(Team.id == int(value))
           return query
   ```

2. **TeamNameFilter** - фильтр по названию команды:
   ```python
   class TeamNameFilter(BaseFilter):  # pylint: disable=too-few-public-methods
       name = _("Name")
       arg_name = "ct_name"

       def apply(self, query: Query, value: Any) -> Query:
           if not value:
               return query
           ilike_value = f"%{value}%"
           return query.filter(Team.name.ilike(ilike_value))
   ```

3. **TeamSlugFilter** - фильтр по слагу команды:
   ```python
   class TeamSlugFilter(BaseFilter):  # pylint: disable=too-few-public-methods
       name = _("Slug")
       arg_name = "ct_slug"

       def apply(self, query: Query, value: Any) -> Query:
           if not value:
               return query
           ilike_value = f"%{value}%"
           return query.filter(Team.slug.ilike(ilike_value))
   ```

4. **TeamExternalFilter** - фильтр по признаку внешней команды:
   ```python
   class TeamExternalFilter(BaseFilter):  # pylint: disable=too-few-public-methods
       name = _("External")
       arg_name = "eq_external"

       def apply(self, query: Query, value: Any) -> Query:
           if not value == 0:
               if not value:
                   return query
           is_external = bool(int(value))
           return query.filter(Team.is_external.is_(is_external))
   ```

### Схемы

Схемы для валидации и сериализации данных реализованы в файле `schemas.py`:

```python
class CustomDodoRoles(Enum):
    CHECK_DATA = "readonly"
    CREATE_DATA = "Create data"
    VIZUALIZE_DATA = "Vizualize data"


class UserSchema(Schema):
    id = fields.Int()
    username = fields.String()
    first_name = fields.String()
    last_name = fields.String()
    email = fields.String()
    last_login = fields.DateTime()
    created_on = fields.DateTime()
    login_count = fields.Int()


class RolesSchema(Schema):
    id = fields.Int()
    name = fields.String()


class TeamGetSchema(Schema):
    id = fields.Int()
    name = fields.String()
    slug = fields.String()
    is_external = fields.Boolean()
    roles = fields.List(fields.Nested(RolesSchema))
    participants = fields.List(fields.Nested(UserSchema()))


class TeamGetResponseSchema(Schema):
    result = fields.List(fields.Nested(TeamGetSchema))


class TeamPostSchema(Schema):
    is_external = fields.Boolean()
    name = fields.String()
    slug = fields.String()
    roles = fields.List(fields.String(validate=CustomDodoRoles))


class AddUserSchema(Schema):
    user_id = fields.Int()
    team_id = fields.Int()
```

## DODO-специфичная функциональность

### Управление командами

Модуль `team` позволяет управлять командами в DODO. Команды могут быть внутренними (для сотрудников DODO) или внешними (для франчайзи). Каждая команда имеет свой набор ролей, которые определяют права доступа участников команды.

Основные операции с командами:
- Создание новой команды
- Добавление пользователей в команду
- Назначение ролей команде
- Удаление пользователей из команды
- Удаление команды

### Интеграция с онбордингом

Модуль `team` тесно интегрирован с процессом онбординга новых пользователей в DODO. При прохождении онбординга пользователь может выбрать существующую команду или создать новую. Это позволяет автоматически настроить права доступа для нового пользователя на основе его команды.

Интеграция с онбордингом включает:
- Поиск существующих команд
- Создание новой команды в процессе онбординга
- Добавление пользователя в выбранную команду
- Назначение ролей на основе команды

### Роли и разрешения

Модуль `team` использует систему ролей и разрешений Superset для управления доступом. Каждая команда имеет набор ролей, которые определяют, какие действия могут выполнять участники команды.

В DODO определены следующие специфичные роли:
- `CHECK_DATA` (readonly) - доступ только для чтения
- `CREATE_DATA` (Create data) - возможность создавать данные
- `VIZUALIZE_DATA` (Vizualize data) - возможность создавать визуализации

Эти роли назначаются командам, а затем наследуются всеми участниками команды.

## Процесс работы с командами

Процесс работы с командами в DODO включает следующие шаги:

1. **Создание команды**:
   - Администратор или пользователь в процессе онбординга создает новую команду
   - Указывает название команды, слаг и признак внешней команды
   - Выбирает роли для команды

2. **Добавление пользователей**:
   - Администратор добавляет пользователей в команду
   - Пользователи могут быть добавлены в команду в процессе онбординга

3. **Управление ролями**:
   - Администратор может изменять роли команды
   - Роли команды определяют права доступа всех участников команды

4. **Использование команд для контроля доступа**:
   - Принадлежность к команде используется для определения доступа к ресурсам
   - Пользователи видят только те ресурсы, к которым у их команды есть доступ

## Техническая реализация

### Создание команды

```python
@expose("/", methods=("POST",))
@protect()
@safe
@statsd_metrics
def post(self) -> Response:
    """Creates a new Team
    ---
    post:
      description: >-
        Create a new Team.
      requestBody:
        description: Team schema
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/{{self.__class__.__name__}}.post'
      responses:
        201:
          description: Team added
          content:
            application/json:
              schema:
                type: object
                properties:
                  id:
                    type: number
                  result:
                    $ref: '#/components/schemas/{{self.__class__.__name__}}.post'
        400:
          $ref: '#/components/responses/400'
        401:
          $ref: '#/components/responses/401'
        404:
          $ref: '#/components/responses/404'
        422:
          $ref: '#/components/responses/422'
        500:
          $ref: '#/components/responses/500'
    """
    try:
        item = self.add_model_schema.load(request.json)
    # This validates custom Schema with custom validations
    except ValidationError as error:
        return self.response_400(message=error.messages)
    try:
        roles = []
        for role_name in item.get("roles", []):
            role = security_manager.find_role(role_name)
            if role:
                roles.append(role)
        item["roles"] = roles
        new_model = CreateTeamCommand(item).run()
        return self.response(201, id=new_model.id, result=item)
    except TeamInvalidError as ex:
        return self.response_422(message=ex.normalized_messages())
    except TeamCreateFailedError as ex:
        logger.error(
            "Error creating model %s: %s",
            self.__class__.__name__,
            str(ex),
            exc_info=True,
        )
        return self.response_422(message=str(ex))
```

### Добавление пользователя в команду

```python
@expose("/add_user", methods=("POST",))
@protect()
@safe
@statsd_metrics
def add_user(self) -> Response:
    """Add user to team
    ---
    post:
      description: >-
        Add user to team
      requestBody:
        description: Add user schema
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/AddUserSchema'
      responses:
        201:
          description: User added to team
        400:
          $ref: '#/components/responses/400'
        401:
          $ref: '#/components/responses/401'
        404:
          $ref: '#/components/responses/404'
        500:
          $ref: '#/components/responses/500'
    """
    try:
        item = AddUserSchema().load(request.json)
    except ValidationError as error:
        return self.response_400(message=error.messages)
    try:
        team = TeamDAO.find_by_id(item["team_id"])
        if not team:
            return self.response_404()
        user = UserDAO.find_by_id(item["user_id"])
        if not user:
            return self.response_404()
        team.participants.append(user)
        db.session.commit()
        return self.response(201)
    except Exception as ex:
        logger.error(
            "Error adding user to team %s: %s",
            self.__class__.__name__,
            str(ex),
            exc_info=True,
        )
        return self.response_422(message=str(ex))
```

### Удаление пользователя из команды

```python
@expose("/remove_user", methods=("DELETE",))
@protect()
@safe
@statsd_metrics
def remove_user(self) -> Response:
    """Remove user from team
    ---
    delete:
      description: >-
        Remove user from team
      parameters:
      - in: query
        name: team_id
        schema:
          type: integer
      - in: query
        name: user_id
        schema:
          type: integer
      responses:
        200:
          description: User removed from team
        400:
          $ref: '#/components/responses/400'
        401:
          $ref: '#/components/responses/401'
        404:
          $ref: '#/components/responses/404'
        422:
          $ref: '#/components/responses/422'
        500:
          $ref: '#/components/responses/500'
    """
    try:
        team_id = request.args.get("team_id", None)
        user_id = request.args.get("user_id", None)
        if not team_id or not user_id:
            return self.response_400(message="Missing team_id or user_id")
        team = TeamDAO.find_by_id(int(team_id))
        if not team:
            return self.response_404()
        user = UserDAO.find_by_id(int(user_id))
        if not user:
            return self.response_404()
        team.participants.remove(user)
        db.session.commit()
        return self.response(200)
    except Exception as ex:
        logger.error(
            "Error removing user from team %s: %s",
            self.__class__.__name__,
            str(ex),
            exc_info=True,
        )
        return self.response_422(message=str(ex))
```

### Поиск команды по слагу

```python
@staticmethod
def find_team_by_slug(team_slug: str) -> Team:
    try:
        team = db.session.query(Team).filter(Team.slug == team_slug).one_or_none()
        return team
    except Exception:
        logger.warning("Cant find team by slug")
        raise
```

## Примеры использования

### Создание команды

```python
from superset.commands.team.create import CreateTeamCommand

# Создание команды
item = {
    "name": "Data Engineering",
    "is_external": False,
    "slug": "data-engineering",
    "roles": ["readonly", "Create data"],
}

team = CreateTeamCommand(item).run()
print(f"Team ID: {team.id}, Name: {team.name}")
```

### Добавление пользователя в команду

```python
from superset.daos.team import TeamDAO
from superset.daos.user import UserDAO
from superset import db

# Получение команды и пользователя
team = TeamDAO.find_by_id(1)
user = UserDAO.find_by_id(1)

# Добавление пользователя в команду
team.participants.append(user)
db.session.commit()
```

### Получение команды по слагу

```python
from superset.daos.team import TeamDAO

# Получение команды по слагу
team = TeamDAO.find_team_by_slug("data-engineering")

# Вывод информации о команде
print(f"Team ID: {team.id}, Name: {team.name}")
print(f"Is External: {team.is_external}")
print(f"Roles: {[role.name for role in team.roles]}")
print(f"Participants: {[user.username for user in team.participants]}")
```

### Использование в DODO

В DODO модуль `team` используется для организации пользователей по командам и управления доступом. Примеры использования:

1. **Создание команды через API**:
   ```javascript
   // Фронтенд-код для создания команды
   const response = await SupersetClient.post({
     url: '/api/v1/team/',
     body: JSON.stringify({
       is_external: userFrom === UserFromEnum.Franchisee ? 1 : 0,
       name: teamName,
       slug: teamSlug,
       roles: roles,
     }),
     headers: { 'Content-Type': 'application/json' },
     parseMethod: null,
   });
   ```

2. **Получение списка команд через API**:
   ```javascript
   // Фронтенд-код для получения списка команд
   const filterExps = [
     { col: 'name', opr: Operation.Contains, value: query },
     {
       col: 'is_external',
       opr: Operation.Equals,
       value: userFrom === UserFromEnum.Franchisee ? 1 : 0,
     },
   ];

   const queryParams = rison.encode_uri({ filters: filterExps });
   const url = `/api/v1/team/?q=${queryParams}`;

   const response = await SupersetClient.get({
     url,
     headers: { 'Content-Type': 'application/json' },
     parseMethod: null,
   });
   ```

3. **Добавление пользователя в команду через API**:
   ```javascript
   // Фронтенд-код для добавления пользователя в команду
   const response = await SupersetClient.post({
     url: '/api/v1/team/add_user',
     body: JSON.stringify({
       team_id: teamId,
       user_id: userId,
     }),
     headers: { 'Content-Type': 'application/json' },
     parseMethod: null,
   });
   ```
