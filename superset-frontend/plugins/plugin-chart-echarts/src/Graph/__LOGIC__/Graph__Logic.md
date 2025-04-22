# Бизнес-логика графика: Graph Chart (Граф)

## Общее описание

Graph Chart (Граф) - это тип визуализации, который отображает связи между сущностями в структуре графа. Этот тип графика полезен для отображения отношений и показа важных узлов в сети. Графы могут быть настроены как силовые (force-directed) или круговые (circular). Этот тип визуализации особенно эффективен для анализа сетевых структур, социальных связей, иерархий и других типов отношений между объектами.

## Основные параметры и их назначение

### Параметры запроса (Query)

| Параметр          | Назначение                                     | Подтверждение в коде                                       |
| ----------------- | ---------------------------------------------- | ---------------------------------------------------------- |
| `source`          | Столбец с именами исходных узлов               | [controlPanel.tsx](../controlPanel.tsx): `source`          |
| `target`          | Столбец с именами целевых узлов                | [controlPanel.tsx](../controlPanel.tsx): `target`          |
| `metric`          | Метрика для определения веса связей            | [controlPanel.tsx](../controlPanel.tsx): `metric`          |
| `source_category` | Категория исходных узлов для назначения цветов | [controlPanel.tsx](../controlPanel.tsx): `source_category` |
| `target_category` | Категория целевых узлов                        | [controlPanel.tsx](../controlPanel.tsx): `target_category` |
| `adhoc_filters`   | Фильтры для данных                             | [controlPanel.tsx](../controlPanel.tsx): `adhoc_filters`   |
| `row_limit`       | Ограничение количества строк                   | [controlPanel.tsx](../controlPanel.tsx): `row_limit`       |

### Параметры отображения (Chart Options)

| Параметр                | Назначение                                      | Подтверждение в коде                                             |
| ----------------------- | ----------------------------------------------- | ---------------------------------------------------------------- |
| `color_scheme`          | Цветовая схема для графика                      | [controlPanel.tsx](../controlPanel.tsx): `color_scheme`          |
| `layout`                | Тип макета графа (force, circular)              | [controlPanel.tsx](../controlPanel.tsx): `layout`                |
| `roam`                  | Возможность перемещения и масштабирования графа | [controlPanel.tsx](../controlPanel.tsx): `roam`                  |
| `draggable`             | Возможность перетаскивания узлов                | [controlPanel.tsx](../controlPanel.tsx): `draggable`             |
| `selectedMode`          | Режим выбора узлов                              | [controlPanel.tsx](../controlPanel.tsx): `selectedMode`          |
| `show_symbol_threshold` | Порог отображения символов                      | [controlPanel.tsx](../controlPanel.tsx): `show_symbol_threshold` |
| `base_node_size`        | Базовый размер узла                             | [controlPanel.tsx](../controlPanel.tsx): `baseNodeSize`          |
| `base_edge_width`       | Базовая ширина связи                            | [controlPanel.tsx](../controlPanel.tsx): `baseEdgeWidth`         |
| `edge_length`           | Длина связи                                     | [controlPanel.tsx](../controlPanel.tsx): `edgeLength`            |
| `edge_symbol`           | Символ связи                                    | [controlPanel.tsx](../controlPanel.tsx): `edgeSymbol`            |
| `repulsion`             | Сила отталкивания между узлами                  | [controlPanel.tsx](../controlPanel.tsx): `repulsion`             |
| `gravity`               | Сила гравитации к центру                        | [controlPanel.tsx](../controlPanel.tsx): `gravity`               |
| `friction`              | Трение (замедление движения узлов)              | [controlPanel.tsx](../controlPanel.tsx): `friction`              |
| `show_legend`           | Отображение легенды                             | [controlPanel.tsx](../controlPanel.tsx): `showLegend`            |
| `legend_type`           | Тип легенды                                     | [controlPanel.tsx](../controlPanel.tsx): `legendType`            |
| `legend_orientation`    | Ориентация легенды                              | [controlPanel.tsx](../controlPanel.tsx): `legendOrientation`     |

