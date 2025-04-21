# Бизнес-логика графика: Sunburst Chart (Солнечная диаграмма)

## Общее описание

Sunburst Chart (Солнечная диаграмма) - это тип визуализации, который использует концентрические круги для отображения иерархических данных. Каждый уровень иерархии представлен одним кольцом, при этом внутренний круг представляет верхний уровень иерархии. Этот тип графика особенно полезен для визуализации потока данных через различные стадии системы и понимания многоуровневых, многогрупповых данных.

## Основные параметры и их назначение

### Параметры запроса (Query)

| Параметр | Назначение | Подтверждение в коде |
|----------|------------|----------------------|
| `columns` | Столбцы для иерархии | [controlPanel.tsx](../controlPanel.tsx): `columns` |
| `metric` | Основная метрика для определения размера сегментов | [controlPanel.tsx](../controlPanel.tsx): `metric` |
| `secondary_metric` | Вторичная метрика для определения цвета | [controlPanel.tsx](../controlPanel.tsx): `secondary_metric` |
| `adhoc_filters` | Фильтры для данных | [controlPanel.tsx](../controlPanel.tsx): `adhoc_filters` |
| `row_limit` | Ограничение количества строк | [controlPanel.tsx](../controlPanel.tsx): `row_limit` |
| `sort_by_metric` | Сортировка по метрике | [controlPanel.tsx](../controlPanel.tsx): `sort_by_metric` |

### Параметры отображения (Chart Options)

| Параметр | Назначение | Подтверждение в коде |
|----------|------------|----------------------|
| `color_scheme` | Цветовая схема для категориальных данных | [controlPanel.tsx](../controlPanel.tsx): `color_scheme` |
| `linear_color_scheme` | Цветовая схема для линейных данных | [controlPanel.tsx](../controlPanel.tsx): `linear_color_scheme` |
| `show_labels` | Отображение меток | [controlPanel.tsx](../controlPanel.tsx): `show_labels` |
| `show_labels_threshold` | Порог отображения меток в процентах | [controlPanel.tsx](../controlPanel.tsx): `show_labels_threshold` |
| `show_total` | Отображение общего значения | [controlPanel.tsx](../controlPanel.tsx): `show_total` |
| `label_type` | Тип меток (key, value, key_value) | [controlPanel.tsx](../controlPanel.tsx): `label_type` |
| `number_format` | Формат отображения чисел | [controlPanel.tsx](../controlPanel.tsx): `number_format` |
| `date_format` | Формат отображения дат | [controlPanel.tsx](../controlPanel.tsx): `date_format` |

## Логика работы и обработки данных

### Основной поток данных

1. **Получение данных**: Данные получаются из источника данных через API запрос.
2. **Построение дерева**: Данные преобразуются в иерархическую структуру.
   - В файле [utils/treeBuilder.ts](../../utils/treeBuilder.ts) функция `treeBuilder` рекурсивно строит дерево на основе столбцов иерархии.
   - Каждый уровень иерархии становится кольцом в солнечной диаграмме.
   - Значение основной метрики определяет размер сегмента.
   - Значение вторичной метрики (если указана) определяет цвет сегмента.
3. **Трансформация данных**: Дерево преобразуется в формат, подходящий для солнечной диаграммы.
   - В файле [transformProps.ts](../transformProps.ts) функция `traverse` рекурсивно обходит дерево и создает структуру данных для ECharts.
   - Для каждого узла определяются параметры отображения, такие как цвет, метки и значения.
4. **Отображение**: Данные отображаются в виде солнечной диаграммы с использованием библиотеки ECharts.

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

Функция `formatTooltip` в [transformProps.ts](../transformProps.ts) форматирует подсказки, которые отображаются при наведении на сегменты:

```typescript
export function formatTooltip({
  params,
  primaryValueFormatter,
  secondaryValueFormatter,
  colorByCategory,
  totalValue,
  metricLabel,
  secondaryMetricLabel,
}: {
  params: CallbackDataParams & {
    treePathInfo: {
      name: string;
      dataIndex: number;
      value: number;
    }[];
  };
  primaryValueFormatter: ValueFormatter;
  secondaryValueFormatter: ValueFormatter | undefined;
  colorByCategory: boolean;
  totalValue: number;
  metricLabel: string;
  secondaryMetricLabel?: string;
}): string {
  const { data, treePathInfo = [] } = params;
  const node = data as TreeNode;
  const formattedValue = primaryValueFormatter(node.value);
  const formattedSecondaryValue = secondaryValueFormatter?.(
    node.secondaryValue,
  );
  // ...
}
```

## Форматирование и визуальные настройки

### Форматирование значений

