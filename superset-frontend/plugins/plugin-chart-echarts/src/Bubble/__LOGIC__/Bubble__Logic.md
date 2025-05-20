# Бизнес-логика графика: Bubble Chart (Пузырьковая диаграмма)

## Общее описание

Bubble Chart (Пузырьковая диаграмма) - это тип визуализации, который позволяет отображать данные по трем измерениям в одном графике: ось X, ось Y и размер пузырька. Пузырьки из одной группы могут быть выделены с помощью цвета. Этот тип графика особенно полезен для визуализации корреляций между различными метриками и выявления закономерностей в данных.

## Основные параметры и их назначение

### Параметры запроса (Query)

| Параметр          | Назначение                                      | Подтверждение в коде                                       |
| ----------------- | ----------------------------------------------- | ---------------------------------------------------------- |
| `series`          | Измерение для группировки пузырьков по цвету    | [controlPanel.tsx](../controlPanel.tsx): `series`          |
| `entity`          | Измерение для идентификации отдельных пузырьков | [controlPanel.tsx](../controlPanel.tsx): `entity`          |
| `x`               | Метрика для оси X                               | [controlPanel.tsx](../controlPanel.tsx): `x`               |
| `y`               | Метрика для оси Y                               | [controlPanel.tsx](../controlPanel.tsx): `y`               |
| `size`            | Метрика для определения размера пузырьков       | [controlPanel.tsx](../controlPanel.tsx): `size`            |
| `max_bubble_size` | Максимальный размер пузырька                    | [controlPanel.tsx](../controlPanel.tsx): `max_bubble_size` |
| `min_bubble_size` | Минимальный размер пузырька                     | [controlPanel.tsx](../controlPanel.tsx): `min_bubble_size` |
| `adhoc_filters`   | Фильтры для данных                              | [controlPanel.tsx](../controlPanel.tsx): `adhoc_filters`   |
| `orderby`         | Сортировка данных                               | [controlPanel.tsx](../controlPanel.tsx): `orderby`         |
| `row_limit`       | Ограничение количества строк                    | [controlPanel.tsx](../controlPanel.tsx): `row_limit`       |

### Параметры отображения (Chart Options)

| Параметр            | Назначение                                    | Подтверждение в коде                                           |
| ------------------- | --------------------------------------------- | -------------------------------------------------------------- |
| `color_scheme`      | Цветовая схема для графика                    | [controlPanel.tsx](../controlPanel.tsx): `color_scheme`        |
| `opacity`           | Прозрачность пузырьков                        | [controlPanel.tsx](../controlPanel.tsx): `opacity`             |
| `tooltipSizeFormat` | Формат числа для размера пузырька в подсказке | [controlPanel.tsx](../controlPanel.tsx): `tooltipSizeFormat`   |
| `xAxisFormat`       | Формат оси X                                  | [transformProps.ts](../transformProps.ts): `xAxisFormat`       |
| `yAxisFormat`       | Формат оси Y                                  | [transformProps.ts](../transformProps.ts): `yAxisFormat`       |
| `logXAxis`          | Логарифмическая шкала для оси X               | [transformProps.ts](../transformProps.ts): `logXAxis`          |
| `logYAxis`          | Логарифмическая шкала для оси Y               | [transformProps.ts](../transformProps.ts): `logYAxis`          |
| `xAxisBounds`       | Границы оси X                                 | [transformProps.ts](../transformProps.ts): `xAxisBounds`       |
| `yAxisBounds`       | Границы оси Y                                 | [transformProps.ts](../transformProps.ts): `yAxisBounds`       |
| `xAxisLabel`        | Заголовок оси X                               | [transformProps.ts](../transformProps.ts): `bubbleXAxisTitle`  |
| `yAxisLabel`        | Заголовок оси Y                               | [transformProps.ts](../transformProps.ts): `bubbleYAxisTitle`  |
| `xAxisTitleMargin`  | Отступ заголовка оси X                        | [transformProps.ts](../transformProps.ts): `xAxisTitleMargin`  |
| `yAxisTitleMargin`  | Отступ заголовка оси Y                        | [transformProps.ts](../transformProps.ts): `yAxisTitleMargin`  |
| `showLegend`        | Отображение легенды                           | [controlPanel.tsx](../controlPanel.tsx): `showLegend`          |
| `legendOrientation` | Ориентация легенды                            | [transformProps.ts](../transformProps.ts): `legendOrientation` |
| `legendMargin`      | Отступ легенды                                | [transformProps.ts](../transformProps.ts): `legendMargin`      |
| `legendType`        | Тип легенды                                   | [transformProps.ts](../transformProps.ts): `legendType`        |

### DODO-модификации

