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

1. **Фиксация колонок** (ревизия 45525377):

   - Система sticky-колонок с вычислением позиции

   ```tsx
   const [pinnedColumns, setPinnedColumns] = useState(...)
   toggleColumnPin()
   ```

2. **Условное форматирование** (ревизия 44728892):

   - Интеграция с системой подсказок

   ```tsx
   <InfoTooltipWithTrigger tooltip={...}/>
   ```

3. **Расширенная сортировка** (ревизия 44136746):
   - Кастомные обработчики сортировки
   ```ts
   handleAddToExtraFormData({ table_order_by: order });
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

## Ссылки на реализацию

- Основной компонент: [TableChart.tsx](src/TableChart.tsx)
- Конфигурация: [controlPanel.tsx](src/controlPanel.tsx)
- Утилиты:
  - [utils/formatValue.ts](src/utils/formatValue.ts)
  - [DodoExtensions/columnPinning.ts](src/DodoExtensions/utils/columnPinning.ts)
