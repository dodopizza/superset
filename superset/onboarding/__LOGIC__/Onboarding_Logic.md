# Документация по системе онбординга (Onboarding) в DODO

## Содержание

1. [Введение](#введение)
2. [Архитектура](#архитектура)
3. [Бэкенд](#бэкенд)
   - [API](#api)
   - [Схемы](#схемы)
   - [Команды](#команды)
   - [DAO](#dao)
4. [Фронтенд](#фронтенд)
   - [Компоненты](#компоненты)
   - [Хуки](#хуки)
   - [Модель данных](#модель-данных)
   - [Репозитории](#репозитории)
5. [Процесс онбординга](#процесс-онбординга)
6. [Техническая реализация](#техническая-реализация)
7. [Примеры использования](#примеры-использования)

## Введение

Система онбординга (Onboarding) - это DODO-специфичная функциональность, которая отсутствует в стандартном Superset. Она предназначена для адаптации новых пользователей к системе DODO, сбора информации о их роли и команде, а также для управления доступом к данным.

Система онбординга включает в себя:
- Процесс регистрации новых пользователей
- Сбор информации о роли пользователя в DODO
- Создание и управление командами
- Управление заявками на доступ к данным
- Административный интерфейс для управления пользователями и командами

## Архитектура

Система онбординга реализована как на бэкенде, так и на фронтенде Superset:

1. **Бэкенд**:
   - `superset/onboarding` - основной модуль для API онбординга
   - `superset/commands/onboarding` - команды для управления онбордингом
   - `superset/models/user_info` - модель для хранения информации об онбординге
   - `superset/daos/user_info` - DAO для работы с информацией об онбординге

2. **Фронтенд**:
   - `src/DodoExtensions/onBoarding` - основной модуль для компонентов онбординга
   - `src/DodoExtensions/onBoarding/components` - компоненты для онбординга
   - `src/DodoExtensions/onBoarding/hooks` - хуки для онбординга
   - `src/DodoExtensions/onBoarding/model` - модель данных для онбординга
   - `src/DodoExtensions/onBoarding/repository` - репозитории для работы с API

## Бэкенд

### API

API онбординга реализовано в файле `superset/onboarding/api.py` и предоставляет следующие эндпоинты:

1. **GET /api/v1/onboarding/** - получение информации об онбординге текущего пользователя
2. **PUT /api/v1/onboarding/** - обновление информации об онбординге текущего пользователя

```python
class OnboardingRestApi(BaseSupersetModelRestApi):
    datamodel = SQLAInterface(UserInfo)

    include_route_methods = RouteMethod.REST_MODEL_VIEW_CRUD_SET
    resource_name = "onboarding"
    allow_browser_login = True

    class_permission_name = "Onboarding"
    method_permission_name = MODEL_API_RW_METHOD_PERMISSION_MAP

    list_columns = [
        "id",
        "is_onboarding_finished",
        "onboarding_started_time",
        "language",
        "user_id",
        "dodo_role",
    ]

    edit_model_schema = OnboardingPutSchema()
    onboarding_get_response_schema = OnboardingGetResponseSchema()

    @expose("/", methods=("GET",))
    @protect()
    @safe
    @statsd_metrics
    def get(self) -> Response:
        """Get user onboarding information"""
        try:
            user_id = g.user.id
            user_info = UserInfoDAO.get_by_user_id(user_id)
        except OnboardingAccessDeniedError:
            return self.response_403()
        except OnboardingNotFoundError:
            return self.response_404()
        result = self.onboarding_get_response_schema.dump(user_info)
        result = {
            **result,
            "email": g.user.email,
            "last_name": g.user.last_name,
            "first_name": g.user.first_name,
        }
        return self.response(200, result=result)

    @expose("/", methods=("PUT",))
    @protect()
    @safe
    @statsd_metrics
    def put(self) -> Response:
        """Update user onboarding information"""
        try:
            item = self.edit_model_schema.load(request.json)
        except ValidationError as error:
            return self.response_400(message=error.messages)
        try:
            user_id = g.user.id
            id_model = UserInfoDAO.get_by_user_id(user_id).id
            onboarding_started_time = datetime.datetime.utcnow().isoformat()
            item["onboarding_started_time"] = onboarding_started_time
            UpdateOnboardingCommand(id_model, item).run()
            response = self.response(200, result=item)
        except OnboardingNotFoundError:
            response = self.response_404()
        except OnboardingForbiddenError:
            response = self.response_403()
        except OnboardingInvalidError as ex:
            response = self.response_422(message=ex.normalized_messages())
        except OnboardingUpdateFailedError as ex:
            response = self.response_422(message=str(ex))
        return response
```

### Схемы

Схемы для API онбординга реализованы в файле `superset/onboarding/schemas.py`:

```python
class OnboardingGetResponseSchema(Schema):
    id = fields.Int()
    first_name = fields.String()
    last_name = fields.String()
    email = fields.String()
    is_onboarding_finished = fields.Boolean()
    onboarding_started_time = fields.DateTime(missing=True)


class OnboardingPutSchema(Schema):
    dodo_role = fields.String()
```

### Команды

Команды для управления онбордингом реализованы в модуле `superset/commands/onboarding`:

1. **UpdateOnboardingCommand** - команда для обновления информации об онбординге

```python
class UpdateOnboardingCommand(UpdateMixin, BaseCommand):
    def __init__(self, model_id: int, data: dict[str, Any]):
        self._model_id = model_id
        self._properties = data.copy()
        self._model: Optional[UserInfo] = None

    @transaction(on_error=partial(on_error, reraise=OnboardingUpdateFailedError))
    def run(self) -> Model:
        self.validate()
        assert self._model

        user_info = UserInfoDAO.update(self._model, self._properties)
        return user_info

    def validate(self) -> None:
        # Validate model exists
        self._model = UserInfoDAO.find_by_id(self._model_id)
        if not self._model:
            raise OnboardingNotFoundError()
```

### DAO

DAO для работы с информацией об онбординге реализовано в файле `superset/daos/user_info.py`:

```python
class UserInfoDAO(BaseDAO[UserInfo]):
    @staticmethod
    def get_onboarding() -> dict[str, Any]:
        user_id = get_user_id()
        try:
            user_info = (
                db.session.query(UserInfo)
                .filter(UserInfo.user_id == user_id)
                .one_or_none()
            )
            return user_info.__dict__
        except Exception:
            logger.warning(
                "User id = %s dont have onboarding info in database", user_id
            )
            return {"onboarding_started_time": None, "is_onboarding_finished": False}

    @staticmethod
    def create_onboarding(
        dodo_role: str, started_time: datetime
    ) -> bool:
        """Create onboarding record for user."""
        user_id = get_user_id()
        if not user_id:
            logger.warning("Cannot create onboarding - user ID not found")
            return False

        try:
            user_info = UserInfo(
                user_id=user_id,
                dodo_role=dodo_role,
                onboarding_started_time=started_time,
            )
            db.session.add(user_info)
            db.session.commit()
            return True
        except Exception:
            logger.exception("Error creating onboarding")
            return False

    @staticmethod
    def update_onboarding(dodo_role: str, started_time: datetime) -> dict[str, Any]:
        user_id = get_user_id()
        try:
            user_info = (
                db.session.query(UserInfo)
                .filter(UserInfo.user_id == user_id)
                .one_or_none()
            )
            user_info.dodo_role = dodo_role
            user_info.onboarding_started_time = started_time
            db.session.commit()
        except AttributeError:
            UserInfoDAO.create_onboarding(dodo_role, started_time)

        return {"dodo_role": dodo_role, "onboarding_started_time": started_time}
```

## Фронтенд

### Компоненты

Компоненты для онбординга реализованы в директории `src/DodoExtensions/onBoarding/components`:

1. **StepOnePopup** - компонент для первого шага онбординга (выбор роли)
2. **StepTwoPopup** - компонент для второго шага онбординга (выбор команды и ролей)
3. **StepThreePopup** - компонент для третьего шага онбординга (подтверждение)

```tsx
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

### Хуки

Хуки для онбординга реализованы в директории `src/DodoExtensions/onBoarding/hooks`:

1. **useOnboarding** - хук для управления процессом онбординга

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

  // Логика определения текущего шага онбординга
  if (isOnboardingFinished) {
    if (step2PassedRef.current) {
      if (step !== 3) {
        setStep(3);
      }
    } else if (step !== null) {
      setStep(null);
    }
  } else if (onboardingStartedTime) {
    if (
      oneDayPassed(storageInfo.theTimeOfTheLastShow) ||
      storageInfo.initialByUser
    ) {
      if (step !== 2) {
        setStep(2);
      }
    }
  } else if (
    oneDayPassed(storageInfo.theTimeOfTheLastShow) ||
    storageInfo.initialByUser
  ) {
    if (step === null) {
      setStep(1);
    }
  }

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

  const setStep3Passed = useCallback(() => {
    setStep(null);
  }, []);

  return {
    step,
    toStepTwo,
    closeOnboarding,
    setStep2Passed,
    setStep3Passed,
  };
};
```

### Модель данных

Модель данных для онбординга реализована в директории `src/DodoExtensions/onBoarding/model`:

1. **Действия (actions)**:
   - `initOnboarding` - инициализация онбординга
   - `stepOneFinish` - завершение первого шага онбординга
   - `finishOnBoarding` - завершение онбординга

2. **Типы (types)**:
   - `OnboardingSuccessPayload` - данные об онбординге
   - `OnboardingStepOneSuccessPayload` - данные о первом шаге онбординга
   - `OnboardingFinishSuccessPayload` - данные о завершении онбординга

3. **Селекторы (selectors)**:
   - `getIsOnboardingFinished` - получение статуса завершения онбординга
   - `getOnboardingStartedTime` - получение времени начала онбординга

4. **Слайсы (slices)**:
   - `onboardingStartSlice` - слайс для управления состоянием онбординга

```typescript
// Типы
export type OnboardingSuccessPayload = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  isOnboardingFinished: boolean;
  onboardingStartedTime: string | null;
};

export type OnboardingStepOneSuccessPayload = {
  onboardingStartedTime: string;
};

export type OnboardingFinishSuccessPayload = {
  isOnboardingFinished: boolean;
};

// Действия
export function initOnboarding() {
  return async function (dispatch: Dispatch) {
    try {
      dispatch({
        type: ONBOARDING_INIT_LOADING,
      });

      const data = await getOnboardingRepository();

      dispatch({
        type: ONBOARDING_INIT_SUCCESS,
        payload: data,
      });
    } catch (e) {
      dispatch({
        type: ONBOARDING_INIT_ERROR,
        payload: {
          error: e.message,
        },
      });
    }
  };
}

// Слайс
const initialState: OnboardingStartState = {
  isLoading: false,
  loadingError: null,

  isOnboardingFinished: true,
  onboardingStartedTime: null,

  id: null,
  firstName: null,
  lastName: null,
  email: null,

  stepOneUpdating: false,
  stepOneError: null,

  finishUpdating: false,
  finishSuccessError: null,
};

export const onboardingStartSlice = (
  state: OnboardingStartState = initialState,
  action: OnboardingAction,
): OnboardingStartState => {
  switch (action.type) {
    case ONBOARDING_INIT_LOADING:
      return {
        ...state,
        isLoading: true,
        loadingError: null,
      };
    case ONBOARDING_INIT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        loadingError: null,
        isOnboardingFinished: action.payload.isOnboardingFinished,
        onboardingStartedTime: action.payload.onboardingStartedTime,
        id: action.payload.id,
        firstName: action.payload.firstName,
        lastName: action.payload.lastName,
        email: action.payload.email,
      };
    // Другие обработчики действий
    default:
      return state;
  }
};
```

### Репозитории

Репозитории для работы с API онбординга реализованы в директории `src/DodoExtensions/onBoarding/repository`:

1. **getOnboarding.repository.ts** - получение информации об онбординге
2. **putOnboarding.repository.ts** - обновление информации об онбординге
3. **postStatment.repository.ts** - создание заявки на доступ

```typescript
// getOnboarding.repository.ts
export const getOnboardingRepository: () => Promise<OnboardingSuccessPayload> =
  async () => {
    const getMe = makeApi<void, ResponseDto>({
      method: 'GET',
      endpoint: '/api/v1/onboarding/',
    });
    const dto = await getMe();

    return {
      id: dto.result.id,
      isOnboardingFinished: dto.result.is_onboarding_finished ?? false,
      onboardingStartedTime: dto.result.onboarding_started_time,
      firstName: dto.result.first_name,
      lastName: dto.result.last_name,
      email: dto.result.email,
    };
  };

// putOnboarding.repository.ts
export const putOnboardingRepository: (
  dodoRole: string,
) => Promise<OnboardingStepOneSuccessPayload> = async (dodoRole: string) => {
  const response = await SupersetClient.put({
    url: '/api/v1/onboarding/',
    body: JSON.stringify({
      dodo_role: dodoRole,
    }),
    headers: { 'Content-Type': 'application/json' },
    parseMethod: null,
  });

  const dto: ResponseDto = await response.json();

  return {
    onboardingStartedTime: dto.result.onboarding_started_time,
  };
};
```

## Процесс онбординга

Процесс онбординга в DODO состоит из следующих шагов:

1. **Шаг 1: Выбор роли**
   - Пользователь выбирает свою роль в DODO (например, аналитик, менеджер, разработчик)
   - Информация о роли сохраняется в базе данных

2. **Шаг 2: Выбор команды и ролей**
   - Пользователь выбирает существующую команду или создает новую
   - Пользователь выбирает роли, которые ему нужны для работы
   - Создается заявка на доступ к данным

3. **Шаг 3: Подтверждение**
   - Пользователь получает подтверждение о создании заявки
   - Администратор получает уведомление о новой заявке

4. **Шаг 4: Обработка заявки (административная часть)**
   - Администратор просматривает заявку
   - Администратор одобряет или отклоняет заявку
   - Пользователь получает уведомление о результате обработки заявки

## Техническая реализация

### Модель UserInfo

Модель `UserInfo` используется для хранения информации об онбординге пользователя:

```python
class UserInfo(Model):
    """Extra info about user"""

    __tablename__ = "user_info"

    id = Column(Integer, primary_key=True)
    is_onboarding_finished = Column(Boolean, default=False)  # DODO added #32839638
    onboarding_started_time = Column(DateTime, nullable=True)  # DODO added #32839638
    language = Column(String(32), default="ru")
    user_id = Column(Integer, ForeignKey("ab_user.id"))
    user = relationship(
        security_manager.user_model,
        backref=backref("user_info", uselist=False, lazy="joined"),
    )
    data_auth_dodo = Column(utils.MediumText())
    country_num = Column(Integer, nullable=True)
    country_name = Column(String, nullable=True)
    dodo_role = Column(String(32), nullable=True)
```

### Компонент OnBoardingEntryPoint

Компонент `OnBoardingEntryPoint` является точкой входа для процесса онбординга:

```tsx
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

### Хук useOnboarding

Хук `useOnboarding` управляет процессом онбординга:

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

  // Логика определения текущего шага онбординга
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

  const setStep3Passed = useCallback(() => {
    setStep(null);
  }, []);

  return {
    step,
    toStepTwo,
    closeOnboarding,
    setStep2Passed,
    setStep3Passed,
  };
};
```

## Примеры использования

### Получение информации об онбординге

```typescript
// Фронтенд
import { useSelector } from 'react-redux';
import { getIsOnboardingFinished, getOnboardingStartedTime } from 'src/DodoExtensions/onBoarding/model/selectors';

const MyComponent = () => {
  const isOnboardingFinished = useSelector(getIsOnboardingFinished);
  const onboardingStartedTime = useSelector(getOnboardingStartedTime);

  return (
    <div>
      <p>Онбординг завершен: {isOnboardingFinished ? 'Да' : 'Нет'}</p>
      <p>Время начала онбординга: {onboardingStartedTime}</p>
    </div>
  );
};
```

```python
# Бэкенд
from superset.daos.user_info import UserInfoDAO

# Получение информации об онбординге
user_id = g.user.id
user_info = UserInfoDAO.get_by_user_id(user_id)

# Проверка завершения онбординга
is_onboarding_finished = user_info.is_onboarding_finished

# Получение роли пользователя в DODO
dodo_role = user_info.dodo_role
```

### Обновление информации об онбординге

```typescript
// Фронтенд
import { useDispatch } from 'react-redux';
import { stepOneFinish } from 'src/DodoExtensions/onBoarding/model/actions/stepOneFinish';

const MyComponent = () => {
  const dispatch = useDispatch();

  const handleRoleSelect = (role: string) => {
    dispatch(stepOneFinish(role));
  };

  return (
    <div>
      <button onClick={() => handleRoleSelect('analyst')}>Аналитик</button>
      <button onClick={() => handleRoleSelect('manager')}>Менеджер</button>
      <button onClick={() => handleRoleSelect('developer')}>Разработчик</button>
    </div>
  );
};
```

```python
# Бэкенд
from superset.daos.user_info import UserInfoDAO
from datetime import datetime

# Обновление информации об онбординге
dodo_role = 'analyst'
started_time = datetime.utcnow()
UserInfoDAO.update_onboarding(dodo_role, started_time)
```

### Создание заявки на доступ

```typescript
// Фронтенд
import { useDispatch } from 'react-redux';
import { finishOnBoarding } from 'src/DodoExtensions/onBoarding/model/actions/finishOnBoarding';

const MyComponent = () => {
  const dispatch = useDispatch();

  const handleSubmit = (data: StepTwoPopupDto) => {
    dispatch(finishOnBoarding(data));
  };

  return (
    <form onSubmit={() => handleSubmit({
      isNewTeam: false,
      team: 'Team 1',
      teamSlug: 'team-1',
      isExternal: false,
      requestRoles: ['readonly', 'create-data']
    })}>
      {/* Форма для создания заявки */}
      <button type="submit">Отправить заявку</button>
    </form>
  );
};
```
