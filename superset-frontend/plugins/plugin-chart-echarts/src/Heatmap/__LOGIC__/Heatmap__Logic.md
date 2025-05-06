# Бизнес-логика графика: Heatmap (Тепловая карта)

## Общее описание

Heatmap (Тепловая карта) - это тип визуализации, который показывает связанную метрику между парами групп. Тепловые карты отлично подходят для демонстрации корреляции или силы связи между двумя группами. Цвет используется для выделения силы связи между каждой парой групп. Этот тип графика особенно полезен для визуализации плотности или интенсивности данных в двумерном пространстве.

## Основные параметры и их назначение

### Параметры запроса (Query)

| Параметр        | Назначение                                  | Подтверждение в коде                                     |
| --------------- | ------------------------------------------- | -------------------------------------------------------- |
| `x_axis`        | Столбец для оси X                           | [controlPanel.tsx](../controlPanel.tsx): `x_axis`        |
| `groupby`       | Столбец для оси Y                           | [controlPanel.tsx](../controlPanel.tsx): `groupby`       |
| `metric`        | Метрика для определения интенсивности цвета | [controlPanel.tsx](../controlPanel.tsx): `metric`        |
| `adhoc_filters` | Фильтры для данных                          | [controlPanel.tsx](../controlPanel.tsx): `adhoc_filters` |
| `row_limit`     | Ограничение количества строк                | [controlPanel.tsx](../controlPanel.tsx): `row_limit`     |
| `sort_x_axis`   | Сортировка оси X                            | [controlPanel.tsx](../controlPanel.tsx): `sort_x_axis`   |
| `sort_y_axis`   | Сортировка оси Y                            | [controlPanel.tsx](../controlPanel.tsx): `sort_y_axis`   |

### Параметры отображения (Chart Options)

| Параметр              | Назначение                          | Подтверждение в коде                                           |
| --------------------- | ----------------------------------- | -------------------------------------------------------------- |
| `legend_type`         | Тип легенды (continuous, piecewise) | [controlPanel.tsx](../controlPanel.tsx): `legend_type`         |
| `linear_color_scheme` | Цветовая схема                      | [controlPanel.tsx](../controlPanel.tsx): `linear_color_scheme` |
| `xscale_interval`     | Интервал шкалы X                    | [controlPanel.tsx](../controlPanel.tsx): `xscale_interval`     |
| `yscale_interval`     | Интервал шкалы Y                    | [controlPanel.tsx](../controlPanel.tsx): `yscale_interval`     |
| `value_bounds`        | Границы значений для цветовой шкалы | [controlPanel.tsx](../controlPanel.tsx): `value_bounds`        |
| `y_axis_format`       | Формат оси Y                        | [controlPanel.tsx](../controlPanel.tsx): `y_axis_format`       |
| `x_axis_time_format`  | Формат времени для оси X            | [controlPanel.tsx](../controlPanel.tsx): `x_axis_time_format`  |
| `currency_format`     | Формат валюты                       | [controlPanel.tsx](../controlPanel.tsx): `currency_format`     |
| `show_legend`         | Отображение легенды                 | [controlPanel.tsx](../controlPanel.tsx): `show_legend`         |
| `show_percentage`     | Отображение процентов               | [controlPanel.tsx](../controlPanel.tsx): `show_percentage`     |
| `show_values`         | Отображение значений                | [controlPanel.tsx](../controlPanel.tsx): `show_values`         |
| `normalized`          | Нормализация данных                 | [controlPanel.tsx](../controlPanel.tsx): `normalized`          |
| `normalize_across`    | Нормализация по оси                 | [controlPanel.tsx](../controlPanel.tsx): `normalize_across`    |
| `left_margin`         | Левый отступ                        | [controlPanel.tsx](../controlPanel.tsx): `left_margin`         |
| `bottom_margin`       | Нижний отступ                       | [controlPanel.tsx](../controlPanel.tsx): `bottom_margin`       |

## Логика работы и обработки данных

