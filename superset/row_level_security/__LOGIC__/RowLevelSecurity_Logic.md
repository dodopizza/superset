# Документация по безопасности на уровне строк (Row Level Security) в DODO

## Содержание

1. [Введение](#введение)
2. [Архитектура](#архитектура)
3. [Основные компоненты](#основные-компоненты)
   - [API](#api)
   - [Схемы](#схемы)
   - [Модели](#модели)
   - [Команды](#команды)
4. [Типы фильтров RLS](#типы-фильтров-rls)
5. [Техническая реализация](#техническая-реализация)
6. [Примеры использования](#примеры-использования)

## Введение

Безопасность на уровне строк (Row Level Security, RLS) - это механизм, который позволяет ограничивать доступ пользователей к определенным строкам данных в таблицах. В Superset RLS реализован через систему фильтров, которые применяются к запросам в зависимости от ролей пользователя.

В DODO этот механизм используется для ограничения доступа пользователей к данным в зависимости от их ролей, команд и других атрибутов. Это позволяет обеспечить безопасность данных и соблюдение принципа минимальных привилегий.

## Архитектура

Модуль `row_level_security` организован следующим образом:

1. **Основные файлы**:
   - `__init__.py` - инициализация модуля
   - `api.py` - API для работы с правилами RLS
   - `schemas.py` - схемы для валидации и сериализации данных

2. **Связанные модули**:
   - `connectors/sqla/models.py` - модель `RowLevelSecurityFilter`
   - `commands/security` - команды для работы с правилами RLS
   - `daos/security.py` - DAO для работы с правилами RLS

3. **Интеграция с другими модулями**:
   - `security` - интеграция с системой безопасности Superset
   - `connectors/sqla` - интеграция с SQL-коннекторами

## Основные компоненты

### API

API для работы с правилами RLS реализовано в файле `superset/row_level_security/api.py` и предоставляет следующие эндпоинты:

1. **GET /api/v1/rowlevelsecurity/** - получение списка правил RLS
2. **GET /api/v1/rowlevelsecurity/{id}** - получение информации о правиле RLS по ID
3. **POST /api/v1/rowlevelsecurity/** - создание нового правила RLS
4. **PUT /api/v1/rowlevelsecurity/{id}** - обновление правила RLS
5. **DELETE /api/v1/rowlevelsecurity/{id}** - удаление правила RLS
6. **DELETE /api/v1/rowlevelsecurity/bulk_delete** - массовое удаление правил RLS
7. **GET /api/v1/rowlevelsecurity/related/{key}** - получение связанных объектов

```python
class RLSRestApi(BaseSupersetModelRestApi):
    datamodel = SQLAInterface(RowLevelSecurityFilter)
    include_route_methods = RouteMethod.REST_MODEL_VIEW_CRUD_SET | {
        RouteMethod.RELATED,
        "bulk_delete",
    }
    resource_name = "rowlevelsecurity"
    class_permission_name = "Row Level Security"
    openapi_spec_tag = "Row Level Security"
    method_permission_name = MODEL_API_RW_METHOD_PERMISSION_MAP
    allow_browser_login = True

    list_columns = [
        "id",
        "name",
        "filter_type",
        "tables.id",
        "tables.table_name",
        "roles.id",
        "roles.name",
        "clause",
        "changed_on_delta_humanized",
        "changed_by.first_name",
        "changed_by.last_name",
        "changed_by.id",
        "group_key",
    ]
    # ...
```

### Схемы

Схемы для валидации и сериализации данных реализованы в файле `superset/row_level_security/schemas.py`:

1. **RLSListSchema** - схема для списка правил RLS
2. **RLSShowSchema** - схема для отображения правила RLS
3. **RLSPostSchema** - схема для создания правила RLS
4. **RLSPutSchema** - схема для обновления правила RLS

```python
class RLSListSchema(Schema):
    id = fields.Integer(metadata={"description": "id_description"})
    name = fields.String(metadata={"description": "name_description"})
    filter_type = fields.String(
        metadata={"description": "filter_type_description"},
        validate=OneOf(
            [filter_type.value for filter_type in RowLevelSecurityFilterType]
        ),
    )
    roles = fields.List(fields.Nested(RolesSchema))
    tables = fields.List(fields.Nested(TablesSchema))
    clause = fields.String(metadata={"description": "clause_description"})
    changed_on_delta_humanized = fields.Function(
        RowLevelSecurityFilter.created_on_delta_humanized
    )
    # ...
```

### Модели

Модель для правил RLS реализована в файле `superset/connectors/sqla/models.py`:

```python
class RowLevelSecurityFilter(Model, AuditMixinNullable):
    """
    Custom where clauses attached to Tables and Roles.
    """

    __tablename__ = "row_level_security_filters"
    id = Column(Integer, primary_key=True)
    name = Column(String(255), unique=True, nullable=False)
    description = Column(Text)
    filter_type = Column(
        Enum(
            *[filter_type.value for filter_type in utils.RowLevelSecurityFilterType],
            name="filter_type_enum",
        ),
    )
    group_key = Column(String(255), nullable=True)
    roles = relationship(
        security_manager.role_model,
        secondary=RLSFilterRoles,
        backref="row_level_security_filters",
    )
    tables = relationship(
        SqlaTable,
        overlaps="table",
        secondary=RLSFilterTables,
        backref="row_level_security_filters",
    )
    clause = Column(utils.MediumText(), nullable=False)
    # ...
```

### Команды

Команды для работы с правилами RLS реализованы в модуле `superset/commands/security`:

1. **CreateRLSRuleCommand** - команда для создания правила RLS
2. **UpdateRLSRuleCommand** - команда для обновления правила RLS
3. **DeleteRLSRuleCommand** - команда для удаления правила RLS

```python
class UpdateRLSRuleCommand(BaseCommand):
    def __init__(self, model_id: int, data: dict[str, Any]):
        self._model_id = model_id
        self._properties = data.copy()
        self._model: Optional[RowLevelSecurityFilter] = None

    @transaction(on_error=partial(on_error, reraise=RuleUpdateFailedError))
    def run(self) -> RowLevelSecurityFilter:
        self.validate()
        assert self._model

        roles = populate_roles(self._properties.get("roles", []))
        tables = []
        if self._properties.get("tables", None):
            tables = (
                db.session.query(SqlaTable)
                .filter(SqlaTable.id.in_(self._properties.get("tables", [])))
                .all()
            )

        if not tables:
            raise DatasourceNotFoundValidationError()

        self._properties["roles"] = roles
        self._properties["tables"] = tables
        self._model = RLSDAO.update(self._model, self._properties)
        return self._model

    def validate(self) -> None:
        exceptions = []
        # Validate/populate model exists
        self._model = RLSDAO.find_by_id(self._model_id)
        if not self._model:
            raise RLSRuleNotFoundError()
        # ...
```

## Типы фильтров RLS

В Superset существуют следующие типы фильтров RLS:

1. **Regular** - обычный фильтр, который применяется к запросам
2. **Base** - базовый фильтр, который используется как основа для других фильтров

Типы фильтров определены в перечислении `RowLevelSecurityFilterType` в файле `superset/utils/core.py`:

```python
class RowLevelSecurityFilterType(Enum):
    REGULAR = "Regular"
    BASE = "Base"
```

## Техническая реализация

### Создание правила RLS

Процесс создания правила RLS включает следующие шаги:

1. Валидация данных с помощью схемы `RLSPostSchema`
2. Создание объекта `RowLevelSecurityFilter` с помощью команды `CreateRLSRuleCommand`
3. Сохранение объекта в базе данных

```python
@expose("/", methods=("POST",))
@protect()
@safe
@statsd_metrics
@requires_json
@event_logger.log_this_with_context(
    action=lambda self, *args, **kwargs: f"{self.__class__.__name__}.post",
    log_to_statsd=False,
)
def post(self) -> Response:
    """Create a new RLS rule."""
    try:
        item = self.add_model_schema.load(request.json)
    except ValidationError as error:
        return self.response_400(message=error.messages)

    try:
        new_model = CreateRLSRuleCommand(item).run()
        return self.response(201, id=new_model.id, result=item)
    except RolesNotFoundValidationError as ex:
        logger.error(
            "Role not found while creating RLS rule %s: %s",
            self.__class__.__name__,
            str(ex),
            exc_info=True,
        )
        return self.response_422(message=str(ex))
    except DatasourceNotFoundValidationError as ex:
        logger.error(
            "Table not found while creating RLS rule %s: %s",
            self.__class__.__name__,
            str(ex),
            exc_info=True,
        )
        return self.response_422(message=str(ex))
    except SQLAlchemyError as ex:
        logger.error(
            "Error creating RLS rule %s: %s",
            self.__class__.__name__,
            str(ex),
            exc_info=True,
        )
        return self.response_422(message=str(ex))
```

### Применение правил RLS

Правила RLS применяются к запросам в методе `get_sqla_query` класса `SqlaTable` в файле `superset/connectors/sqla/models.py`:

```python
def get_sqla_query(
    self,
    metrics: Optional[list[Metric]] = None,
    granularity: Optional[str] = None,
    from_dttm: Optional[datetime] = None,
    to_dttm: Optional[datetime] = None,
    columns: Optional[list[str]] = None,
    groupby: Optional[list[str]] = None,
    filter: Optional[list[utils.FilterOperator]] = None,
    is_timeseries: bool = True,
    timeseries_limit: Optional[int] = None,
    timeseries_limit_metric: Optional[Metric] = None,
    row_limit: Optional[int] = None,
    row_offset: Optional[int] = None,
    inner_from_dttm: Optional[datetime] = None,
    inner_to_dttm: Optional[datetime] = None,
    orderby: Optional[list[tuple[str, bool]]] = None,
    extras: Optional[dict[str, Any]] = None,
    order_desc: bool = True,
    is_rowcount: bool = False,
    apply_fetch_values_predicate: bool = False,
) -> SqlaQuery:
    # ...
    
    # Apply row level security filters
    security_manager.add_row_level_security_filters(self.query, self)
    
    # ...
```

## Примеры использования

### Создание правила RLS

```python
from superset.commands.security.create import CreateRLSRuleCommand
from superset.connectors.sqla.models import SqlaTable
from superset.extensions import db
from superset.security import security_manager

# Получение таблицы
table = db.session.query(SqlaTable).filter_by(id=1).one()

# Получение ролей
roles = security_manager.find_roles("Admin", "Gamma")

# Создание правила RLS
rule_data = {
    "name": "My RLS Rule",
    "description": "This is my RLS rule",
    "filter_type": "Regular",
    "tables": [table.id],
    "roles": [role.id for role in roles],
    "group_key": "my_group",
    "clause": "user_id = 1",
}

# Выполнение команды
rule = CreateRLSRuleCommand(rule_data).run()
```

### Обновление правила RLS

```python
from superset.commands.security.update import UpdateRLSRuleCommand
from superset.daos.security import RLSDAO

# Получение правила RLS
rule = RLSDAO.find_by_id(1)

# Обновление правила RLS
rule_data = {
    "name": "Updated RLS Rule",
    "description": "This is my updated RLS rule",
    "filter_type": "Regular",
    "tables": [1],
    "roles": [1, 2],
    "group_key": "my_group",
    "clause": "user_id = 2",
}

# Выполнение команды
updated_rule = UpdateRLSRuleCommand(rule.id, rule_data).run()
```

### Удаление правила RLS

```python
from superset.commands.security.delete import DeleteRLSRuleCommand

# Удаление правила RLS
DeleteRLSRuleCommand([1]).run()
```

### Применение правил RLS в запросах

```python
from superset.connectors.sqla.models import SqlaTable
from superset.extensions import db

# Получение таблицы
table = db.session.query(SqlaTable).filter_by(id=1).one()

# Создание запроса
query = table.get_sqla_query(
    metrics=["count"],
    filter=[],
    groupby=["user_id"],
)

# Правила RLS будут автоматически применены к запросу
```
