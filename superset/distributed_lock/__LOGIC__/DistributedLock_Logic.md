# Документация по распределенным блокировкам (Distributed Lock) в DODO

## Содержание

1. [Введение](#введение)
2. [Архитектура](#архитектура)
3. [Стандартная функциональность](#стандартная-функциональность)
4. [DODO-специфичная функциональность](#dodo-специфичная-функциональность)
5. [Техническая реализация](#техническая-реализация)
6. [Примеры использования](#примеры-использования)

## Введение

Модуль `distributed_lock` предоставляет механизм распределенных блокировок для Superset. Распределенные блокировки используются для синхронизации доступа к общим ресурсам в распределенной среде, где несколько экземпляров приложения могут работать одновременно.

В DODO этот модуль используется в стандартном виде, без каких-либо специфичных модификаций.

## Архитектура

Модуль `distributed_lock` организован следующим образом:

1. **Основной модуль** (`__init__.py`):
   - Содержит контекстный менеджер `KeyValueDistributedLock` для работы с блокировками
   - Предоставляет интерфейс для создания, проверки и освобождения блокировок

2. **Утилиты** (`utils.py`):
   - Содержит вспомогательные функции для работы с блокировками
   - Функция `get_key` для генерации уникальных ключей блокировок

3. **Типы** (`types.py`):
   - Содержит типы данных, используемые в модуле
   - Тип `LockValue` для представления значения блокировки

4. **Команды**:
   - `CreateDistributedLock` - для создания блокировки
   - `GetDistributedLock` - для получения блокировки
   - `DeleteDistributedLock` - для удаления блокировки

## Стандартная функциональность

Стандартная функциональность модуля `distributed_lock` включает:

1. **Создание блокировок**:
   - Создание блокировки с указанным пространством имен и параметрами
   - Автоматическая генерация уникального ключа блокировки

2. **Проверка блокировок**:
   - Проверка наличия блокировки с указанным ключом
   - Проверка срока действия блокировки

3. **Освобождение блокировок**:
   - Удаление блокировки с указанным ключом
   - Автоматическое освобождение блокировки при выходе из контекстного менеджера

4. **Обработка ошибок**:
   - Обработка ситуаций, когда блокировка уже занята
   - Обработка ошибок при создании или удалении блокировок

## DODO-специфичная функциональность

В результате анализа кода **не обнаружено DODO-специфичных изменений или расширений** в модуле `distributed_lock`. Весь код в этом модуле является стандартным для Superset.

Модуль `distributed_lock` используется в DODO в стандартном виде, без каких-либо специфичных модификаций или расширений. Распределенные блокировки используются для синхронизации доступа к общим ресурсам, таким как обновление токенов доступа к внешним системам.

## Техническая реализация

### Контекстный менеджер KeyValueDistributedLock

Основной интерфейс для работы с распределенными блокировками:

```python
@contextmanager
def KeyValueDistributedLock(  # pylint: disable=invalid-name
    namespace: str,
    **kwargs: Any,
) -> Iterator[uuid.UUID]:
    """
    KV global lock for refreshing tokens.

    This context manager acquires a distributed lock for a given namespace, with
    optional parameters (eg, namespace="cache", user_id=1). It yields a UUID for the
    lock that can be used within the context, and corresponds to the key in the KV
    store.

    :param namespace: The namespace for which the lock is to be acquired.
    :param kwargs: Additional keyword arguments.
    :yields: A unique identifier (UUID) for the acquired lock (the KV key).
    :raises CreateKeyValueDistributedLockFailedException: If the lock is taken.
    """

    # pylint: disable=import-outside-toplevel
    from superset.commands.distributed_lock.create import CreateDistributedLock
    from superset.commands.distributed_lock.delete import DeleteDistributedLock
    from superset.commands.distributed_lock.get import GetDistributedLock

    key = get_key(namespace, **kwargs)
    value = GetDistributedLock(namespace=namespace, params=kwargs).run()
    if value:
        logger.debug("Lock on namespace %s for key %s already taken", namespace, key)
        raise CreateKeyValueDistributedLockFailedException("Lock already taken")

    logger.debug("Acquiring lock on namespace %s for key %s", namespace, key)
    try:
        CreateDistributedLock(namespace=namespace, params=kwargs).run()
    except CreateKeyValueDistributedLockFailedException as ex:
        logger.debug("Lock on namespace %s for key %s already taken", namespace, key)
        raise CreateKeyValueDistributedLockFailedException("Lock already taken") from ex

    yield key
    DeleteDistributedLock(namespace=namespace, params=kwargs).run()
    logger.debug("Removed lock on namespace %s for key %s", namespace, key)
```

### Генерация ключа блокировки

Функция для генерации уникального ключа блокировки:

```python
def get_key(namespace: str, **kwargs: Any) -> uuid.UUID:
    return uuid.uuid5(uuid.uuid5(uuid.NAMESPACE_DNS, namespace), serialize(kwargs))
```

### Команда CreateDistributedLock

Команда для создания блокировки:

```python
class CreateDistributedLock(BaseDistributedLockCommand):
    lock_expiration = timedelta(seconds=30)

    def validate(self) -> None:
        pass

    @transaction(
        on_error=partial(
            on_error,
            catches=(
                KeyValueCodecEncodeException,
                KeyValueUpsertFailedError,
                SQLAlchemyError,
            ),
            reraise=CreateKeyValueDistributedLockFailedException,
        ),
    )
    def run(self) -> None:
        KeyValueDAO.delete_expired_entries(self.resource)
        KeyValueDAO.create_entry(
            resource=KeyValueResource.LOCK,
            value={"value": True},
            codec=self.codec,
            key=self.key,
            expires_on=datetime.now() + self.lock_expiration,
        )
```

## Примеры использования

### Использование блокировки для синхронизации доступа к ресурсу

```python
from superset.distributed_lock import KeyValueDistributedLock

def refresh_token(user_id: int) -> None:
    """
    Обновляет токен доступа для пользователя.
    Использует распределенную блокировку для предотвращения одновременного обновления.
    """
    try:
        with KeyValueDistributedLock("token_refresh", user_id=user_id):
            # Код для обновления токена
            # Выполняется только если блокировка успешно получена
            print(f"Обновление токена для пользователя {user_id}")
    except CreateKeyValueDistributedLockFailedException:
        # Блокировка уже занята, значит токен уже обновляется другим процессом
        print(f"Токен для пользователя {user_id} уже обновляется")
```

### Использование блокировки с несколькими параметрами

```python
from superset.distributed_lock import KeyValueDistributedLock

def process_data(database_id: int, table_name: str) -> None:
    """
    Обрабатывает данные из указанной таблицы.
    Использует распределенную блокировку для предотвращения одновременной обработки.
    """
    try:
        with KeyValueDistributedLock("data_processing", database_id=database_id, table_name=table_name) as lock_key:
            print(f"Получена блокировка с ключом {lock_key}")
            # Код для обработки данных
            print(f"Обработка данных из таблицы {table_name} в базе данных {database_id}")
    except CreateKeyValueDistributedLockFailedException:
        # Блокировка уже занята, значит данные уже обрабатываются другим процессом
        print(f"Данные из таблицы {table_name} в базе данных {database_id} уже обрабатываются")
```
