# Документация по временному кэшу (Temporary Cache) в DODO

## Содержание

1. [Введение](#введение)
2. [Архитектура](#архитектура)
3. [Основные компоненты](#основные-компоненты)
   - [API для временного кэша](#api-для-временного-кэша)
   - [Схемы](#схемы)
   - [Утилиты](#утилиты)
   - [Команды](#команды)
4. [DODO-специфичные модификации](#dodo-специфичные-модификации)
5. [Процесс работы с временным кэшем](#процесс-работы-с-временным-кэшем)
6. [Техническая реализация](#техническая-реализация)
7. [Примеры использования](#примеры-использования)

## Введение

Модуль `temporary_cache` в Superset предоставляет механизм для временного хранения данных, которые не требуют долгосрочного хранения в базе данных. Он используется для хранения состояния фильтров дашбордов, временных результатов запросов и других данных, которые должны быть доступны между запросами, но не требуют постоянного хранения.

В DODO этот модуль используется для поддержки работы с фильтрами дашбордов и временного хранения данных при работе с аналитическими инструментами.

## Архитектура

Модуль `temporary_cache` организован следующим образом:

1. **Основные файлы**:
   - `__init__.py` - инициализация модуля
   - `api.py` - API для работы с временным кэшем
   - `schemas.py` - схемы для валидации и сериализации данных
   - `utils.py` - утилиты для работы с временным кэшем

2. **Связанные модули**:
   - `commands/temporary_cache` - команды для работы с временным кэшем
   - `commands/dashboard/filter_state` - команды для работы с состоянием фильтров дашбордов
   - `extensions/metastore_cache.py` - расширение для хранения кэша в метахранилище

3. **Ключевые концепции**:
   - `Entry` - запись в кэше, содержащая значение и информацию о владельце
   - `CommandParameters` - параметры для команд работы с кэшем
   - `cache_key` - функция для генерации ключей кэша

## Основные компоненты

### API для временного кэша

API для работы с временным кэшем реализовано в файле `api.py` и предоставляет базовый класс `TemporaryCacheRestApi`, который должен быть расширен конкретными реализациями:

```python
class TemporaryCacheRestApi(BaseSupersetApi, ABC):
    add_model_schema = TemporaryCachePostSchema()
    edit_model_schema = TemporaryCachePutSchema()
    method_permission_name = MODEL_API_RW_METHOD_PERMISSION_MAP
    include_route_methods = {
        RouteMethod.POST,
        RouteMethod.PUT,
        RouteMethod.GET,
        RouteMethod.DELETE,
    }
    allow_browser_login = True

    def add_apispec_components(self, api_spec: APISpec) -> None:
        with contextlib.suppress(DuplicateComponentNameError):
            api_spec.components.schema(
                TemporaryCachePostSchema.__name__,
                schema=TemporaryCachePostSchema,
            )
            api_spec.components.schema(
                TemporaryCachePutSchema.__name__,
                schema=TemporaryCachePutSchema,
            )
        super().add_apispec_components(api_spec)
```

Класс предоставляет методы для работы с временным кэшем:
- `post` - создание новой записи в кэше
- `put` - обновление существующей записи в кэше
- `get` - получение записи из кэша
- `delete` - удаление записи из кэша

### Схемы

Схемы для валидации и сериализации данных реализованы в файле `schemas.py`:

```python
class TemporaryCachePostSchema(Schema):
    value = fields.String(
        required=True,
        allow_none=False,
        metadata={"description": "Any type of JSON supported text."},
        validate=validate_json,
    )


class TemporaryCachePutSchema(Schema):
    value = fields.String(
        required=True,
        allow_none=False,
        metadata={"description": "Any type of JSON supported text."},
        validate=validate_json,
    )
```

Эти схемы используются для валидации данных при создании и обновлении записей в кэше.

### Утилиты

Утилиты для работы с временным кэшем реализованы в файле `utils.py`:

```python
SEPARATOR = ";"


def cache_key(*args: Any) -> str:
    return SEPARATOR.join(str(arg) for arg in args)
```

Функция `cache_key` используется для генерации ключей кэша на основе переданных аргументов.

### Команды

Команды для работы с временным кэшем реализованы в модуле `commands/temporary_cache`:

1. **CreateTemporaryCacheCommand** - команда для создания записи в кэше:
   ```python
   class CreateTemporaryCacheCommand(BaseCommand, ABC):
       def __init__(self, cmd_params: CommandParameters):
           self._cmd_params = cmd_params

       @transaction(on_error=partial(on_error, reraise=TemporaryCacheCreateFailedError))
       def run(self) -> str:
           return self.create(self._cmd_params)

       def validate(self) -> None:
           pass

       @abstractmethod
       def create(self, cmd_params: CommandParameters) -> str: ...
   ```

2. **UpdateTemporaryCacheCommand** - команда для обновления записи в кэше:
   ```python
   class UpdateTemporaryCacheCommand(BaseCommand, ABC):
       def __init__(
           self,
           cmd_params: CommandParameters,
       ):
           self._parameters = cmd_params

       @transaction(on_error=partial(on_error, reraise=TemporaryCacheUpdateFailedError))
       def run(self) -> Optional[str]:
           return self.update(self._parameters)

       def validate(self) -> None:
           pass

       @abstractmethod
       def update(self, cmd_params: CommandParameters) -> Optional[str]: ...
   ```

3. **DeleteTemporaryCacheCommand** - команда для удаления записи из кэша:
   ```python
   class DeleteTemporaryCacheCommand(BaseCommand, ABC):
       def __init__(self, cmd_params: CommandParameters):
           self._cmd_params = cmd_params

       @transaction(on_error=partial(on_error, reraise=TemporaryCacheDeleteFailedError))
       def run(self) -> bool:
           return self.delete(self._cmd_params)

       def validate(self) -> None:
           pass

       @abstractmethod
       def delete(self, cmd_params: CommandParameters) -> bool: ...
   ```

## DODO-специфичные модификации

В DODO модуль `temporary_cache` используется в основном в стандартном виде, без значительных модификаций. Однако, есть некоторые аспекты, которые могут быть специфичны для DODO:

1. **Интеграция с системой команд DODO**:
   - Временный кэш может использоваться для хранения состояния фильтров дашбордов, специфичных для команд DODO
   - Доступ к кэшу может быть ограничен на основе принадлежности к команде

2. **Локализация**:
   - Сообщения об ошибках локализованы на русский язык для пользователей DODO

## Процесс работы с временным кэшем

Процесс работы с временным кэшем в Superset включает следующие шаги:

1. **Создание записи в кэше**:
   - Клиент отправляет запрос на создание записи в кэше с указанием значения
   - Сервер создает запись в кэше и возвращает ключ для доступа к ней

2. **Получение записи из кэша**:
   - Клиент отправляет запрос на получение записи из кэша с указанием ключа
   - Сервер возвращает значение, если запись существует и клиент имеет к ней доступ

3. **Обновление записи в кэше**:
   - Клиент отправляет запрос на обновление записи в кэше с указанием ключа и нового значения
   - Сервер обновляет запись, если она существует и клиент имеет к ней доступ

4. **Удаление записи из кэша**:
   - Клиент отправляет запрос на удаление записи из кэша с указанием ключа
   - Сервер удаляет запись, если она существует и клиент имеет к ней доступ

## Техническая реализация

### Создание записи в кэше

```python
class DashboardFilterStateCreateCommand(CreateTemporaryCacheCommand):
    def create(self, cmd_params: CommandParameters) -> str:
        resource_id = cmd_params.resource_id
        check_access(resource_id)
        key = random_key()
        value = cmd_params.value
        tab_id = cmd_params.tab_id
        user_id = get_user_id()
        owner = user_id
        entry: Entry = {"owner": owner, "value": value}
        serialized_value = json.dumps(entry) if cmd_params.codec is None else value
        cache_key_serialized = cache_key(resource_id, key, tab_id)
        cache_manager.filter_state_cache.set(cache_key_serialized, serialized_value)
        return key
```

### Получение записи из кэша

```python
class DashboardFilterStateGetCommand(GetTemporaryCacheCommand):
    def get(self, cmd_params: CommandParameters) -> Optional[str]:
        resource_id = cmd_params.resource_id
        key = cmd_params.key
        tab_id = cmd_params.tab_id
        check_access(resource_id)
        cache_key_serialized = cache_key(resource_id, key, tab_id)
        cached_value = cache_manager.filter_state_cache.get(cache_key_serialized)
        if cached_value:
            try:
                entry = json.loads(cached_value)
                return entry.get("value")
            except (json.JSONDecodeError, KeyError):
                return cached_value
        return None
```

### Обновление записи в кэше

```python
class DashboardFilterStateUpdateCommand(UpdateTemporaryCacheCommand):
    def update(self, cmd_params: CommandParameters) -> Optional[str]:
        resource_id = cmd_params.resource_id
        key = cmd_params.key
        tab_id = cmd_params.tab_id
        value = cmd_params.value
        check_access(resource_id)
        cache_key_serialized = cache_key(resource_id, key, tab_id)
        user_id = get_user_id()
        cached_value = cache_manager.filter_state_cache.get(cache_key_serialized)
        if not cached_value:
            return None
        try:
            entry = json.loads(cached_value)
            owner = entry.get("owner")
            if owner is not None and owner != user_id:
                raise TemporaryCacheAccessDeniedError()
            entry["value"] = value
            cache_manager.filter_state_cache.set(
                cache_key_serialized, json.dumps(entry)
            )
            return key
        except (json.JSONDecodeError, KeyError):
            # for backward compatibility
            entry = {"owner": user_id, "value": value}
            cache_manager.filter_state_cache.set(
                cache_key_serialized, json.dumps(entry)
            )
            return key
```

### Удаление записи из кэша

```python
class DashboardFilterStateDeleteCommand(DeleteTemporaryCacheCommand):
    def delete(self, cmd_params: CommandParameters) -> bool:
        resource_id = cmd_params.resource_id
        key = cmd_params.key
        tab_id = cmd_params.tab_id
        check_access(resource_id)
        cache_key_serialized = cache_key(resource_id, key, tab_id)
        user_id = get_user_id()
        cached_value = cache_manager.filter_state_cache.get(cache_key_serialized)
        if not cached_value:
            return False
        try:
            entry = json.loads(cached_value)
            owner = entry.get("owner")
            if owner is not None and owner != user_id:
                raise TemporaryCacheAccessDeniedError()
        except (json.JSONDecodeError, KeyError):
            # for backward compatibility
            pass
        cache_manager.filter_state_cache.delete(cache_key_serialized)
        return True
```

## Примеры использования

### Создание записи в кэше

```python
from superset.commands.dashboard.filter_state.create import DashboardFilterStateCreateCommand
from superset.commands.temporary_cache.parameters import CommandParameters

# Создание записи в кэше
cmd_params = CommandParameters(
    resource_id=1,  # ID дашборда
    value='{"filter1": "value1", "filter2": "value2"}',  # Значение
    tab_id=1,  # ID вкладки
)

key = DashboardFilterStateCreateCommand(cmd_params).run()
print(f"Created cache entry with key: {key}")
```

### Получение записи из кэша

```python
from superset.commands.dashboard.filter_state.get import DashboardFilterStateGetCommand
from superset.commands.temporary_cache.parameters import CommandParameters

# Получение записи из кэша
cmd_params = CommandParameters(
    resource_id=1,  # ID дашборда
    key="abc123",  # Ключ
    tab_id=1,  # ID вкладки
)

value = DashboardFilterStateGetCommand(cmd_params).run()
if value:
    print(f"Retrieved cache entry: {value}")
else:
    print("Cache entry not found")
```

### Обновление записи в кэше

```python
from superset.commands.dashboard.filter_state.update import DashboardFilterStateUpdateCommand
from superset.commands.temporary_cache.parameters import CommandParameters

# Обновление записи в кэше
cmd_params = CommandParameters(
    resource_id=1,  # ID дашборда
    key="abc123",  # Ключ
    tab_id=1,  # ID вкладки
    value='{"filter1": "new_value1", "filter2": "new_value2"}',  # Новое значение
)

key = DashboardFilterStateUpdateCommand(cmd_params).run()
if key:
    print(f"Updated cache entry with key: {key}")
else:
    print("Cache entry not found or update failed")
```

### Удаление записи из кэша

```python
from superset.commands.dashboard.filter_state.delete import DashboardFilterStateDeleteCommand
from superset.commands.temporary_cache.parameters import CommandParameters

# Удаление записи из кэша
cmd_params = CommandParameters(
    resource_id=1,  # ID дашборда
    key="abc123",  # Ключ
    tab_id=1,  # ID вкладки
)

success = DashboardFilterStateDeleteCommand(cmd_params).run()
if success:
    print("Cache entry deleted successfully")
else:
    print("Cache entry not found or delete failed")
```

### Использование в DODO

В DODO модуль `temporary_cache` используется для хранения состояния фильтров дашбордов и временного хранения данных при работе с аналитическими инструментами. Примеры использования:

1. **Сохранение состояния фильтров дашборда**:
   ```javascript
   // Фронтенд-код для сохранения состояния фильтров
   const filterState = {
     region: ['Moscow', 'Saint Petersburg'],
     date_range: '2023-01-01 : 2023-12-31',
     product_category: ['Pizza', 'Drinks'],
   };

   const response = await SupersetClient.post({
     url: `/api/v1/dashboard/${dashboardId}/filter_state`,
     body: JSON.stringify({
       value: JSON.stringify(filterState),
       tab_id: tabId,
     }),
     headers: { 'Content-Type': 'application/json' },
   });

   const { key } = await response.json();
   ```

2. **Загрузка состояния фильтров дашборда**:
   ```javascript
   // Фронтенд-код для загрузки состояния фильтров
   const response = await SupersetClient.get({
     url: `/api/v1/dashboard/${dashboardId}/filter_state/${key}?tab_id=${tabId}`,
   });

   const { result } = await response.json();
   const filterState = JSON.parse(result);
   ```

3. **Обновление состояния фильтров дашборда**:
   ```javascript
   // Фронтенд-код для обновления состояния фильтров
   const newFilterState = {
     region: ['Moscow', 'Saint Petersburg', 'Novosibirsk'],
     date_range: '2023-01-01 : 2023-12-31',
     product_category: ['Pizza', 'Drinks', 'Desserts'],
   };

   const response = await SupersetClient.put({
     url: `/api/v1/dashboard/${dashboardId}/filter_state/${key}`,
     body: JSON.stringify({
       value: JSON.stringify(newFilterState),
       tab_id: tabId,
     }),
     headers: { 'Content-Type': 'application/json' },
   });
   ```
