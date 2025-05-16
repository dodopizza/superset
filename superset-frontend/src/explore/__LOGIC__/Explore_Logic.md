# Документация по DODO-специфичным компонентам и функциям в Explore

## Содержание

1. [Введение](#введение)
2. [Компоненты условного форматирования](#компоненты-условного-форматирования)
   - [ConditionalFormattingControlDodo](#conditionalformattingcontroldodo)
   - [ConditionalFormattingControlNoGradient](#conditionalformattingcontrolgradient)
   - [ConditionalFormattingMessageControl](#conditionalformattingmessagecontrol)
3. [Компоненты выбора цвета](#компоненты-выбора-цвета)
   - [ColorPickerControlDodo](#colorpickercontroldodo)
4. [Форматирование дат и времени](#форматирование-дат-и-времени)
   - [Константы форматирования](#константы-форматирования)
   - [Утилиты для работы с датами](#утилиты-для-работы-с-датами)
   - [Компоненты выбора дат](#компоненты-выбора-дат)
5. [Прочие модификации](#прочие-модификации)

## Введение

Данный документ содержит информацию о компонентах и функциях, которые были добавлены или модифицированы командой DODO в директории `explore` проекта Superset. Каждая модификация помечена идентификатором изменения (например, "DODO 45525377").

## Компоненты условного форматирования

### ConditionalFormattingControlDodo

**Описание**: Модифицированная версия компонента условного форматирования с расширенными возможностями.

**DODO-модификации**:

- **45525377**: Создан компонент с улучшенным интерфейсом и дополнительными возможностями

**Ключевые файлы**:

- `superset-frontend/src/DodoExtensions/explore/components/controls/ConditionalFormattingControlDodo/ConditionalFormattingControlDodo.tsx`
- `superset-frontend/src/DodoExtensions/explore/components/controls/ConditionalFormattingControlDodo/FormattingPopoverDodo.tsx`
- `superset-frontend/src/DodoExtensions/explore/components/controls/ConditionalFormattingControlDodo/FormattingPopoverContentDodo.tsx`

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

### ConditionalFormattingControlNoGradient

**Описание**: Версия компонента условного форматирования без градиентной заливки.

**DODO-модификации**:

- **45525377**: Создан компонент для условного форматирования без градиентной заливки

**Ключевые файлы**:

- `superset-frontend/src/DodoExtensions/explore/components/controls/ConditionalFormattingControlNoGradient/ConditionalFormattingControlNoGradient.tsx`
- `superset-frontend/src/DodoExtensions/explore/components/controls/ConditionalFormattingControlNoGradient/FormattingPopoverContentNoGradient.tsx`

### ConditionalFormattingMessageControl

**Описание**: Компонент условного форматирования с возможностью добавления сообщений.

**DODO-модификации**:

- **45525377**: Создан компонент для условного форматирования с сообщениями

**Ключевые файлы**:

- `superset-frontend/src/DodoExtensions/explore/components/controls/ConditionalFormattingMessageControl/ConditionalFormattingMessageControl.tsx`
- `superset-frontend/src/DodoExtensions/explore/components/controls/ConditionalFormattingMessageControl/FormattingPopoverContentMessage.tsx`

**Пример кода**:

```typescript
const createLabel = ({
  column,
  operator,
  targetValue,
  targetValueLeft,
  targetValueRight,
  messageRU,
  messageEN,
}: ConditionalFormattingConfig & {
  messageEN?: string;
  messageRU?: string;
}) => {
  const columnName = column;
  const message = (messageEN ?? messageRU)?.substring(0, 20) ?? '';
  switch (operator) {
    case Comparator.None:
      return `${columnName}`;
    case Comparator.Between:
      return `${targetValueLeft} ${Comparator.LessThan} ${columnName} ${Comparator.LessThan} ${targetValueRight} ${message}`;
    // ...
  }
};
```

### ConditionalFormattingControlDodoWrapper

**Описание**: Базовый компонент-обертка для всех компонентов условного форматирования.

**DODO-модификации**:

- **45525377**: Создан компонент-обертка для переиспользования логики условного форматирования

**Ключевые файлы**:

- `superset-frontend/src/DodoExtensions/explore/components/controls/ConditionalFormattingControlDodoWrapper/ConditionalFormattingControlDodoWrapper.tsx`
- `superset-frontend/src/DodoExtensions/explore/components/controls/ConditionalFormattingControlDodoWrapper/FormattingPopoverContentDodoWrapper.tsx`
- `superset-frontend/src/DodoExtensions/explore/components/controls/ConditionalFormattingControlDodoWrapper/FormattingPopoverWrapper.tsx`
- `superset-frontend/src/DodoExtensions/explore/components/controls/ConditionalFormattingControlDodoWrapper/types.ts`

**Пример кода**:

```typescript
const ConditionalFormattingControlDodoWrapper = ({
  value,
  onChange,
  columnOptions,
  verboseMap,
  removeIrrelevantConditions,
  renderExistLine,
  renderAddPopover,
  ...props
}: ConditionalFormattingControlWrapperDodoProps) => {
  const [conditionalFormattingConfigs, setConditionalFormattingConfigs] =
    useState<ConditionalFormattingConfig[]>(value ?? []);

  useEffect(() => {
    if (onChange) {
      onChange(conditionalFormattingConfigs);
    }
  }, [conditionalFormattingConfigs, onChange]);
  // ...
};
```

## Компоненты выбора цвета

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

  renderPopover() {
    const presetColors = getCategoricalSchemeRegistry()
      .get()
      .colors.filter((s, i) => i < 7);
    return (
      <div id="filter-popover" className="color-popover">
        <SketchPicker
          color={this.props.value}
          onChange={this.onChange}
          presetColors={presetColors}
        />
      </div>
    );
  }
  // ...
}
```

## Форматирование дат и времени

### Константы форматирования

**DODO-модификации**:

- **44211759**: Добавлены константы для форматирования дат в формате DD-MM-YYYY HH:mm:ss

**Ключевые файлы**:

- `superset-frontend/src/explore/constants.ts`
- `superset-frontend/packages/superset-ui-core/src/DodoExtensions/time-format/constants.ts`

**Пример кода**:

```typescript
export const MOMENT_FORMAT = 'YYYY-MM-DD[T]HH:mm:ss';
export const MOMENT_FORMAT_UI_DODO = 'DD-MM-YYYY HH:mm:ss';
```

### Утилиты для работы с датами

**DODO-модификации**:

- **44211759**: Добавлены утилиты для работы с датами
- **44136746**: Добавлена функция форматирования длительности в формате H:MM:SS

**Ключевые файлы**:

- `superset-frontend/packages/superset-ui-core/src/DodoExtensions/time-format/utils/dttmToMoment.ts`
- `superset-frontend/src/DodoExtensions/utils/formatDurationHMMSS.ts`

**Пример кода**:

```typescript
export const dttmToMoment = (dttm: string): Moment => {
  if (dttm === 'now') {
    return moment().utc().startOf('second');
  }
  if (dttm === 'today') {
    return moment().utc().startOf('day');
  }
  return moment(dttm);
};

export const formatDurationHMMSS = (milliSeconds: number): string => {
  const totalSeconds = Math.floor(milliSeconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;
};
```

### Компоненты выбора дат

**DODO-модификации**:

- **44211759**: Модифицирован компонент выбора дат для поддержки формата DD-MM-YYYY HH:mm:ss
- **44611022**: Добавлена локализация для опций выбора дат

**Ключевые файлы**:

- `superset-frontend/src/explore/components/controls/DateFilterControl/components/CustomFrame.tsx`
- `superset-frontend/src/explore/components/controls/DateFilterControl/types.ts`

**Пример кода**:

```typescript
<DatePicker
  // showTime
  showTime={withTime} // DODO changed 44211759
  format={withTime ? MOMENT_FORMAT_UI_DODO : 'DD-MM-YYYY'} // DODO added 44211759
  defaultValue={dttmToMoment(sinceDatetime)}
  // onChange={(datetime: Moment) =>
  //   onChange('sinceDatetime', datetime.format(MOMENT_FORMAT))
  // }
  // DODO changed 44211759
  onChange={(datetime: Moment) => {
    onChange('sinceDatetime', datetime.format(MOMENT_FORMAT));
  }}
  allowClear={false}
  locale={datePickerLocale}
/>
```

## Прочие модификации

### Интеграция компонентов в основной код

**DODO-модификации**:

- **45525377**: Добавлены импорты DODO-специфичных компонентов в основной код

**Ключевые файлы**:

- `superset-frontend/src/explore/components/controls/index.js`

**Пример кода**:

```javascript
import ConditionalFormattingControlDodo from 'src/DodoExtensions/explore/components/controls/ConditionalFormattingControlDodo'; // DODO added 45525377
import ConditionalFormattingControlNoGradient from 'src/DodoExtensions/explore/components/controls/ConditionalFormattingControlNoGradient'; // DODO added 45525377
import ConditionalFormattingMessageControl from 'src/DodoExtensions/explore/components/controls/ConditionalFormattingMessageControl'; // DODO added 45525377
```

### Форматирование для умных дат

**DODO-модификации**:

- **45525377**: Добавлен новый формат для умных дат с точкой (DD.MM.YYYY)

**Ключевые файлы**:

- `superset-frontend/packages/superset-ui-core/src/time-format/formatters/smartDate.ts`

**Пример кода**:

```typescript
export const SMART_DATE_ID = 'smart_date';
export const SMART_DATE_DOT_DDMMYYYY_ID = 'smart_date_dot_ddmmyyyy'; // DODO added 45525377
```
