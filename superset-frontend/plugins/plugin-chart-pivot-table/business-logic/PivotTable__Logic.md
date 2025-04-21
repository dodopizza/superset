# Бизнес-логика графика: Pivot Table (Сводная таблица)

## Общее описание

Pivot Table (Сводная таблица) - это тип визуализации, который позволяет суммировать набор данных путем группировки нескольких статистических показателей по двум осям. Этот тип графика используется для анализа многомерных данных и представления их в компактной табличной форме.

Сводная таблица предоставляет функциональность с возможностью:

- Группировки данных по строкам и столбцам
- Агрегации значений по различным метрикам
- Настройки форматов отображения
- Кастомных модификаций DODO

## Основные параметры и их назначение

### Параметры запроса (Query)

| Параметр              | Назначение                                              | Подтверждение в коде                                                              |
| --------------------- | ------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `groupbyColumns`      | Столбцы для группировки по колонкам таблицы             | [controlPanel.tsx](../src/plugin/controlPanel.tsx): `name: 'groupbyColumns'`      |
| `groupbyRows`         | Столбцы для группировки по строкам таблицы              | [controlPanel.tsx](../src/plugin/controlPanel.tsx): `name: 'groupbyRows'`         |
| `metrics`             | Метрики для агрегации данных                            | [controlPanel.tsx](../src/plugin/controlPanel.tsx): `metrics`                     |
| `metricsLayout`       | Определяет, применять ли метрики к строкам или столбцам | [controlPanel.tsx](../src/plugin/controlPanel.tsx): `name: 'metricsLayout'`       |
| `series_limit`        | Ограничение количества серий                            | [controlPanel.tsx](../src/plugin/controlPanel.tsx): `series_limit`                |
| `row_limit`           | Ограничение количества ячеек                            | [controlPanel.tsx](../src/plugin/controlPanel.tsx): `name: 'row_limit'`           |
| `series_limit_metric` | Метрика для определения порядка сортировки              | [controlPanel.tsx](../src/plugin/controlPanel.tsx): `name: 'series_limit_metric'` |
| `order_desc`          | Сортировка по убыванию или возрастанию                  | [controlPanel.tsx](../src/plugin/controlPanel.tsx): `name: 'order_desc'`          |

### Параметры отображения (Display)

| Параметр         | Назначение                                   | Подтверждение в коде                                                               |
| ---------------- | -------------------------------------------- | ---------------------------------------------------------------------------------- |
| `rowTotals`      | Отображение итогов по строкам                | [controlPanel.tsx](../src/plugin/controlPanel.tsx): `name: 'rowTotals'`            |
| `rowSubTotals`   | Отображение промежуточных итогов по строкам  | [controlPanel.tsx](../src/plugin/controlPanel.tsx): `name: 'rowSubTotals'`         |
| `colTotals`      | Отображение итогов по столбцам               | [controlPanel.tsx](../src/plugin/controlPanel.tsx): `name: 'colTotals'`            |
| `colSubTotals`   | Отображение промежуточных итогов по столбцам | [controlPanel.tsx](../src/plugin/controlPanel.tsx): `name: 'colSubTotals'`         |
| `transposePivot` | Поменять местами строки и столбцы            | [controlPanel.tsx](../src/plugin/controlPanel.tsx): `name: 'transposePivot'`       |
| `combineMetric`  | Объединение метрик в одном столбце           | [controlPanel.tsx](../src/plugin/controlPanel.tsx): `name: 'combineMetric'`        |
| `columnConfig`   | Конфигурация колонок (форматы, закрепление)  | [PivotTableChart.tsx](../src/PivotTableChart.tsx): `columnConfig` (DODO 45525377)  |
| `pinnedColumns`  | Закрепленные колонки                         | [PivotTableChart.tsx](../src/PivotTableChart.tsx): `pinnedColumns` (DODO 45525377) |

### Параметры форматирования (Options)

| Параметр                 | Назначение                                     | Подтверждение в коде                                                                        |
| ------------------------ | ---------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `valueFormat`            | Формат отображения значений                    | [controlPanel.tsx](../src/plugin/controlPanel.tsx): `name: 'valueFormat'`                   |
| `currency_format`        | Формат отображения валюты                      | [controlPanel.tsx](../src/plugin/controlPanel.tsx): `currency_format`                       |
| `date_format`            | Формат отображения дат                         | [controlPanel.tsx](../src/plugin/controlPanel.tsx): `name: 'date_format'`                   |
| `rowOrder`               | Порядок сортировки строк                       | [PivotTableChart.tsx](../src/PivotTableChart.tsx): `rowOrder`                               |
| `colOrder`               | Порядок сортировки столбцов                    | [PivotTableChart.tsx](../src/PivotTableChart.tsx): `colOrder`                               |
| `aggregateFunction`      | Функция агрегации (Sum, Average, Count и т.д.) | [PivotTableChart.tsx](../src/PivotTableChart.tsx): `aggregateFunction`                      |
| `conditionalFormatting`  | Условное форматирование ячеек                  | [controlPanel.tsx](../src/plugin/controlPanel.tsx): `name: 'conditional_formatting'`        |
| `datasourceDescriptions` | Описания источников данных                     | [PivotTableChart.tsx](../src/PivotTableChart.tsx): `datasourceDescriptions` (DODO 44728892) |

