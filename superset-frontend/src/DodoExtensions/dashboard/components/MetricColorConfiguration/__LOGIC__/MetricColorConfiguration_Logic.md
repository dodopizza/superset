# Документация по компоненту MetricColorConfiguration

## Содержание

1. [Введение](#введение)
2. [Функциональность](#функциональность)
3. [Архитектура](#архитектура)
4. [Локализация](#локализация)
5. [Интеграция с дашбордом](#интеграция-с-дашбордом)
6. [Примеры использования](#примеры-использования)

## Введение

Компонент `MetricColorConfiguration` предназначен для настройки цветов метрик и колонок на дашборде. Он позволяет пользователям назначать пользовательские цвета для метрик и колонок, что улучшает визуальное восприятие данных на дашборде.

**DODO-модификации**:

- **45320801**: Создан компонент для настройки цветов метрик на дашборде
- **49876543**: Добавлена поддержка локализации для метрик и колонок из наборов данных

## Функциональность

Компонент `MetricColorConfiguration` предоставляет следующую функциональность:

1. **Отображение списка метрик и колонок**:
   - Отображение всех метрик и колонок, используемых на дашборде
   - Индикация метрик, которые присутствуют на дашборде с текущими фильтрами
   - Отображение текущего цвета метрики

2. **Управление цветами**:
   - Назначение пользовательских цветов для метрик и колонок
   - Удаление назначенных цветов
   - Отмена изменений для отдельных метрик

3. **Поиск и фильтрация**:
   - Поиск по названиям метрик и колонок (с учетом локализации)
   - Пагинация для удобного просмотра большого количества метрик

4. **Локализация**:
   - Отображение локализованных названий метрик и колонок в зависимости от выбранного языка интерфейса
   - Поиск по локализованным названиям

## Архитектура

Компонент `MetricColorConfiguration` состоит из следующих основных частей:

1. **Основной компонент** (`index.tsx`):
   - Управление состоянием компонента
   - Обработка пользовательских действий
   - Отображение интерфейса

2. **Стили** (`styles.ts`):
   - Стилизация компонентов с использованием styled-components

3. **Интеграция с Redux**:
   - Получение данных о метриках и колонках из состояния Redux
   - Сохранение изменений в состояние Redux

### Основные хуки и функции

1. **useMemo для создания словаря переводов**:
   ```typescript
   const translationsMap = useMemo(() => {
     const translations: Record<string, string> = {};
     
     // Собираем переводы из всех наборов данных
     Object.values(datasources).forEach(datasource => {
       // Добавляем переводы для метрик
       if (Array.isArray(datasource?.metrics)) {
         datasource.metrics.forEach((metric: any) => {
           // Для русского языка используем verbose_name_ru
           if (locale === 'ru' && metric.metric_name && metric.verbose_name_ru) {
             translations[metric.metric_name] = metric.verbose_name_ru;
           } 
           // Для английского и других языков используем verbose_name
           else if (metric.metric_name && metric.verbose_name && metric.metric_name !== metric.verbose_name) {
             translations[metric.metric_name] = metric.verbose_name;
           }
           
           // Если метрика отображается по имени, но у нее есть verbose_name
           if (metric.verbose_name && metric.metric_name !== metric.verbose_name) {
             translations[metric.verbose_name] = locale === 'ru' && metric.verbose_name_ru 
               ? metric.verbose_name_ru 
               : metric.metric_name;
           }
         });
       }
       
       // Аналогичная логика для колонок
       // ...
     });
     
     return translations;
   }, [datasources]);
   ```

2. **useMemo для фильтрации метрик**:
   ```typescript
   const filteredMetrics = useMemo(
     () =>
       uniqueMetrics.filter(metric => {
         const searchLower = debouncedSearch.toLowerCase();
         // Ищем как в оригинальном названии, так и в переводе
         return (
           metric.toLowerCase().includes(searchLower) ||
           translationsMap[metric]?.toLowerCase().includes(searchLower) || false
         );
       }),
     [uniqueMetrics, debouncedSearch, translationsMap],
   );
   ```

3. **Функция сохранения изменений**:
   ```typescript
   const handleSave = () => {
     const finalLabelColors = { ...mergedLabelColors };
     // remove deleted labels from finalLabelColors
     Object.keys(deletedLabels).forEach(label => delete finalLabelColors[label]);

     setIsLoading(true);
     dispatch(saveLabelColorsSettings(finalLabelColors));
     // Устанавливаем таймаут для завершения операции
     setTimeout(() => {
       setIsLoading(false);
       setShow(false);
     }, 500);
   };
   ```

## Локализация

Компонент `MetricColorConfiguration` поддерживает локализацию названий метрик и колонок. Локализация работает следующим образом:

1. **Определение текущего языка**:
   ```typescript
   const locale = bootstrapData?.common?.locale || 'en';
   ```

2. **Создание словаря переводов**:
   - Для русского языка используются переводы из `verbose_name_ru`
   - Для английского и других языков используются отображаемые имена из `verbose_name`
   - Учитывается различие между именами метрик (`metric_name`) и их отображаемыми именами (`verbose_name`)
   - Создаются двусторонние связи между именами и отображаемыми именами для корректного отображения

3. **Отображение локализованных названий**:
   ```typescript
   <p title={label}>{translationsMap[label] || label}</p>
   ```

4. **Поиск по локализованным названиям**:
   ```typescript
   metric.toLowerCase().includes(searchLower) ||
   translationsMap[metric]?.toLowerCase().includes(searchLower) || false
   ```

## Интеграция с дашбордом

Компонент `MetricColorConfiguration` интегрируется с дашбордом через компонент `Header`. Для этого:

1. В компоненте `Header` добавлен импорт:
   ```typescript
   import MetricColorConfiguration from 'src/DodoExtensions/dashboard/components/MetricColorConfiguration';
   ```

2. Компонент `MetricColorConfiguration` добавлен в интерфейс дашборда:
   ```typescript
   <MetricColorConfiguration
     charts={this.props.charts}
     labelColors={dashboardInfo.metadata?.label_colors}
     colorScheme={
       dashboardInfo?.metadata?.color_scheme ||
       this.props.colorScheme
     }
     datasources={this.props.datasources}
   />
   ```

3. В контейнере `DashboardHeader` добавлена передача `datasources` из состояния Redux:
   ```typescript
   function mapStateToProps({
     // ...
     datasources,
   }) {
     return {
       // ...
       datasources,
     };
   }
   ```

## Примеры использования

### Пример 1: Открытие модального окна настройки цветов

```typescript
<Button
  buttonStyle="secondary"
  onClick={openModal}
  className="action-button"
  aria-label={t('Edit colors')}
>
  {t('Edit colors')}
</Button>
```

### Пример 2: Отображение метрики с учетом локализации

```typescript
<LabelWrapper existOnDashboard={existOnDashboard}>
  {!existOnDashboard && (
    <InfoTooltip
      tooltip={t(
        'Metric is missing from the dashboard with current filters or removed from the dataset',
      )}
      placement="top"
    />
  )}
  <p title={label}>{translationsMap[label] || label}</p>
</LabelWrapper>
```

### Пример 3: Изменение цвета метрики

```typescript
<ColorPickerControlDodo
  value={isDeleted ? undefined : mergedLabelColors[label]}
  onChange={handleChangeColor(label)}
  previewWidth="50px"
  disabled={isDeleted}
  isHex
/>
```

### Пример 4: Удаление цвета метрики

```typescript
<span
  role="button"
  tabIndex={0}
  onClick={handleDelete(label)}
>
  <Icons.Trash />
</span>
```
