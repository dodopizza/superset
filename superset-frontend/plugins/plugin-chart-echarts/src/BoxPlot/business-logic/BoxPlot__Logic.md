# Бизнес-логика графика: Box Plot (Диаграмма размаха)

## Общее описание

Box Plot (Диаграмма размаха) - это тип визуализации, который сравнивает распределение связанных метрик по нескольким группам. Центральный "ящик" подчеркивает среднее значение, медиану и внутренние 2 квартиля. "Усы" вокруг каждого ящика визуализируют минимум, максимум, диапазон и внешние 2 квартиля.

Этот тип графика также известен как "ящик с усами" и используется для статистического анализа распределения данных, выявления выбросов и сравнения нескольких наборов данных.

## Основные параметры и их назначение

### Параметры запроса (Query)

| Параметр              | Назначение                                   | Подтверждение в коде                                         |
| --------------------- | -------------------------------------------- | ------------------------------------------------------------ |
| `columns`             | Столбцы для расчета распределения            | [controlPanel.ts](../controlPanel.ts): `columns`             |
| `time_grain_sqla`     | Гранулярность времени для временных столбцов | [controlPanel.ts](../controlPanel.ts): `time_grain_sqla`     |
| `groupby`             | Измерения для группировки по оси X           | [controlPanel.ts](../controlPanel.ts): `groupby`             |
| `metrics`             | Метрики для расчета статистики               | [controlPanel.ts](../controlPanel.ts): `metrics`             |
| `whiskerOptions`      | Определяет, как рассчитываются усы и выбросы | [controlPanel.ts](../controlPanel.ts): `whiskerOptions`      |
| `series_limit`        | Ограничение количества серий                 | [controlPanel.ts](../controlPanel.ts): `series_limit`        |
| `series_limit_metric` | Метрика для определения порядка сортировки   | [controlPanel.ts](../controlPanel.ts): `series_limit_metric` |

### Параметры отображения (Chart Options)

| Параметр             | Назначение                  | Подтверждение в коде                                            |
| -------------------- | --------------------------- | --------------------------------------------------------------- |
| `color_scheme`       | Цветовая схема для графика  | [controlPanel.ts](../controlPanel.ts): `color_scheme`           |
| `x_ticks_layout`     | Расположение меток на оси X | [controlPanel.ts](../controlPanel.ts): `x_ticks_layout`         |
| `number_format`      | Формат отображения чисел    | [controlPanel.ts](../controlPanel.ts): `number_format`          |
| `date_format`        | Формат отображения дат      | [controlPanel.ts](../controlPanel.ts): `date_format`            |
| `xAxisTitle`         | Заголовок оси X             | [transformProps.ts](../transformProps.ts): `xAxisTitle`         |
| `yAxisTitle`         | Заголовок оси Y             | [transformProps.ts](../transformProps.ts): `yAxisTitle`         |
| `xAxisTitleMargin`   | Отступ заголовка оси X      | [transformProps.ts](../transformProps.ts): `xAxisTitleMargin`   |
| `yAxisTitleMargin`   | Отступ заголовка оси Y      | [transformProps.ts](../transformProps.ts): `yAxisTitleMargin`   |
| `yAxisTitlePosition` | Позиция заголовка оси Y     | [transformProps.ts](../transformProps.ts): `yAxisTitlePosition` |

## Логика работы и обработки данных

### Основной поток данных

1. **Получение данных**: Данные получаются из источника данных через API запрос.
2. **Трансформация данных**: Данные преобразуются в формат, подходящий для диаграммы размаха.
   - В файле [transformProps.ts](../transformProps.ts) происходит преобразование данных из формата запроса в формат, необходимый для компонента ECharts.
   - Для каждой метрики и группы рассчитываются статистические показатели: минимум, максимум, медиана, квартили, среднее значение, количество наблюдений и выбросы.
3. **Расчет статистики**: Для каждой группы и метрики рассчитываются следующие статистические показатели:
   - Минимум (`__min`)
   - Первый квартиль (`__q1`)
   - Медиана (`__median`)
   - Третий квартиль (`__q3`)
   - Максимум (`__max`)
   - Среднее значение (`__mean`)
   - Количество наблюдений (`__count`)
   - Выбросы (`__outliers`)
4. **Отображение**: Данные отображаются в виде диаграммы размаха с использованием библиотеки ECharts.

