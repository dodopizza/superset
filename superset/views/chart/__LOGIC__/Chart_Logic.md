# Документация по представлениям графиков (Chart Views) в DODO

## Содержание

1. [Введение](#введение)
2. [Архитектура](#архитектура)
3. [Основные компоненты](#основные-компоненты)
   - [SliceMixin](#slicemixin)
   - [SliceModelView](#slicemodelview)
   - [SliceAsync](#sliceasync)
   - [Фильтры](#фильтры)
4. [DODO-специфичные модификации](#dodo-специфичные-модификации)
   - [Расширения для визуализаций](#расширения-для-визуализаций)
   - [Интеграция с системой команд](#интеграция-с-системой-команд)
5. [Процесс работы с графиками](#процесс-работы-с-графиками)
6. [Техническая реализация](#техническая-реализация)
7. [Примеры использования](#примеры-использования)

## Введение

Модуль `views/chart` в Superset отвечает за представления графиков (чартов) в пользовательском интерфейсе. Он предоставляет классы и функции для отображения, создания, редактирования и удаления графиков, а также для работы с ними через API.

В DODO этот модуль был расширен для поддержки дополнительных типов визуализаций и интеграции с системой команд DODO.

## Архитектура

Модуль `views/chart` организован следующим образом:

1. **Основные файлы**:
   - `__init__.py` - инициализация модуля
   - `mixin.py` - миксины для представлений графиков
   - `views.py` - представления для графиков
   - `filters.py` - фильтры для графиков

2. **Связанные модули**:
   - `models/slice.py` - модель для графиков
   - `charts/api.py` - API для графиков
   - `charts/schemas.py` - схемы для графиков
   - `charts/commands` - команды для работы с графиками

3. **Фронтенд-компоненты**:
   - `superset-frontend/src/components/Chart` - компоненты для отображения графиков
   - `superset-frontend/src/DodoExtensions` - DODO-специфичные расширения для графиков

## Основные компоненты

### SliceMixin

Миксин `SliceMixin` в файле `mixin.py` определяет общие свойства и методы для представлений графиков:

```python
class SliceMixin:  # pylint: disable=too-few-public-methods
    list_title = _("Charts")
    show_title = _("Show Chart")
    add_title = _("Add Chart")
    edit_title = _("Edit Chart")

    can_add = False
    search_columns = (
        "slice_name",
        "description",
        "viz_type",
        "datasource_name",
        "owners",
    )
    list_columns = ["slice_link", "viz_type", "datasource_link", "creator", "modified"]
    order_columns = [
        "slice_name",
        "viz_type",
        "datasource_link",
        "modified",
        "changed_on",
    ]
    edit_columns = [
        "slice_name",
        "description",
        "viz_type",
        "owners",
        "dashboards",
        "params",
        "cache_timeout",
    ]
```

Этот миксин определяет заголовки, столбцы для поиска, отображения и редактирования, а также другие свойства для представлений графиков.

### SliceModelView

Класс `SliceModelView` в файле `views.py` наследуется от `SliceMixin` и предоставляет представление для графиков:

```python
class SliceModelView(
    SliceMixin,
    DeprecateModelViewMixin,
    SupersetModelView,
    DeleteMixin,
):  # pylint: disable=too-many-ancestors
    route_base = "/chart"
    datamodel = SQLAInterface(Slice)
    include_route_methods = RouteMethod.CRUD_SET | {
        RouteMethod.EXPORT,
        RouteMethod.IMPORT,
        "download",
    }
    class_permission_name = "Chart"
    method_permission_name = MODEL_VIEW_RW_METHOD_PERMISSION_MAP

    def pre_add(self, item: "Slice") -> None:
        if not security_manager.can_access_datasource(
            datasource=item.datasource, user=g.user
        ):
            raise SupersetSecurityException(
                security_manager.get_datasource_access_error_msg(item.datasource)
            )

    def pre_update(self, item: "Slice") -> None:
        self.pre_add(item)

    @has_access
    @expose("/add")
    def add(self) -> FlaskResponse:
        return super().render_app_template()

    @expose("/list/")
    @has_access
    def list(self) -> FlaskResponse:
        return super().render_app_template()
```

Этот класс предоставляет методы для добавления, обновления, удаления и отображения графиков, а также для проверки прав доступа.

### SliceAsync

Класс `SliceAsync` в файле `views.py` наследуется от `SliceModelView` и предоставляет асинхронное представление для графиков:

```python
class SliceAsync(SliceModelView):  # pylint: disable=too-many-ancestors
    route_base = "/sliceasync"
    include_route_methods = {RouteMethod.API_READ}

    list_columns = [
        "changed_on",
        "changed_on_humanized",
        "creator",
        "datasource_id",
        "datasource_link",
        "datasource_url",
        "datasource_name_text",
        "datasource_type",
        "description",
        "description_markeddown",
        "edit_url",
        "icons",
        "id",
        "modified",
        "owners",
        "params",
        "slice_link",
        "slice_name",
        "slice_url",
        "viz_type",
    ]
    label_columns = {"icons": " ", "slice_link": _("Chart")}
```

Этот класс предоставляет асинхронное API для получения списка графиков.

### Фильтры

Файл `filters.py` содержит фильтры для графиков:

```python
class SliceFilter(BaseFilter):  # pylint: disable=too-few-public-methods
    def apply(self, query: Query, value: Any) -> Query:
        if security_manager.can_access_all_datasources():
            return query
        perms = security_manager.user_view_menu_names("datasource_access")
        schema_perms = security_manager.user_view_menu_names("schema_access")
        return query.filter(
            or_(
                self.model.perm.in_(perms),
                self.model.schema_perm.in_(schema_perms),
                security_manager.get_public_datasources_filter(),
            )
        )
```

Этот фильтр используется для ограничения доступа к графикам на основе прав доступа пользователя.

## DODO-специфичные модификации

### Расширения для визуализаций

В DODO были добавлены расширения для визуализаций, которые предоставляют дополнительные возможности для отображения данных:

1. **BarDodo**:
   - Модифицированная версия столбчатой диаграммы с дополнительными возможностями
   - Задача: #45525377
   - Файлы:
     - `superset-frontend/plugins/plugin-chart-echarts/src/DodoExtensions/BarDodo/index.ts`
     - `superset-frontend/plugins/plugin-chart-echarts/src/DodoExtensions/BarDodo/EchartsBarChart.tsx`
     - `superset-frontend/plugins/plugin-chart-echarts/src/DodoExtensions/BarDodo/types.ts`
     - `superset-frontend/plugins/plugin-chart-echarts/src/DodoExtensions/BarDodo/transformProps.ts`

   ```typescript
   // DODO created 45525377
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

2. **BubbleDodo**:
   - Модифицированная версия пузырьковой диаграммы с дополнительными возможностями
   - Файлы:
     - `superset-frontend/plugins/plugin-chart-echarts/src/DodoExtensions/Bubble/index.ts`
     - `superset-frontend/plugins/plugin-chart-echarts/src/DodoExtensions/Bubble/BubbleDodo.tsx`
     - `superset-frontend/plugins/plugin-chart-echarts/src/DodoExtensions/Bubble/types.ts`
     - `superset-frontend/plugins/plugin-chart-echarts/src/DodoExtensions/Bubble/transformProps.ts`

   ```typescript
   export default class EchartsBubbleChartDodoPlugin extends ChartPlugin {
     constructor() {
       super({
         loadChart: () => import('./BubbleDodo'),
         metadata,
         buildQuery,
         transformProps,
         controlPanel,
       });
     }
   }
   ```

3. **BigNumber с условным форматированием**:
   - Расширение для компонента BigNumber с поддержкой условного форматирования
   - Задача: #45525377
   - Файлы:
     - `superset-frontend/plugins/plugin-chart-echarts/src/DodoExtensions/BigNumber/BigNumberViz.tsx`
     - `superset-frontend/plugins/plugin-chart-echarts/src/DodoExtensions/BigNumber/types.ts`

   ```typescript
   // DODO was here
   // DODO created 45525377
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
   ```

### Интеграция с системой команд

В DODO была добавлена интеграция с системой команд для управления доступом к графикам:

1. **Фильтрация графиков по командам**:
   - Графики могут быть отфильтрованы по командам пользователя
   - Пользователи видят только графики, к которым у их команды есть доступ

2. **Назначение владельцев графиков**:
   - Графики могут быть назначены командам в качестве владельцев
   - Команды могут управлять доступом к своим графикам

## Процесс работы с графиками

Процесс работы с графиками в DODO включает следующие шаги:

1. **Создание графика**:
   - Пользователь выбирает источник данных
   - Пользователь выбирает тип визуализации
   - Пользователь настраивает параметры визуализации
   - Пользователь сохраняет график

2. **Просмотр графика**:
   - Пользователь может просматривать график в режиме исследования (Explore)
   - Пользователь может добавлять график на дашборд

3. **Редактирование графика**:
   - Пользователь может изменять параметры визуализации
   - Пользователь может изменять название и описание графика
   - Пользователь может изменять владельцев графика

4. **Удаление графика**:
   - Пользователь может удалить график, если у него есть соответствующие права

## Техническая реализация

### SliceModelView

```python
class SliceModelView(
    SliceMixin,
    DeprecateModelViewMixin,
    SupersetModelView,
    DeleteMixin,
):  # pylint: disable=too-many-ancestors
    route_base = "/chart"
    datamodel = SQLAInterface(Slice)
    include_route_methods = RouteMethod.CRUD_SET | {
        RouteMethod.EXPORT,
        RouteMethod.IMPORT,
        "download",
    }
    class_permission_name = "Chart"
    method_permission_name = MODEL_VIEW_RW_METHOD_PERMISSION_MAP

    def pre_add(self, item: "Slice") -> None:
        if not security_manager.can_access_datasource(
            datasource=item.datasource, user=g.user
        ):
            raise SupersetSecurityException(
                security_manager.get_datasource_access_error_msg(item.datasource)
            )

    def pre_update(self, item: "Slice") -> None:
        self.pre_add(item)

    @has_access
    @expose("/add")
    def add(self) -> FlaskResponse:
        return super().render_app_template()

    @expose("/list/")
    @has_access
    def list(self) -> FlaskResponse:
        return super().render_app_template()
```

### SliceAsync

```python
class SliceAsync(SliceModelView):  # pylint: disable=too-many-ancestors
    route_base = "/sliceasync"
    include_route_methods = {RouteMethod.API_READ}

    list_columns = [
        "changed_on",
        "changed_on_humanized",
        "creator",
        "datasource_id",
        "datasource_link",
        "datasource_url",
        "datasource_name_text",
        "datasource_type",
        "description",
        "description_markeddown",
        "edit_url",
        "icons",
        "id",
        "modified",
        "owners",
        "params",
        "slice_link",
        "slice_name",
        "slice_url",
        "viz_type",
    ]
    label_columns = {"icons": " ", "slice_link": _("Chart")}
```

### EchartsBarChartPluginDodo

```typescript
// DODO created 45525377
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
  const grid = useMemo(
    () =>
      marginTop > 0
        ? {
            top: marginTop,
          }
        : undefined,
    [marginTop],
  );

  const legend = useMemo(
    () => ({
      data: showDimension ? [...dimensionList] : [],
      type: scrollDimensions ? 'scroll' : undefined,
    }),
    [dimensionList, scrollDimensions, showDimension],
  );
```

## Примеры использования

### Получение списка графиков

```python
from superset.models.slice import Slice
from superset import db

# Получение всех графиков
slices = db.session.query(Slice).all()

# Вывод информации о графиках
for slice in slices:
    print(f"ID: {slice.id}, Name: {slice.slice_name}")
    print(f"Visualization Type: {slice.viz_type}")
    print(f"Datasource: {slice.datasource_name}")
    print(f"Owners: {[owner.username for owner in slice.owners]}")
```

### Создание графика

```python
from superset.models.slice import Slice
from superset import db
from superset.daos.datasource import DatasourceDAO

# Получение источника данных
datasource = DatasourceDAO.get_datasource(
    datasource_type="table",
    datasource_id=1,
)

# Создание графика
slice = Slice(
    slice_name="My Chart",
    datasource_type=datasource.type,
    datasource_id=datasource.id,
    viz_type="bar",
    params="""
    {
        "viz_type": "bar",
        "groupby": ["country"],
        "metrics": ["sum__sales"],
        "row_limit": 10000
    }
    """,
)

# Добавление владельцев
slice.owners = [user]

# Сохранение графика
db.session.add(slice)
db.session.commit()
```

### Использование BarDodo

```javascript
// Фронтенд-код для использования BarDodo
const formData = {
  viz_type: 'bar_dodo',
  datasource: '1__table',
  slice_id: 1,
  url_params: {},
  granularity_sqla: 'ds',
  time_grain_sqla: 'P1D',
  time_range: 'Last week',
  metrics: ['sum__sales'],
  adhoc_filters: [],
  groupby: ['country'],
  limit: 10,
  row_limit: 10000,
  show_legend: true,
  y_axis_format: '$,.2f',
  y_axis_label: 'Sales',
  x_axis_label: 'Country',
  bottom_margin: 'auto',
  x_ticks_layout: 'auto',
};

// Создание визуализации
const viz = new EchartsBarChartPluginDodo().loadChart().then(Chart => {
  return <Chart formData={formData} height={400} width={600} />;
});
```

### Использование BubbleDodo

```javascript
// Фронтенд-код для использования BubbleDodo
const formData = {
  viz_type: 'bubble_dodo',
  datasource: '1__table',
  slice_id: 1,
  url_params: {},
  granularity_sqla: 'ds',
  time_grain_sqla: 'P1D',
  time_range: 'Last week',
  size: 'sum__sales',
  x: 'sum__profit',
  y: 'sum__cost',
  series: 'country',
  adhoc_filters: [],
  limit: 10,
  row_limit: 10000,
  show_legend: true,
  x_axis_format: '$,.2f',
  y_axis_format: '$,.2f',
  size_format: '$,.2f',
  x_axis_label: 'Profit',
  y_axis_label: 'Cost',
  x_log_scale: false,
  y_log_scale: false,
  show_labels: true,
  label_location: 'top',
  label_font_size: '12',
};

// Создание визуализации
const viz = new EchartsBubbleChartDodoPlugin().loadChart().then(Chart => {
  return <Chart formData={formData} height={400} width={600} />;
});
```
