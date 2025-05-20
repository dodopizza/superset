# Документация по утилитам (Utils) в DODO

## Содержание

1. [Введение](#введение)
2. [Архитектура](#архитектура)
3. [Основные компоненты](#основные-компоненты)
   - [Утилиты для работы с датами и временем](#утилиты-для-работы-с-датами-и-временем)
   - [Утилиты для работы с кэшем](#утилиты-для-работы-с-кэшем)
   - [Утилиты для работы с JSON](#утилиты-для-работы-с-json)
   - [Утилиты для работы с скриншотами](#утилиты-для-работы-с-скриншотами)
   - [Утилиты для работы с Slack](#утилиты-для-работы-с-slack)
   - [Утилиты для работы с WebDriver](#утилиты-для-работы-с-webdriver)
   - [Утилиты для работы с Pandas](#утилиты-для-работы-с-pandas)
4. [DODO-специфичные модификации](#dodo-специфичные-модификации)
   - [Утилиты для работы с аннотациями](#утилиты-для-работы-с-аннотациями)
   - [Утилиты для работы с API](#утилиты-для-работы-с-api)
   - [Утилиты для работы с локализацией](#утилиты-для-работы-с-локализацией)
   - [Прочие модификации](#прочие-модификации)
5. [Техническая реализация](#техническая-реализация)
6. [Примеры использования](#примеры-использования)

## Введение

Модуль `utils` в Superset содержит различные утилиты, которые используются в разных частях приложения. Эти утилиты предоставляют функциональность для работы с датами, кэшем, JSON, скриншотами, Slack и другими компонентами.

В DODO этот модуль был расширен дополнительными утилитами для работы с аннотациями, API и локализацией, а также другими DODO-специфичными функциями.

## Архитектура

Модуль `utils` организован следующим образом:

1. **Основные файлы**:
   - `__init__.py` - инициализация модуля
   - `core.py` - основные утилиты
   - `date_parser.py` - утилиты для работы с датами
   - `cache.py` - утилиты для работы с кэшем
   - `json.py` - утилиты для работы с JSON
   - `screenshots.py` - утилиты для работы с скриншотами
   - `slack.py` - утилиты для работы с Slack
   - `webdriver.py` - утилиты для работы с WebDriver

2. **Поддиректории**:
   - `pandas_postprocessing` - утилиты для постобработки данных с использованием Pandas

3. **Фронтенд-утилиты**:
   - `superset-frontend/src/DodoExtensions/utils` - DODO-специфичные утилиты для фронтенда
   - `superset-frontend/packages/superset-ui-core/src/DodoExtensions` - DODO-специфичные утилиты для ядра

## Основные компоненты

### Утилиты для работы с датами и временем

Модуль `date_parser.py` содержит утилиты для работы с датами и временем:

1. **parse_human_timedelta** - парсинг человекочитаемого представления временного интервала:
   ```python
   def parse_human_timedelta(
       human_readable: str | None, source_time: datetime | None = None
   ) -> tuple[datetime | None, datetime | None]:
       """
       Parse a human-readable timedelta (e.g. '1 day').

       Returns a tuple of datetime objects: (start_dttm, end_dttm)
       """
       if not human_readable:
           return None, None

       source_time = source_time or datetime.now()
       cal = parsedatetime.Calendar()
       source_dttm = datetime(
           source_time.year,
           source_time.month,
           source_time.day,
           source_time.hour,
           source_time.minute,
           source_time.second,
       )
       try:
           dttm_obj, parsed_flags, _ = cal.parseDT(
               human_readable, source_dttm, tzinfo=source_time.tzinfo
           )
           if parsed_flags == 0:
               return None, None
           return dttm_obj, source_time
       except Exception as ex:
           raise ValueError(f"Parsing {human_readable} failed: {ex}") from ex
   ```

2. **DateRangeMigration** - класс для миграции диапазонов дат:
   ```python
   class DateRangeMigration:
       """
       Helper class for migrating from legacy datetime filters to new ones.
       """

       x_dateunit_map = {
           "date": "P1D",
           "week": "P1W",
           "week_ending_saturday": "P1W",
           "week_starting_sunday": "P1W",
           "month": "P1M",
           "quarter": "P3M",
           "year": "P1Y",
       }

       x_dateunit_to_duration = {
           "date": "day",
           "week": "week",
           "week_ending_saturday": "week",
           "week_starting_sunday": "week",
           "month": "month",
           "quarter": "quarter",
           "year": "year",
       }
   ```

### Утилиты для работы с кэшем

Модуль `cache.py` содержит утилиты для работы с кэшем:

1. **memoized** - декоратор для кэширования результатов функций:
   ```python
   def memoized(func: Callable[..., Any] | None = None, **kwargs: Any) -> Any:
       """
       Use this decorator to cache functions that don't need fresh data every time.

       The arguments must be hashable for this to work.
       """
       cache_key_wrapper = kwargs.pop("key", lambda *args, **kwargs: str(args) + str(kwargs))
       cache_key_func = kwargs.pop("cache_key_func", None)
       enable_cache = kwargs.pop("enable_cache", lambda: True)
       default_timeout = kwargs.pop("default_timeout", None)
       stats_key = kwargs.pop("stats_key", None)

       def wrap(f: Callable[..., Any]) -> Callable[..., Any]:
           if not enable_cache():
               return f

           cache_on_arguments = cache.memoize(
               timeout=default_timeout, key_prefix=stats_key, cache_key_func=cache_key_func
           )
           return cache_on_arguments(f)

       if func:
           return wrap(func)

       return wrap
   ```

2. **CacheManager** - класс для управления кэшем:
   ```python
   class CacheManager:
       """
       Class for managing multiple cache instances across the app
       """

       def __init__(self) -> None:
           super().__init__()
           self._cache = cache
           self._data_cache = None
           self._thumbnail_cache = None
           self._filter_state_cache = None
           self._explore_form_data_cache = None

       @property
       def data_cache(self) -> Cache:
           return self._data_cache or self._cache

       @data_cache.setter
       def data_cache(self, data_cache: Cache) -> None:
           self._data_cache = data_cache

       @property
       def thumbnail_cache(self) -> Cache:
           return self._thumbnail_cache or self._cache

       @thumbnail_cache.setter
       def thumbnail_cache(self, thumbnail_cache: Cache) -> None:
           self._thumbnail_cache = thumbnail_cache

       @property
       def filter_state_cache(self) -> Cache:
           return self._filter_state_cache or self._cache

       @filter_state_cache.setter
       def filter_state_cache(self, filter_state_cache: Cache) -> None:
           self._filter_state_cache = filter_state_cache

       @property
       def explore_form_data_cache(self) -> Cache:
           return self._explore_form_data_cache or self._cache

       @explore_form_data_cache.setter
       def explore_form_data_cache(self, explore_form_data_cache: Cache) -> None:
           self._explore_form_data_cache = explore_form_data_cache
   ```

### Утилиты для работы с JSON

Модуль `json.py` содержит утилиты для работы с JSON:

1. **json_dumps_w_dates** - сериализация объектов в JSON с поддержкой дат:
   ```python
   def json_dumps_w_dates(payload: dict[Any, Any] | list[Any], sort_keys: bool = False) -> str:
       """
       Dump payload to json with encoding dates.

       :param payload: json payload
       :param sort_keys: sort json output
       :return: json string
       """
       return json.dumps(
           payload,
           default=json_int_dttm_ser,
           ignore_nan=True,
           sort_keys=sort_keys,
       )
   ```

2. **json_iso_dttm_ser** - сериализация дат в ISO формат:
   ```python
   def json_iso_dttm_ser(obj: Any, pessimistic: bool = False) -> str | None:
       """
       json serializer that deals with dates.

       >>> dttm = datetime(1970, 1, 1)
       >>> json.dumps({'dttm': dttm}, default=json_iso_dttm_ser)
       '{"dttm": "1970-01-01T00:00:00"}'
       """
       if isinstance(obj, (datetime, date, time, pd.Timestamp)):
           return obj.isoformat()
       if isinstance(obj, pd.Timedelta):
           return obj.to_json()
       if pessimistic and isinstance(obj, numbers.Number):
           return str(obj)
       raise TypeError(f"Unserializable object {obj} of type {type(obj)}")
   ```

### Утилиты для работы с скриншотами

Модуль `screenshots.py` содержит утилиты для работы с скриншотами:

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

### Утилиты для работы с Slack

Модуль `slack.py` содержит утилиты для работы с Slack:

1. **SlackClient** - клиент для работы с Slack:
   ```python
   class SlackClient:
       def __init__(self, token: str) -> None:
           self.token = token

       def get_user_avatar(self, user_id: str) -> str:
           """
           Get the avatar URL for a Slack user.
           """
           try:
               response = requests.get(
                   "https://slack.com/api/users.info",
                   params={"token": self.token, "user": user_id},
               )
               response.raise_for_status()
               data = response.json()
               if not data.get("ok"):
                   raise SlackClientError(data.get("error", "Unknown error"))
               return data["user"]["profile"]["image_192"]
           except (requests.exceptions.RequestException, KeyError) as ex:
               raise SlackClientError(str(ex)) from ex
   ```

### Утилиты для работы с WebDriver

Модуль `webdriver.py` содержит утилиты для работы с WebDriver:

1. **WebDriverProxy** - прокси для WebDriver:
   ```python
   class WebDriverProxy:
       """
       Proxy driver for WebDriver.
       """

       def __init__(self) -> None:
           self._driver: Optional[WebDriver] = None

       def get_driver(self) -> WebDriver:
           """
           Get a WebDriver instance.
           """
           if self._driver is None:
               self._driver = get_webdriver()
           return self._driver

       def close(self) -> None:
           """
           Close the WebDriver instance.
           """
           if self._driver is not None:
               self._driver.quit()
               self._driver = None
   ```

2. **WebDriverSelenium** - класс для работы с Selenium WebDriver:
   ```python
   class WebDriverSelenium:
       """
       Selenium WebDriver implementation.
       """

       def __init__(self, driver_type: str) -> None:
           self.driver_type = driver_type

       def get_screenshot(
           self,
           url: str,
           element_name: str,
           user: Optional[User] = None,
           window_size: Optional[WindowSize] = None,
       ) -> bytes:
           """
           Get a screenshot of the element.
           """
           driver = self._get_driver()
           self._authenticate(driver, url, user)
           try:
               self._get_url(driver, url)
               self._set_window_size(driver, window_size)
               element = self._find_element(driver, element_name)
               return self._take_screenshot(element)
           finally:
               driver.quit()
   ```

### Утилиты для работы с Pandas

Модуль `pandas_postprocessing` содержит утилиты для постобработки данных с использованием Pandas:

1. **NUMPY_FUNCTIONS** - словарь функций NumPy:
   ```python
   NUMPY_FUNCTIONS: dict[str, Callable[..., Any]] = {
       "average": np.average,
       "argmin": np.argmin,
       "argmax": np.argmax,
       "count": np.ma.count,
       "count_nonzero": np.count_nonzero,
       "cumsum": np.cumsum,
       "cumprod": np.cumprod,
       "max": np.max,
       "mean": np.mean,
       "median": np.median,
       "nansum": np.nansum,
       "nanmin": np.nanmin,
       "nanmax": np.nanmax,
       "nanmean": np.nanmean,
       "nanmedian": np.nanmedian,
       "nanpercentile": np.nanpercentile,
       "min": np.min,
       "percentile": np.percentile,
       "prod": np.prod,
       "product": np.product,
       "std": np.std,
       "sum": np.sum,
       "var": np.var,
   }
   ```

2. **validate_column_args** - декоратор для валидации аргументов колонок:
   ```python
   def validate_column_args(*argnames: str) -> Callable[..., Any]:
       def wrapper(func: Callable[..., Any]) -> Callable[..., Any]:
           def wrapped(df: DataFrame, **options: Any) -> Any:
               if _is_multi_index_on_columns(df):
                   # MultiIndex column validate first level
                   columns = df.columns.get_level_values(0)
               else:
                   columns = df.columns.tolist()
               for name in argnames:
                   if name in options and not all(
                       elem in columns for elem in scalar_to_sequence(options.get(name))
                   ):
                       raise InvalidPostProcessingError(
                           _("Referenced columns not available in DataFrame.")
                       )
               return func(df, **options)

           return wrapped

       return wrapper
   ```

## DODO-специфичные модификации

### Утилиты для работы с аннотациями

В DODO были добавлены утилиты для работы с аннотациями в файле `superset-frontend/src/DodoExtensions/utils/annotationUtils.ts`:

```typescript
// DODO was here
// DODO created 44611022
import {
  getAnnotationLayersData,
  getSingleAnnotationData,
  getSingleAnnotationLayerIdsData,
} from '../../Superstructure/Root/utils';
import {
  AnnotationLayer,
  InitializedResponse,
  SingleAnnotation,
} from '../../Superstructure/types/global';

type AnnotationsRequestDto = Array<
  InitializedResponse<{ result: SingleAnnotation } | null>
>;

const ALERT_PREFIX = '[ALERT]';

const handleAnnotationLayersRequest = async () => {
  const annotationsResponse = await getAnnotationLayersData();

  if (annotationsResponse.loaded && annotationsResponse.data) {
    const filteredAnnotationLayers = annotationsResponse.data.filter(
      (layer: AnnotationLayer) => layer.name.includes(ALERT_PREFIX),
    );

    const foundAnnotationLayer = filteredAnnotationLayers[0] || null;

    if (foundAnnotationLayer) {
      const idsResponse = await getSingleAnnotationLayerIdsData(
        foundAnnotationLayer.id,
      );

      if (
        idsResponse?.loaded &&
        idsResponse.data?.ids &&
        idsResponse.data?.ids.length
      ) {
        const dataWithIds = {
          layerId: idsResponse.data.layerId,
          ids: idsResponse.data.ids,
        };

        return dataWithIds;
      }

      return null;
    }

    return null;
  }

  return null;
};

const handleAnnotationsRequest = async ({
  layerId,
  ids,
}: {
  layerId: number;
  ids: number[];
}): Promise<InitializedResponse<{ result: SingleAnnotation } | null>[]> =>
  Promise.all(
    ids.map(
      async (
        id,
      ): Promise<InitializedResponse<{ result: SingleAnnotation } | null>> =>
        getSingleAnnotationData(layerId, id),
    ),
  );

const loadAnnotations = async (): Promise<AnnotationsRequestDto | null> => {
  const annotationIds = await handleAnnotationLayersRequest();

  if (annotationIds) {
    const annotations = await handleAnnotationsRequest(annotationIds);
    if (annotations?.length) {
      return annotations.filter(
        annotation =>
          annotation?.data?.result.short_descr.includes(ALERT_PREFIX),
      );
    }
  }

  return null;
};

const loadAnnotationMessages = async (): Promise<Array<SingleAnnotation>> => {
  const annotations = (await loadAnnotations()) ?? [];

  const result: Array<SingleAnnotation> = [];
  annotations.forEach(item => {
    if (item?.data !== null) {
      result.push(item.data.result);
    }
  });

  return result;
};

export { handleAnnotationsRequest, loadAnnotations, loadAnnotationMessages };
export type { AnnotationsRequestDto };
```

Эти утилиты используются для загрузки аннотаций и сообщений аннотаций из API.

### Утилиты для работы с API

В DODO были добавлены утилиты для работы с API в файле `superset-frontend/packages/superset-ui-core/src/DodoExtensions/api/utils.ts`:

```typescript
// DODO was here
// DODO added 44611022
import { AxiosRequestConfig } from 'axios';

const logger = (params: AxiosRequestConfig, isEnabled = false) => {
  if (isEnabled) {
    console.groupCollapsed(`${params.url} [${params.method}]`);
    console.log('data', params.data);
    console.log('data JSON:', JSON.stringify(params.data));
    console.log('headers', params.headers);
    console.log('headers JSON:', JSON.stringify(params.headers));
    console.groupEnd();
  }
};

const handleCsrfToken = (csrfToken: string) => {
  const csrfOnThePage = document.getElementById('csrf_token');

  if (!csrfOnThePage) {
    const csrfTokenElement = document.createElement('input');
    csrfTokenElement.type = 'hidden';
    csrfTokenElement.name = 'csrf_token';
    csrfTokenElement.value = csrfToken;
    csrfTokenElement.id = 'csrf_token';
    document.body.appendChild(csrfTokenElement);
  } else {
    csrfOnThePage.setAttribute('value', csrfToken);
  }
};

export { logger, handleCsrfToken };
```

Эти утилиты используются для логирования запросов к API и обработки CSRF-токенов.

### Утилиты для работы с локализацией

В DODO были добавлены утилиты для работы с локализацией в файле `superset-frontend/packages/superset-ui-core/src/DodoExtensions/time-format/utils/dttmToMoment.ts`:

```typescript
// DODO created 44211759
import moment, { Moment } from 'moment';

export const dttmToMoment = (dttm: string): Moment => {
  if (dttm === 'now') {
    return moment().utc().startOf('second');
  }
  if (dttm === 'today') {
    return moment().utc().startOf('day');
  }
  return moment(dttm);
};
```

Эта функция используется для преобразования строки даты/времени в объект Moment.

### Прочие модификации

В DODO были добавлены и другие утилиты:

1. **dirtyHackDodoIs** - функция для исправления проблемы с CSS-свойством min-height в элементе div.all:
   ```typescript
   const dirtyHackDodoIs = () => {
     // In dodois the div.all has css property min-height, that forces the footer to be overlapped
     const dodoElementAll = document.getElementsByClassName('all')[0];

     if (dodoElementAll?.classList.contains('overwrite-height')) {
       dodoElementAll.classList.remove('overwrite-height');
     }
   };
   ```

2. **extractDatasourceDescriptions** - функция для извлечения описаний источников данных:
   ```typescript
   // DODO was here
   // DODO created 44728892
   export * from './extractDatasourceDescriptions';
   ```

## Техническая реализация

### Утилиты для работы с аннотациями

```typescript
const loadAnnotationMessages = async (): Promise<Array<SingleAnnotation>> => {
  const annotations = (await loadAnnotations()) ?? [];

  const result: Array<SingleAnnotation> = [];
  annotations.forEach(item => {
    if (item?.data !== null) {
      result.push(item.data.result);
    }
  });

  return result;
};
```

### Утилиты для работы с API

```typescript
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
```

### Утилиты для работы с локализацией

```typescript
export const dttmToMoment = (dttm: string): Moment => {
  if (dttm === 'now') {
    return moment().utc().startOf('second');
  }
  if (dttm === 'today') {
    return moment().utc().startOf('day');
  }
  return moment(dttm);
};
```

## Примеры использования

### Использование утилит для работы с аннотациями

```typescript
import { loadAnnotationMessages } from 'src/DodoExtensions/utils/annotationUtils';

// Загрузка сообщений аннотаций
const loadMessages = async () => {
  const messages = await loadAnnotationMessages();
  console.log('Annotation messages:', messages);
};

loadMessages();
```

### Использование утилит для работы с API

```typescript
import { handleCsrfToken } from 'packages/superset-ui-core/src/DodoExtensions/api/utils';

// Обработка CSRF-токена
const csrfToken = 'your-csrf-token';
handleCsrfToken(csrfToken);
```

### Использование утилит для работы с локализацией

```typescript
import { dttmToMoment } from 'packages/superset-ui-core/src/DodoExtensions/time-format/utils/dttmToMoment';

// Преобразование строки даты/времени в объект Moment
const now = dttmToMoment('now');
console.log('Now:', now.format('YYYY-MM-DD HH:mm:ss'));

const today = dttmToMoment('today');
console.log('Today:', today.format('YYYY-MM-DD HH:mm:ss'));

const date = dttmToMoment('2023-01-01');
console.log('Date:', date.format('YYYY-MM-DD HH:mm:ss'));
```

### Использование прочих утилит

```typescript
import { dirtyHackDodoIs } from 'src/Superstructure/Root/utils';

// Исправление проблемы с CSS-свойством min-height в элементе div.all
dirtyHackDodoIs();
```
