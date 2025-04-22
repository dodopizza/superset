# Бизнес-логика графика: Mixed Chart (Смешанный график)

## Общее описание

Mixed Chart (Смешанный график) - это тип визуализации, который позволяет отображать две различные серии данных, используя одну и ту же ось X. Особенность этого графика в том, что обе серии могут быть визуализированы с помощью разных типов графиков (например, одна с использованием столбцов, а другая с использованием линии). Этот тип графика особенно полезен для сравнения различных метрик с разными единицами измерения или масштабами на одном графике.

## Основные параметры и их назначение

### Общие параметры запроса

| Параметр          | Назначение            | Подтверждение в коде                                       |
| ----------------- | --------------------- | ---------------------------------------------------------- |
| `x_axis`          | Столбец для оси X     | [controlPanel.tsx](../controlPanel.tsx): `x_axis`          |
| `time_grain_sqla` | Гранулярность времени | [controlPanel.tsx](../controlPanel.tsx): `time_grain_sqla` |

### Параметры запроса A

| Параметр        | Назначение                     | Подтверждение в коде                                     |
| --------------- | ------------------------------ | -------------------------------------------------------- |
| `groupby`       | Столбцы для группировки данных | [controlPanel.tsx](../controlPanel.tsx): `groupby`       |
| `metrics`       | Метрики для отображения        | [controlPanel.tsx](../controlPanel.tsx): `metrics`       |
| `adhoc_filters` | Фильтры для данных             | [controlPanel.tsx](../controlPanel.tsx): `adhoc_filters` |
| `row_limit`     | Ограничение количества строк   | [controlPanel.tsx](../controlPanel.tsx): `row_limit`     |
| `order_desc`    | Сортировка по убыванию         | [controlPanel.tsx](../controlPanel.tsx): `order_desc`    |

### Параметры запроса B

| Параметр          | Назначение                     | Подтверждение в коде                                       |
| ----------------- | ------------------------------ | ---------------------------------------------------------- |
| `groupby_b`       | Столбцы для группировки данных | [controlPanel.tsx](../controlPanel.tsx): `groupby_b`       |
| `metrics_b`       | Метрики для отображения        | [controlPanel.tsx](../controlPanel.tsx): `metrics_b`       |
| `adhoc_filters_b` | Фильтры для данных             | [controlPanel.tsx](../controlPanel.tsx): `adhoc_filters_b` |
| `row_limit_b`     | Ограничение количества строк   | [controlPanel.tsx](../controlPanel.tsx): `row_limit_b`     |
| `order_desc_b`    | Сортировка по убыванию         | [controlPanel.tsx](../controlPanel.tsx): `order_desc_b`    |

### Параметры отображения для запроса A

| Параметр         | Назначение                                  | Подтверждение в коде                                      |
| ---------------- | ------------------------------------------- | --------------------------------------------------------- |
| `series_type`    | Тип серии (line, bar, scatter, smooth_line) | [controlPanel.tsx](../controlPanel.tsx): `series_type`    |
| `area`           | Отображение области под линией              | [controlPanel.tsx](../controlPanel.tsx): `area`           |
| `stack`          | Стекирование серий                          | [controlPanel.tsx](../controlPanel.tsx): `stack`          |
| `show_value`     | Отображение значений                        | [controlPanel.tsx](../controlPanel.tsx): `show_value`     |
| `marker_enabled` | Отображение маркеров                        | [controlPanel.tsx](../controlPanel.tsx): `marker_enabled` |
| `marker_size`    | Размер маркеров                             | [controlPanel.tsx](../controlPanel.tsx): `marker_size`    |
| `opacity`        | Прозрачность                                | [controlPanel.tsx](../controlPanel.tsx): `opacity`        |
| `y_axis_index`   | Индекс оси Y (0 или 1)                      | [controlPanel.tsx](../controlPanel.tsx): `y_axis_index`   |

### Параметры отображения для запроса B

