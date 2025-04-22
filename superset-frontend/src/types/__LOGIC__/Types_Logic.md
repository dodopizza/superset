# Документация по типам и интерфейсам в Types

## Содержание

1. [Введение](#введение)
2. [Типы для дашбордов](#типы-для-дашбордов)
   - [Dashboard](#dashboard)
   - [DashboardInfo](#dashboardinfo)
3. [Типы для пользователей](#типы-для-пользователей)
   - [Owner](#owner)
   - [User](#user)
4. [Типы для компонентов](#типы-для-компонентов)
   - [Header](#header)
   - [Chart](#chart)
5. [Типы для данных](#типы-для-данных)
   - [Dataset](#dataset)
   - [DataMask](#datamask)
6. [Интеграция с DODO](#интеграция-с-dodo)

## Введение

Директория `types` содержит типы и интерфейсы, используемые в различных частях приложения Superset. Многие из этих типов были расширены командой DODO для поддержки дополнительной функциональности, такой как локализация и дополнительные метаданные.

## Типы для дашбордов

### Dashboard

**Описание**: Тип для представления дашборда.

**DODO-модификации**:
- **44120742**: Добавлено поле `dashboard_title_ru` для поддержки локализации заголовка дашборда

**Ключевые файлы**:
- `superset-frontend/src/types/Dashboard.ts`

**Пример кода**:
```typescript
// DODO was here
import Owner from './Owner';
import Role from './Role';

interface DashboardDodoExtended {
  dashboard_title_ru: string; // DODO added 44120742
}
export interface Dashboard extends DashboardDodoExtended {
  id: number;
  slug?: string | null;
  url: string;
  dashboard_title: string;
  thumbnail_url: string;
  published: boolean;
  css?: string | null;
  json_metadata?: string | null;
  position_json?: string | null;
  changed_by_name: string;
  changed_by: Owner;
  changed_on: string;
  charts: string[]; // just chart names, unfortunately...
  owners: Owner[];
  roles: Role[];
}
```

### DashboardInfo

**Описание**: Тип для представления информации о дашборде.

**Ключевые файлы**:
- `superset-frontend/src/dashboard/components/Header/types.ts`

**Пример кода**:
```typescript
interface DashboardInfo {
  id: number;
  userId: string | undefined;
  dash_edit_perm: boolean;
  dash_save_perm: boolean;
  metadata?: Record<string, any>;
  common?: { conf: Record<string, any> };
}
```

## Типы для пользователей

### Owner

**Описание**: Тип для представления владельца объекта.

**DODO-модификации**:
- **44211759**: Добавлены поля `email` и `country_name` для расширения информации о владельце

**Ключевые файлы**:
- `superset-frontend/src/types/Owner.ts`

**Пример кода**:
```typescript
// DODO was here

/**
 * The Owner model as returned from the API
 */

// DODO added 44211759
interface OwnerDodoExtened {
  email?: string;
  country_name?: string;
}
export default interface Owner extends OwnerDodoExtened {
  first_name?: string;
  id: number;
  last_name?: string;
  full_name?: string;
}
```

### User

**Описание**: Тип для представления пользователя.

**Ключевые файлы**:
- `superset-frontend/src/types/bootstrapTypes.ts`

**Пример кода**:
```typescript
export type User = {
  createdOn?: string;
  email?: string;
  firstName: string;
  isActive: boolean;
  isAnonymous: boolean;
  lastName: string;
  userId?: number; // optional because guest user doesn't have a user id
  username: string;
};

export type UserRoles = Record<string, [string, string][]>;
export interface PermissionsAndRoles {
  permissions: {
    database_access?: string[];
    datasource_access?: string[];
  };
  roles: UserRoles;
}

export type UserWithPermissionsAndRoles = User & PermissionsAndRoles;
```

## Типы для компонентов

### Header

**Описание**: Типы для компонентов заголовка дашборда.

**DODO-модификации**:
- **44120742**: Добавлено поле `dashboardTitleRU` для поддержки локализации заголовка дашборда

**Ключевые файлы**:
- `superset-frontend/src/dashboard/components/Header/types.ts`

**Пример кода**:
```typescript
interface HeaderDropdownPropsDodoExtended {
  dashboardTitleRU: string; // DODO added 44120742
}

interface HeaderPropsDodoExtended {
  dashboardTitleRU: string; // DODO added 44120742
}
```

### Chart

**Описание**: Типы для компонентов диаграмм.

**DODO-модификации**:
- **44136746**: Добавлено поле `extraFormData` для расширения данных формы

**Ключевые файлы**:
- `superset-frontend/src/explore/types.ts`

**Пример кода**:
```typescript
interface ChartStateDodoExtended {
  extraFormData?: PlainObject; // DODO added 44136746
}
```

## Типы для данных

### Dataset

**Описание**: Тип для представления набора данных.

**Ключевые файлы**:
- `superset-frontend/src/types/Dataset.ts`
- `superset-frontend/src/features/datasets/types.ts`

**Пример кода**:
```typescript
export default interface Dataset {
  changed_by_name: string;
  changed_by: string;
  changed_on_delta_humanized: string;
  database: {
    id: string;
    database_name: string;
  };
  kind: string;
  explore_url: string;
  id: number;
  owners: Array<Owner>;
  schema: string;
  table_name: string;
}
```

### DataMask

**Описание**: Типы для масок данных, используемых для фильтрации.

**DODO-модификации**:
- **44211751**: Добавлены типы для наборов фильтров (FilterSets)

**Ключевые файлы**:
- `superset-frontend/src/DodoExtensions/FilterSets/types.ts`

**Пример кода**:
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

## Интеграция с DODO

### Типы для локализации

**Описание**: Типы для поддержки локализации в DODO.

**DODO-модификации**:
- **44120742**: Добавлены поля для поддержки русского языка
- **45525377**: Добавлены типы для условного форматирования с поддержкой локализации

**Ключевые файлы**:
- `superset-frontend/src/types/Dashboard.ts`
- `superset-frontend/src/dashboard/types.ts`
- `superset-frontend/plugins/plugin-chart-echarts/src/DodoExtensions/BigNumber/types.ts`

**Пример кода**:
```typescript
type MetaDodoExtended = {
  sliceNameRU?: string; // DODO added 44120742
  sliceNameOverrideRU?: string; // DODO added 44120742
};
```

**Типы для условного форматирования**:
```typescript
export type ColorFormattersWithConditionalMessage = Array<{
  column: string;
  getColorFromValue: (value: number) => string | undefined;
  message?: string;
  messageRU?: string;
  messageEN?: string;
}>;
```

### Типы для компонентов DODO

**Описание**: Типы для специфичных компонентов DODO.

**DODO-модификации**:
- **45525377**: Добавлены типы для компонентов условного форматирования

**Ключевые файлы**:
- `superset-frontend/src/DodoExtensions/explore/components/controls/ConditionalFormattingControlDodoWrapper/types.ts`

**Пример кода**:
```typescript
type RenderExistLinParams = {
  index: number;
  onEdit: (newConfig: ConditionalFormattingConfig, index: number) => void;
  onDelete: (index: number) => void;
  config: ConditionalFormattingConfig;
  columnOptions: { label: string; value: string }[];
  createLabel: (config: ConditionalFormattingConfig) => string;
};

type RenderExistLine = (params: RenderExistLinParams) => JSX.Element;

type RenderAddPopover = (params: {
  onCreate: (config: ConditionalFormattingConfig) => void;
  columnOptions: { label: string; value: string }[];
}) => JSX.Element;
```

### Типы для onBoarding

**Описание**: Типы для системы onBoarding новых пользователей.

**Ключевые файлы**:
- `superset-frontend/src/DodoExtensions/onBoarding/types.ts`

**Пример кода**:
```typescript
export type OnBoardingStorageInfo = {
  theTimeOfTheLastShow?: Date;
  initialByUser?: boolean;
};

export enum Role {
  Readonly = 'readonly',
  CreateData = 'Create data',
  VizualizeData = 'Vizualize data',
  Unknown = 'Unknown',
}

export type Team = {
  label: string;
  value: string;
  roles: Array<Role>;
};

export type User = {
  label: string;
  value: number;
};

export enum UserFromEnum {
  Franchisee = 'Franchisee',
  ManagingCompany = 'Managing Company',
  Unknown = 'Unknown',
}
```