| Параметр                    | Назначение                                             | Подтверждение в коде                                                   |
| --------------------------- | ------------------------------------------------------ | ---------------------------------------------------------------------- |
| `min_bubble_size`           | Минимальный размер пузырька                            | [transformProps.ts](../transformProps.ts): `minBubbleSize`             |
| `xForceTimestampFormatting` | Принудительное форматирование временных меток на оси X | [transformProps.ts](../transformProps.ts): `xForceTimestampFormatting` |
| `yForceTimestampFormatting` | Принудительное форматирование временных меток на оси Y | [transformProps.ts](../transformProps.ts): `yForceTimestampFormatting` |
| `xTimeFormat`               | Формат времени для оси X                               | [transformProps.ts](../transformProps.ts): `xTimeFormat`               |
| `yTimeFormat`               | Формат времени для оси Y                               | [transformProps.ts](../transformProps.ts): `yTimeFormat`               |

## Логика работы и обработки данных

### Основной поток данных

1. **Получение данных**: Данные получаются из источника данных через API запрос.
2. **Трансформация данных**: Данные преобразуются в формат, подходящий для пузырьковой диаграммы.
   - В файле [transformProps.ts](../transformProps.ts) происходит преобразование данных из формата запроса в формат, необходимый для компонента ECharts.
   - Для каждой группы (определяемой параметром `series`) создается серия данных с соответствующим цветом.
   - Каждая точка данных содержит значения для оси X, оси Y и размера пузырька.
3. **Нормализация размеров пузырьков**: Размеры пузырьков нормализуются для обеспечения визуальной согласованности.
   - Функция `normalizeSymbolSize` в [transformProps.ts](../transformProps.ts) масштабирует размеры пузырьков в зависимости от минимального и максимального значений метрики размера.
   - Минимальный размер пузырька определяется параметром `min_bubble_size` или константой `MINIMUM_BUBBLE_SIZE` (5 по умолчанию), если параметр не задан.
4. **Отображение**: Данные отображаются в виде пузырьковой диаграммы с использованием библиотеки ECharts.

### Обработка осей

- **Логарифмические шкалы**: Параметры `logXAxis` и `logYAxis` позволяют использовать логарифмические шкалы для осей X и Y соответственно.
- **Границы осей**: Параметры `xAxisBounds` и `yAxisBounds` позволяют задать минимальные и максимальные значения для осей X и Y.
- **Форматирование осей**: Параметры `xAxisFormat` и `yAxisFormat` определяют формат отображения значений на осях.

### DODO-модификации

- **Минимальный размер пузырька**: Параметр `min_bubble_size` позволяет задать минимальный размер пузырька, что гарантирует видимость даже самых маленьких пузырьков.
- **Форматирование временных меток**: Параметры `xForceTimestampFormatting` и `yForceTimestampFormatting` позволяют принудительно форматировать временные метки на осях X и Y.
- **Форматы времени**: Параметры `xTimeFormat` и `yTimeFormat` определяют формат отображения временных меток.

## Форматирование и визуальные настройки

### Форматирование значений

- **Форматирование осей**: Параметры `xAxisFormat` и `yAxisFormat` определяют формат отображения значений на осях X и Y.
- **Форматирование размера пузырька**: Параметр `tooltipSizeFormat` определяет формат отображения размера пузырька в подсказке.

### Визуальные настройки

- **Цветовая схема**: Параметр `color_scheme` определяет цветовую схему для графика.
- **Прозрачность пузырьков**: Параметр `opacity` определяет прозрачность пузырьков (от 0 до 1).
- **Размер пузырьков**: Параметры `max_bubble_size` и `min_bubble_size` определяют максимальный и минимальный размеры пузырьков.
- **Легенда**: Параметры `showLegend`, `legendOrientation`, `legendMargin` и `legendType` определяют настройки легенды.

## Примеры конфигурации в JSON

### Пример 1: Базовая конфигурация

```json
{
  "datasource": "5__table",
  "viz_type": "echarts_bubble",
  "slice_id": 123,
  "entity": "product",
  "series": "category",
  "x": {
    "aggregate": "SUM",
    "column": {
      "column_name": "sales"
    },
    "expressionType": "SIMPLE",
    "label": "SUM(sales)"
  },
  "y": {
    "aggregate": "AVG",
    "column": {
      "column_name": "profit"
    },
    "expressionType": "SIMPLE",
    "label": "AVG(profit)"
  },
  "size": {
    "aggregate": "COUNT",
    "expressionType": "SIMPLE",
    "label": "COUNT(*)"
  },
  "max_bubble_size": "25",
  "min_bubble_size": "5",
  "adhoc_filters": [],
  "row_limit": 100,
  "color_scheme": "supersetColors",
  "opacity": 0.6,
  "xAxisFormat": ",.2f",
  "yAxisFormat": ",.2f",
  "tooltipSizeFormat": ",d",
  "xAxisLabel": "Продажи",
  "yAxisLabel": "Прибыль"
}
```

