# Документация по модулю User в DODO

## Содержание

1. [Введение](#введение)
2. [Архитектура](#архитектура)
3. [Основные компоненты](#основные-компоненты)
   - [API для пользователей](#api-для-пользователей)
   - [Фильтры](#фильтры)
   - [Схемы](#схемы)
4. [DODO-специфичные модификации](#dodo-специфичные-модификации)
   - [Модель UserInfo](#модель-userinfo)
   - [Интеграция с онбордингом](#интеграция-с-онбордингом)
   - [Интеграция с командами](#интеграция-с-командами)
5. [Процесс работы с пользователями](#процесс-работы-с-пользователями)
6. [Техническая реализация](#техническая-реализация)
7. [Примеры использования](#примеры-использования)

## Введение

Модуль `user` в Superset - это DODO-специфичный модуль, который был добавлен для расширения стандартной функциональности работы с пользователями. Он предоставляет API для получения информации о пользователях, фильтры для поиска пользователей и схемы для валидации и сериализации данных.

Модуль был добавлен в рамках задачи #32839638 и является полностью DODO-специфичным, то есть отсутствует в стандартной версии Superset.

## Архитектура

Модуль `user` организован следующим образом:

1. **Основные файлы**:
   - `__init__.py` - инициализация модуля
   - `api.py` - API для работы с пользователями
   - `filters.py` - фильтры для пользователей
   - `schemas.py` - схемы для валидации и сериализации данных

2. **Связанные модули**:
   - `models/user_info.py` - модель для хранения дополнительной информации о пользователях
   - `daos/user.py` - DAO для работы с пользователями
   - `daos/user_info.py` - DAO для работы с дополнительной информацией о пользователях
   - `views/users/api.py` - API для работы с пользователями (стандартный Superset)

3. **Фронтенд-компоненты**:
   - `superset-frontend/src/DodoExtensions/onBoarding` - компоненты для онбординга пользователей
   - `superset-frontend/src/DodoExtensions/onBoarding/repository` - репозитории для работы с API пользователей

## Основные компоненты

### API для пользователей

API для работы с пользователями реализовано в файле `api.py` и предоставляет класс `DodoUserRestApi`, который расширяет `BaseSupersetModelRestApi`:

```python
class DodoUserRestApi(BaseSupersetModelRestApi):
    """An api to get information about the user"""

    datamodel = SQLAInterface(User)

    include_route_methods = RouteMethod.REST_MODEL_VIEW_CRUD_SET
    resource_name = "dodo_user"
    allow_browser_login = True

    class_permission_name = "User"
    method_permission_name = MODEL_API_RW_METHOD_PERMISSION_MAP

    search_columns = ("first_name",)

    search_filters = {
        "first_name": [UserNameFilter],
    }

    list_columns = [
        "id",
        "first_name",
        "last_name",
        "teams.name",
        "email",
        "user_info.country_name",
    ]

    user_get_response_schema = UserSchema()
```

Этот класс предоставляет API для получения информации о пользователях, включая их имя, фамилию, команды, электронную почту и страну.

### Фильтры

Фильтры для пользователей реализованы в файле `filters.py`:

```python
class UserNameFilter(BaseFilter):  # pylint: disable=too-few-public-methods
    name = _("first_name")
    arg_name = "usr_name"

    def apply(self, query: Query, value: Any) -> Query:
        if not value:
            return query
        ilike_value = f"%{value}%"
        return query.filter(
            or_(
                User.first_name.ilike(ilike_value),
                User.last_name.ilike(ilike_value),
            )
        )
```

Этот фильтр позволяет искать пользователей по имени или фамилии.

### Схемы

Схемы для валидации и сериализации данных реализованы в файле `schemas.py`:

```python
class TeamSchema(Schema):
    id = fields.Int()
    name = fields.String()


class UserSchema(Schema):
    id = fields.Int()
    username = fields.String()
    first_name = fields.String()
    last_name = fields.String()
    email = fields.String()
    last_login = fields.DateTime()
    created_on = fields.DateTime()
    login_count = fields.Int()
    team = fields.Nested(TeamSchema())
```

Эти схемы используются для валидации и сериализации данных о пользователях и командах.

## DODO-специфичные модификации

### Модель UserInfo

Модель `UserInfo` в файле `models/user_info.py` была расширена для хранения дополнительной информации о пользователях DODO:

```python
class UserInfo(Model):  # pylint: disable=too-few-public-methods
    """Extra info about user"""

    __tablename__ = "user_info"

    id = Column(Integer, primary_key=True)
    is_onboarding_finished = Column(Boolean, default=False)  # DODO added #32839638
    onboarding_started_time = Column(DateTime, nullable=True)  # DODO added #32839638
    language = Column(String(32), default="ru")
    user_id = Column(Integer, ForeignKey("ab_user.id"))
    user = relationship(
        security_manager.user_model,
        backref=backref("user_info", uselist=False, lazy="joined"),
    )
    data_auth_dodo = Column(utils.MediumText())
    country_num = Column(Integer, nullable=True)
    country_name = Column(String, nullable=True)
    dodo_role = Column(String(32), nullable=True)
```

Эта модель содержит следующие DODO-специфичные поля:
- `is_onboarding_finished` - флаг, указывающий, завершил ли пользователь онбординг
- `onboarding_started_time` - время начала онбординга
- `language` - язык пользователя (по умолчанию "ru")
- `data_auth_dodo` - данные авторизации DODO
- `country_num` - номер страны
- `country_name` - название страны
- `dodo_role` - роль пользователя в DODO

### Интеграция с онбордингом

Модуль `user` тесно интегрирован с процессом онбординга новых пользователей в DODO. Он предоставляет API для получения информации о пользователях, которая используется в процессе онбординга.

Интеграция с онбордингом включает:
- Получение информации о пользователе для отображения в интерфейсе онбординга
- Обновление информации о пользователе в процессе онбординга
- Проверка статуса онбординга пользователя

### Интеграция с командами

Модуль `user` интегрирован с модулем `team` для поддержки работы с командами в DODO. Он предоставляет API для получения информации о командах пользователя.

Интеграция с командами включает:
- Получение списка команд пользователя
- Отображение информации о командах пользователя в интерфейсе
- Поиск пользователей по командам

## Процесс работы с пользователями

Процесс работы с пользователями в DODO включает следующие шаги:

1. **Создание пользователя**:
   - Пользователь создается в стандартной системе аутентификации Superset
   - Для пользователя создается запись в таблице `user_info` с дополнительной информацией

2. **Онбординг пользователя**:
   - Пользователь проходит процесс онбординга
   - В процессе онбординга обновляется информация о пользователе
   - После завершения онбординга устанавливается флаг `is_onboarding_finished`

3. **Добавление пользователя в команду**:
   - Пользователь добавляется в команду
   - Команда пользователя отображается в интерфейсе

4. **Поиск пользователей**:
   - Пользователи могут быть найдены по имени, фамилии или команде
   - Результаты поиска отображаются в интерфейсе

## Техническая реализация

### API для получения информации о пользователях

```python
@expose("/", methods=("GET",))
@protect()
@safe
@statsd_metrics
def get_list(self) -> Response:
    """Get list of users
    ---
    get:
      description: >-
        Get a list of users, use Rison or JSON query parameters for filtering,
        sorting, pagination and for selecting specific columns and metadata.
      parameters:
      - in: query
        name: q
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/get_list_schema'
      responses:
        200:
          description: Users
          content:
            application/json:
              schema:
                type: object
                properties:
                  result:
                    type: array
                    items:
                      $ref: '#/components/schemas/{{self.__class__.__name__}}.get_list'
                  count:
                    type: integer
        400:
          $ref: '#/components/responses/400'
        401:
          $ref: '#/components/responses/401'
        422:
          $ref: '#/components/responses/422'
        500:
          $ref: '#/components/responses/500'
    """
    return super().get_list()
```

### Фильтр для поиска пользователей по имени

```python
class UserNameFilter(BaseFilter):  # pylint: disable=too-few-public-methods
    name = _("first_name")
    arg_name = "usr_name"

    def apply(self, query: Query, value: Any) -> Query:
        if not value:
            return query
        ilike_value = f"%{value}%"
        return query.filter(
            or_(
                User.first_name.ilike(ilike_value),
                User.last_name.ilike(ilike_value),
            )
        )
```

### Получение информации о пользователе

```python
@staticmethod
def get_user_info(user_id: int) -> Optional[UserInfo]:
    """
    Get user info by user id
    """
    return db.session.query(UserInfo).filter_by(user_id=user_id).one_or_none()
```

### Обновление информации о пользователе

```python
@staticmethod
def update_user_info(user_id: int, **kwargs: Any) -> None:
    """
    Update user info
    """
    user_info = UserInfoDAO.get_user_info(user_id)
    if user_info:
        for key, value in kwargs.items():
            setattr(user_info, key, value)
        db.session.commit()
```

## Примеры использования

### Получение списка пользователей

```python
from superset.daos.user import UserDAO

# Получение всех пользователей
users = UserDAO.find_all()

# Вывод информации о пользователях
for user in users:
    print(f"ID: {user.id}, Username: {user.username}")
    print(f"Name: {user.first_name} {user.last_name}")
    print(f"Email: {user.email}")
    print(f"Teams: {[team.name for team in user.teams]}")
```

### Получение информации о пользователе

```python
from superset.daos.user import UserDAO
from superset.daos.user_info import UserInfoDAO

# Получение пользователя по ID
user = UserDAO.get_by_id(1)

# Получение дополнительной информации о пользователе
user_info = UserInfoDAO.get_user_info(user.id)

# Вывод информации о пользователе
print(f"ID: {user.id}, Username: {user.username}")
print(f"Name: {user.first_name} {user.last_name}")
print(f"Email: {user.email}")
print(f"Teams: {[team.name for team in user.teams]}")
print(f"Country: {user_info.country_name}")
print(f"DODO Role: {user_info.dodo_role}")
print(f"Onboarding Finished: {user_info.is_onboarding_finished}")
```

### Обновление информации о пользователе

```python
from superset.daos.user_info import UserInfoDAO

# Обновление информации о пользователе
UserInfoDAO.update_user_info(
    user_id=1,
    country_name="Russia",
    dodo_role="Data Analyst",
    is_onboarding_finished=True,
)
```

### Использование в DODO

В DODO модуль `user` используется для работы с пользователями и их дополнительной информацией. Примеры использования:

1. **Получение списка пользователей через API**:
   ```javascript
   // Фронтенд-код для получения списка пользователей
   const filterExps = [
     { col: 'first_name', opr: 'usr_name', value: query },
   ];

   const queryParams = rison.encode_uri({ filters: filterExps });
   const url = `/api/v1/dodo_user/?q=${queryParams}`;

   const response = await SupersetClient.get({
     url,
     headers: { 'Content-Type': 'application/json' },
     parseMethod: null,
   });

   const dto = await response.json();
   return dto.result.map(item => ({
     value: item.id,
     label: `${item.first_name} ${item.last_name} (${item.teams.map(t => t.name).join(', ')}) ${item.email} (${item.user_info.country_name || 'no country'})`,
   }));
   ```

2. **Обновление информации о пользователе в процессе онбординга**:
   ```javascript
   // Фронтенд-код для обновления информации о пользователе
   const response = await SupersetClient.put({
     url: '/api/v1/users/validate_onboarding',
     body: JSON.stringify({
       onboarding_started_time: new Date().toISOString(),
       dodo_role: selectedRole,
     }),
     headers: { 'Content-Type': 'application/json' },
     parseMethod: null,
   });
   ```

3. **Отображение информации о пользователе**:
   ```javascript
   // Фронтенд-код для отображения информации о пользователе
   const { user } = useSelector(getUserInfo);

   return (
     <div>
       <h2>{user.firstName} {user.lastName}</h2>
       <p>Email: {user.email}</p>
       <p>Role in DODO: {user.dodoRole}</p>
       <p>Country: {user.countryName}</p>
       <p>Teams: {user.teams.join(', ')}</p>
     </div>
   );
   ```
