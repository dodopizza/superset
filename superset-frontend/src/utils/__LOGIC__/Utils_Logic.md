# Документация по DODO-специфичным компонентам и функциям в Utils

## Содержание

1. [Введение](#введение)
2. [Форматирование дат и времени](#форматирование-дат-и-времени)
   - [dttmToMoment](#dttmtomoment)
   - [formatDurationHMMSS](#formatdurationhmmss)
3. [Локализация](#локализация)
   - [redefineLocale](#redefinelocale)
   - [Локализация имен элементов](#локализация-имен-элементов)
4. [Работа с локальным хранилищем](#работа-с-локальным-хранилищем)
   - [Утилиты для onBoarding](#утилиты-для-onboarding)
5. [Работа с аннотациями](#работа-с-аннотациями)
6. [Прочие модификации](#прочие-модификации)

## Введение

Данный документ содержит информацию о компонентах и функциях, которые были добавлены или модифицированы командой DODO в директории `utils` проекта Superset. Каждая модификация помечена идентификатором изменения (например, "DODO 44211759").

## Форматирование дат и времени

### dttmToMoment

**Описание**: Функция для преобразования строки даты/времени в объект Moment.

**DODO-модификации**:

- **44211759**: Создана функция для преобразования строки даты/времени в объект Moment

**Ключевые файлы**:

- `superset-frontend/packages/superset-ui-core/src/DodoExtensions/time-format/utils/dttmToMoment.ts`

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
```

### formatDurationHMMSS

**Описание**: Функция для форматирования длительности в формате H:MM:SS.

**DODO-модификации**:

- **44136746**: Создана функция для форматирования длительности в формате H:MM:SS

**Ключевые файлы**:

- `superset-frontend/src/DodoExtensions/utils/formatDurationHMMSS.ts`

**Пример кода**:

```typescript
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

## Локализация

### redefineLocale

**Описание**: Функция для переопределения локали в данных загрузки.

**DODO-модификации**:

- **44611022**: Создана функция для переопределения локали в данных загрузки

**Ключевые файлы**:

- `superset-frontend/src/utils/bootstrapHelpers.ts`

**Пример кода**:

```typescript
export const redefineLocale = (data: BootstrapData): BootstrapData => {
  let finalLanguage: Locale = 'ru';
  const temp = data?.common?.language_pack?.locale_data?.superset;
  // Checking if it is a plugin, then getting language from a #changeLanguage select in DODOIS
  if (isStandalone) {
    const { lang } = temp[''] || null;
    finalLanguage = lang;
  } else {
    finalLanguage = getLocaleForSuperset();
  }

  return {
    ...data,
    common: {
      ...data?.common,
      locale: finalLanguage,
    },
  };
};
```

### Локализация имен элементов

**Описание**: Функции для локализации имен элементов в дашбордах.

**DODO-модификации**:

- **44120742**: Добавлена поддержка локализации имен элементов в дашбордах

**Ключевые файлы**:

- `superset-frontend/src/dashboard/components/nativeFilters/FiltersConfigModal/FiltersConfigForm/FilterScope/utils.ts`

**Пример кода**:

```typescript
// DODO added start 44120742
const locale = bootstrapData?.common?.locale || 'en';
const localisedSliceNameOverrideField =
  locale === 'en' ? 'sliceNameOverride' : 'sliceNameOverrideRU';
const localisedSliceNameField = locale === 'en' ? 'sliceName' : 'sliceNameRU';
// DODO added stop 44120742

export const getNodeTitle = (node: LayoutItem) =>
  node?.meta?.[localisedSliceNameOverrideField] ?? // DODO added 44120742
  node?.meta?.[localisedSliceNameField] ?? // DODO added 44120742
  node?.meta?.sliceNameOverride ??
  node?.meta?.sliceNameOverrideRU ?? // DODO added 44120742
  node?.meta?.sliceName ??
  node?.meta?.sliceNameRU ?? // DODO added 44120742
  node?.meta?.text ??
  node?.meta?.defaultText ??
  node?.id?.toString?.() ??
  '';
```

## Работа с локальным хранилищем

### Утилиты для onBoarding

**Описание**: Утилиты для работы с локальным хранилищем для функциональности onBoarding.

**Ключевые файлы**:

- `superset-frontend/src/DodoExtensions/onBoarding/utils/localStorageUtils.ts`

**Пример кода**:

```typescript
export const getOnboardingStorageInfo: () => OnBoardingStorageInfo = () => {
  const fromStorage = localStorage.getItem(ONBOARDING_LOCAL_STORAGE_KEY);

  if (fromStorage) {
    const info: OnBoardingStorageInfo = JSON.parse(
      fromStorage,
      (key: string, value: any) => {
        if (key === 'theTimeOfTheLastShow') {
          return new Date(value);
        }
        return value;
      },
    );

    return info;
  }

  return {
    theTimeOfTheLastShow: undefined,
    initialByUser: false,
  };
};

export const updateStorageTimeOfTheLastShow = () => {
  const info: OnBoardingStorageInfo = {
    theTimeOfTheLastShow: new Date(),
    initialByUser: false,
  };

  localStorage.setItem(ONBOARDING_LOCAL_STORAGE_KEY, JSON.stringify(info));
};
```

## Работа с аннотациями

**Описание**: Утилиты для работы с аннотациями и оповещениями.

**DODO-модификации**:

- **44611022**: Созданы функции для работы с аннотациями и оповещениями

**Ключевые файлы**:

- `superset-frontend/src/DodoExtensions/utils/annotationUtils.ts`

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

## Прочие модификации

### dirtyHackDodoIs

**Описание**: Функция для исправления проблемы с CSS-свойством min-height в элементе div.all.

**Ключевые файлы**:

- `superset-frontend/src/Superstructure/Root/utils.ts`

**Пример кода**:

```typescript
const dirtyHackDodoIs = () => {
  // In dodois the div.all has css property min-height, that forces the footer to be overlapped
  const dodoElementAll = document.getElementsByClassName('all')[0];

  if (dodoElementAll?.classList.contains('overwrite-height')) {
    dodoElementAll.classList.remove('overwrite-height');
  }
};
```

### handleCsrfToken

**Описание**: Функция для обработки CSRF-токена.

**DODO-модификации**:

- **44611022**: Создана функция для обработки CSRF-токена

**Ключевые файлы**:

- `superset-frontend/packages/superset-ui-core/src/DodoExtensions/api/utils.ts`

**Пример кода**:

```typescript
const handleCsrfToken = (csrfToken: string) => {
  const csrfOnThePage = document.getElementById('csrf_token');

  if (!csrfOnThePage) {
    const csrfTokenElement = document.createElement('input');
    csrfTokenElement.type = 'hidden';
    csrfTokenElement.name = 'csrf_token';
    csrfTokenElement.value = csrfToken;
    csrfTokenElement.id = 'csrf_token';
    document.body.appendChild(csrfTokenElement);
  } else {
    csrfOnThePage.setAttribute('value', csrfToken);
  }
};
```

### getDefaultDashboard

**Описание**: Функция для получения ID дашборда по умолчанию в зависимости от бизнеса.

**Ключевые файлы**:

- `superset-frontend/src/Superstructure/utils/getDefaultDashboard.ts`

**Пример кода**:

```typescript
export const DODOPIZZA_DEFAULT_DASHBOARD_ID = 209;
export const DRINKIT_DEFAULT_DASHBOARD_ID = 507;
```
