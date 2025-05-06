# Документация по расширениям (Extensions) в DODO

## Содержание

1. [Введение](#введение)
2. [Архитектура](#архитектура)
3. [Основные расширения](#основные-расширения)
   - [UIManifestProcessor](#uimanifestprocessor)
   - [ProfilingExtension](#profilingextension)
   - [MetaDB](#metadb)
   - [MetastoreCache](#metastorecache)
   - [SSH](#ssh)
   - [StatsLogger](#statslogger)
4. [DODO-специфичная функциональность](#dodo-специфичная-функциональность)
5. [Техническая реализация](#техническая-реализация)
6. [Примеры использования](#примеры-использования)

## Введение

Модуль `extensions` содержит различные расширения для Superset, которые обеспечивают дополнительную функциональность, такую как обработка манифестов UI, профилирование, метабаза данных, кэширование метаданных, SSH-подключения и логирование статистики.

В DODO этот модуль используется в стандартном виде, без значительных модификаций, но с некоторыми настройками, специфичными для DODO.

## Архитектура

Модуль `extensions` организован следующим образом:

1. **Основной файл** (`__init__.py`):
   - Определяет основные расширения и их инициализацию
   - Создает глобальные экземпляры расширений для использования в приложении

2. **Отдельные расширения**:
   - `metadb.py` - расширение для работы с метабазой данных
   - `metastore_cache.py` - расширение для кэширования метаданных
   - `pylint.py` - расширение для интеграции с Pylint
   - `ssh.py` - расширение для работы с SSH-подключениями
   - `stats_logger.py` - расширение для логирования статистики

## Основные расширения

### UIManifestProcessor

**Описание**: Расширение для обработки манифестов UI, которые содержат информацию о JavaScript и CSS файлах, необходимых для отображения интерфейса.

**Основные функции**:
- Загрузка и парсинг манифеста из JSON-файла
- Предоставление функций для получения списка файлов для конкретного бандла
- Регистрация процессора в контексте шаблонов Flask

**Пример использования**:
```python
manifest_processor = UIManifestProcessor(APP_DIR)
manifest_processor.init_app(app)
```

### ProfilingExtension

**Описание**: Расширение для профилирования производительности приложения.

**Основные функции**:
- Обертывание WSGI-приложения для профилирования запросов
- Сбор статистики о времени выполнения запросов

**Пример использования**:
```python
profiling = ProfilingExtension()
profiling.init_app(app)
```

### MetaDB

**Описание**: Расширение для работы с метабазой данных, которая позволяет выполнять запросы к различным базам данных, настроенным в Superset.

**Основные функции**:
- Предоставление диалекта SQLAlchemy для работы с метабазой
- Поддержка запросов к различным базам данных через единый интерфейс
- Обработка соединений и транзакций

**Пример использования**:
```python
from sqlalchemy import create_engine
engine = create_engine('superset://')
conn = engine.connect()
results = conn.execute('SELECT * FROM "examples.birth_names"')
```

### MetastoreCache

**Описание**: Расширение для кэширования метаданных, таких как схемы таблиц, колонки и т.д.

**Основные функции**:
- Кэширование метаданных для ускорения доступа
- Управление временем жизни кэша
- Инвалидация кэша при изменении метаданных

**Пример использования**:
```python
from superset.extensions import metastore_cache
metastore_cache.get('key')
metastore_cache.set('key', value, timeout=3600)
```

### SSH

**Описание**: Расширение для работы с SSH-подключениями, которые используются для доступа к базам данных через SSH-туннели.

**Основные функции**:
- Создание и управление SSH-туннелями
- Аутентификация по ключу или паролю
- Обработка ошибок подключения

**Пример использования**:
```python
from superset.extensions import ssh_manager
tunnel = ssh_manager.create_tunnel(
    host='remote_host',
    port=22,
    username='user',
    password='password',
    remote_host='db_host',
    remote_port=5432,
    local_port=6543
)
```

### StatsLogger

**Описание**: Расширение для логирования статистики, такой как количество запросов, время выполнения и т.д.

**Основные функции**:
- Логирование различных метрик
- Поддержка различных бэкендов для логирования (консоль, файл, StatsD и т.д.)
- Агрегация и анализ статистики

**Пример использования**:
```python
from superset.extensions import stats_logger
stats_logger.incr('my_counter')
stats_logger.timing('my_timer', value)
```

## DODO-специфичная функциональность

В результате анализа кода **не обнаружено прямых DODO-специфичных изменений или расширений** в модуле `extensions`. Весь код в этом модуле является стандартным для Superset.

Однако, в DODO модуль `extensions` используется для интеграции с другими системами DODO, такими как:

1. **Интеграция с Kusto**: Модуль `metadb.py` используется для работы с Kusto через SQLAlchemy.

2. **Настройка SSH-туннелей**: Модуль `ssh.py` используется для настройки SSH-туннелей для доступа к базам данных DODO.

3. **Логирование статистики**: Модуль `stats_logger.py` используется для логирования статистики использования Superset в DODO.

## Техническая реализация

### UIManifestProcessor

```python
class UIManifestProcessor:
    def __init__(self, app_dir: str) -> None:
        self.app: Optional[Flask] = None
        self.manifest: dict[str, dict[str, list[str]]] = {}
        self.manifest_file = f"{app_dir}/static/assets/manifest.json"

    def init_app(self, app: Flask) -> None:
        self.app = app
        # Preload the cache
        self.parse_manifest_json()
        self.register_processor(app)

    def register_processor(self, app: Flask) -> None:
        app.template_context_processors[None].append(self.get_manifest)

    def get_manifest(self) -> dict[str, Callable[[str], list[str]]]:
        loaded_chunks = set()

        def get_files(bundle: str, asset_type: str = "js") -> list[str]:
            files = self.get_manifest_files(bundle, asset_type)
            filtered_files = [f for f in files if f not in loaded_chunks]
            for f in filtered_files:
                loaded_chunks.add(f)
            return filtered_files

        return {
            "js_manifest": lambda bundle: get_files(bundle, "js"),
            "css_manifest": lambda bundle: get_files(bundle, "css"),
            "assets_prefix": (
                self.app.config["STATIC_ASSETS_PREFIX"] if self.app else ""
            ),
        }

    def parse_manifest_json(self) -> None:
        try:
            with open(self.manifest_file) as f:
                # the manifest includes non-entry files we only need entries in
                # templates
                full_manifest = json.load(f)
                self.manifest = full_manifest.get("entrypoints", {})
        except Exception:  # pylint: disable=broad-except
            pass

    def get_manifest_files(self, bundle: str, asset_type: str) -> list[str]:
        if self.app and self.app.debug:
            self.parse_manifest_json()
        return self.manifest.get(bundle, {}).get(asset_type, [])
```

### ProfilingExtension

```python
class ProfilingExtension:  # pylint: disable=too-few-public-methods
    def __init__(self, interval: float = 1e-4) -> None:
        self.interval = interval

    def init_app(self, app: Flask) -> None:
        app.wsgi_app = SupersetProfiler(app.wsgi_app, self.interval)
```

### SupersetShillelaghAdapter (из metadb.py)

```python
class SupersetShillelaghAdapter(ShillelaghAdapter):
    """
    Adapter for querying Superset tables.

    This adapter allows users to query any table in any database that has been
    configured in Superset. For example, to read data from the `birth_names` table
    in the `examples` databases:

        >>> engine = create_engine('superset://')
        >>> conn = engine.connect()
        >>> results = conn.execute('SELECT * FROM "examples.birth_names"')

    The syntax for tables is:

        database[[.catalog].schema].table

    The adapter will use the current user permissions to determine if they have
    access to the table.
    """

    safe = True
    supports_limit = True
    supports_offset = True
    supports_rowid = True

    def __init__(
        self,
        database: str,
        catalog: str | None = None,
        schema: str | None = None,
        table: str | None = None,
        **kwargs: Any,
    ) -> None:
        super().__init__(**kwargs)

        self.database = database
        self.catalog = catalog
        self.schema = schema
        self.table = table
        self._rowid: bool = False
```

## Примеры использования

### Использование UIManifestProcessor

```python
# Инициализация UIManifestProcessor
manifest_processor = UIManifestProcessor(APP_DIR)
manifest_processor.init_app(app)

# Использование в шаблоне
{% for js_file in js_manifest('app') %}
  <script src="{{ js_file }}"></script>
{% endfor %}

{% for css_file in css_manifest('app') %}
  <link rel="stylesheet" href="{{ css_file }}">
{% endfor %}
```

### Использование ProfilingExtension

```python
# Инициализация ProfilingExtension
profiling = ProfilingExtension()
profiling.init_app(app)

# Профилирование происходит автоматически при обработке запросов
```

### Использование MetaDB

```python
# Создание подключения к метабазе
from sqlalchemy import create_engine
engine = create_engine('superset://')
conn = engine.connect()

# Выполнение запроса к таблице в базе данных examples
results = conn.execute('SELECT * FROM "examples.birth_names"')

# Выполнение запроса с соединением таблиц из разных баз данных
results = conn.execute('''
    SELECT a.name, b.value
    FROM "examples.birth_names" a
    JOIN "another_db.another_table" b ON a.id = b.id
''')
```

### Использование SSH

```python
# Создание SSH-туннеля
from superset.extensions import ssh_manager
tunnel = ssh_manager.create_tunnel(
    host='remote_host',
    port=22,
    username='user',
    password='password',
    remote_host='db_host',
    remote_port=5432,
    local_port=6543
)

# Использование туннеля
with tunnel:
    # Подключение к базе данных через туннель
    engine = create_engine('postgresql://user:password@localhost:6543/db')
    conn = engine.connect()
    results = conn.execute('SELECT * FROM table')
```

### Использование StatsLogger

```python
# Инкремент счетчика
from superset.extensions import stats_logger
stats_logger.incr('my_counter')

# Логирование времени выполнения
start_time = time.time()
# ... выполнение операции ...
end_time = time.time()
stats_logger.timing('my_timer', end_time - start_time)

# Логирование значения метрики
stats_logger.gauge('my_gauge', value)
```
