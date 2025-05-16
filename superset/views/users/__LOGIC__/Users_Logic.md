# Документация по представлениям пользователей (Users Views) в DODO

## Содержание

1. [Введение](#введение)
2. [Архитектура](#архитектура)
3. [Основные компоненты](#основные-компоненты)
   - [CurrentUserRestApi](#currentuserrestapi)
   - [UserRestApi](#userrestapi)
   - [Схемы](#схемы)
4. [DODO-специфичные модификации](#dodo-специфичные-модификации)
   - [Онбординг пользователей](#онбординг-пользователей)
   - [Информация о стране пользователя](#информация-о-стране-пользователя)
   - [Локализация](#локализация)
5. [Процесс работы с пользователями](#процесс-работы-с-пользователями)
6. [Техническая реализация](#техническая-реализация)
7. [Примеры использования](#примеры-использования)

## Введение

Модуль `views/users` в Superset отвечает за представления пользователей в пользовательском интерфейсе. Он предоставляет API для получения информации о текущем пользователе, управления пользователями и их аватарами.

В DODO этот модуль был расширен для поддержки процесса онбординга пользователей, хранения информации о стране пользователя и локализации.

## Архитектура

Модуль `views/users` организован следующим образом:

1. **Основные файлы**:
   - `__init__.py` - инициализация модуля
   - `api.py` - API для работы с пользователями
   - `schemas.py` - схемы для валидации и сериализации данных

2. **Связанные модули**:
   - `models/user_info.py` - модель для хранения дополнительной информации о пользователях
   - `daos/user.py` - DAO для работы с пользователями
   - `daos/user_info.py` - DAO для работы с дополнительной информацией о пользователях
   - `user/api.py` - DODO-специфичное API для работы с пользователями

3. **Фронтенд-компоненты**:
   - `superset-frontend/src/DodoExtensions/onBoarding` - компоненты для онбординга пользователей
   - `superset-frontend/src/DodoExtensions/onBoarding/repository` - репозитории для работы с API пользователей

## Основные компоненты

### CurrentUserRestApi

Класс `CurrentUserRestApi` в файле `api.py` наследуется от `BaseSupersetApi` и предоставляет API для получения информации о текущем пользователе:

```python
class CurrentUserRestApi(BaseSupersetApi):
    """An API to get information about the current user"""

    resource_name = "me"
    openapi_spec_tag = "Current User"
    openapi_spec_component_schemas = (UserResponseSchema,)

    @expose("/", methods=("GET",))
    @safe
    def get_me(self) -> Response:
        """Get the user object corresponding to the agent making the request.
        ---
        get:
          summary: Get the current user
          description: >-
            Gets the user object corresponding to the agent making the request,
            or returns a 401 error if the user is unauthenticated.
          responses:
            200:
              description: The current user
              content:
                application/json:
                  schema:
                    type: object
                    properties:
                      result:
                        $ref: '#/components/schemas/UserResponseSchema'
            401:
              $ref: '#/components/responses/401'
        """
        try:
            if g.user is None or g.user.is_anonymous:
                return self.response_401()
        except NoAuthorizationError:
            return self.response_401()
        user = bootstrap_user_data(g.user)
        return self.response(200, result=user)
```

Этот класс предоставляет методы для получения информации о текущем пользователе, его ролях, статусе онбординга и стране.

### UserRestApi

Класс `UserRestApi` в файле `api.py` наследуется от `BaseSupersetApi` и предоставляет API для получения информации о пользователях:

```python
class UserRestApi(BaseSupersetApi):
    """An API to get information about users"""

    resource_name = "user"
    openapi_spec_tag = "User"
    openapi_spec_component_schemas = (UserResponseSchema,)

    @expose("/<int:user_id>/avatar.png", methods=("GET",))
    @safe
    def avatar(self, user_id: int) -> Response:
        """Get a redirect to the avatar's URL for the user with the given ID.
        ---
        get:
          summary: Get the user avatar
          description: >-
            Gets the avatar URL for the user with the given ID, or returns a 401 error
            if the user is unauthenticated.
          parameters:
            - in: path
              name: user_id
              required: true
              description: The ID of the user
              schema:
                type: string
          responses:
            301:
              description: A redirect to the user's avatar URL
            401:
              $ref: '#/components/responses/401'
            404:
              $ref: '#/components/responses/404'
        """
        avatar_url = None
        try:
            user = UserDAO.get_by_id(user_id)
        except NoResultFound:
            return self.response_404()

        if not user:
            return self.response_404()

        # fetch from the one-to-one relationship
        if len(user.extra_attributes) > 0:
            avatar_url = user.extra_attributes[0].avatar_url
        slack_token = app.config.get("SLACK_API_TOKEN")
        if (
            not avatar_url
            and slack_token
            and is_feature_enabled("SLACK_ENABLE_AVATARS")
        ):
            try:
                # Fetching the avatar url from slack
                avatar_url = get_user_avatar(user.email)
            except SlackClientError:
                return self.response_404()

            UserDAO.set_avatar_url(user, avatar_url)

        # Return a permanent redirect to the avatar URL
        if avatar_url:
            return redirect(avatar_url, code=301)

        # No avatar found, return a "no-content" response
        return Response(status=204)
```

Этот класс предоставляет методы для получения аватара пользователя.

### Схемы

Файл `schemas.py` содержит схемы для валидации и сериализации данных пользователей:

```python
class StatementSchema(Schema):
    id = Integer()
    finished = Boolean()


class UserResponseSchema(Schema):
    id = Integer()
    username = String()
    email = String()
    first_name = String()
    last_name = String()
    is_active = Boolean()
    is_anonymous = Boolean()
    is_onboarding_finished = Boolean(missing=True)
    onboarding_started_time = Boolean(missing=True)
    dodo_role = String(missing=True)
    team = String(missing=True)
    statements = List(Nested(StatementSchema()), missing=True)
    country_name = String(missing=True)


class ValidateOnboardingPutSchema(Schema):
    onboarding_started_time = DateTime()
    dodo_role = String()
```

Эти схемы используются для валидации и сериализации данных пользователей.

## DODO-специфичные модификации

### Онбординг пользователей

В DODO была добавлена поддержка процесса онбординга пользователей:

1. **Получение статуса онбординга**:
   - Добавлен метод `get_onboarding` в класс `CurrentUserRestApi` для получения статуса онбординга пользователя
   - Добавлены поля `is_onboarding_finished` и `onboarding_started_time` в схему `UserResponseSchema`
   - Файл: `api.py`

   ```python
   @expose("/onboarding", ("GET",))
   def get_onboarding(self) -> Response:
       try:
           user = g.user
           if user is None or user.is_anonymous:
               return self.response_401()
       except NoAuthorizationError:
           return self.response_401()
       user_onboarding = UserInfoDAO.get_onboarding()
       result = {
           "id": user.id,
           "email": user.email,
           "first_name": user.first_name,
           "last_name": user.last_name,
           "is_onboarding_finished": user_onboarding.get("is_onboarding_finished"),
           "onboarding_started_time": user_onboarding.get("onboarding_started_time"),
       }
       return self.response(200, result=user_response_schema.dump(result))
   ```

2. **Обновление статуса онбординга**:
   - Добавлен метод `put_onboarding` в класс `CurrentUserRestApi` для обновления статуса онбординга пользователя
   - Добавлена схема `ValidateOnboardingPutSchema` для валидации данных
   - Файл: `api.py`

   ```python
   @expose("/onboarding", ("PUT",))
   def put_onboarding(self) -> Response:
       try:
           user = g.user
           item = ValidateOnboardingPutSchema().load(request.json)
           if user is None or user.is_anonymous:
               return self.response_401()
       except NoAuthorizationError:
           return self.response_401()
       except ValidationError as error:
           logger.warning("validate data failed to add new dashboard")
           return self.response_400(message=error.messages)

       dodo_role = item.get("dodo_role")
       onboarding_started_time = item.get("onboarding_started_time")
       update_user_onboarding = UserInfoDAO.update_onboarding(
           dodo_role, onboarding_started_time
       )
       return self.response(200, result=update_user_onboarding)
   ```

### Информация о стране пользователя

В DODO была добавлена поддержка хранения информации о стране пользователя:

1. **Получение страны пользователя**:
   - Добавлен метод `my_country` в класс `CurrentUserRestApi` для получения страны пользователя
   - Добавлено поле `country_name` в схему `UserResponseSchema`
   - Файл: `api.py`

   ```python
   @expose("/country", ("GET",))  # страна пользователя, получаем в профиле
   def my_country(self) -> Response:
       try:
           user = g.user
           if user is None or user.is_anonymous:
               return self.response_401()
       except NoAuthorizationError:
           return self.response_401()
       except ValidationError as error:
           logger.warning("validate data failed to add new dashboard")
           return self.response_400(message=error.messages)
       result = {
           "id": user.id,
           "email": user.email,
           "first_name": user.first_name,
           "last_name": user.last_name,
       }
       if country := UserInfoDAO.get_country_by_user_id():
           result["country_name"] = country[0].country_name
       else:
           result["country_name"] = None
       return self.response(200, result=user_response_schema.dump(result))
   ```

### Локализация

В DODO была добавлена поддержка локализации:

1. **Валидация языка**:
   - Добавлена функция `validate_language` для проверки поддерживаемых языков
   - Задача: #33835937
   - Файл: `api.py`

   ```python
   def validate_language(lang: str) -> bool:  # DODO changed #33835937
       languages = app.config["LANGUAGES"]
       keys_of_languages = languages.keys()
       return lang in keys_of_languages
   ```

## Процесс работы с пользователями

Процесс работы с пользователями в DODO включает следующие шаги:

1. **Регистрация пользователя**:
   - Пользователь регистрируется в системе
   - Создается запись в таблице `ab_user`

2. **Онбординг пользователя**:
   - Пользователь проходит процесс онбординга
   - Выбирает роль в DODO
   - Создает заявку на получение доступа к системе
   - После одобрения заявки пользователь получает доступ к системе

3. **Управление профилем пользователя**:
   - Пользователь может просматривать и редактировать свой профиль
   - Может просматривать информацию о своей стране
   - Может просматривать свои роли и команды

4. **Получение аватара пользователя**:
   - Система может получать аватар пользователя из Slack
   - Аватар отображается в интерфейсе системы

## Техническая реализация

### CurrentUserRestApi

```python
class CurrentUserRestApi(BaseSupersetApi):
    """An API to get information about the current user"""

    resource_name = "me"
    openapi_spec_tag = "Current User"
    openapi_spec_component_schemas = (UserResponseSchema,)

    @expose("/", methods=("GET",))
    @safe
    def get_me(self) -> Response:
        """Get the user object corresponding to the agent making the request.
        ---
        get:
          summary: Get the current user
          description: >-
            Gets the user object corresponding to the agent making the request,
            or returns a 401 error if the user is unauthenticated.
          responses:
            200:
              description: The current user
              content:
                application/json:
                  schema:
                    type: object
                    properties:
                      result:
                        $ref: '#/components/schemas/UserResponseSchema'
            401:
              $ref: '#/components/responses/401'
        """
        try:
            if g.user is None or g.user.is_anonymous:
                return self.response_401()
        except NoAuthorizationError:
            return self.response_401()
        user = bootstrap_user_data(g.user)
        return self.response(200, result=user)

    @expose("/roles/", methods=("GET",))
    @safe
    def get_my_roles(self) -> Response:
        """Get the user roles corresponding to the agent making the request.
        ---
        get:
          summary: Get the user roles
          description: >-
            Gets the user roles corresponding to the agent making the request,
            or returns a 401 error if the user is unauthenticated.
          responses:
            200:
              description: The current user
              content:
                application/json:
                  schema:
                    type: object
                    properties:
                      result:
                        $ref: '#/components/schemas/UserResponseSchema'
            401:
              $ref: '#/components/responses/401'
        """
        try:
            if g.user is None or g.user.is_anonymous:
                return self.response_401()
        except NoAuthorizationError:
            return self.response_401()
        user = bootstrap_user_data(g.user, include_perms=True)
        return self.response(200, result=user)

    @expose("/onboarding", ("GET",))
    def get_onboarding(self) -> Response:
        try:
            user = g.user
            if user is None or user.is_anonymous:
                return self.response_401()
        except NoAuthorizationError:
            return self.response_401()
        user_onboarding = UserInfoDAO.get_onboarding()
        result = {
            "id": user.id,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "is_onboarding_finished": user_onboarding.get("is_onboarding_finished"),
            "onboarding_started_time": user_onboarding.get("onboarding_started_time"),
        }
        return self.response(200, result=user_response_schema.dump(result))

    @expose("/onboarding", ("PUT",))
    def put_onboarding(self) -> Response:
        try:
            user = g.user
            item = ValidateOnboardingPutSchema().load(request.json)
            if user is None or user.is_anonymous:
                return self.response_401()
        except NoAuthorizationError:
            return self.response_401()
        except ValidationError as error:
            logger.warning("validate data failed to add new dashboard")
            return self.response_400(message=error.messages)

        dodo_role = item.get("dodo_role")
        onboarding_started_time = item.get("onboarding_started_time")
        update_user_onboarding = UserInfoDAO.update_onboarding(
            dodo_role, onboarding_started_time
        )
        return self.response(200, result=update_user_onboarding)

    @expose("/country", ("GET",))  # страна пользователя, получаем в профиле
    def my_country(self) -> Response:
        try:
            user = g.user
            if user is None or user.is_anonymous:
                return self.response_401()
        except NoAuthorizationError:
            return self.response_401()
        except ValidationError as error:
            logger.warning("validate data failed to add new dashboard")
            return self.response_400(message=error.messages)
        result = {
            "id": user.id,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
        }
        if country := UserInfoDAO.get_country_by_user_id():
            result["country_name"] = country[0].country_name
        else:
            result["country_name"] = None
        return self.response(200, result=user_response_schema.dump(result))
```

### UserRestApi

```python
class UserRestApi(BaseSupersetApi):
    """An API to get information about users"""

    resource_name = "user"
    openapi_spec_tag = "User"
    openapi_spec_component_schemas = (UserResponseSchema,)

    @expose("/<int:user_id>/avatar.png", methods=("GET",))
    @safe
    def avatar(self, user_id: int) -> Response:
        """Get a redirect to the avatar's URL for the user with the given ID.
        ---
        get:
          summary: Get the user avatar
          description: >-
            Gets the avatar URL for the user with the given ID, or returns a 401 error
            if the user is unauthenticated.
          parameters:
            - in: path
              name: user_id
              required: true
              description: The ID of the user
              schema:
                type: string
          responses:
            301:
              description: A redirect to the user's avatar URL
            401:
              $ref: '#/components/responses/401'
            404:
              $ref: '#/components/responses/404'
        """
        avatar_url = None
        try:
            user = UserDAO.get_by_id(user_id)
        except NoResultFound:
            return self.response_404()

        if not user:
            return self.response_404()

        # fetch from the one-to-one relationship
        if len(user.extra_attributes) > 0:
            avatar_url = user.extra_attributes[0].avatar_url
        slack_token = app.config.get("SLACK_API_TOKEN")
        if (
            not avatar_url
            and slack_token
            and is_feature_enabled("SLACK_ENABLE_AVATARS")
        ):
            try:
                # Fetching the avatar url from slack
                avatar_url = get_user_avatar(user.email)
            except SlackClientError:
                return self.response_404()

            UserDAO.set_avatar_url(user, avatar_url)

        # Return a permanent redirect to the avatar URL
        if avatar_url:
            return redirect(avatar_url, code=301)

        # No avatar found, return a "no-content" response
        return Response(status=204)
```

### Схемы

```python
class StatementSchema(Schema):
    id = Integer()
    finished = Boolean()


class UserResponseSchema(Schema):
    id = Integer()
    username = String()
    email = String()
    first_name = String()
    last_name = String()
    is_active = Boolean()
    is_anonymous = Boolean()
    is_onboarding_finished = Boolean(missing=True)
    onboarding_started_time = Boolean(missing=True)
    dodo_role = String(missing=True)
    team = String(missing=True)
    statements = List(Nested(StatementSchema()), missing=True)
    country_name = String(missing=True)


class ValidateOnboardingPutSchema(Schema):
    onboarding_started_time = DateTime()
    dodo_role = String()
```

## Примеры использования

### Получение информации о текущем пользователе

```python
from flask import g
from superset.views.utils import bootstrap_user_data

# Получение информации о текущем пользователе
user = g.user
user_data = bootstrap_user_data(user)

# Вывод информации о пользователе
print(f"ID: {user_data['id']}")
print(f"Username: {user_data['username']}")
print(f"Email: {user_data['email']}")
print(f"First Name: {user_data['first_name']}")
print(f"Last Name: {user_data['last_name']}")
```

### Получение статуса онбординга пользователя

```python
from superset.daos.user_info import UserInfoDAO

# Получение статуса онбординга пользователя
user_onboarding = UserInfoDAO.get_onboarding()

# Вывод информации о статусе онбординга
print(f"Is Onboarding Finished: {user_onboarding.get('is_onboarding_finished')}")
print(f"Onboarding Started Time: {user_onboarding.get('onboarding_started_time')}")
print(f"DODO Role: {user_onboarding.get('dodo_role')}")
```

### Обновление статуса онбординга пользователя

```python
from superset.daos.user_info import UserInfoDAO
from datetime import datetime

# Обновление статуса онбординга пользователя
dodo_role = "readonly"
onboarding_started_time = datetime.utcnow()
update_user_onboarding = UserInfoDAO.update_onboarding(
    dodo_role, onboarding_started_time
)

# Вывод информации о статусе онбординга
print(f"Is Onboarding Finished: {update_user_onboarding.get('is_onboarding_finished')}")
print(f"Onboarding Started Time: {update_user_onboarding.get('onboarding_started_time')}")
print(f"DODO Role: {update_user_onboarding.get('dodo_role')}")
```

### Получение страны пользователя

```python
from superset.daos.user_info import UserInfoDAO

# Получение страны пользователя
country = UserInfoDAO.get_country_by_user_id()

# Вывод информации о стране пользователя
if country:
    print(f"Country Name: {country[0].country_name}")
else:
    print("Country Name: None")
```

### Получение аватара пользователя

```python
from superset.daos.user import UserDAO
from superset.utils.slack import get_user_avatar

# Получение пользователя
user = UserDAO.get_by_id(1)

# Получение аватара пользователя из Slack
try:
    avatar_url = get_user_avatar(user.email)
    UserDAO.set_avatar_url(user, avatar_url)
    print(f"Avatar URL: {avatar_url}")
except Exception as e:
    print(f"Error getting avatar: {e}")
```

### Использование в DODO

В DODO модуль `views/users` используется для поддержки процесса онбординга пользователей и управления их профилями. Примеры использования:

1. **Получение информации о пользователе**:
   ```typescript
   import { SupersetClient } from '@superset-ui/core';

   // Получение информации о текущем пользователе
   const response = await SupersetClient.get({
     url: '/api/v1/me/',
     headers: { 'Content-Type': 'application/json' },
   });

   const user = await response.json();
   console.log('User:', user.result);
   ```

2. **Получение статуса онбординга пользователя**:
   ```typescript
   import { SupersetClient } from '@superset-ui/core';

   // Получение статуса онбординга пользователя
   const response = await SupersetClient.get({
     url: '/api/v1/me/onboarding',
     headers: { 'Content-Type': 'application/json' },
   });

   const onboarding = await response.json();
   console.log('Onboarding Status:', onboarding.result);
   ```

3. **Обновление статуса онбординга пользователя**:
   ```typescript
   import { SupersetClient } from '@superset-ui/core';

   // Обновление статуса онбординга пользователя
   const response = await SupersetClient.put({
     url: '/api/v1/me/onboarding',
     body: JSON.stringify({
       dodo_role: 'readonly',
       onboarding_started_time: new Date().toISOString(),
     }),
     headers: { 'Content-Type': 'application/json' },
   });

   const result = await response.json();
   console.log('Onboarding Updated:', result.result);
   ```

4. **Получение страны пользователя**:
   ```typescript
   import { SupersetClient } from '@superset-ui/core';

   // Получение страны пользователя
   const response = await SupersetClient.get({
     url: '/api/v1/me/country',
     headers: { 'Content-Type': 'application/json' },
   });

   const result = await response.json();
   console.log('Country:', result.result.country_name);
   ```
