# Документация по исследованию данных (Explore) в DODO

## Содержание

1. [Введение](#введение)
2. [Архитектура](#архитектура)
3. [Стандартная функциональность](#стандартная-функциональность)
4. [DODO-специфичная функциональность](#dodo-специфичная-функциональность)
5. [Техническая реализация](#техническая-реализация)
6. [Примеры использования](#примеры-использования)

## Введение

Модуль `explore` предоставляет функциональность для исследования данных и создания визуализаций в Superset. Этот модуль позволяет пользователям выбирать источники данных, настраивать параметры визуализации и создавать графики и диаграммы.

В DODO этот модуль расширен для поддержки локализации и дополнительных возможностей форматирования, что делает его более удобным для пользователей.

## Архитектура

Модуль `explore` организован следующим образом:

1. **API** (`api.py`):
   - `ExploreRestApi` - REST API для работы с исследованием данных
   - Предоставляет эндпоинты для получения данных и метаданных

2. **Схемы** (`schemas.py`):
   - Схемы для валидации запросов и сериализации ответов
   - Определяют структуру данных для API

3. **Утилиты** (`utils.py`):
   - Вспомогательные функции для работы с исследованием данных
   - Функции для обработки данных и параметров

4. **Исключения** (`exceptions.py`):
   - Исключения, специфичные для модуля `explore`
   - Обработка ошибок при исследовании данных

5. **Подмодули**:
   - `form_data` - для работы с данными формы
   - `permalink` - для работы с постоянными ссылками

## Стандартная функциональность

Стандартная функциональность модуля `explore` включает:

1. **Исследование данных**:
   - Выбор источников данных
   - Настройка параметров визуализации
   - Создание графиков и диаграмм

2. **Работа с данными формы**:
   - Валидация данных формы
   - Обработка данных формы
   - Сохранение и загрузка данных формы

3. **Постоянные ссылки**:
   - Создание постоянных ссылок на визуализации
   - Загрузка визуализаций по постоянным ссылкам

4. **Экспорт данных**:
   - Экспорт данных в различных форматах
   - Экспорт визуализаций в виде изображений

## DODO-специфичная функциональность

В DODO модуль `explore` был расширен для поддержки локализации и дополнительных возможностей форматирования. Основные DODO-специфичные изменения:

1. **Расширение функциональности для экспорта данных**:
   - Добавлена поддержка экспорта данных в формате XLSX
   - Добавлено в рамках задачи #44611022

   ```javascript
   import FileSaver from 'file-saver'; // DODO added 44611022
   import {
     API_HANDLER, // DODO added 44611022
     buildQueryContext,
     ensureIsArray,
     getChartBuildQueryRegistry,
     getChartMetadataRegistry,
     SupersetClient,
   } from '@superset-ui/core';
   ```

2. **Компоненты условного форматирования**:
   - Добавлены компоненты для условного форматирования данных
   - Добавлены в рамках задачи #45525377

   ```javascript
   import ConditionalFormattingControlDodo from 'src/DodoExtensions/explore/components/controls/ConditionalFormattingControlDodo'; // DODO added 45525377
   import ConditionalFormattingControlNoGradient from 'src/DodoExtensions/explore/components/controls/ConditionalFormattingControlNoGradient'; // DODO added 45525377
   import ConditionalFormattingMessageControl from 'src/DodoExtensions/explore/components/controls/ConditionalFormattingMessageControl'; // DODO added 45525377
   ```

3. **Компоненты выбора цвета**:
   - Модифицированная версия компонента выбора цвета с улучшенным интерфейсом
   - Добавлены в рамках задачи #45525377

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
   }
   ```

4. **Форматирование для умных дат**:
   - Добавлен новый формат для умных дат с точкой (DD.MM.YYYY)
   - Добавлено в рамках задачи #45525377

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
   ```

Эти изменения делают модуль `explore` более удобным для пользователей DODO, добавляя поддержку локализации и дополнительные возможности форматирования.

## Техническая реализация

### ExploreRestApi

REST API для работы с исследованием данных:

```python
class ExploreRestApi(BaseSupersetApi):
    allow_browser_login = True
    class_permission_name = "Explore"
    resource_name = "explore"
    openapi_spec_tag = "Explore"

    @expose("/form_data", methods=("GET",))
    @protect()
    @safe
    @statsd_metrics
    @event_logger.log_this_with_context(
        action=lambda self, *args, **kwargs: f"{self.__class__.__name__}.form_data",
        log_to_statsd=False,
    )
    def form_data(self) -> Response:
        """
        Get the form data for an existing chart.
        ---
        get:
          summary: Get chart form data
          description: >-
            Get the form data for an existing chart.
          parameters:
          - in: query
            name: slice_id
            description: The id of the chart to get
            schema:
              type: integer
          responses:
            200:
              description: The chart form data
              content:
                application/json:
                  schema:
                    type: object
            400:
              $ref: '#/components/responses/400'
            401:
              $ref: '#/components/responses/401'
            500:
              $ref: '#/components/responses/500'
        """
        form_data = get_form_data()[0]
        result = {
            "form_data": form_data,
        }
        return self.json_response(result)
```

### Компоненты условного форматирования

Компонент `ConditionalFormattingControlDodo` для условного форматирования данных:

```jsx
import { t, useTheme } from '@superset-ui/core';
import { Comparator } from '@superset-ui/chart-controls';
import {
  ConditionalFormattingConfig,
  ConditionalFormattingControlProps,
} from 'src/explore/components/controls/ConditionalFormattingControl';
import {
  AddControlLabel,
  CaretContainer,
  Label,
  OptionControlContainer,
} from 'src/explore/components/controls/OptionControls';
import {
  CloseButton,
  FormatterContainer,
} from 'src/explore/components/controls/ConditionalFormattingControl/ConditionalFormattingControl';
import ConditionalFormattingControlDodoWrapper from '../ConditionalFormattingControlDodoWrapper/ConditionalFormattingControlDodoWrapper';
import {
  RenderAddPopover,
  RenderExistLine,
} from '../ConditionalFormattingControlDodoWrapper/types';
import { FormattingPopoverDodo } from './FormattingPopoverDodo';

const ConditionalFormattingControlDodo = ({
  value,
  onChange,
  columnOptions,
  emitFilter,
  ...props
}: ConditionalFormattingControlProps) => {
  const theme = useTheme();
  const [values, setValues] = useState<ConditionalFormattingConfig[]>(
    ensureIsArray(value),
  );

  useEffect(() => {
    setValues(ensureIsArray(value));
  }, [value]);

  const onChangeHandler = useCallback(
    (newValues: ConditionalFormattingConfig[]) => {
      setValues(newValues);
      onChange(newValues);
    },
    [onChange],
  );

  const onDelete = useCallback(
    (index: number) => {
      const newValues = [...values];
      newValues.splice(index, 1);
      onChangeHandler(newValues);
    },
    [onChangeHandler, values],
  );

  const onSave = useCallback(
    (config: ConditionalFormattingConfig, index: number) => {
      const newValues = [...values];
      newValues[index] = config;
      onChangeHandler(newValues);
    },
    [onChangeHandler, values],
  );

  const onAdd = useCallback(
    (config: ConditionalFormattingConfig) => {
      const newValues = [...values, config];
      onChangeHandler(newValues);
    },
    [onChangeHandler, values],
  );

  const createLabel = useCallback(
    (config: ConditionalFormattingConfig) => {
      const column = columnOptions.find(
        option => option.value === config.column,
      );
      const comparator = Comparator[config.operator as keyof typeof Comparator];
      return `${column?.label || ''} ${comparator} ${config.targetValue}`;
    },
    [columnOptions],
  );

  const renderExistLine: RenderExistLine = useCallback(
    ({ index, onEdit, onDelete, config }) => (
      <FormatterContainer key={index}>
        <div>
          <CaretContainer>
            <div role="button" tabIndex={0} onClick={() => onEdit(config, index)}>
              <Label>{createLabel(config)}</Label>
            </div>
          </CaretContainer>
        </div>
        <CloseButton onClick={() => onDelete(index)}>
          <Icons.XSmall iconColor={theme.colors.grayscale.base} />
        </CloseButton>
      </FormatterContainer>
    ),
    [createLabel, theme.colors.grayscale.base],
  );

  const renderAddPopover: RenderAddPopover = useCallback(
    ({ createNewFormatter, onCreate }) => (
      <FormattingPopoverDodo
        columns={columnOptions}
        onChange={value => createNewFormatter(value)}
        onClose={onCreate}
      />
    ),
    [columnOptions],
  );

  return (
    <ConditionalFormattingControlDodoWrapper
      title={t('Conditional formatting')}
      description={t(
        'Apply conditional color formatting to metrics based on their values',
      )}
      values={values}
      onDelete={onDelete}
      onSave={onSave}
      onAdd={onAdd}
      createLabel={createLabel}
      columnOptions={columnOptions}
      renderExistLine={renderExistLine}
      renderAddPopover={renderAddPopover}
      {...props}
    />
  );
};

export default ConditionalFormattingControlDodo;
```

### Компонент выбора цвета

Компонент `ColorPickerControlDodo` для выбора цвета:

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

  render() {
    const { disabled } = this.props;
    return (
      <div>
        <ControlHeader {...this.props} />
        <Popover
          trigger="click"
          placement="right"
          content={this.renderPopover()}
          overlayClassName="color-popover-wrapper"
          disabled={disabled}
        >
          <div
            className="ColorPickerControlDodo"
            style={{
              backgroundColor: disabled ? '#ccc' : this.props.value,
              cursor: disabled ? 'not-allowed' : 'pointer',
            }}
          />
        </Popover>
      </div>
    );
  }
}
```

## Примеры использования

### Получение данных формы

```python
from superset.views.utils import get_form_data

# Получение данных формы
form_data, slc = get_form_data()

# Вывод данных формы
print(f"Form data: {form_data}")
print(f"Slice: {slc}")
```

### Использование компонентов условного форматирования

```jsx
import ConditionalFormattingControlDodo from 'src/DodoExtensions/explore/components/controls/ConditionalFormattingControlDodo';

// Использование компонента условного форматирования
const MyComponent = () => {
  const [value, setValue] = useState([]);
  const columnOptions = [
    { value: 'sales', label: 'Sales' },
    { value: 'profit', label: 'Profit' },
    { value: 'quantity', label: 'Quantity' },
  ];

  return (
    <ConditionalFormattingControlDodo
      value={value}
      onChange={setValue}
      columnOptions={columnOptions}
    />
  );
};
```

### Использование компонента выбора цвета

```jsx
import ColorPickerControlDodo from 'src/DodoExtensions/explore/components/controls/ColorPickerControlDodo';

// Использование компонента выбора цвета
const MyComponent = () => {
  const [color, setColor] = useState({ r: 255, g: 0, b: 0, a: 1 });

  return (
    <ColorPickerControlDodo
      value={color}
      onChange={setColor}
      isHex={false}
    />
  );
};
```

### Экспорт данных в формате XLSX

```javascript
import { exportChart } from 'src/explore/exploreUtils';

// Экспорт данных в формате XLSX
exportChart({
  formData,
  resultType: 'xlsx',
  resultFormat: 'xlsx',
  force: false,
  ownState: {},
});
```
