# Документация по представлениям дашбордов (Dashboard Views) в DODO

## Содержание

1. [Введение](#введение)
2. [Архитектура](#архитектура)
3. [Основные компоненты](#основные-компоненты)
   - [DashboardMixin](#dashboardmixin)
   - [DashboardModelView](#dashboardmodelview)
   - [Dashboard](#dashboard)
   - [DashboardModelViewAsync](#dashboardmodelviewasync)
4. [DODO-специфичные модификации](#dodo-специфичные-модификации)
   - [Локализация заголовков дашбордов](#локализация-заголовков-дашбордов)
   - [Интеграция с системой команд](#интеграция-с-системой-команд)
   - [Расширения для фильтров](#расширения-для-фильтров)
5. [Процесс работы с дашбордами](#процесс-работы-с-дашбордами)
6. [Техническая реализация](#техническая-реализация)
7. [Примеры использования](#примеры-использования)

## Введение

Модуль `views/dashboard` в Superset отвечает за представления дашбордов в пользовательском интерфейсе. Он предоставляет классы и функции для отображения, создания, редактирования и удаления дашбордов, а также для работы с ними через API.

В DODO этот модуль был расширен для поддержки локализации заголовков дашбордов, интеграции с системой команд DODO и расширений для фильтров.

## Архитектура

Модуль `views/dashboard` организован следующим образом:

1. **Основные файлы**:
   - `__init__.py` - инициализация модуля
   - `mixin.py` - миксины для представлений дашбордов
   - `views.py` - представления для дашбордов

2. **Связанные модули**:
   - `models/dashboard.py` - модель для дашбордов
   - `dashboards/api.py` - API для дашбордов
   - `dashboards/filters.py` - фильтры для дашбордов
   - `dashboards/commands` - команды для работы с дашбордами

3. **Фронтенд-компоненты**:
   - `superset-frontend/src/dashboard` - компоненты для отображения дашбордов
   - `superset-frontend/src/DodoExtensions/FilterSets` - DODO-специфичные расширения для фильтров

## Основные компоненты

### DashboardMixin

Миксин `DashboardMixin` в файле `mixin.py` определяет общие свойства и методы для представлений дашбордов:

```python
class DashboardMixin:  # pylint: disable=too-few-public-methods
    list_title = _("Dashboards")
    show_title = _("Show Dashboard")
    add_title = _("Add Dashboard")
    edit_title = _("Edit Dashboard")

    list_columns = ["dashboard_link", "creator", "published", "modified"]
    order_columns = ["dashboard_link", "modified", "published"]
    edit_columns = [
        "dashboard_title",
        "slug",
        "owners",
        "roles",
        "position_json",
        "css",
        "json_metadata",
        "published",
    ]
    show_columns = edit_columns + ["charts"]
    search_columns = ("dashboard_title", "slug", "owners", "published")
    add_columns = edit_columns
    base_order = ("changed_on", "desc")
    description_columns = {
        "position_json": _(
            "This json object describes the positioning of the widgets in "
            "the dashboard. It is dynamically generated when adjusting "
            "the widgets size and positions by using drag & drop in "
            "the dashboard view"
        ),
        "css": _(
            "The CSS for individual dashboards can be altered here, or "
            "in the dashboard view where changes are immediately "
            "visible"
        ),
    }
    base_filters = [["slice", DashboardAccessFilter, lambda: []]]
    label_columns = {
        "dashboard_link": _("Dashboard"),
        "dashboard_title": _("Title"),
        "slug": _("Slug"),
        "charts": _("Charts"),
        "owners": _("Owners"),
        "roles": _("Roles"),
        "published": _("Published"),
        "creator": _("Creator"),
        "modified": _("Modified"),
        "position_json": _("Position JSON"),
        "css": _("CSS"),
        "json_metadata": _("JSON Metadata"),
    }

    def pre_delete(self, item: "DashboardMixin") -> None:
        security_manager.raise_for_ownership(item)
```

Этот миксин определяет заголовки, столбцы для поиска, отображения и редактирования, а также другие свойства для представлений дашбордов.

### DashboardModelView

Класс `DashboardModelView` в файле `views.py` наследуется от `DashboardMixin` и предоставляет представление для дашбордов:

```python
class DashboardModelView(DashboardMixin, SupersetModelView, DeleteMixin):  # pylint: disable=too-many-ancestors
    route_base = "/dashboard"
    datamodel = SQLAInterface(DashboardModel)
    # TODO disable api_read and api_delete (used by cypress)
    # once we move to ChartRestModelApi
    class_permission_name = "Dashboard"
    method_permission_name = MODEL_VIEW_RW_METHOD_PERMISSION_MAP

    include_route_methods = {
        RouteMethod.LIST,
        RouteMethod.API_READ,
        RouteMethod.API_DELETE,
        "download_dashboards",
    }

    @expose_api(name="read", url="/api/read", methods=["GET"])
    @has_access_api
    @permission_name("list")
    @deprecated(eol_version="5.0.0")
    def api_read(self) -> FlaskResponse:
        return super().api_read()

    @expose_api(name="delete", url="/api/delete/<pk>", methods=["DELETE"])
    @has_access_api
    @permission_name("delete")
    @deprecated(eol_version="5.0.0")
    def api_delete(self, pk: int) -> FlaskResponse:
        return super().delete(pk)

    @has_access
    @expose("/list/")
    def list(self) -> FlaskResponse:
        return super().render_app_template()

    @action("mulexport", __("Export"), __("Export dashboards?"), "fa-database")
    def mulexport(
        self,
        items: Union["DashboardModelView", builtins.list["DashboardModelView"]],
    ) -> FlaskResponse:
        if not isinstance(items, list):
            items = [items]
        ids = "".join(f"&id={d.id}" for d in items)
        return redirect(f"/dashboard/export_dashboards_form?{ids[1:]}")
```

Этот класс предоставляет методы для добавления, обновления, удаления и отображения дашбордов, а также для экспорта дашбордов.

### Dashboard

Класс `Dashboard` в файле `views.py` наследуется от `BaseSupersetView` и предоставляет базовые представления для дашбордов:

```python
class Dashboard(BaseSupersetView):
    """The base views for Superset!"""

    class_permission_name = "Dashboard"
    method_permission_name = MODEL_VIEW_RW_METHOD_PERMISSION_MAP

    @has_access
    @expose("/new/")
    def new(self) -> FlaskResponse:
        """Creates a new, blank dashboard and redirects to it in edit mode"""
        new_dashboard = DashboardModel(
            dashboard_title="[ untitled dashboard ]",
            owners=[g.user],
        )
        db.session.add(new_dashboard)
        db.session.commit()  # pylint: disable=consider-using-transaction
        if team := TeamDAO.get_team_by_user_id():
            team_slug = team.slug
            object_type = ObjectType.dashboard
            object_id = new_dashboard.id
            CreateTeamTagCommand(object_type, object_id, [team_slug]).run()
        return redirect(f"/superset/dashboard/{new_dashboard.id}/?edit=true")

    @expose("/<dashboard_id_or_slug>/embedded")
    @event_logger.log_this_with_extra_payload
    def embedded(
        self,
        dashboard_id_or_slug: str,
        add_extra_log_payload: Callable[..., None] = lambda **kwargs: None,
    ) -> FlaskResponse:
        """
        Server side rendering for a dashboard
        :param dashboard_id_or_slug: identifier for dashboard. used in the decorators
        :param add_extra_log_payload: added by `log_this_with_manual_updates`, set a
            default value to appease pylint
        """
        if not is_feature_enabled("EMBEDDED_SUPERSET"):
            return Response(status=404)

        # Log in as an anonymous user, just for this view.
        # This view needs to be visible to all users,
        # and building the page fails if g.user and/or ctx.user aren't present.
        login_user(AnonymousUserMixin(), force=True)

        add_extra_log_payload(
            dashboard_id=dashboard_id_or_slug,
            dashboard_version="v2",
        )

        bootstrap_data = {
            "common": common_bootstrap_payload(),
            "embedded": {"dashboard_id": dashboard_id_or_slug},
        }

        return self.render_template(
            "superset/spa.html",
            entry="embedded",
            bootstrap_data=json.dumps(
                bootstrap_data, default=json.pessimistic_json_iso_dttm_ser
            ),
        )
```

Этот класс предоставляет методы для создания нового дашборда и отображения встроенного дашборда.

### DashboardModelViewAsync

Класс `DashboardModelViewAsync` в файле `views.py` наследуется от `DashboardModelView` и предоставляет асинхронное представление для дашбордов:

```python
class DashboardModelViewAsync(DashboardModelView):  # pylint: disable=too-many-ancestors
    route_base = "/dashboardasync"
    class_permission_name = "Dashboard"
    method_permission_name = MODEL_VIEW_RW_METHOD_PERMISSION_MAP

    include_route_methods = {RouteMethod.API_READ}

    list_columns = [
        "id",
        "dashboard_link",
        "creator",
        "modified",
        "dashboard_title",
        "changed_on",
        "url",
        "changed_by_name",
    ]
    label_columns = {
        "dashboard_link": _("Dashboard"),
        "dashboard_title": _("Title"),
        "creator": _("Creator"),
        "modified": _("Modified"),
    }

    @expose_api(name="read", url="/api/read", methods=["GET"])
    @has_access_api
    @permission_name("list")
    @deprecated(eol_version="5.0.0")
    def api_read(self) -> FlaskResponse:
        return super().api_read()
```

Этот класс предоставляет асинхронное API для получения списка дашбордов.

## DODO-специфичные модификации

### Локализация заголовков дашбордов

В DODO была добавлена поддержка локализации заголовков дашбордов:

1. **Модель Dashboard**:
   - Добавлено поле `dashboard_title_ru` для хранения заголовка дашборда на русском языке
   - Задача: #44120746
   - Файл: `models/dashboard.py`

   ```python
   class Dashboard(AuditMixinNullable, ImportExportMixin, Model):
       """The dashboard object!"""

       __tablename__ = "dashboards"
       id = Column(Integer, primary_key=True)
       dashboard_title = Column(String(500))
       dashboard_title_ru = Column(String(500))  # dodo added 44120746
       position_json = Column(utils.MediumText())
       description = Column(Text)
       css = Column(utils.MediumText())
       certified_by = Column(Text)
       certification_details = Column(Text)
       json_metadata = Column(utils.MediumText())
       slug = Column(String(255), unique=True)
       slices: list[Slice] = relationship(
           Slice, secondary=dashboard_slices, backref="dashboards"
       )
       owners = relationship(
           security_manager.user_model,
           secondary=dashboard_user,
           passive_deletes=True,
       )
   ```

2. **Фильтр DashboardTitleOrSlugFilter**:
   - Добавлена поддержка поиска по заголовку дашборда на русском языке
   - Задача: #44120742
   - Файл: `dashboards/filters.py`

   ```python
   class DashboardTitleOrSlugFilter(BaseFilter):  # pylint: disable=too-few-public-methods
       name = _("Title or Slug")
       arg_name = "title_or_slug"

       def apply(self, query: Query, value: Any) -> Query:
           if not value:
               return query
           ilike_value = f"%{value}%"
           return query.filter(
               or_(
                   Dashboard.dashboard_title.ilike(ilike_value),
                   Dashboard.slug.ilike(ilike_value),
                   Dashboard.dashboard_title_ru.ilike(ilike_value),  # dodo added 44120742
                   cast(Dashboard.id, String).ilike(ilike_value),  # dodo added 44120742
               )
           )
   ```

3. **Фронтенд-компоненты**:
   - Добавлена поддержка отображения заголовка дашборда на русском языке
   - Задача: #44120742
   - Файлы:
     - `superset-frontend/src/dashboard/containers/DashboardHeader.jsx`
     - `superset-frontend/src/dashboard/components/Header/types.ts`

   ```typescript
   interface HeaderDropdownPropsDodoExtended {
     dashboardTitleRU: string; // DODO added 44120742
   }
   ```

### Интеграция с системой команд

В DODO была добавлена интеграция с системой команд для управления доступом к дашбордам:

1. **Создание нового дашборда**:
   - При создании нового дашборда автоматически добавляется тег команды пользователя
   - Файл: `views/dashboard/views.py`

   ```python
   @has_access
   @expose("/new/")
   def new(self) -> FlaskResponse:
       """Creates a new, blank dashboard and redirects to it in edit mode"""
       new_dashboard = DashboardModel(
           dashboard_title="[ untitled dashboard ]",
           owners=[g.user],
       )
       db.session.add(new_dashboard)
       db.session.commit()  # pylint: disable=consider-using-transaction
       if team := TeamDAO.get_team_by_user_id():
           team_slug = team.slug
           object_type = ObjectType.dashboard
           object_id = new_dashboard.id
           CreateTeamTagCommand(object_type, object_id, [team_slug]).run()
       return redirect(f"/superset/dashboard/{new_dashboard.id}/?edit=true")
   ```

2. **Фильтрация дашбордов по командам**:
   - Дашборды могут быть отфильтрованы по командам пользователя
   - Пользователи видят только дашборды, к которым у их команды есть доступ

3. **Назначение владельцев дашбордов**:
   - Дашборды могут быть назначены командам в качестве владельцев
   - Команды могут управлять доступом к своим дашбордам

### Расширения для фильтров

В DODO были добавлены расширения для фильтров, которые предоставляют дополнительные возможности для фильтрации данных на дашбордах:

1. **FilterSets**:
   - Добавлена возможность сохранения и применения наборов фильтров
   - Добавлена возможность обмена наборами фильтров между пользователями
   - Задача: #44211751
   - Файлы:
     - `superset-frontend/src/DodoExtensions/FilterSets/index.tsx`
     - `superset-frontend/src/DodoExtensions/FilterSets/FilterSetUnit.tsx`
     - `superset-frontend/src/DodoExtensions/FilterSets/FiltersHeader.tsx`
     - `superset-frontend/src/DodoExtensions/FilterSets/Footer.tsx`
     - `superset-frontend/src/DodoExtensions/FilterSets/EditSection.tsx`
     - `superset-frontend/src/dashboard/actions/nativeFilters.ts`

2. **Действия для фильтров**:
   - Добавлены действия для работы с фильтрами дашбордов
   - Файл: `superset-frontend/src/dashboard/actions/dashboardFilters.js`

   ```javascript
   export const CHANGE_FILTER = 'CHANGE_FILTER';
   export function changeFilter(chartId, newSelectedValues, merge) {
     return (dispatch, getState) => {
       if (isValidFilter(getState, chartId)) {
         const components = getState().dashboardLayout.present;
         return dispatch({
           type: CHANGE_FILTER,
           chartId,
           newSelectedValues,
           merge,
           components,
         });
       }
       return getState().dashboardFilters;
     };
   }
   ```

## Процесс работы с дашбордами

Процесс работы с дашбордами в DODO включает следующие шаги:

1. **Создание дашборда**:
   - Пользователь создает новый дашборд
   - Дашборд автоматически получает тег команды пользователя
   - Пользователь добавляет графики на дашборд
   - Пользователь настраивает расположение графиков
   - Пользователь сохраняет дашборд

2. **Просмотр дашборда**:
   - Пользователь может просматривать дашборд
   - Пользователь может применять фильтры к дашборду
   - Пользователь может сохранять наборы фильтров

3. **Редактирование дашборда**:
   - Пользователь может изменять расположение графиков
   - Пользователь может добавлять и удалять графики
   - Пользователь может изменять название и описание дашборда
   - Пользователь может изменять владельцев дашборда

4. **Удаление дашборда**:
   - Пользователь может удалить дашборд, если у него есть соответствующие права

## Техническая реализация

### DashboardModelView

```python
class DashboardModelView(DashboardMixin, SupersetModelView, DeleteMixin):  # pylint: disable=too-many-ancestors
    route_base = "/dashboard"
    datamodel = SQLAInterface(DashboardModel)
    # TODO disable api_read and api_delete (used by cypress)
    # once we move to ChartRestModelApi
    class_permission_name = "Dashboard"
    method_permission_name = MODEL_VIEW_RW_METHOD_PERMISSION_MAP

    include_route_methods = {
        RouteMethod.LIST,
        RouteMethod.API_READ,
        RouteMethod.API_DELETE,
        "download_dashboards",
    }

    @expose_api(name="read", url="/api/read", methods=["GET"])
    @has_access_api
    @permission_name("list")
    @deprecated(eol_version="5.0.0")
    def api_read(self) -> FlaskResponse:
        return super().api_read()

    @expose_api(name="delete", url="/api/delete/<pk>", methods=["DELETE"])
    @has_access_api
    @permission_name("delete")
    @deprecated(eol_version="5.0.0")
    def api_delete(self, pk: int) -> FlaskResponse:
        return super().delete(pk)

    @has_access
    @expose("/list/")
    def list(self) -> FlaskResponse:
        return super().render_app_template()

    @action("mulexport", __("Export"), __("Export dashboards?"), "fa-database")
    def mulexport(
        self,
        items: Union["DashboardModelView", builtins.list["DashboardModelView"]],
    ) -> FlaskResponse:
        if not isinstance(items, list):
            items = [items]
        ids = "".join(f"&id={d.id}" for d in items)
        return redirect(f"/dashboard/export_dashboards_form?{ids[1:]}")
```

### Dashboard

```python
class Dashboard(BaseSupersetView):
    """The base views for Superset!"""

    class_permission_name = "Dashboard"
    method_permission_name = MODEL_VIEW_RW_METHOD_PERMISSION_MAP

    @has_access
    @expose("/new/")
    def new(self) -> FlaskResponse:
        """Creates a new, blank dashboard and redirects to it in edit mode"""
        new_dashboard = DashboardModel(
            dashboard_title="[ untitled dashboard ]",
            owners=[g.user],
        )
        db.session.add(new_dashboard)
        db.session.commit()  # pylint: disable=consider-using-transaction
        if team := TeamDAO.get_team_by_user_id():
            team_slug = team.slug
            object_type = ObjectType.dashboard
            object_id = new_dashboard.id
            CreateTeamTagCommand(object_type, object_id, [team_slug]).run()
        return redirect(f"/superset/dashboard/{new_dashboard.id}/?edit=true")

    @expose("/<dashboard_id_or_slug>/embedded")
    @event_logger.log_this_with_extra_payload
    def embedded(
        self,
        dashboard_id_or_slug: str,
        add_extra_log_payload: Callable[..., None] = lambda **kwargs: None,
    ) -> FlaskResponse:
        """
        Server side rendering for a dashboard
        :param dashboard_id_or_slug: identifier for dashboard. used in the decorators
        :param add_extra_log_payload: added by `log_this_with_manual_updates`, set a
            default value to appease pylint
        """
        if not is_feature_enabled("EMBEDDED_SUPERSET"):
            return Response(status=404)

        # Log in as an anonymous user, just for this view.
        # This view needs to be visible to all users,
        # and building the page fails if g.user and/or ctx.user aren't present.
        login_user(AnonymousUserMixin(), force=True)

        add_extra_log_payload(
            dashboard_id=dashboard_id_or_slug,
            dashboard_version="v2",
        )

        bootstrap_data = {
            "common": common_bootstrap_payload(),
            "embedded": {"dashboard_id": dashboard_id_or_slug},
        }

        return self.render_template(
            "superset/spa.html",
            entry="embedded",
            bootstrap_data=json.dumps(
                bootstrap_data, default=json.pessimistic_json_iso_dttm_ser
            ),
        )
```

### DashboardModelViewAsync

```python
class DashboardModelViewAsync(DashboardModelView):  # pylint: disable=too-many-ancestors
    route_base = "/dashboardasync"
    class_permission_name = "Dashboard"
    method_permission_name = MODEL_VIEW_RW_METHOD_PERMISSION_MAP

    include_route_methods = {RouteMethod.API_READ}

    list_columns = [
        "id",
        "dashboard_link",
        "creator",
        "modified",
        "dashboard_title",
        "changed_on",
        "url",
        "changed_by_name",
    ]
    label_columns = {
        "dashboard_link": _("Dashboard"),
        "dashboard_title": _("Title"),
        "creator": _("Creator"),
        "modified": _("Modified"),
    }

    @expose_api(name="read", url="/api/read", methods=["GET"])
    @has_access_api
    @permission_name("list")
    @deprecated(eol_version="5.0.0")
    def api_read(self) -> FlaskResponse:
        return super().api_read()
```

### DashboardTitleOrSlugFilter

```python
class DashboardTitleOrSlugFilter(BaseFilter):  # pylint: disable=too-few-public-methods
    name = _("Title or Slug")
    arg_name = "title_or_slug"

    def apply(self, query: Query, value: Any) -> Query:
        if not value:
            return query
        ilike_value = f"%{value}%"
        return query.filter(
            or_(
                Dashboard.dashboard_title.ilike(ilike_value),
                Dashboard.slug.ilike(ilike_value),
                Dashboard.dashboard_title_ru.ilike(ilike_value),  # dodo added 44120742
                cast(Dashboard.id, String).ilike(ilike_value),  # dodo added 44120742
            )
        )
```

## Примеры использования

### Получение списка дашбордов

```python
from superset.models.dashboard import Dashboard
from superset import db

# Получение всех дашбордов
dashboards = db.session.query(Dashboard).all()

# Вывод информации о дашбордах
for dashboard in dashboards:
    print(f"ID: {dashboard.id}, Title: {dashboard.dashboard_title}")
    print(f"Title (RU): {dashboard.dashboard_title_ru}")
    print(f"Slug: {dashboard.slug}")
    print(f"Owners: {[owner.username for owner in dashboard.owners]}")
```

### Создание дашборда

```python
from superset.models.dashboard import Dashboard
from superset import db
from superset.commands.tag.create import CreateTeamTagCommand
from superset.tags.models import ObjectType

# Создание дашборда
dashboard = Dashboard(
    dashboard_title="My Dashboard",
    dashboard_title_ru="Мой Дашборд",
    slug="my-dashboard",
    owners=[user],
)

# Сохранение дашборда
db.session.add(dashboard)
db.session.commit()

# Добавление тега команды
team_slug = "my-team"
object_type = ObjectType.dashboard
object_id = dashboard.id
CreateTeamTagCommand(object_type, object_id, [team_slug]).run()
```

### Использование FilterSets

```javascript
// Фронтенд-код для использования FilterSets
import { useDispatch, useSelector } from 'react-redux';
import { saveFilterSet, applyFilterSet } from 'src/dashboard/actions/nativeFilters';

// Сохранение набора фильтров
const handleSaveFilterSet = () => {
  const filterSet = {
    name: 'My Filter Set',
    filters: {
      filter1: { value: 'value1' },
      filter2: { value: 'value2' },
    },
  };
  dispatch(saveFilterSet(filterSet));
};

// Применение набора фильтров
const handleApplyFilterSet = (filterSetId) => {
  dispatch(applyFilterSet(filterSetId));
};
```

### Изменение заголовка дашборда

```python
from superset.models.dashboard import Dashboard
from superset import db

# Получение дашборда
dashboard = db.session.query(Dashboard).get(1)

# Изменение заголовка
dashboard.dashboard_title = "New Title"
dashboard.dashboard_title_ru = "Новый заголовок"

# Сохранение изменений
db.session.commit()
```
