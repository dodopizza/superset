# Логика работы таблицы Table

## Основные параметры

### Параметры данных

- **serverPagination** (boolean): Активирует серверную пагинацию. По умолчанию `false`.
  Источник: `controlPanel.tsx` (строки 202-208)
- **showCellBars** (boolean): Отображает фоновые бары для числовых значений. По умолчанию `true`.
  Источник: `TableChart.tsx` (пропс), `controlPanel.tsx` (строки 333-340)

### Визуальные настройки

- **alignPositiveNegative** (boolean): Выравнивает бары относительно нуля. По умолчанию `false`.
  Источник: `TableChart.tsx` (строки 423-425)
- **colorPositiveNegative** (boolean): Раскрашивает бары для +/- значений. По умолчанию `false`.
  Источник: `TableChart.tsx` (строки 426-428)

## Логика обработки данных

1. **Сортировка**:

   - Поддерживает множественную сортировку по Shift+Click (DODO 44136746)
   - Тип сортировки определяется по типу данных: datetime/alphanumeric/basic

2. **Фильтрация**:

   - Перекрестная фильтрация через клик по ячейке
   - Состояние фильтров сохраняется в dataMask

3. **Пагинация**:
   - Клиентская (до 1000 строк) и серверная реализации
   - Динамический расчет размеров таблицы с учетом scrollbar

## Форматирование

- Числовые значения:
  ```ts
  formatColumnValue(column, value); // utils/formatValue.ts
  ```
- Временные метки:
  ```ts
  getTimeFormatterForGranularity(timeGrain);
  ```

## Кастомные особенности (DODO-модификации)

1. **Фиксация колонок**:

   - Система sticky-колонок с вычислением позиции

   ```tsx
   const [pinnedColumns, setPinnedColumns] = useState(...)
   toggleColumnPin()
   ```

2. **Автоматическое преобразование URL в ссылки** (ревизия 45525377):

   - Автоматическое определение и преобразование URL-адресов в кликабельные ссылки

   ```tsx
   // В utils/formatValue.ts
   if (typeof value === 'string' && value.startsWith('http')) {
     return [
       true,
       `<a href="${value}" target="_blank" rel="noopener noreferrer">${value}</a>`,
     ];
   }
   ```

3. **Добавлены описания мер в виде тултипов** (ревизия 44728892):

   - Интеграция с системой подсказок для отображения описаний мер

   ```tsx
   <InfoTooltipWithTrigger tooltip={...}/>
   ```

4. **Расширенная сортировка** (ревизия 44136746):

   - Кастомные обработчики сортировки
   - Функция `handleAddToExtraFormData` добавляет `table_order_by` в payload экспорта

   ```ts
   handleAddToExtraFormData({ table_order_by: order });
   ```

5. **Экспорт числовых значений как время** (ревизия 33638561):
   - Добавлена вкладка "Export" с опцией "exportAsTime" для числовых колонок
   ```ts
   // В consts.ts
   {
     tab: t('Export'),
     children: [['exportAsTime']],
   }
   ```

## Примеры конфигурации

1. Базовая настройка:

```json
{
  "serverPagination": false,
  "pageLength": 50,
  "showCellBars": true,
  "alignPositiveNegative": true
}
```

2. Расширенная конфигурация:

```json
{
  "conditional_formatting": [
    {
      "column": "revenue",
      "operator": ">",
      "value": 1000000,
      "color": "#00FF00"
    }
  ],
  "pinnedColumns": [0, 1]
}
```

## Особенности DODO

- **Экспорт числовых значений как время**: Позволяет экспортировать числовые значения в формате времени, что полезно для временных меток, хранящихся как числа.
- **Автоматическое преобразование URL**: Строковые значения, начинающиеся с "http", автоматически преобразуются в кликабельные ссылки.
- **Фиксация колонок**: Возможность закрепить колонки для удобства просмотра больших таблиц.
- **Описания мер в виде тултипов**: Отображение дополнительной информации о мерах при наведении.
- **Расширенная сортировка**: Поддержка множественной сортировки с помощью Shift+Click и добавление параметров сортировки в payload экспорта.

## Ссылки на реализацию

- Основной компонент: [TableChart.tsx](src/TableChart.tsx)
- Конфигурация: [controlPanel.tsx](src/controlPanel.tsx)
- Константы: [consts.ts](src/consts.ts)
- Утилиты:
  - [utils/formatValue.ts](src/utils/formatValue.ts)
  - [DodoExtensions/columnPinning.ts](src/DodoExtensions/utils/columnPinning.ts)
