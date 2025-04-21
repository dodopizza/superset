# Бизнес-логика графика: Timeseries (Временной ряд)

## Общее описание

Timeseries (Временной ряд) - это универсальный тип визуализации для отображения данных, изменяющихся во времени. Этот график позволяет выбирать между различными типами отображения: линейным, ступенчатым, точечным и столбчатым. Временной ряд особенно полезен для анализа трендов, сезонности, циклических колебаний и аномалий в данных с течением времени.

## Основные параметры и их назначение

### Параметры запроса (Query)

| Параметр | Назначение | Подтверждение в коде |
|----------|------------|----------------------|
| `metrics` | Метрики для отображения | [types.ts](../types.ts): `metrics` |
| `groupby` | Столбцы для группировки данных | [types.ts](../types.ts): `groupby` |
| `time_grain_sqla` | Гранулярность времени | [types.ts](../types.ts): `timeGrainSqla` |
| `time_compare` | Сравнение с предыдущими периодами | [types.ts](../types.ts): `timeCompare` |
| `adhoc_filters` | Фильтры для данных | [controlPanel.tsx](../Regular/Line/controlPanel.tsx): `adhoc_filters` |
| `row_limit` | Ограничение количества строк | [constants.ts](../constants.ts): `rowLimit` |

### Параметры отображения (Chart Options)

| Параметр | Назначение | Подтверждение в коде |
|----------|------------|----------------------|
| `color_scheme` | Цветовая схема | [types.ts](../types.ts): `colorScheme` |
| `series_type` | Тип серии (line, bar, scatter, smooth) | [types.ts](../types.ts): `seriesType` |
| `area` | Отображение области под линией | [types.ts](../types.ts): `area` |
| `stack` | Стекирование серий | [types.ts](../types.ts): `stack` |
| `opacity` | Прозрачность | [constants.ts](../constants.ts): `opacity` |
| `marker_enabled` | Отображение маркеров | [constants.ts](../constants.ts): `markerEnabled` |
| `marker_size` | Размер маркеров | [constants.ts](../constants.ts): `markerSize` |
| `show_value` | Отображение значений | [types.ts](../types.ts): `showValue` |
| `only_total` | Отображение только итоговых значений | [types.ts](../types.ts): `onlyTotal` |
| `percentage_threshold` | Порог процентов для отображения | [types.ts](../types.ts): `percentageThreshold` |
| `zoomable` | Возможность масштабирования | [constants.ts](../constants.ts): `zoomable` |
| `rich_tooltip` | Расширенные подсказки | [types.ts](../types.ts): `richTooltip` |
| `x_axis_time_format` | Формат времени для оси X | [types.ts](../types.ts): `xAxisTimeFormat` |
| `tooltip_time_format` | Формат времени для подсказок | [types.ts](../types.ts): `tooltipTimeFormat` |
| `y_axis_format` | Формат оси Y | [types.ts](../types.ts): `yAxisFormat` |
| `x_axis_title` | Заголовок оси X | [types.ts](../types.ts): `xAxisTitle` |
| `y_axis_title` | Заголовок оси Y | [types.ts](../types.ts): `yAxisTitle` |
| `log_axis` | Логарифмическая шкала для оси Y | [constants.ts](../constants.ts): `logAxis` |
| `x_axis_label_rotation` | Угол поворота меток оси X | [types.ts](../types.ts): `xAxisLabelRotation` |
| `truncate_y_axis` | Усечение оси Y | [constants.ts](../constants.ts): `truncateYAxis` |
| `y_axis_bounds` | Границы оси Y | [constants.ts](../constants.ts): `yAxisBounds` |
| `show_legend` | Отображение легенды | [types.ts](../types.ts): `showLegend` |
| `legend_type` | Тип легенды | [types.ts](../types.ts): `legendType` |
| `legend_orientation` | Ориентация легенды | [types.ts](../types.ts): `legendOrientation` |
| `contribution_mode` | Режим вклада | [types.ts](../types.ts): `contributionMode` |
| `x_axis_sort_series` | Сортировка серий по оси X | [transformProps.ts](../transformProps.ts): `xAxisSortSeries` |
| `x_axis_sort_series_ascending` | Сортировка серий по возрастанию | [transformProps.ts](../transformProps.ts): `xAxisSortSeriesAscending` |
| `orientation` | Ориентация графика (вертикальная/горизонтальная) | [types.ts](../types.ts): `orientation` |

