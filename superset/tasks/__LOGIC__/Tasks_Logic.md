# Документация по модулю Tasks в DODO

## Содержание

1. [Введение](#введение)
2. [Архитектура](#архитектура)
3. [Основные компоненты](#основные-компоненты)
   - [Асинхронные запросы](#асинхронные-запросы)
   - [Кэширование](#кэширование)
   - [Планировщик](#планировщик)
   - [Миниатюры](#миниатюры)
   - [Утилиты](#утилиты)
4. [DODO-специфичные модификации](#dodo-специфичные-модификации)
5. [Процесс выполнения задач](#процесс-выполнения-задач)
6. [Техническая реализация](#техническая-реализация)
7. [Примеры использования](#примеры-использования)

## Введение

Модуль `tasks` в Superset отвечает за выполнение асинхронных задач с использованием Celery. Он включает в себя задачи для кэширования данных, генерации миниатюр, выполнения запросов SQL и планирования отчетов.

В DODO этот модуль используется для обеспечения асинхронной обработки данных, что позволяет улучшить производительность и отзывчивость пользовательского интерфейса при работе с большими объемами данных.

## Архитектура

Модуль `tasks` организован следующим образом:

1. **Основные файлы**:
   - `__init__.py` - инициализация модуля
   - `async_queries.py` - задачи для асинхронного выполнения запросов
   - `cache.py` - задачи для кэширования данных
   - `celery_app.py` - настройка Celery
   - `cron_util.py` - утилиты для работы с cron-выражениями
   - `exceptions.py` - исключения для задач
   - `scheduler.py` - задачи для планировщика
   - `thumbnails.py` - задачи для генерации миниатюр
   - `types.py` - типы для задач
   - `utils.py` - утилиты для задач

2. **Связанные модули**:
   - `superset/extensions.py` - расширения Superset, включая Celery
   - `superset/utils/celery.py` - утилиты для работы с Celery
   - `superset/utils/screenshots.py` - утилиты для создания скриншотов

3. **Конфигурация**:
   - `superset_config.py` - конфигурация Celery и задач

## Основные компоненты

### Асинхронные запросы

Модуль `async_queries.py` содержит задачи для асинхронного выполнения запросов:

1. **load_chart_data_into_cache** - загрузка данных для чарта в кэш:
   ```python
   @celery_app.task(name="load_chart_data_into_cache", soft_time_limit=query_timeout)
   def load_chart_data_into_cache(
       job_metadata: dict[str, Any],
       form_data: dict[str, Any],
   ) -> None:
       # pylint: disable=import-outside-toplevel
       from superset.commands.chart.data.get_data_command import ChartDataCommand

       user = _load_user_from_job_metadata(job_metadata)
       with override_user(user):
           try:
               command = ChartDataCommand()
               result = command.run(form_data)
               async_query_manager.update_job(
                   job_metadata, async_query_manager.STATUS_DONE, result=result
               )
           except SoftTimeLimitExceeded as ex:
               logger.warning("A timeout occurred while loading chart data, error: %s", ex)
               raise
           except Exception as ex:
               # TODO: QueryContext should support SIP-40 style errors
               error = str(ex.message if hasattr(ex, "message") else ex)
               errors = [{"message": error}]
               async_query_manager.update_job(
                   job_metadata, async_query_manager.STATUS_ERROR, errors=errors
               )
               raise
   ```

2. **load_explore_json_into_cache** - загрузка данных для исследования в кэш:
   ```python
   @celery_app.task(name="load_explore_json_into_cache", soft_time_limit=query_timeout)
   def load_explore_json_into_cache(  # pylint: disable=too-many-locals
       job_metadata: dict[str, Any],
       form_data: dict[str, Any],
       response_type: str | None = None,
       force: bool = False,
   ) -> None:
       cache_key_prefix = "ejr-"  # ejr: explore_json request
       # ...
   ```

### Кэширование

Модуль `cache.py` содержит задачи для кэширования данных:

1. **cache_warmup** - прогрев кэша:
   ```python
   @celery_app.task(name="cache-warmup")
   def cache_warmup(
       strategy_name: str, *args: Any, **kwargs: Any
   ) -> dict[str, list[str]]:
       """
       Warm up cache based on a specific strategy.

       The cache-warmer strategy is a callable function that returns a list of
       DataFrames to be loaded into the cache.
       """
       # ...
   ```

2. **Стратегии прогрева кэша**:
   - `DummyStrategy` - прогрев всех чартов
   - `TopNDashboardsStrategy` - прогрев топ-N дашбордов
   - `DashboardTagsStrategy` - прогрев дашбордов с определенными тегами

### Планировщик

Модуль `scheduler.py` содержит задачи для планировщика:

1. **scheduler** - планировщик отчетов:
   ```python
   @celery_app.task(name="reports.scheduler")
   def scheduler() -> None:
       """
       Celery beat main scheduler for reports
       """
       with session_scope(nullpool=True) as session:
           scheduler_job = AsyncExecuteReportScheduleCommand(
               task_id=str(uuid.uuid4()), session=session
           )
           scheduler_job.run()
   ```

2. **prune_log** - очистка логов:
   ```python
   @celery_app.task(name="reports.prune_log")
   def prune_log() -> None:
       """
       Celery beat main scheduler for reports
       """
       with session_scope(nullpool=True) as session:
           prune_task = AsyncPruneReportScheduleLogCommand(
               task_id=str(uuid.uuid4()),
               session=session,
           )
           prune_task.run()
   ```

3. **prune_sql_lab_queries** - очистка запросов SQL Lab:
   ```python
   @celery_app.task(name="prune_sql_lab_queries")
   def prune_sql_lab_queries() -> None:
       """
       Celery beat task to prune SQL Lab queries
       """
       with session_scope(nullpool=True) as session:
           prune_task = QueryPruneCommand(session=session)
           prune_task.run()
   ```

### Миниатюры

Модуль `thumbnails.py` содержит задачи для генерации миниатюр:

1. **cache_chart_thumbnail** - кэширование миниатюры чарта:
   ```python
   @celery_app.task(name="cache_chart_thumbnail", soft_time_limit=300)
   def cache_chart_thumbnail(
       current_user: Optional[str],
       chart_id: int,
       force: bool = False,
       thumb_size: Optional[WindowSize] = None,
       window_size: Optional[WindowSize] = None,
   ) -> None:
       # pylint: disable=import-outside-toplevel
       from superset.models.slice import Slice

       if not thumbnail_cache:
           logging.warning("No cache set, refusing to compute")
           return

       chart = Slice.get(chart_id)
       url = get_url_path("Superset.explore", slice_id=chart.id)

       logger.info("Caching chart: %s", url)
       _, username = get_executor(
           executor_types=current_app.config["THUMBNAIL_EXECUTE_AS"],
           model=chart,
           current_user=current_user,
       )
       # ...
   ```

2. **cache_dashboard_thumbnail** - кэширование миниатюры дашборда:
   ```python
   @celery_app.task(name="cache_dashboard_thumbnail", soft_time_limit=300)
   def cache_dashboard_thumbnail(
       current_user: Optional[str],
       dashboard_id: int,
       force: bool = False,
       thumb_size: Optional[WindowSize] = None,
       window_size: Optional[WindowSize] = None,
   ) -> None:
       # pylint: disable=import-outside-toplevel
       from superset.models.dashboard import Dashboard

       if not thumbnail_cache:
           logging.warning("No cache set, refusing to compute")
           return

       dashboard = Dashboard.get(dashboard_id)
       url = get_url_path("Superset.dashboard", dashboard_id_or_slug=dashboard.id)

       logger.info("Caching dashboard: %s", url)
       _, username = get_executor(
           executor_types=current_app.config["THUMBNAIL_EXECUTE_AS"],
           model=dashboard,
           current_user=current_user,
       )
       # ...
   ```

### Утилиты

Модуль `utils.py` содержит утилиты для задач:

1. **get_executor** - получение исполнителя задачи:
   ```python
   def get_executor(
       executor_types: list[ExecutorType],
       model: Dashboard | Slice | ReportSchedule,
       current_user: Optional[str] = None,
   ) -> tuple[User, str]:
       """
       Return a tuple of (user, username) for a given model and list of executor types.
       """
       user: Optional[User] = None
       username: Optional[str] = None

       for executor_type in executor_types:
           if executor_type == ExecutorType.SELENIUM:
               # ...
           elif executor_type == ExecutorType.CREATOR:
               # ...
           elif executor_type == ExecutorType.OWNER:
               # ...
           elif executor_type == ExecutorType.CURRENT_USER:
               # ...
           elif executor_type == ExecutorType.MODIFIED_BY:
               # ...

       if not user:
           raise ExecutorNotFoundError()

       return user, username
   ```

2. **fetch_url** - получение URL:
   ```python
   @celery_app.task(name="fetch_url")
   def fetch_url(payload: str, headers: dict[str, str]) -> None:
       """
       Fetches a URL and returns the results
       """
       # ...
   ```

3. **fetch_csrf_token** - получение CSRF-токена:
   ```python
   def fetch_csrf_token() -> str:
       """
       Fetch CSRF token from login page
       """
       # ...
   ```

## DODO-специфичные модификации

В DODO модуль `tasks` используется в основном в стандартном виде, без значительных модификаций. Однако, есть некоторые аспекты, которые могут быть специфичны для DODO:

1. **Конфигурация Celery**:
   - В файле `superset_config.py` настроены параметры Celery для работы с Redis
   - Настроены периодические задачи для прогрева кэша, генерации отчетов и очистки логов

2. **Стратегии прогрева кэша**:
   - Используется стратегия `DashboardTagsStrategy` для прогрева дашбордов с определенными тегами, что может быть полезно для DODO-специфичных дашбордов

3. **Интеграция с системой команд DODO**:
   - Задачи могут быть настроены для работы с DODO-специфичными командами и пользователями

## Процесс выполнения задач

Процесс выполнения задач в Superset включает следующие шаги:

1. **Инициализация Celery**:
   - Celery инициализируется в файле `celery_app.py`
   - Настройки Celery загружаются из файла `superset_config.py`

2. **Регистрация задач**:
   - Задачи регистрируются с помощью декоратора `@celery_app.task`
   - Каждая задача имеет уникальное имя и может иметь ограничение по времени выполнения

3. **Выполнение задач**:
   - Задачи могут быть запущены синхронно или асинхронно
   - Асинхронные задачи выполняются в фоновом режиме с помощью Celery

4. **Обработка результатов**:
   - Результаты задач могут быть сохранены в кэше или базе данных
   - Ошибки обрабатываются и логируются

5. **Периодические задачи**:
   - Периодические задачи настраиваются в файле `superset_config.py`
   - Они выполняются по расписанию с помощью Celery Beat

## Техническая реализация

### Инициализация Celery

```python
def create_app(config_module: str) -> Flask:
    """
    Create a Flask app for Celery to use.
    """
    flask_app = Flask(__name__)
    try:
        flask_app.config.from_object(config_module)

        # Ensure that the configured secret key is not simply the default one.
        # If it is, it means that the config module didn't properly override it,
        # which could lead to security issues.
        if (
            flask_app.config["SECRET_KEY"] == "thisISaSECRET_1234"
            and flask_app.config["FLASK_ENV"] == "production"
        ):
            raise Exception(
                "Your production config should have a unique SECRET_KEY. "
                "The current one is insecure."
            )

        flask_app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    except Exception:
        # Ignore the case where the config module is not found or has syntax errors.
        # The user will find out later when the Flask app is actually run.
        pass

    with flask_app.app_context():
        flask_app = superset.initialize_flask_app(flask_app)

    return flask_app


flask_app = create_app(os.environ.get("SUPERSET_CONFIG", "superset.config"))
celery_app = flask_app.celery_app
```

### Выполнение асинхронного запроса

```python
@celery_app.task(name="load_chart_data_into_cache", soft_time_limit=query_timeout)
def load_chart_data_into_cache(
    job_metadata: dict[str, Any],
    form_data: dict[str, Any],
) -> None:
    # pylint: disable=import-outside-toplevel
    from superset.commands.chart.data.get_data_command import ChartDataCommand

    user = _load_user_from_job_metadata(job_metadata)
    with override_user(user):
        try:
            command = ChartDataCommand()
            result = command.run(form_data)
            async_query_manager.update_job(
                job_metadata, async_query_manager.STATUS_DONE, result=result
            )
        except SoftTimeLimitExceeded as ex:
            logger.warning("A timeout occurred while loading chart data, error: %s", ex)
            raise
        except Exception as ex:
            # TODO: QueryContext should support SIP-40 style errors
            error = str(ex.message if hasattr(ex, "message") else ex)
            errors = [{"message": error}]
            async_query_manager.update_job(
                job_metadata, async_query_manager.STATUS_ERROR, errors=errors
            )
            raise
```

### Прогрев кэша

```python
@celery_app.task(name="cache-warmup")
def cache_warmup(
    strategy_name: str, *args: Any, **kwargs: Any
) -> dict[str, list[str]]:
    """
    Warm up cache based on a specific strategy.

    The cache-warmer strategy is a callable function that returns a list of
    DataFrames to be loaded into the cache.
    """
    logger.info("Loading strategy: %s", strategy_name)
    try:
        strategy_class = next(
            strategy for strategy in strategies if strategy.name == strategy_name
        )
    except StopIteration as ex:
        raise StrategyNotFoundError(
            f"Unable to load strategy {strategy_name}"
        ) from ex

    try:
        strategy = strategy_class(*args, **kwargs)
    except TypeError as ex:
        logger.exception("Error loading strategy")
        raise StrategyCreateError() from ex

    try:
        user = security_manager.get_user_by_username(app.config["THUMBNAIL_SELENIUM_USER"])
        cookies = MachineAuthProvider.get_auth_cookies(user)
        headers = {
            "Cookie": f"session={cookies.get('session', '')}",
            "Content-Type": "application/json",
        }

        results: dict[str, list[str]] = {"scheduled": [], "errors": []}
        for payload in strategy.get_payloads():
            try:
                payload = json.dumps(payload)
                logger.info("Scheduling %s", payload)
                fetch_url.delay(payload, headers)
                results["scheduled"].append(payload)
            except SchedulingError:
                logger.exception("Error scheduling fetch_url for payload: %s", payload)
                results["errors"].append(payload)

        return results
    except Exception as ex:
        raise StrategyExecuteError() from ex
```

### Генерация миниатюры

```python
@celery_app.task(name="cache_chart_thumbnail", soft_time_limit=300)
def cache_chart_thumbnail(
    current_user: Optional[str],
    chart_id: int,
    force: bool = False,
    thumb_size: Optional[WindowSize] = None,
    window_size: Optional[WindowSize] = None,
) -> None:
    # pylint: disable=import-outside-toplevel
    from superset.models.slice import Slice

    if not thumbnail_cache:
        logging.warning("No cache set, refusing to compute")
        return

    chart = Slice.get(chart_id)
    url = get_url_path("Superset.explore", slice_id=chart.id)

    logger.info("Caching chart: %s", url)
    _, username = get_executor(
        executor_types=current_app.config["THUMBNAIL_EXECUTE_AS"],
        model=chart,
        current_user=current_user,
    )
    with override_user(security_manager.find_user(username=username)):
        screenshot = ChartScreenshot(
            url,
            chart.digest,
            force=force,
            thumb_size=thumb_size,
            window_size=window_size,
        )
        try:
            image_url = screenshot.get_screenshot()
            if image_url:
                logger.info("Thumbnail for chart %s is ready", chart_id)
        except Exception as ex:
            logger.error("Failed to compute thumbnail for chart %s", chart_id)
            logger.exception(ex)
```

## Примеры использования

### Асинхронное выполнение запроса

```python
from superset.tasks.async_queries import load_chart_data_into_cache

# Метаданные задачи
job_metadata = {
    "channel_id": "channel_1",
    "job_id": "job_1",
    "user_id": 1,
    "status": "pending",
}

# Данные формы
form_data = {
    "datasource": "1__table",
    "viz_type": "table",
    "granularity_sqla": "ds",
    "time_grain_sqla": "P1D",
    "metrics": ["sum__num"],
    "adhoc_filters": [],
    "groupby": ["name"],
    "row_limit": 10000,
}

# Запуск задачи
load_chart_data_into_cache.delay(job_metadata, form_data)
```

### Прогрев кэша

```python
from superset.tasks.cache import cache_warmup

# Прогрев кэша для топ-10 дашбордов за последние 7 дней
cache_warmup.delay(
    strategy_name="top_n_dashboards",
    top_n=10,
    since="7 days ago",
)

# Прогрев кэша для дашбордов с определенными тегами
cache_warmup.delay(
    strategy_name="dashboard_tags",
    tags=["core", "finance", "sales"],
)
```

### Генерация миниатюры

```python
from superset.tasks.thumbnails import cache_chart_thumbnail, cache_dashboard_thumbnail

# Генерация миниатюры для чарта
cache_chart_thumbnail.delay(
    current_user="admin",
    chart_id=1,
    force=True,
)

# Генерация миниатюры для дашборда
cache_dashboard_thumbnail.delay(
    current_user="admin",
    dashboard_id=1,
    force=True,
)
```

### Использование в DODO

В DODO модуль `tasks` используется для обеспечения асинхронной обработки данных. Примеры использования:

1. **Прогрев кэша для DODO-специфичных дашбордов**:
   ```python
   from superset.tasks.cache import cache_warmup

   # Прогрев кэша для дашбордов с тегами DODO
   cache_warmup.delay(
       strategy_name="dashboard_tags",
       tags=["dodo", "sales", "finance"],
   )
   ```

2. **Генерация миниатюр для DODO-специфичных дашбордов**:
   ```python
   from superset.tasks.thumbnails import cache_dashboard_thumbnail

   # Генерация миниатюр для дашбордов DODO
   for dashboard_id in [1, 2, 3]:  # ID дашбордов DODO
       cache_dashboard_thumbnail.delay(
           current_user="admin",
           dashboard_id=dashboard_id,
           force=True,
       )
   ```

3. **Асинхронное выполнение запросов для DODO-специфичных чартов**:
   ```python
   from superset.tasks.async_queries import load_chart_data_into_cache

   # Метаданные задачи
   job_metadata = {
       "channel_id": "channel_dodo",
       "job_id": "job_dodo",
       "user_id": 1,
       "status": "pending",
   }

   # Данные формы для DODO-специфичного чарта
   form_data = {
       "datasource": "1__table",
       "viz_type": "table",
       "granularity_sqla": "ds",
       "time_grain_sqla": "P1D",
       "metrics": ["sum__sales"],
       "adhoc_filters": [],
       "groupby": ["region"],
       "row_limit": 10000,
   }

   # Запуск задачи
   load_chart_data_into_cache.delay(job_metadata, form_data)
   ```
