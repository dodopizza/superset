# Документация по DODO-специфичным компонентам и функциям в DataMask

## Содержание

1. [Введение](#введение)
2. [Основные компоненты](#основные-компоненты)
   - [Reducer](#reducer)
   - [Actions](#actions)
3. [Интеграция с наборами фильтров](#интеграция-с-наборами-фильтров)
4. [Локализация](#локализация)
5. [Прочие модификации](#прочие-модификации)

## Введение

Данный документ содержит информацию о компонентах и функциях, которые были добавлены или модифицированы командой DODO в директории `dataMask` проекта Superset. Каждая модификация помечена идентификатором изменения (например, "DODO 44211751").

Директория `dataMask` содержит код для управления состоянием масок данных, которые используются для фильтрации данных в дашбордах и визуализациях.

## Основные компоненты

### Reducer

**Описание**: Редьюсер для управления состоянием масок данных.

**Ключевые файлы**:
- `superset-frontend/src/dataMask/reducer.ts`

**Пример кода**:
```typescript
export function getInitialDataMask(
  id?: string | number,
  moreProps?: DataMask,
): DataMask;
export function getInitialDataMask(
  id: string | number,
  moreProps: DataMask = {},
): DataMaskWithId {
  let otherProps = {};
  if (id) {
    otherProps = {
      id,
    };
  }
  return {
    ...otherProps,
    extraFormData: {},
    filterState: {},
    ownState: {},
    ...moreProps,
  } as DataMaskWithId;
}

function fillNativeFilters(
  filterConfig: FilterConfiguration,
  mergedDataMask: DataMaskStateWithId,
  draftDataMask: DataMaskStateWithId,
  initialDataMask?: DataMaskStateWithId,
  currentFilters?: Filters,
) {
  filterConfig.forEach((filter: Filter) => {
    const dataMask = initialDataMask || {};
    mergedDataMask[filter.id] = {
      ...getInitialDataMask(filter.id), // take initial data
      ...filter.defaultDataMask, // if something new came from BE - take it
      ...dataMask[filter.id],
    };
    if (
      currentFilters &&
      !areObjectsEqual(
        filter.defaultDataMask,
        currentFilters[filter.id]?.defaultDataMask,
        { ignoreUndefined: true },
      )
    ) {
      mergedDataMask[filter.id] = {
        ...mergedDataMask[filter.id],
        ...filter.defaultDataMask,
      };
    }
  });
}
```

### Actions

**Описание**: Действия для управления состоянием масок данных.

**Ключевые файлы**:
- `superset-frontend/src/dataMask/actions.ts`

**Пример кода**:
```typescript
export const CLEAR_DATA_MASK_STATE = 'CLEAR_DATA_MASK_STATE';
export interface ClearDataMaskState {
  type: typeof CLEAR_DATA_MASK_STATE;
}

export const UPDATE_DATA_MASK = 'UPDATE_DATA_MASK';
export interface UpdateDataMask {
  type: typeof UPDATE_DATA_MASK;
  filterId: string | number;
  dataMask: DataMask;
}

export function updateDataMask(
  filterId: string | number,
  dataMask: DataMask,
): UpdateDataMask {
  return {
    type: UPDATE_DATA_MASK,
    filterId,
    dataMask,
  };
}

export function clearDataMask(filterId: string | number) {
  return updateDataMask(filterId, getInitialDataMask(filterId));
}

export function clearDataMaskState(): ClearDataMaskState {
  return {
    type: CLEAR_DATA_MASK_STATE,
  };
}
```

## Интеграция с наборами фильтров

**Описание**: Интеграция с наборами фильтров (FilterSets) для сохранения и восстановления состояния фильтров.

**DODO-модификации**:
- **44211751**: Добавлены типы и интерфейсы для работы с наборами фильтров

**Ключевые файлы**:
- `superset-frontend/packages/superset-ui-core/src/query/types/Dashboard.ts`
- `superset-frontend/src/DodoExtensions/FilterSets/types.ts`

**Пример кода**:
```typescript
// DODO added start 44211751
type FilterSetDodoExtended = {
  isPrimary: boolean;
};

export type FilterSet = {
  id: number;
  name: string;
  nativeFilters: Filters;
  dataMask: DataMaskStateWithId;
} & FilterSetDodoExtended;

export type FilterSets = {
  [filtersSetId: string]: FilterSet;
};
// DODO added stop 44211751
```

**Интеграция с компонентами FilterSets**:
```typescript
export type FilterSetFullData = {
  changed_by_fk: string | null;
  changed_on: string | null;
  created_by_fk: string | null;
  created_on: string | null;
  id: number;
  dashboard_id: number;
  description: string | null;
  name: string;
  owner_id: number;
  owner_type: string;
  params: { nativeFilters: Filters; dataMask: DataMaskStateWithId };
  is_primary: boolean;
};
```

## Локализация

**Описание**: Поддержка локализации для масок данных и фильтров.

**DODO-модификации**:
- **44211759**: Добавлены поля для поддержки локализации фильтров

**Ключевые файлы**:
- `superset-frontend/packages/superset-ui-core/src/query/types/Dashboard.ts`

**Пример кода**:
```typescript
type FilterDodoExtended = {
  nameRu?: string; // DODO added 44211759
  selectTopValue?: number; // DODO added 44211759
};
```

## Прочие модификации

### Интеграция с мокированными данными

**Описание**: Мокированные данные для тестирования масок данных.

**Ключевые файлы**:
- `superset-frontend/src/dashboard/fixtures/mockNativeFilters.ts`

**Пример кода**:
```typescript
// DODO was here
import {
  DataMaskStateWithId,
  NativeFiltersState,
  NativeFilterType,
} from '@superset-ui/core';

export const mockDataMaskInfo: DataMaskStateWithId = {
  DefaultsID: {
    id: 'DefaultId',
    ownState: {},
    filterState: {
      value: [],
    },
  },
};
```

### Интеграция с аннотациями

**Описание**: Интеграция с аннотациями для отображения оповещений.

**DODO-модификации**:
- **44611022**: Созданы функции для работы с аннотациями и оповещениями

**Ключевые файлы**:
- `superset-frontend/src/DodoExtensions/utils/annotationUtils.ts`

**Пример кода**:
```typescript
// DODO was here
// DODO created 44611022
import {
  getAnnotationLayersData,
  getSingleAnnotationData,
  getSingleAnnotationLayerIdsData,
} from '../../Superstructure/Root/utils';
import {
  AnnotationLayer,
  InitializedResponse,
  SingleAnnotation,
} from '../../Superstructure/types/global';

type AnnotationsRequestDto = Array<
  InitializedResponse<{ result: SingleAnnotation } | null>
>;

const ALERT_PREFIX = '[ALERT]';
```