### Параметры прогнозирования (Forecasting)

| Параметр | Назначение | Подтверждение в коде |
|----------|------------|----------------------|
| `forecast_enabled` | Включение прогнозирования | [types.ts](../types.ts): `forecastEnabled` |
| `forecast_periods` | Количество периодов для прогноза | [types.ts](../types.ts): `forecastPeriods` |
| `forecast_interval` | Интервал прогноза | [types.ts](../types.ts): `forecastInterval` |
| `forecast_seasonality_daily` | Дневная сезонность | [types.ts](../types.ts): `forecastSeasonalityDaily` |
| `forecast_seasonality_weekly` | Недельная сезонность | [types.ts](../types.ts): `forecastSeasonalityWeekly` |
| `forecast_seasonality_yearly` | Годовая сезонность | [types.ts](../types.ts): `forecastSeasonalityYearly` |

## Логика работы и обработки данных

### Основной поток данных

1. **Получение данных**: Данные получаются из источника данных через API запрос.
2. **Трансформация данных**: Данные преобразуются в формат, подходящий для временного ряда.
   - В файле [transformProps.ts](../transformProps.ts) происходит преобразование данных из формата запроса в формат, необходимый для компонента ECharts.
   - Для каждой метрики и группы создается отдельная серия данных.
   - Если включено сравнение с предыдущими периодами, создаются дополнительные серии данных.
3. **Обработка временных рядов**: Данные обрабатываются в зависимости от выбранных параметров.
   - Если включен режим вклада, значения преобразуются в проценты от общего значения.
   - Если включено стекирование, значения накладываются друг на друга.
   - Если включено прогнозирование, добавляются прогнозные значения.
4. **Отображение**: Данные отображаются в виде временного ряда с использованием библиотеки ECharts.

### Трансформация серий

Функция `transformSeries` в [transformers.ts](../transformers.ts) преобразует серии данных в формат, необходимый для ECharts:

```typescript
export function transformSeries(
  series: SeriesOption,
  colorScale: CategoricalColorScale,
  colorScaleKey: string,
  opts: {
    area?: boolean;
    connectNulls?: boolean;
    filterState?: FilterState;
    seriesContexts?: { [key: string]: ForecastSeriesEnum[] };
    markerEnabled?: boolean;
    markerSize?: number;
    areaOpacity?: number;
    seriesType?: EchartsTimeseriesSeriesType;
    stack?: StackType;
    stackIdSuffix?: string;
    yAxisIndex?: number;
    showValue?: boolean;
    onlyTotal?: boolean;
    legendState?: LegendState;
    formatter?: ValueFormatter;
    totalStackedValues?: number[];
    showValueIndexes?: number[];
    thresholdValues?: number[];
    richTooltip?: boolean;
    seriesKey?: OptionName;
    sliceId?: number;
    isHorizontal?: boolean;
    lineStyle?: LineStyleOption;
    queryIndex?: number;
    timeCompare?: string[];
    valueAlign?: LabelPositionDodo; // DODO added 45525377
  },
): SeriesOption | undefined {
  // ...
}
```

### DODO-модификации

В коде присутствуют несколько DODO-модификаций:

- **45525377**: Добавлена возможность показывать/скрывать значения на графике.
- **44211769**: Добавлена возможность настраивать форматирование метрик.
- **44728892**: Добавлена поддержка локализации.

## Форматирование и визуальные настройки

### Настройки осей

- **Ось X**: Может быть временной или категориальной. Формат меток оси X определяется параметром `x_axis_time_format`.
- **Ось Y**: Может быть линейной или логарифмической. Формат меток оси Y определяется параметром `y_axis_format`.
- **Усечение осей**: Параметры `truncate_x_axis` и `truncate_y_axis` позволяют усекать оси, чтобы лучше отображать данные.
- **Границы осей**: Параметры `x_axis_bounds` и `y_axis_bounds` позволяют задать границы осей.

