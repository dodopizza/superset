# Бизнес-логика графика: Word Cloud (Облако слов)

## Общее описание

Word Cloud (Облако слов) - это тип визуализации, который отображает слова в столбце, которые встречаются наиболее часто. Размер шрифта соответствует частоте встречаемости слова. Этот тип графика полезен для визуализации текстовых данных и выделения наиболее важных или часто встречающихся терминов.

## Основные параметры и их назначение

### Параметры запроса (Query)

| Параметр | Назначение | Подтверждение в коде |
|----------|------------|----------------------|
| `series` | Столбец, содержащий текстовые данные для отображения | [controlPanel.ts](../plugin/controlPanel.ts): `series` |
| `metric` | Метрика для определения размера слов | [controlPanel.ts](../plugin/controlPanel.ts): `metric` |
| `adhoc_filters` | Фильтры для данных | [controlPanel.ts](../plugin/controlPanel.ts): `adhoc_filters` |
| `row_limit` | Ограничение количества слов | [controlPanel.ts](../plugin/controlPanel.ts): `row_limit` |
| `sort_by_metric` | Сортировка по метрике | [controlPanel.ts](../plugin/controlPanel.ts): `sort_by_metric` |

### Параметры отображения (Options)

| Параметр | Назначение | Подтверждение в коде |
|----------|------------|----------------------|
| `size_from` | Минимальный размер шрифта | [controlPanel.ts](../plugin/controlPanel.ts): `size_from` |
| `size_to` | Максимальный размер шрифта | [controlPanel.ts](../plugin/controlPanel.ts): `size_to` |
| `rotation` | Поворот слов (random, flat, square) | [controlPanel.ts](../plugin/controlPanel.ts): `rotation` |
| `color_scheme` | Цветовая схема для графика | [controlPanel.ts](../plugin/controlPanel.ts): `color_scheme` |

## Логика работы и обработки данных

### Основной поток данных

1. **Получение данных**: Данные получаются из источника данных через API запрос.
2. **Трансформация данных**: Данные преобразуются в формат, подходящий для облака слов.
   - В файле [transformProps.ts](../plugin/transformProps.ts) происходит преобразование данных из формата запроса в формат, необходимый для компонента WordCloud.
   - Для каждого слова определяется его размер на основе значения метрики.
3. **Генерация облака**: Библиотека d3-cloud используется для размещения слов в облаке.
   - Функция `generateCloud` в [WordCloud.tsx](../chart/WordCloud.tsx) отвечает за генерацию облака слов.
   - Алгоритм пытается разместить все слова, при необходимости масштабируя облако.
4. **Отображение**: Данные отображаются в виде облака слов с использованием SVG.

### Алгоритм размещения слов

Библиотека d3-cloud использует алгоритм, который пытается разместить слова таким образом, чтобы они не перекрывались. Процесс работает следующим образом:

1. Слова сортируются по размеру (значению метрики) в порядке убывания.
2. Для каждого слова определяется его размер шрифта на основе значения метрики.
3. Алгоритм пытается разместить слова, начиная с самых больших, в центре облака.
4. Если слова не помещаются, облако масштабируется с помощью `scaleFactor`.
5. Процесс повторяется до тех пор, пока все слова не будут размещены или не будет достигнут максимальный `scaleFactor`.

### Масштабирование облака

Если все слова не помещаются в облако, компонент автоматически масштабирует его:

- Начальный `scaleFactor` равен 1.
- Если слова не помещаются, `scaleFactor` увеличивается на `SCALE_FACTOR_STEP` (0.5).
- Процесс повторяется до тех пор, пока все слова не будут размещены или не будет достигнут `MAX_SCALE_FACTOR` (3).
- Параметр `TOP_RESULTS_PERCENTAGE` (0.1) определяет процент наиболее важных слов, которые всегда должны отображаться.

## Форматирование и визуальные настройки

### Размер шрифта

