# Документация по основным компонентам представлений (Views) в DODO

## Содержание

1. [Введение](#введение)
2. [Архитектура](#архитектура)
3. [Основные компоненты](#основные-компоненты)
   - [BaseSupersetView](#basesupersetview)
   - [SupersetModelView](#supersetmodelview)
   - [BaseSupersetApi](#basesupersetapi)
   - [BaseSupersetModelRestApi](#basesupersetmodelrestapi)
   - [Декораторы](#декораторы)
   - [Фильтры](#фильтры)
4. [DODO-специфичные модификации](#dodo-специфичные-модификации)
   - [Локализация](#локализация)
   - [API-обработчик](#api-обработчик)
5. [Процесс работы с представлениями](#процесс-работы-с-представлениями)
6. [Техническая реализация](#техническая-реализация)
7. [Примеры использования](#примеры-использования)

## Введение

Модуль `views` в Superset содержит базовые классы и функции для создания представлений (views) в пользовательском интерфейсе. Он предоставляет основу для всех остальных представлений в Superset, включая представления для дашбордов, графиков, баз данных и других компонентов.

В DODO этот модуль был расширен для поддержки локализации и дополнительных API-функций.

## Архитектура

Модуль `views` организован следующим образом:

1. **Основные файлы**:
   - `__init__.py` - инициализация модуля
   - `base.py` - базовые классы для представлений
   - `base_api.py` - базовые классы для API
   - `core.py` - основные представления
   - `utils.py` - утилиты для представлений
   - `filters.py` - фильтры для представлений
   - `error_handling.py` - обработка ошибок

2. **Подмодули**:
   - `views/chart` - представления для графиков
   - `views/dashboard` - представления для дашбордов
   - `views/database` - представления для баз данных
   - `views/datasource` - представления для источников данных
   - `views/sql_lab` - представления для SQL Lab
   - `views/statement` - представления для заявок (DODO-специфичный)
   - `views/team` - представления для команд (DODO-специфичный)
   - `views/users` - представления для пользователей

3. **Фронтенд-компоненты**:
   - `superset-frontend/src/views` - компоненты для отображения представлений
   - `superset-frontend/src/DodoExtensions` - DODO-специфичные расширения

## Основные компоненты

### BaseSupersetView

Класс `BaseSupersetView` в файле `base.py` наследуется от `BaseView` из Flask-AppBuilder и предоставляет базовую функциональность для всех представлений в Superset:

```python
class BaseSupersetView(BaseView):
    @staticmethod
    def json_response(obj: Any, status: int = 200) -> FlaskResponse:
        return Response(
            json.dumps(obj, default=json.json_int_dttm_ser, ignore_nan=True),
            status=status,
            mimetype="application/json",
        )

    def render_app_template(
        self, extra_bootstrap_data: dict[str, Any] | None = None
    ) -> FlaskResponse:
        payload = {
            "user": bootstrap_user_data(g.user, include_perms=True),
            "common": common_bootstrap_payload(),
            **(extra_bootstrap_data or {}),
        }
        return self.render_template(
            "superset/spa.html",
            entry="spa",
            bootstrap_data=json.dumps(
                payload, default=json.pessimistic_json_iso_dttm_ser
            ),
        )
```

Этот класс предоставляет методы для создания JSON-ответов и рендеринга шаблонов приложения.

### SupersetModelView

Класс `SupersetModelView` в файле `base.py` наследуется от `ModelView` из Flask-AppBuilder и предоставляет базовую функциональность для представлений моделей в Superset:

```python
class SupersetModelView(ModelView):
    page_size = 100
    list_widget = SupersetListWidget

    def render_app_template(self) -> FlaskResponse:
        payload = {
            "user": bootstrap_user_data(g.user, include_perms=True),
            "common": common_bootstrap_payload(),
        }
        return self.render_template(
            "superset/spa.html",
            entry="spa",
            bootstrap_data=json.dumps(
                payload, default=json.pessimistic_json_iso_dttm_ser
            ),
        )
```

Этот класс предоставляет методы для отображения моделей в пользовательском интерфейсе.

### BaseSupersetApi

Класс `BaseSupersetApi` в файле `base_api.py` наследуется от `BaseSupersetApiMixin` и `BaseApi` из Flask-AppBuilder и предоставляет базовую функциональность для API в Superset:

```python
class BaseSupersetApi(BaseSupersetApiMixin, BaseApi):
    pass
```

Этот класс предоставляет методы для создания API-эндпоинтов.

### BaseSupersetModelRestApi

Класс `BaseSupersetModelRestApi` в файле `base_api.py` наследуется от `BaseSupersetApiMixin` и `ModelRestApi` из Flask-AppBuilder и предоставляет базовую функциональность для REST API моделей в Superset:

```python
class BaseSupersetModelRestApi(BaseSupersetApiMixin, ModelRestApi):
    """
    Extends FAB's ModelResApi to implement specific superset generic functionality
    """

    method_permission_name = {
        "bulk_delete": "delete",
        "data": "list",
        "data_from_cache": "list",
        "delete": "delete",
        "distinct": "list",
        "export": "mulexport",
        "import_": "add",
        "get": "show",
        "get_list": "list",
        "info": "list",
        "post": "add",
        "put": "edit",
        "refresh": "edit",
        "related": "list",
        "related_objects": "list",
        "schemas": "list",
        "select_star": "list",
        "table_metadata": "list",
        "test_connection": "post",
        "thumbnail": "list",
        "viz_types": "list",
    }
```

Этот класс предоставляет методы для создания REST API для моделей.

### Декораторы

Модуль `views` содержит несколько декораторов для обработки запросов:

1. **api**:
   - Декоратор для обозначения эндпоинта как API
   - Обрабатывает исключения и возвращает ответ в формате JSON
   - Файл: `base.py`

   ```python
   def api(f: Callable[..., FlaskResponse]) -> Callable[..., FlaskResponse]:
       """
       A decorator to label an endpoint as an API. Catches uncaught exceptions and
       return the response in the JSON format
       """

       def wraps(self: BaseSupersetView, *args: Any, **kwargs: Any) -> FlaskResponse:
           try:
               return f(self, *args, **kwargs)
           except NoAuthorizationError:
               logger.warning("Api failed- no authorization", exc_info=True)
               return json_error_response(get_error_msg(), status=401)
           except Exception as ex:  # pylint: disable=broad-except
               logger.exception(ex)
               return json_error_response(get_error_msg())

       return functools.update_wrapper(wraps, f)
   ```

2. **requires_json**:
   - Декоратор для проверки, что запрос имеет формат JSON
   - Файл: `base_api.py`

   ```python
   def requires_json(f: Callable[..., Any]) -> Callable[..., Any]:
       """
       Require JSON-like formatted request to the REST API
       """

       def wraps(self: BaseSupersetModelRestApi, *args: Any, **kwargs: Any) -> Response:
           if not request.is_json:
               raise InvalidPayloadFormatError(message="Request is not JSON")
           return f(self, *args, **kwargs)

       return functools.update_wrapper(wraps, f)
   ```

3. **statsd_metrics**:
   - Декоратор для отправки метрик в statsd
   - Файл: `base_api.py`

   ```python
   def statsd_metrics(f: Callable[..., Any]) -> Callable[..., Any]:
       """
       Handle sending all statsd metrics from the REST API
       """

       def wraps(self: BaseSupersetApiMixin, *args: Any, **kwargs: Any) -> Response:
           func_name = f.__name__
           try:
               duration, response = time_function(f, self, *args, **kwargs)
           except Exception as ex:
               if hasattr(ex, "status") and ex.status < 500:  # pylint: disable=no-member
                   self.incr_stats("warning", func_name)
               else:
                   self.incr_stats("error", func_name)
               raise

           self.send_stats_metrics(response, func_name, duration)
           return response

       return functools.update_wrapper(wraps, f)
   ```

### Фильтры

Модуль `views` содержит несколько фильтров для ограничения доступа к данным:

1. **DatasourceFilter**:
   - Фильтр для ограничения доступа к источникам данных
   - Файл: `base.py`

   ```python
   class DatasourceFilter(BaseFilter):  # pylint: disable=too-few-public-methods
       def apply(self, query: Query, value: Any) -> Query:
           if security_manager.can_access_all_datasources():
               return query
           query = query.join(
               models.Database,
               models.Database.id == self.model.database_id,
           )
           return query.filter(get_dataset_access_filters(self.model))
   ```

2. **RelatedFieldFilter**:
   - Фильтр для связанных полей
   - Файл: `base_api.py`

   ```python
   class RelatedFieldFilter:
       """
       Filter for related fields, uses the related model filters
       """

       def __init__(
           self,
           datamodel: SQLAInterface,
           related_field_name: str,
           related_filter: BaseFilter,
       ) -> None:
           self.datamodel = datamodel
           self.related_field_name = related_field_name
           self.related_filter = related_filter

       def apply(self, query: Query, value: Any) -> Query:
           related_model = self.datamodel.get_related_model(self.related_field_name)
           related_datamodel = SQLAInterface(related_model, self.datamodel.session)
           return self.related_filter(  # pylint: disable=not-callable
               self.related_field_name, related_datamodel
           ).apply(query, value)
   ```

## DODO-специфичные модификации

### Локализация

В DODO была добавлена поддержка локализации:

1. **Локализация общих данных**:
   - Модифицирована функция `common_bootstrap_payload` для поддержки локализации
   - Задача: #33835937
   - Файл: `base.py`

   ```python
   def common_bootstrap_payload() -> dict[str, Any]:  # DODO changed #33835937
       return {
           **cached_common_bootstrap_data(utils.get_user_id(), None),
           "flash_messages": get_flashed_messages(with_categories=True),
       }
   ```

### API-обработчик

В DODO был добавлен специальный API-обработчик для работы с API Superset:

1. **ApiHandler**:
   - Класс для обработки API-запросов
   - Задача: #44611022
   - Файл: `superset-frontend/packages/superset-ui-core/src/DodoExtensions/api/index.ts`

   ```typescript
   // DODO was here
   // DODO created 44611022
   import axios, {
     AxiosHeaders,
     AxiosRequestConfig,
     AxiosRequestHeaders,
     ResponseType,
   } from 'axios';
   import { API_V1, SUPERSET_ENDPOINT } from './constants';
   import { logger, handleCsrfToken } from './utils';
   import { PlainObject } from '../../chart';

   export { API_V1, SUPERSET_ENDPOINT };

   type Payload = PlainObject | string | null;

   type AuthType = {
     Authorization: string;
     'x-csrftoken': string;
     token: string;
     csrfToken: string;
   };
   type ConfigType = {
     ORIGIN_URL: string;
     ENV: string;
     CREDS: {
       username: string;
       password: string;
       provider: string;
     };
     FRONTEND_LOGGER: boolean;
   };

   class ApiHandler {
     private auth: AuthType;

     private config: ConfigType;

     constructor(initialConfig?: Partial<ConfigType>) {
       this.auth = {
         Authorization: '',
         'x-csrftoken': '',
         token: '',
         csrfToken: '',
       };

       this.config = {
         ORIGIN_URL: '',
         ENV: '',
         CREDS: {
           username: '',
           password: '',
           provider: '',
         },
         FRONTEND_LOGGER: false,
         ...initialConfig, // Merge initialConfig if provided
       };
     }

     // private errorObject: any = null;

     setConfig(config: Partial<ConfigType>) {
       this.config = { ...this.config, ...config };
     }

     setToken(accessToken: string) {
       this.auth.token = accessToken;
       this.auth.Authorization = `Bearer ${accessToken}`;
     }

     async authanticateInDodoInner() {
       const { FRONTEND_LOGGER, ORIGIN_URL, CREDS } = this.config;
       const FULL_URL = `${ORIGIN_URL}${API_V1}/security/login`;

       const params = {
         method: 'post' as AxiosRequestConfig['method'],
         data: CREDS,
         headers: {},
         url: FULL_URL,
       };

       logger(params, FRONTEND_LOGGER);

       try {
         const {
           data,
           data: { access_token },
         } = await axios(params);
         this.auth.token = access_token;
         this.auth.Authorization = `Bearer ${access_token}`;
         return data;
       } catch (error) {
         // this.errorObject = error;
         return error;
       }
     }
   ```

## Процесс работы с представлениями

Процесс работы с представлениями в DODO включает следующие шаги:

1. **Создание представления**:
   - Создание класса, наследующегося от `BaseSupersetView` или `SupersetModelView`
   - Определение маршрутов и методов для представления
   - Определение шаблонов для отображения представления

2. **Создание API**:
   - Создание класса, наследующегося от `BaseSupersetApi` или `BaseSupersetModelRestApi`
   - Определение эндпоинтов и методов для API
   - Определение схем для валидации и сериализации данных

3. **Регистрация представления**:
   - Регистрация представления в Flask-AppBuilder
   - Определение прав доступа для представления

4. **Использование представления**:
   - Доступ к представлению через веб-интерфейс
   - Доступ к API через HTTP-запросы

## Техническая реализация

### BaseSupersetView

```python
class BaseSupersetView(BaseView):
    @staticmethod
    def json_response(obj: Any, status: int = 200) -> FlaskResponse:
        return Response(
            json.dumps(obj, default=json.json_int_dttm_ser, ignore_nan=True),
            status=status,
            mimetype="application/json",
        )

    def render_app_template(
        self, extra_bootstrap_data: dict[str, Any] | None = None
    ) -> FlaskResponse:
        payload = {
            "user": bootstrap_user_data(g.user, include_perms=True),
            "common": common_bootstrap_payload(),
            **(extra_bootstrap_data or {}),
        }
        return self.render_template(
            "superset/spa.html",
            entry="spa",
            bootstrap_data=json.dumps(
                payload, default=json.pessimistic_json_iso_dttm_ser
            ),
        )
```

### SupersetModelView

```python
class SupersetModelView(ModelView):
    page_size = 100
    list_widget = SupersetListWidget

    def render_app_template(self) -> FlaskResponse:
        payload = {
            "user": bootstrap_user_data(g.user, include_perms=True),
            "common": common_bootstrap_payload(),
        }
        return self.render_template(
            "superset/spa.html",
            entry="spa",
            bootstrap_data=json.dumps(
                payload, default=json.pessimistic_json_iso_dttm_ser
            ),
        )
```

### BaseSupersetModelRestApi

```python
class BaseSupersetModelRestApi(BaseSupersetApiMixin, ModelRestApi):
    """
    Extends FAB's ModelResApi to implement specific superset generic functionality
    """

    method_permission_name = {
        "bulk_delete": "delete",
        "data": "list",
        "data_from_cache": "list",
        "delete": "delete",
        "distinct": "list",
        "export": "mulexport",
        "import_": "add",
        "get": "show",
        "get_list": "list",
        "info": "list",
        "post": "add",
        "put": "edit",
        "refresh": "edit",
        "related": "list",
        "related_objects": "list",
        "schemas": "list",
        "select_star": "list",
        "table_metadata": "list",
        "test_connection": "post",
        "thumbnail": "list",
        "viz_types": "list",
    }
```

### ApiHandler

```typescript
// DODO was here
// DODO created 44611022
class ApiHandler {
  private auth: AuthType;

  private config: ConfigType;

  constructor(initialConfig?: Partial<ConfigType>) {
    this.auth = {
      Authorization: '',
      'x-csrftoken': '',
      token: '',
      csrfToken: '',
    };

    this.config = {
      ORIGIN_URL: '',
      ENV: '',
      CREDS: {
        username: '',
        password: '',
        provider: '',
      },
      FRONTEND_LOGGER: false,
      ...initialConfig, // Merge initialConfig if provided
    };
  }

  // private errorObject: any = null;

  setConfig(config: Partial<ConfigType>) {
    this.config = { ...this.config, ...config };
  }

  setToken(accessToken: string) {
    this.auth.token = accessToken;
    this.auth.Authorization = `Bearer ${accessToken}`;
  }

  async authanticateInDodoInner() {
    const { FRONTEND_LOGGER, ORIGIN_URL, CREDS } = this.config;
    const FULL_URL = `${ORIGIN_URL}${API_V1}/security/login`;

    const params = {
      method: 'post' as AxiosRequestConfig['method'],
      data: CREDS,
      headers: {},
      url: FULL_URL,
    };

    logger(params, FRONTEND_LOGGER);

    try {
      const {
        data,
        data: { access_token },
      } = await axios(params);
      this.auth.token = access_token;
      this.auth.Authorization = `Bearer ${access_token}`;
      return data;
    } catch (error) {
      // this.errorObject = error;
      return error;
    }
  }
```

## Примеры использования

### Создание представления

```python
from flask_appbuilder import expose
from flask_appbuilder.security.decorators import has_access

from superset.views.base import BaseSupersetView

class MyView(BaseSupersetView):
    route_base = "/myview"

    @has_access
    @expose("/list")
    def list(self) -> FlaskResponse:
        return super().render_app_template()

    @has_access
    @expose("/detail/<int:id>")
    def detail(self, id: int) -> FlaskResponse:
        # Получение данных
        data = {"id": id, "name": "My Item"}
        
        # Рендеринг шаблона
        return super().render_app_template({"item": data})
```

### Создание API

```python
from flask_appbuilder.api import expose, protect, safe
from flask_appbuilder.models.sqla.interface import SQLAInterface

from superset.views.base_api import BaseSupersetModelRestApi
from superset.models.my_model import MyModel

class MyModelRestApi(BaseSupersetModelRestApi):
    datamodel = SQLAInterface(MyModel)
    resource_name = "mymodel"
    allow_browser_login = True
    
    @expose("/<int:pk>", methods=("GET",))
    @protect()
    @safe
    def get(self, pk: int) -> Response:
        """Get a MyModel by id
        ---
        get:
          description: >-
            Get a MyModel by id
          parameters:
            - in: path
              schema:
                type: integer
              name: pk
              description: The MyModel id
          responses:
            200:
              description: MyModel
              content:
                application/json:
                  schema:
                    type: object
                    properties:
                      id:
                        type: number
                      name:
                        type: string
            404:
              $ref: '#/components/responses/404'
        """
        try:
            item = self.datamodel.get(pk)
            if not item:
                return self.response_404()
            return self.response(200, id=item.id, name=item.name)
        except Exception as ex:
            return self.response_500(message=str(ex))
```

### Использование в DODO

В DODO модуль `views` используется для создания представлений и API для различных компонентов системы. Примеры использования:

1. **Использование ApiHandler**:
   ```typescript
   import { API_HANDLER } from '@superset-ui/core';

   // Настройка API-обработчика
   API_HANDLER.setConfig({
     ORIGIN_URL: 'https://example.com',
     ENV: 'production',
     FRONTEND_LOGGER: true,
   });

   // Аутентификация
   await API_HANDLER.authanticateInDodoInner();

   // Отправка запроса
   const response = await API_HANDLER.SupersetClient({
     method: 'get',
     url: '/api/v1/dashboard/1',
     headers: {
       'Content-Type': 'application/json',
     },
   });

   console.log('Dashboard:', response);
   ```

2. **Использование BaseSupersetView**:
   ```python
   from flask import g
   from flask_appbuilder import expose
   from flask_appbuilder.security.decorators import has_access

   from superset.views.base import BaseSupersetView

   class DodoView(BaseSupersetView):
       route_base = "/dodo"

       @has_access
       @expose("/dashboard/<int:id>")
       def dashboard(self, id: int) -> FlaskResponse:
           # Получение данных
           dashboard = get_dashboard(id)
           
           # Рендеринг шаблона
           return super().render_app_template({"dashboard": dashboard})
   ```
