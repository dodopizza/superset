# Документация по DODO-специфичным компонентам и функциям в Superset

## Содержание

1. [Введение](#введение)
2. [Визуализация и компоненты](#визуализация-и-компоненты)
   - [Компоненты визуализации](#компоненты-визуализации)
   - [Компоненты управления](#компоненты-управления)
   - [Общие компоненты](#общие-компоненты)
3. [Локализация](#локализация)
   - [Поддержка русского языка](#поддержка-русского-языка)
   - [Локализация дашбордов](#локализация-дашбордов)
   - [Локализация фильтров](#локализация-фильтров)
4. [Фильтрация и маски данных](#фильтрация-и-маски-данных)
   - [Наборы фильтров (FilterSets)](#наборы-фильтров-filtersets)
   - [Маски данных](#маски-данных)
5. [Интеграция с внешними сервисами](#интеграция-с-внешними-сервисами)
   - [Firebase](#firebase)
   - [Rollbar](#rollbar)
   - [Интеграция с DODO IS](#интеграция-с-dodo-is)
6. [Система onBoarding](#система-onboarding)
   - [Компоненты onBoarding](#компоненты-onboarding)
   - [Хуки onBoarding](#хуки-onboarding)
   - [Модель данных onBoarding](#модель-данных-onboarding)
7. [Утилиты и расширения](#утилиты-и-расширения)
   - [Утилиты для дашбордов](#утилиты-для-дашбордов)
   - [Утилиты для аннотаций](#утилиты-для-аннотаций)
   - [Утилиты для форматирования](#утилиты-для-форматирования)

## Введение

Данный документ содержит информацию о компонентах и функциях, которые были добавлены или модифицированы командой DODO в проекте Superset. Каждая модификация помечена идентификатором изменения (например, "DODO 44211751"), что позволяет отслеживать историю изменений.

DODO-специфичные компоненты и функции расширяют базовую функциональность Superset, добавляя поддержку русского языка, интеграцию с внешними сервисами (Firebase, Rollbar), систему onBoarding для новых пользователей, наборы фильтров и другие возможности, необходимые для работы в экосистеме DODO.

## Визуализация и компоненты

### Компоненты визуализации

#### BigNumber

**Описание**: Расширение для компонента BigNumber с поддержкой условного форматирования.

**DODO-модификации**:
- **45525377**: Добавлена возможность условного форматирования для значения и процентного изменения
- Добавлена возможность отображения условных сообщений

**Ключевые файлы**:
- `plugins/plugin-chart-echarts/src/DodoExtensions/BigNumber/BigNumberViz.tsx`
- `plugins/plugin-chart-echarts/src/DodoExtensions/BigNumber/BigNumberWithTrendline/transformPropsDodo.ts`
- `plugins/plugin-chart-echarts/src/DodoExtensions/BigNumber/BigNumberTotal/controlPanelDodo.tsx`

#### BarDodo

**Описание**: Модифицированная версия столбчатой диаграммы с дополнительными возможностями.

**DODO-модификации**:
- **45525377**: Создан компонент с расширенными возможностями форматирования и отображения

**Ключевые файлы**:
- `plugins/plugin-chart-echarts/src/DodoExtensions/BarDodo/index.ts`
- `plugins/plugin-chart-echarts/src/DodoExtensions/BarDodo/transformProps.ts`
- `plugins/plugin-chart-echarts/src/DodoExtensions/BarDodo/controlPanel.tsx`

#### BubbleDodo

**Описание**: Модифицированная версия пузырьковой диаграммы с дополнительными возможностями.

**DODO-модификации**:
- Добавлена возможность настройки отображения меток
- Добавлена возможность настройки размера и цвета пузырьков
- Добавлена возможность настройки логарифмической шкалы для осей

**Ключевые файлы**:
- `plugins/plugin-chart-echarts/src/DodoExtensions/Bubble/BubbleDodo.tsx`
- `plugins/plugin-chart-echarts/src/DodoExtensions/Bubble/index.ts`
- `plugins/plugin-chart-echarts/src/DodoExtensions/Bubble/transformProps.ts`

#### MixedTimeseries

**Описание**: Модифицированная версия временного ряда с дополнительными возможностями.

**DODO-модификации**:
- **44728892**: Добавлена функция для расширения описаний источников данных
- Добавлена поддержка отображения подсказок с описаниями метрик

**Ключевые файлы**:
- `plugins/plugin-chart-echarts/src/MixedTimeseries/transformProps.tsx`
- `plugins/plugin-chart-echarts/src/DodoExtensions/utils/extendDatasourceDescriptions.ts`

### Компоненты управления

#### ConditionalFormattingControlDodo

**Описание**: Модифицированная версия компонента условного форматирования с расширенными возможностями.

**DODO-модификации**:
- **45525377**: Создан компонент с улучшенным интерфейсом и дополнительными возможностями

**Ключевые файлы**:
- `src/DodoExtensions/explore/components/controls/ConditionalFormattingControlDodo/ConditionalFormattingControlDodo.tsx`
- `src/DodoExtensions/explore/components/controls/ConditionalFormattingControlDodo/FormattingPopoverDodo.tsx`

#### ColorPickerControlDodo

**Описание**: Модифицированная версия компонента выбора цвета с улучшенным интерфейсом.

**DODO-модификации**:
- **45525377**: Изменены стили относительно оригинального компонента, убрана фиксированная ширина и высота

**Ключевые файлы**:
- `src/DodoExtensions/explore/components/controls/ColorPickerControlDodo.jsx`

### Общие компоненты

**Описание**: Общие компоненты, используемые в различных частях приложения.

**Ключевые файлы**:
- `src/DodoExtensions/Common/TitleWrapper.ts`
- `src/DodoExtensions/Common/TitleLabel.ts`
- `src/DodoExtensions/Common/StyledFlag.ts`
- `src/DodoExtensions/Common/StyledPencil.ts`
- `src/DodoExtensions/Common/LanguageIndicator.ts`
- `src/DodoExtensions/Common/LanguageIndicatorWrapper.ts`

## Локализация

### Поддержка русского языка

**Описание**: Добавление поддержки русского языка в интерфейс и данные.

**DODO-модификации**:
- **44120742**: Добавлены поля для поддержки русского языка в различных компонентах
- **44211759**: Добавлена поддержка локализации для наборов фильтров

**Ключевые файлы**:
- `superset-frontend/src/types/Dashboard.ts`
- `superset-frontend/src/dashboard/components/Header/types.ts`
- `superset-frontend/src/types/Owner.ts`

**Пример кода**:
```typescript
interface DashboardDodoExtended {
  dashboard_title_ru: string; // DODO added 44120742
}

interface HeaderDropdownPropsDodoExtended {
  dashboardTitleRU: string; // DODO added 44120742
}

type MetaDodoExtended = {
  sliceNameRU?: string; // DODO added 44120742
  sliceNameOverrideRU?: string; // DODO added 44120742
};
```

### Локализация дашбордов

**Описание**: Поддержка локализации для дашбордов и их компонентов.

**DODO-модификации**:
- **44120742**: Добавлена поддержка локализации для API дашбордов

**Ключевые файлы**:
- `superset-frontend/src/hooks/apiResources/dashboards.ts`
- `superset-frontend/src/Superstructure/hooks/apiResources/dashboards.ts`

**Пример кода**:
```typescript
// DODO changed 44120742
export const useDashboardCharts = (
  idOrSlug: string | number,
  language?: string,
) =>
  useApiV1Resource<Chart[]>(
    !language
      ? `/api/v1/dashboard/${idOrSlug}/charts`
      : `/api/v1/dashboard/${idOrSlug}/charts?language=${language}`,
  );
```

### Локализация фильтров

**Описание**: Поддержка локализации для фильтров и наборов фильтров.

**DODO-модификации**:
- **44211759**: Добавлены поля для поддержки локализации фильтров

**Ключевые файлы**:
- `superset-frontend/packages/superset-ui-core/src/query/types/Dashboard.ts`
- `superset-frontend/src/DodoExtensions/FilterSets/index.tsx`

**Пример кода**:
```typescript
type FilterDodoExtended = {
  nameRu?: string; // DODO added 44211759
  selectTopValue?: number; // DODO added 44211759
};

// DODO added start 44211759
const locale = bootstrapData?.common?.locale || 'en';
const localisedNameField = `name${locale === 'en' ? '' : 'Ru'}` as
  | 'name'
  | 'nameRu';
// DODO added stop 44211759
```

## Фильтрация и маски данных

### Наборы фильтров (FilterSets)

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

### Маски данных

**Описание**: Компоненты и функции для работы с масками данных.

**Ключевые файлы**:
- `superset-frontend/src/dataMask/reducer.ts`
- `superset-frontend/src/dataMask/actions.ts`

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
```

## Интеграция с внешними сервисами

### Firebase

**Описание**: Интеграция с сервисами Firebase для аналитики и логирования ошибок.

**Ключевые файлы**:
- `superset-frontend/src/firebase/constants.ts`
- `superset-frontend/src/firebase/setupFirebase.ts`
- `superset-frontend/src/firebase/index.ts`

**Пример кода**:
```typescript
export interface IFirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
}

const STANDALONE_PROD_CONFIG: IFirebaseConfig = {
  apiKey: 'AIzaSyDXn8X8G9vVCw_b8AZWSupI3T_aLLK7L4Y',
  authDomain: 'superset-dodobrands.firebaseapp.com',
  projectId: 'superset-dodobrands',
  storageBucket: 'superset-dodobrands.firebasestorage.app',
  messagingSenderId: '1083382993878',
  appId: '1:1083382993878:web:285f3dfa11c518e8438a77',
  measurementId: 'G-DBW4DYJ5T1',
};
```

**Логирование событий**:
```typescript
export const FirebaseService: IFirebaseService = (() => {
  let analytics: Analytics;
  
  // ...
  
  return {
    // ...
    logEvent: (eventName: string, params: object) => {
      logEvent(analytics, eventName, params);
    },
    // ...
  };
})();
```

### Rollbar

**Описание**: Интеграция с сервисом Rollbar для отслеживания ошибок.

**DODO-модификации**:
- **47015293**: Добавлена интеграция с Rollbar

**Ключевые файлы**:
- `superset-frontend/src/firebase/rollbar.ts`
- `superset-frontend/src/views/App.tsx`
- `superset-frontend/src/Superstructure/components/App.jsx`

**Пример кода**:
```typescript
export const ROLLBAR_CONFIG: Configuration = {
  accessToken: 'd9021ea67e624bcc904ff9deae004565',
  captureUncaught: true,
  captureUnhandledRejections: true,
  payload: {
    environment: getEnv(),
    client: {
      javascript: {
        code_version: APP_VERSION,
      },
    },
  },
  version: APP_VERSION,
  checkIgnore: (isUncaught, args, payload: RollbarPayload) => {
    const description = payload?.body?.trace?.exception?.description || '';
    const traceMessage = payload?.body?.trace?.exception?.message || '';
    const message = payload?.body?.message?.body?.message || '';

    return Boolean(
      ERROR_WHITE_LIST[description] ||
        ERROR_WHITE_LIST[traceMessage] ||
        ERROR_WHITE_LIST[message],
    );
  },
};
```

### Интеграция с DODO IS

**Описание**: Интеграция с DODO IS для встраивания дашбордов и аутентификации.

**Ключевые файлы**:
- `superset-frontend/src/embedded/index.tsx`
- `superset-frontend/src/embedded/api.tsx`
- `superset-frontend/src/Superstructure/messages.ts`

**Пример кода**:
```typescript
const RULES_RU = {
  title: 'Добро пожаловать в Superset dashboard plugin',
  subTitle: 'Новый инструмент от команды DE',
  extra: IF_QUESTIONS_RU,
  messages: [
    'Слева можно выбрать интересующий дашборд.',
    'Данный инструмент встроен в DODO IS и показывает дашборды из standalone сервиса по ссылке: https://analytics.dodois.io/',
    'Примененные конфигурации: CERTIFIED BY => DODOPIZZA',
  ],
  buttons: [
    {
      txt: 'Правила работы с аналитикой',
      link: DODOPIZZA_KNOWLEDGEBASE_URL,
    },
    {
      txt: 'Перейти в аналитику  (standalone)',
      link: DODOPIZZA_ANALYTICS_URL,
    },
  ],
};
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

## Утилиты и расширения

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

### Утилиты для форматирования

**Описание**: Утилиты для форматирования данных.

**DODO-модификации**:
- **44136746**: Добавлен формат DURATION_HMMSS для форматирования длительности в формате часы:минуты:секунды
- **45525377**: Добавлены типы для условного форматирования с поддержкой локализации

**Ключевые файлы**:
- `superset-frontend/src/setup/setupFormatters.ts`
- `superset-frontend/src/DodoExtensions/utils/formatDurationHMMSS.ts`
- `plugins/plugin-chart-echarts/src/DodoExtensions/BigNumber/types.ts`

**Пример кода**:
```typescript
import { formatDurationHMMSS } from 'src/DodoExtensions/utils/formatDurationHMMSS'; // DODO added 44136746

// ...

// DODO added 44136746
.registerValue(
  'DURATION_HMMSS',
  createDurationFormatter({ formatFunc: formatDurationHMMSS }),
);
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