### Настройки серий

- **Тип серии**: Параметр `series_type` определяет тип отображения серий (line, bar, scatter, smooth).
- **Область**: Параметр `area` определяет, отображается ли область под линией.
- **Стекирование**: Параметр `stack` определяет, стекируются ли серии.
- **Маркеры**: Параметры `marker_enabled` и `marker_size` определяют отображение и размер маркеров.
- **Значения**: Параметр `show_value` определяет, отображаются ли значения на графике.

### Настройки легенды

- **Отображение легенды**: Параметр `show_legend` определяет, отображается ли легенда.
- **Тип легенды**: Параметр `legend_type` определяет тип легенды (plain, scroll).
- **Ориентация легенды**: Параметр `legend_orientation` определяет ориентацию легенды (top, bottom, left, right).

### Настройки подсказок

- **Расширенные подсказки**: Параметр `rich_tooltip` определяет, используются ли расширенные подсказки.
- **Формат времени для подсказок**: Параметр `tooltip_time_format` определяет формат времени в подсказках.
- **Отображение итогов**: Параметр `show_tooltip_total` определяет, отображается ли общая сумма в подсказках.
- **Отображение процентов**: Параметр `show_tooltip_percentage` определяет, отображаются ли проценты в подсказках.

## Примеры конфигурации в JSON

### Пример 1: Базовый линейный график

```json
{
  "datasource": "5__table",
  "viz_type": "echarts_timeseries_line",
  "slice_id": 123,
  "time_grain_sqla": "P1D",
  "metrics": [
    {
      "aggregate": "SUM",
      "column": {
        "column_name": "sales"
      },
      "expressionType": "SIMPLE",
      "label": "SUM(sales)"
    }
  ],
  "groupby": ["product"],
  "adhoc_filters": [],
  "row_limit": 10000,
  "color_scheme": "supersetColors",
  "series_type": "line",
  "area": false,
  "stack": false,
  "show_value": false,
  "only_total": false,
  "percentage_threshold": 0,
  "zoomable": true,
  "rich_tooltip": true,
  "x_axis_time_format": "smart_date",
  "tooltip_time_format": "smart_date",
  "y_axis_format": "SMART_NUMBER",
  "x_axis_title": "Дата",
  "y_axis_title": "Продажи",
  "log_axis": false,
  "x_axis_label_rotation": 0,
  "truncate_y_axis": false,
  "y_axis_bounds": [null, null],
  "show_legend": true,
  "legend_type": "scroll",
  "legend_orientation": "top",
  "contribution_mode": null,
  "x_axis_sort_series": null,
  "x_axis_sort_series_ascending": true,
  "orientation": "vertical"
}
```

### Пример 2: Стекированный график с областью

```json
{
  "datasource": "5__table",
  "viz_type": "echarts_timeseries_line",
  "slice_id": 123,
  "time_grain_sqla": "P1M",
  "metrics": [
    {
      "aggregate": "SUM",
      "column": {
        "column_name": "revenue"
      },
      "expressionType": "SIMPLE",
      "label": "SUM(revenue)"
    }
  ],
  "groupby": ["category"],
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
  "color_scheme": "d3Category20",
  "series_type": "line",
  "area": true,
  "stack": "Stack",
  "opacity": 0.5,
  "show_value": true,
  "only_total": false,
  "percentage_threshold": 0,
  "zoomable": true,
  "rich_tooltip": true,
  "x_axis_time_format": "%b %Y",
  "tooltip_time_format": "%Y-%m-%d",
  "y_axis_format": "$,.2f",
  "x_axis_title": "Месяц",
  "y_axis_title": "Выручка",
  "log_axis": false,
  "x_axis_label_rotation": 45,
  "truncate_y_axis": false,
  "y_axis_bounds": [0, null],
  "show_legend": true,
  "legend_type": "scroll",
  "legend_orientation": "right",
  "contribution_mode": null,
  "x_axis_sort_series": null,
  "x_axis_sort_series_ascending": true,
  "orientation": "vertical"
}
```

