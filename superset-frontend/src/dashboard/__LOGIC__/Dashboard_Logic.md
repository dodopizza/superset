# Документация по DODO-специфичным компонентам и функциям в Dashboard

## Содержание

1. [Введение](#введение)
2. [Локализация дашбордов](#локализация-дашбордов)
3. [Фильтры и наборы фильтров](#фильтры-и-наборы-фильтров)
   - [FilterSets (Наборы фильтров)](#filtersets-наборы-фильтров)
   - [Локализация фильтров](#локализация-фильтров)
   - [Первичные наборы фильтров](#первичные-наборы-фильтров)
4. [Интеграция с внешними системами](#интеграция-с-внешними-системами)
5. [Модификации прав доступа](#модификации-прав-доступа)
6. [Прочие модификации](#прочие-модификации)

## Введение

Данный документ содержит информацию о компонентах и функциях, которые были добавлены или модифицированы командой DODO в директории `dashboard` проекта Superset. Каждая модификация помечена идентификатором изменения (например, "DODO 44120742").

## Локализация дашбордов

### Поддержка русского языка для заголовков дашбордов

**DODO-модификации**:

- **44120742**: Добавлено поле `dashboard_title_ru` для хранения заголовка дашборда на русском языке

**Ключевые файлы**:

- `superset-frontend/src/types/Dashboard.ts` - добавлен интерфейс `DashboardDodoExtended` с полем `dashboard_title_ru`
- `superset-frontend/src/dashboard/containers/DashboardPage.tsx` - изменена логика отображения заголовка дашборда в зависимости от выбранного языка
- `superset/dashboards/schemas.py` - добавлено поле `dashboard_title_ru` в схемы API
- `superset/migrations/versions/2023-11-01_01-00_049632555b84_.py` - миграция для добавления поля `dashboard_title_ru` в таблицу `dashboards`

**Пример кода**:

```typescript
// DODO changed 44120742
useEffect(() => {
  const localisedTitle = locale === 'ru' ? dashboard_title_ru : dashboard_title;

  document.title =
    localisedTitle ||
    dashboard_title ||
    dashboard_title_ru ||
    fallBackPageTitle;

  return () => {
    document.title = originalDocumentTitle;
  };
}, [dashboard_title, dashboard_title_ru]);
```

### Поиск дашбордов по русскому заголовку

**DODO-модификации**:

- **44120742**: Добавлена возможность поиска дашбордов по русскому заголовку

**Ключевые файлы**:

- `superset/dashboards/filters.py` - модифицирован фильтр `DashboardTitleOrSlugFilter` для поиска по полю `dashboard_title_ru`

**Пример кода**:

```python
return query.filter(
    or_(
        Dashboard.dashboard_title.ilike(ilike_value),
        Dashboard.slug.ilike(ilike_value),
        Dashboard.dashboard_title_ru.ilike(ilike_value),  # dodo added 44120742
        cast(Dashboard.id, String).ilike(ilike_value),  # dodo added 44120742
    )
)
```

## Фильтры и наборы фильтров

### FilterSets (Наборы фильтров)

**Описание**: Компоненты для работы с наборами фильтров, позволяющие сохранять, применять и управлять наборами фильтров в дашбордах.

**DODO-модификации**:

- **44211751**: Добавлены компоненты для работы с наборами фильтров
- **38080573**: Добавлена поддержка первичных наборов фильтров

**Ключевые файлы**:

- `superset-frontend/src/DodoExtensions/FilterSets/index.tsx` - основной компонент для работы с наборами фильтров
- `superset-frontend/src/DodoExtensions/FilterSets/FilterSetUnit.tsx` - компонент для отображения отдельного набора фильтров
- `superset-frontend/src/DodoExtensions/FilterSets/FiltersHeader.tsx` - компонент для отображения заголовка фильтров
- `superset-frontend/src/DodoExtensions/FilterSets/Footer.tsx` - компонент для отображения футера с кнопками действий
- `superset-frontend/src/DodoExtensions/FilterSets/EditSection.tsx` - компонент для редактирования набора фильтров
- `superset-frontend/src/dashboard/actions/nativeFilters.ts` - добавлены действия для работы с наборами фильтров
- `superset-frontend/src/dashboard/components/nativeFilters/FilterBar/state.ts` - добавлены хуки для работы с наборами фильтров
- `superset/models/filter_set.py` - модель для хранения наборов фильтров в базе данных

**Пример кода**:

```typescript
// DODO added 44211751
export const useFilterSets = () =>
  useSelector<any, FilterSetsType>(
    state => state.nativeFilters.filterSets || {},
  );

export const usePendingFilterSetId = () =>
  useSelector<any, number | undefined>(
    state => state.nativeFilters.pendingFilterSetId,
  );
```

### Локализация фильтров

**DODO-модификации**:

- **44211759**: Добавлена поддержка локализации фильтров (русский язык)

**Ключевые файлы**:

- `superset-frontend/src/dashboard/components/nativeFilters/FiltersConfigModal/types.ts` - добавлены поля `nameRu` и `columnRu` в интерфейс `NativeFiltersFormItemDodoExtended`
- `superset-frontend/src/DodoExtensions/FilterSets/FiltersHeader.tsx` - добавлена логика для отображения локализованных названий фильтров

**Пример кода**:

```typescript
// DODO added start 44211759
const { id, name, nameRu, filterType, targets } = filter;
const column =
  hasFilterTranslations(filterType) && locale === 'ru'
    ? targets[0]?.column?.nameRu
    : targets[0]?.column?.name;
// DODO added stop 44211759
```

### Первичные наборы фильтров

**DODO-модификации**:

- **38080573**: Добавлена поддержка первичных наборов фильтров, которые автоматически применяются при загрузке дашборда

**Ключевые файлы**:

- `superset-frontend/src/DodoExtensions/FilterSets/FilterSetUnit.tsx` - добавлены свойства `isPrimary` и `onSetPrimary`
- `superset/models/filter_set.py` - добавлено поле `is_primary` в модель `FilterSet`

**Пример кода**:

```typescript
// DODO added start 38080573
isPrimary,
onSetPrimary,
isFilterSetPrimary,
setIsFilterSetPrimary,
isInPending,
// DODO added stop 38080573
```

## Интеграция с внешними системами

### Standalone режим

**DODO-модификации**:

- **44611022**: Добавлена поддержка standalone режима для интеграции с внешними системами

**Ключевые файлы**:

- `superset-frontend/src/dashboard/components/nativeFilters/FilterBar/index.tsx` - добавлена проверка на standalone режим
- `superset-frontend/src/dashboard/actions/nativeFilters.ts` - добавлена поддержка API_HANDLER для standalone режима

**Пример кода**:

```typescript
const isStandalone = process.env.type === undefined; // DODO added 44611022
```

## Модификации прав доступа

**DODO-модификации**:

- **44993666**: Изменена логика проверки прав доступа для сохранения дашбордов

**Ключевые файлы**:

- `superset-frontend/src/dashboard/actions/hydrate.js` - изменена логика проверки прав доступа

**Пример кода**:

```javascript
dash_save_perm:
  findPermission('can_save_dash', 'Superset', roles) || roles.Admin, // DODO changed 44993666
```

## Прочие модификации

### Дашборды по умолчанию для бизнесов

**DODO-модификации**:

- Добавлены константы для дашбордов по умолчанию для разных бизнесов

**Ключевые файлы**:

- `superset-frontend/src/Superstructure/utils/getDefaultDashboard.ts` - добавлены константы для дашбордов по умолчанию

**Пример кода**:

```typescript
export const DODOPIZZA_DEFAULT_DASHBOARD_ID = 209;
export const DRINKIT_DEFAULT_DASHBOARD_ID = 507;
```

### Активные фильтры дашборда

**DODO-модификации**:

- **44211759**: Добавлена поддержка локализации для активных фильтров дашборда

**Ключевые файлы**:

- `superset-frontend/src/dashboard/util/activeDashboardFilters.js` - добавлена поддержка локализации

**Пример кода**:

```javascript
const locale = bootstrapData?.common?.locale || 'en'; // DODO added 44211759
```

### Описания метрик в дашборде

**DODO-модификации**:

- **44728892**: Добавлена функция для получения описания метрики с учетом локализации

**Ключевые файлы**:

- `superset-frontend/src/DodoExtensions/dashboard/utils/getMetricDescription.ts` - функция для получения описания метрики

**Пример кода**:

```typescript
const localizedKey = `description_${locale}` as
  | 'description_en'
  | 'description_ru';

const getDescription = (
  source: Source | undefined,
): Maybe<string> | undefined =>
  source?.[localizedKey] ||
  source?.description_ru ||
  source?.description_en ||
  source?.description;
```