- **Формат чисел** (`number_format`): Определяет формат отображения числовых значений.
- **Формат дат** (`date_format`): Определяет формат отображения дат.

### Настройки меток

- **Отображение меток** (`show_labels`): Определяет, отображаются ли метки.
- **Порог отображения меток** (`show_labels_threshold`): Определяет минимальный процент, при котором отображаются метки.
- **Тип меток** (`label_type`): Определяет, какая информация отображается в метках:
  - **key**: Только название категории.
  - **value**: Только значение метрики.
  - **key_value**: Название категории и значение метрики.

### Настройки цвета

- **Цветовая схема** (`color_scheme`): Определяет цветовую схему для категориальных данных. Используется, когда вторичная метрика не указана или совпадает с основной метрикой.
- **Линейная цветовая схема** (`linear_color_scheme`): Определяет цветовую схему для линейных данных. Используется, когда указана вторичная метрика, отличная от основной метрики.

## Примеры конфигурации в JSON

### Пример 1: Базовая солнечная диаграмма

```json
{
  "datasource": "5__table",
  "viz_type": "sunburst_v2",
  "slice_id": 123,
  "columns": ["category", "subcategory", "product"],
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
  "sort_by_metric": true,
  "color_scheme": "supersetColors",
  "show_labels": true,
  "show_labels_threshold": 5,
  "show_total": false,
  "label_type": "key",
  "number_format": "SMART_NUMBER",
  "date_format": "smart_date"
}
```

### Пример 2: Солнечная диаграмма с вторичной метрикой

```json
{
  "datasource": "5__table",
  "viz_type": "sunburst_v2",
  "slice_id": 123,
  "columns": ["region", "country", "city"],
  "metric": {
    "aggregate": "SUM",
    "column": {
      "column_name": "revenue"
    },
    "expressionType": "SIMPLE",
    "label": "SUM(revenue)"
  },
  "secondary_metric": {
    "aggregate": "AVG",
    "column": {
      "column_name": "profit_margin"
    },
    "expressionType": "SIMPLE",
    "label": "AVG(profit_margin)"
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
  "sort_by_metric": true,
  "linear_color_scheme": "blue_white_yellow",
  "show_labels": true,
  "show_labels_threshold": 3,
  "show_total": true,
  "label_type": "key_value",
  "number_format": "$,.2f",
  "date_format": "smart_date"
}
```

### Пример 3: Солнечная диаграмма с фильтрацией

```json
{
  "datasource": "5__table",
  "viz_type": "sunburst_v2",
  "slice_id": 123,
  "columns": ["year", "quarter", "month"],
  "metric": "count",
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
  "sort_by_metric": true,
  "color_scheme": "d3Category20",
  "show_labels": false,
  "show_labels_threshold": 5,
  "show_total": true,
  "label_type": "value",
  "number_format": ",d",
  "date_format": "smart_date"
}
```

## Пути к файлам реализации

- **Основной компонент**: [superset-frontend/plugins/plugin-chart-echarts/src/Sunburst/EchartsSunburst.tsx](../EchartsSunburst.tsx)
- **Трансформация данных**: [superset-frontend/plugins/plugin-chart-echarts/src/Sunburst/transformProps.ts](../transformProps.ts)
- **Конфигурация**: [superset-frontend/plugins/plugin-chart-echarts/src/Sunburst/controlPanel.tsx](../controlPanel.tsx)
- **Типы данных**: [superset-frontend/plugins/plugin-chart-echarts/src/Sunburst/types.ts](../types.ts)
- **Построение дерева**: [superset-frontend/plugins/plugin-chart-echarts/src/utils/treeBuilder.ts](../../utils/treeBuilder.ts)
- **Построение запроса**: [superset-frontend/plugins/plugin-chart-echarts/src/Sunburst/buildQuery.ts](../buildQuery.ts)

## Примечания

- Sunburst Chart использует библиотеку ECharts для визуализации данных.
- Порядок столбцов в параметре `columns` определяет иерархию в солнечной диаграмме, где внутренний круг представляет верхний уровень иерархии.
- Размер сегментов пропорционален значению основной метрики.
- Цвет сегментов определяется:
  - Категориальной цветовой схемой, если вторичная метрика не указана или совпадает с основной метрикой.
  - Линейной цветовой схемой, если указана вторичная метрика, отличная от основной метрики. В этом случае цвет определяется отношением значения вторичной метрики к значению основной метрики.
- Параметр `show_labels_threshold` позволяет скрывать метки для маленьких сегментов, что улучшает читаемость диаграммы.
- При наведении на сегмент отображается подсказка с информацией о пути в иерархии и значениях метрик.
- При изменении логики этого плагина необходимо обновить соответствующие функции построения дерева и форматирования подсказок.