### Основной поток данных

1. **Получение данных**: Данные получаются из источника данных через API запрос.
2. **Трансформация данных**: Данные преобразуются в формат, подходящий для тепловой карты.
   - В файле [transformProps.ts](../transformProps.ts) происходит преобразование данных из формата запроса в формат, необходимый для компонента ECharts.
   - Для каждой пары значений (X, Y) определяется интенсивность цвета на основе значения метрики.
3. **Расчет итогов**: Рассчитываются итоги по осям X и Y, а также общий итог.
   - Функция `calculateTotals` в [transformProps.ts](../transformProps.ts) рассчитывает суммы значений метрики для каждого значения оси X, каждого значения оси Y и общую сумму.
   - Эти итоги используются для расчета процентов при отображении подсказок.
4. **Нормализация данных**: Если включена нормализация, значения метрики нормализуются.
   - Параметр `normalized` определяет, применяется ли нормальное распределение на основе ранга к цветовой шкале.
   - Параметр `normalize_across` определяет, как рассчитываются проценты: по всей тепловой карте, по оси X или по оси Y.
5. **Отображение**: Данные отображаются в виде тепловой карты с использованием библиотеки ECharts.

### Расчет процентов

Параметр `normalize_across` определяет, как рассчитываются проценты для отображения в подсказках:

- **heatmap**: Проценты рассчитываются относительно общей суммы значений метрики по всей тепловой карте.
- **x**: Проценты рассчитываются относительно суммы значений метрики для текущего значения оси X.
- **y**: Проценты рассчитываются относительно суммы значений метрики для текущего значения оси Y.

Функция расчета процентов в [transformProps.ts](../transformProps.ts) использует итоги, рассчитанные функцией `calculateTotals`.

### Определение границ цветовой шкалы

Параметр `value_bounds` позволяет задать минимальное и максимальное значения для цветовой шкалы:

- Если минимальное значение не задано, оно определяется как минимальное значение метрики в данных.
- Если максимальное значение не задано, оно определяется как максимальное значение метрики в данных.
- Если данные не содержат значений метрики, используются значения по умолчанию (0 и 200).

## Форматирование и визуальные настройки

### Форматирование значений

- **Формат оси Y** (`y_axis_format`): Определяет формат отображения значений метрики.
- **Формат времени для оси X** (`x_axis_time_format`): Определяет формат отображения временных значений на оси X.
- **Формат валюты** (`currency_format`): Определяет формат отображения валютных значений.

### Настройки легенды

- **Тип легенды** (`legend_type`): Определяет тип легенды:
  - **continuous**: Непрерывная цветовая шкала.
  - **piecewise**: Дискретная цветовая шкала с отдельными цветами для разных диапазонов значений.
- **Отображение легенды** (`show_legend`): Определяет, отображается ли легенда.

### Настройки отображения

- **Отображение значений** (`show_values`): Определяет, отображаются ли числовые значения внутри ячеек.
- **Отображение процентов** (`show_percentage`): Определяет, включаются ли проценты в подсказки.
- **Интервалы шкал** (`xscale_interval`, `yscale_interval`): Определяют интервалы между метками на осях X и Y.
- **Отступы** (`left_margin`, `bottom_margin`): Определяют отступы от краев графика.

## Примеры конфигурации в JSON

### Пример 1: Базовая конфигурация

```json
{
  "datasource": "5__table",
  "viz_type": "heatmap",
  "slice_id": 123,
  "x_axis": "day_of_week",
  "groupby": "hour",
  "metric": {
    "aggregate": "COUNT",
    "column": {
      "column_name": "*"
    },
    "expressionType": "SIMPLE",
    "label": "COUNT(*)"
  },
  "adhoc_filters": [],
  "row_limit": 10000,
  "sort_x_axis": "alpha_asc",
  "sort_y_axis": "alpha_asc",
  "legend_type": "continuous",
  "linear_color_scheme": "blue_green",
  "xscale_interval": -1,
  "yscale_interval": -1,
  "value_bounds": [null, null],
  "y_axis_format": ",.2f",
  "show_legend": true,
  "show_percentage": true,
  "show_values": false,
  "normalized": false,
  "normalize_across": "heatmap",
  "left_margin": "auto",
  "bottom_margin": "auto"
}
```

