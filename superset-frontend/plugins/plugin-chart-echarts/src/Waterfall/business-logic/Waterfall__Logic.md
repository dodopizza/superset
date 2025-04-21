# Бизнес-логика графика: Waterfall Chart (Каскадная диаграмма)

## Общее описание

Waterfall Chart (Каскадная диаграмма) - это тип визуализации, который помогает понять кумулятивный эффект последовательно введенных положительных или отрицательных значений. Эти промежуточные значения могут быть как временными, так и категориальными. Каскадная диаграмма особенно полезна для отображения изменений в значении метрики с течением времени или по категориям, показывая, как каждое изменение влияет на общую сумму.

## Основные параметры и их назначение

### Параметры запроса (Query)

| Параметр | Назначение | Подтверждение в коде |
|----------|------------|----------------------|
| `x_axis` | Столбец для оси X | [controlPanel.tsx](../controlPanel.tsx): `x_axis` |
| `time_grain_sqla` | Гранулярность времени | [controlPanel.tsx](../controlPanel.tsx): `time_grain_sqla` |
| `groupby` | Столбцы для разбивки данных | [controlPanel.tsx](../controlPanel.tsx): `groupby` |
| `metric` | Метрика для отображения | [controlPanel.tsx](../controlPanel.tsx): `metric` |
| `adhoc_filters` | Фильтры для данных | [controlPanel.tsx](../controlPanel.tsx): `adhoc_filters` |
| `row_limit` | Ограничение количества строк | [controlPanel.tsx](../controlPanel.tsx): `row_limit` |

### Параметры отображения (Chart Options)

| Параметр | Назначение | Подтверждение в коде |
|----------|------------|----------------------|
| `show_value` | Отображение значений | [controlPanel.tsx](../controlPanel.tsx): `show_value` |
| `show_legend` | Отображение легенды | [controlPanel.tsx](../controlPanel.tsx): `show_legend` |
| `increase_color` | Цвет для увеличения | [controlPanel.tsx](../controlPanel.tsx): `increase_color` |
| `decrease_color` | Цвет для уменьшения | [controlPanel.tsx](../controlPanel.tsx): `decrease_color` |
| `total_color` | Цвет для итога | [controlPanel.tsx](../controlPanel.tsx): `total_color` |
| `x_axis_label` | Заголовок оси X | [controlPanel.tsx](../controlPanel.tsx): `x_axis_label` |
| `x_axis_time_format` | Формат времени для оси X | [controlPanel.tsx](../controlPanel.tsx): `x_axis_time_format` |
| `x_ticks_layout` | Расположение меток оси X | [controlPanel.tsx](../controlPanel.tsx): `x_ticks_layout` |
| `y_axis_label` | Заголовок оси Y | [controlPanel.tsx](../controlPanel.tsx): `y_axis_label` |
| `y_axis_format` | Формат оси Y | [controlPanel.tsx](../controlPanel.tsx): `y_axis_format` |
| `currency_format` | Формат валюты | [controlPanel.tsx](../controlPanel.tsx): `currency_format` |

## Логика работы и обработки данных

### Основной поток данных

1. **Получение данных**: Данные получаются из источника данных через API запрос.
2. **Трансформация данных**: Данные преобразуются в формат, подходящий для каскадной диаграммы.
   - В файле [transformProps.ts](../transformProps.ts) функция `transformer` преобразует данные в формат, необходимый для компонента ECharts.
   - Данные группируются по оси X и, если указано, по столбцу разбивки.
   - Для каждой категории рассчитывается изменение значения метрики.
3. **Расчет кумулятивных значений**: Для каждой категории рассчитывается кумулятивная сумма.
   - Функция `transformer` рассчитывает кумулятивную сумму для каждой категории.
   - Для каждой категории определяется, является ли изменение положительным или отрицательным.
4. **Создание серий данных**: Создаются серии данных для увеличения, уменьшения и итога.
   - Серия `INCREASE` содержит положительные изменения.
   - Серия `DECREASE` содержит отрицательные изменения.
   - Серия `TOTAL` содержит итоговые значения.
   - Дополнительная серия `ASSIST_MARK` используется для визуального эффекта каскада.