| Параметр           | Назначение                                  | Подтверждение в коде                                        |
| ------------------ | ------------------------------------------- | ----------------------------------------------------------- |
| `series_type_b`    | Тип серии (line, bar, scatter, smooth_line) | [controlPanel.tsx](../controlPanel.tsx): `series_type_b`    |
| `area_b`           | Отображение области под линией              | [controlPanel.tsx](../controlPanel.tsx): `area_b`           |
| `stack_b`          | Стекирование серий                          | [controlPanel.tsx](../controlPanel.tsx): `stack_b`          |
| `show_value_b`     | Отображение значений                        | [controlPanel.tsx](../controlPanel.tsx): `show_value_b`     |
| `marker_enabled_b` | Отображение маркеров                        | [controlPanel.tsx](../controlPanel.tsx): `marker_enabled_b` |
| `marker_size_b`    | Размер маркеров                             | [controlPanel.tsx](../controlPanel.tsx): `marker_size_b`    |
| `opacity_b`        | Прозрачность                                | [controlPanel.tsx](../controlPanel.tsx): `opacity_b`        |
| `y_axis_index_b`   | Индекс оси Y (0 или 1)                      | [controlPanel.tsx](../controlPanel.tsx): `y_axis_index_b`   |

### Общие параметры отображения

| Параметр                    | Назначение                                | Подтверждение в коде                                                 |
| --------------------------- | ----------------------------------------- | -------------------------------------------------------------------- |
| `color_scheme`              | Цветовая схема                            | [controlPanel.tsx](../controlPanel.tsx): `color_scheme`              |
| `zoomable`                  | Возможность масштабирования               | [controlPanel.tsx](../controlPanel.tsx): `zoomable`                  |
| `rich_tooltip`              | Расширенные подсказки                     | [controlPanel.tsx](../controlPanel.tsx): `rich_tooltip`              |
| `x_axis_time_format`        | Формат времени для оси X                  | [controlPanel.tsx](../controlPanel.tsx): `x_axis_time_format`        |
| `tooltip_time_format`       | Формат времени для подсказок              | [controlPanel.tsx](../controlPanel.tsx): `tooltip_time_format`       |
| `y_axis_format`             | Формат оси Y                              | [controlPanel.tsx](../controlPanel.tsx): `y_axis_format`             |
| `y_axis_format_secondary`   | Формат вторичной оси Y                    | [controlPanel.tsx](../controlPanel.tsx): `y_axis_format_secondary`   |
| `y_axis_title`              | Заголовок оси Y                           | [controlPanel.tsx](../controlPanel.tsx): `y_axis_title`              |
| `y_axis_title_secondary`    | Заголовок вторичной оси Y                 | [controlPanel.tsx](../controlPanel.tsx): `y_axis_title_secondary`    |
| `log_axis`                  | Логарифмическая шкала для оси Y           | [controlPanel.tsx](../controlPanel.tsx): `log_axis`                  |
| `log_axis_secondary`        | Логарифмическая шкала для вторичной оси Y | [controlPanel.tsx](../controlPanel.tsx): `log_axis_secondary`        |
| `y_axis_bounds`             | Границы оси Y                             | [controlPanel.tsx](../controlPanel.tsx): `y_axis_bounds`             |
| `y_axis_bounds_secondary`   | Границы вторичной оси Y                   | [controlPanel.tsx](../controlPanel.tsx): `y_axis_bounds_secondary`   |
| `x_axis_label_rotation`     | Угол поворота меток оси X                 | [controlPanel.tsx](../controlPanel.tsx): `x_axis_label_rotation`     |
| `truncate_y_axis`           | Усечение оси Y                            | [controlPanel.tsx](../controlPanel.tsx): `truncate_y_axis`           |
| `truncate_y_axis_secondary` | Усечение вторичной оси Y                  | [controlPanel.tsx](../controlPanel.tsx): `truncate_y_axis_secondary` |
| `show_legend`               | Отображение легенды                       | [controlPanel.tsx](../controlPanel.tsx): `show_legend`               |
| `legend_type`               | Тип легенды                               | [controlPanel.tsx](../controlPanel.tsx): `legend_type`               |
| `legend_orientation`        | Ориентация легенды                        | [controlPanel.tsx](../controlPanel.tsx): `legend_orientation`        |