- **Минимальный размер шрифта** (`size_from`): Определяет размер шрифта для наименьшего значения метрики.
- **Максимальный размер шрифта** (`size_to`): Определяет размер шрифта для наибольшего значения метрики.

Размер шрифта для каждого слова рассчитывается линейно между `size_from` и `size_to` в зависимости от значения метрики.

### Поворот слов

Параметр `rotation` определяет, как будут повернуты слова в облаке:

- **random**: Случайный поворот между -90 и 90 градусами с шагом 30 градусов.
- **flat**: Все слова горизонтальные (поворот 0 градусов).
- **square**: Слова повернуты на 0 или 90 градусов.

### Цветовая схема

Параметр `color_scheme` определяет цветовую схему для графика. Цвета применяются к словам на основе их значений в столбце `series`.

## Примеры конфигурации в JSON

### Пример 1: Базовая конфигурация

```json
{
  "datasource": "5__table",
  "viz_type": "word_cloud",
  "slice_id": 123,
  "series": "product_name",
  "metric": "count",
  "adhoc_filters": [],
  "row_limit": 100,
  "size_from": 10,
  "size_to": 70,
  "rotation": "square",
  "color_scheme": "supersetColors"
}
```

### Пример 2: Облако слов с случайным поворотом и фильтрацией

```json
{
  "datasource": "5__table",
  "viz_type": "word_cloud",
  "slice_id": 123,
  "series": "customer_name",
  "metric": {
    "aggregate": "COUNT",
    "column": {
      "column_name": "*"
    },
    "expressionType": "SIMPLE",
    "label": "COUNT(*)"
  },
  "adhoc_filters": [
    {
      "clause": "WHERE",
      "expressionType": "SIMPLE",
      "filterOptionName": "filter_8ly71emic_hc9vt9a6i7",
      "comparator": "2023-01-01",
      "operator": ">=",
      "subject": "order_date"
    }
  ],
  "row_limit": 150,
  "size_from": 15,
  "size_to": 80,
  "rotation": "random",
  "color_scheme": "d3Category20"
}
```

### Пример 3: Облако слов с плоским поворотом и кастомной метрикой

```json
{
  "datasource": "5__table",
  "viz_type": "word_cloud",
  "slice_id": 123,
  "series": "category",
  "metric": {
    "aggregate": "SUM",
    "column": {
      "column_name": "sales"
    },
    "expressionType": "SIMPLE",
    "label": "SUM(sales)"
  },
  "adhoc_filters": [],
  "row_limit": 50,
  "size_from": 20,
  "size_to": 100,
  "rotation": "flat",
  "color_scheme": "supersetColors"
}
```

## Пути к файлам реализации

- **Основной компонент**: [superset-frontend/plugins/plugin-chart-word-cloud/src/chart/WordCloud.tsx](../chart/WordCloud.tsx)
- **Трансформация данных**: [superset-frontend/plugins/plugin-chart-word-cloud/src/plugin/transformProps.ts](../plugin/transformProps.ts)
- **Конфигурация**: [superset-frontend/plugins/plugin-chart-word-cloud/src/plugin/controlPanel.ts](../plugin/controlPanel.ts)
- **Типы данных**: [superset-frontend/plugins/plugin-chart-word-cloud/src/types.ts](../types.ts)
- **Построение запроса**: [superset-frontend/plugins/plugin-chart-word-cloud/src/plugin/buildQuery.ts](../plugin/buildQuery.ts)

## Примечания

- Word Cloud использует библиотеку d3-cloud для размещения слов.
- Алгоритм автоматически масштабирует облако, если все слова не помещаются.
- Параметр `TOP_RESULTS_PERCENTAGE` (0.1) определяет процент наиболее важных слов, которые всегда должны отображаться.
- Для корректного отображения облака рекомендуется ограничивать количество слов (не более 100-150).
- Параметр `sort_by_metric` позволяет автоматически сортировать слова по значению метрики.
- Случайный поворот слов использует фиксированное начальное значение (seed) для обеспечения воспроизводимости результатов.
