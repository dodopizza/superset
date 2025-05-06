# Бизнес-логика графика: Handlebars (Шаблонизатор)

## Общее описание

Handlebars - это тип визуализации, который позволяет отображать данные с использованием шаблонов Handlebars. Этот тип графика предоставляет гибкий способ форматирования и отображения данных с помощью шаблонизатора Handlebars, что позволяет создавать кастомные представления данных, включая таблицы, списки, карточки и другие HTML-структуры.

## Основные параметры и их назначение

### Параметры запроса (Query)

| Параметр                  | Назначение                              | Подтверждение в коде                                                                  |
| ------------------------- | --------------------------------------- | ------------------------------------------------------------------------------------- |
| `query_mode`              | Режим запроса (raw, aggregate)          | [controlPanel.tsx](../plugin/controlPanel.tsx): `queryModeControlSetItem`             |
| `groupby`                 | Столбцы для группировки данных          | [controlPanel.tsx](../plugin/controlPanel.tsx): `groupByControlSetItem`               |
| `metrics`                 | Метрики для агрегации данных            | [controlPanel.tsx](../plugin/controlPanel.tsx): `metricsControlSetItem`               |
| `all_columns`             | Все столбцы для отображения             | [controlPanel.tsx](../plugin/controlPanel.tsx): `allColumnsControlSetItem`            |
| `percent_metrics`         | Метрики в процентах                     | [controlPanel.tsx](../plugin/controlPanel.tsx): `percentMetricsControlSetItem`        |
| `timeseries_limit_metric` | Метрика для ограничения временных рядов | [controlPanel.tsx](../plugin/controlPanel.tsx): `timeSeriesLimitMetricControlSetItem` |
| `order_by`                | Столбец для сортировки                  | [controlPanel.tsx](../plugin/controlPanel.tsx): `orderByControlSetItem`               |
| `order_desc`              | Сортировка по убыванию                  | [controlPanel.tsx](../plugin/controlPanel.tsx): `orderDescendingControlSetItem`       |
| `row_limit`               | Ограничение количества строк            | [controlPanel.tsx](../plugin/controlPanel.tsx): `rowLimitControlSetItem`              |
| `server_pagination`       | Серверная пагинация                     | [controlPanel.tsx](../plugin/controlPanel.tsx): `serverPaginationControlSetRow`       |
| `server_page_length`      | Размер страницы для серверной пагинации | [controlPanel.tsx](../plugin/controlPanel.tsx): `serverPageLengthControlSetItem`      |
| `include_time`            | Включить временную колонку              | [controlPanel.tsx](../plugin/controlPanel.tsx): `includeTimeControlSetItem`           |
| `show_totals`             | Показать итоги                          | [controlPanel.tsx](../plugin/controlPanel.tsx): `showTotalsControlSetItem`            |
| `adhoc_filters`           | Фильтры для данных                      | [controlPanel.tsx](../plugin/controlPanel.tsx): `adhoc_filters`                       |

### Параметры отображения (Options)

| Параметр             | Назначение                               | Подтверждение в коде                                                                                  |
| -------------------- | ---------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `handlebarsTemplate` | Шаблон Handlebars для отображения данных | [handlebarTemplate.tsx](../plugin/controls/handlebarTemplate.tsx): `handlebarsTemplateControlSetItem` |
| `styleTemplate`      | CSS-стили для оформления                 | [controlPanel.tsx](../plugin/controlPanel.tsx): `styleControlSetItem`                                 |

## Логика работы и обработки данных

### Основной поток данных

1. **Получение данных**: Данные получаются из источника данных через API запрос.
2. **Трансформация данных**: Данные преобразуются в формат, подходящий для шаблонизатора Handlebars.
   - В файле [transformProps.ts](../plugin/transformProps.ts) происходит преобразование данных из формата запроса в формат, необходимый для компонента Handlebars.
   - Данные передаются в компонент в виде массива объектов.
3. **Применение шаблона**: Шаблон Handlebars применяется к данным.
   - Функция `Handlebars.compile` в [HandlebarsViewer.tsx](../components/Handlebars/HandlebarsViewer.tsx) компилирует шаблон.
   - Скомпилированный шаблон применяется к данным для генерации HTML-контента.
4. **Отображение**: Сгенерированный HTML-контент отображается на странице.
   - Компонент `SafeMarkdown` используется для безопасного отображения HTML-контента.
   - CSS-стили из параметра `styleTemplate` применяются к сгенерированному контенту.

### Шаблонизатор Handlebars

Handlebars - это шаблонизатор, который позволяет создавать шаблоны с переменными, условиями, циклами и другими конструкциями. Основные возможности:

- **Переменные**: `{{variable}}` - вставляет значение переменной.
- **Циклы**: `{{#each data}}...{{/each}}` - итерация по массиву данных.
- **Условия**: `{{#if condition}}...{{else}}...{{/if}}` - условное отображение контента.
- **Хелперы**: Дополнительные функции для обработки данных.

### Встроенные хелперы

В компоненте зарегистрированы следующие хелперы:

- **dateFormat**: Форматирование дат. Пример: `{{dateFormat my_date format="MMMM YYYY"}}`.
- **stringify**: Преобразование объекта в строку. Пример: `{{stringify this}}`.
- **Хелперы из библиотеки just-handlebars-helpers**: Дополнительные хелперы для работы с числами, строками, массивами и т.д.

### DODO-модификации

- **HTML-санитизация** (DODO 44611022): Параметр `htmlSanitization` определяет, нужно ли санитизировать HTML-контент для предотвращения XSS-атак.

## Форматирование и визуальные настройки

### Шаблон Handlebars

Параметр `handlebarsTemplate` определяет, как будут отображаться данные. Шаблон может включать HTML-теги, переменные Handlebars, условия, циклы и другие конструкции.