## Логика работы и обработки данных

### Основной поток данных

1. **Получение данных**: Данные получаются из источника данных через два API запроса (для запроса A и запроса B).
2. **Трансформация данных**: Данные преобразуются в формат, подходящий для смешанного графика.
   - В файле [transformProps.ts](../transformProps.ts) происходит преобразование данных из формата запроса в формат, необходимый для компонента ECharts.
   - Данные из запроса A и запроса B обрабатываются отдельно и затем объединяются в один набор серий.
3. **Обработка временных рядов**: Если ось X представляет собой временной ряд, данные обрабатываются соответствующим образом.
   - Функция `pivotOperatorInRuntime` в [buildQuery.ts](../buildQuery.ts) определяет, как преобразовать данные в зависимости от типа запроса.
   - Для временных рядов применяются дополнительные операторы, такие как `rollingWindowOperator`, `timeCompareOperator` и `resampleOperator`.
4. **Отображение**: Данные отображаются в виде смешанного графика с использованием библиотеки ECharts.

### Построение запроса

Функция `buildQuery` в [buildQuery.ts](../buildQuery.ts) строит два отдельных запроса для запроса A и запроса B:

1. Формируется базовый объект запроса для каждого из двух запросов.
2. Для каждого запроса применяются операторы постобработки, такие как `pivotOperator`, `rollingWindowOperator`, `timeCompareOperator`, `resampleOperator`, `renameOperator` и `flattenOperator`.
3. Результаты обоих запросов объединяются в один контекст запроса.

### Трансформация данных

Функция `transformProps` в [transformProps.ts](../transformProps.ts) преобразует данные из формата запроса в формат, необходимый для компонента ECharts:

1. Данные из запроса A и запроса B обрабатываются отдельно.
2. Для каждой серии данных определяются параметры отображения, такие как тип серии, цвет, маркеры, стекирование и т.д.
3. Серии данных из обоих запросов объединяются в один набор серий.
4. Формируются параметры для осей X и Y, легенды, подсказок и других элементов графика.

### DODO-модификации

В коде присутствуют несколько DODO-модификаций:

- **45525377**: Добавлена возможность показывать/скрывать значения на графике.
- **44211769**: Добавлена возможность настраивать форматирование метрик.
- **44136746**: Добавлена возможность экспортировать данные как временные ряды.
- **44728892**: Добавлены тултипы с описанием для элементов легенды.

## Форматирование и визуальные настройки

### Настройки осей

- **Ось X**: Может быть временной или категориальной. Формат меток оси X определяется параметром `x_axis_time_format`.
- **Ось Y**: Может быть линейной или логарифмической. Формат меток оси Y определяется параметром `y_axis_format`.
- **Вторичная ось Y**: Может использоваться для отображения данных с другим масштабом. Формат меток вторичной оси Y определяется параметром `y_axis_format_secondary`.

### Настройки серий

- **Тип серии**: Каждая серия может быть отображена как линия, столбец, точка или сглаженная линия.
- **Стекирование**: Серии могут быть стекированы друг на друга.
- **Маркеры**: На линиях могут быть отображены маркеры для выделения точек данных.
- **Область**: Под линиями может быть отображена заполненная область.

### Настройки легенды

- **Тип легенды**: Может быть обычной или прокручиваемой.
- **Ориентация легенды**: Может быть горизонтальной или вертикальной.
- **Отображение легенды**: Легенда может быть скрыта или отображена.

## Примеры конфигурации в JSON

### Пример 1: Линия и столбцы