5. **Отображение**: Данные отображаются в виде каскадной диаграммы с использованием библиотеки ECharts.

### Расчет кумулятивных значений

Функция `transformer` в [transformProps.ts](../transformProps.ts) рассчитывает кумулятивные значения следующим образом:

```typescript
// Для каждой категории
const categoryData = groupedData.get(categoryLabel) || [];
// Рассчитываем сумму метрики для категории
const sum = categoryData.reduce((acc, cur) => acc + (cur[metric] as number), 0);
// Определяем, является ли изменение положительным или отрицательным
const isIncrease = sum >= 0;
// Добавляем данные в соответствующие массивы
if (isIncrease) {
  increaseData.push({
    name: categoryLabel,
    value: sum,
    originalValue: sum,
    totalSum: totalSum + sum,
  });
  decreaseData.push({
    name: categoryLabel,
    value: TOKEN,
  });
} else {
  increaseData.push({
    name: categoryLabel,
    value: TOKEN,
  });
  decreaseData.push({
    name: categoryLabel,
    value: Math.abs(sum),
    originalValue: sum,
    totalSum: totalSum + sum,
  });
}
// Обновляем общую сумму
totalSum += sum;
```

### Форматирование подсказок

Функция `formatTooltip` в [transformProps.ts](../transformProps.ts) форматирует подсказки, которые отображаются при наведении на столбцы:

```typescript
function formatTooltip({
  params,
  breakdownName,
  defaultFormatter,
  xAxisFormatter,
}: {
  params: ICallbackDataParams[];
  breakdownName?: string;
  defaultFormatter: NumberFormatter | CurrencyFormatter;
  xAxisFormatter: (value: number | string, index: number) => string;
}) {
  const series = params.find(
    param => param.seriesName !== ASSIST_MARK && param.data.value !== TOKEN,
  );

  // We may have no matching series depending on the legend state
  if (!series) {
    return '';
  }

  const isTotal = series?.seriesName === LEGEND.TOTAL;
  if (!series) {
    return NULL_STRING;
  }

  const title =
    !isTotal || breakdownName
      ? xAxisFormatter(series.name, series.dataIndex)
      : undefined;
  const rows: string[][] = [];
  if (!isTotal) {
    rows.push([
      series.seriesName!,
      defaultFormatter(series.data.originalValue),
    ]);
  }
  rows.push([TOTAL_MARK, defaultFormatter(series.data.totalSum)]);
  return tooltipHtml(rows, title);
}
```

## Форматирование и визуальные настройки

### Форматирование значений

- **Формат оси Y** (`y_axis_format`): Определяет формат отображения числовых значений.
- **Формат валюты** (`currency_format`): Определяет формат отображения валютных значений.
- **Формат времени для оси X** (`x_axis_time_format`): Определяет формат отображения временных значений на оси X.

### Настройки цветов

- **Цвет для увеличения** (`increase_color`): Определяет цвет для положительных изменений.
- **Цвет для уменьшения** (`decrease_color`): Определяет цвет для отрицательных изменений.
- **Цвет для итога** (`total_color`): Определяет цвет для итоговых значений.

### Настройки меток

- **Отображение значений** (`show_value`): Определяет, отображаются ли значения над столбцами.
- **Расположение меток оси X** (`x_ticks_layout`): Определяет расположение меток оси X (auto, flat, 45°, 90°, staggered).

## Примеры конфигурации в JSON

### Пример 1: Базовая каскадная диаграмма

```json
{
  "datasource": "5__table",
  "viz_type": "waterfall",
  "slice_id": 123,
  "x_axis": "month",
  "metric": {
    "aggregate": "SUM",
    "column": {
      "column_name": "revenue"
    },
    "expressionType": "SIMPLE",
    "label": "SUM(revenue)"
  },
  "adhoc_filters": [],
  "row_limit": 10000,
  "show_value": true,
  "show_legend": true,
  "increase_color": {
    "r": 90,
    "g": 193,
    "b": 137,
    "a": 1
  },
  "decrease_color": {
    "r": 224,
    "g": 67,
    "b": 85,
    "a": 1
  },
  "total_color": {
    "r": 102,
    "g": 102,
    "b": 102,
    "a": 1
  },
  "x_axis_label": "Месяц",
  "x_axis_time_format": "smart_date",
  "x_ticks_layout": "auto",
  "y_axis_label": "Выручка",
  "y_axis_format": "$,.2f",
  "currency_format": {
    "symbol": "$",
    "symbolPosition": "prefix"
  }
}
```

