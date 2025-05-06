# Документация по DODO-специфичным компонентам и функциям в Filters

## Содержание

1. [Введение](#введение)
2. [Компоненты фильтров с поддержкой локализации](#компоненты-фильтров-с-поддержкой-локализации)
   - [SelectWithTranslationFilterPlugin](#selectwithtranslationfilterplugin)
   - [SelectByIdFilterPlugin](#selectbyidfilterplugin)
   - [SelectByIdWithTranslationFilterPlugin](#selectbyidwithtranslationfilterplugin)
3. [Утилиты для работы с фильтрами](#утилиты-для-работы-с-фильтрами)
   - [hasFilterTranslations](#hasfiltertranslations)
4. [Модификации компонентов интерфейса](#модификации-компонентов-интерфейса)
   - [SelectFilter](#selectfilter)
5. [Прочие модификации](#прочие-модификации)

## Введение

Данный документ содержит информацию о компонентах и функциях, которые были добавлены или модифицированы командой DODO в директории `filters` проекта Superset. Каждая модификация помечена идентификатором изменения (например, "DODO 44211759").

## Компоненты фильтров с поддержкой локализации

### SelectWithTranslationFilterPlugin

**Описание**: Компонент фильтра выбора с поддержкой локализации (русский и английский языки).

**DODO-модификации**:

- **44211759**: Создан компонент для поддержки локализации фильтров

**Ключевые файлы**:

- `superset-frontend/src/filters/components/Select/index-with-translation.ts`
- `superset-frontend/src/filters/components/Select/SelectFilterPluginWithTranslations.tsx`

**Пример кода**:

```typescript
export default class FilterSelectWithTranslationPlugin extends ChartPlugin {
  constructor() {
    const metadata = new ChartMetadata({
      name: t('Select with translation'),
      description: t("Select with translation filter plugin using AntD'"),
      behaviors: [Behavior.InteractiveChart, Behavior.NativeFilter],
      enableNoResults: false,
      tags: [t('Experimental')],
      thumbnail,
    });

    super({
      buildQuery,
      controlPanel: panel,
      loadChart: () => import('./SelectFilterPluginWithTranslations'),
      metadata,
      transformProps,
    });
  }
}
```

### SelectByIdFilterPlugin

**Описание**: Компонент фильтра выбора с поддержкой идентификаторов.

**DODO-модификации**:

- **44211759**: Создан компонент для поддержки фильтрации по идентификаторам

**Ключевые файлы**:

- `superset-frontend/src/filters/components/Select/index-by-id.ts`

**Пример кода**:

```typescript
for (let i = 0; i < panel.controlPanelSections.length; i += 1) {
  const section = panel.controlPanelSections.at(i);
  // @ts-ignore
  if (section?.controlSetRows.at(0)?.at(0)?.name === 'groupby') {
    section?.controlSetRows?.at(0)?.push({
      name: 'groupbyid',
      config: {
        ...sharedControls.groupby,
        label: `${t('Column')} ID`,
        required: true,
      },
    });
  }
}
```

### SelectByIdWithTranslationFilterPlugin

**Описание**: Компонент фильтра выбора с поддержкой идентификаторов и локализации.

**DODO-модификации**:

- **44211759**: Создан компонент для поддержки фильтрации по идентификаторам с локализацией

**Ключевые файлы**:

- `superset-frontend/src/filters/components/Select/index-by-id-with-translation.ts`
- `superset-frontend/src/filters/components/Select/SelectFilterPluginWithTranslations.tsx`

**Пример кода**:

```typescript
for (let i = 0; i < panel.controlPanelSections.length; i += 1) {
  const section = panel.controlPanelSections.at(i);
  const controlSetRow = section?.controlSetRows?.[0];
  const controlSet = controlSetRow?.[0];
  // @ts-ignore
  if (controlSet && controlSet.name === 'groupby') {
    // @ts-ignore
    controlSet.config.label = `${t('Column')} EN`;
    controlSetRow.push({
      name: 'groupbyRu',
      config: {
        ...sharedControls.groupby,
        label: `${t('Column')} RU`,
        required: true,
      },
    });
    controlSetRow.push({
      name: 'groupbyid',
      config: {
        ...sharedControls.groupby,
        label: `${t('Column')} ID`,
        required: true,
      },
    });
  }
}
```

## Утилиты для работы с фильтрами

### hasFilterTranslations

**Описание**: Функция для проверки, поддерживает ли фильтр локализацию.

**DODO-модификации**:

- **44211759**: Создана функция для проверки поддержки локализации

**Ключевые файлы**:

- `superset-frontend/src/filters/utils.ts`

**Пример кода**:

```typescript
// DODO added 44211759
export const hasFilterTranslations = (filterType: string): boolean =>
  filterType === FilterPlugins.SelectWithTranslation ||
  filterType === FilterPlugins.SelectByIdWithTranslation;
```

## Модификации компонентов интерфейса

### SelectFilter

**Описание**: Модификация компонента выбора для поддержки настраиваемой ширины.

**DODO-модификации**:

- **44211759**: Добавлен параметр width для настройки ширины компонента

**Ключевые файлы**:

- `superset-frontend/src/components/ListView/Filters/Select.tsx`

**Пример кода**:

```typescript
interface SelectFilterPropsDodoExtended {
  width?: number; // DODO added 44211759
}
interface SelectFilterProps extends BaseFilter, SelectFilterPropsDodoExtended {
  fetchSelects?: Filter['fetchSelects'];
  name?: string;
  onSelect: (selected: SelectOption | undefined, isClear?: boolean) => void;
  paginate?: boolean;
  selects: Filter['selects'];
}
```

## Прочие модификации

### Константы для типов фильтров

**DODO-модификации**:

- **44211759**: Добавлены константы для новых типов фильтров

**Ключевые файлы**:

- `superset-frontend/src/constants.ts`

**Пример кода**:

```typescript
export enum FilterPlugins {
  Select = 'filter_select',
  Range = 'filter_range',
  Time = 'filter_time',
  TimeColumn = 'filter_timecolumn',
  TimeGrain = 'filter_timegrain',
  SelectById = 'filter_select_by_id', // DODO added 44211759
  SelectWithTranslation = 'filter_select_with_translation', // DODO added 44211759
  SelectByIdWithTranslation = 'filter_select_by_id_with_translation', // DODO added 44211759
}
```

### Экспорт компонентов фильтров

**DODO-модификации**:

- **44211759**: Добавлен экспорт новых компонентов фильтров

**Ключевые файлы**:

- `superset-frontend/src/filters/components/index.ts`

**Пример кода**:

```typescript
export { default as SelectFilterPlugin } from './Select';
export { default as RangeFilterPlugin } from './Range';
export { default as TimeFilterPlugin } from './Time';
export { default as TimeColumnFilterPlugin } from './TimeColumn';
export { default as TimeGrainFilterPlugin } from './TimeGrain';
export { default as SelectByIdFilterPlugin } from './Select/index-by-id'; // DODO added 44211759
export { default as SelectWithTranslationFilterPlugin } from './Select/index-with-translation'; // DODO added 44211759
export { default as SelectByIdWithTranslationFilterPlugin } from './Select/index-by-id-with-translation'; // DODO added 44211759
```

### Локализация заголовков фильтров

**DODO-модификации**:

- **44211759**: Добавлена поддержка локализации заголовков фильтров

**Ключевые файлы**:

- `superset-frontend/src/DodoExtensions/FilterSets/FiltersHeader.tsx`

**Пример кода**:

```typescript
// DODO added start 44211759
const locale = bootstrapData?.common?.locale || 'en';
const localisedNameField = `name${locale === 'en' ? '' : 'Ru'}` as
  | 'name'
  | 'nameRu';
// DODO added stop 44211759
```

### Standalone режим для фильтров

**DODO-модификации**:

- **44611022**: Добавлена поддержка standalone режима для фильтров

**Ключевые файлы**:

- `superset-frontend/src/dashboard/components/nativeFilters/FilterBar/index.tsx`

**Пример кода**:

```typescript
const isStandalone = process.env.type === undefined; // DODO added 44611022
```
