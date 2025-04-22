# Документация по DODO-специфичным компонентам и функциям в Pages

## Содержание

1. [Введение](#введение)
2. [Страницы списков](#страницы-списков)
   - [DashboardList](#dashboardlist)
3. [Страницы onBoarding](#страницы-onboarding)
   - [RequestList](#requestlist)
   - [Request](#request)
   - [TeamList](#teamlist)
   - [Team](#team)
4. [Локализация](#локализация)
5. [Прочие модификации](#прочие-модификации)

## Введение

Данный документ содержит информацию о компонентах и функциях, которые были добавлены или модифицированы командой DODO в директории `pages` проекта Superset. Каждая модификация помечена идентификатором изменения (например, "DODO 44120742").

## Страницы списков

### DashboardList

**Описание**: Страница со списком дашбордов.

**DODO-модификации**:
- **44120742**: Добавлена поддержка локализации заголовков дашбордов (поле `dashboard_title_ru`)

**Ключевые файлы**:
- `superset-frontend/src/pages/DashboardList/index.tsx`

**Пример кода**:
```typescript
interface DashboardDodoExtended {
  dashboard_title_ru: string; // DODO added 44120742
}
export interface Dashboard extends DashboardDodoExtended {
  changed_by_name: string;
  changed_on_delta_humanized: string;
  changed_by: string;
  dashboard_title: string;
  id: number;
  published: boolean;
  url: string;
  thumbnail_url: string;
  owners: Owner[];
  tags: Tag[];
  created_by: object;
}
```

## Страницы onBoarding

### RequestList

**Описание**: Страница со списком запросов на доступ.

**Ключевые файлы**:
- `superset-frontend/src/DodoExtensions/onBoarding/pages/RequestList/requestList.tsx`
- `superset-frontend/src/DodoExtensions/onBoarding/pages/RequestList/useRequestList.tsx`
- `superset-frontend/src/DodoExtensions/onBoarding/pages/RequestList/types.ts`

**Пример кода**:
```typescript
const RequestListPage: FC<RequestListProps> = ({
  addDangerToast,
  addSuccessToast,
}) => {
  const { fetchData, filters } = useRequestList();

  const data = useSelector(getRequestListData);
  const loading = useSelector(getRequestListLoading);

  return (
    <div>
      <SubMenu name={t('Requests')} buttons={[]} />
      <ListView<RequestListType>
        className="request-list-view"
        columns={columns}
        count={data?.count ?? 0}
        data={data?.rows ?? []}
        fetchData={fetchData}
        filters={filters}
        initialSort={initialSort}
        loading={loading}
        pageSize={PAGE_SIZE}
        defaultViewMode="table"
        addDangerToast={addDangerToast}
        addSuccessToast={addSuccessToast}
        refreshData={() => {}}
      />
    </div>
  );
};
```

### Request

**Описание**: Страница с детальной информацией о запросе на доступ.

**Ключевые файлы**:
- `superset-frontend/src/DodoExtensions/onBoarding/pages/Request/Request.tsx`
- `superset-frontend/src/DodoExtensions/onBoarding/pages/Request/useRequest.tsx`
- `superset-frontend/src/DodoExtensions/onBoarding/pages/Request/components/RequestData.tsx`

**Пример кода**:
```typescript
type Props = {
  data?: {
    userFrom: UserFromEnum;
    firstName: string;
    lastName: string;
    email: string;
    dodoRole: string;
    currentRoles: Array<string>;
    requestedRoles: Array<string>;
    team: string;
    requestDate: Date;
    isClosed: boolean;
    updateDate: Date;
  };
};
```

### TeamList

**Описание**: Страница со списком команд.

**Ключевые файлы**:
- `superset-frontend/src/DodoExtensions/onBoarding/pages/TeamList/teamList.tsx`
- `superset-frontend/src/DodoExtensions/onBoarding/pages/TeamList/useTeamList.tsx`

**Пример кода**:
```typescript
export const useTeamList = () => {
  const dispatch = useDispatch();
  const user = useSelector(getUserInfo);
  const history = useHistory();

  if (!user.roles.Admin) {
    history.push('/superset/welcome/');
  }

  const fetchData = useCallback(
    (config: FetchDataConfig) => {
      dispatch(loadTeamList(config));
    },
    [dispatch],
  );

  return { fetchData };
};
```

### Team

**Описание**: Страница с детальной информацией о команде.

**Ключевые файлы**:
- `superset-frontend/src/DodoExtensions/onBoarding/pages/Team/TeamPage.tsx`
- `superset-frontend/src/DodoExtensions/onBoarding/pages/Team/useTeamPage.tsx`

**Пример кода**:
```typescript
type TeamPageSuccessPayload = {
  id: number;
  isExternal: boolean;
  name: string;
  slug: string;
  roles: string;
  membersCount: number;
  participants: Array<{
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    createdOn: Date;
    lastLogin: Date;
    loginCount: number;
  }>;
};
```

## Локализация

**Описание**: Добавлена поддержка локализации для страниц.

**DODO-модификации**:
- **44120742**: Добавлена поддержка локализации заголовков дашбордов
- **44611022**: Добавлена настройка локали по умолчанию (русский язык)

**Ключевые файлы**:
- `superset-frontend/src/dashboard/containers/DashboardPage.tsx`
- `superset-frontend/src/preamble.ts`

**Пример кода**:
```typescript
const locale = bootstrapData?.common?.locale || 'en'; // DODO added 44120742
const isStandalone = process.env.type === undefined; // DODO added 44611022

export const DashboardPageIdContext = createContext('');
```

## Прочие модификации

### OnBoarding

**Описание**: Система онбординга для новых пользователей.

**Ключевые файлы**:
- `superset-frontend/src/DodoExtensions/onBoarding/onBoardingEntryPoint.tsx`
- `superset-frontend/src/DodoExtensions/onBoarding/index.ts`

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

### Модель данных для onBoarding

**Описание**: Модель данных для системы онбординга.

**Ключевые файлы**:
- `superset-frontend/src/DodoExtensions/onBoarding/model/slices/teamPage.slice.ts`
- `superset-frontend/src/DodoExtensions/onBoarding/model/types/teamPage.types.ts`

**Пример кода**:
```typescript
const initialState: OnBoardingTeamPageState = {
  pending: false,
  error: null,
  data: null,
};
```
