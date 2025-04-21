# Бизнес-логика графика: Gauge Chart (Диаграмма-датчик)

## Общее описание

Gauge Chart (Диаграмма-датчик) - это тип визуализации, который показывает прогресс метрики относительно целевого значения. Положение стрелки представляет прогресс, а конечное значение на шкале представляет целевое значение. Этот тип графика особенно полезен для отображения KPI и других показателей эффективности.

## Основные параметры и их назначение

### Параметры запроса (Query)

| Параметр         | Назначение                              | Подтверждение в коде                                      |
| ---------------- | --------------------------------------- | --------------------------------------------------------- |
| `groupby`        | Столбцы для группировки данных          | [controlPanel.tsx](../controlPanel.tsx): `groupby`        |
| `metric`         | Метрика для отображения на датчике      | [controlPanel.tsx](../controlPanel.tsx): `metric`         |
| `adhoc_filters`  | Фильтры для данных                      | [controlPanel.tsx](../controlPanel.tsx): `adhoc_filters`  |
| `row_limit`      | Ограничение количества строк (датчиков) | [controlPanel.tsx](../controlPanel.tsx): `row_limit`      |
| `sort_by_metric` | Сортировка по метрике                   | [controlPanel.tsx](../controlPanel.tsx): `sort_by_metric` |

### Параметры отображения (Chart Options)

| Параметр                 | Назначение                       | Подтверждение в коде                                              |
| ------------------------ | -------------------------------- | ----------------------------------------------------------------- |
| `min_val`                | Минимальное значение на шкале    | [controlPanel.tsx](../controlPanel.tsx): `min_val`                |
| `max_val`                | Максимальное значение на шкале   | [controlPanel.tsx](../controlPanel.tsx): `max_val`                |
| `font_size`              | Размер шрифта                    | [controlPanel.tsx](../controlPanel.tsx): `font_size`              |
| `number_format`          | Формат отображения чисел         | [controlPanel.tsx](../controlPanel.tsx): `number_format`          |
| `currency_format`        | Формат отображения валюты        | [controlPanel.tsx](../controlPanel.tsx): `currency_format`        |
| `value_formatter`        | Формат отображения значения      | [controlPanel.tsx](../controlPanel.tsx): `value_formatter`        |
| `animation`              | Анимация при изменении значения  | [controlPanel.tsx](../controlPanel.tsx): `animation`              |
| `show_pointer`           | Отображение стрелки              | [controlPanel.tsx](../controlPanel.tsx): `show_pointer`           |
| `start_angle`            | Начальный угол шкалы             | [controlPanel.tsx](../controlPanel.tsx): `start_angle`            |
| `end_angle`              | Конечный угол шкалы              | [controlPanel.tsx](../controlPanel.tsx): `end_angle`              |
| `show_axis_tick`         | Отображение делений на шкале     | [controlPanel.tsx](../controlPanel.tsx): `show_axis_tick`         |
| `show_split_line`        | Отображение разделительных линий | [controlPanel.tsx](../controlPanel.tsx): `show_split_line`        |
| `split_number`           | Количество делений на шкале      | [controlPanel.tsx](../controlPanel.tsx): `split_number`           |
| `show_progress`          | Отображение прогресса            | [controlPanel.tsx](../controlPanel.tsx): `show_progress`          |
| `overlap`                | Перекрытие прогресс-баров        | [controlPanel.tsx](../controlPanel.tsx): `overlap`                |
| `round_cap`              | Закругленные концы прогресс-бара | [controlPanel.tsx](../controlPanel.tsx): `round_cap`              |
| `intervals`              | Границы интервалов               | [controlPanel.tsx](../controlPanel.tsx): `intervals`              |
| `interval_color_indices` | Цвета интервалов                 | [controlPanel.tsx](../controlPanel.tsx): `interval_color_indices` |
| `color_scheme`           | Цветовая схема                   | [types.ts](../types.ts): `colorScheme`                            |

## Логика работы и обработки данных

### Основной поток данных

1. **Получение данных**: Данные получаются из источника данных через API запрос.
2. **Трансформация данных**: Данные преобразуются в формат, подходящий для диаграммы-датчика.
   - В файле [transformProps.ts](../transformProps.ts) происходит преобразование данных из формата запроса в формат, необходимый для компонента ECharts.
   - Для каждой группы (определяемой параметром `groupby`) создается отдельный датчик.
3. **Расчет параметров шкалы**: Определяются минимальное и максимальное значения шкалы.
   - Если `minVal` и `maxVal` не указаны, они рассчитываются автоматически на основе данных.
   - Функция `calculateMin` определяет минимальное значение как удвоенный минимум из всех значений метрики или 0.
   - Функция `calculateMax` определяет максимальное значение как удвоенный максимум из всех значений метрики или 0.
4. **Настройка интервалов**: Если указаны интервалы, шкала разделяется на цветовые зоны.
   - Функция `getIntervalBoundsAndColors` преобразует строки с интервалами и цветами в формат, необходимый для ECharts.
5. **Отображение**: Данные отображаются в виде диаграммы-датчика с использованием библиотеки ECharts.

### Расчет ширины осевой линии

Ширина осевой линии зависит от параметра `overlap` и количества датчиков:

- Если `overlap` = true, ширина равна размеру шрифта.
- Если `overlap` = false, ширина равна произведению размера шрифта на количество датчиков.

Функция `calculateAxisLineWidth` в [transformProps.ts](../transformProps.ts) отвечает за этот расчет.

### Форматирование значений

Значения на шкале и в центре датчика форматируются с использованием:

- Параметра `numberFormat` для общего форматирования чисел.
- Параметра `currencyFormat` для форматирования валютных значений.
- Параметра `valueFormatter` для добавления дополнительного текста до или после значения (например, единицы измерения).

