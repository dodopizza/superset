# Бизнес-логика графика: Radar Chart (Лепестковая диаграмма)

## Общее описание

Radar Chart (Лепестковая диаграмма) - это тип визуализации, который позволяет отображать параллельный набор метрик для нескольких групп. Каждая группа визуализируется с помощью собственной линии точек, а каждая метрика представлена как ось на диаграмме. Этот тип графика особенно полезен для сравнения нескольких показателей между различными категориями и выявления сильных и слабых сторон каждой категории.

## Основные параметры и их назначение

### Параметры запроса (Query)

| Параметр              | Назначение                      | Подтверждение в коде                                           |
| --------------------- | ------------------------------- | -------------------------------------------------------------- |
| `groupby`             | Столбцы для группировки данных  | [controlPanel.tsx](../controlPanel.tsx): `groupby`             |
| `metrics`             | Метрики для отображения на осях | [controlPanel.tsx](../controlPanel.tsx): `metrics`             |
| `series_limit_metric` | Метрика для ограничения серий   | [controlPanel.tsx](../controlPanel.tsx): `series_limit_metric` |
| `adhoc_filters`       | Фильтры для данных              | [controlPanel.tsx](../controlPanel.tsx): `adhoc_filters`       |
| `row_limit`           | Ограничение количества строк    | [controlPanel.tsx](../controlPanel.tsx): `row_limit`           |

### Параметры отображения (Chart Options)

| Параметр             | Назначение                                       | Подтверждение в коде                                          |
| -------------------- | ------------------------------------------------ | ------------------------------------------------------------- |
| `color_scheme`       | Цветовая схема                                   | [controlPanel.tsx](../controlPanel.tsx): `color_scheme`       |
| `show_labels`        | Отображение меток                                | [controlPanel.tsx](../controlPanel.tsx): `show_labels`        |
| `label_type`         | Тип меток (value, key_value)                     | [types.ts](../types.ts): `labelType`                          |
| `label_position`     | Позиция меток                                    | [types.ts](../types.ts): `labelPosition`                      |
| `number_format`      | Формат отображения чисел                         | [controlPanel.tsx](../controlPanel.tsx): `number_format`      |
| `date_format`        | Формат отображения дат                           | [controlPanel.tsx](../controlPanel.tsx): `date_format`        |
| `is_circle`          | Форма радара (круг или многоугольник)            | [controlPanel.tsx](../controlPanel.tsx): `is_circle`          |
| `column_config`      | Настройка метрик (включая максимальные значения) | [controlPanel.tsx](../controlPanel.tsx): `column_config`      |
| `show_legend`        | Отображение легенды                              | [controlPanel.tsx](../controlPanel.tsx): `show_legend`        |
| `legend_type`        | Тип легенды                                      | [controlPanel.tsx](../controlPanel.tsx): `legend_type`        |
| `legend_orientation` | Ориентация легенды                               | [controlPanel.tsx](../controlPanel.tsx): `legend_orientation` |

## Логика работы и обработки данных

### Основной поток данных

1. **Получение данных**: Данные получаются из источника данных через API запрос.
2. **Трансформация данных**: Данные преобразуются в формат, подходящий для лепестковой диаграммы.
   - В файле [transformProps.ts](../transformProps.ts) происходит преобразование данных из формата запроса в формат, необходимый для компонента ECharts.
   - Для каждой группы (определяемой параметром `groupby`) создается отдельная серия данных.
   - Каждая метрика становится осью на лепестковой диаграмме.
3. **Определение максимальных значений**: Для каждой метрики определяется максимальное значение.
   - Если в `column_config` указано максимальное значение для метрики, используется оно.
   - В противном случае максимальное значение определяется автоматически на основе данных.
   - Функция в [transformProps.ts](../transformProps.ts) создает карту `metricLabelAndMaxValueMap` для хранения максимальных значений.
4. **Отображение**: Данные отображаются в виде лепестковой диаграммы с использованием библиотеки ECharts.

### Определение максимальных значений

Максимальные значения для каждой метрики определяются следующим образом:

```typescript
const indicator = metricLabels.map(metricLabel => {
  const maxValueInControl = columnConfig?.[metricLabel]?.radarMetricMaxValue;
  // Ensure that 0 is at the center of the polar coordinates
  const metricValueAsMax =
    metricLabelAndMaxValueMap.get(metricLabel) === 0
      ? Number.MAX_SAFE_INTEGER
      : metricLabelAndMaxValueMap.get(metricLabel);
  const max = maxValueInControl === null ? metricValueAsMax : maxValueInControl;
  return {
    name: metricLabel,
    max,
  };
});
```

Если значение метрики равно 0, используется `Number.MAX_SAFE_INTEGER`, чтобы обеспечить, что 0 находится в центре полярных координат.

### Форматирование меток

Функция `formatLabel` в [transformProps.ts](../transformProps.ts) форматирует метки в соответствии с выбранным типом:

```typescript
export function formatLabel({
  params,
  labelType,
  numberFormatter,
}: {
  params: CallbackDataParams;
  labelType: EchartsRadarLabelType;
  numberFormatter: NumberFormatter;
}): string {
  const { name = '', value } = params;
  const formattedValue = numberFormatter(value as number);

  switch (labelType) {
    case EchartsRadarLabelType.Value:
      return formattedValue;
    case EchartsRadarLabelType.KeyValue:
      return `${name}: ${formattedValue}`;
    default:
      return name;
  }
}
```

## Форматирование и визуальные настройки

### Форматирование значений

- **Формат чисел** (`number_format`): Определяет формат отображения числовых значений.
- **Формат дат** (`date_format`): Определяет формат отображения дат.

