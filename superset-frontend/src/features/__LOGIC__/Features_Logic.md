# Документация по DODO-специфичным компонентам и функциям в Features

## Содержание

1. [Введение](#введение)
2. [Локализация](#локализация)
   - [LanguagePicker](#languagepicker)
   - [Переводы](#переводы)
3. [Форматирование чисел и дат](#форматирование-чисел-и-дат)
   - [Форматирование чисел](#форматирование-чисел)
   - [Форматирование дат](#форматирование-дат)
4. [Компоненты визуализации](#компоненты-визуализации)
   - [BarDodo](#bardodo)
   - [BubbleDodo](#bubbledodo)
5. [Прочие модификации](#прочие-модификации)

## Введение

Данный документ содержит информацию о компонентах и функциях, которые были добавлены или модифицированы командой DODO в директории `features` проекта Superset. Каждая модификация помечена идентификатором изменения (например, "DODO 44120742").

## Локализация

### LanguagePicker

**Описание**: Компонент для выбора языка интерфейса.

**DODO-модификации**:

- **44120742**: Добавлена поддержка русского языка и модифицирован URL для смены языка

**Ключевые файлы**:

- `superset-frontend/src/features/home/LanguagePicker.tsx`

**Пример кода**:

```typescript
// DODO added 44120742
const hardcodedRuEnUrl = Object.fromEntries(
  Object.entries(languages).map(([key, value]) => {
    if (key === 'en') {
      return [key, { ...value, url: '/api/v1/me/change/lang/en' }];
    }
    if (key === 'ru') {
      return [key, { ...value, url: '/api/v1/me/change/lang/ru' }];
    }
    return [key, value];
  }),
);
```

### Переводы

**Описание**: Файлы с переводами для различных языков.

**DODO-модификации**:

- Добавлены переводы для русского языка

**Ключевые файлы**:

- `superset-frontend/src/Superstructure/translations/ru.ts`
- `superset-frontend/src/Superstructure/translations/en.ts`
- `superset-frontend/src/Superstructure/translations.ts`

**Пример кода**:

```typescript
/* eslint-disable no-template-curly-in-string */
import { ru } from './translations/ru';
import { en } from './translations/en';

const SupersetPluginTranslations = {
  ru: { ...ru },
  en: { ...en },
};

export { SupersetPluginTranslations };
```

## Форматирование чисел и дат

### Форматирование чисел

**DODO-модификации**:

- **44211769**: Добавлены специфичные для русской локали форматы чисел и валют

**Ключевые файлы**:

- `superset-frontend/packages/superset-ui-core/src/number-format/D3FormatConfig.ts`

**Пример кода**:

```typescript
// DODO added start 44211769
interface ExtendedFormatLocaleDefinition extends FormatLocaleDefinition {
  id: string;
  code: string;
}
type SUPPORTED_CURRENCIES_LOCALES =
  | 'RUSSIAN'
  | 'RUSSIAN_ROUNDED'
  | 'DEFAULT_ROUNDED'
  | 'RUSSIAN_ROUNDED_1'
  | 'RUSSIAN_ROUNDED_2'
  | 'RUSSIAN_ROUNDED_3';
export const SUPPORTED_CURRENCIES_LOCALES_ARRAY = [
  'RUSSIAN',
  'RUSSIAN_ROUNDED',
  'DEFAULT_ROUNDED',
  'RUSSIAN_ROUNDED_1',
  'RUSSIAN_ROUNDED_2',
  'RUSSIAN_ROUNDED_3',
];
const UNICODE = {
  SPACE: '\u00a0',
  COMMA: '\u002c',
  POINT: '\u002e',
  SYM: {
    USD: '\u0024',
    RUB: '\u0440\u0443\u0431',
    EUR: '\u20ac',
  },
};
```

### Форматирование дат

**DODO-модификации**:

- **45525377**: Добавлен новый формат для умных дат с точкой (DD.MM.YYYY)

**Ключевые файлы**:

- `superset-frontend/packages/superset-ui-core/src/time-format/formatters/smartDate.ts`
- `superset-frontend/packages/superset-ui-core/src/time-format/index.ts`

**Пример кода**:

```typescript
export const SMART_DATE_ID = 'smart_date';
export const SMART_DATE_DOT_DDMMYYYY_ID = 'smart_date_dot_ddmmyyyy'; // DODO added 45525377
```

## Компоненты визуализации

### BarDodo

**Описание**: Модифицированная версия столбчатой диаграммы с дополнительными возможностями.

**DODO-модификации**:

- **45525377**: Создан компонент с расширенными возможностями форматирования и отображения

**Ключевые файлы**:

- `superset-frontend/plugins/plugin-chart-echarts/src/DodoExtensions/BarDodo/index.ts`
- `superset-frontend/plugins/plugin-chart-echarts/src/DodoExtensions/BarDodo/transformProps.ts`
- `superset-frontend/plugins/plugin-chart-echarts/src/DodoExtensions/BarDodo/types.ts`

**Пример кода**:

```typescript
export default class EchartsBarChartPluginDodo extends ChartPlugin<
  EchartsBarFormData,
  EchartsBarChartProps
> {
  constructor() {
    super({
      buildQuery,
      controlPanel,
      loadChart: () => import('./EchartsBarChart'),
      metadata: new ChartMetadata({
        label: ChartLabel.Deprecated,
        behaviors: [Behavior.InteractiveChart],
        credits: ['https://echarts.apache.org'],
        description: 'Bar Chart (Apache ECharts) with D3 format support',
        name: t('Echarts Bar Chart'),
        exampleGallery: [],
        tags: [t('Popular'), t('ECharts'), t('DODOIS_friendly')],
        thumbnail,
      }),
      transformProps,
    });
  }
}
```

### BubbleDodo

**Описание**: Модифицированная версия пузырьковой диаграммы с дополнительными возможностями.

**DODO-модификации**:

- Добавлена возможность настройки отображения меток
- Добавлена возможность настройки размера и цвета пузырьков
- Добавлена возможность настройки логарифмической шкалы для осей

**Ключевые файлы**:

- `superset-frontend/plugins/plugin-chart-echarts/src/DodoExtensions/Bubble/BubbleDodo.tsx`
- `superset-frontend/plugins/plugin-chart-echarts/src/DodoExtensions/Bubble/index.ts`
- `superset-frontend/plugins/plugin-chart-echarts/src/DodoExtensions/Bubble/types.ts`

**Пример кода**:

```typescript
export default function BubbleDodo({
  height,
  width,
  dimensionList,
  data,
  showLabels,
  showDimension,
  marginTop,
  scrollDimensions,
  xAxisName,
  yAxisName,
  xLogScale,
  yLogScale,
  xNameLocation,
  xNameGap,
  yNameLocation,
  yNameGap,
  xAxisFormatter,
  yAxisFormatter,
  sizeFormatter,
  labelLocation,
  labelFontSize,
  labelColor,
  tooltipLabels,
  refs,
}: BubbleDodoComponentProps) {
  // ...
}
```

## Прочие модификации

### Настройка локали по умолчанию

**DODO-модификации**:

- **44611022**: Добавлена настройка локали по умолчанию (русский язык)

**Ключевые файлы**:

- `superset-frontend/src/preamble.ts`

**Пример кода**:

```typescript
// DODO added start 44611022
const root = document.getElementById('app');
const dataBootstrap = root
  ? JSON.parse(root.getAttribute('data-bootstrap') || '{}')
  : {};

bootstrapData = {
  ...dataBootstrap,
  common: {
    ...dataBootstrap?.common,
    locale: dataBootstrap?.common?.locale || 'ru',
  },
};
// DODO added stop 44611022
```

### Локализация заголовков метрик

**Описание**: Компонент для редактирования заголовков метрик с поддержкой локализации.

**Ключевые файлы**:

- `superset-frontend/src/DodoExtensions/AdhocMetricEditPopoverTitle.tsx`

**Пример кода**:

```typescript
const SYSTEM_LANGUAGES = {
  ru: 'ru',
  en: 'en',
};

const TitlesWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
`;

interface AdHocMetricTitleEditDisabledProps {
  title?: {
    label?: string;
    labelRU?: string;
    labelEN?: string;
    hasCustomLabel?: boolean;
  };
  defaultLabel: string;
}
```