```json
{
  "datasource": "5__table",
  "viz_type": "mixed_timeseries",
  "slice_id": 123,
  "x_axis": "ds",
  "time_grain_sqla": "P1D",
  "groupby": ["product"],
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
  "adhoc_filters": [],
  "row_limit": 10000,
  "order_desc": true,
  "series_type": "line",
  "area": false,
  "stack": false,
  "show_value": false,
  "marker_enabled": true,
  "marker_size": 6,
  "opacity": 0.8,
  "y_axis_index": 0,
  "groupby_b": ["region"],
  "metrics_b": [
    {
      "aggregate": "COUNT",
      "column": {
        "column_name": "*"
      },
      "expressionType": "SIMPLE",
      "label": "COUNT(*)"
    }
  ],
  "adhoc_filters_b": [],
  "row_limit_b": 10000,
  "order_desc_b": true,
  "series_type_b": "bar",
  "area_b": false,
  "stack_b": false,
  "show_value_b": true,
  "marker_enabled_b": false,
  "marker_size_b": 6,
  "opacity_b": 0.8,
  "y_axis_index_b": 1,
  "color_scheme": "supersetColors",
  "zoomable": true,
  "rich_tooltip": true,
  "x_axis_time_format": "%Y-%m-%d",
  "tooltip_time_format": "%Y-%m-%d",
  "y_axis_format": ",.2f",
  "y_axis_format_secondary": ",d",
  "y_axis_title": "Продажи",
  "y_axis_title_secondary": "Количество",
  "log_axis": false,
  "log_axis_secondary": false,
  "y_axis_bounds": [null, null],
  "y_axis_bounds_secondary": [null, null],
  "x_axis_label_rotation": 0,
  "truncate_y_axis": false,
  "truncate_y_axis_secondary": false,
  "show_legend": true,
  "legend_type": "scroll",
  "legend_orientation": "top"
}
```

### Пример 2: Стекированные столбцы и линия

```json
{
  "datasource": "5__table",
  "viz_type": "mixed_timeseries",
  "slice_id": 123,
  "x_axis": "date",
  "time_grain_sqla": "P1M",
  "groupby": ["category"],
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
  "order_desc": true,
  "series_type": "bar",
  "area": false,
  "stack": true,
  "show_value": false,
  "marker_enabled": false,
  "marker_size": 6,
  "opacity": 0.8,
  "y_axis_index": 0,
  "groupby_b": [],
  "metrics_b": [
    {
      "aggregate": "AVG",
      "column": {
        "column_name": "profit_margin"
      },
      "expressionType": "SIMPLE",
      "label": "AVG(profit_margin)"
    }
  ],
  "adhoc_filters_b": [
    {
      "clause": "WHERE",
      "expressionType": "SIMPLE",
      "filterOptionName": "filter_8ly71emic_hc9vt9a6i7",
      "comparator": "2023-01-01",
      "operator": ">=",
      "subject": "date"
    }
  ],
  "row_limit_b": 10000,
  "order_desc_b": true,
  "series_type_b": "line",
  "area_b": false,
  "stack_b": false,
  "show_value_b": true,
  "marker_enabled_b": true,
  "marker_size_b": 8,
  "opacity_b": 1.0,
  "y_axis_index_b": 1,
  "color_scheme": "d3Category20",
  "zoomable": true,
  "rich_tooltip": true,
  "x_axis_time_format": "%b %Y",
  "tooltip_time_format": "%b %Y",
  "y_axis_format": "$,.2f",
  "y_axis_format_secondary": ",.1%",
  "y_axis_title": "Выручка",
  "y_axis_title_secondary": "Маржа прибыли",
  "log_axis": false,
  "log_axis_secondary": false,
  "y_axis_bounds": [0, null],
  "y_axis_bounds_secondary": [0, 1],
  "x_axis_label_rotation": 45,
  "truncate_y_axis": false,
  "truncate_y_axis_secondary": false,
  "show_legend": true,
  "legend_type": "scroll",
  "legend_orientation": "top"
}
```

### Пример 3: Две линии с разными осями Y

