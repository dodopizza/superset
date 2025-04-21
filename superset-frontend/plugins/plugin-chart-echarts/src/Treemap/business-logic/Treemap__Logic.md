# Бизнес-логика графика: Treemap (Древовидная карта)

## Общее описание

Treemap (Древовидная карта) - это тип визуализации, который показывает иерархические отношения данных, где значение представлено площадью, демонстрируя пропорции и вклад в целое. Этот тип графика особенно полезен для отображения иерархических структур данных, таких как категории и подкатегории, и их относительной важности.

## Основные параметры и их назначение

### Параметры запроса (Query)

| Параметр | Назначение | Подтверждение в коде |
|----------|------------|----------------------|
| `groupby` | Столбцы для группировки данных (иерархия) | [types.ts](../types.ts): `groupby` |
| `metric` | Метрика для определения размера блоков | [types.ts](../types.ts): `metric` |
| `adhoc_filters` | Фильтры для данных | [controlPanel.tsx](../controlPanel.tsx): `adhoc_filters` |
| `row_limit` | Ограничение количества строк | [controlPanel.tsx](../controlPanel.tsx): `row_limit` |

### Параметры отображения (Chart Options)

| Параметр | Назначение | Подтверждение в коде |
|----------|------------|----------------------|
| `color_scheme` | Цветовая схема | [types.ts](../types.ts): `colorScheme` |
| `label_type` | Тип меток (key, value, key_value) | [types.ts](../types.ts): `labelType` |
| `label_position` | Позиция меток | [types.ts](../types.ts): `labelPosition` |
| `show_labels` | Отображение меток | [types.ts](../types.ts): `showLabels` |
| `show_upper_labels` | Отображение верхних меток | [types.ts](../types.ts): `showUpperLabels` |
| `number_format` | Формат отображения чисел | [types.ts](../types.ts): `numberFormat` |
| `date_format` | Формат отображения дат | [types.ts](../types.ts): `dateFormat` |

## Логика работы и обработки данных

### Основной поток данных

1. **Получение данных**: Данные получаются из источника данных через API запрос.
2. **Построение дерева**: Данные преобразуются в иерархическую структуру.
   - В файле [utils/treeBuilder.ts](../../utils/treeBuilder.ts) функция `treeBuilder` рекурсивно строит дерево на основе столбцов группировки.
   - Каждый уровень группировки становится уровнем в иерархии.
   - Значение метрики определяет размер блока.
3. **Трансформация данных**: Дерево преобразуется в формат, подходящий для древовидной карты.
   - В файле [transformProps.ts](../transformProps.ts) функция `traverse` рекурсивно обходит дерево и создает структуру данных для ECharts.
   - Для каждого узла определяются параметры отображения, такие как цвет, границы и метки.
4. **Отображение**: Данные отображаются в виде древовидной карты с использованием библиотеки ECharts.

### Построение дерева

Функция `treeBuilder` в [utils/treeBuilder.ts](../../utils/treeBuilder.ts) строит иерархическую структуру данных:

```typescript
export function treeBuilder(
  data: DataRecord[],
  groupBy: string[],
  metric: string,
  secondaryMetric?: string,
): TreeNode[] {
  const [curGroupBy, ...restGroupby] = groupBy;
  const curData = _groupBy(data, curGroupBy);
  return transform(
    curData,
    (result, value, key) => {
      const name = curData[key][0][curGroupBy]!;
      if (!restGroupby.length) {
        (value ?? []).forEach(datum => {
          const metricValue = getMetricValue(datum, metric);
          const secondaryValue = secondaryMetric
            ? getMetricValue(datum, secondaryMetric)
            : metricValue;
          const item = {
            name,
            value: metricValue,
            secondaryValue,
            groupBy: curGroupBy,
          };
          result.push(item);
        });
      } else {
        const children = treeBuilder(
          value,
          restGroupby,
          metric,
          secondaryMetric,
        );
        // ...
      }
    },
    [] as TreeNode[],
  );
}
```

### Форматирование подсказок

Функция `formatTooltip` в [transformProps.ts](../transformProps.ts) форматирует подсказки, которые отображаются при наведении на блоки:

```typescript
export function formatTooltip({
  params,
  numberFormatter,
}: {
  params: TreemapSeriesCallbackDataParams;
  numberFormatter: ValueFormatter;
}): string {
  const { value, treePathInfo = [] } = params;
  const formattedValue = numberFormatter(value as number);
  const { metricLabel, treePath } = extractTreePathInfo(treePathInfo);
  const percentFormatter = getNumberFormatter(NumberFormats.PERCENT_2_POINT);
  // ...
}
```

## Форматирование и визуальные настройки

### Форматирование значений

- **Формат чисел** (`number_format`): Определяет формат отображения числовых значений.
- **Формат дат** (`date_format`): Определяет формат отображения дат.

### Настройки меток