### Пример 2: Расширенная конфигурация с логарифмическими шкалами

```json
{
  "datasource": "5__table",
  "viz_type": "echarts_bubble",
  "slice_id": 123,
  "entity": "product",
  "series": "category",
  "x": {
    "aggregate": "SUM",
    "column": {
      "column_name": "sales"
    },
    "expressionType": "SIMPLE",
    "label": "SUM(sales)"
  },
  "y": {
    "aggregate": "AVG",
    "column": {
      "column_name": "profit"
    },
    "expressionType": "SIMPLE",
    "label": "AVG(profit)"
  },
  "size": {
    "aggregate": "COUNT",
    "expressionType": "SIMPLE",
    "label": "COUNT(*)"
  },
  "max_bubble_size": "50",
  "min_bubble_size": "10",
  "adhoc_filters": [
    {
      "clause": "WHERE",
      "expressionType": "SIMPLE",
      "filterOptionName": "filter_8ly71emic_hc9vt9a6i7",
      "comparator": "Electronics",
      "operator": "==",
      "subject": "category"
    }
  ],
  "row_limit": 100,
  "color_scheme": "d3Category20",
  "opacity": 0.8,
  "xAxisFormat": "$,.2f",
  "yAxisFormat": "$,.2f",
  "tooltipSizeFormat": ",d",
  "xAxisLabel": "Продажи ($)",
  "yAxisLabel": "Прибыль ($)",
  "logXAxis": true,
  "logYAxis": true,
  "xAxisBounds": [1000, null],
  "yAxisBounds": [100, null],
  "showLegend": true,
  "legendOrientation": "top",
  "legendType": "scroll"
}
```

### Пример 3: Конфигурация с DODO-модификациями

```json
{
  "datasource": "5__table",
  "viz_type": "echarts_bubble",
  "slice_id": 123,
  "entity": "product",
  "series": "category",
  "x": {
    "aggregate": "SUM",
    "column": {
      "column_name": "sales"
    },
    "expressionType": "SIMPLE",
    "label": "SUM(sales)"
  },
  "y": {
    "column": {
      "column_name": "order_date"
    },
    "expressionType": "SIMPLE",
    "label": "order_date"
  },
  "size": {
    "aggregate": "COUNT",
    "expressionType": "SIMPLE",
    "label": "COUNT(*)"
  },
  "max_bubble_size": "25",
  "min_bubble_size": "8",
  "adhoc_filters": [],
  "row_limit": 100,
  "color_scheme": "supersetColors",
  "opacity": 0.6,
  "xAxisFormat": ",.2f",
  "yAxisFormat": "smart_date",
  "tooltipSizeFormat": ",d",
  "xAxisLabel": "Продажи",
  "yAxisLabel": "Дата заказа",
  "xForceTimestampFormatting": false,
  "yForceTimestampFormatting": true,
  "yTimeFormat": "%Y-%m-%d"
}
```

## Пути к файлам реализации

- **Основной компонент**: [superset-frontend/plugins/plugin-chart-echarts/src/Bubble/EchartsBubble.tsx](../EchartsBubble.tsx)
- **Трансформация данных**: [superset-frontend/plugins/plugin-chart-echarts/src/Bubble/transformProps.ts](../transformProps.ts)
- **Конфигурация**: [superset-frontend/plugins/plugin-chart-echarts/src/Bubble/controlPanel.tsx](../controlPanel.tsx)
- **Типы данных**: [superset-frontend/plugins/plugin-chart-echarts/src/Bubble/types.ts](../types.ts)
- **Константы**: [superset-frontend/plugins/plugin-chart-echarts/src/Bubble/constants.ts](../constants.ts)
- **Построение запроса**: [superset-frontend/plugins/plugin-chart-echarts/src/Bubble/buildQuery.ts](../buildQuery.ts)
- **DODO-модификации**: [superset-frontend/plugins/plugin-chart-echarts/src/DodoExtensions/Bubble/](../../DodoExtensions/Bubble/)

## Примечания

- Bubble Chart использует библиотеку ECharts для визуализации данных.
- Размеры пузырьков нормализуются для обеспечения визуальной согласованности.
- Минимальный размер пузырька определяется параметром `min_bubble_size` или константой `MINIMUM_BUBBLE_SIZE` (5 по умолчанию), если параметр не задан.
- DODO-модификации добавляют дополнительные возможности, такие как минимальный размер пузырька и форматирование временных меток.
- При изменении логики этого плагина необходимо также обновить соответствующие компоненты в DodoExtensions, если они затрагивают DODO-модификации.
