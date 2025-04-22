# Бизнес-логика графика: Pie Chart (Круговая диаграмма)

## Общее описание

Pie Chart (Круговая диаграмма) - это тип визуализации, который отображает пропорциональное распределение данных по категориям. Каждый сегмент круга представляет категорию, а его размер пропорционален значению метрики для этой категории. Этот тип графика особенно полезен для визуализации состава целого и сравнения долей различных категорий.

## Основные параметры и их назначение

### Параметры запроса (Query)

| Параметр         | Назначение                                | Подтверждение в коде                                      |
| ---------------- | ----------------------------------------- | --------------------------------------------------------- |
| `groupby`        | Столбцы для группировки данных            | [controlPanel.tsx](../controlPanel.tsx): `groupby`        |
| `metric`         | Метрика для определения размера сегментов | [controlPanel.tsx](../controlPanel.tsx): `metric`         |
| `adhoc_filters`  | Фильтры для данных                        | [controlPanel.tsx](../controlPanel.tsx): `adhoc_filters`  |
| `row_limit`      | Ограничение количества строк              | [controlPanel.tsx](../controlPanel.tsx): `row_limit`      |
| `sort_by_metric` | Сортировка по метрике                     | [controlPanel.tsx](../controlPanel.tsx): `sort_by_metric` |

### Параметры отображения (Chart Options)

| Параметр                | Назначение                                     | Подтверждение в коде                                             |
| ----------------------- | ---------------------------------------------- | ---------------------------------------------------------------- |
| `color_scheme`          | Цветовая схема                                 | [controlPanel.tsx](../controlPanel.tsx): `color_scheme`          |
| `show_labels_threshold` | Порог отображения меток в процентах            | [controlPanel.tsx](../controlPanel.tsx): `show_labels_threshold` |
| `rose_type`             | Тип розовидной диаграммы (area, radius, none)  | [controlPanel.tsx](../controlPanel.tsx): `roseType`              |
| `number_format`         | Формат отображения чисел                       | [controlPanel.tsx](../controlPanel.tsx): `number_format`         |
| `currency_format`       | Формат отображения валюты                      | [controlPanel.tsx](../controlPanel.tsx): `currency_format`       |
| `date_format`           | Формат отображения дат                         | [controlPanel.tsx](../controlPanel.tsx): `date_format`           |
| `show_labels`           | Отображение меток                              | [controlPanel.tsx](../controlPanel.tsx): `show_labels`           |
| `labels_outside`        | Размещение меток снаружи                       | [controlPanel.tsx](../controlPanel.tsx): `labels_outside`        |
| `label_line`            | Отображение линий к меткам                     | [controlPanel.tsx](../controlPanel.tsx): `label_line`            |
| `label_type`            | Тип меток                                      | [controlPanel.tsx](../controlPanel.tsx): `label_type`            |
| `outer_radius`          | Внешний радиус                                 | [controlPanel.tsx](../controlPanel.tsx): `outerRadius`           |
| `donut`                 | Отображение в виде кольца                      | [controlPanel.tsx](../controlPanel.tsx): `donut`                 |
| `inner_radius`          | Внутренний радиус для кольца                   | [controlPanel.tsx](../controlPanel.tsx): `innerRadius`           |
| `show_total`            | Отображение общего значения (DODO-модификация) | [transformProps.ts](../transformProps.ts): `showTotal`           |

## Логика работы и обработки данных

### Основной поток данных

1. **Получение данных**: Данные получаются из источника данных через API запрос.
2. **Трансформация данных**: Данные преобразуются в формат, подходящий для круговой диаграммы.
   - В файле [transformProps.ts](../transformProps.ts) происходит преобразование данных из формата запроса в формат, необходимый для компонента ECharts.
   - Для каждой категории (определяемой параметром `groupby`) создается сегмент круга.
   - Размер сегмента определяется значением метрики для соответствующей категории.
3. **Расчет общего значения**: Если включен параметр `showTotal`, рассчитывается общее значение метрики.
   - Функция в [transformProps.ts](../transformProps.ts) суммирует значения метрики для всех категорий.
   - Общее значение отображается в центре круговой диаграммы.
4. **Отображение**: Данные отображаются в виде круговой диаграммы с использованием библиотеки ECharts.

### Типы меток

Параметр `label_type` определяет, какая информация отображается в метках:

- **key**: Только название категории.
- **value**: Только значение метрики.
- **percent**: Только процент от общего значения.
- **key_value**: Название категории и значение метрики.
- **key_percent**: Название категории и процент.
- **value_percent**: Значение метрики и процент.
- **key_value_percent**: Название категории, значение метрики и процент.
- **template**: Пользовательский шаблон для меток.

Функция `formatPieLabel` в [transformProps.ts](../transformProps.ts) форматирует метки в соответствии с выбранным типом.

### Розовидная диаграмма (Nightingale Chart)

Параметр `rose_type` позволяет отображать круговую диаграмму в виде розовидной диаграммы:

- **area**: Площадь сегмента пропорциональна значению метрики.
- **radius**: Радиус сегмента пропорционален значению метрики.
- **none**: Обычная круговая диаграмма.

