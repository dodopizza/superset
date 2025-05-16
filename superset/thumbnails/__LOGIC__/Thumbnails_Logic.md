# Документация по миниатюрам (Thumbnails) в DODO

## Содержание

1. [Введение](#введение)
2. [Архитектура](#архитектура)
3. [Основные компоненты](#основные-компоненты)
   - [Генерация дайджестов](#генерация-дайджестов)
   - [Задачи для миниатюр](#задачи-для-миниатюр)
   - [Утилиты для скриншотов](#утилиты-для-скриншотов)
4. [DODO-специфичные модификации](#dodo-специфичные-модификации)
5. [Процесс создания миниатюр](#процесс-создания-миниатюр)
6. [Техническая реализация](#техническая-реализация)
7. [Примеры использования](#примеры-использования)

## Введение

Модуль `thumbnails` в Superset отвечает за генерацию и кэширование миниатюр (превью) для дашбордов и чартов. Миниатюры используются для предварительного просмотра дашбордов и чартов в интерфейсе Superset, что улучшает пользовательский опыт и ускоряет навигацию.

В DODO этот модуль используется для генерации миниатюр дашбордов и чартов, что позволяет пользователям быстро находить нужные аналитические материалы и предварительно оценивать их содержимое.

## Архитектура

Модуль `thumbnails` организован следующим образом:

1. **Основные файлы**:
   - `__init__.py` - инициализация модуля
   - `digest.py` - функции для генерации дайджестов (уникальных идентификаторов) для дашбордов и чартов

2. **Связанные модули**:
   - `tasks/thumbnails.py` - задачи Celery для асинхронной генерации миниатюр
   - `utils/screenshots.py` - утилиты для создания скриншотов
   - `utils/webdriver.py` - утилиты для работы с WebDriver
   - `cli/thumbnails.py` - команды CLI для генерации миниатюр

3. **Ключевые концепции**:
   - `digest` - уникальный идентификатор для дашборда или чарта, используемый для кэширования миниатюр
   - `cache_key` - ключ для хранения миниатюры в кэше
   - `executor_type` - тип исполнителя для генерации миниатюры (текущий пользователь, создатель, владелец и т.д.)

## Основные компоненты

### Генерация дайджестов

Модуль `digest.py` содержит функции для генерации дайджестов (уникальных идентификаторов) для дашбордов и чартов:

1. **get_dashboard_digest** - генерация дайджеста для дашборда:
   ```python
   def get_dashboard_digest(dashboard: Dashboard) -> str:
       config = current_app.config
       executor_type, executor = get_executor(
           executor_types=config["THUMBNAIL_EXECUTE_AS"],
           model=dashboard,
           current_user=get_current_user(),
       )
       if func := config["THUMBNAIL_DASHBOARD_DIGEST_FUNC"]:
           return func(dashboard, executor_type, executor)

       unique_string = (
           f"{dashboard.id}\n{dashboard.charts}\n{dashboard.position_json}\n"
           f"{dashboard.css}\n{dashboard.json_metadata}"
       )

       unique_string = _adjust_string_for_executor(unique_string, executor_type, executor)
       return md5_sha_from_str(unique_string)
   ```

2. **get_chart_digest** - генерация дайджеста для чарта:
   ```python
   def get_chart_digest(chart: Slice) -> str:
       config = current_app.config
       executor_type, executor = get_executor(
           executor_types=config["THUMBNAIL_EXECUTE_AS"],
           model=chart,
           current_user=get_current_user(),
       )
       if func := config["THUMBNAIL_CHART_DIGEST_FUNC"]:
           return func(chart, executor_type, executor)

       unique_string = f"{chart.params or ''}.{executor}"
       unique_string = _adjust_string_for_executor(unique_string, executor_type, executor)
       return md5_sha_from_str(unique_string)
   ```

3. **_adjust_string_for_executor** - корректировка строки для генерации дайджеста в зависимости от типа исполнителя:
   ```python
   def _adjust_string_for_executor(
       unique_string: str,
       executor_type: ExecutorType,
       executor: str,
   ) -> str:
       """
       Add the executor to the unique string if the thumbnail is
       user-specific.
       """
       if executor_type == ExecutorType.CURRENT_USER:
           # add the user id to the string to make it unique
           unique_string = f"{unique_string}\n{executor}"

       return unique_string
   ```

### Задачи для миниатюр

Модуль `tasks/thumbnails.py` содержит задачи Celery для асинхронной генерации миниатюр:

1. **cache_chart_thumbnail** - кэширование миниатюры чарта:
   ```python
   @celery_app.task(name="cache_chart_thumbnail", soft_time_limit=300)
   def cache_chart_thumbnail(
       current_user: Optional[str],
       chart_id: int,
       force: bool = False,
       window_size: Optional[WindowSize] = None,
       thumb_size: Optional[WindowSize] = None,
   ) -> None:
       # pylint: disable=import-outside-toplevel
       from superset.models.slice import Slice

       if not thumbnail_cache:
           logger.warning("No cache set, refusing to compute")
           return None
       chart = cast(Slice, Slice.get(chart_id))
       if not chart:
           logger.warning("No chart found, skip computing chart thumbnail")
           return None
       url = get_url_path("Superset.slice", slice_id=chart.id)
       logger.info("Caching chart: %s", url)
       _, username = get_executor(
           executor_types=current_app.config["THUMBNAIL_EXECUTE_AS"],
           model=chart,
           current_user=current_user,
       )
       user = security_manager.find_user(username)
       with override_user(user):
           screenshot = ChartScreenshot(url, chart.digest)
           screenshot.compute_and_cache(
               user=user,
               cache=thumbnail_cache,
               force=force,
               window_size=window_size,
               thumb_size=thumb_size,
           )
       return None
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
       user = security_manager.find_user(username)
       with override_user(user):
           screenshot = DashboardScreenshot(url, dashboard.digest)
           screenshot.compute_and_cache(
               user=user,
               cache=thumbnail_cache,
               force=force,
               window_size=window_size,
               thumb_size=thumb_size,
           )
   ```

3. **cache_dashboard_screenshot** - кэширование скриншота дашборда для встраивания:
   ```python
   @celery_app.task(name="cache_dashboard_screenshot", soft_time_limit=300)
   def cache_dashboard_screenshot(  # pylint: disable=too-many-arguments
       username: str,
       dashboard_id: int,
       dashboard_url: str,
       force: bool = True,
       guest_token: Optional[GuestToken] = None,
       thumb_size: Optional[WindowSize] = None,
       window_size: Optional[WindowSize] = None,
       cache_key: Optional[str] = None,
   ) -> None:
       # pylint: disable=import-outside-toplevel
       from superset.models.dashboard import Dashboard

       if not thumbnail_cache:
           logging.warning("No cache set, refusing to compute")
           return

       dashboard = Dashboard.get(dashboard_id)

       logger.info("Caching dashboard: %s", dashboard_url)

       # Requests from Embedded should always use the Guest user
       if guest_token:
           current_user = security_manager.get_guest_user_from_token(guest_token)
       else:
           _, exec_username = get_executor(
               executor_types=current_app.config["THUMBNAIL_EXECUTE_AS"],
               model=dashboard,
               current_user=username,
           )
           current_user = security_manager.find_user(exec_username)

       with override_user(current_user):
           screenshot = DashboardScreenshot(dashboard_url, dashboard.digest)
           screenshot.compute_and_cache(
               user=current_user,
               cache=thumbnail_cache,
               force=force,
               window_size=window_size,
               thumb_size=thumb_size,
               cache_key=cache_key,
           )
   ```

### Утилиты для скриншотов

Модуль `utils/screenshots.py` содержит утилиты для создания скриншотов:

1. **BaseScreenshot** - базовый класс для скриншотов:
   ```python
   class BaseScreenshot:
       thumbnail_cache: Cache = thumbnail_cache
       window_size: WindowSize = (800, 600)
       thumb_size: WindowSize = (400, 300)

       def __init__(
           self,
           url: str,
           digest: str,
           window_size: Optional[WindowSize] = None,
           thumb_size: Optional[WindowSize] = None,
       ):
           self.url = url
           self.digest = digest
           self.window_size = window_size or self.window_size
           self.thumb_size = thumb_size or self.thumb_size
   ```

2. **ChartScreenshot** - класс для скриншотов чартов:
   ```python
   class ChartScreenshot(BaseScreenshot):
       element = "chart-container"

       def get_screenshot(
           self,
           user: Optional[User] = None,
           cache: Optional[Cache] = None,
           thumb_size: Optional[WindowSize] = None,
       ) -> Optional[str]:
           url = self.url
           digest = self.digest
           window_size = self.window_size
           thumb_size = thumb_size or self.thumb_size
           cache_key = self.cache_key(window_size, thumb_size)
           cache = cache or thumbnail_cache

           screenshot = None
           if cache:
               screenshot = cache.get(cache_key)
           if not screenshot:
               self.get_driver().get_screenshot(
                   url, self.element, user=user, window_size=window_size
               )
               image = self.get_screenshot_obj(thumb_size)
               screenshot = self.get_screenshot_data(image)
               if cache and screenshot:
                   cache.set(cache_key, screenshot)
           return screenshot
   ```

3. **DashboardScreenshot** - класс для скриншотов дашбордов:
   ```python
   class DashboardScreenshot(BaseScreenshot):
       element = "dashboard-container"

       def get_screenshot(
           self,
           user: Optional[User] = None,
           cache: Optional[Cache] = None,
           thumb_size: Optional[WindowSize] = None,
       ) -> Optional[str]:
           url = self.url
           digest = self.digest
           window_size = self.window_size
           thumb_size = thumb_size or self.thumb_size
           cache_key = self.cache_key(window_size, thumb_size)
           cache = cache or thumbnail_cache

           screenshot = None
           if cache:
               screenshot = cache.get(cache_key)
           if not screenshot:
               self.get_driver().get_screenshot(
                   url, self.element, user=user, window_size=window_size
               )
               image = self.get_screenshot_obj(thumb_size)
               screenshot = self.get_screenshot_data(image)
               if cache and screenshot:
                   cache.set(cache_key, screenshot)
           return screenshot
   ```

## DODO-специфичные модификации

В DODO модуль `thumbnails` используется в основном в стандартном виде, без значительных модификаций. Однако, есть некоторые аспекты, которые могут быть специфичны для DODO:

1. **Интеграция с системой команд DODO**:
   - Миниатюры могут быть генерированы для дашбордов и чартов, специфичных для команд DODO
   - Доступ к миниатюрам может быть ограничен на основе принадлежности к команде

2. **Локализация**:
   - Интерфейс для работы с миниатюрами локализован на русский язык для пользователей DODO

3. **Интеграция с DODO-специфичными чартами**:
   - Миниатюры генерируются для DODO-специфичных чартов, таких как BigNumber с условным форматированием, BarDodo и BubbleDodo

## Процесс создания миниатюр

Процесс создания миниатюр в Superset включает следующие шаги:

1. **Генерация дайджеста**:
   - Для дашборда или чарта генерируется уникальный дайджест на основе его содержимого и исполнителя
   - Дайджест используется для кэширования миниатюры

2. **Создание скриншота**:
   - С помощью WebDriver (Selenium) создается скриншот дашборда или чарта
   - Скриншот масштабируется до размера миниатюры

3. **Кэширование миниатюры**:
   - Миниатюра сохраняется в кэше с использованием дайджеста в качестве ключа
   - Кэш может быть реализован с использованием различных бэкендов (Redis, Memcached, файловая система)

4. **Получение миниатюры**:
   - При запросе миниатюры она извлекается из кэша по дайджесту
   - Если миниатюра не найдена в кэше, она генерируется заново

## Техническая реализация

### Генерация дайджеста для дашборда

```python
def get_dashboard_digest(dashboard: Dashboard) -> str:
    config = current_app.config
    executor_type, executor = get_executor(
        executor_types=config["THUMBNAIL_EXECUTE_AS"],
        model=dashboard,
        current_user=get_current_user(),
    )
    if func := config["THUMBNAIL_DASHBOARD_DIGEST_FUNC"]:
        return func(dashboard, executor_type, executor)

    unique_string = (
        f"{dashboard.id}\n{dashboard.charts}\n{dashboard.position_json}\n"
        f"{dashboard.css}\n{dashboard.json_metadata}"
    )

    unique_string = _adjust_string_for_executor(unique_string, executor_type, executor)
    return md5_sha_from_str(unique_string)
```

### Кэширование миниатюры дашборда

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
    user = security_manager.find_user(username)
    with override_user(user):
        screenshot = DashboardScreenshot(url, dashboard.digest)
        screenshot.compute_and_cache(
            user=user,
            cache=thumbnail_cache,
            force=force,
            window_size=window_size,
            thumb_size=thumb_size,
        )
```

### Получение миниатюры

```python
def get(
    self,
    user: User = None,
    cache: Cache = None,
    thumb_size: WindowSize | None = None,
) -> BytesIO | None:
    """
        Get thumbnail screenshot has BytesIO from cache or fetch

    :param user: None to use current user or User Model to login and fetch
    :param cache: The cache to use
    :param thumb_size: Override thumbnail site
    """
    payload: bytes | None = None
    cache_key = self.cache_key(self.window_size, thumb_size)
    if cache:
        payload = cache.get(cache_key)
    if not payload:
        payload = self.compute_and_cache(
            user=user, thumb_size=thumb_size, cache=cache
        )
    else:
        logger.info("Loaded thumbnail from cache: %s", cache_key)
    if payload:
        return BytesIO(payload)
    return None
```

## Примеры использования

### Генерация миниатюры для чарта

```python
from superset.tasks.thumbnails import cache_chart_thumbnail

# Генерация миниатюры для чарта
cache_chart_thumbnail.delay(
    current_user="admin",
    chart_id=1,
    force=True,
)
```

### Генерация миниатюры для дашборда

```python
from superset.tasks.thumbnails import cache_dashboard_thumbnail

# Генерация миниатюры для дашборда
cache_dashboard_thumbnail.delay(
    current_user="admin",
    dashboard_id=1,
    force=True,
)
```

### Генерация миниатюр через CLI

```bash
# Генерация миниатюр для всех дашбордов
superset thumbnails --dashboards-only

# Генерация миниатюр для всех чартов
superset thumbnails --charts-only

# Генерация миниатюр для конкретных дашбордов
superset thumbnails --dashboards-only --model_id 1 --model_id 2

# Генерация миниатюр асинхронно
superset thumbnails --async
```

### Использование в DODO

В DODO модуль `thumbnails` используется для генерации миниатюр дашбордов и чартов. Примеры использования:

1. **Генерация миниатюр для DODO-специфичных дашбордов**:
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

2. **Генерация миниатюр для DODO-специфичных чартов**:
   ```python
   from superset.tasks.thumbnails import cache_chart_thumbnail

   # Генерация миниатюр для чартов DODO
   for chart_id in [1, 2, 3]:  # ID чартов DODO
       cache_chart_thumbnail.delay(
           current_user="admin",
           chart_id=chart_id,
           force=True,
       )
   ```

3. **Получение миниатюры дашборда**:
   ```python
   from superset.models.dashboard import Dashboard
   from superset.utils.screenshots import DashboardScreenshot
   from superset.utils.urls import get_url_path

   # Получение миниатюры дашборда
   dashboard = Dashboard.get(1)
   url = get_url_path("Superset.dashboard", dashboard_id_or_slug=dashboard.id)
   screenshot = DashboardScreenshot(url, dashboard.digest)
   image = screenshot.get(user=None, cache=thumbnail_cache)
   ```
