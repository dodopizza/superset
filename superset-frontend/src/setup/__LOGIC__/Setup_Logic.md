# Документация по компонентам и функциям в Setup

## Содержание

1. [Введение](#введение)
2. [Настройка форматирования](#настройка-форматирования)
   - [Форматирование чисел и дат](#форматирование-чисел-и-дат)
   - [DODO-специфичные форматы](#dodo-специфичные-форматы)
3. [Настройка клиента](#настройка-клиента)
   - [Конфигурация SupersetClient](#конфигурация-supersetclient)
   - [Интеграция с CSRF](#интеграция-с-csrf)
4. [Настройка цветовых схем](#настройка-цветовых-схем)
5. [Настройка плагинов](#настройка-плагинов)
6. [Настройка приложения](#настройка-приложения)
7. [Расширения](#расширения)

## Введение

Директория `setup` содержит компоненты и функции для инициализации и настройки различных аспектов приложения Superset. Эти компоненты отвечают за настройку форматирования, клиента, цветовых схем, плагинов и других аспектов приложения.

## Настройка форматирования

### Форматирование чисел и дат

**Описание**: Функции для настройки форматирования чисел и дат в приложении.

**Ключевые файлы**:
- `superset-frontend/src/setup/setupFormatters.ts`

**Пример кода**:
```typescript
export default function setupFormatters(
  d3NumberFormat: Partial<FormatLocaleDefinition>,
  d3TimeFormat: Partial<TimeLocaleDefinition>,
) {
  getNumberFormatterRegistry()
    .setD3Format(d3NumberFormat)
    // Add shims for format strings that are deprecated or common typos.
    // Temporary solution until performing a db migration to fix this.
    .registerValue(',0', getNumberFormatter(',.4~f'))
    .registerValue('null', getNumberFormatter(',.4~f'))
    .registerValue('%', getNumberFormatter('.0%'))
    // ...
    .registerValue('DURATION', createDurationFormatter())
    .registerValue(
      'DURATION_SUB',
      createDurationFormatter({ formatSubMilliseconds: true }),
    );

  const timeFormatterRegistry = getTimeFormatterRegistry();

  timeFormatterRegistry
    .setD3Format(d3TimeFormat)
    .registerValue(
      SMART_DATE_ID,
      createSmartDateFormatter(timeFormatterRegistry.d3Format),
    )
    .registerValue(
      SMART_DATE_VERBOSE_ID,
      createSmartDateVerboseFormatter(timeFormatterRegistry.d3Format),
    )
    .registerValue(
      SMART_DATE_DETAILED_ID,
      createSmartDateDetailedFormatter(timeFormatterRegistry.d3Format),
    )
    .setDefaultKey(SMART_DATE_ID);
}
```

### DODO-специфичные форматы

**Описание**: DODO-специфичные форматы для чисел и дат.

**DODO-модификации**:
- **44136746**: Добавлен формат DURATION_HMMSS для форматирования длительности в формате часы:минуты:секунды

**Ключевые файлы**:
- `superset-frontend/src/setup/setupFormatters.ts`
- `superset-frontend/src/DodoExtensions/utils/formatDurationHMMSS.ts`

**Пример кода**:
```typescript
import { formatDurationHMMSS } from 'src/DodoExtensions/utils/formatDurationHMMSS'; // DODO added 44136746

// ...

// DODO added 44136746
.registerValue(
  'DURATION_HMMSS',
  createDurationFormatter({ formatFunc: formatDurationHMMSS }),
);
```

## Настройка клиента

### Конфигурация SupersetClient

**Описание**: Функции для настройки клиента Superset.

**Ключевые файлы**:
- `superset-frontend/src/setup/setupClient.ts`

**Пример кода**:
```typescript
function getDefaultConfiguration(): ClientConfig {
  const csrfNode = document.querySelector<HTMLInputElement>('#csrf_token');
  const csrfToken = csrfNode?.value;

  // when using flask-jwt-extended csrf is set in cookies
  const jwtAccessCsrfCookieName =
    bootstrapData.common.conf.JWT_ACCESS_CSRF_COOKIE_NAME;
  const cookieCSRFToken = parseCookie()[jwtAccessCsrfCookieName] || '';

  return {
    protocol: ['http:', 'https:'].includes(window?.location?.protocol)
      ? (window?.location?.protocol as 'http:' | 'https:')
      : undefined,
    host: window.location?.host || '',
    csrfToken: csrfToken || cookieCSRFToken,
  };
}

export default function setupClient(customConfig: Partial<ClientConfig> = {}) {
  SupersetClient.configure({
    ...getDefaultConfiguration(),
    ...customConfig,
  })
    .init()
    .catch(error => {
      logging.warn('Error initializing SupersetClient', error);
    });
}
```

### Интеграция с CSRF

**Описание**: Интеграция с CSRF для защиты от атак.

**Ключевые файлы**:
- `superset-frontend/src/setup/setupClient.ts`
- `superset-frontend/src/Superstructure/setupClient.ts`

**Пример кода**:
```typescript
// Версия в Superstructure
export default function setupClient() {
  const csrfNode = document.querySelector<HTMLInputElement>('#csrf_token');
  const csrfToken = csrfNode ? csrfNode.value : '';

  // when using flask-jwt-extended csrf is set in cookies
  const cookieCSRFToken = parseCookie().csrf_access_token || '';

  SupersetClient.configure({
    protocol: ['http:', 'https:'].includes(window?.location?.protocol)
      ? (window?.location?.protocol as 'http:' | 'https:')
      : undefined,
    host: window.location?.host || '',
    csrfToken: csrfToken || cookieCSRFToken,
  })
    .init()
    .catch(error => {
      logging.warn('Error initializing SupersetClient', error);
    });
}
```

## Настройка цветовых схем

**Описание**: Функции для настройки цветовых схем в приложении.

**Ключевые файлы**:
- `superset-frontend/src/setup/setupColors.ts`

**Пример кода**:
```typescript
export default function setupColors(
  extraCategoricalColorSchemeConfigs: ColorSchemeConfig[] = [],
  extraSequentialColorSchemeConfigs: SequentialSchemeConfig[] = [],
) {
  const extraCategoricalColorSchemes = extraCategoricalColorSchemeConfigs.map(
    config =>
      new CategoricalScheme({ ...config, group: ColorSchemeGroup.Custom }),
  );
  const extraSequentialColorSchemes = extraSequentialColorSchemeConfigs.map(
    config => new SequentialScheme(config),
  );
  registerColorSchemes(
    // @ts-ignore
    getCategoricalSchemeRegistry(),
    [
      ...CategoricalAirbnb,
      ...CategoricalD3,
      ...CategoricalEcharts,
      ...CategoricalGoogle,
      ...CategoricalLyft,
      ...CategoricalPreset,
      ...CategoricalSuperset,
      ...CategoricalPresetSuperset,
      ...CategoricalModernSunset,
      ...CategoricalColorsOfRainbow,
      ...CategoricalBlueToGreen,
      ...CategoricalRedToYellow,
      ...CategoricalWavesOfBlue,
      ...extraCategoricalColorSchemes,
    ],
    'supersetColors',
  );
  registerColorSchemes(
    // @ts-ignore
    getSequentialSchemeRegistry(),
    [...SequentialCommon, ...SequentialD3, ...extraSequentialColorSchemes],
    'superset_seq_1',
  );
}
```

## Настройка плагинов

**Описание**: Функции для настройки плагинов в приложении.

**Ключевые файлы**:
- `superset-frontend/src/setup/setupPlugins.ts`
- `superset-frontend/src/setup/setupPluginsExtra.ts`

**Пример кода**:
```typescript
export default function setupPlugins() {
  new MainPreset().register();

  // TODO: Remove these shims once the control panel configs are moved into the plugin package.
  getChartControlPanelRegistry().registerValue('separator', Separator);

  setupPluginsExtra();
}
```

**Расширение плагинов**:
```typescript
// For individual deployments to add custom overrides
export default function setupPluginsExtra() {}
```

## Настройка приложения

**Описание**: Функции для настройки приложения в целом.

**Ключевые файлы**:
- `superset-frontend/src/setup/setupApp.ts`

**Пример кода**:
```typescript
export default function setupApp() {
  $(document).ready(function () {
    $(':checkbox[data-checkbox-api-prefix]').change(function (
      this: HTMLElement,
    ) {
      const $this = $(this);
      const prefix = $this.data('checkbox-api-prefix');
      const id = $this.attr('id');
      toggleCheckbox(prefix, `#${id}`);
    });

    // for language picker dropdown
    $('#language-picker a').click(function (
      ev: JQuery.ClickEvent<
        HTMLLinkElement,
        null,
        HTMLLinkElement,
        HTMLLinkElement
      >,
    ) {
      ev.preventDefault();
      SupersetClient.get({
        url: ev.currentTarget.href,
        parseMethod: null,
      }).then(() => {
        window.location.reload();
      });
    });
  });

  // A set of hacks to allow apps to run within a FAB template
  // this allows for the server side generated menus to function
  window.$ = $;
  window.jQuery = $;
  require('bootstrap');

  // setup appwide custom error messages
  setupErrorMessages();
}
```

## Расширения

**Описание**: Функции для расширения функциональности приложения.

**Ключевые файлы**:
- `superset-frontend/src/setup/setupExtensions.ts`
- `superset-frontend/src/setup/setupDashboardComponents.ts`
- `superset-frontend/src/setup/setupErrorMessagesExtra.ts`

**Пример кода**:
```typescript
// For individual deployments to add custom overrides
export default function setupExtensions() {}
```

**Настройка компонентов дашборда**:
```typescript
export default function setupDashboardComponents() {
  // Add custom dashboard components here. Example:
  // dashboardComponentsRegistry.set('example', example);
}
```

**Настройка сообщений об ошибках**:
```typescript
// For individual deployments to add custom error messages
export default function setupErrorMessagesExtra() {}
```