## Логика работы и обработки данных

### Основной поток данных

1. **Получение данных**: Данные получаются из источника данных через API запрос.
2. **Трансформация данных**: Данные преобразуются в формат, подходящий для графа.
   - В файле [transformProps.ts](../transformProps.ts) происходит преобразование данных из формата запроса в формат, необходимый для компонента ECharts.
   - Для каждой строки данных создается связь между исходным и целевым узлами.
   - Узлы и связи организуются в структуру графа.
3. **Нормализация стилей**: Размеры узлов и ширина связей нормализуются для обеспечения визуальной согласованности.
   - Функция `normalizeStyles` в [transformProps.ts](../transformProps.ts) масштабирует размеры узлов и ширину связей в зависимости от их значений.
   - Минимальный размер узла составляет 0.5 _ `baseNodeSize`, а максимальный - 2 _ `baseNodeSize`.
   - Минимальная ширина связи составляет 0.5 _ `baseEdgeWidth`, а максимальная - 2 _ `baseEdgeWidth`.
4. **Отображение**: Данные отображаются в виде графа с использованием библиотеки ECharts.

### Алгоритмы макета

Параметр `layout` определяет, как узлы размещаются на графике:

- **Force** (`force`): Силовой макет, где узлы отталкиваются друг от друга, а связи действуют как пружины. Этот макет хорошо подходит для визуализации сложных сетей.

  - Параметр `repulsion` определяет силу отталкивания между узлами.
  - Параметр `gravity` определяет силу притяжения к центру.
  - Параметр `edgeLength` определяет идеальную длину связей.
  - Параметр `friction` определяет трение, которое замедляет движение узлов.

- **Circular** (`circular`): Круговой макет, где узлы размещаются по окружности. Этот макет хорошо подходит для визуализации циклических структур.
  - Узлы равномерно распределяются по окружности.
  - Метки узлов могут быть повернуты для лучшей читаемости.

### Категории и цвета

Параметры `source_category` и `target_category` позволяют группировать узлы по категориям и назначать им цвета:

- Если узел связан с несколькими категориями, используется только первая.
- Цвета категорий определяются выбранной цветовой схемой (`color_scheme`).
- Цвет связи по умолчанию соответствует цвету исходного узла.

## Форматирование и визуальные настройки

### Настройки узлов

- **Размер узла**: Параметр `baseNodeSize` определяет базовый размер узла. Фактический размер узла зависит от значения метрики.
- **Метки узлов**: Метки узлов отображаются рядом с узлами и показывают их имена.
- **Выделение узлов**: При наведении на узел выделяются все связанные с ним узлы и связи.

### Настройки связей

- **Ширина связи**: Параметр `baseEdgeWidth` определяет базовую ширину связи. Фактическая ширина связи зависит от значения метрики.
- **Символ связи**: Параметр `edgeSymbol` определяет символы на концах связи. Формат: "символ*начала,символ*конца". Возможные значения: "none", "circle", "arrow".
- **Кривизна связи**: Связи отображаются с небольшой кривизной (0.1) для лучшей визуализации.

### Интерактивность

- **Перемещение и масштабирование**: Параметр `roam` определяет возможность перемещения и масштабирования графа.
- **Перетаскивание узлов**: Параметр `draggable` определяет, можно ли перетаскивать узлы.
- **Выбор узлов**: Параметр `selectedMode` определяет режим выбора узлов (single, multiple, false).

## Примеры конфигурации в JSON

### Пример 1: Базовая конфигурация с силовым макетом