### Пример 3: График с прогнозированием

```json
{
  "datasource": "5__table",
  "viz_type": "echarts_timeseries_line",
  "slice_id": 123,
  "time_grain_sqla": "P1D",
  "metrics": [
    {
      "aggregate": "AVG",
      "column": {
        "column_name": "temperature"
      },
      "expressionType": "SIMPLE",
      "label": "AVG(temperature)"
    }
  ],
  "groupby": ["city"],
  "adhoc_filters": [],
  "row_limit": 10000,
  "color_scheme": "supersetColors",
  "series_type": "smooth",
  "area": false,
  "stack": false,
  "marker_enabled": true,
  "marker_size": 6,
  "show_value": false,
  "only_total": false,
  "percentage_threshold": 0,
  "zoomable": true,
  "rich_tooltip": true,
  "x_axis_time_format": "smart_date",
  "tooltip_time_format": "smart_date",
  "y_axis_format": ",.1f",
  "x_axis_title": "Дата",
  "y_axis_title": "Температура (°C)",
  "log_axis": false,
  "x_axis_label_rotation": 0,
  "truncate_y_axis": false,
  "y_axis_bounds": [null, null],
  "show_legend": true,
  "legend_type": "scroll",
  "legend_orientation": "top",
  "contribution_mode": null,
  "x_axis_sort_series": null,
  "x_axis_sort_series_ascending": true,
  "orientation": "vertical",
  "forecast_enabled": true,
  "forecast_periods": 7,
  "forecast_interval": 0.8,
  "forecast_seasonality_daily": null,
  "forecast_seasonality_weekly": null,
  "forecast_seasonality_yearly": null
}
```

## Пути к файлам реализации

- **Основной компонент**: [superset-frontend/plugins/plugin-chart-echarts/src/Timeseries/EchartsTimeseries.tsx](../EchartsTimeseries.tsx)
- **Трансформация данных**: [superset-frontend/plugins/plugin-chart-echarts/src/Timeseries/transformProps.ts](../transformProps.ts)
- **Трансформация серий**: [superset-frontend/plugins/plugin-chart-echarts/src/Timeseries/transformers.ts](../transformers.ts)
- **Типы данных**: [superset-frontend/plugins/plugin-chart-echarts/src/Timeseries/types.ts](../types.ts)
- **Константы**: [superset-frontend/plugins/plugin-chart-echarts/src/Timeseries/constants.ts](../constants.ts)
- **Линейный график**: [superset-frontend/plugins/plugin-chart-echarts/src/Timeseries/Regular/Line/index.ts](../Regular/Line/index.ts)
- **Ступенчатый график**: [superset-frontend/plugins/plugin-chart-echarts/src/Timeseries/Step/index.ts](../Step/index.ts)
- **Конфигурация линейного графика**: [superset-frontend/plugins/plugin-chart-echarts/src/Timeseries/Regular/Line/controlPanel.tsx](../Regular/Line/controlPanel.tsx)
- **Конфигурация графика с областью**: [superset-frontend/plugins/plugin-chart-echarts/src/Timeseries/Area/controlPanel.tsx](../Area/controlPanel.tsx)

## Примечания

- Timeseries использует библиотеку ECharts для визуализации данных.
- Параметр `time_compare` позволяет сравнивать данные с предыдущими периодами.
- Параметр `contribution_mode` позволяет отображать вклад каждой серии в общее значение.
- Параметр `forecast_enabled` позволяет включить прогнозирование на основе исторических данных.
- DODO-модификации добавляют дополнительные возможности, такие как показ/скрытие значений и настройка форматирования метрик.
- При изменении логики этого плагина необходимо обновить соответствующие функции в `transformProps.ts` и `transformers.ts`.
- Для разных типов графиков (линейный, ступенчатый, с областью) используются разные конфигурации, но один и тот же основной компонент.