### Пример 2: Каскадная диаграмма с разбивкой

```json
{
  "datasource": "5__table",
  "viz_type": "waterfall",
  "slice_id": 123,
  "x_axis": "quarter",
  "groupby": ["product_line"],
  "metric": {
    "aggregate": "SUM",
    "column": {
      "column_name": "profit"
    },
    "expressionType": "SIMPLE",
    "label": "SUM(profit)"
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
  "row_limit": 10000,
  "show_value": true,
  "show_legend": true,
  "increase_color": {
    "r": 0,
    "g": 128,
    "b": 0,
    "a": 1
  },
  "decrease_color": {
    "r": 255,
    "g": 0,
    "b": 0,
    "a": 1
  },
  "total_color": {
    "r": 0,
    "g": 0,
    "b": 0,
    "a": 1
  },
  "x_axis_label": "Квартал",
  "x_axis_time_format": "Q%q %Y",
  "x_ticks_layout": "45°",
  "y_axis_label": "Прибыль",
  "y_axis_format": "$,.0f",
  "currency_format": {
    "symbol": "$",
    "symbolPosition": "prefix"
  }
}
```

### Пример 3: Каскадная диаграмма с временной осью

```json
{
  "datasource": "5__table",
  "viz_type": "waterfall",
  "slice_id": 123,
  "time_grain_sqla": "P1M",
  "metric": {
    "aggregate": "SUM",
    "column": {
      "column_name": "cost"
    },
    "expressionType": "SIMPLE",
    "label": "SUM(cost)"
  },
  "adhoc_filters": [],
  "row_limit": 10000,
  "show_value": false,
  "show_legend": true,
  "increase_color": {
    "r": 255,
    "g": 165,
    "b": 0,
    "a": 1
  },
  "decrease_color": {
    "r": 0,
    "g": 0,
    "b": 255,
    "a": 1
  },
  "total_color": {
    "r": 128,
    "g": 128,
    "b": 128,
    "a": 1
  },
  "x_axis_label": "Дата",
  "x_axis_time_format": "%b %Y",
  "x_ticks_layout": "staggered",
  "y_axis_label": "Затраты",
  "y_axis_format": ",.0f",
  "currency_format": {
    "symbol": "",
    "symbolPosition": "prefix"
  }
}
```

## Пути к файлам реализации

- **Основной компонент**: [superset-frontend/plugins/plugin-chart-echarts/src/Waterfall/EchartsWaterfall.tsx](../EchartsWaterfall.tsx)
- **Трансформация данных**: [superset-frontend/plugins/plugin-chart-echarts/src/Waterfall/transformProps.ts](../transformProps.ts)
- **Конфигурация**: [superset-frontend/plugins/plugin-chart-echarts/src/Waterfall/controlPanel.tsx](../controlPanel.tsx)
- **Типы данных**: [superset-frontend/plugins/plugin-chart-echarts/src/Waterfall/types.ts](../types.ts)
- **Константы**: [superset-frontend/plugins/plugin-chart-echarts/src/Waterfall/constants.ts](../constants.ts)
- **Построение запроса**: [superset-frontend/plugins/plugin-chart-echarts/src/Waterfall/buildQuery.ts](../buildQuery.ts)

## Примечания

- Waterfall Chart использует библиотеку ECharts для визуализации данных.
- Параметр `groupby` позволяет разбить данные по категориям, что помогает понять, как каждая категория влияет на общее значение.
- Для визуального эффекта каскада используется дополнительная серия `ASSIST_MARK`, которая не отображается в легенде.
- Положительные изменения отображаются с помощью серии `INCREASE`, а отрицательные - с помощью серии `DECREASE`.
- Итоговые значения отображаются с помощью серии `TOTAL`.
- При наведении на столбец отображается подсказка с информацией о изменении и общей сумме.
- При изменении логики этого плагина необходимо обновить соответствующие функции расчета кумулятивных значений и форматирования подсказок в `transformProps.ts`.
