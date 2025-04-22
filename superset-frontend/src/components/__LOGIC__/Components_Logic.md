# Документация по DODO-специфичным компонентам и функциям в Superset

## Содержание

1. [Введение](#введение)
2. [Компоненты визуализации](#компоненты-визуализации)
   - [MixedTimeseries (Смешанный график)](#mixedtimeseries-смешанный-график)
   - [PivotTable (Сводная таблица)](#pivottable-сводная-таблица)
   - [Bubble Chart (Пузырьковая диаграмма)](#bubble-chart-пузырьковая-диаграмма)
   - [BigNumber (Большое число)](#bignumber-большое-число)
   - [BarDodo (Столбчатая диаграмма)](#bardodo-столбчатая-диаграмма)
3. [Общие функции и утилиты](#общие-функции-и-утилиты)
   - [extractDatasourceDescriptions](#extractdatasourcedescriptions)
   - [extendDatasourceDescriptions](#extenddatasourcedescriptions)
4. [Компоненты интерфейса](#компоненты-интерфейса)
   - [ColorPickerControlDodo](#colorpickercontroldodo)
   - [ConditionalFormattingControlDodo](#conditionalformattingcontroldodo)
   - [InfoIcon](#infoicon)
   - [PinIcon](#pinicon)
5. [Прочие модификации](#прочие-модификации)

## Введение

Данный документ содержит информацию о компонентах и функциях, которые были добавлены или модифицированы командой DODO в проекте Superset. Каждая модификация помечена идентификатором изменения (например, "DODO 45525377").

## Компоненты визуализации

### MixedTimeseries (Смешанный график)

**Описание**: Компонент для визуализации двух различных серий данных с использованием одной оси X. Позволяет отображать разные типы графиков (например, столбцы и линии) на одном графике.

**DODO-модификации**:
- **45525377**: Добавлена возможность показывать/скрывать значения на графике
- **44211769**: Добавлена возможность настраивать форматирование метрик
- **44136746**: Добавлена возможность экспортировать данные как временные ряды
- **44728892**: Добавлены тултипы с описанием для элементов легенды

**Ключевые файлы**:
- `superset-frontend/plugins/plugin-chart-echarts/src/MixedTimeseries/EchartsMixedTimeseries.tsx`
- `superset-frontend/plugins/plugin-chart-echarts/src/MixedTimeseries/transformProps.ts`
- `superset-frontend/plugins/plugin-chart-echarts/src/MixedTimeseries/controlPanel.tsx`

**Пример кода** (добавление тултипов с описанием):
```typescript
// DODO added 44728892
const datasourceDescriptions = extractDatasourceDescriptions(
  [...metrics, ...metricsB],
  datasourceMetrics,
  datasourceColumns,
  locale,
);
const extendedDatasourceDescriptions = extendDatasourceDescriptions(
  datasourceDescriptions,
  [...groupby, ...groupbyB],
  series,
);
```

### PivotTable (Сводная таблица)

**Описание**: Компонент для создания сводных таблиц с возможностью группировки, агрегации и форматирования данных.

**DODO-модификации**:
- **45525377**: Добавлена возможность закрепления колонок (pinned columns)
- **44211769**: Добавлена возможность настраивать форматирование метрик
- **44728892**: Добавлены тултипы с описанием для заголовков и данных

**Ключевые файлы**:
- `superset-frontend/plugins/plugin-chart-pivot-table/src/PivotTableChart.tsx`
- `superset-frontend/plugins/plugin-chart-pivot-table/src/react-pivottable/TableRenderers.jsx`
- `superset-frontend/plugins/plugin-chart-pivot-table/src/DodoExtensions/utils/getPinnedColumnIndexes.ts`

**Пример кода** (закрепление колонок):
```jsx
TableRenderer.propTypes = {
  ...PivotData.propTypes,
  tableOptions: PropTypes.object,
  onContextMenu: PropTypes.func,
  pinnedColumns: PropTypes.array, // DODO added 45525377
};
TableRenderer.defaultProps = {
  ...PivotData.defaultProps,
  tableOptions: {},
  pinnedColumns: [], // DODO added 45525377
};
```

### Bubble Chart (Пузырьковая диаграмма)

**Описание**: Компонент для визуализации метрик в трех измерениях (ось X, ось Y и размер пузырька). Пузырьки из одной группы могут быть выделены цветом.

**DODO-модификации**:
- Добавлена возможность настройки отображения меток
- Добавлена возможность настройки размера и цвета пузырьков
- Добавлена возможность настройки логарифмической шкалы для осей

**Ключевые файлы**:
- `superset-frontend/plugins/plugin-chart-echarts/src/DodoExtensions/Bubble/BubbleDodo.tsx`
- `superset-frontend/plugins/plugin-chart-echarts/src/DodoExtensions/Bubble/transformProps.ts`
- `superset-frontend/plugins/plugin-chart-echarts/src/DodoExtensions/Bubble/types.ts`

**Пример кода** (настройка меток):
```typescript
label: {
  show: showLabels,
  // Text of labels.
  formatter(param: { data: Array<number | string> }) {
    return param.data[ENTRY_INDEX];
  },
  position: labelLocation ?? 'top',
  fontSize: getNumber(labelFontSize) || DEFAULT_LABEL_FONT_SIZE,
  color: labelColor || undefined,
}
```

### BigNumber (Большое число)

**Описание**: Компонент для отображения одного большого числа с возможностью показа тренда.

**DODO-модификации**:
- **45525377**: Добавлена возможность условного форматирования для значения и процентного изменения
- Добавлена возможность выбора значения для отображения (самое старое, среднее, последнее)
- Добавлена возможность выравнивания (по левому краю, по центру, по правому краю)

**Ключевые файлы**:
- `superset-frontend/plugins/plugin-chart-echarts/src/DodoExtensions/BigNumber/BigNumberViz.tsx`
- `superset-frontend/plugins/plugin-chart-echarts/src/DodoExtensions/BigNumber/BigNumberWithTrendline/transformPropsDodo.ts`
- `superset-frontend/plugins/plugin-chart-echarts/src/DodoExtensions/BigNumber/types.ts`

**Пример кода** (условное форматирование):
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
}
```

### BarDodo (Столбчатая диаграмма)

**Описание**: Модифицированная версия столбчатой диаграммы с дополнительными возможностями.

**DODO-модификации**:
- **45525377**: Создан компонент с расширенными возможностями форматирования и отображения

**Ключевые файлы**:
- `superset-frontend/plugins/plugin-chart-echarts/src/DodoExtensions/BarDodo/index.ts`
- `superset-frontend/plugins/plugin-chart-echarts/src/DodoExtensions/BarDodo/transformProps.ts`
- `superset-frontend/plugins/plugin-chart-echarts/src/DodoExtensions/BarDodo/controlPanel.tsx`

## Общие функции и утилиты

### extractDatasourceDescriptions

**Описание**: Функция для извлечения описаний метрик из источника данных. Используется для добавления тултипов с описанием для элементов легенды и заголовков таблиц.

**DODO-модификации**:
- **44728892**: Создана функция для извлечения описаний с учетом локализации

**Ключевые файлы**:
- `superset-frontend/packages/superset-ui-chart-controls/src/DodoExtensions/utils/extractDatasourceDescriptions.ts`

**Пример кода**:
```typescript
export const extractDatasourceDescriptions = (
  queryFormMetrics: QueryFormMetric[], // Chart Metrics
  datasourceMetrics: Metric[],
  datasourceColumns: Column[],
  locale: string,
): Record<string, string> => {
  const descriptions: Record<string, string> = {};

  const localizedKey = `description_${locale}` as
    | 'description_en'
    | 'description_ru';

  // ...

  const getDescription = (source: Source): Maybe<string> | undefined =>
    source[localizedKey] ||
    source.description_ru ||
    source.description_en ||
    source.description;

  // ...

  return descriptions;
};
```

### extendDatasourceDescriptions

**Описание**: Функция для расширения описаний на серии данных, которые включают группировку.

**DODO-модификации**:
- **44728892**: Создана функция для расширения описаний

**Ключевые файлы**:
- `superset-frontend/plugins/plugin-chart-echarts/src/DodoExtensions/utils/extendDatasourceDescriptions.ts`

**Пример кода**:
```typescript
export const extendDatasourceDescriptions = (
  datasourceDesriptions: Record<string, string>,
  groupBy: QueryFormColumn[],
  series: SeriesOption[],
): Record<string, string> => {
  if (!groupBy.length) return datasourceDesriptions;

  const extendedDatasourceDesriptions = {
    ...datasourceDesriptions,
  };

  series.forEach(option => {
    const { id } = option;

    if (typeof id !== 'string') return;

    const metricName = id.split(', ')[0];

    if (extendedDatasourceDesriptions[metricName]) {
      extendedDatasourceDesriptions[id] =
        extendedDatasourceDesriptions[metricName];
    }
  });

  return extendedDatasourceDesriptions;
};
```

## Компоненты интерфейса

### ColorPickerControlDodo

**Описание**: Модифицированная версия компонента выбора цвета с улучшенным интерфейсом.

**DODO-модификации**:
- **45525377**: Изменены стили относительно оригинального компонента, убрана фиксированная ширина и высота

**Ключевые файлы**:
- `superset-frontend/src/DodoExtensions/explore/components/controls/ColorPickerControlDodo.jsx`

**Пример кода**:
```jsx
export default class ColorPickerControlDodo extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(col) {
    // DODO changed
    this.props.onChange(this.props.isHex ? col.hex : col.rgb);
  }

  // ...
}
```

### ConditionalFormattingControlDodo

**Описание**: Компонент для настройки условного форматирования с расширенными возможностями.

**DODO-модификации**:
- Добавлена возможность настройки условного форматирования с сообщениями

**Ключевые файлы**:
- `superset-frontend/src/DodoExtensions/explore/components/controls/ConditionalFormattingControlDodo/ConditionalFormattingControlDodo.tsx`

### InfoIcon

**Описание**: Компонент для отображения иконки информации.

**DODO-модификации**:
- Создан компонент для использования в тултипах с описанием

**Ключевые файлы**:
- `superset-frontend/src/DodoExtensions/components/InfoIcon/index.tsx`

**Пример кода**:
```tsx
export const InfoIcon = ({ color }: { color?: string }) => (
  <div>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill={color || 'black'}
      className="bi bi-info-circle"
      viewBox="0 0 16 16"
    >
      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
      <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
    </svg>
  </div>
);
```

### PinIcon

**Описание**: Компонент для отображения иконки закрепления.

**DODO-модификации**:
- **45525377**: Создан компонент для использования в функционале закрепления колонок

**Ключевые файлы**:
- `superset-frontend/packages/superset-ui-chart-controls/src/DodoExtensions/components/PinIcon.tsx`

**Пример кода**:
```tsx
export const PinIcon = ({
  isPinned,
  handlePinning,
}: {
  isPinned: boolean;
  handlePinning: () => void;
}) => {
  const togglePin = (e: React.MouseEvent<SVGElement>) => {
    e.stopPropagation();
    handlePinning();
  };

  return (
    <StyledPinIcon
      style={{ marginRight: '0.5rem' }}
      $isPinned={isPinned}
      onClick={togglePin}
    />
  );
};
```

## Прочие модификации

### Локализация

В проекте добавлена поддержка русского языка. Многие компоненты и функции учитывают текущую локаль пользователя и отображают соответствующие переводы.

### Стилизация для DODO

В файле `superset-frontend/src/Superstructure/Root/utils.ts` добавлена функция `dirtyHackDodoIs`, которая исправляет проблему с CSS-свойством min-height в элементе div.all, которое приводило к перекрытию футера.

```typescript
const dirtyHackDodoIs = () => {
  // In dodois the div.all has css property min-height, that forces the footer to be overlapped
  const dodoElementAll = document.getElementsByClassName('all')[0];

  if (dodoElementAll?.classList.contains('overwrite-height')) {
    dodoElementAll.classList.remove('overwrite-height');
  }
};
```

### Фильтры и наборы фильтров

В директории `superset-frontend/src/DodoExtensions/FilterSets/` добавлены компоненты для работы с наборами фильтров, включая:
- `FiltersHeader.tsx` - компонент для отображения заголовка фильтров
- `Footer.tsx` - компонент для отображения футера с кнопками действий
- Утилиты для работы с фильтрами

### Onboarding

В директории `superset-frontend/src/DodoExtensions/onBoarding/` добавлены компоненты для онбординга новых пользователей, включая:
- Компоненты для выбора ролей
- Компоненты для пошагового обучения работе с системой