## Логика работы и обработки данных

### Основной поток данных

1. **Получение данных**: Данные получаются из источника данных через API запрос.
2. **Трансформация данных**: Данные преобразуются в формат, подходящий для сводной таблицы.
   - В файле [transformProps.ts](../src/plugin/transformProps.ts) происходит преобразование данных из формата запроса в формат, необходимый для компонента PivotTable.
   - Метрики и группировки обрабатываются в соответствии с настройками пользователя.
   - Преобразование в "unpivoted" формат для работы с метриками.
3. **Агрегация данных**: Данные агрегируются в соответствии с выбранной функцией агрегации.
   - Поддерживаются различные функции агрегации: Sum, Average, Count, Min, Max и др.
   - Расчет итогов и промежуточных итогов.
   - Сортировка значений согласно настройкам.
4. **Отображение**: Данные отображаются в виде сводной таблицы с возможностью интерактивного взаимодействия.

### Обработка группировок

Сводная таблица поддерживает два типа группировок:

- **Группировка по строкам** (`groupbyRows`): Определяет, какие поля будут использоваться для группировки данных по строкам.
- **Группировка по столбцам** (`groupbyColumns`): Определяет, какие поля будут использоваться для группировки данных по столбцам.

Эти группировки могут быть вложенными, что позволяет создавать многоуровневые сводные таблицы.

### Обработка метрик

Метрики могут быть применены к строкам или столбцам в зависимости от параметра `metricsLayout`:

- `COLUMNS`: Метрики применяются к столбцам (по умолчанию)
- `ROWS`: Метрики применяются к строкам

Параметр `combineMetric` определяет, будут ли метрики отображаться рядом друг с другом в каждом столбце или каждый столбец будет отображаться рядом друг с другом для каждой метрики.

## Форматирование и визуальные настройки

### Форматирование значений

- **Числовое форматирование** (`valueFormat`): Определяет формат отображения числовых значений с использованием d3-format.
- **Валютное форматирование** (`currencyFormat`): Определяет формат отображения валютных значений.
- **Форматирование дат** (`date_format`): Определяет формат отображения дат.
- **Кастомные форматы на уровне колонок**: Через параметр `columnConfig` можно задавать индивидуальные форматы для каждой колонки (DODO 44211769).

### Условное форматирование

Условное форматирование позволяет изменять цвет ячеек в зависимости от их значений. Это настраивается через параметр `conditionalFormatting`.

### Визуальные настройки

- **Позиционирование итогов**: Настройка расположения итоговых строк и столбцов.
- **Иконки развертывания/свертывания**: Для интерактивного взаимодействия с таблицей.
- **Подсветка заголовков**: При наведении или выборе.
- **Закрепление колонок**: Через параметр `pinnedColumns` можно закрепить определенные колонки, чтобы они оставались видимыми при горизонтальной прокрутке (DODO 45525377).

## Кастомные особенности (DODO-модификации)

### Дополнительные параметры

1. **Конфигурация колонок** (DODO 45525377):

   - `columnConfig`: Позволяет задавать индивидуальные настройки для каждой колонки:
     - `d3NumberFormat`: Формат отображения чисел
     - `pinColumn`: Закрепление колонки
     - `aggregation`: Специфическая агрегация для колонки
     - `visibility`: Управление видимостью колонки

2. **Закрепление колонок** (DODO 45525377):

   - `pinnedColumns`: Массив индексов колонок, которые должны быть закреплены при горизонтальной прокрутке
   - Реализовано через компонент `PinIcon` из DodoExtensions

3. **Форматирование из источника данных** (DODO 44211769):

   - `filterColumnConfigByd3NumberFormat`: Функция для фильтрации конфигурации колонок по формату
   - `getMetricNumberFormat`: Функция для получения формата числа из метрики

4. **Описания источников данных** (DODO 44728892):
   - `datasourceDescriptions`: Добавляет всплывающие подсказки и описания к заголовкам и данным
   - Реализовано через функцию `extendDatasourceDescriptions` из DodoExtensions

### Улучшенная логика

1. **Приоритет форматов** (DODO 44211769):

   - Форматы, указанные в `columnConfig`, имеют приоритет над глобальными настройками
   - Позволяет настраивать отображение каждой колонки индивидуально

2. **Управление итогами** (DODO 45525377):

   - Поддержка скрытия значений в итоговых строках и столбцах
   - Кастомное форматирование итоговых значений

