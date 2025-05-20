# Документация по компонентам и функциям в Embedded

## Содержание

1. [Введение](#введение)
2. [Основные компоненты](#основные-компоненты)
   - [Embedded App](#embedded-app)
   - [Embedded API](#embedded-api)
3. [Интеграция с дашбордами](#интеграция-с-дашбордами)
   - [Модальное окно встраивания](#модальное-окно-встраивания)
   - [Управление встраиванием](#управление-встраиванием)
4. [Коммуникация между фреймами](#коммуникация-между-фреймами)
5. [Интеграция с DODO](#интеграция-с-dodo)

## Введение

Директория `embedded` содержит компоненты и функции для встраивания дашбордов Superset в другие веб-приложения. Эта функциональность позволяет использовать дашборды Superset в качестве встроенных элементов в других приложениях, включая DODO IS.

## Основные компоненты

### Embedded App

**Описание**: Основное приложение для встраивания дашбордов.

**Ключевые файлы**:

- `superset-frontend/src/embedded/index.tsx`

**Пример кода**:

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

**Инициализация клиента**:

```typescript
function setupGuestClient(guestToken: string) {
  setupClient({
    guestToken,
    guestTokenHeaderName: bootstrapData.config?.GUEST_TOKEN_HEADER_NAME,
    unauthorizedHandler: guestUnauthorizedHandler,
  });
}
```

### Embedded API

**Описание**: API для взаимодействия с встроенными дашбордами.

**Ключевые файлы**:

- `superset-frontend/src/embedded/api.tsx`

**Пример кода**:

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

## Интеграция с дашбордами

### Модальное окно встраивания

**Описание**: Модальное окно для настройки встраивания дашборда.

**Ключевые файлы**:

- `superset-frontend/src/dashboard/components/EmbeddedModal/index.tsx`

**Пример кода**:

```typescript
const DashboardEmbedModal = (props: Props) => {
  const { show, onHide } = props;
  const DashboardEmbedModalExtension = extensionsRegistry.get('embedded.modal');

  return DashboardEmbedModalExtension ? (
    <DashboardEmbedModalExtension {...props} />
  ) : (
    <Modal show={show} onHide={onHide} title={t('Embed')} hideFooter>
      <DashboardEmbedControls {...props} />
    </Modal>
  );
};
```

### Управление встраиванием

**Описание**: Компоненты для управления настройками встраивания дашборда.

**Ключевые файлы**:

- `superset-frontend/src/dashboard/components/EmbeddedModal/index.tsx`

**Пример кода**:

```typescript
export const DashboardEmbedControls = ({ dashboardId, onHide }: Props) => {
  const { addInfoToast, addDangerToast } = useToasts();
  const [ready, setReady] = useState(true); // whether we have initialized yet
  const [loading, setLoading] = useState(false); // whether we are currently doing an async thing
  const [embedded, setEmbedded] = useState<EmbeddedDashboard | null>(null); // the embedded dashboard config
  const [allowedDomains, setAllowedDomains] = useState<string>('');

  const endpoint = `/api/v1/dashboard/${dashboardId}/embedded`;
  // whether saveable changes have been made to the config
  const isDirty =
    !embedded ||
    stringToList(allowedDomains).join() !== embedded.allowed_domains.join();

  const enableEmbedded = useCallback(() => {
    setLoading(true);
    makeApi<EmbeddedApiPayload, { result: EmbeddedDashboard }>({
      method: 'POST',
      endpoint,
    })({
      allowed_domains: stringToList(allowedDomains),
    })
      .then(
        ({ result }) => {
          setEmbedded(result);
          setAllowedDomains(result.allowed_domains.join(', '));
          addInfoToast(t('Changes saved.'));
        },
        err => {
          console.error(err);
          addDangerToast(
            t(
              t('Sorry, something went wrong. The changes could not be saved.'),
            ),
          );
        },
      )
      .finally(() => {
        setLoading(false);
      });
  }, [endpoint, allowedDomains]);
```

## Коммуникация между фреймами

**Описание**: Механизмы коммуникации между встроенным дашбордом и родительским приложением.

**Ключевые файлы**:

- `superset-frontend/src/embedded/index.tsx`

**Пример кода**:

```typescript
const MESSAGE_TYPE = '__embedded_comms__';

function validateMessageEvent(event: MessageEvent) {
  // if (!ALLOW_ORIGINS.includes(event.origin)) {
  //   throw new Error('Message origin is not in the allowed list');
  // }

  if (typeof event.data !== 'object' || event.data.type !== MESSAGE_TYPE) {
    throw new Error(`Message type does not match type used for embedded comms`);
  }
}

window.addEventListener('message', event => {
  try {
    validateMessageEvent(event);
  } catch (err) {
    return; // ignore messages from unrecognized sources
  }

  const port = event.ports?.[0];
  if (event.data.handshake === 'port transfer' && port) {
    log('message port received', event);

    Switchboard.init({
      port,
      name: 'superset',
      debug: debugMode,
    });

    let started = false;

    Switchboard.defineMethod(
      'guestToken',
      ({ guestToken }: { guestToken: string }) => {
        setupGuestClient(guestToken);
        if (!started) {
          start();
          started = true;
        }
      },
    );

    Switchboard.defineMethod('getScrollSize', embeddedApi.getScrollSize);
    Switchboard.defineMethod(
      'getDashboardPermalink',
      embeddedApi.getDashboardPermalink,
    );
    Switchboard.defineMethod('getActiveTabs', embeddedApi.getActiveTabs);
    Switchboard.start();
  }
});
```

## Интеграция с DODO

**Описание**: Интеграция встраивания дашбордов с DODO IS.

**Ключевые файлы**:

- `superset-frontend/src/Superstructure/messages.ts`

**Пример кода**:

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

**Интеграция с аутентификацией DODO**:

```puml
@startuml
' Libs
!include ./lib/C4_Context.puml

' ------------------------------
' Define legend and title
' ------------------------------

title Global - Context Diagram

' ------------------------------
' Define participants
' ------------------------------

' Person
Person(user__person, "User", "Пользователь аналитики")

' System
System(superset__sys, "Superset", "Платформа для визуализации данных")
System_Ext(dodo_auth__ext_sys, "DODO Auth", "Сервис для авторизации в DODO")

' ------------------------------
' Define relations
' ------------------------------

Rel_R(user__person, superset__sys, "Изучает дашборды используя")
Rel_D(superset__sys, dodo_auth__ext_sys, "Авторизирует пользователей используя")

@enduml
```