Функция `formatValue` в [transformProps.ts](../transformProps.ts) отвечает за форматирование значений.

## Форматирование и визуальные настройки

### Настройки шкалы

- **Угловой диапазон**: Параметры `startAngle` и `endAngle` определяют угловой диапазон шкалы. По умолчанию это 225° и -45° соответственно, что создает 3/4 круга.
- **Деления на шкале**: Параметр `splitNumber` определяет количество делений на шкале.
- **Отображение делений**: Параметры `showAxisTick` и `showSplitLine` определяют, отображаются ли деления и разделительные линии на шкале.

### Настройки прогресса

- **Отображение прогресса**: Параметр `showProgress` определяет, отображается ли прогресс-бар.
- **Перекрытие прогресс-баров**: Параметр `overlap` определяет, перекрываются ли прогресс-бары при наличии нескольких групп данных.
- **Закругленные концы**: Параметр `roundCap` определяет, имеют ли прогресс-бары закругленные концы.

### Настройки интервалов

Параметры `intervals` и `intervalColorIndices` позволяют разделить шкалу на цветовые зоны:

- `intervals`: Строка с разделенными запятыми границами интервалов, например, "2,4,5" для интервалов 0-2, 2-4 и 4-5.
- `intervalColorIndices`: Строка с разделенными запятыми индексами цветов для интервалов, например, "1,2,4". Индексы соответствуют цветам из выбранной цветовой схемы и начинаются с 1.

## Примеры конфигурации в JSON

### Пример 1: Базовая конфигурация

```json
{
  "datasource": "5__table",
  "viz_type": "echarts_gauge",
  "slice_id": 123,
  "groupby": ["department"],
  "metric": {
    "aggregate": "SUM",
    "column": {
      "column_name": "sales"
    },
    "expressionType": "SIMPLE",
    "label": "SUM(sales)"
  },
  "adhoc_filters": [],
  "row_limit": 5,
  "min_val": 0,
  "max_val": 100,
  "font_size": 15,
  "number_format": ",.2f",
  "animation": true,
  "show_progress": true,
  "overlap": true,
  "round_cap": false,
  "show_axis_tick": false,
  "show_split_line": false,
  "split_number": 10,
  "start_angle": 225,
  "end_angle": -45,
  "show_pointer": true,
  "value_formatter": "{value}%"
}
```

### Пример 2: Конфигурация с интервалами

```json
{
  "datasource": "5__table",
  "viz_type": "echarts_gauge",
  "slice_id": 123,
  "groupby": ["department"],
  "metric": {
    "aggregate": "AVG",
    "column": {
      "column_name": "performance"
    },
    "expressionType": "SIMPLE",
    "label": "AVG(performance)"
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
  "row_limit": 5,
  "min_val": 0,
  "max_val": 100,
  "font_size": 15,
  "number_format": ",.0f",
  "animation": true,
  "show_progress": true,
  "overlap": true,
  "round_cap": true,
  "show_axis_tick": true,
  "show_split_line": true,
  "split_number": 10,
  "start_angle": 225,
  "end_angle": -45,
  "show_pointer": true,
  "intervals": "30,70,100",
  "interval_color_indices": "3,2,1",
  "color_scheme": "supersetColors",
  "value_formatter": "{value}%"
}
```

### Пример 3: Конфигурация с несколькими датчиками без перекрытия

```json
{
  "datasource": "5__table",
  "viz_type": "echarts_gauge",
  "slice_id": 123,
  "groupby": ["region", "product"],
  "metric": {
    "aggregate": "SUM",
    "column": {
      "column_name": "revenue"
    },
    "expressionType": "SIMPLE",
    "label": "SUM(revenue)"
  },
  "adhoc_filters": [],
  "row_limit": 3,
  "min_val": 0,
  "max_val": 1000000,
  "font_size": 12,
  "number_format": "$,.0f",
  "currency_format": {
    "symbol": "$",
    "symbolPosition": "prefix"
  },
  "animation": true,
  "show_progress": true,
  "overlap": false,
  "round_cap": false,
  "show_axis_tick": true,
  "show_split_line": true,
  "split_number": 5,
  "start_angle": 180,
  "end_angle": 0,
  "show_pointer": true,
  "value_formatter": "${value}"
}
```

## Пути к файлам реализации

- **Основной компонент**: [superset-frontend/plugins/plugin-chart-echarts/src/Gauge/EchartsGauge.tsx](../EchartsGauge.tsx)
- **Трансформация данных**: [superset-frontend/plugins/plugin-chart-echarts/src/Gauge/transformProps.ts](../transformProps.ts)
- **Конфигурация**: [superset-frontend/plugins/plugin-chart-echarts/src/Gauge/controlPanel.tsx](../controlPanel.tsx)
- **Типы данных**: [superset-frontend/plugins/plugin-chart-echarts/src/Gauge/types.ts](../types.ts)
- **Константы**: [superset-frontend/plugins/plugin-chart-echarts/src/Gauge/constants.ts](../constants.ts)
- **Построение запроса**: [superset-frontend/plugins/plugin-chart-echarts/src/Gauge/buildQuery.ts](../buildQuery.ts)

## Примечания

- Gauge Chart использует библиотеку ECharts для визуализации данных.
- Если не указаны `minVal` и `maxVal`, они рассчитываются автоматически на основе данных.
- Параметр `overlap` влияет на то, как отображаются несколько датчиков: с перекрытием или без.
- Интервалы позволяют разделить шкалу на цветовые зоны, что полезно для визуализации различных уровней производительности.
- Параметр `valueFormatter` позволяет добавлять дополнительный текст до или после значения, например, единицы измерения.
- При изменении логики этого плагина необходимо обновить соответствующие функции расчета параметров шкалы в `transformProps.ts`.
