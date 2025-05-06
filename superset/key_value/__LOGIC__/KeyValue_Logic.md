# Документация по хранилищу ключ-значение (Key-Value) в DODO

## Содержание

1. [Введение](#введение)
2. [Архитектура](#архитектура)
3. [Стандартная функциональность](#стандартная-функциональность)
4. [DODO-специфичная функциональность](#dodo-специфичная-функциональность)
5. [Техническая реализация](#техническая-реализация)
6. [Примеры использования](#примеры-использования)

## Введение

Модуль `key_value` предоставляет хранилище типа "ключ-значение" для Superset. Это хранилище используется для сохранения различных данных, таких как постоянные ссылки на дашборды и исследования, состояния фильтров, блокировки и другие временные или постоянные данные.

В DODO этот модуль используется для хранения состояний фильтров, постоянных ссылок и других данных, необходимых для работы приложения.

## Архитектура

Модуль `key_value` организован следующим образом:

1. **Модель данных** (`models.py`):
   - `KeyValueEntry` - модель для хранения записей ключ-значение
   - Хранит значение, ресурс, время создания и истечения срока действия

2. **Типы** (`types.py`):
   - `KeyValueResource` - перечисление типов ресурсов
   - `KeyValueCodec` - интерфейс для кодеков
   - Реализации кодеков: `JsonKeyValueCodec`, `PickleKeyValueCodec`, `MarshmallowKeyValueCodec`

3. **Утилиты** (`utils.py`):
   - Функции для работы с ключами
   - Функции для кодирования и декодирования ключей постоянных ссылок

4. **Исключения** (`exceptions.py`):
   - Исключения, связанные с операциями хранилища ключ-значение

5. **Общие записи** (`shared_entries.py`):
   - Функции для работы с общими записями

## Стандартная функциональность

Стандартная функциональность модуля `key_value` включает:

1. **Операции CRUD**:
   - Создание записей ключ-значение
   - Чтение записей ключ-значение
   - Обновление записей ключ-значение
   - Удаление записей ключ-значение

2. **Управление сроком действия**:
   - Установка срока действия для записей
   - Автоматическое удаление просроченных записей

3. **Кодирование и декодирование**:
   - Кодирование значений в JSON
   - Кодирование значений в Pickle
   - Кодирование значений с использованием Marshmallow

4. **Работа с постоянными ссылками**:
   - Кодирование и декодирование ключей постоянных ссылок
   - Генерация детерминированных UUID

## DODO-специфичная функциональность

В результате анализа кода **не обнаружено прямых DODO-специфичных изменений или расширений** в модуле `key_value`. Весь код в этом модуле является стандартным для Superset.

Однако, в файле `superset-frontend/src/dashboard/components/nativeFilters/FilterBar/keyValue.tsx` есть DODO-специфичные изменения, связанные с использованием модуля `key_value`:

```typescript
export const createFilterKey = (
  dashId: string | number,
  value: string,
  tabId?: string,
) =>
  // DODO changed 44611022
  (isStandalone
    ? SupersetClient.post({
        endpoint: assembleEndpoint(dashId, undefined, tabId),
        jsonPayload: { value },
      })
    : API_HANDLER.SupersetClient({
        method: 'post',
        url: assembleEndpoint(dashId, undefined, tabId),
        jsonPayload: { value },
      })
  )
    .then(r => (isStandalone ? r.json : r).key as string)
    .catch(err => {
      logging.error(err);
      return null;
    });
export const getFilterValue = (dashId: string | number, key?: string | null) =>
  // DODO changed 44611022
  (isStandalone
    ? SupersetClient.get({
        endpoint: assembleEndpoint(dashId, key),
      })
    : API_HANDLER.SupersetClient({
        method: 'get',
        url: assembleEndpoint(dashId, key),
      })
  )
```

Эти изменения связаны с использованием API-обработчика DODO для работы с хранилищем ключ-значение, что позволяет интегрировать Superset с другими системами DODO.

## Техническая реализация

### Модель KeyValueEntry

Модель для хранения записей ключ-значение:

```python
class KeyValueEntry(AuditMixinNullable, ImportExportMixin, Model):
    """Key value store entity"""

    __tablename__ = "key_value"
    id = Column(Integer, primary_key=True)
    resource = Column(String(32), nullable=False)
    value = Column(LargeBinary(length=VALUE_MAX_SIZE), nullable=False)
    created_on = Column(DateTime, nullable=True)
    created_by_fk = Column(Integer, ForeignKey("ab_user.id"), nullable=True)
    changed_on = Column(DateTime, nullable=True)
    expires_on = Column(DateTime, nullable=True)
    changed_by_fk = Column(Integer, ForeignKey("ab_user.id"), nullable=True)
    created_by = relationship(security_manager.user_model, foreign_keys=[created_by_fk])
    changed_by = relationship(security_manager.user_model, foreign_keys=[changed_by_fk])

    uuid = Column(UUIDType(binary=True), default=uuid.uuid4)

    def is_expired(self) -> bool:
        """Check if the key is expired."""
        return bool(self.expires_on and self.expires_on < datetime.now())
```

### Типы ресурсов

Перечисление типов ресурсов:

```python
class KeyValueResource(StrEnum):
    APP = "app"
    DASHBOARD_PERMALINK = "dashboard_permalink"
    EXPLORE_PERMALINK = "explore_permalink"
    METASTORE_CACHE = "superset_metastore_cache"
    LOCK = "lock"
```

### Кодеки

Интерфейс и реализации кодеков:

```python
class KeyValueCodec(ABC):
    @abstractmethod
    def encode(self, value: Any) -> bytes: ...

    @abstractmethod
    def decode(self, value: bytes) -> Any: ...


class JsonKeyValueCodec(KeyValueCodec):
    def encode(self, value: dict[Any, Any]) -> bytes:
        try:
            return bytes(json.dumps(value), encoding="utf-8")
        except TypeError as ex:
            raise KeyValueCodecEncodeException(str(ex)) from ex

    def decode(self, value: bytes) -> dict[Any, Any]:
        try:
            return json.loads(value)
        except TypeError as ex:
            raise KeyValueCodecDecodeException(str(ex)) from ex


class PickleKeyValueCodec(KeyValueCodec):
    def encode(self, value: dict[Any, Any]) -> bytes:
        return pickle.dumps(value)

    def decode(self, value: bytes) -> dict[Any, Any]:
        return pickle.loads(value)


class MarshmallowKeyValueCodec(JsonKeyValueCodec):
    def __init__(self, schema: Schema):
        self.schema = schema

    def encode(self, value: dict[Any, Any]) -> bytes:
        try:
            obj = self.schema.dump(value)
            return super().encode(obj)
        except ValidationError as ex:
            raise KeyValueCodecEncodeException(message=str(ex)) from ex

    def decode(self, value: bytes) -> dict[Any, Any]:
        try:
            obj = super().decode(value)
            return self.schema.load(obj)
        except ValidationError as ex:
            raise KeyValueCodecEncodeException(message=str(ex)) from ex
```

### Утилиты для работы с ключами

Функции для работы с ключами:

```python
def random_key() -> str:
    return token_urlsafe(48)


def get_filter(resource: KeyValueResource, key: Key) -> KeyValueFilter:
    try:
        filter_: KeyValueFilter = {"resource": resource.value}
        if isinstance(key, UUID):
            filter_["uuid"] = key
        else:
            filter_["id"] = key
        return filter_
    except ValueError as ex:
        raise KeyValueParseKeyError() from ex


def encode_permalink_key(key: int, salt: str) -> str:
    obj = hashids.Hashids(salt, min_length=HASHIDS_MIN_LENGTH)
    return obj.encode(key)


def decode_permalink_id(key: str, salt: str) -> int:
    obj = hashids.Hashids(salt, min_length=HASHIDS_MIN_LENGTH)
    ids = obj.decode(key)
    if len(ids) == 1:
        return ids[0]
    raise KeyValueParseKeyError(_("Invalid permalink key"))


def get_uuid_namespace(seed: str) -> UUID:
    md5_obj = md5()
    md5_obj.update(seed.encode("utf-8"))
    return UUID(md5_obj.hexdigest())


def get_deterministic_uuid(namespace: str, payload: Any) -> UUID:
    """Get a deterministic UUID (uuid3) from a salt and a JSON-serializable payload."""
    payload_str = json_dumps_w_dates(payload, sort_keys=True)
    return uuid3(get_uuid_namespace(namespace), payload_str)
```

### DAO для работы с хранилищем ключ-значение

DAO для работы с хранилищем ключ-значение:

```python
class KeyValueDAO(BaseDAO[KeyValueEntry]):
    @staticmethod
    def get_entry(
        resource: KeyValueResource,
        key: Key,
    ) -> KeyValueEntry | None:
        filter_ = get_filter(resource, key)
        return db.session.query(KeyValueEntry).filter_by(**filter_).first()

    @classmethod
    def get_value(
        cls,
        resource: KeyValueResource,
        key: Key,
        codec: KeyValueCodec,
    ) -> Any:
        entry = cls.get_entry(resource, key)
        if not entry or entry.is_expired():
            return None

        return codec.decode(entry.value)

    @staticmethod
    def delete_entry(resource: KeyValueResource, key: Key) -> bool:
        if entry := KeyValueDAO.get_entry(resource, key):
            db.session.delete(entry)
            return True

        return False

    @staticmethod
    def delete_expired_entries(resource: KeyValueResource) -> None:
        db.session.query(KeyValueEntry).filter(
            KeyValueEntry.resource == resource.value,
            KeyValueEntry.expires_on < datetime.now(),
        ).delete()

    @staticmethod
    def create_entry(
        resource: KeyValueResource,
        value: Any,
        codec: KeyValueCodec,
        key: Key | None = None,
        expires_on: datetime | None = None,
    ) -> KeyValueEntry:
        try:
            encoded_value = codec.encode(value)
        except Exception as ex:
            raise KeyValueCreateFailedError("Unable to encode value") from ex
        entry = KeyValueEntry(
            resource=resource.value,
            value=encoded_value,
            created_on=datetime.now(),
            created_by_fk=get_user_id(),
            expires_on=expires_on,
        )
        if key is not None:
            try:
                if isinstance(key, UUID):
                    entry.uuid = key
                else:
                    entry.id = key
            except ValueError as ex:
                raise KeyValueCreateFailedError() from ex
        db.session.add(entry)
        return entry

    @staticmethod
    def upsert_entry(
        resource: KeyValueResource,
        value: Any,
        codec: KeyValueCodec,
        key: Key,
        expires_on: datetime | None = None,
    ) -> KeyValueEntry:
        if entry := KeyValueDAO.get_entry(resource, key):
            entry.value = codec.encode(value)
            entry.expires_on = expires_on
            entry.changed_on = datetime.now()
            entry.changed_by_fk = get_user_id()
            return entry

        return KeyValueDAO.create_entry(resource, value, codec, key, expires_on)

    @staticmethod
    def update_entry(
        resource: KeyValueResource,
        value: Any,
        codec: KeyValueCodec,
        key: Key,
        expires_on: datetime | None = None,
    ) -> KeyValueEntry:
        if entry := KeyValueDAO.get_entry(resource, key):
            entry.value = codec.encode(value)
            entry.expires_on = expires_on
            entry.changed_on = datetime.now()
            entry.changed_by_fk = get_user_id()
            return entry

        raise KeyValueUpdateFailedError()
```

## Примеры использования

### Создание записи ключ-значение

```python
from superset.daos.key_value import KeyValueDAO
from superset.key_value.types import JsonKeyValueCodec, KeyValueResource
from datetime import datetime, timedelta

# Создание записи ключ-значение
codec = JsonKeyValueCodec()
value = {"name": "John", "age": 30}
expires_on = datetime.now() + timedelta(hours=1)

entry = KeyValueDAO.create_entry(
    resource=KeyValueResource.APP,
    value=value,
    codec=codec,
    expires_on=expires_on
)

print(f"Entry ID: {entry.id}")
print(f"Entry UUID: {entry.uuid}")
```

### Получение значения по ключу

```python
from superset.daos.key_value import KeyValueDAO
from superset.key_value.types import JsonKeyValueCodec, KeyValueResource

# Получение значения по ключу
codec = JsonKeyValueCodec()
value = KeyValueDAO.get_value(
    resource=KeyValueResource.APP,
    key=1,  # или UUID
    codec=codec
)

print(f"Value: {value}")
```

### Обновление записи ключ-значение

```python
from superset.daos.key_value import KeyValueDAO
from superset.key_value.types import JsonKeyValueCodec, KeyValueResource
from datetime import datetime, timedelta

# Обновление записи ключ-значение
codec = JsonKeyValueCodec()
value = {"name": "John", "age": 31}
expires_on = datetime.now() + timedelta(hours=2)

entry = KeyValueDAO.update_entry(
    resource=KeyValueResource.APP,
    value=value,
    codec=codec,
    key=1,  # или UUID
    expires_on=expires_on
)

print(f"Updated entry: {entry.id}")
```

### Удаление записи ключ-значение

```python
from superset.daos.key_value import KeyValueDAO
from superset.key_value.types import KeyValueResource

# Удаление записи ключ-значение
result = KeyValueDAO.delete_entry(
    resource=KeyValueResource.APP,
    key=1  # или UUID
)

print(f"Deleted: {result}")
```

### Работа с постоянными ссылками

```python
from superset.key_value.utils import encode_permalink_key, decode_permalink_id

# Кодирование ключа постоянной ссылки
salt = "my-salt"
key = 123
encoded_key = encode_permalink_key(key, salt)
print(f"Encoded key: {encoded_key}")

# Декодирование ключа постоянной ссылки
decoded_key = decode_permalink_id(encoded_key, salt)
print(f"Decoded key: {decoded_key}")
```

### Генерация детерминированного UUID

```python
from superset.key_value.utils import get_deterministic_uuid

# Генерация детерминированного UUID
namespace = "my-namespace"
payload = {"id": 123, "name": "John"}
uuid = get_deterministic_uuid(namespace, payload)
print(f"UUID: {uuid}")
```
