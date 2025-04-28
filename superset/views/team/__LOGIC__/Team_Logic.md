# Документация по представлениям команд (Team Views) в DODO

## Содержание

1. [Введение](#введение)
2. [Архитектура](#архитектура)
3. [Основные компоненты](#основные-компоненты)
   - [TeamMixin](#teammixin)
   - [TeamModelView](#teammodelview)
4. [DODO-специфичные модификации](#dodo-специфичные-модификации)
   - [Управление командами](#управление-командами)
   - [Интеграция с онбордингом](#интеграция-с-онбордингом)
   - [Роли и разрешения](#роли-и-разрешения)
5. [Процесс работы с командами](#процесс-работы-с-командами)
6. [Техническая реализация](#техническая-реализация)
7. [Примеры использования](#примеры-использования)

## Введение

Модуль `views/team` в Superset отвечает за представления команд (Team) в пользовательском интерфейсе. Он предоставляет классы и функции для отображения, создания, редактирования и удаления команд, а также для работы с ними через API.

Этот модуль является полностью DODO-специфичным и был добавлен для поддержки работы с командами в DODO. Он позволяет создавать команды, добавлять в них пользователей, назначать роли и управлять доступом к ресурсам на основе принадлежности к команде.

## Архитектура

Модуль `views/team` организован следующим образом:

1. **Основные файлы**:
   - `__init__.py` - инициализация модуля
   - `mixin.py` - миксины для представлений команд
   - `views.py` - представления для команд

2. **Связанные модули**:
   - `models/team.py` - модель для команд
   - `team/api.py` - API для команд
   - `team/filters.py` - фильтры для команд
   - `team/schemas.py` - схемы для валидации и сериализации данных
   - `commands/team` - команды для работы с командами
   - `daos/team.py` - DAO для работы с командами

3. **Фронтенд-компоненты**:
   - `superset-frontend/src/DodoExtensions/onBoarding/pages/TeamList` - страница для управления командами
   - `superset-frontend/src/DodoExtensions/onBoarding/components` - компоненты для работы с командами
   - `superset-frontend/src/DodoExtensions/onBoarding/repository` - репозитории для работы с API команд

## Основные компоненты

### TeamMixin

Миксин `TeamMixin` в файле `mixin.py` определяет общие свойства и методы для представлений команд:

```python
class TeamMixin:  # pylint: disable=too-few-public-methods
    list_title = _("Team")
    show_title = _("Show Team")
    add_title = _("Add Team")
    edit_title = _("Edit Team")

    list_columns = ["id", "name", "is_external", "slug", "roles", "participants"]
    label_columns = {
        "id": _("Id"),
        "name": _("Name"),
        "is_external": _("is_external"),
        "slug": _("Slug"),
        "roles": _("Roles"),
        "participants": _("Participants"),
    }
```

Этот миксин определяет заголовки, столбцы для отображения и метки для представлений команд.

### TeamModelView

Класс `TeamModelView` в файле `views.py` наследуется от `TeamMixin` и `SupersetModelView` и предоставляет представление для команд:

```python
class TeamModelView(TeamMixin, SupersetModelView):  # pylint: disable=too-many-ancestors
    route_base = "/onboarding/team"
    datamodel = SQLAInterface(TeamModel)
    class_permission_name = "Team"
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

Этот класс предоставляет методы для отображения списка команд и редактирования команд.

## DODO-специфичные модификации

### Управление командами

Модуль `views/team` позволяет управлять командами в DODO:

1. **Создание команды**:
   - Пользователь может создать новую команду
   - Указать название команды и слаг
   - Указать, является ли команда внешней (франчайзи)
   - Назначить роли команде

2. **Редактирование команды**:
   - Пользователь может изменить название команды
   - Изменить слаг команды
   - Изменить флаг внешней команды
   - Изменить роли команды

3. **Управление участниками команды**:
   - Пользователь может добавлять участников в команду
   - Удалять участников из команды
   - Просматривать список участников команды

### Интеграция с онбордингом

Модуль `views/team` интегрирован с модулем `statement` для поддержки процесса онбординга новых пользователей:

1. **Создание команды при онбординге**:
   - При создании заявки пользователь может выбрать существующую команду или создать новую
   - Если пользователь создает новую команду, то в заявке устанавливается флаг `is_new_team`
   - После одобрения заявки создается новая команда

2. **Добавление пользователя в команду при онбординге**:
   - При одобрении заявки пользователь добавляется в указанную команду
   - Пользователю назначаются роли команды

3. **Управление доступом команды при онбординге**:
   - При одобрении заявки команде могут быть назначены дополнительные роли
   - Эти роли определяют уровень доступа команды к ресурсам системы

### Роли и разрешения

Модуль `views/team` позволяет управлять ролями и разрешениями команд:

1. **Роли команды**:
   - Команда может иметь несколько ролей
   - Роли определяют уровень доступа команды к ресурсам системы
   - В DODO определены следующие специфичные роли:
     - `CHECK_DATA` (readonly) - роль для команд, которым нужен только доступ на чтение
     - `CREATE_DATA` (Create data) - роль для команд, которым нужен доступ на создание данных
     - `VIZUALIZE_DATA` (Vizualize data) - роль для команд, которым нужен доступ на создание визуализаций

2. **Наследование ролей**:
   - Участники команды наследуют роли команды
   - При добавлении пользователя в команду ему назначаются роли команды
   - При изменении ролей команды роли участников также обновляются

3. **Управление доступом на основе команд**:
   - Доступ к ресурсам системы (дашборды, графики, базы данных) может быть ограничен на основе принадлежности к команде
   - Ресурсы могут быть привязаны к командам с помощью тегов
   - Пользователи видят только ресурсы, к которым у их команды есть доступ

## Процесс работы с командами

Процесс работы с командами в DODO включает следующие шаги:

1. **Создание команды**:
   - Пользователь создает новую команду через API или интерфейс
   - Указывает название команды и слаг
   - Указывает, является ли команда внешней (франчайзи)
   - Назначает роли команде
   - Команда сохраняется в базе данных

2. **Просмотр команд**:
   - Пользователь просматривает список команд
   - Может фильтровать команды по различным параметрам (название, флаг внешней команды)
   - Может просматривать детальную информацию о команде

3. **Редактирование команды**:
   - Пользователь открывает команду для редактирования
   - Может изменить название команды, слаг, флаг внешней команды и роли
   - Изменения сохраняются в базе данных

4. **Управление участниками команды**:
   - Пользователь может добавлять участников в команду
   - Может удалять участников из команды
   - При добавлении участника ему назначаются роли команды

## Техническая реализация

### TeamMixin

```python
class TeamMixin:  # pylint: disable=too-few-public-methods
    list_title = _("Team")
    show_title = _("Show Team")
    add_title = _("Add Team")
    edit_title = _("Edit Team")

    list_columns = ["id", "name", "is_external", "slug", "roles", "participants"]
    label_columns = {
        "id": _("Id"),
        "name": _("Name"),
        "is_external": _("is_external"),
        "slug": _("Slug"),
        "roles": _("Roles"),
        "participants": _("Participants"),
    }
```

### TeamModelView

```python
class TeamModelView(TeamMixin, SupersetModelView):  # pylint: disable=too-many-ancestors
    route_base = "/onboarding/team"
    datamodel = SQLAInterface(TeamModel)
    class_permission_name = "Team"
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

### TeamRestApi

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

    @expose("/<pk>", methods=("GET",))
    @protect()
    @safe
    @statsd_metrics
    # pylint: disable=arguments-differ
    def get(self, pk: int) -> Response:
        """Get a Team by id
        ---
        get:
          description: >-
            Get a Team by id.
          parameters:
            - in: path
              schema:
                type: integer
              name: pk
              description: The team id
          responses:
            200:
              description: Team information
              content:
                application/json:
                  schema:
                    type: object
                    properties:
                      id:
                        type: number
                      result:
                        $ref: '#/components/schemas/{{self.__class__.__name__}}.get'
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
            team = TeamDAO().find_by_id(pk)
            return self.response(201, result=self.get_model_schema.dump(team))
        except TeamNotFoundError:
            return self.response_404()
```

## Примеры использования

### Получение списка команд

```python
from superset.models.team import Team
from superset import db

# Получение всех команд
teams = db.session.query(Team).all()

# Вывод информации о командах
for team in teams:
    print(f"ID: {team.id}, Name: {team.name}")
    print(f"Slug: {team.slug}")
    print(f"Is External: {team.is_external}")
    print(f"Roles: {[role.name for role in team.roles]}")
    print(f"Participants: {[user.username for user in team.participants]}")
```

### Создание команды

```python
from superset.commands.team.create import CreateTeamCommand
from superset import db
from superset.security.manager import get_user_roles

# Получение ролей
roles = get_user_roles("readonly", "Create data")

# Создание команды
item = {
    "name": "My Team",
    "slug": "my-team",
    "is_external": False,
    "roles": roles,
}

# Выполнение команды создания команды
CreateTeamCommand(item).run()
```

### Получение команды

```python
from superset.daos.team import TeamDAO

# Получение команды по ID
team = TeamDAO.find_by_id(1)

# Вывод информации о команде
print(f"ID: {team.id}, Name: {team.name}")
print(f"Slug: {team.slug}")
print(f"Is External: {team.is_external}")
print(f"Roles: {[role.name for role in team.roles]}")
print(f"Participants: {[user.username for user in team.participants]}")
```

### Обновление команды

```python
from superset.commands.team.update import UpdateTeamCommand
from superset.security.manager import get_user_roles

# Получение ролей
roles = get_user_roles("readonly", "Create data", "Vizualize data")

# Обновление команды
item = {
    "name": "Updated Team Name",
    "slug": "updated-team-slug",
    "is_external": True,
    "roles": roles,
}

# Выполнение команды обновления команды
UpdateTeamCommand(1, item).run()
```

### Добавление пользователя в команду

```python
from superset.commands.team.update import UpdateTeamCommand
from superset import db
from superset.models.core import User

# Получение пользователя
user = db.session.query(User).get(1)

# Добавление пользователя в команду
UpdateTeamCommand(1, {"participants": [user]}, "add_user").run()
```

### Удаление пользователя из команды

```python
from superset.commands.team.update import UpdateTeamCommand
from superset import db
from superset.models.core import User

# Получение пользователя
user = db.session.query(User).get(1)

# Удаление пользователя из команды
UpdateTeamCommand(1, {"participants": [user]}, "remove_user").run()
```

### Использование в DODO

В DODO модуль `views/team` используется для управления командами и поддержки процесса онбординга новых пользователей. Примеры использования:

1. **Создание команды**:
   ```typescript
   import { SupersetClient } from '@superset-ui/core';
   import { UserFromEnum } from '../types';
   import { getTeamName } from '../utils/getTeamName';
   import { getTeamSlug } from '../utils/getTeamSlug';

   // Создание команды
   const createTeam = async (name: string, userFrom: UserFromEnum, roles: string[]) => {
     const teamName = getTeamName(name, userFrom);
     const teamSlug = getTeamSlug(name);

     const response = await SupersetClient.post({
       url: '/api/v1/team/',
       body: JSON.stringify({
         is_external: userFrom === UserFromEnum.Franchisee ? 1 : 0,
         name: teamName,
         slug: teamSlug,
         roles: roles,
       }),
       headers: { 'Content-Type': 'application/json' },
     });

     return response.json();
   };
   ```

2. **Получение списка команд**:
   ```typescript
   import { SupersetClient } from '@superset-ui/core';
   import rison from 'rison';
   import { Team, UserFromEnum } from '../types';
   import { getRoleFromString } from '../utils/getRoleFromString';

   // Получение списка команд
   const getTeams = async (search: string, isExternal: boolean) => {
     const filters = [];
     if (search) {
       filters.push({ col: 'name', opr: 'ct_name', value: search });
     }
     if (isExternal !== undefined) {
       filters.push({ col: 'is_external', opr: 'eq_external', value: isExternal });
     }

     const queryParams = rison.encode({
       filters,
     });

     const response = await SupersetClient.get({
       url: `/api/v1/team/?q=${queryParams}`,
       headers: { 'Content-Type': 'application/json' },
     });

     const result = await response.json();
     return result.result.map(team => ({
       value: team.slug,
       label: team.name,
       roles: team.roles.map(role => getRoleFromString(role)),
     }));
   };
   ```

3. **Добавление пользователя в команду**:
   ```typescript
   import { SupersetClient } from '@superset-ui/core';

   // Добавление пользователя в команду
   const addUserToTeam = async (userId: number, teamId: number) => {
     const response = await SupersetClient.post({
       url: '/api/v1/team/add_user',
       body: JSON.stringify({
         user_id: userId,
         team_id: teamId,
       }),
       headers: { 'Content-Type': 'application/json' },
     });

     return response.json();
   };
   ```
