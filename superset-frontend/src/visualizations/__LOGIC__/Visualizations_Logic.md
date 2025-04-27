# Документация по DODO-специфичным компонентам и функциям в Visualizations

## Содержание

1. [Введение](#введение)
2. [Компоненты визуализации](#компоненты-визуализации)
   - [TimeTable](#timetable)
   - [FormattedNumber](#formattednumber)
3. [Расширения для визуализаций](#расширения-для-визуализаций)
   - [BigNumber](#bignumber)
   - [BarDodo](#bardodo)
   - [BubbleDodo](#bubbledodo)
4. [Форматирование данных](#форматирование-данных)
   - [Форматирование чисел](#форматирование-чисел)
   - [Форматирование дат](#форматирование-дат)
5. [Локализация](#локализация)
6. [Прочие модификации](#прочие-модификации)

## Введение

Данный документ содержит информацию о компонентах и функциях, которые были добавлены или модифицированы командой DODO в директории `visualizations` проекта Superset. Каждая модификация помечена идентификатором изменения (например, "DODO 45525377").

## Компоненты визуализации

### TimeTable

**Описание**: Компонент для отображения временных рядов в виде таблицы со спарклайнами.

**Ключевые файлы**:

- `superset-frontend/src/visualizations/TimeTable/index.ts`
- `superset-frontend/src/visualizations/TimeTable/transformProps.ts`
- `superset-frontend/src/visualizations/TimeTable/FormattedNumber.tsx`

**Пример кода**:

```typescript
const metadata = new ChartMetadata({
  category: t('Table'),
  name: t('Time-series Table'),
  description: t(
    'Compare multiple time series charts (as sparklines) and related metrics quickly.',
  ),
  exampleGallery: [{ url: example }],
  tags: [
    t('Multi-Variables'),
    t('Comparison'),
    t('Legacy'),
    t('Percentages'),
    t('Tabular'),
    t('Text'),
    t('Trend'),
  ],
  thumbnail,
  useLegacyApi: true,
});
```

### FormattedNumber

**Описание**: Компонент для форматирования чисел в визуализациях.

**Ключевые файлы**:

- `superset-frontend/src/visualizations/TimeTable/FormattedNumber.tsx`

**Пример кода**:

```typescript
function FormattedNumber({ num = 0, format }: FormattedNumberProps) {
  if (format) {
    // @ts-expect-error formatNumber can actually accept strings, even though it's not typed as such
    return <span title={`${num}`}>{formatNumber(format, num)}</span>;
  }
  return <span>{num}</span>;
}
```

## Расширения для визуализаций

### BigNumber

**Описание**: Расширение для компонента BigNumber с поддержкой условного форматирования.

**DODO-модификации**:

- **45525377**: Добавлена возможность условного форматирования для значения и процентного изменения
- Добавлена возможность отображения условных сообщений

**Ключевые файлы**:

- `superset-frontend/plugins/plugin-chart-echarts/src/DodoExtensions/BigNumber/BigNumberViz.tsx`
- `superset-frontend/plugins/plugin-chart-echarts/src/DodoExtensions/BigNumber/BigNumberWithTrendline/transformPropsDodo.ts`
- `superset-frontend/plugins/plugin-chart-echarts/src/DodoExtensions/BigNumber/BigNumberTotal/controlPanelDodo.tsx`

**Пример кода**:

```typescript
const bigNumberVizGetColorDodo = (
  props: BigNumberVizProps,
  bigNumber?: DataRecordValue,
) => {
  const { colorThresholdFormatters, percentChange, percentChangeFormatter } =
    props;
  const hasThresholdColorFormatter =
    Array.isArray(colorThresholdFormatters) &&
    colorThresholdFormatters.length > 0;

  let numberColor;
  if (hasThresholdColorFormatter) {
    colorThresholdFormatters!.forEach(formatter => {
      if (typeof bigNumber === 'number') {
        numberColor = formatter.getColorFromValue(bigNumber);
      }
    });
  } else {
    numberColor = 'black';
  }
  // ...
};
```

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

## Форматирование данных

### Форматирование чисел

**DODO-модификации**:

- **44211769**: Добавлены специфичные для русской локали форматы чисел и валют

**Ключевые файлы**:

- `superset-frontend/packages/superset-ui-core/src/number-format/D3FormatConfig.ts`
- `superset-frontend/packages/superset-ui-chart-controls/src/utils/D3Formatting.ts`

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
```

### Форматирование дат

**DODO-модификации**:

- **45525377**: Добавлен новый формат для умных дат с точкой (DD.MM.YYYY)
- **44136746**: Добавлен формат для длительности в формате H:MM:SS

**Ключевые файлы**:

- `superset-frontend/packages/superset-ui-core/src/time-format/formatters/smartDate.ts`
- `superset-frontend/packages/superset-ui-chart-controls/src/utils/D3Formatting.ts`

**Пример кода**:

```typescript
export const D3_FORMAT_OPTIONS: [string, string][] = [
  [NumberFormats.SMART_NUMBER, t('Adaptive formatting')],
  ['~g', t('Original value')],
  ...d3Formatted,
  ...d3Currencies(), // DODO added 44211769
  ['DURATION', t('Duration in ms (66000 => 1m 6s)')],
  ['DURATION_SUB', t('Duration in ms (1.40008 => 1ms 400µs 80ns)')],
  ['DURATION_HMMSS', t('Duration in ms (66000 => 0:01:06)')], // DODO added 44136746
];
```

## Локализация

**Описание**: Добавлена поддержка локализации для компонентов визуализации.

**DODO-модификации**:

- **44611022**: Добавлена настройка локали по умолчанию (русский язык)
- **44211759**: Добавлена поддержка локализации для различных компонентов

**Ключевые файлы**:

- `superset-frontend/plugins/plugin-chart-pivot-table/src/react-pivottable/utilities.js`
- `superset-frontend/src/setup/setupFormatters.ts`

**Пример кода**:

```javascript
const locales = {
  en: {
    aggregators,
    localeStrings: {
      renderError: 'An error occurred rendering the PivotTable results.',
      computeError: 'An error occurred computing the PivotTable results.',
      uiRenderError: 'An error occurred rendering the PivotTable UI.',
      selectAll: 'Select All',
      selectNone: 'Select None',
      tooMany: '(too many to list)',
      filterResults: 'Filter values',
      apply: 'Apply',
      cancel: 'Cancel',
      totals: 'Totals',
      vs: 'vs',
      by: 'by',
    },
  },
};
```

## Прочие модификации

### Условное форматирование

**Описание**: Компоненты для условного форматирования в визуализациях.

**DODO-модификации**:

- **45525377**: Созданы компоненты для условного форматирования

**Ключевые файлы**:

- `superset-frontend/src/DodoExtensions/explore/components/controls/ConditionalFormattingControlDodo/ConditionalFormattingControlDodo.tsx`
- `superset-frontend/src/DodoExtensions/explore/components/controls/ConditionalFormattingControlDodo/FormattingPopoverDodo.tsx`

**Пример кода**:

```typescript
const FormattingPopoverDodo = (props: FormattingPopoverProps) => {
  const render = useCallback(
    params => <FormattingPopoverContentDodo {...params} />,
    [],
  );

  return <FormattingPopoverWrapper {...props} renderContent={render} />;
};
```