## Форматирование и визуальные настройки

### Форматирование значений

- **Формат чисел** (`number_format`): Определяет формат отображения числовых значений.
- **Формат валюты** (`currency_format`): Определяет формат отображения валютных значений.
- **Формат дат** (`date_format`): Определяет формат отображения дат.

### Настройки меток

- **Порог отображения меток** (`show_labels_threshold`): Определяет минимальный процент, при котором отображаются метки.
- **Размещение меток** (`labels_outside`): Определяет, размещаются ли метки снаружи круга.
- **Линии к меткам** (`label_line`): Определяет, отображаются ли линии от сегментов к меткам.

### Настройки формы

- **Внешний радиус** (`outer_radius`): Определяет внешний радиус круговой диаграммы в процентах от доступного пространства.
- **Кольцевая диаграмма** (`donut`): Определяет, отображается ли диаграмма в виде кольца.
- **Внутренний радиус** (`inner_radius`): Определяет внутренний радиус кольца в процентах от внешнего радиуса.

## Примеры конфигурации в JSON

### Пример 1: Базовая круговая диаграмма

```json
{
  "datasource": "5__table",
  "viz_type": "pie",
  "slice_id": 123,
  "groupby": ["category"],
  "metric": {
    "aggregate": "SUM",
    "column": {
      "column_name": "sales"
    },
    "expressionType": "SIMPLE",
    "label": "SUM(sales)"
  },
  "adhoc_filters": [],
  "row_limit": 100,
  "sort_by_metric": true,
  "color_scheme": "supersetColors",
  "show_labels_threshold": 5,
  "rose_type": null,
  "number_format": ",.2f",
  "show_labels": true,
  "labels_outside": true,
  "label_line": true,
  "label_type": "key_percent",
  "outer_radius": 70,
  "donut": false,
  "inner_radius": 30,
  "show_legend": true,
  "legend_type": "scroll",
  "legend_orientation": "top"
}
```

### Пример 2: Кольцевая диаграмма с отображением общего значения

```json
{
  "datasource": "5__table",
  "viz_type": "pie",
  "slice_id": 123,
  "groupby": ["region"],
  "metric": {
    "aggregate": "SUM",
    "column": {
      "column_name": "revenue"
    },
    "expressionType": "SIMPLE",
    "label": "SUM(revenue)"
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
  "row_limit": 100,
  "sort_by_metric": true,
  "color_scheme": "d3Category20",
  "show_labels_threshold": 3,
  "rose_type": null,
  "number_format": "$,.2f",
  "currency_format": {
    "symbol": "$",
    "symbolPosition": "prefix"
  },
  "show_labels": true,
  "labels_outside": true,
  "label_line": true,
  "label_type": "key_value_percent",
  "outer_radius": 80,
  "donut": true,
  "inner_radius": 50,
  "show_total": true,
  "show_legend": true,
  "legend_type": "scroll",
  "legend_orientation": "right"
}
```

### Пример 3: Розовидная диаграмма (Nightingale Chart)

```json
{
  "datasource": "5__table",
  "viz_type": "pie",
  "slice_id": 123,
  "groupby": ["product_category"],
  "metric": {
    "aggregate": "COUNT",
    "column": {
      "column_name": "*"
    },
    "expressionType": "SIMPLE",
    "label": "COUNT(*)"
  },
  "adhoc_filters": [],
  "row_limit": 100,
  "sort_by_metric": true,
  "color_scheme": "supersetColors",
  "show_labels_threshold": 2,
  "rose_type": "area",
  "number_format": ",d",
  "show_labels": true,
  "labels_outside": false,
  "label_line": false,
  "label_type": "value",
  "outer_radius": 90,
  "donut": false,
  "inner_radius": 30,
  "show_legend": true,
  "legend_type": "scroll",
  "legend_orientation": "bottom"
}
```

## Пути к файлам реализации

- **Основной компонент**: [superset-frontend/plugins/plugin-chart-echarts/src/Pie/EchartsPie.tsx](../EchartsPie.tsx)
- **Трансформация данных**: [superset-frontend/plugins/plugin-chart-echarts/src/Pie/transformProps.ts](../transformProps.ts)
- **Конфигурация**: [superset-frontend/plugins/plugin-chart-echarts/src/Pie/controlPanel.tsx](../controlPanel.tsx)
- **Типы данных**: [superset-frontend/plugins/plugin-chart-echarts/src/Pie/types.ts](../types.ts)
- **Построение запроса**: [superset-frontend/plugins/plugin-chart-echarts/src/Pie/buildQuery.ts](../buildQuery.ts)

## Примечания

- Pie Chart использует библиотеку ECharts для визуализации данных.
- Параметр `show_labels_threshold` позволяет скрывать метки для маленьких сегментов, что улучшает читаемость диаграммы.
- Розовидная диаграмма (Nightingale Chart) полезна, когда важно подчеркнуть различия между значениями.
- Параметр `show_total` (DODO-модификация) позволяет отображать общее значение метрики в центре кольцевой диаграммы.
- При изменении логики этого плагина необходимо обновить соответствующие функции форматирования меток и расчета общего значения в `transformProps.ts`.