Пример базового шаблона:

```handlebars
<ul class='data-list'>
  {{#each data}}
    <li>{{stringify this}}</li>
  {{/each}}
</ul>
```

### CSS-стили

Параметр `styleTemplate` позволяет определить CSS-стили для оформления сгенерированного контента. Стили добавляются в тег `<style>` после шаблона Handlebars.

Пример стилей:

```css
.data-list {
  list-style-type: none;
  padding: 0;
}
.data-list li {
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
```

## Примеры конфигурации в JSON

### Пример 1: Базовая конфигурация с отображением списка

```json
{
  "datasource": "5__table",
  "viz_type": "handlebars",
  "slice_id": 123,
  "query_mode": "raw",
  "all_columns": ["name", "age", "city"],
  "adhoc_filters": [],
  "row_limit": 100,
  "handlebarsTemplate": "<ul class=\"data-list\">\n  {{#each data}}\n    <li>\n      <strong>{{name}}</strong> ({{age}}): {{city}}\n    </li>\n  {{/each}}\n</ul>",
  "styleTemplate": ".data-list {\n  list-style-type: none;\n  padding: 0;\n}\n.data-list li {\n  margin-bottom: 10px;\n  padding: 10px;\n  border: 1px solid #ccc;\n  border-radius: 5px;\n}"
}
```

### Пример 2: Конфигурация с агрегацией и форматированием дат

```json
{
  "datasource": "5__table",
  "viz_type": "handlebars",
  "slice_id": 123,
  "query_mode": "aggregate",
  "groupby": ["date", "category"],
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
  "order_by": ["SUM(sales)"],
  "order_desc": true,
  "handlebarsTemplate": "<table class=\"data-table\">\n  <thead>\n    <tr>\n      <th>Дата</th>\n      <th>Категория</th>\n      <th>Продажи</th>\n    </tr>\n  </thead>\n  <tbody>\n    {{#each data}}\n      <tr>\n        <td>{{dateFormat date format=\"DD.MM.YYYY\"}}</td>\n        <td>{{category}}</td>\n        <td class=\"sales\">{{SUM(sales)}}</td>\n      </tr>\n    {{/each}}\n  </tbody>\n</table>",
  "styleTemplate": ".data-table {\n  width: 100%;\n  border-collapse: collapse;\n}\n.data-table th, .data-table td {\n  padding: 8px;\n  border: 1px solid #ddd;\n}\n.data-table th {\n  background-color: #f2f2f2;\n}\n.sales {\n  text-align: right;\n  font-weight: bold;\n}"
}
```

### Пример 3: Конфигурация с условным форматированием

```json
{
  "datasource": "5__table",
  "viz_type": "handlebars",
  "slice_id": 123,
  "query_mode": "raw",
  "all_columns": ["product", "status", "quantity", "price"],
  "adhoc_filters": [],
  "row_limit": 100,
  "handlebarsTemplate": "<div class=\"card-container\">\n  {{#each data}}\n    <div class=\"card {{#if (eq status 'Out of Stock')}}out-of-stock{{else}}{{#if (eq status 'Low Stock')}}low-stock{{else}}in-stock{{/if}}{{/if}}\">\n      <h3>{{product}}</h3>\n      <p>Status: <span class=\"status\">{{status}}</span></p>\n      <p>Quantity: {{quantity}}</p>\n      <p>Price: ${{price}}</p>\n    </div>\n  {{/each}}\n</div>",
  "styleTemplate": ".card-container {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 15px;\n}\n.card {\n  width: 200px;\n  padding: 15px;\n  border-radius: 8px;\n  box-shadow: 0 2px 4px rgba(0,0,0,0.1);\n}\n.out-of-stock {\n  background-color: #ffdddd;\n}\n.low-stock {\n  background-color: #ffffdd;\n}\n.in-stock {\n  background-color: #ddffdd;\n}\n.status {\n  font-weight: bold;\n}"
}
```

## Пути к файлам реализации

- **Основной компонент**: [superset-frontend/plugins/plugin-chart-handlebars/src/Handlebars.tsx](../Handlebars.tsx)
- **Компонент просмотра**: [superset-frontend/plugins/plugin-chart-handlebars/src/components/Handlebars/HandlebarsViewer.tsx](../components/Handlebars/HandlebarsViewer.tsx)
- **Трансформация данных**: [superset-frontend/plugins/plugin-chart-handlebars/src/plugin/transformProps.ts](../plugin/transformProps.ts)
- **Конфигурация**: [superset-frontend/plugins/plugin-chart-handlebars/src/plugin/controlPanel.tsx](../plugin/controlPanel.tsx)
- **Контрол шаблона**: [superset-frontend/plugins/plugin-chart-handlebars/src/plugin/controls/handlebarTemplate.tsx](../plugin/controls/handlebarTemplate.tsx)
- **Типы данных**: [superset-frontend/plugins/plugin-chart-handlebars/src/types.ts](../types.ts)
- **Построение запроса**: [superset-frontend/plugins/plugin-chart-handlebars/src/plugin/buildQuery.ts](../plugin/buildQuery.ts)

## Примечания

- Handlebars использует библиотеку handlebars.js для шаблонизации.
- Для форматирования дат используется библиотека moment.js.
- Для дополнительных хелперов используется библиотека just-handlebars-helpers.
- HTML-санитизация (DODO 44611022) может быть отключена через конфигурацию.
- Шаблоны Handlebars могут включать произвольный HTML-код, что делает этот тип графика очень гибким.
- При использовании шаблонов Handlebars необходимо учитывать безопасность, особенно при отключенной HTML-санитизации.
- Для доступа к данным в шаблоне используется переменная `data`, например: `{{#each data}}...{{/each}}`.