3. **Расширенная обработка метаданных** (DODO 44728892):
   - Интеграция с системой описаний метрик и измерений
   - Улучшенное отображение информации о данных

## Примеры конфигурации в JSON

### Пример 1: Базовая конфигурация

```json
{
  "datasource": "22__table",
  "viz_type": "pivot_table_v2",
  "groupbyColumns": ["product_line"],
  "groupbyRows": ["country", "city"],
  "time_grain_sqla": "P1D",
  "temporal_columns_lookup": {
    "order_date": true
  },
  "metrics": [
    {
      "expressionType": "SIMPLE",
      "column": {
        "column_name": "sales",
        "type": "DOUBLE PRECISION"
      },
      "aggregate": "SUM",
      "label": "SUM(sales)"
    }
  ],
  "metricsLayout": "COLUMNS",
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
  "order_desc": true,
  "aggregateFunction": "Sum",
  "valueFormat": "SMART_NUMBER",
  "date_format": "smart_date",
  "rowOrder": "key_a_to_z",
  "colOrder": "key_a_to_z"
}
```

### Пример 2: Конфигурация с DODO-модификациями

```json
{
  "datasource": "1__table",
  "viz_type": "pivot_table_v2",
  "groupbyRows": ["department"],
  "groupbyColumns": ["year"],
  "metrics": ["sales", "profit"],
  "aggregateFunction": "Sum",
  "valueFormat": "$,.2f",
  "rowTotals": true,
  "colTotals": true,
  "columnConfig": {
    "sales": {
      "d3NumberFormat": "$,.0f",
      "pinColumn": true
    },
    "profit": {
      "d3NumberFormat": "$,.0f",
      "aggregation": "Average"
    }
  },
  "pinnedColumns": [0],
  "combineMetric": true,
  "metricsLayout": "COLUMNS"
}
```

### Пример 3: Конфигурация с итогами и промежуточными итогами

```json
{
  "datasource": "3__table",
  "viz_type": "pivot_table_v2",
  "slice_id": 61,
  "granularity_sqla": "ds",
  "time_grain_sqla": "P1D",
  "time_range": "100 years ago : now",
  "metrics": ["sum__num"],
  "adhoc_filters": [],
  "groupbyRows": ["name"],
  "groupbyColumns": ["state"],
  "series_limit": 5000,
  "aggregateFunction": "Sum",
  "rowTotals": true,
  "colTotals": true,
  "rowSubTotals": true,
  "colSubTotals": true,
  "valueFormat": ".3s",
  "combineMetric": false
}
```

## Пути к файлам реализации

- **Основной компонент**: [superset-frontend/plugins/plugin-chart-pivot-table/src/PivotTableChart.tsx](../src/PivotTableChart.tsx)
- **Конфигурация**: [superset-frontend/plugins/plugin-chart-pivot-table/src/plugin/controlPanel.tsx](../src/plugin/controlPanel.tsx)
- **Трансформация данных**: [superset-frontend/plugins/plugin-chart-pivot-table/src/plugin/transformProps.ts](../src/plugin/transformProps.ts)
- **Типы данных**: [superset-frontend/plugins/plugin-chart-pivot-table/src/types.ts](../src/types.ts)
- **Рендеринг таблицы**: [superset-frontend/plugins/plugin-chart-pivot-table/src/react-pivottable/TableRenderers.jsx](../src/react-pivottable/TableRenderers.jsx)
- **Компонент сводной таблицы**: [superset-frontend/plugins/plugin-chart-pivot-table/src/react-pivottable/PivotTable.jsx](../src/react-pivottable/PivotTable.jsx)
- **DODO расширения**:
  - Утилиты закрепления колонок: [superset-frontend/plugins/plugin-chart-pivot-table/src/DodoExtensions/utils/getPinnedColumnIndexes.ts](../src/DodoExtensions/utils/getPinnedColumnIndexes.ts) (DODO 45525377)
  - Компонент иконки закрепления: [superset-frontend/packages/superset-ui-chart-controls/src/DodoExtensions/components/PinIcon.tsx](../../packages/superset-ui-chart-controls/src/DodoExtensions/components/PinIcon.tsx) (DODO 45525377)
  - Расширение описаний: [superset-frontend/plugins/plugin-chart-echarts/src/DodoExtensions/utils/extendDatasourceDescriptions.ts](../../plugin-chart-echarts/src/DodoExtensions/utils/extendDatasourceDescriptions.ts) (DODO 44728892)

## Примечания

- Все DODO-модификации помечены соответствующими номерами ревизий в коде
- Форматы из columnConfig имеют приоритет над глобальными настройками
- Закрепленные колонки остаются видимыми при горизонтальной прокрутке
- При изменении логики этого плагина необходимо также обновить соответствующую Python-функцию в [superset/charts/post_processing.py](https://github.com/apache/superset/blob/master/superset/charts/post_processing.py)
