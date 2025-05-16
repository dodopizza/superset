# Документация по модулю Tags в DODO

## Содержание

1. [Введение](#введение)
2. [Архитектура](#архитектура)
3. [Основные компоненты](#основные-компоненты)
   - [Модели тегов](#модели-тегов)
   - [API для тегов](#api-для-тегов)
   - [Фильтры](#фильтры)
   - [Схемы](#схемы)
   - [Исключения](#исключения)
4. [DODO-специфичные модификации](#dodo-специфичные-модификации)
5. [Процесс работы с тегами](#процесс-работы-с-тегами)
6. [Техническая реализация](#техническая-реализация)
7. [Примеры использования](#примеры-использования)

## Введение

Модуль `tags` в Superset отвечает за управление тегами, которые могут быть прикреплены к различным объектам системы, таким как дашборды, чарты, запросы и датасеты. Теги позволяют организовывать и классифицировать объекты, а также облегчают поиск и фильтрацию.

В DODO этот модуль используется для организации и категоризации аналитических объектов, что помогает пользователям быстрее находить нужную информацию и эффективнее работать с системой.

## Архитектура

Модуль `tags` организован следующим образом:

1. **Основные файлы**:
   - `__init__.py` - инициализация модуля
   - `api.py` - API для работы с тегами
   - `core.py` - основные функции для работы с тегами
   - `exceptions.py` - исключения для модуля тегов
   - `filters.py` - фильтры для тегов
   - `models.py` - модели для тегов
   - `schemas.py` - схемы для валидации и сериализации данных

2. **Связанные модули**:
   - `commands/tag` - команды для работы с тегами
   - `daos/tag.py` - DAO для работы с тегами
   - `common/tags.py` - общие функции для работы с тегами

3. **Фронтенд-компоненты**:
   - `superset-frontend/src/components/Tags` - компоненты для отображения тегов
   - `superset-frontend/src/features/tags` - функциональность для работы с тегами
   - `superset-frontend/src/pages/Tags` - страница для управления тегами

## Основные компоненты

### Модели тегов

Модуль `models.py` содержит определения моделей для тегов:

1. **Tag** - модель для тега:
   ```python
   class Tag(Model, AuditMixinNullable):
       """A tag attached to an object (query, chart, dashboard, or dataset)."""

       __tablename__ = "tag"
       id = Column(Integer, primary_key=True)
       name = Column(String(250), unique=True)
       type = Column(Enum(TagType))
       description = Column(Text)

       objects = relationship(
           "TaggedObject", back_populates="tag", overlaps="objects,tags"
       )

       users_favorited = relationship(
           security_manager.user_model, secondary=user_favorite_tag_table
       )
   ```

2. **TaggedObject** - модель для связи тега с объектом:
   ```python
   class TaggedObject(Model, AuditMixinNullable):
       """An association between an object and a tag."""

       __tablename__ = "tagged_object"
       id = Column(Integer, primary_key=True)
       tag_id = Column(Integer, ForeignKey("tag.id"))
       object_id = Column(
           Integer,
           ForeignKey("dashboards.id"),
           ForeignKey("slices.id"),
           ForeignKey("saved_query.id"),
       )
       object_type = Column(Enum(ObjectType))

       tag = relationship("Tag", back_populates="objects", overlaps="tags")
       __table_args__ = (
           UniqueConstraint(
               "tag_id", "object_id", "object_type", name="uix_tagged_object"
           ),
       )
   ```

3. **TagType** - перечисление типов тегов:
   ```python
   class TagType(enum.Enum):
       """
       Types for tags.

       Objects (queries, charts, dashboards, and datasets) will have with implicit tags based
       on metadata: types, owners and who favorited them. This way, user "alice"
       can find all their objects by querying for the tag `owner:alice`.
       """

       # explicit tags, added manually by the owner
       custom = 1

       # implicit tags, generated automatically
       type = 2
       owner = 3
       favorited_by = 4
       team = 5
   ```

4. **ObjectType** - перечисление типов объектов:
   ```python
   class ObjectType(enum.Enum):
       """Object types."""

       # pylint: disable=invalid-name
       query = 1
       chart = 2
       dashboard = 3
       dataset = 4
   ```

### API для тегов

API для работы с тегами реализовано в файле `api.py` и предоставляет следующие эндпоинты:

1. **GET /api/v1/tag/** - получение списка тегов
2. **GET /api/v1/tag/{id}** - получение тега по идентификатору
3. **POST /api/v1/tag/** - создание нового тега
4. **PUT /api/v1/tag/{id}** - обновление тега
5. **DELETE /api/v1/tag/{id}** - удаление тега
6. **POST /api/v1/tag/bulk_delete** - массовое удаление тегов
7. **GET /api/v1/tag/objects/** - получение объектов, связанных с тегами
8. **GET /api/v1/tag/all_objects/** - получение всех объектов, связанных с тегами
9. **POST /api/v1/tag/{object_type}/{object_id}/tags/** - добавление тегов к объекту
10. **DELETE /api/v1/tag/{object_type}/{object_id}/{tag}/** - удаление тега у объекта
11. **POST /api/v1/tag/{id}/favorite** - добавление тега в избранное
12. **DELETE /api/v1/tag/{id}/favorite** - удаление тега из избранного
13. **GET /api/v1/tag/{id}/favorite** - проверка, находится ли тег в избранном
14. **POST /api/v1/tag/bulk_create** - массовое создание тегов

```python
class TagRestApi(BaseSupersetModelRestApi):
    datamodel = SQLAInterface(Tag)
    include_route_methods = RouteMethod.REST_MODEL_VIEW_CRUD_SET | {
        RouteMethod.RELATED,
        "bulk_delete",
        "get_objects",
        "get_all_objects",
        "add_objects",
        "delete_object",
        "add_favorite",
        "remove_favorite",
        "favorite_status",
        "bulk_create",
    }

    resource_name = "tag"
    allow_browser_login = True

    class_permission_name = "Tag"
    method_permission_name = MODEL_API_RW_METHOD_PERMISSION_MAP

    list_columns = [
        "id",
        "name",
        "type",
        "description",
        "changed_by.first_name",
        "changed_by.last_name",
        "changed_on_delta_humanized",
        "created_on_delta_humanized",
        "created_by.first_name",
        "created_by.last_name",
    ]
```

### Фильтры

Фильтры для тегов реализованы в файле `filters.py`:

1. **BaseTagNameFilter** - базовый фильтр для фильтрации объектов по имени тега:
   ```python
   class BaseTagNameFilter(BaseFilter):  # pylint: disable=too-few-public-methods
       """
       Base Custom filter for the GET list that filters all dashboards, slices
       and saved queries associated with a tag (by the tag name).
       """

       name = _("Is tagged")
       arg_name = ""
       class_name = ""
       """ The Tag class_name to user """
       model: type[Dashboard | Slice | SqllabQuery | SqlaTable] = Dashboard
       """ The SQLAlchemy model """

       def apply(self, query: Query, value: Any) -> Query:
           ilike_value = f"%{value}%"
           tags_query = (
               db.session.query(self.model.id)
               .join(self.model.tags)
               .filter(Tag.name.ilike(ilike_value))
           )
           return query.filter(self.model.id.in_(tags_query))
   ```

2. **BaseTagIdFilter** - базовый фильтр для фильтрации объектов по идентификатору тега:
   ```python
   class BaseTagIdFilter(BaseFilter):  # pylint: disable=too-few-public-methods
       """
       Base Custom filter for the GET list that filters all dashboards, slices
       and saved queries associated with a tag (by the tag ID).
       """

       name = _("Is tagged")
       arg_name = ""
       class_name = ""
       """ The Tag class_name to user """
       model: type[Dashboard | Slice | SqllabQuery | SqlaTable] = Dashboard
       """ The SQLAlchemy model """

       def apply(self, query: Query, value: Any) -> Query:
           tags_query = (
               db.session.query(self.model.id)
               .join(self.model.tags)
               .filter(Tag.id == value)
           )
           return query.filter(self.model.id.in_(tags_query))
   ```

3. **UserCreatedTagTypeFilter** - фильтр для фильтрации тегов по типу:
   ```python
   class UserCreatedTagTypeFilter(BaseFilter):  # pylint: disable=too-few-public-methods
       """
       Custom filter for the GET list that filters all user created tags.
       """

       name = _("Is user created")
       arg_name = "type"

       def apply(self, query: Query, value: Any) -> Query:
           if value == "custom":
               return query.filter(Tag.type == TagType.custom)
           return query
   ```

### Схемы

Схемы для валидации и сериализации данных реализованы в файле `schemas.py`:

```python
class TagPostSchema(Schema):
    name = fields.String(
        required=True,
        validate=[Length(1, 250)],
        metadata={"description": "A tag name"},
    )
    description = fields.String(
        metadata={"description": "A description for the tag"},
    )


class TagPutSchema(Schema):
    name = fields.String(
        required=False,
        validate=[Length(1, 250)],
        metadata={"description": "A tag name"},
    )
    description = fields.String(
        required=False,
        metadata={"description": "A description for the tag"},
    )


class TagGetResponseSchema(Schema):
    id = fields.Integer(metadata={"description": "The id of the tag"})
    name = fields.String(metadata={"description": "The name of the tag"})
    type = fields.String(metadata={"description": "The type of the tag"})
    description = fields.String(metadata={"description": "The description of the tag"})
    created_by = fields.Nested(UserSchema)
    changed_by = fields.Nested(UserSchema)
    created_on = fields.DateTime(metadata={"description": "The creation date of the tag"})
    changed_on = fields.DateTime(metadata={"description": "The last change date of the tag"})
```

### Исключения

Исключения для модуля тегов реализованы в файле `exceptions.py`:

```python
class InvalidTagNameError(ValidationError):
    """
    Marshmallow validation error for invalid Tag name
    """

    def __init__(self) -> None:
        super().__init__(
            [_("Tag name is invalid (cannot contain ':')")], field_name="name"
        )


class TagUpdateFailedError(UpdateFailedError):
    message = _("Tag could not be updated.")


class TagNotFoundError(CommandException):
    message = _("Tag could not be found.")


class TagInvalidError(CommandInvalidError):
    message = _("Tag parameters are invalid.")


class TagCreateFailedError(CreateFailedError):
    message = _("Tag could not be created.")


class TagDeleteFailedError(DeleteFailedError):
    message = _("Tag could not be deleted.")


class TaggedObjectNotFoundError(ObjectNotFoundError):
    def __init__(
        self, object_id: Optional[str] = None, exception: Optional[Exception] = None
    ) -> None:
        super().__init__("Tagged object", object_id, exception)


class TaggedObjectDeleteFailedError(DeleteFailedError):
    message = _("Tagged object could not be deleted.")
```

## DODO-специфичные модификации

В DODO модуль `tags` используется в основном в стандартном виде, без значительных модификаций. Однако, есть некоторые специфичные для DODO аспекты:

1. **Интеграция с системой команд DODO**:
   - Добавлен тип тега `team` в перечисление `TagType`
   - Это позволяет организовывать объекты по командам DODO

2. **Локализация**:
   - Сообщения об ошибках и названия полей локализованы на русский язык для пользователей DODO

3. **Интеграция с процессом онбординга**:
   - Теги используются для организации объектов, созданных в процессе онбординга новых пользователей

## Процесс работы с тегами

Процесс работы с тегами в Superset включает следующие шаги:

1. **Создание тегов**:
   - Пользователь может создать новый тег через API или интерфейс
   - Теги могут быть созданы автоматически при создании объектов (например, теги типа `owner:` или `type:`)

2. **Привязка тегов к объектам**:
   - Пользователь может привязать теги к объектам (дашбордам, чартам, запросам, датасетам)
   - Привязка может быть выполнена через API или интерфейс

3. **Поиск и фильтрация по тегам**:
   - Пользователь может искать объекты по тегам
   - Фильтрация может быть выполнена по имени тега или идентификатору

4. **Управление тегами**:
   - Пользователь может обновлять, удалять и добавлять теги в избранное
   - Администратор может управлять всеми тегами в системе

## Техническая реализация

### Создание тега

```python
@expose("/", methods=("POST",))
@protect()
@safe
@statsd_metrics
@event_logger.log_this_with_context(
    action=lambda self, *args, **kwargs: f"{self.__class__.__name__}.post",
    log_to_statsd=False,
)
def post(self) -> Response:
    """Creates a new Tag
    ---
    post:
      description: >-
        Create a new Tag.
      requestBody:
        description: Tag schema
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/{{self.__class__.__name__}}.post'
      responses:
        201:
          description: Tag added
          content:
            application/json:
              schema:
                type: object
                properties:
                  id:
                    type: number
                  result:
                    $ref: '#/components/schemas/{{self.__class__.__name__}}.post'
        400:
          $ref: '#/components/responses/400'
        401:
          $ref: '#/components/responses/401'
        404:
          $ref: '#/components/responses/404'
        422:
          $ref: '#/components/responses/422'
        500:
          $ref: '#/components/responses/500'
    """
    try:
        item = self.add_model_schema.load(request.json)
    # This validates custom Schema with custom validations
    except ValidationError as error:
        return self.response_400(message=error.messages)
    try:
        new_model = CreateCustomTagCommand(item).run()
        return self.response(201, id=new_model.id, result=item)
    except TagInvalidError as ex:
        return self.response_422(message=ex.normalized_messages())
    except TagCreateFailedError as ex:
        logger.error(
            "Error creating model %s: %s",
            self.__class__.__name__,
            str(ex),
            exc_info=True,
        )
        return self.response_422(message=str(ex))
```

### Добавление тегов к объекту

```python
@expose("/<int:object_type>/<int:object_id>/tags/", methods=("POST",))
@protect()
@safe
@statsd_metrics
@event_logger.log_this_with_context(
    action=lambda self, *args, **kwargs: f"{self.__class__.__name__}.add_objects",
    log_to_statsd=True,
)
def add_objects(self, object_type: int, object_id: int) -> Response:
    """Add multiple tags to a given object
    ---
    post:
      description: >-
        Add multiple tags to a given object
      parameters:
      - in: path
        schema:
          type: integer
        name: object_type
        description: The object type
      - in: path
        schema:
          type: integer
        name: object_id
        description: The object id
      requestBody:
        description: Tags to be added
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                properties:
                  type: object
                  properties:
                    tags:
                      description: Array of tag names
                      type: array
                      items:
                        type: string
      responses:
        201:
          description: Tags added
        400:
          $ref: '#/components/responses/400'
        401:
          $ref: '#/components/responses/401'
        404:
          $ref: '#/components/responses/404'
        500:
          $ref: '#/components/responses/500'
    """
    try:
        tags = request.json["properties"]["tags"]
        # This validates custom Schema with custom validations
        CreateCustomTagCommand(object_type, object_id, tags).run()
        return self.response(201)
    except KeyError:
        return self.response(
            400,
            message="Missing required field 'tags' in 'properties'",
        )
    except TagInvalidError:
        return self.response(422, message="Invalid tag")
```

### Получение объектов по тегам

```python
@expose("/objects/", methods=("GET",))
@protect()
@safe
@statsd_metrics
@event_logger.log_this_with_context(
    action=lambda self, *args, **kwargs: f"{self.__class__.__name__}.get_objects",
    log_to_statsd=True,
)
def get_objects(self) -> Response:
    """Get all objects associated with a tag
    ---
    get:
      description: >-
        Get all objects associated with a tag
      parameters:
      - in: query
        name: tags
        schema:
          type: string
        description: >-
          A comma separated list of tag names
      - in: query
        name: types
        schema:
          type: string
        description: >-
          A comma separated list of object types that should be fetched.
          Valid types are: dashboard, chart, saved_query
      - in: query
        name: tag_ids
        schema:
          type: string
        description: >-
          A comma separated list of tag ids
      responses:
        200:
          description: All objects associated with the tags
          content:
            application/json:
              schema:
                type: object
                properties:
                  result:
                    type: array
                    items:
                      $ref: '#/components/schemas/TaggedObjectEntityResponseSchema'
        400:
          $ref: '#/components/responses/400'
        401:
          $ref: '#/components/responses/401'
        404:
          $ref: '#/components/responses/404'
        500:
          $ref: '#/components/responses/500'
    """
    tag_ids = [
        int(tag_id) for tag_id in request.args.get("tag_ids", "").split(",") if tag_id
    ]
    tags = [tag for tag in request.args.get("tags", "").split(",") if tag]
    # filter types
    types = [type_ for type_ in request.args.get("types", "").split(",") if type_]

    try:
        if tag_ids:
            # priotize using ids for lookups vs. names mainly using this
            # for backward compatibility
            tagged_objects = TagDAO.get_tagged_objects_by_tag_id(tag_ids, types)
        else:
            tagged_objects = TagDAO.get_tagged_objects_for_tags(tags, types)

        result = [
            self.object_entity_response_schema.dump(tagged_object)
            for tagged_object in tagged_objects
        ]
        return self.response(200, result=result)
    except TagInvalidError as ex:
        return self.response_422(message=ex.normalized_messages())
```

### Автоматическое добавление тегов при создании объектов

```python
class ObjectUpdater:
    object_type: str = "default"

    @classmethod
    def get_owners_ids(
        cls, target: Dashboard | FavStar | Slice | Query | SqlaTable
    ) -> list[int]:
        raise NotImplementedError("Subclass should implement `get_owners_ids`")

    @classmethod
    def get_owner_tag_ids(
        cls,
        session: orm.Session,  # pylint: disable=disallowed-name
        target: Dashboard | FavStar | Slice | Query | SqlaTable,
    ) -> set[int]:
        tag_ids = set()
        for owner_id in cls.get_owners_ids(target):
            name = f"owner:{owner_id}"
            tag = get_tag(name, session, TagType.owner)
            tag_ids.add(tag.id)
        return tag_ids

    @classmethod
    def _add_owners(
        cls,
        session: orm.Session,  # pylint: disable=disallowed-name
        target: Dashboard | FavStar | Slice | Query | SqlaTable,
    ) -> None:
        tag_ids = cls.get_owner_tag_ids(session, target)
        for tag_id in tag_ids:
            cls.add_tag_object_if_not_tagged(
                session, tag_id=tag_id, object_id=target.id, object_type=cls.object_type
            )

    @classmethod
    def after_insert(
        cls,
        _mapper: Mapper,
        connection: Connection,
        target: Dashboard | FavStar | Slice | Query | SqlaTable,
    ) -> None:
        with Session(bind=connection) as session:  # pylint: disable=disallowed-name
            # add `owner:` tags
            cls._add_owners(session, target)

            # add `type:` tags
            tag = get_tag(f"type:{cls.object_type}", session, TagType.type)
            cls.add_tag_object_if_not_tagged(
                session, tag_id=tag.id, object_id=target.id, object_type=cls.object_type
            )
            session.commit()
```

## Примеры использования

### Создание тега

```python
from superset.commands.tag.create import CreateCustomTagCommand

# Создание тега
item = {
    "name": "important",
    "description": "Important objects",
}

tag = CreateCustomTagCommand(item).run()
print(f"Tag ID: {tag.id}, Name: {tag.name}")
```

### Добавление тегов к объекту

```python
from superset.commands.tag.create import CreateCustomTagWithRelationshipsCommand
from superset.tags.models import ObjectType

# Добавление тегов к дашборду
object_type = ObjectType.dashboard.value
object_id = 1
tags = ["important", "finance", "sales"]

CreateCustomTagWithRelationshipsCommand(object_type, object_id, tags).run()
```

### Получение объектов по тегам

```python
from superset.daos.tag import TagDAO

# Получение объектов по имени тега
tags = ["important"]
types = ["dashboard", "chart"]
tagged_objects = TagDAO.get_tagged_objects_for_tags(tags, types)

# Вывод информации об объектах
for obj in tagged_objects:
    print(f"Type: {obj.type}, ID: {obj.id}, Name: {obj.name}")
```

### Использование в DODO

В DODO модуль `tags` используется для организации и категоризации аналитических объектов. Примеры использования:

1. **Организация дашбордов по командам**:
   ```python
   from superset.commands.tag.create import CreateCustomTagWithRelationshipsCommand
   from superset.tags.models import ObjectType

   # Добавление тега команды к дашборду
   object_type = ObjectType.dashboard.value
   object_id = 1
   tags = ["team:data-engineering"]

   CreateCustomTagWithRelationshipsCommand(object_type, object_id, tags).run()
   ```

2. **Поиск объектов, созданных определенным пользователем**:
   ```python
   from superset.daos.tag import TagDAO

   # Получение объектов, созданных пользователем
   tags = ["owner:1"]  # ID пользователя
   types = ["dashboard", "chart"]
   tagged_objects = TagDAO.get_tagged_objects_for_tags(tags, types)

   # Вывод информации об объектах
   for obj in tagged_objects:
       print(f"Type: {obj.type}, ID: {obj.id}, Name: {obj.name}")
   ```

3. **Категоризация чартов по типу данных**:
   ```python
   from superset.commands.tag.create import CreateCustomTagWithRelationshipsCommand
   from superset.tags.models import ObjectType

   # Добавление тегов категорий к чарту
   object_type = ObjectType.chart.value
   object_id = 1
   tags = ["sales", "finance", "monthly"]

   CreateCustomTagWithRelationshipsCommand(object_type, object_id, tags).run()
   ```
