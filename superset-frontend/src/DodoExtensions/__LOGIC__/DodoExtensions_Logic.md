# Документация по компонентам и функциям в DodoExtensions

## Содержание

1. [Введение](#введение)
2. [Компоненты визуализации](#компоненты-визуализации)
   - [BigNumber](#bignumber)
   - [BarDodo](#bardodo)
   - [BubbleDodo](#bubbledodo)
3. [Компоненты управления](#компоненты-управления)
   - [ConditionalFormattingControlDodo](#conditionalformattingcontroldodo)
   - [ColorPickerControlDodo](#colorpickercontroldodo)
4. [Система onBoarding](#система-onboarding)
   - [Компоненты onBoarding](#компоненты-onboarding)
   - [Хуки onBoarding](#хуки-onboarding)
   - [Модель данных onBoarding](#модель-данных-onboarding)
5. [Наборы фильтров (FilterSets)](#наборы-фильтров-filtersets)
6. [Общие компоненты](#общие-компоненты)
7. [Утилиты](#утилиты)

## Введение

Директория `DodoExtensions` содержит компоненты и функции, специфичные для DODO, которые расширяют функциональность Superset. Все компоненты и функции в этой директории были созданы командой DODO для решения конкретных задач и потребностей.

## Компоненты визуализации

### BigNumber

**Описание**: Расширение для компонента BigNumber с поддержкой условного форматирования.

**DODO-модификации**:
- **45525377**: Добавлена возможность условного форматирования для значения и процентного изменения
- Добавлена возможность отображения условных сообщений

**Ключевые файлы**:
- `plugins/plugin-chart-echarts/src/DodoExtensions/BigNumber/BigNumberViz.tsx`
- `plugins/plugin-chart-echarts/src/DodoExtensions/BigNumber/BigNumberWithTrendline/transformPropsDodo.ts`
- `plugins/plugin-chart-echarts/src/DodoExtensions/BigNumber/BigNumberTotal/controlPanelDodo.tsx`
- `plugins/plugin-chart-echarts/src/DodoExtensions/BigNumber/types.ts`
- `plugins/plugin-chart-echarts/src/DodoExtensions/BigNumber/controlPanelCommon.tsx`

**Пример кода**:
```typescript
const bigNumberVizGetColorDodo = (
  props: BigNumberVizProps,
  bigNumber?: DataRecordValue,
) => {
  const { colorThresholdFormatters, percentChange, percentChangeFormatter } =
    props;
  const hasThresholdColorFormatter =
    Array.isArray(colorThresholdFormatters) &&
    colorThresholdFormatters.length > 0;

  let numberColor;
  if (hasThresholdColorFormatter) {
    colorThresholdFormatters!.forEach(formatter => {
      if (typeof bigNumber === 'number') {
        numberColor = formatter.getColorFromValue(bigNumber);
      }
    });
  } else {
    numberColor = 'black';
  }
  // ...
}
```

### BarDodo

**Описание**: Модифицированная версия столбчатой диаграммы с дополнительными возможностями.

**DODO-модификации**:
- **45525377**: Создан компонент с расширенными возможностями форматирования и отображения

**Ключевые файлы**:
- `plugins/plugin-chart-echarts/src/DodoExtensions/BarDodo/index.ts`
- `plugins/plugin-chart-echarts/src/DodoExtensions/BarDodo/transformProps.ts`
- `plugins/plugin-chart-echarts/src/DodoExtensions/BarDodo/controlPanel.tsx`
- `plugins/plugin-chart-echarts/src/DodoExtensions/BarDodo/types.ts`

**Пример кода**:
```typescript
export default class EchartsBarChartPluginDodo extends ChartPlugin<
  EchartsBarFormData,
  EchartsBarChartProps
> {
  constructor() {
    super({
      buildQuery,
      controlPanel,
      loadChart: () => import('./EchartsBarChart'),
      metadata: new ChartMetadata({
        label: ChartLabel.Deprecated,
        behaviors: [Behavior.InteractiveChart],
        credits: ['https://echarts.apache.org'],
        description: 'Bar Chart (Apache ECharts) with D3 format support',
        name: t('Echarts Bar Chart'),
        exampleGallery: [],
        tags: [t('Popular'), t('ECharts'), t('DODOIS_friendly')],
        thumbnail,
      }),
      transformProps,
    });
  }
}
```

### BubbleDodo

**Описание**: Модифицированная версия пузырьковой диаграммы с дополнительными возможностями.

**DODO-модификации**:
- Добавлена возможность настройки отображения меток
- Добавлена возможность настройки размера и цвета пузырьков
- Добавлена возможность настройки логарифмической шкалы для осей

**Ключевые файлы**:
- `plugins/plugin-chart-echarts/src/DodoExtensions/Bubble/BubbleDodo.tsx`
- `plugins/plugin-chart-echarts/src/DodoExtensions/Bubble/index.ts`
- `plugins/plugin-chart-echarts/src/DodoExtensions/Bubble/types.ts`
- `plugins/plugin-chart-echarts/src/DodoExtensions/Bubble/transformProps.ts`
- `plugins/plugin-chart-echarts/src/DodoExtensions/Bubble/controlPanel.ts`

**Пример кода**:
```typescript
export default function BubbleDodo({
  height,
  width,
  dimensionList,
  data,
  showLabels,
  showDimension,
  marginTop,
  scrollDimensions,
  xAxisName,
  yAxisName,
  xLogScale,
  yLogScale,
  xNameLocation,
  xNameGap,
  yNameLocation,
  yNameGap,
  xAxisFormatter,
  yAxisFormatter,
  sizeFormatter,
  labelLocation,
  labelFontSize,
  labelColor,
  tooltipLabels,
  refs,
}: BubbleDodoComponentProps) {
  // ...
}
```

## Компоненты управления

### ConditionalFormattingControlDodo

**Описание**: Модифицированная версия компонента условного форматирования с расширенными возможностями.

**DODO-модификации**:
- **45525377**: Создан компонент с улучшенным интерфейсом и дополнительными возможностями

**Ключевые файлы**:
- `src/DodoExtensions/explore/components/controls/ConditionalFormattingControlDodo/ConditionalFormattingControlDodo.tsx`
- `src/DodoExtensions/explore/components/controls/ConditionalFormattingControlDodo/FormattingPopoverDodo.tsx`
- `src/DodoExtensions/explore/components/controls/ConditionalFormattingControlDodoWrapper/ConditionalFormattingControlDodoWrapper.tsx`

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
- `src/DodoExtensions/explore/components/controls/ColorPickerControlDodo.jsx`

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

## Система onBoarding

### Компоненты onBoarding

**Описание**: Компоненты для системы onBoarding новых пользователей.

**Ключевые файлы**:
- `src/DodoExtensions/onBoarding/onBoardingEntryPoint.tsx`
- `src/DodoExtensions/onBoarding/components/stepOnePopup/stepOnePopup.tsx`
- `src/DodoExtensions/onBoarding/components/stepTwoPopup/stepTwoPopup.tsx`
- `src/DodoExtensions/onBoarding/components/stepThreePopup/stepThreePopup.tsx`

**Пример кода**:
```typescript
const OnBoardingEntryPoint: FC = () => {
  const { step, toStepTwo, closeOnboarding, setStep2Passed, setStep3Passed } =
    useOnboarding();

  if (process.env.type !== undefined) {
    return null;
  }

  if (step === 1) {
    return <StepOnePopup onClose={closeOnboarding} onNextStep={toStepTwo} />;
  }
  if (step === 2) {
    return <StepTwoPopup onClose={closeOnboarding} onFinish={setStep2Passed} />;
  }
  if (step === 3) {
    return <StepThreePopup onClose={setStep3Passed} />;
  }

  return null;
};
```

### Хуки onBoarding

**Описание**: Хуки для управления процессом onBoarding.

**Ключевые файлы**:
- `src/DodoExtensions/onBoarding/hooks/useOnboarding.ts`
- `src/DodoExtensions/onBoarding/hooks/useHasUserTeam.ts`
- `src/DodoExtensions/onBoarding/hooks/useTeam.tsx`

**Пример кода**:
```typescript
export const useOnboarding = () => {
  const [step, setStep] = useState<number | null>(null);

  const step2PassedRef = useRef<null | boolean>();

  const dispatch = useDispatch();
  const isOnboardingFinished = useSelector(getIsOnboardingFinished);
  const onboardingStartedTime = useSelector(getOnboardingStartedTime);

  const storageInfo = getOnboardingStorageInfo();

  useEffect(() => {
    dispatch(initOnboarding());
  }, [dispatch]);

  // ...

  const closeOnboarding = useCallback(() => {
    updateStorageTimeOfTheLastShow();
    clearStorageInitialByUser();
    setStep(null);
  }, []);

  const toStepTwo = async (stepOneDto: StepOnePopupDto) => {
    dispatch(stepOneFinish(stepOneDto.DodoRole));
  };

  const setStep2Passed = useCallback(() => {
    step2PassedRef.current = true;
  }, []);

  // ...
}
```

### Модель данных onBoarding

**Описание**: Модель данных для системы onBoarding.

**Ключевые файлы**:
- `src/DodoExtensions/onBoarding/model/slices/onboardingStart.slice.ts`
- `src/DodoExtensions/onBoarding/model/types/start.types.ts`
- `src/DodoExtensions/onBoarding/model/types/teamPage.types.ts`
- `src/DodoExtensions/onBoarding/repository/getOnboarding.repository.ts`

**Пример кода**:
```typescript
export type OnboardingSuccessPayload = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  isOnboardingFinished: boolean;
  onboardingStartedTime: string | null;
};

export type OnboardingFinishSuccessPayload = {
  isOnboardingFinished: boolean;
};

export type OnboardingStepOneSuccessPayload = {
  onboardingStartedTime: string | null;
};
```

## Наборы фильтров (FilterSets)

**Описание**: Компоненты и функции для работы с наборами фильтров.

**DODO-модификации**:
- **44211751**: Добавлена поддержка наборов фильтров
- **44211759**: Добавлена поддержка локализации для наборов фильтров

**Ключевые файлы**:
- `src/DodoExtensions/FilterSets/index.tsx`
- `src/DodoExtensions/FilterSets/FiltersHeader.tsx`
- `src/DodoExtensions/FilterSets/utils/index.ts`
- `src/DodoExtensions/FilterSets/state.ts`
- `src/DodoExtensions/FilterSets/types.ts`

**Пример кода**:
```typescript
// DODO added start 44211759
const locale = bootstrapData?.common?.locale || 'en';
const localisedNameField = `name${locale === 'en' ? '' : 'Ru'}` as
  | 'name'
  | 'nameRu';
// DODO added stop 44211759

export const getFilterValueForDisplay = (
  value?: string[] | null | string | number | object,
  column?: string, // DODO added 44211759
): string => {
  if (value === null || value === undefined) {
    return '';
  }
  if (typeof value === 'string' || typeof value === 'number') {
    return `${value}`;
  }
  if (Array.isArray(value)) {
    // DODO added 44211759
    if (typeof value[0] === 'object' && column && column in value[0]) {
      return value.map(val => val[column]).join(', ');
    }
    return value.join(', ');
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return t('Unknown value');
};
```

## Общие компоненты

**Описание**: Общие компоненты, используемые в различных частях приложения.

**Ключевые файлы**:
- `src/DodoExtensions/Common/TitleWrapper.ts`
- `src/DodoExtensions/Common/TitleLabel.ts`
- `src/DodoExtensions/Common/StyledFlag.ts`
- `src/DodoExtensions/Common/StyledPencil.ts`
- `src/DodoExtensions/Common/LanguageIndicator.ts`
- `src/DodoExtensions/Common/LanguageIndicatorWrapper.ts`

**Пример кода**:
```typescript
import { TitleWrapper } from 'src/DodoExtensions/Common/TitleWrapper';
import { TitleLabel } from 'src/DodoExtensions/Common/TitleLabel';
import { StyledFlag } from 'src/DodoExtensions/Common/StyledFlag';
import { StyledPencil } from 'src/DodoExtensions/Common/StyledPencil';
import { LanguageIndicator } from 'src/DodoExtensions/Common/LanguageIndicator';
import { LanguageIndicatorWrapper } from 'src/DodoExtensions/Common/LanguageIndicatorWrapper';

export {
  TitleWrapper,
  TitleLabel,
  StyledFlag,
  StyledPencil,
  LanguageIndicator,
  LanguageIndicatorWrapper,
};
```

## Утилиты

### Утилиты для дашбордов

**Описание**: Утилиты для работы с дашбордами.

**DODO-модификации**:
- **44728892**: Добавлена функция для получения описания метрики с учетом локализации

**Ключевые файлы**:
- `src/DodoExtensions/dashboard/utils/getMetricDescription.ts`

**Пример кода**:
```typescript
export const getMetricDescription = (
  formData: QueryFormData & { metric: QueryFormMetric | undefined },
  datasource: Datasource,
  locale: string,
): Maybe<string> | undefined => {
  const { viz_type, metric } = formData;
  if (!viz_type.startsWith('big_number') || !metric) return undefined;

  if (isAdhocMetricSQL(metric)) return undefined;

  const isMetricSaved = isSavedMetric(metric);

  const metricName = isMetricSaved ? metric : metric?.column.column_name;
  if (!metricName) return undefined;

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
  // ...
}
```

### Утилиты для аннотаций

**Описание**: Утилиты для работы с аннотациями и оповещениями.

**DODO-модификации**:
- **44611022**: Созданы функции для работы с аннотациями и оповещениями

**Ключевые файлы**:
- `src/DodoExtensions/utils/annotationUtils.ts`

**Пример кода**:
```typescript
const ALERT_PREFIX = '[ALERT]';

const handleAnnotationLayersRequest = async () => {
  const annotationsResponse = await getAnnotationLayersData();

  if (annotationsResponse.loaded && annotationsResponse.data) {
    const filteredAnnotationLayers = annotationsResponse.data.filter(
      (layer: AnnotationLayer) => layer.name.includes(ALERT_PREFIX),
    );

    const foundAnnotationLayer = filteredAnnotationLayers[0] || null;

    if (foundAnnotationLayer) {
      const idsResponse = await getSingleAnnotationLayerIdsData(
        foundAnnotationLayer.id,
      );

      if (
        idsResponse?.loaded &&
        idsResponse.data?.ids &&
        idsResponse.data?.ids.length
      ) {
        const dataWithIds = {
          layerId: idsResponse.data.layerId,
          ids: idsResponse.data.ids,
        };

        return dataWithIds;
      }

      return null;
    }

    return null;
  }

  return null;
};
```

### Утилиты для визуализаций

**Описание**: Утилиты для работы с визуализациями.

**DODO-модификации**:
- **44728892**: Добавлена функция для расширения описаний источников данных

**Ключевые файлы**:
- `plugins/plugin-chart-echarts/src/DodoExtensions/utils/extendDatasourceDescriptions.ts`

**Пример кода**:
```typescript
export const extendDatasourceDescriptions = (
  datasourceDesriptions: Record<string, string>,
  groupBy: QueryFormColumn[],
  series: SeriesOption[],
): Record<string, string> => {
  if (!groupBy.length) return datasourceDesriptions;

  const extendedDatasourceDesriptions = {
    ...datasourceDesriptions,
  };

  series.forEach(option => {
    const { id } = option;

    if (typeof id !== 'string') return;

    const metricName = id.split(', ')[0];

    if (extendedDatasourceDesriptions[metricName]) {
      extendedDatasourceDesriptions[id] =
        extendedDatasourceDesriptions[metricName];
    }
  });

  return extendedDatasourceDesriptions;
};
```
