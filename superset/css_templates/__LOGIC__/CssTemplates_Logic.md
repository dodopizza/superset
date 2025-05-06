# Документация по CSS-шаблонам (CSS Templates) в DODO

## Содержание

1. [Введение](#введение)
2. [Архитектура](#архитектура)
3. [Стандартная функциональность](#стандартная-функциональность)
4. [DODO-специфичная функциональность](#dodo-специфичная-функциональность)
5. [Техническая реализация](#техническая-реализация)
6. [API](#api)

## Введение

Модуль `css_templates` предоставляет функциональность для создания и управления CSS-шаблонами в Superset. CSS-шаблоны позволяют пользователям настраивать внешний вид дашбордов с помощью пользовательских CSS-стилей, что дает возможность создавать уникальный дизайн и улучшать визуальное представление данных.

В DODO этот модуль используется для стандартной настройки внешнего вида дашбордов, без каких-либо специфичных модификаций.

## Архитектура

Модуль состоит из следующих основных компонентов:

1. **Модель данных** (`models/core.py`):
   - `CssTemplate` - модель для хранения CSS-шаблонов

2. **API** (`css_templates/api.py`):
   - `CssTemplateRestApi` - REST API для работы с CSS-шаблонами
   - Предоставляет эндпоинты для создания, чтения, обновления и удаления CSS-шаблонов

3. **Схемы** (`css_templates/schemas.py`):
   - Схемы для валидации запросов и сериализации ответов

4. **Фильтры** (`css_templates/filters.py`):
   - `CssTemplateAllTextFilter` - фильтр для поиска CSS-шаблонов по тексту

5. **Фронтенд** (`superset-frontend/src/features/cssTemplates/`):
   - `CssTemplateModal.tsx` - компонент для создания и редактирования CSS-шаблонов
   - `types.ts` - типы для работы с CSS-шаблонами

## Стандартная функциональность

Стандартная функциональность модуля `css_templates` включает:

1. **Управление CSS-шаблонами**:
   - Создание, чтение, обновление и удаление CSS-шаблонов
   - Поиск CSS-шаблонов по имени и содержимому

2. **Применение CSS-шаблонов к дашбордам**:
   - Возможность применить CSS-шаблон к дашборду для изменения его внешнего вида
   - Предварительный просмотр CSS-шаблона

3. **Редактор CSS**:
   - Встроенный редактор CSS с подсветкой синтаксиса
   - Возможность создавать сложные CSS-стили

## DODO-специфичная функциональность

В результате анализа кода **не обнаружено DODO-специфичных изменений или расширений** в модуле `css_templates`. Весь код в этом модуле является стандартным для Superset.

Модуль `css_templates` используется в DODO в стандартном виде, без каких-либо специфичных модификаций или расширений. CSS-шаблоны могут использоваться для настройки внешнего вида дашбордов, но сам механизм работы с ними не был изменен.

Однако, стоит отметить, что в директории `superset-frontend/src/DodoExtensions/explore/components/controls/` есть компоненты для условного форматирования, которые используют CSS-стили для изменения внешнего вида элементов на основе условий. Эти компоненты не являются частью модуля `css_templates`, но они связаны с визуальным оформлением и могут использовать CSS-стили.

## Техническая реализация

### Модель данных

Модель `CssTemplate` используется для хранения CSS-шаблонов:

```python
class CssTemplate(Model, AuditMixinNullable):
    """CSS templates for dashboards"""

    __tablename__ = "css_templates"
    id = Column(Integer, primary_key=True)
    template_name = Column(String(250))
    css = Column(utils.MediumText(), default="")
```

### API для работы с CSS-шаблонами

API для работы с CSS-шаблонами реализовано в классе `CssTemplateRestApi`:

```python
class CssTemplateRestApi(BaseSupersetModelRestApi):
    datamodel = SQLAInterface(CssTemplate)

    include_route_methods = RouteMethod.REST_MODEL_VIEW_CRUD_SET | {
        RouteMethod.RELATED,
        "bulk_delete",  # not using RouteMethod since locally defined
    }
    class_permission_name = "CssTemplate"
    method_permission_name = MODEL_API_RW_METHOD_PERMISSION_MAP

    resource_name = "css_template"
    allow_browser_login = True

    show_columns = [
        "changed_on_delta_humanized",
        "changed_by.first_name",
        "changed_by.id",
        "changed_by.last_name",
        "created_by.first_name",
        "created_by.id",
        "created_by.last_name",
        "css",
        "id",
        "template_name",
    ]
    list_columns = [
        "changed_on_delta_humanized",
        "changed_by.first_name",
        "changed_by.id",
        "changed_by.last_name",
        "created_on",
        "created_by.first_name",
        "created_by.id",
        "created_by.last_name",
        "css",
        "id",
        "template_name",
    ]
    add_columns = ["css", "template_name"]
    edit_columns = add_columns
    order_columns = ["template_name"]

    search_filters = {"template_name": [CssTemplateAllTextFilter]}
    allowed_rel_fields = {"created_by", "changed_by"}
```

### Фильтры для поиска CSS-шаблонов

Фильтр `CssTemplateAllTextFilter` используется для поиска CSS-шаблонов по тексту:

```python
class CssTemplateAllTextFilter(BaseFilter):  # pylint: disable=too-few-public-methods
    name = _("All Text")
    arg_name = "css_template_all_text"

    def apply(self, query: Query, value: Any) -> Query:
        if not value:
            return query
        ilike_value = f"%{value}%"
        return query.filter(
            or_(
                CssTemplate.template_name.ilike(ilike_value),
                CssTemplate.css.ilike(ilike_value),
            )
        )
```

### Фронтенд-компоненты

Компонент `CssTemplateModal` используется для создания и редактирования CSS-шаблонов:

```typescript
const CssTemplateModal: FunctionComponent<CssTemplateModalProps> = ({
  addDangerToast,
  onCssTemplateAdd,
  onHide,
  show,
  cssTemplate = null,
}) => {
  const [disableSave, setDisableSave] = useState<boolean>(true);
  const [currentCssTemplate, setCurrentCssTemplate] =
    useState<TemplateObject | null>(null);
  const [isHidden, setIsHidden] = useState<boolean>(true);
  const isEditMode = cssTemplate !== null;

  // cssTemplate fetch logic
  const {
    state: { loading, resource },
    fetchResource,
    createResource,
    updateResource,
  } = useSingleViewResource<TemplateObject>(
    'css_template',
    t('css_template'),
    addDangerToast,
  );

  // Functions
  const hide = () => {
    setIsHidden(true);
    onHide();
  };
```

## API

### Получение списка CSS-шаблонов

```
GET /api/v1/css_template/
```

### Получение конкретного CSS-шаблона

```
GET /api/v1/css_template/{id}
```

### Создание CSS-шаблона

```
POST /api/v1/css_template/
```

Тело запроса:

```json
{
  "template_name": "My Template",
  "css": "body { background-color: #f0f0f0; }"
}
```

### Обновление CSS-шаблона

```
PUT /api/v1/css_template/{id}
```

Тело запроса:

```json
{
  "template_name": "My Updated Template",
  "css": "body { background-color: #e0e0e0; }"
}
```

### Удаление CSS-шаблона

```
DELETE /api/v1/css_template/{id}
```

### Массовое удаление CSS-шаблонов

```
DELETE /api/v1/css_template/?q={"ids":[1,2,3]}
```
