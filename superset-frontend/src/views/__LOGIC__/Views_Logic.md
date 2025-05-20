# Документация по DODO-специфичным компонентам и функциям в Views

## Содержание

1. [Введение](#введение)
2. [CRUD компоненты](#crud-компоненты)
   - [Типы и интерфейсы](#типы-и-интерфейсы)
   - [Утилиты](#утилиты)
3. [Компоненты дашбордов](#компоненты-дашбордов)
   - [DashboardHeader](#dashboardheader)
   - [DashboardComponent](#dashboardcomponent)
4. [Локализация](#локализация)
5. [Интеграция с onBoarding](#интеграция-с-onboarding)
6. [Прочие модификации](#прочие-модификации)

## Введение

Данный документ содержит информацию о компонентах и функциях, которые были добавлены или модифицированы командой DODO в директории `views` проекта Superset. Каждая модификация помечена идентификатором изменения (например, "DODO 44120742").

## CRUD компоненты

### Типы и интерфейсы

**Описание**: Расширенные типы и интерфейсы для CRUD компонентов.

**DODO-модификации**:

- **44120742**: Добавлены поля для поддержки локализации заголовков дашбордов

**Ключевые файлы**:

- `superset-frontend/src/views/CRUD/types.ts`
- `superset-frontend/src/types/Dashboard.ts`

**Пример кода**:

```typescript
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

### Утилиты

**Описание**: Утилиты для работы с CRUD компонентами.

**DODO-модификации**:

- **44211759**: Добавлен интерфейс `IExtra` для дополнительных полей

**Ключевые файлы**:

- `superset-frontend/src/views/CRUD/utils.tsx`

**Пример кода**:

```typescript
// DODO added 44211759
interface IExtra {
  email: string;
  country_name: string;
}
```

## Компоненты дашбордов

### DashboardHeader

**Описание**: Компонент заголовка дашборда.

**DODO-модификации**:

- **44120742**: Добавлена поддержка локализации заголовков дашбордов

**Ключевые файлы**:

- `superset-frontend/src/dashboard/containers/DashboardHeader.jsx`
- `superset-frontend/src/dashboard/components/Header/types.ts`

**Пример кода**:

```typescript
interface HeaderDropdownPropsDodoExtended {
  dashboardTitleRU: string; // DODO added 44120742
}
```

### DashboardComponent

**Описание**: Компонент для отображения элементов дашборда.

**DODO-модификации**:

- **44120742**: Добавлен импорт bootstrapData для поддержки локализации

**Ключевые файлы**:

- `superset-frontend/src/dashboard/containers/DashboardComponent.jsx`

**Пример кода**:

```javascript
import { bootstrapData } from 'src/preamble'; // DODO added 44120742
```

## Локализация

**Описание**: Добавлена поддержка локализации для компонентов в директории views.

**DODO-модификации**:

- **44120742**: Добавлена поддержка локализации заголовков дашбордов
- **44611022**: Добавлена настройка локали по умолчанию (русский язык)

**Ключевые файлы**:

- `superset-frontend/src/components/CronPicker/CronPicker.tsx` - локализация компонента выбора расписания
- `superset-frontend/src/preamble.ts` - настройка локали по умолчанию

**Пример кода**:

```typescript
export const LOCALE: Locale = {
  everyText: t('every'),
  emptyMonths: t('every month'),
  emptyMonthDays: t('every day of the month'),
  emptyMonthDaysShort: t('day of the month'),
  emptyWeekDays: t('every day of the week'),
  emptyWeekDaysShort: t('day of the week'),
  emptyHours: t('every hour'),
  emptyMinutes: t('every minute'),
  emptyMinutesForHourPeriod: t('every'),
  yearOption: t('year'),
  monthOption: t('month'),
  weekOption: t('week'),
  dayOption: t('day'),
  hourOption: t('hour'),
  minuteOption: t('minute'),
  rebootOption: t('reboot'),
  prefixPeriod: t('Every'),
  prefixMonths: t('in'),
  prefixMonthDays: t('on'),
  prefixWeekDays: t('on'),
  prefixWeekDaysForMonthAndYearPeriod: t('or'),
  prefixHours: t('at'),
  prefixMinutes: t(':'),
  prefixMinutesForHourPeriod: t('at'),
};
```

## Интеграция с onBoarding

**Описание**: Интеграция с системой onBoarding для новых пользователей.

**DODO-модификации**:

- **44211792**: Добавлены слайсы для системы onBoarding в хранилище Redux

**Ключевые файлы**:

- `superset-frontend/src/views/store.ts`

**Пример кода**:

```typescript
// DODO added start 44211792
import {
  onboardingRequestListSlice,
  onboardingRequestSlice,
  onboardingStartSlice,
  onboardingTeamListSlice,
  onboardingTeamSearchSlice,
} from '../DodoExtensions/onBoarding';
import { onboardingTeamPageSlice } from '../DodoExtensions/onBoarding/model/slices/teamPage.slice';
import { onboardingTeamCreateSlice } from '../DodoExtensions/onBoarding/model/slices/teamCreate.slice';
import { onboardingUserSearchSlice } from '../DodoExtensions/onBoarding/model/slices/userSearch.slice';
import { onboardingTeamAddUserSlice } from '../DodoExtensions/onBoarding/model/slices/teamAddUser.slice';
```

## Прочие модификации

### Условное форматирование

**Описание**: Компоненты для условного форматирования в визуализациях.

**DODO-модификации**:

- **45525377**: Созданы компоненты для условного форматирования

**Ключевые файлы**:

- `superset-frontend/src/DodoExtensions/explore/components/controls/ConditionalFormattingControlDodo/ConditionalFormattingControlDodo.tsx`
- `superset-frontend/src/DodoExtensions/explore/components/controls/ConditionalFormattingControlDodo/FormattingPopoverDodo.tsx`

**Пример кода**:

```typescript
const renderExistLine: RenderExistLine = ({
  index,
  onEdit,
  onDelete,
  config,
  columnOptions,
}) => (
  <FormatterContainer key={index}>
    <CloseButton onClick={() => onDelete(index)}>
      <Icons.XSmall iconColor={theme.colors.grayscale.light1} />
    </CloseButton>
    <FormattingPopoverDodo
      title={t('Edit formatter')}
      config={config}
      columns={columnOptions}
      onChange={(newConfig: ConditionalFormattingConfig) =>
        onEdit(newConfig, index)
      }
      destroyTooltipOnHide
    >
      <OptionControlContainer withCaret>
        <Label>{createLabel(config)}</Label>
        <CaretContainer>
          <Icons.CaretRight iconColor={theme.colors.grayscale.light1} />
        </CaretContainer>
      </OptionControlContainer>
    </FormattingPopoverDodo>
  </FormatterContainer>
);
```

### ColorPickerControlDodo

**Описание**: Модифицированная версия компонента выбора цвета с улучшенным интерфейсом.

**DODO-модификации**:

- **45525377**: Изменены стили относительно оригинального компонента, убрана фиксированная ширина и высота

**Ключевые файлы**:

- `superset-frontend/src/DodoExtensions/explore/components/controls/ColorPickerControlDodo.jsx`

**Пример кода**:

```jsx
export default class ColorPickerControlDodo extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(col) {
    // DODO changed
    this.props.onChange(this.props.isHex ? col.hex : col.rgb);
  }
}
```