### Настройки меток

- **Отображение меток** (`show_labels`): Определяет, отображаются ли метки.
- **Тип меток** (`label_type`): Определяет, какая информация отображается в метках:
  - **value**: Только значение метрики.
  - **key_value**: Название метрики и значение.
- **Позиция меток** (`label_position`): Определяет позицию меток относительно точек данных.

### Настройки формы

- **Форма радара** (`is_circle`): Определяет форму лепестковой диаграммы:
  - **true**: Круглая форма.
  - **false**: Многоугольная форма.

### Настройка метрик

Параметр `column_config` позволяет настраивать отображение каждой метрики, включая установку максимального значения:

```typescript
columnConfig: {
  Sales: { radarMetricMaxValue: 6500 },
  Administration: { radarMetricMaxValue: 16000 },
  'Information Technology': { radarMetricMaxValue: 30000 },
  'Customer Support': { radarMetricMaxValue: 38000 },
  Development: { radarMetricMaxValue: 52000 },
  Marketing: { radarMetricMaxValue: 25000 },
}
```

## Примеры конфигурации в JSON

### Пример 1: Базовая лепестковая диаграмма

```json
{
  "datasource": "5__table",
  "viz_type": "echarts_radar",
  "slice_id": 123,
  "groupby": ["department"],
  "metrics": [
    "sales",
    "marketing",
    "development",
    "customer_support",
    "information_technology",
    "administration"
  ],
  "adhoc_filters": [],
  "row_limit": 10,
  "color_scheme": "supersetColors",
  "show_labels": true,
  "label_type": "value",
  "label_position": "top",
  "number_format": ",.2f",
  "date_format": "smart_date",
  "is_circle": false,
  "show_legend": true,
  "legend_type": "scroll",
  "legend_orientation": "top"
}
```

### Пример 2: Круговая лепестковая диаграмма с настройкой максимальных значений

```json
{
  "datasource": "5__table",
  "viz_type": "echarts_radar",
  "slice_id": 123,
  "groupby": ["product_line"],
  "metrics": [
    "count",
    {
      "expressionType": "SIMPLE",
      "column": {
        "column_name": "price_each"
      },
      "aggregate": "AVG",
      "label": "AVG(price_each)"
    }
  ],
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
  "color_scheme": "d3Category20",
  "show_labels": true,
  "label_type": "key_value",
  "label_position": "top",
  "number_format": "$,.2f",
  "date_format": "smart_date",
  "is_circle": true,
  "column_config": {
    "count": { "radarMetricMaxValue": 1000 },
    "AVG(price_each)": { "radarMetricMaxValue": 100 }
  },
  "show_legend": true,
  "legend_type": "scroll",
  "legend_orientation": "right"
}
```

### Пример 3: Лепестковая диаграмма с фильтрацией и сортировкой

```json
{
  "datasource": "5__table",
  "viz_type": "echarts_radar",
  "slice_id": 123,
  "groupby": ["region"],
  "metrics": [
    "revenue",
    "profit",
    "cost",
    "customer_acquisition",
    "customer_retention"
  ],
  "series_limit_metric": "revenue",
  "adhoc_filters": [
    {
      "clause": "WHERE",
      "expressionType": "SIMPLE",
      "filterOptionName": "filter_8ly71emic_hc9vt9a6i7",
      "comparator": ["North", "South", "East", "West"],
      "operator": "IN",
      "subject": "region"
    }
  ],
  "row_limit": 5,
  "color_scheme": "supersetColors",
  "show_labels": false,
  "label_type": "value",
  "label_position": "top",
  "number_format": ",.0f",
  "date_format": "smart_date",
  "is_circle": false,
  "column_config": {
    "revenue": { "radarMetricMaxValue": 1000000 },
    "profit": { "radarMetricMaxValue": 500000 },
    "cost": { "radarMetricMaxValue": 800000 },
    "customer_acquisition": { "radarMetricMaxValue": 10000 },
    "customer_retention": { "radarMetricMaxValue": 20000 }
  },
  "show_legend": true,
  "legend_type": "scroll",
  "legend_orientation": "bottom"
}
```

## Пути к файлам реализации

- **Основной компонент**: [superset-frontend/plugins/plugin-chart-echarts/src/Radar/EchartsRadar.tsx](../EchartsRadar.tsx)
- **Трансформация данных**: [superset-frontend/plugins/plugin-chart-echarts/src/Radar/transformProps.ts](../transformProps.ts)
- **Конфигурация**: [superset-frontend/plugins/plugin-chart-echarts/src/Radar/controlPanel.tsx](../controlPanel.tsx)
- **Типы данных**: [superset-frontend/plugins/plugin-chart-echarts/src/Radar/types.ts](../types.ts)
- **Построение запроса**: [superset-frontend/plugins/plugin-chart-echarts/src/Radar/buildQuery.ts](../buildQuery.ts)

## Примечания

- Radar Chart использует библиотеку ECharts для визуализации данных.
- Параметр `column_config` позволяет настраивать максимальные значения для каждой метрики, что полезно для сравнения нескольких лепестковых диаграмм.
- Если максимальное значение для метрики не указано, оно определяется автоматически на основе данных.
- Если значение метрики равно 0, используется `Number.MAX_SAFE_INTEGER` в качестве максимального значения, чтобы обеспечить, что 0 находится в центре полярных координат.
- Параметр `is_circle` позволяет выбрать между круговой и многоугольной формой лепестковой диаграммы.
- При изменении логики этого плагина необходимо обновить соответствующие функции определения максимальных значений и форматирования меток в `transformProps.ts`.