```json
{
  "datasource": "5__table",
  "viz_type": "echarts_graph",
  "slice_id": 123,
  "source": "source_node",
  "target": "target_node",
  "metric": {
    "aggregate": "SUM",
    "column": {
      "column_name": "value"
    },
    "expressionType": "SIMPLE",
    "label": "SUM(value)"
  },
  "source_category": "source_type",
  "target_category": "target_type",
  "adhoc_filters": [],
  "row_limit": 1000,
  "color_scheme": "supersetColors",
  "layout": "force",
  "roam": true,
  "draggable": true,
  "selectedMode": "single",
  "show_symbol_threshold": 0,
  "base_node_size": 20,
  "base_edge_width": 3,
  "edge_length": 400,
  "edge_symbol": "none,arrow",
  "repulsion": 1000,
  "gravity": 0.3,
  "friction": 0.2,
  "show_legend": true,
  "legend_type": "scroll",
  "legend_orientation": "top"
}
```

### Пример 2: Круговой макет с фильтрацией

```json
{
  "datasource": "5__table",
  "viz_type": "echarts_graph",
  "slice_id": 123,
  "source": "from_user",
  "target": "to_user",
  "metric": {
    "aggregate": "COUNT",
    "column": {
      "column_name": "*"
    },
    "expressionType": "SIMPLE",
    "label": "COUNT(*)"
  },
  "source_category": "user_type",
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
  "row_limit": 500,
  "color_scheme": "d3Category20",
  "layout": "circular",
  "roam": "scale",
  "draggable": false,
  "selectedMode": "multiple",
  "show_symbol_threshold": 10,
  "base_node_size": 15,
  "base_edge_width": 2,
  "edge_symbol": "none,none",
  "show_legend": true,
  "legend_type": "scroll",
  "legend_orientation": "right"
}
```

### Пример 3: Настроенный силовой макет с высокой детализацией

```json
{
  "datasource": "5__table",
  "viz_type": "echarts_graph",
  "slice_id": 123,
  "source": "department",
  "target": "project",
  "metric": {
    "aggregate": "SUM",
    "column": {
      "column_name": "budget"
    },
    "expressionType": "SIMPLE",
    "label": "SUM(budget)"
  },
  "source_category": "division",
  "target_category": "project_type",
  "adhoc_filters": [],
  "row_limit": 2000,
  "color_scheme": "supersetColors",
  "layout": "force",
  "roam": true,
  "draggable": true,
  "selectedMode": "single",
  "show_symbol_threshold": 0,
  "base_node_size": 25,
  "base_edge_width": 4,
  "edge_length": 300,
  "edge_symbol": "circle,arrow",
  "repulsion": 1500,
  "gravity": 0.2,
  "friction": 0.1,
  "show_legend": true,
  "legend_type": "scroll",
  "legend_orientation": "bottom"
}
```

## Пути к файлам реализации

- **Основной компонент**: [superset-frontend/plugins/plugin-chart-echarts/src/Graph/EchartsGraph.tsx](../EchartsGraph.tsx)
- **Трансформация данных**: [superset-frontend/plugins/plugin-chart-echarts/src/Graph/transformProps.ts](../transformProps.ts)
- **Конфигурация**: [superset-frontend/plugins/plugin-chart-echarts/src/Graph/controlPanel.tsx](../controlPanel.tsx)
- **Типы данных**: [superset-frontend/plugins/plugin-chart-echarts/src/Graph/types.ts](../types.ts)
- **Константы**: [superset-frontend/plugins/plugin-chart-echarts/src/Graph/constants.ts](../constants.ts)
- **Построение запроса**: [superset-frontend/plugins/plugin-chart-echarts/src/Graph/buildQuery.ts](../buildQuery.ts)

## Примечания

- Graph Chart использует библиотеку ECharts для визуализации данных.
- Силовой макет (force) является динамическим и может давать разные результаты при каждой визуализации.
- Для больших графов рекомендуется использовать фильтрацию или ограничение количества строк для улучшения производительности.
- Параметр `show_symbol_threshold` позволяет скрывать метки узлов, если их значение ниже указанного порога, что полезно для больших графов.
- Цвет связи по умолчанию соответствует цвету исходного узла, что помогает визуально отслеживать направление связей.
- При наведении на узел выделяются все связанные с ним узлы и связи, что помогает анализировать структуру графа.
- Параметр `edge_symbol` позволяет настраивать символы на концах связей, что полезно для визуализации направленных графов.