- **Тип меток** (`label_type`): Определяет, какая информация отображается в метках:
  - **key**: Только название категории.
  - **value**: Только значение метрики.
  - **key_value**: Название категории и значение метрики.
- **Позиция меток** (`label_position`): Определяет позицию меток относительно блоков.
- **Отображение меток** (`show_labels`): Определяет, отображаются ли метки внутри блоков.
- **Отображение верхних меток** (`show_upper_labels`): Определяет, отображаются ли метки над блоками.

### Настройки блоков

- **Цветовая насыщенность** (`COLOR_SATURATION`): Определяет насыщенность цвета блоков.
- **Ширина границы** (`BORDER_WIDTH`): Определяет ширину границы между блоками.
- **Ширина промежутка** (`GAP_WIDTH`): Определяет ширину промежутка между блоками.
- **Цвет границы** (`BORDER_COLOR`): Определяет цвет границы между блоками.

## Примеры конфигурации в JSON

### Пример 1: Базовая древовидная карта

```json
{
  "datasource": "5__table",
  "viz_type": "treemap_v2",
  "slice_id": 123,
  "groupby": ["category", "subcategory"],
  "metric": {
    "aggregate": "SUM",
    "column": {
      "column_name": "sales"
    },
    "expressionType": "SIMPLE",
    "label": "SUM(sales)"
  },
  "adhoc_filters": [],
  "row_limit": 10000,
  "color_scheme": "supersetColors",
  "show_labels": true,
  "show_upper_labels": true,
  "label_type": "key_value",
  "label_position": "inside_top_left",
  "number_format": "SMART_NUMBER",
  "date_format": "smart_date"
}
```

### Пример 2: Древовидная карта с фильтрацией

```json
{
  "datasource": "5__table",
  "viz_type": "treemap_v2",
  "slice_id": 123,
  "groupby": ["year", "product_line"],
  "metric": "count",
  "adhoc_filters": [
    {
      "clause": "WHERE",
      "subject": "order_date",
      "operator": "TEMPORAL_RANGE",
      "comparator": "No filter",
      "expressionType": "SIMPLE"
    }
  ],
  "row_limit": 10000,
  "color_scheme": "supersetColors",
  "show_labels": true,
  "show_upper_labels": true,
  "label_type": "key_value",
  "label_position": "inside_top_left",
  "number_format": "SMART_NUMBER",
  "date_format": "smart_date"
}
```

### Пример 3: Древовидная карта с настройкой отображения

```json
{
  "datasource": "5__table",
  "viz_type": "treemap_v2",
  "slice_id": 123,
  "groupby": ["region", "country", "city"],
  "metric": {
    "aggregate": "AVG",
    "column": {
      "column_name": "price"
    },
    "expressionType": "SIMPLE",
    "label": "AVG(price)"
  },
  "adhoc_filters": [
    {
      "clause": "WHERE",
      "expressionType": "SIMPLE",
      "filterOptionName": "filter_8ly71emic_hc9vt9a6i7",
      "comparator": ["North America", "Europe", "Asia"],
      "operator": "IN",
      "subject": "region"
    }
  ],
  "row_limit": 10000,
  "color_scheme": "d3Category20",
  "show_labels": true,
  "show_upper_labels": false,
  "label_type": "value",
  "label_position": "inside_center",
  "number_format": "$,.2f",
  "date_format": "smart_date"
}
```

## Пути к файлам реализации

- **Основной компонент**: [superset-frontend/plugins/plugin-chart-echarts/src/Treemap/EchartsTreemap.tsx](../EchartsTreemap.tsx)
- **Трансформация данных**: [superset-frontend/plugins/plugin-chart-echarts/src/Treemap/transformProps.ts](../transformProps.ts)
- **Конфигурация**: [superset-frontend/plugins/plugin-chart-echarts/src/Treemap/controlPanel.tsx](../controlPanel.tsx)
- **Типы данных**: [superset-frontend/plugins/plugin-chart-echarts/src/Treemap/types.ts](../types.ts)
- **Константы**: [superset-frontend/plugins/plugin-chart-echarts/src/Treemap/constants.ts](../constants.ts)
- **Построение дерева**: [superset-frontend/plugins/plugin-chart-echarts/src/utils/treeBuilder.ts](../../utils/treeBuilder.ts)
- **Построение запроса**: [superset-frontend/plugins/plugin-chart-echarts/src/Treemap/buildQuery.ts](../buildQuery.ts)

## Примечания

- Treemap использует библиотеку ECharts для визуализации данных.
- Порядок столбцов в параметре `groupby` определяет иерархию в древовидной карте.
- Размер блоков пропорционален значению метрики.
- Цвет блоков определяется цветовой схемой и уровнем в иерархии.
- Параметр `show_upper_labels` позволяет отображать метки над блоками, что полезно для больших иерархий.
- При наведении на блок отображается подсказка с информацией о пути в иерархии и значении метрики.
- При изменении логики этого плагина необходимо обновить соответствующие функции построения дерева и форматирования подсказок.