```json
{
  "datasource": "5__table",
  "viz_type": "mixed_timeseries",
  "slice_id": 123,
  "x_axis": "timestamp",
  "time_grain_sqla": "PT1H",
  "groupby": ["sensor_id"],
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
  "adhoc_filters": [],
  "row_limit": 10000,
  "order_desc": true,
  "series_type": "smooth_line",
  "area": true,
  "stack": false,
  "show_value": false,
  "marker_enabled": false,
  "marker_size": 6,
  "opacity": 0.5,
  "y_axis_index": 0,
  "groupby_b": ["sensor_id"],
  "metrics_b": [
    {
      "aggregate": "AVG",
      "column": {
        "column_name": "humidity"
      },
      "expressionType": "SIMPLE",
      "label": "AVG(humidity)"
    }
  ],
  "adhoc_filters_b": [],
  "row_limit_b": 10000,
  "order_desc_b": true,
  "series_type_b": "smooth_line",
  "area_b": true,
  "stack_b": false,
  "show_value_b": false,
  "marker_enabled_b": false,
  "marker_size_b": 6,
  "opacity_b": 0.5,
  "y_axis_index_b": 1,
  "color_scheme": "supersetColors",
  "zoomable": true,
  "rich_tooltip": true,
  "x_axis_time_format": "%H:%M",
  "tooltip_time_format": "%Y-%m-%d %H:%M",
  "y_axis_format": ",.1f",
  "y_axis_format_secondary": ",.1%",
  "y_axis_title": "Температура (°C)",
  "y_axis_title_secondary": "Влажность (%)",
  "log_axis": false,
  "log_axis_secondary": false,
  "y_axis_bounds": [0, 50],
  "y_axis_bounds_secondary": [0, 1],
  "x_axis_label_rotation": 0,
  "truncate_y_axis": false,
  "truncate_y_axis_secondary": false,
  "show_legend": true,
  "legend_type": "scroll",
  "legend_orientation": "right"
}
```

## Пути к файлам реализации

- **Основной компонент**: [superset-frontend/plugins/plugin-chart-echarts/src/MixedTimeseries/EchartsMixedTimeseries.tsx](../EchartsMixedTimeseries.tsx)
- **Трансформация данных**: [superset-frontend/plugins/plugin-chart-echarts/src/MixedTimeseries/transformProps.ts](../transformProps.ts)
- **Конфигурация**: [superset-frontend/plugins/plugin-chart-echarts/src/MixedTimeseries/controlPanel.tsx](../controlPanel.tsx)
- **Типы данных**: [superset-frontend/plugins/plugin-chart-echarts/src/MixedTimeseries/types.ts](../types.ts)
- **Построение запроса**: [superset-frontend/plugins/plugin-chart-echarts/src/MixedTimeseries/buildQuery.ts](../buildQuery.ts)

### Тултипы с описанием

Функция `extractDatasourceDescriptions` добавляет возможность отображать тултипы с описанием для элементов легенды. Эта функциональность работает следующим образом:

1. **Извлечение описаний**: Функция `extractDatasourceDescriptions` извлекает описания метрик из источника данных.
   - Описания могут быть на разных языках (`description_ru`, `description_en` или просто `description`).
   - Функция учитывает текущий язык пользователя (`locale`) и выбирает соответствующее описание.

2. **Расширение описаний**: Функция `extendDatasourceDescriptions` расширяет описания на серии данных, которые включают группировку.
   - Например, если есть описание для метрики "revenue", то оно будет также применено к серии "revenue, North America".

3. **Отображение иконки информации**: Для элементов легенды, у которых есть описание, добавляется иконка информации (`InfoIcon`).
   - Иконка отображается рядом с названием элемента легенды.

4. **Настройка тултипа**: Функция `getLegendProps` настраивает тултип для легенды.
   - Тултип показывается при наведении на элемент легенды.
   - Текст тултипа форматируется с помощью CSS для обеспечения читаемости длинных описаний.

Эта функциональность позволяет пользователям получать дополнительную информацию о метриках и их значении непосредственно на графике, что улучшает понимание данных.

## Примечания

- Mixed Chart использует библиотеку ECharts для визуализации данных.
- Этот тип графика позволяет отображать две различные серии данных с разными типами графиков и разными осями Y.
- Параметры с суффиксом "_b" относятся к запросу B и его настройкам отображения.
- Параметр `y_axis_index` определяет, к какой оси Y (основной или вторичной) привязана серия данных.
- При изменении логики этого плагина необходимо обновить соответствующие функции в `transformProps.ts` и `buildQuery.ts`.
- DODO-модификации добавляют дополнительные возможности, такие как показ/скрытие значений, настройка форматирования метрик и тултипы с описанием.