### Обработка выбросов

Параметр `whiskerOptions` определяет, как рассчитываются усы и выбросы:

- **Tukey**: Стандартный метод Тьюки, где усы простираются до 1.5 \* IQR (межквартильный размах) от ящика, а точки за пределами считаются выбросами.
- **Min/max (no outliers)**: Усы простираются до минимального и максимального значений, выбросы не отображаются.
- **2/98 percentiles**: Усы простираются до 2-го и 98-го процентилей.
- **9/91 percentiles**: Усы простираются до 9-го и 91-го процентилей.

## Форматирование и визуальные настройки

### Форматирование значений

- **Числовое форматирование** (`number_format`): Определяет формат отображения числовых значений с использованием d3-format.
- **Форматирование дат** (`date_format`): Определяет формат отображения дат.

### Визуальные настройки

- **Расположение меток на оси X** (`x_ticks_layout`): Определяет, как располагаются метки на оси X (auto, flat, 45°, 90°, staggered).
- **Цветовая схема** (`color_scheme`): Определяет цветовую схему для графика.
- **Заголовки осей**: Можно настроить заголовки осей X и Y, их отступы и позицию.

## Примеры конфигурации в JSON

### Пример 1: Базовая конфигурация

```json
{
  "datasource": "5__table",
  "viz_type": "echarts_boxplot",
  "slice_id": 123,
  "granularity_sqla": "date",
  "time_grain_sqla": "P1D",
  "time_range": "Last week",
  "metrics": ["sum__value"],
  "adhoc_filters": [],
  "groupby": ["category"],
  "columns": ["region"],
  "whiskerOptions": "Tukey",
  "number_format": "SMART_NUMBER",
  "date_format": "smart_date",
  "x_ticks_layout": "auto",
  "color_scheme": "supersetColors",
  "xAxisTitle": "Категории",
  "yAxisTitle": "Значения"
}
```

### Пример 2: Расширенная конфигурация с настройками выбросов

```json
{
  "datasource": "5__table",
  "viz_type": "echarts_boxplot",
  "slice_id": 123,
  "granularity_sqla": "date",
  "time_grain_sqla": "P1D",
  "time_range": "Last week",
  "metrics": ["sum__value", "avg__price"],
  "adhoc_filters": [
    {
      "clause": "WHERE",
      "expressionType": "SIMPLE",
      "filterOptionName": "filter_8ly71emic_hc9vt9a6i7",
      "comparator": "United States",
      "operator": "==",
      "subject": "country"
    }
  ],
  "groupby": ["category", "product"],
  "columns": ["region"],
  "whiskerOptions": "Min/max (no outliers)",
  "number_format": "$,.2f",
  "date_format": "smart_date",
  "x_ticks_layout": "45°",
  "color_scheme": "supersetColors",
  "xAxisTitle": "Категории и продукты",
  "yAxisTitle": "Значения и цены",
  "xAxisTitleMargin": 30,
  "yAxisTitleMargin": 30,
  "yAxisTitlePosition": "Left"
}
```

## Пути к файлам реализации

- **Основной компонент**: [superset-frontend/plugins/plugin-chart-echarts/src/BoxPlot/EchartsBoxPlot.tsx](../EchartsBoxPlot.tsx)
- **Трансформация данных**: [superset-frontend/plugins/plugin-chart-echarts/src/BoxPlot/transformProps.ts](../transformProps.ts)
- **Конфигурация**: [superset-frontend/plugins/plugin-chart-echarts/src/BoxPlot/controlPanel.ts](../controlPanel.ts)
- **Типы данных**: [superset-frontend/plugins/plugin-chart-echarts/src/BoxPlot/types.ts](../types.ts)
- **Построение запроса**: [superset-frontend/plugins/plugin-chart-echarts/src/BoxPlot/buildQuery.ts](../buildQuery.ts)

## Примечания

- Box Plot использует библиотеку ECharts для визуализации данных.
- Для расчета статистических показателей используется постобработка данных на стороне сервера (операция 'boxplot').
- Диаграмма размаха особенно полезна для сравнения распределений и выявления выбросов в данных.
- При изменении логики этого плагина необходимо также обновить соответствующую Python-функцию в [superset/utils/pandas_postprocessing/boxplot.py](https://github.com/apache/superset/blob/master/superset/utils/pandas_postprocessing/boxplot.py).
