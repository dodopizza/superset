# Бизнес-логика графика: Funnel Chart (Воронка)

## Общее описание

Funnel Chart (Воронка) - это тип визуализации, который показывает, как метрика изменяется по мере прохождения воронки. Этот классический график полезен для визуализации отсева между этапами в процессе или жизненном цикле. Воронка особенно эффективна для отображения последовательных этапов процесса и анализа конверсии между этими этапами.

## Основные параметры и их назначение

### Параметры запроса (Query)

| Параметр | Назначение | Подтверждение в коде |
|----------|------------|----------------------|
| `groupby` | Измерения для определения этапов воронки | [controlPanel.tsx](../controlPanel.tsx): `groupby` |
| `metric` | Метрика для измерения значений на каждом этапе | [controlPanel.tsx](../controlPanel.tsx): `metric` |
| `adhoc_filters` | Фильтры для данных | [controlPanel.tsx](../controlPanel.tsx): `adhoc_filters` |
| `row_limit` | Ограничение количества строк (этапов) | [controlPanel.tsx](../controlPanel.tsx): `row_limit` |
| `sort_by_metric` | Сортировка по метрике | [controlPanel.tsx](../controlPanel.tsx): `sort_by_metric` |
| `percent_calculation_type` | Тип расчета процентов | [controlPanel.tsx](../controlPanel.tsx): `percent_calculation_type` |

### Параметры отображения (Chart Options)

| Параметр | Назначение | Подтверждение в коде |
|----------|------------|----------------------|
| `color_scheme` | Цветовая схема для графика | [controlPanel.tsx](../controlPanel.tsx): `color_scheme` |
| `label_type` | Содержимое меток (категория, значение, процент) | [controlPanel.tsx](../controlPanel.tsx): `label_type` |
| `tooltip_label_type` | Содержимое подсказок | [transformProps.ts](../transformProps.ts): `tooltipLabelType` |
| `number_format` | Формат отображения чисел | [controlPanel.tsx](../controlPanel.tsx): `number_format` |
| `currency_format` | Формат отображения валюты | [controlPanel.tsx](../controlPanel.tsx): `currency_format` |
| `show_labels` | Отображение меток | [controlPanel.tsx](../controlPanel.tsx): `show_labels` |
| `show_tooltip_labels` | Отображение подсказок | [controlPanel.tsx](../controlPanel.tsx): `show_tooltip_labels` |
| `orient` | Ориентация воронки (вертикальная/горизонтальная) | [transformProps.ts](../transformProps.ts): `orient` |
| `sort` | Порядок сортировки (по возрастанию/убыванию/без сортировки) | [transformProps.ts](../transformProps.ts): `sort` |
| `gap` | Расстояние между блоками воронки | [transformProps.ts](../transformProps.ts): `gap` |
| `label_line` | Отображение линий для меток | [transformProps.ts](../transformProps.ts): `labelLine` |
| `show_legend` | Отображение легенды | [transformProps.ts](../transformProps.ts): `showLegend` |
| `legend_orientation` | Ориентация легенды | [transformProps.ts](../transformProps.ts): `legendOrientation` |
| `legend_type` | Тип легенды | [transformProps.ts](../transformProps.ts): `legendType` |
| `legend_margin` | Отступ легенды | [transformProps.ts](../transformProps.ts): `legendMargin` |

## Логика работы и обработки данных

### Основной поток данных

1. **Получение данных**: Данные получаются из источника данных через API запрос.
2. **Трансформация данных**: Данные преобразуются в формат, подходящий для воронки.
   - В файле [transformProps.ts](../transformProps.ts) происходит преобразование данных из формата запроса в формат, необходимый для компонента ECharts.
   - Для каждого этапа воронки (определяемого параметром `groupby`) создается блок с соответствующим значением метрики.
3. **Расчет процентов**: Для каждого этапа рассчитываются проценты в зависимости от выбранного типа расчета:
   - `PercentCalcType.FirstStep`: Процент от первого этапа (по умолчанию)
   - `PercentCalcType.PreviousStep`: Процент от предыдущего этапа
   - `PercentCalcType.Total`: Процент от общего значения
4. **Отображение**: Данные отображаются в виде воронки с использованием библиотеки ECharts.

### Расчет процентов

Параметр `percent_calculation_type` определяет, как рассчитываются проценты для каждого этапа воронки:

- **Calculate from first step** (`PercentCalcType.FirstStep`): Процент рассчитывается относительно значения первого этапа. Это позволяет увидеть, какая доля от начального значения сохраняется на каждом этапе.
- **Calculate from previous step** (`PercentCalcType.PreviousStep`): Процент рассчитывается относительно значения предыдущего этапа. Это позволяет увидеть конверсию между соседними этапами.
- **Percent of total** (`PercentCalcType.Total`): Процент рассчитывается относительно общего значения всех этапов.

Функция `parseParams` в [transformProps.ts](../transformProps.ts) отвечает за расчет процентов в зависимости от выбранного типа.

## Форматирование и визуальные настройки

### Форматирование значений

- **Числовое форматирование** (`number_format`): Определяет формат отображения числовых значений с использованием d3-format.
- **Валютное форматирование** (`currency_format`): Определяет формат отображения валютных значений.

### Визуальные настройки