### Пример 2: Тепловая карта с нормализацией по оси X

```json
{
  "datasource": "5__table",
  "viz_type": "heatmap",
  "slice_id": 123,
  "x_axis": "product_category",
  "groupby": "region",
  "metric": {
    "aggregate": "SUM",
    "column": {
      "column_name": "sales"
    },
    "expressionType": "SIMPLE",
    "label": "SUM(sales)"
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
  "sort_x_axis": "value_desc",
  "sort_y_axis": "value_desc",
  "legend_type": "piecewise",
  "linear_color_scheme": "red_yellow_blue",
  "xscale_interval": 1,
  "yscale_interval": 1,
  "value_bounds": [0, null],
  "y_axis_format": "$,.2f",
  "currency_format": {
    "symbol": "$",
    "symbolPosition": "prefix"
  },
  "show_legend": true,
  "show_percentage": true,
  "show_values": true,
  "normalized": true,
  "normalize_across": "x",
  "left_margin": "50",
  "bottom_margin": "50"
}
```

### Пример 3: Тепловая карта с временной осью X

```json
{
  "datasource": "5__table",
  "viz_type": "heatmap",
  "slice_id": 123,
  "x_axis": "date",
  "groupby": "customer_segment",
  "metric": {
    "aggregate": "AVG",
    "column": {
      "column_name": "order_value"
    },
    "expressionType": "SIMPLE",
    "label": "AVG(order_value)"
  },
  "adhoc_filters": [],
  "row_limit": 10000,
  "sort_x_axis": "alpha_asc",
  "sort_y_axis": "alpha_asc",
  "legend_type": "continuous",
  "linear_color_scheme": "purple_blue_green",
  "xscale_interval": 5,
  "yscale_interval": 1,
  "value_bounds": [null, null],
  "y_axis_format": ",.1f",
  "x_axis_time_format": "%Y-%m-%d",
  "show_legend": true,
  "show_percentage": false,
  "show_values": true,
  "normalized": false,
  "normalize_across": "heatmap",
  "left_margin": "auto",
  "bottom_margin": "auto"
}
```

## Пути к файлам реализации

- **Основной компонент**: [superset-frontend/plugins/plugin-chart-echarts/src/Heatmap/Heatmap.tsx](../Heatmap.tsx)
- **Трансформация данных**: [superset-frontend/plugins/plugin-chart-echarts/src/Heatmap/transformProps.ts](../transformProps.ts)
- **Конфигурация**: [superset-frontend/plugins/plugin-chart-echarts/src/Heatmap/controlPanel.tsx](../controlPanel.tsx)
- **Типы данных**: [superset-frontend/plugins/plugin-chart-echarts/src/Heatmap/types.ts](../types.ts)
- **Построение запроса**: [superset-frontend/plugins/plugin-chart-echarts/src/Heatmap/buildQuery.ts](../buildQuery.ts)

## Примечания

- Heatmap использует библиотеку ECharts для визуализации данных.
- Параметр `normalize_across` влияет на то, как рассчитываются проценты для отображения в подсказках.
- Параметр `normalized` определяет, применяется ли нормальное распределение на основе ранга к цветовой шкале.
- Для временных данных на оси X можно использовать параметр `x_axis_time_format` для форматирования дат.
- Параметры `sort_x_axis` и `sort_y_axis` позволяют сортировать оси по алфавиту или по значению метрики.
- Параметр `value_bounds` позволяет задать минимальное и максимальное значения для цветовой шкалы, что полезно для сравнения нескольких тепловых карт.
- При изменении логики этого плагина необходимо обновить соответствующие функции расчета итогов и процентов в `transformProps.ts`.
