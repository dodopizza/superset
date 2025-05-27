# Документация по инициализации (Initialization) в DODO

## Содержание

1. [Введение](#введение)
2. [Архитектура](#архитектура)
3. [Стандартная функциональность](#стандартная-функциональность)
4. [DODO-специфичная функциональность](#dodo-специфичная-функциональность)
5. [Техническая реализация](#техническая-реализация)
6. [Процесс инициализации](#процесс-инициализации)

## Введение

Модуль `initialization` отвечает за инициализацию приложения Superset. Он выполняет все необходимые настройки и конфигурации при запуске приложения, включая инициализацию базы данных, настройку расширений, регистрацию представлений и API.

В DODO этот модуль расширен для поддержки дополнительных API и функциональности, специфичных для DODO.

## Архитектура

Модуль `initialization` организован следующим образом:

1. **Основной класс** (`__init__.py`):
   - `SupersetAppInitializer` - класс, отвечающий за инициализацию приложения
   - Содержит методы для настройки различных аспектов приложения

2. **Методы инициализации**:
   - `init_app` - основной метод инициализации
   - `pre_init` - выполняется перед основной инициализацией
   - `post_init` - выполняется после основной инициализации
   - Специализированные методы для инициализации отдельных компонентов

3. **Расширения**:
   - Инициализация расширений Flask
   - Настройка базы данных
   - Настройка кэширования
   - Настройка аутентификации

## Стандартная функциональность

Стандартная функциональность модуля `initialization` включает:

1. **Инициализация приложения**:
   - Настройка Flask-приложения
   - Настройка расширений
   - Настройка базы данных

2. **Настройка безопасности**:
   - Проверка секретного ключа
   - Настройка CSRF-защиты
   - Настройка аутентификации

3. **Регистрация представлений и API**:
   - Регистрация представлений Flask-AppBuilder
   - Регистрация REST API
   - Регистрация чертежей (blueprints)

4. **Настройка логирования**:
   - Настройка логгеров
   - Настройка обработчиков событий

5. **Настройка кэширования**:
   - Настройка кэша результатов
   - Настройка кэша приложения

## DODO-специфичная функциональность

В DODO модуль `initialization` был расширен для поддержки дополнительных API и функциональности. Основные DODO-специфичные изменения:

1. **Регистрация дополнительных API**:
   - Добавлена регистрация API для наборов фильтров (FilterSets)
   - Добавлена регистрация API для команд DODO
   - Добавлено в рамках задачи #44211751

   ```python
   appbuilder.add_api(FilterSetRestApi)  # dodo added 44211751
   ```

2. **Регистрация API для онбординга**:
   - Добавлена регистрация API для онбординга пользователей
   - Добавлена регистрация API для команд DODO

   ```python
   appbuilder.add_api(OnboardingRestApi)
   appbuilder.add_api(TeamRestApi)
   appbuilder.add_api(DodoUserRestApi)
   appbuilder.add_api(StatementRestApi)
   ```

Эти изменения позволяют использовать дополнительную функциональность, специфичную для DODO, такую как наборы фильтров и онбординг пользователей.

## Техническая реализация

### SupersetAppInitializer

Основной класс, отвечающий за инициализацию приложения:

```python
class SupersetAppInitializer:  # pylint: disable=too-many-public-methods
    def __init__(self, app: SupersetApp) -> None:
        super().__init__()

        self.superset_app = app
        self.config = app.config
        self.manifest: dict[Any, Any] = {}

    @deprecated(details="use self.superset_app instead of self.flask_app")  # type: ignore
    @property
    def flask_app(self) -> SupersetApp:
        return self.superset_app

    def pre_init(self) -> None:
        """
        Called before all other init tasks are complete
        """
        wtforms_json.init()

        if not os.path.exists(self.config["DATA_DIR"]):
            os.makedirs(self.config["DATA_DIR"])

    def post_init(self) -> None:
        """
        Called after any other init tasks
        """

    def init_app(self) -> None:
        """
        Main entry point which will delegate to other methods in
        order to fully init the app
        """
        self.pre_init()
        self.check_secret_key()
        self.configure_session()
        # Configuration of logging must be done first to apply the formatter properly
        self.configure_logging()
        # Configuration of feature_flags must be done first to allow init features
        # conditionally
        self.configure_feature_flags()
        self.configure_db_encrypt()
        self.setup_db()
        self.configure_celery()
        self.enable_profiling()
        self.setup_event_logger()
        self.setup_bundle_manifest()
        self.register_blueprints()
        self.configure_wtf()
        self.configure_middlewares()
        self.configure_cache()
        self.set_db_default_isolation()
        self.configure_sqlglot_dialects()

        with self.superset_app.app_context():
            self.init_app_in_ctx()

        self.post_init()
```

### Регистрация представлений и API

Метод для регистрации представлений и API:

```python
def init_views(self) -> None:
    #
    # We're doing local imports, as several of them import
    # models which in turn try to import
    # the global Flask app
    #
    # pylint: disable=import-outside-toplevel,too-many-locals,too-many-statements
    from superset.advanced_data_type.api import AdvancedDataTypeRestApi
    from superset.annotation_layers.annotations.api import AnnotationRestApi
    from superset.annotation_layers.api import AnnotationLayerRestApi
    from superset.async_events.api import AsyncEventsRestApi
    from superset.available_domains.api import AvailableDomainsRestApi
    from superset.cachekeys.api import CacheRestApi
    from superset.charts.api import ChartRestApi
    from superset.charts.data.api import ChartDataRestApi
    from superset.connectors.sqla.views import (
        ColumnInlineView,
        MetricInlineView,
        SqlMetricInlineView,
        TableColumnInlineView,
        TableModelView,
    )
    from superset.css_templates.api import CssTemplateRestApi
    from superset.dashboards.api import DashboardRestApi
    from superset.dashboards.filter_state.api import DashboardFilterStateRestApi
    from superset.dashboards.permalink.api import DashboardPermalinkRestApi
    from superset.databases.api import DatabaseRestApi
    from superset.datasets.api import DatasetRestApi
    from superset.datasets.columns.api import DatasetColumnsRestApi
    from superset.datasets.metrics.api import DatasetMetricRestApi
    from superset.datasource.api import DatasourceRestApi
    from superset.embedded.api import EmbeddedDashboardRestApi
    from superset.explore.api import ExploreRestApi
    from superset.explore.form_data.api import ExploreFormDataRestApi
    from superset.explore.permalink.api import ExplorePermalinkRestApi
    from superset.filter_sets.api import FilterSetRestApi  # dodo added 44211751
    from superset.importexport.api import ImportExportRestApi
    from superset.onboarding.api import OnboardingRestApi
    from superset.queries.api import QueryRestApi
    from superset.queries.saved_queries.api import SavedQueryRestApi
    from superset.reports.api import ReportScheduleRestApi
    from superset.reports.logs.api import ReportExecutionLogRestApi
    from superset.row_level_security.api import RLSRestApi
    from superset.security.api import SecurityRestApi
    from superset.sqllab.api import SqlLabRestApi
    from superset.statement.api import StatementRestApi
    from superset.tags.api import TagRestApi
    from superset.team.api import TeamRestApi
    from superset.user.api import DodoUserRestApi
    from superset.views.alerts import AlertView, ReportView
    from superset.views.annotations import (
        AnnotationLayerModelView,
        AnnotationModelView,
    )
    from superset.views.api import Api
    from superset.views.chart.views import SliceAsync, SliceModelView
    from superset.views.core import Superset
    from superset.views.css_templates import (
        CssTemplateAsyncModelView,
        CssTemplateModelView,
    )
    from superset.views.dashboard.views import (
        Dashboard,
        DashboardModelView,
        DashboardModelViewAsync,
    )
    from superset.views.database.views import (
        ColumnarToDatabaseView,
        CsvToDatabaseView,
        DatabaseView,
        ExcelToDatabaseView,
    )
    from superset.views.datasource.views import Datasource
    from superset.views.dynamic_plugins import DynamicPluginsView
    from superset.views.key_value import KV
    from superset.views.log.api import LogRestApi
    from superset.views.log.views import LogModelView
    from superset.views.redirects import R
    from superset.views.sql_lab import (
        SavedQueryView,
        SavedQueryViewApi,
        SqlLab,
        TableSchemaView,
        TabStateView,
    )
    from superset.views.tags import TagView
    from superset.views.users.api import UserOAuthRestApi

    #
    # Setup API views
    #
    appbuilder.add_api(AnnotationRestApi)
    appbuilder.add_api(AnnotationLayerRestApi)
    appbuilder.add_api(AsyncEventsRestApi)
    appbuilder.add_api(AdvancedDataTypeRestApi)
    appbuilder.add_api(AvailableDomainsRestApi)
    appbuilder.add_api(CacheRestApi)
    appbuilder.add_api(ChartRestApi)
    appbuilder.add_api(ChartDataRestApi)
    appbuilder.add_api(CssTemplateRestApi)
    appbuilder.add_api(CurrentUserRestApi)
    appbuilder.add_api(UserRestApi)
    appbuilder.add_api(DashboardFilterStateRestApi)
    appbuilder.add_api(DashboardPermalinkRestApi)
    appbuilder.add_api(DashboardRestApi)
    appbuilder.add_api(DatabaseRestApi)
    appbuilder.add_api(DatasetRestApi)
    appbuilder.add_api(DatasetColumnsRestApi)
    appbuilder.add_api(DatasetMetricRestApi)
    appbuilder.add_api(DatasourceRestApi)
    appbuilder.add_api(EmbeddedDashboardRestApi)
    appbuilder.add_api(ExploreRestApi)
    appbuilder.add_api(ExploreFormDataRestApi)
    appbuilder.add_api(ExplorePermalinkRestApi)
    appbuilder.add_api(FilterSetRestApi)  # dodo added 44211751
    appbuilder.add_api(ImportExportRestApi)
    appbuilder.add_api(QueryRestApi)
    appbuilder.add_api(ReportScheduleRestApi)
    appbuilder.add_api(ReportExecutionLogRestApi)
    appbuilder.add_api(RLSRestApi)
    appbuilder.add_api(SavedQueryRestApi)
    appbuilder.add_api(TagRestApi)
    appbuilder.add_api(SqlLabRestApi)
    appbuilder.add_api(OnboardingRestApi)
    appbuilder.add_api(TeamRestApi)
    appbuilder.add_api(DodoUserRestApi)
    appbuilder.add_api(StatementRestApi)
```

## Процесс инициализации

Процесс инициализации приложения Superset в DODO включает следующие шаги:

1. **Предварительная инициализация**:
   - Инициализация WTForms-JSON
   - Создание директории для данных

2. **Проверка безопасности**:
   - Проверка секретного ключа
   - Настройка сессии

3. **Настройка логирования и флагов функций**:
   - Настройка логгеров
   - Настройка флагов функций

4. **Настройка базы данных**:
   - Настройка шифрования базы данных
   - Настройка базы данных
   - Настройка Celery

5. **Настройка расширений**:
   - Настройка профилирования
   - Настройка логгера событий
   - Настройка манифеста бандлов

6. **Регистрация чертежей и настройка WTF**:
   - Регистрация чертежей
   - Настройка WTF
   - Настройка промежуточных слоев

7. **Настройка кэширования и изоляции базы данных**:
   - Настройка кэширования
   - Настройка изоляции базы данных
   - Настройка диалектов SQLGlot

8. **Инициализация приложения в контексте**:
   - Настройка Flask-AppBuilder
   - Настройка конвертеров URL-карты
   - Настройка источников данных
   - Настройка провайдера аутентификации
   - Настройка асинхронных запросов
   - Настройка менеджера SSH
   - Настройка менеджера статистики
   - Инициализация представлений

9. **Пост-инициализация**:
   - Выполнение дополнительных задач после инициализации