- **Ориентация воронки** (`orient`): Определяет ориентацию воронки - вертикальная (`vertical`) или горизонтальная (`horizontal`).
- **Порядок сортировки** (`sort`): Определяет порядок сортировки блоков воронки - по убыванию (`descending`), по возрастанию (`ascending`) или без сортировки (`none`).
- **Расстояние между блоками** (`gap`): Определяет расстояние между блоками воронки в пикселях.
- **Линии для меток** (`label_line`): Определяет, отображаются ли линии, соединяющие метки с блоками воронки.
- **Цветовая схема** (`color_scheme`): Определяет цветовую схему для графика.

### Настройки меток и подсказок

Параметр `label_type` определяет содержимое меток на графике:
- `Key`: Только название категории
- `Value`: Только значение
- `Percent`: Только процент
- `KeyValue`: Название категории и значение
- `KeyPercent`: Название категории и процент
- `KeyValuePercent`: Название категории, значение и процент
- `ValuePercent`: Значение и процент

Аналогично, параметр `tooltip_label_type` определяет содержимое всплывающих подсказок.

## Примеры конфигурации в JSON

### Пример 1: Базовая конфигурация

```json
{
  "datasource": "5__table",
  "viz_type": "echarts_funnel",
  "slice_id": 123,
  "groupby": ["stage_name"],
  "metric": "count",
  "adhoc_filters": [],
  "row_limit": 10,
  "sort_by_metric": true,
  "percent_calculation_type": "first_step",
  "color_scheme": "supersetColors",
  "label_type": 5,
  "number_format": "SMART_NUMBER",
  "show_labels": true,
  "show_tooltip_labels": true,
  "orient": "vertical",
  "sort": "descending",
  "gap": 0,
  "label_line": false,
  "show_legend": true,
  "legend_orientation": "top",
  "legend_type": "scroll"
}
```

### Пример 2: Горизонтальная воронка с расчетом от предыдущего шага

```json
{
  "datasource": "5__table",
  "viz_type": "echarts_funnel",
  "slice_id": 123,
  "groupby": ["conversion_stage"],
  "metric": {
    "aggregate": "SUM",
    "column": {
      "column_name": "users"
    },
    "expressionType": "SIMPLE",
    "label": "SUM(users)"
  },
  "adhoc_filters": [
    {
      "clause": "WHERE",
      "expressionType": "SIMPLE",
      "filterOptionName": "filter_8ly71emic_hc9vt9a6i7",
      "comparator": "2023-01-01",
      "operator": ">=",
      "subject": "date"
    }
  ],
  "row_limit": 10,
  "sort_by_metric": true,
  "percent_calculation_type": "prev_step",
  "color_scheme": "d3Category20",
  "label_type": 2,
  "tooltip_label_type": 5,
  "number_format": ",.1f",
  "show_labels": true,
  "show_tooltip_labels": true,
  "orient": "horizontal",
  "sort": "descending",
  "gap": 2,
  "label_line": true,
  "show_legend": true,
  "legend_orientation": "right",
  "legend_type": "scroll"
}
```

### Пример 3: Воронка с валютным форматированием

```json
{
  "datasource": "5__table",
  "viz_type": "echarts_funnel",
  "slice_id": 123,
  "groupby": ["sales_stage"],
  "metric": {
    "aggregate": "SUM",
    "column": {
      "column_name": "revenue"
    },
    "expressionType": "SIMPLE",
    "label": "SUM(revenue)"
  },
  "adhoc_filters": [],
  "row_limit": 10,
  "sort_by_metric": true,
  "percent_calculation_type": "total",
  "color_scheme": "supersetColors",
  "label_type": 6,
  "tooltip_label_type": 5,
  "number_format": "$,.2f",
  "currency_format": {
    "symbol": "$",
    "symbolPosition": "prefix"
  },
  "show_labels": true,
  "show_tooltip_labels": true,
  "orient": "vertical",
  "sort": "descending",
  "gap": 0,
  "label_line": false,
  "show_legend": true,
  "legend_orientation": "top",
  "legend_type": "scroll"
}
```

## Пути к файлам реализации

- **Основной компонент**: [superset-frontend/plugins/plugin-chart-echarts/src/Funnel/EchartsFunnel.tsx](../EchartsFunnel.tsx)
- **Трансформация данных**: [superset-frontend/plugins/plugin-chart-echarts/src/Funnel/transformProps.ts](../transformProps.ts)
- **Конфигурация**: [superset-frontend/plugins/plugin-chart-echarts/src/Funnel/controlPanel.tsx](../controlPanel.tsx)
- **Типы данных**: [superset-frontend/plugins/plugin-chart-echarts/src/Funnel/types.ts](../types.ts)
- **Построение запроса**: [superset-frontend/plugins/plugin-chart-echarts/src/Funnel/buildQuery.ts](../buildQuery.ts)

## Примечания

- Funnel Chart использует библиотеку ECharts для визуализации данных.
- Тип расчета процентов (`percent_calculation_type`) существенно влияет на интерпретацию данных в воронке.
- Для корректного отображения воронки рекомендуется ограничивать количество этапов (не более 10).
- Параметр `sort_by_metric` позволяет автоматически сортировать этапы воронки по значению метрики.
- При изменении логики этого плагина необходимо обновить соответствующие функции расчета процентов в `parseParams`.
