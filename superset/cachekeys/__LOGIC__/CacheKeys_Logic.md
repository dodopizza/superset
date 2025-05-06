# Документация по ключам кэша (Cache Keys) в DODO

## Содержание

1. [Введение](#введение)
2. [Архитектура](#архитектура)
3. [Стандартная функциональность](#стандартная-функциональность)
4. [DODO-специфичная функциональность](#dodo-специфичная-функциональность)
5. [Техническая реализация](#техническая-реализация)
6. [API](#api)

## Введение

Модуль `cachekeys` предоставляет функциональность для управления ключами кэша в Superset. Кэширование используется для ускорения загрузки данных и визуализаций, особенно для часто используемых запросов и дашбордов.

Ключи кэша связаны с конкретными источниками данных (datasources) и используются для идентификации кэшированных результатов запросов. Модуль позволяет инвалидировать (сбрасывать) кэш для определенных источников данных, что полезно при обновлении данных или изменении структуры источника.

## Архитектура

Модуль состоит из следующих основных компонентов:

1. **Модель данных** (`models/cache.py`):
   - `CacheKey` - модель для хранения информации о ключах кэша

2. **API** (`cachekeys/api.py`):
   - `CacheRestApi` - REST API для управления ключами кэша
   - Предоставляет эндпоинты для инвалидации кэша

3. **Схемы** (`cachekeys/schemas.py`):
   - `CacheInvalidationRequestSchema` - схема для валидации запросов на инвалидацию кэша
   - `Datasource` - схема для описания источника данных

## Стандартная функциональность

Стандартная функциональность модуля `cachekeys` включает:

1. **Инвалидация кэша**:
   - Возможность сбросить кэш для определенных источников данных
   - Поддержка инвалидации по UID источника данных или по комбинации имени источника и базы данных

2. **Управление ключами кэша**:
   - Хранение информации о ключах кэша в базе данных
   - Связывание ключей кэша с источниками данных

## DODO-специфичная функциональность

В результате анализа кода **не обнаружено DODO-специфичных изменений или расширений** в модуле `cachekeys`. Весь код в этом модуле является стандартным для Superset.

Модуль `cachekeys` используется в DODO в стандартном виде, без каких-либо специфичных модификаций или расширений. Функциональность кэширования настраивается через стандартную конфигурацию Superset.

## Техническая реализация

### Модель данных

Модель `CacheKey` используется для хранения информации о ключах кэша:

```python
class CacheKey(Model):  # pylint: disable=too-few-public-methods
    """Stores cache key records for the superset visualization."""

    __tablename__ = "cache_keys"
    id = Column(Integer, primary_key=True)
    cache_key = Column(String(256), nullable=False)
    cache_timeout = Column(Integer, nullable=True)
    datasource_uid = Column(String(64), nullable=False, index=True)
    created_on = Column(DateTime, default=datetime.now, nullable=True)
```

### API для инвалидации кэша

API для инвалидации кэша реализовано в классе `CacheRestApi`:

```python
class CacheRestApi(BaseSupersetModelRestApi):
    datamodel = SQLAInterface(CacheKey)
    resource_name = "cachekey"
    allow_browser_login = True
    class_permission_name = "CacheRestApi"
    include_route_methods = {
        "invalidate",
    }

    openapi_spec_component_schemas = (CacheInvalidationRequestSchema,)

    @expose("/invalidate", methods=("POST",))
    @protect()
    @safe
    @statsd_metrics
    @event_logger.log_this_with_context(log_to_statsd=False)
    def invalidate(self) -> Response:
        """
        Take a list of datasources, find and invalidate the associated cache records
        and remove the database records.
        """
        # ...
```

### Схемы для валидации запросов

Схемы для валидации запросов на инвалидацию кэша:

```python
class Datasource(Schema):
    database_name = fields.String(
        metadata={"description": "Datasource name"},
    )
    datasource_name = fields.String(
        metadata={"description": datasource_name_description},
    )
    catalog = fields.String(
        allow_none=True,
        metadata={"description": "Datasource catalog"},
    )
    schema = fields.String(
        metadata={"description": "Datasource schema"},
    )
    datasource_type = fields.String(
        metadata={"description": datasource_type_description},
        validate=validate.OneOf(choices=[ds.value for ds in DatasourceType]),
        required=True,
    )


class CacheInvalidationRequestSchema(Schema):
    datasource_uids = fields.List(
        fields.String(),
        metadata={"description": datasource_uid_description},
    )
    datasources = fields.List(
        fields.Nested(Datasource),
        metadata={"description": "A list of the data source and database names"},
    )
```

## API

### Инвалидация кэша

```
POST /api/v1/cachekey/invalidate
```

Тело запроса:

```json
{
  "datasource_uids": ["uid1", "uid2"],
  "datasources": [
    {
      "database_name": "example_db",
      "datasource_name": "example_table",
      "schema": "public",
      "datasource_type": "table"
    }
  ]
}
```

Этот запрос инвалидирует кэш для указанных источников данных, удаляя соответствующие записи из таблицы `cache_keys` и очищая кэш в Redis или другом настроенном бэкенде кэширования.
