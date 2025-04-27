# Документация по DODO-специфичным компонентам и функциям в Hooks

## Содержание

1. [Введение](#введение)
2. [API ресурсы](#api-ресурсы)
   - [Хуки для дашбордов](#хуки-для-дашбордов)
   - [Хуки для API ресурсов](#хуки-для-api-ресурсов)
3. [Хуки для onBoarding](#хуки-для-onboarding)
   - [useOnboarding](#useonboarding)
   - [useHasUserTeam](#usehasuserteam)
   - [useTeam](#useteam)
4. [Прочие модификации](#прочие-модификации)

## Введение

Данный документ содержит информацию о компонентах и функциях, которые были добавлены или модифицированы командой DODO в директории `hooks` проекта Superset. Каждая модификация помечена идентификатором изменения (например, "DODO 44120742").

## API ресурсы

### Хуки для дашбордов

**Описание**: Хуки для работы с API дашбордов.

**DODO-модификации**:

- **44120742**: Добавлена поддержка локализации для API дашбордов
- **44211751**: Добавлена поддержка наборов фильтров (FilterSets)

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

// DODO changed 44120742
export const useDashboardDatasets = (
  idOrSlug: string | number,
  language?: string,
) =>
  useApiV1Resource<Datasource[]>(
    !language
      ? `/api/v1/dashboard/${idOrSlug}/datasets`
      : `/api/v1/dashboard/${idOrSlug}/datasets?language=${language}`,
  );
```

**Импорт типов для наборов фильтров**:

```typescript
import { FilterSetFullData } from 'src/DodoExtensions/FilterSets/types'; // DODO added 44211751
```

### Хуки для API ресурсов

**Описание**: Базовые хуки для работы с API ресурсами.

**Ключевые файлы**:

- `superset-frontend/src/hooks/apiResources/apiResources.ts`
- `superset-frontend/src/Superstructure/hooks/apiResources/apiResources.ts`

**Пример кода**:

```typescript
export enum ResourceStatus {
  Loading = 'loading',
  Complete = 'complete',
  Error = 'error',
}

/**
 * An object containing the data fetched from the API,
 * as well as loading and error info
 */
export type Resource<T> = LoadingState | CompleteState<T> | ErrorState;
```

## Хуки для onBoarding

### useOnboarding

**Описание**: Хук для управления процессом onBoarding новых пользователей.

**Ключевые файлы**:

- `superset-frontend/src/DodoExtensions/onBoarding/hooks/useOnboarding.ts`

**Пример кода**:

```typescript
// hardcode to stop show onboarding popup
const oneDayPassed = (date?: Date): boolean => false;

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
};
```

### useHasUserTeam

**Описание**: Хук для проверки наличия команды у пользователя.

**Ключевые файлы**:

- `superset-frontend/src/DodoExtensions/onBoarding/hooks/useHasUserTeam.ts`

**Пример кода**:

```typescript
export const useHasUserTeam = (id: string, isEnabled: boolean): boolean => {
  const [hasTeam, setHasTeam] = useState(true);
  const toast = useToasts();

  useEffect(() => {
    if (isEnabled) {
      SupersetClient.get({
        url: '/api/v1/me/team',
        headers: { 'Content-Type': 'application/json' },
        parseMethod: null,
      })
        .then(response => response.json())
        .then(dto => {
          setHasTeam(Boolean(dto.result.team));
        })
        .catch(() => {
          toast.addDangerToast(
            t(`An error occurred while checking user's team`),
          );
        });
    }
  }, [id, isEnabled, toast]);

  return hasTeam;
};
```

### useTeam

**Описание**: Хук для работы с командами.

**Ключевые файлы**:

- `superset-frontend/src/DodoExtensions/onBoarding/hooks/useTeam.tsx`

**Пример кода**:

```typescript
import { useDispatch } from 'react-redux';
import { useCallback, useMemo } from 'react';
import { debounce } from 'lodash';
import { loadTeams } from '../model/actions/loadTeams';
import { Role, UserFromEnum } from '../types';
import { MAX_TEAM_NAME_LENGTH, SEARCH_TEAM_DELAY } from '../consts';
```

## Прочие модификации

### Хуки для работы с аннотациями

**Описание**: Утилиты для работы с аннотациями и оповещениями.

**DODO-модификации**:

- **44611022**: Созданы функции для работы с аннотациями и оповещениями

**Ключевые файлы**:

- `superset-frontend/src/DodoExtensions/utils/annotationUtils.ts`

**Пример кода**:

```typescript
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

### Хуки для работы с датасетами

**Описание**: Хуки для работы с датасетами.

**Ключевые файлы**:

- `superset-frontend/src/features/datasets/hooks/useGetDatasetRelatedCounts.ts`

**Пример кода**:

```typescript
const useGetDatasetRelatedCounts = (id: string) => {
  const [usageCount, setUsageCount] = useState(0);

  const getDatasetRelatedObjects = useCallback(
    () =>
      SupersetClient.get({
        endpoint: `/api/v1/dataset/${id}/related_objects`,
      })
        .then(({ json }) => {
          setUsageCount(json?.charts.count);
        })
        .catch(error => {
          addDangerToast(
            t(`There was an error fetching dataset's related objects`),
          );
          logging.error(error);
        }),
    [id],
  );

  useEffect(() => {
    if (id) {
      getDatasetRelatedObjects();
    }
  }, [id, getDatasetRelatedObjects]);

  return { usageCount };
};
```
