# Документация по встраиванию (Embedded) в DODO

## Содержание

1. [Введение](#введение)
2. [Архитектура](#архитектура)
3. [Стандартная функциональность](#стандартная-функциональность)
4. [DODO-специфичная функциональность](#dodo-специфичная-функциональность)
5. [Техническая реализация](#техническая-реализация)
6. [Примеры использования](#примеры-использования)

## Введение

Модуль `embedded` предоставляет функциональность для встраивания дашбордов Superset в другие веб-приложения. Эта функциональность позволяет использовать дашборды Superset в качестве встроенных элементов в других приложениях, включая DODO IS.

В DODO этот модуль используется для интеграции дашбордов Superset в интерфейс DODO IS, что позволяет пользователям просматривать аналитические данные непосредственно в интерфейсе системы управления.

## Архитектура

Модуль `embedded` организован следующим образом:

1. **API** (`api.py`):
   - `EmbeddedDashboardRestApi` - REST API для работы с встроенными дашбордами
   - Предоставляет эндпоинты для получения информации о встроенных дашбордах

2. **Представление** (`view.py`):
   - `EmbeddedView` - представление для отображения встроенных дашбордов
   - Обрабатывает запросы к встроенным дашбордам и проверяет права доступа

3. **Фронтенд**:
   - `superset-frontend/src/embedded/index.tsx` - основное приложение для встраивания дашбордов
   - `superset-frontend/src/embedded/api.tsx` - API для взаимодействия с встроенными дашбордами

4. **SDK для встраивания**:
   - `superset-embedded-sdk` - библиотека для встраивания дашбордов Superset в другие приложения

## Стандартная функциональность

Стандартная функциональность модуля `embedded` включает:

1. **Встраивание дашбордов**:
   - Возможность встраивать дашборды Superset в другие веб-приложения
   - Поддержка аутентификации через гостевые токены

2. **Управление доступом**:
   - Ограничение доступа к встроенным дашбордам по доменам
   - Проверка прав доступа к встроенным дашбордам

3. **Коммуникация между фреймами**:
   - Обмен сообщениями между встроенным дашбордом и родительским приложением
   - Получение информации о размере дашборда, активных вкладках и т.д.

4. **Генерация постоянных ссылок**:
   - Создание постоянных ссылок на дашборды с сохранением состояния фильтров
   - Поддержка якорей для навигации внутри дашборда

## DODO-специфичная функциональность

В DODO модуль `embedded` используется для интеграции дашбордов Superset в интерфейс DODO IS. Основные DODO-специфичные аспекты:

1. **Интеграция с DODO IS**:
   - Встраивание дашбордов Superset в интерфейс DODO IS
   - Использование единой системы аутентификации

2. **Локализация интерфейса**:
   - Поддержка русского языка в интерфейсе встроенных дашбордов
   - Локализованные сообщения и подсказки

3. **Брендирование**:
   - Использование стилей и цветовой схемы DODO
   - Интеграция с общим дизайном DODO IS

Хотя в самом модуле `embedded` не обнаружено прямых DODO-специфичных изменений кода, его использование в DODO IS имеет свои особенности, которые реализованы на уровне фронтенда в директории `superset-frontend/src/Superstructure`.

### Интеграция с DODO IS

В файле `superset-frontend/src/Superstructure/messages.ts` определены сообщения для встроенных дашбордов в DODO IS:

```typescript
const RULES_RU = {
  title: 'Добро пожаловать в Superset dashboard plugin',
  subTitle: 'Новый инструмент от команды DE',
  extra: IF_QUESTIONS_RU,
  messages: [
    'Слева можно выбрать интересующий дашборд.',
    'Данный инструмент встроен в DODO IS и показывает дашборды из standalone сервиса по ссылке: https://analytics.dodois.io/',
    'Примененные конфигурации: CERTIFIED BY => DODOPIZZA',
  ],
  buttons: [
    {
      txt: 'Правила работы с аналитикой',
      link: DODOPIZZA_KNOWLEDGEBASE_URL,
    },
    {
      txt: 'Перейти в аналитику  (standalone)',
      link: DODOPIZZA_ANALYTICS_URL,
    },
  ],
};

const RULES_DRINKIT_RU = {
  title: 'Добро пожаловать в Superset dashboard plugin',
  subTitle: 'Новый инструмент от команды DE для DRINKIT',
  extra: IF_QUESTIONS_RU,
  messages: [
    'Слева можно выбрать интересующий дашборд.',
    'Данный инструмент встроен в DODO IS и показывает дашборды из standalone сервиса по ссылке: https://analytics.dodois.io/',
    'Примененные конфигурации: CERTIFIED BY => DRINKIT',
  ],
  buttons: [
    {
      txt: 'Посмотреть инструкцию по работе с дашбордами',
      link: 'https://dodopizza.info/support/articles/f8170159-480d-4f82-9564-192ced3159b9/ru',
    },
    {
      txt: 'Посмотреть все доступные дашборды',
      link: DODOPIZZA_ANALYTICS_URL,
    },
  ],
};
```

## Техническая реализация

### EmbeddedView

Представление для отображения встроенных дашбордов:

```python
class EmbeddedView(BaseView):
    route_base = "/embedded"

    @expose("/<uuid>")
    @event_logger.log_this_with_extra_payload
    def embedded(
        self,
        uuid: str,
        add_extra_log_payload: Callable[..., None] = lambda **kwargs: None,
    ) -> FlaskResponse:
        """
        Server side rendering for the embedded dashboard page
        :param uuid: identifier for embedded dashboard
        :param add_extra_log_payload: added by `log_this_with_manual_updates`, set a
            default value to appease pylint
        """
        if not is_feature_enabled("EMBEDDED_SUPERSET"):
            abort(404)

        embedded = EmbeddedDashboardDAO.find_by_id(uuid)

        if not embedded:
            abort(404)

        assert embedded is not None

        # validate request referrer in allowed domains
        is_referrer_allowed = not embedded.allowed_domains
        for domain in embedded.allowed_domains:
            if same_origin(request.referrer, domain):
                is_referrer_allowed = True
                break

        if not is_referrer_allowed:
            abort(403)

        # Log in as an anonymous user, just for this view.
        # This view needs to be visible to all users,
        # and building the page fails if g.user and/or ctx.user aren't present.
        login_user(AnonymousUserMixin(), force=True)

        add_extra_log_payload(
            embedded_dashboard_id=uuid,
            dashboard_version="v2",
        )

        bootstrap_data = {
            "config": {
                "GUEST_TOKEN_HEADER_NAME": current_app.config["GUEST_TOKEN_HEADER_NAME"]
            },
            "common": common_bootstrap_payload(),
            "embedded": {
                "dashboard_id": embedded.dashboard_id,
            },
        }

        return self.render_template(
            "superset/spa.html",
            entry="embedded",
            bootstrap_data=json.dumps(
                bootstrap_data, default=json.pessimistic_json_iso_dttm_ser
            ),
        )
```

### EmbeddedDashboardRestApi

REST API для работы с встроенными дашбордами:

```python
class EmbeddedDashboardRestApi(BaseSupersetModelRestApi):
    datamodel = SQLAInterface(EmbeddedDashboard)

    @before_request
    def ensure_embedded_enabled(self) -> Optional[Response]:
        if not is_feature_enabled("EMBEDDED_SUPERSET"):
            return self.response_404()
        return None

    @expose("/<string:embedded_dashboard_uuid>", methods=["GET"])
    @protect()
    @safe
    @statsd_metrics
    @permission_name("get")
    @rison(get_embedded_dashboards_rison_schema)
    def get_embedded_dashboard(
        self, embedded_dashboard_uuid: str, **kwargs: Any
    ) -> Response:
        """Gets a dashboard.
        ---
        get:
          summary: Gets an embedded dashboard
          parameters:
          - in: path
            schema:
              type: string
            name: embedded_dashboard_uuid
          responses:
            200:
              description: Dashboard
              content:
                application/json:
                  schema:
                    type: object
                    properties:
                      result:
                        $ref: '#/components/schemas/EmbeddedDashboardResponseSchema'
            404:
              $ref: '#/components/responses/404'
            422:
              $ref: '#/components/responses/422'
            500:
              $ref: '#/components/responses/500'
        """
        try:
            embedded_dashboard = EmbeddedDashboardDAO.find_by_id(embedded_dashboard_uuid)
            result = EmbeddedDashboardResponseSchema().dump(embedded_dashboard)
            return self.response(200, result=result)
        except EmbeddedDashboardNotFoundError:
            return self.response_404()
```

### Фронтенд для встраивания

Основное приложение для встраивания дашбордов:

```typescript
const EmbeddedRoute = () => (
  <Suspense fallback={<Loading />}>
    <RootContextProviders>
      <ErrorBoundary>
        <LazyDashboardPage idOrSlug={bootstrapData.embedded!.dashboard_id} />
      </ErrorBoundary>
      <ToastContainer position="top" />
    </RootContextProviders>
  </Suspense>
);

const EmbeddedApp = () => (
  <Router>
    {/* todo (embedded) remove this line after uuids are deployed */}
    <Route path="/dashboard/:idOrSlug/embedded/" component={EmbeddedRoute} />
    <Route path="/embedded/:uuid/" component={EmbeddedRoute} />
  </Router>
);
```

API для взаимодействия с встроенными дашбордами:

```typescript
type EmbeddedSupersetApi = {
  getScrollSize: () => Size;
  getDashboardPermalink: ({ anchor }: { anchor: string }) => Promise<string>;
  getActiveTabs: () => string[];
};

const getScrollSize = (): Size => ({
  width: document.body.scrollWidth,
  height: document.body.scrollHeight,
});

const getDashboardPermalink = async ({
  anchor,
}: {
  anchor: string;
}): Promise<string> => {
  const state = store?.getState();
  const { dashboardId, dataMask, activeTabs } = {
    dashboardId:
      state?.dashboardInfo?.id || bootstrapData?.embedded!.dashboard_id,
    dataMask: state?.dataMask,
    activeTabs: state.dashboardState?.activeTabs,
  };

  return getDashboardPermalinkUtil({
    dashboardId,
    dataMask,
    activeTabs,
    anchor,
  });
};

const getActiveTabs = () => store?.getState()?.dashboardState?.activeTabs || [];

export const embeddedApi: EmbeddedSupersetApi = {
  getScrollSize,
  getDashboardPermalink,
  getActiveTabs,
};
```

## Примеры использования

### Встраивание дашборда в DODO IS

```typescript
import { embedDashboard } from '@superset-embedded-sdk';

// Функция для получения гостевого токена от сервера DODO IS
async function fetchGuestToken() {
  const response = await fetch('/api/superset/guest-token');
  const data = await response.json();
  return data.token;
}

// Встраивание дашборда
const dashboard = await embedDashboard({
  id: 'dashboard-uuid',
  supersetDomain: 'https://analytics.dodois.io',
  mountPoint: document.getElementById('dashboard-container'),
  fetchGuestToken,
  dashboardUiConfig: {
    hideTitle: true,
    hideChartControls: true,
    hideTab: false,
  },
});

// Получение размера дашборда
const size = await dashboard.getScrollSize();
console.log(`Dashboard size: ${size.width}x${size.height}`);

// Получение постоянной ссылки на дашборд
const permalink = await dashboard.getDashboardPermalink('tab-1');
console.log(`Dashboard permalink: ${permalink}`);

// Получение активных вкладок
const activeTabs = await dashboard.getActiveTabs();
console.log(`Active tabs: ${activeTabs.join(', ')}`);
```

### Настройка встраивания дашборда в Superset

```python
from superset.daos.dashboard import EmbeddedDashboardDAO
from superset.models.dashboard import Dashboard

# Получение дашборда
dashboard = Dashboard.get_by_id_or_slug(1)

# Настройка встраивания
embedded = EmbeddedDashboardDAO.upsert(
    dashboard=dashboard,
    allowed_domains=["https://dodois.io", "https://dodo.dev"]
)

print(f"Embedded dashboard UUID: {embedded.uuid}")
```
