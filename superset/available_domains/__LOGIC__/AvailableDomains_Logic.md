# Документация по доступным доменам (Available Domains) в DODO

## Содержание

1. [Введение](#введение)
2. [Архитектура](#архитектура)
3. [Стандартная функциональность](#стандартная-функциональность)
4. [DODO-специфичная функциональность](#dodo-специфичная-функциональность)
5. [Техническая реализация](#техническая-реализация)
6. [API](#api)

## Введение

Модуль `available_domains` предоставляет функциональность для работы с доступными доменами в Superset. Эта функциональность позволяет настраивать и получать список доменов, на которых работает Superset, что особенно полезно при использовании техники "domain sharding" (разделение доменов) для оптимизации загрузки дашбордов.

Domain sharding - это техника, которая позволяет обойти ограничение браузеров на количество одновременных соединений с одним доменом (обычно 6 соединений в Chrome). Когда на дашборде много элементов (более 6), запросы данных могут ставиться в очередь, что замедляет загрузку. Разделение доменов позволяет распределить запросы между несколькими доменами, ускоряя загрузку дашбордов.

## Архитектура

Модуль состоит из следующих основных компонентов:

1. **API** (`api.py`):
   - `AvailableDomainsRestApi` - REST API для получения списка доступных доменов

2. **Схемы** (`schemas.py`):
   - `AvailableDomainsSchema` - схема для сериализации данных о доступных доменах

3. **Клиентская часть** (в `superset-frontend/src/utils/hostNamesConfig.js`):
   - Функции для получения и использования списка доступных доменов на стороне клиента

## Стандартная функциональность

Стандартная функциональность модуля `available_domains` включает:

1. **Получение списка доступных доменов**:
   - API-эндпоинт для получения списка доменов, настроенных в конфигурации Superset
   - Использование этого списка на стороне клиента для распределения запросов

2. **Конфигурация доменов**:
   - Настройка списка доменов через параметр `SUPERSET_WEBSERVER_DOMAINS` в конфигурации Superset

## DODO-специфичная функциональность

В результате анализа кода **не обнаружено DODO-специфичных изменений или расширений** в модуле `available_domains`. Весь код в этом модуле является стандартным для Superset.

Модуль `available_domains` используется в DODO в стандартном виде, без каких-либо специфичных модификаций или расширений. Функциональность domain sharding может быть настроена через стандартную конфигурацию Superset.

## Техническая реализация

### API для получения доступных доменов

API для получения доступных доменов реализовано в классе `AvailableDomainsRestApi`:

```python
class AvailableDomainsRestApi(BaseSupersetApi):
    available_domains_schema = AvailableDomainsSchema()

    method_permission_name = MODEL_API_RW_METHOD_PERMISSION_MAP
    allow_browser_login = True
    class_permission_name = "AvailableDomains"
    resource_name = "available_domains"
    openapi_spec_tag = "Available Domains"
    openapi_spec_component_schemas = (AvailableDomainsSchema,)

    @expose("/", methods=("GET",))
    @protect()
    @safe
    @statsd_metrics
    @event_logger.log_this_with_context(
        action=lambda self, *args, **kwargs: f"{self.__class__.__name__}.get",
        log_to_statsd=True,
    )
    def get(self) -> Response:
        """
        Get the list of available Superset Webserver domains (if any)
        defined in config. This enables charts embedded in other apps to
        leverage domain sharding if appropriately configured.
        """
        result = self.available_domains_schema.dump(
            {"domains": conf.get("SUPERSET_WEBSERVER_DOMAINS")}
        )
        return self.response(200, result=result)
```

### Схема для сериализации данных

Схема для сериализации данных о доступных доменах:

```python
class AvailableDomainsSchema(Schema):
    domains = fields.List(fields.String())
```

### Клиентская часть

На стороне клиента функциональность доступных доменов реализована в файле `superset-frontend/src/utils/hostNamesConfig.js`:

```javascript
function getDomainsConfig() {
  const appContainer = document.getElementById('app');
  if (!appContainer) {
    return [];
  }

  const availableDomains = new Set([window.location.hostname]);

  // don't do domain sharding if a certain query param is set
  const disableDomainSharding =
    new URLSearchParams(window.location.search).get('disableDomainSharding') ===
    '1';
  if (disableDomainSharding) {
    return Array.from(availableDomains);
  }

  const bootstrapData = getBootstrapData();
  // this module is a little special, it may be loaded before index.jsx,
  // where window.featureFlags get initialized
  // eslint-disable-next-line camelcase
  initFeatureFlags(bootstrapData.common.feature_flags);

  if (bootstrapData?.common?.conf?.SUPERSET_WEBSERVER_DOMAINS) {
    bootstrapData.common.conf.SUPERSET_WEBSERVER_DOMAINS.forEach(hostName => {
      availableDomains.add(hostName);
    });
  }
  return Array.from(availableDomains);
}

export const availableDomains = getDomainsConfig();

export const allowCrossDomain = availableDomains.length > 1;
```

## API

### Получение списка доступных доменов

```
GET /api/v1/available_domains/
```

Возвращает список доменов, настроенных в конфигурации Superset.

Пример ответа:

```json
{
  "result": {
    "domains": ["domain1.example.com", "domain2.example.com"]
  }
}
```

### Настройка доменов в конфигурации

Для настройки доменов необходимо добавить следующий параметр в файл `superset_config.py`:

```python
SUPERSET_WEBSERVER_DOMAINS = ["domain1.example.com", "domain2.example.com"]
```

Это позволит использовать domain sharding для ускорения загрузки дашбордов с большим количеством элементов.
