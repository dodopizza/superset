/* eslint-disable no-template-curly-in-string */
const ru = {
  domain: 'superset',
  locale_data: {
    superset: {
      '': {
        domain: 'superset',
        plural_forms: 'nplurals=1; plural=0;',
        lang: 'ru',
      },
      Home: ['Главная'],
      'Annotation Layers': ['Слои аннотаций'],
      Manage: ['Управление'],
      Databases: ['Базы данных'],
      Data: ['База Данных'],
      Datasets: ['Датасеты'],
      Charts: ['Графики'],
      Dashboards: ['Дашборды'],
      Plugins: ['Плагины'],
      'CSS Templates': ['Шаблоны CSS'],
      'Row level security': ['Безопасность на уровне строк'],
      Security: ['Безопасность'],
      'Import Dashboards': ['Импорт дашбордов'],
      'SQL Editor': ['Редактор SQL'],
      'SQL Lab': ['Лаборатория SQL'],
      'Saved Queries': ['Сохраненные запросы'],
      'Query History': ['История запросов'],
      'Upload a CSV': ['Загрузить CSV'],
      'Upload Excel': ['Загрузить файл Excel'],
      'Action Log': ['Журнал Действий'],
      'Dashboard Emails': ['Рассылка дашбордов'],
      'Chart Email Schedules': ['Рассылка графиков'],
      Alerts: ['Оповещения'],
      'Alerts & Reports': ['Оповещения и Рассылка'],
      'Access requests': ['Запросы доступа'],
      'Druid Datasources': ['Источники Данных Druid'],
      'Druid Clusters': ['Список Кластеров Druid'],
      'Scan New Datasources': ['Сканирование Новых Источников'],
      'Refresh Druid Metadata': ['Обновить Метаданные Druid'],
      'Issue 1000 - The datasource is too large to query.': [
        'Проблема 1000 - Источник данных слишком велик для запроса.',
      ],
      'Issue 1001 - The database is under an unusual load.': [
        'Проблема 1001 - Необычная загрузка базы данных.',
      ],
      'Issue 1002 - The database returned an unexpected error.': [
        'Проблема 1002 - База данных вернула непредвиденную ошибку.',
      ],
      'Issue 1003 - There is a syntax error in the SQL query. Perhaps there was a misspelling or a typo.':
        ['Проблема 1003 - Ошибка в SQL-запросе. Возможно опечатка.'],
      'Issue 1004 - The column was deleted or renamed in the database.': [
        'Проблема 1004 - Столбец был удалён или переименован в базе данных.',
      ],
      'Issue 1005 - The table was deleted or renamed in the database.': [
        'Проблема 1005 - Таблица была удалена или переименована в базе данных.',
      ],
      'Issue 1006 - One or more parameters specified in the query are missing.':
        [
          'Проблема 1006 - Отсутствуют один или несколько параметров, используемых в запросе.',
        ],
      'Invalid certificate': ['Недействительный сертификат'],
      'Unsafe return type for function %(func)s: %(value_type)s': [
        'Небезопасный возвращаемый тип для функции %(func)s: %(value_type)s',
      ],
      'Unsupported return value for method %(name)s': [
        'Неподдерживаемое возвращаемое значение для метода %(name)s',
      ],
      'Unsafe template value for key %(key)s: %(value_type)s': [
        'Небезопасное значение для ключа шаблона %(key)s: %(value_type)s',
      ],
      'Unsupported template value for key %(key)s': [
        'Неподдерживаемое значение для ключа шаблона %(key)s',
      ],
      'Only `SELECT` statements are allowed against this database': [
        'Для этой БД разрешены только выражения `SELECT`',
      ],
      'CTAS (create table as select) can only be run with a query where the last statement is a SELECT. Please make sure your query has a SELECT as its last statement. Then, try running your query again.':
        [
          'CTAS (create table as select) может быть выполнено только в запросе, последняя операция которого SELECT.',
        ],
      'CVAS (create view as select) can only be run with a query with a single SELECT statement. Please make sure your query has only a SELECT statement. Then, try running your query again.':
        [
          'может быть выполнено только в запросе, в котором есть только одна операция SELECT.',
        ],
      'Viz is missing a datasource': [
        'У визуализации отсутствует источник данных',
      ],
      'Applied rolling window did not return any data. Please make sure the source query satisfies the minimum periods defined in the rolling window.':
        [''],
      'From date cannot be larger than to date': [
        'Невозможно выбрать дату [from], которая позже текущего дня',
      ],
      'Cached value not found': ['Значение не найдено в кеше'],
      'Columns missing in datasource: %(invalid_columns)s': [
        'В источнике данных отсутствуют столбцы: %(invalid_columns)s',
      ],
      'Table View': ['Табличный вид'],
      'You cannot use [Columns] in combination with [Group By]/[Metrics]/[Percentage Metrics]. Please choose one or the other.':
        [
          'Нельзя использовать [Столбцы] одновременно с [Группировка по][Показатели][Процентные показатели]. Пожалуйста, выберите что-то одно.',
        ],
      "Pick a granularity in the Time section or uncheck 'Include Time'": [
        'Выберите столбец с датой и необходимый период в секции «Время» или снимите флажок «Включая дату»',
      ],
      'Time Table View': [''],
      'Pick at least one metric': ['Выберите хотя бы один показатель'],
      "When using 'Group By' you are limited to use a single metric": [
        'При использовании поля [Группировка] вы не ограничены использованием одного среза',
      ],
      'Pivot Table': ['Pivot Table'],
      "Please choose at least one 'Group by' field ": [
        'Пожалуйста, выберите хотя бы один срез в поле ‘Группировка’ ',
      ],
      'Please choose at least one metric': [
        'Пожалуйста, выберите хотя бы один показатель',
      ],
      "Group By' and 'Columns' can't overlap": [
        'Нельзя использовать один и тот же срез в двух полях',
      ],
      Treemap: ['Treemap'],
      'Calendar Heatmap': ['Calendar Heatmap'],
      'Bubble Chart': ['Bubble Chart'],
      'Please use 3 different metric labels': [
        'Пожалуйста, выберите разные срезы данных для левой и правой оси',
      ],
      'Pick a metric for x, y and size': ['Выберите срез для X, Y и размер'],
      'Bullet Chart': ['Bullet Chart'],
      'Pick a metric to display': ['Выберите показатель для отображения'],
      'Big Number with Trendline': ['Big Number with Trendline'],
      'Pick a metric!': ['Выберите показатель!'],
      'Big Number': ['Big Number'],
      'Time Series - Line Chart': ['Time Series - Line Chart'],
      'Pick a time granularity for your time series': [
        'Выберите период для временных рядов',
      ],
      'An enclosed time range (both start and end) must be specified when using a Time Comparison.':
        [''],
      'Time Series - Multiple Line Charts': [
        'Time Series - Multiple Line Charts',
      ],
      'Time Series - Dual Axis Line Chart': [
        'Time Series - Dual Axis Line Chart',
      ],
      'Pick a metric for left axis!': ['Выберите значение для левой оси!'],
      'Pick a metric for right axis!': ['Выберите значение для правой оси!'],
      'Please choose different metrics on left and right axis': [
        'Пожалуйста, выберите разные срезы данных для левой и правой оси',
      ],
      'Time Series - Bar Chart': ['Time Series - Bar Chart'],
      'Time Series - Period Pivot': ['Time Series - Period Pivot'],
      'Time Series - Percent Change': ['Time Series - Percent Change'],
      'Time Series - Stacked': ['Time Series - Stacked'],
      Histogram: ['Histogram'],
      'Must have at least one numeric column specified': [
        'Должен быть указан хотя бы один числовой столбец',
      ],
      'Distribution - Bar Chart': ['Distribution - Bar Chart'],
      "Can't have overlap between Series and Breakdowns": [
        'Срезы в полях [Столбцы данных] и [Ряды данных] должны быть разными',
      ],
      'Pick at least one field for [Series]': [
        'Выберите хотя бы одно значение для поля [Столбцы данных]',
      ],
      Sunburst: ['Sunburst'],
      Sankey: ['Sankey'],
      'Pick exactly 2 columns as [Source / Target]': [
        'Выберите ровно два среза в поле [Источник / Назначение]',
      ],
      "There's a loop in your Sankey, please provide a tree. Here's a faulty link: {}":
        [
          'В полях [Источника] и [Назначения] есть одинаковый срез данных - {}. Срезы не должны пересекаться!',
        ],
      'Directed Force Layout': [''],
      "Pick exactly 2 columns to 'Group By'": [
        'Выберите ровно два столбца в поле [Группировка]',
      ],
      'Country Map': ['Карта Стран'],
      'World Map': ['Карта Мира'],
      Filters: ['Фильтры'],
      'Invalid filter configuration, please select a column': [''],
      'Parallel Coordinates': [''],
      Heatmap: ['Heatmap'],
      'Horizon Charts': ['Horizon Charts'],
      Mapbox: ['Mapbox'],
      '[Longitude] and [Latitude] must be set': [
        'Столбцы [Долгота] и [Широта] должны присутствовать в поле [Группировка]',
      ],
      "Must have a [Group By] column to have 'count' as the [Label]": [
        'Чтобы получить `count` как [Метку], должна быть заполнена [Группировка по]',
      ],
      'Choice of [Label] must be present in [Group By]': [
        'Выбор для [Метки] должен присутствовать в [Группировке по]',
      ],
      'Choice of [Point Radius] must be present in [Group By]': [
        'Срез [Радиуса точки] должен присутствовать в поле [Группировка]',
      ],
      '[Longitude] and [Latitude] columns must be present in [Group By]': [
        'Столбцы [Долгота] и [Широта] должны присутствовать в поле [Группировка]',
      ],
      'Deck.gl - Multiple Layers': ['Deck.gl - Multiple Layers'],
      'Bad spatial key': [''],
      'Invalid spatial point encountered: %s': [''],
      'Encountered invalid NULL spatial entry,                                        please consider filtering those out':
        [''],
      'Deck.gl - Scatter plot': ['Deck.gl - Scatter plot'],
      'Deck.gl - Screen Grid': ['Deck.gl - Screen Grid'],
      'Deck.gl - 3D Grid': ['Deck.gl - 3D Grid'],
      'Deck.gl - Paths': ['Deck.gl - Paths'],
      'Deck.gl - Polygon': ['Deck.gl - Polygon'],
      'Deck.gl - 3D HEX': ['Deck.gl - 3D HEX'],
      'Deck.gl - GeoJSON': ['Deck.gl - GeoJSON'],
      'Deck.gl - Arc': ['Deck.gl - Arc'],
      'Event flow': ['Event flow'],
      'Time Series - Paired t-test': ['Time Series - Paired t-test'],
      'Time Series - Nightingale Rose Chart': [
        'Time Series - Nightingale Rose Chart',
      ],
      'Partition Diagram': ['Partition Diagram'],
      'Choose either fields to [Group By] and [Metrics] and/or [Percentage Metrics], or [Columns], not both':
        [
          'Выберите срез данных в полях [Показатели] или [Столбцы], но не в обоих одновременно',
        ],
      'Box Plot': ['Box Plot'],
      'Distribution - NVD3 - Pie Chart': ['Distribution - NVD3 - Pie Chart'],
      iFrame: [''],
      'Deleted %(num)d annotation layer': ['Удалено слоёв аннотации: %(num)d'],
      'All Text': ['Весь текст'],
      'Deleted %(num)d annotation': ['Удалено %(num)d аннотаций'],
      'End date must be after start date': [
        'Невозможно выбрать дату [from], которая позже текущего дня',
      ],
      'Short description must be unique for this layer': [
        'Краткое описание должно быть уникальным для этого слоя',
      ],
      'Annotations could not be deleted.': ['Аннотации не могут быть удалены.'],
      'Annotation not found.': ['Аннотация не найдена.'],
      'Annotation parameters are invalid.': [
        'Параметры аннотации недействительны.',
      ],
      'Annotation could not be created.': ['Аннотация не может быть создана.'],
      'Annotation could not be updated.': [
        'Аннотация не может быть обновлена.',
      ],
      'Annotation delete failed.': ['Удаление аннотации не удалось.'],
      'Annotation layer parameters are invalid.': [
        'Параметры слоя аннотации недействительны.',
      ],
      'Annotation layer could not be deleted.': [
        'Слой аннотации не может быть удалён.',
      ],
      'Annotation layer could not be created.': [
        'Слой аннотаций не может быть создан.',
      ],
      'Annotation layer could not be updated.': [
        'Слой аннотаций не может быть обновлён.',
      ],
      'Annotation layer not found.': ['Слой аннотаций не найден.'],
      'Annotation layer delete failed.': ['Ошибка удаления слоя аннотаций.'],
      'Annotation layer has associated annotations.': [
        'Слой аннотаций имеет присвоенные аннотации.',
      ],
      'Name must be unique': ['Имя должно быть уникальным'],
      'Deleted %(num)d chart': ['Удалено %(num)d графиков'],
      'Request is not JSON': ['Запрос не в формате JSON'],
      'Request is incorrect: %(error)s': ['Запрос некорректен: %(error)s'],
      '`confidence_interval` must be between 0 and 1 (exclusive)': [
        '`доверительный_интервал` должен быть между 0 и 1 (исключая)',
      ],
      'lower percentile must be greater than 0 and less than 100. Must be lower than upper percentile.':
        [
          'нижний процентиль должен быть больше 0 и меньше верхнего процентиля.',
        ],
      'upper percentile must be greater than 0 and less than 100. Must be higher than lower percentile.':
        [
          'верхний процентиль должен быть больше нижнего процентиля и меньше 100.',
        ],
      '`width` must be greater or equal to 0': [
        '`ширина` должна быть больше, чем 0',
      ],
      '`row_limit` must be greater than or equal to 1': [
        '`лимит_строк` должен быть больше или равен 1',
      ],
      '`row_offset` must be greater than or equal to 0': [
        '`смещение_строк` должно быть больше или равно 0',
      ],
      'There are associated alerts or reports: %s,': [
        'Существуют оповещения или рассылки: %s,',
      ],
      'Owners are invalid': ['Владельцы недействительны'],
      'Dataset does not exist': ['Источник данных %(name)s уже существует'],
      '`operation` property of post processing object undefined': [
        'Неопределено свойство `operation` объекта пост-процессинга',
      ],
      'Unsupported post processing operation: %(operation)s': [
        'Неподдерживаемая операция пост-процессинга: %(operation)s',
      ],
      'Adding new datasource [{}]': ['Добавление нового источника данных [{}]'],
      'Refreshing datasource [{}]': ['Обновление источника данных [{}]'],
      'Metric(s) {} must be aggregations.': [
        'Показатель(и) {} должны быть агрегированы.',
      ],
      'Unsupported extraction function: ': ['Неподдерживаемая функция: '],
      Columns: ['Столбцы'],
      'Show Druid Column': ['Показать столбец Druid'],
      'Add Druid Column': ['Добавить столбец Druid'],
      'Edit Druid Column': ['Редактировать столбец Druid'],
      Column: ['Столбец'],
      'column ': ['Столбец'],
      Type: ['Тип'],
      Datasource: ['Источник данных'],
      Groupable: ['Группируемый'],
      Filterable: ['Фильтруемый'],
      'Whether this column is exposed in the `Filters` section of the explore view.':
        [
          'Необходимо отметить, если столбец должен быть доступен в разделе «Фильтры».',
        ],
      Metrics: ['Показатели'],
      'Show Druid Metric': ['Показать Druid Метрики'],
      'Add Druid Metric': ['Добавить Druid Метрику'],
      'Edit Druid Metric': ['Редактировать Druid Метрику'],
      Metric: ['Показатель'],
      Description: ['Описание'],
      'Verbose Name': ['Полное имя'],
      JSON: ['JSON'],
      'Druid Datasource': ['Druid - Источники Данных'],
      'Warning Message': ['Предупреждающее сообщение'],
      'Show Druid Cluster': ['Показать кластер Druid'],
      'Add Druid Cluster': ['Добавить кластер Druid'],
      'Edit Druid Cluster': ['Редактировать кластер Druid'],
      'Cluster Name': ['Имя кластера'],
      'Broker Host': ['Хост брокера'],
      'Broker Port': ['Порт брокера'],
      'Broker Username': ['Пользователь брокера'],
      'Broker Password': ['Пароль брокера'],
      'Broker Endpoint': ['Адрес брокера'],
      'Cache Timeout': ['Тайм-аут кеша'],
      'Metadata Last Refreshed': ['Метаданные обновлены'],
      'Duration (in seconds) of the caching timeout for this cluster. A timeout of 0 indicates that the cache never expires. Note this defaults to the global timeout if undefined.':
        [
          'Тайм-аут кеша (в секундах) для этого кластера. Тайм-аут 0 означает, что кеш не может быть просрочен.',
        ],
      'Druid supports basic authentication. See [auth](http://druid.io/docs/latest/design/auth.html) and druid-basic-security extension':
        [
          'Druid поддерживает обычную аутентификацию. См. [эту страницу](http://druid.io/docs/latest/design/auth.html) и расширения для druid-basic-security',
        ],
      'Show Druid Datasource': ['Показать источник данных Druid'],
      'Add Druid Datasource': ['Добавить источник данных Druid'],
      'Edit Druid Datasource': ['Редактировать источник данных Druid'],
      "The list of charts associated with this table. By altering this datasource, you may change how these associated charts behave. Also note that charts need to point to a datasource, so this form will fail at saving if removing charts from a datasource. If you want to change the datasource for a chart, overwrite the chart from the 'explore view'":
        [
          'Список графиков, связанных с этой таблицей. Изменяя этот источник данных, можно изменить поведение связанных с ним графиков. Также обратите внимание, что графики должны указывать на источник данных, поэтому эта форма не будет сохранена при удалении срезов из источника данных. Если вы хотите изменить источник данных для среза, сделайте это в свойствах самого графика.',
        ],
      'Timezone offset (in hours) for this datasource': [
        'Смещение часового пояса (в часах) для этого источника данных',
      ],
      'Time expression to use as a predicate when retrieving distinct values to populate the filter component. Only applies when `Enable Filter Select` is on. If you enter `7 days ago`, the distinct list of values in the filter will be populated based on the distinct value over the past week':
        [
          'Выражение времени для использования в качестве предиката при получении различных значений для заполнения компонента фильтра. Применяется только в том случае, если включен параметр «включить выбор фильтра». Если Вы введете «7 дней назад», то список различных значений в фильтре будет заполнен на основе определенного значения за последнюю неделю',
        ],
      "Whether to populate the filter's dropdown in the explore view's filter section with a list of distinct values fetched from the backend on the fly":
        [
          'Получение списка фильтруемых значений, выполняя онлайн-запрос к серверу',
        ],
      'Redirects to this endpoint when clicking on the datasource from the datasource list':
        [
          'Перенаправление на эту конечную точку при нажатии на источник данных из списка источников данных',
        ],
      'Duration (in seconds) of the caching timeout for this datasource. A timeout of 0 indicates that the cache never expires. Note this defaults to the cluster timeout if undefined.':
        [
          'Тайм-аут (в секундах) кеша для этого источника данных. Тайм-аут 0 означает, что кеш не может быть просрочен.',
        ],
      'Associated Charts': ['Связанные графики'],
      'Data Source': ['Источник данных'],
      Cluster: ['Кластер'],
      Owners: ['Владельцы'],
      'Is Hidden': ['Скрыто'],
      'Enable Filter Select': ['Включить выбор фильтра'],
      'Default Endpoint': ['Адрес по-умолчанию'],
      'Time Offset': ['Смещение времени'],
      'Datasource Name': ['Имя источника данных'],
      'Fetch Values From': ['Извлечь значения из'],
      'Changed By': ['Изменено'],
      Modified: ['Изменено'],
      'Refreshed metadata from cluster [{}]': [
        'Обновлённые метаданные из кластера [{}]',
      ],
      'Only `SELECT` statements are allowed': [
        'Допустимы только выражения `SELECT`',
      ],
      'Only single queries supported': [
        'Поддерживаются только одиночные запросы',
      ],
      'Error in jinja expression in fetch values predicate: %(msg)s': [''],
      'Error in jinja expression in FROM clause: %(msg)s': [''],
      'Virtual dataset query cannot consist of multiple statements': [
        'Виртуальный датасет не может содержать несколько выражений',
      ],
      'Virtual dataset query must be read-only': [
        'Виртуальный датасет должен быть read-only',
      ],
      'Error in jinja expression in RLS filters: %(msg)s': [''],
      'Datetime column not provided as part table configuration and is required by this type of chart':
        [
          'Для данного графика необходим временной ряд. Укажите столбец с датой в соответствующем поле раздела [Время]',
        ],
      'Empty query?': ['Пустой запрос?'],
      "Metric '%(metric)s' does not exist": [
        'Показатель ‘%(metric)s’ не существует',
      ],
      'Invalid filter operation type: %(op)s': [
        'Недействительный тип операции фильтра: %(op)s',
      ],
      'Error in jinja expression in WHERE clause: %(msg)s': [''],
      'Error in jinja expression in HAVING clause: %(msg)s': [''],
      'Show Column': ['Показать столбец'],
      'Add Column': ['Добавить столбец'],
      'Edit Column': ['Редактировать столбец'],
      'Whether to make this column available as a [Time Granularity] option, column has to be DATETIME or DATETIME-like':
        [
          'Сделать этот столбец доступным в разделе [Время]. Столбец должен быть в формате DATETIME',
        ],
      'The data type that was inferred by the database. It may be necessary to input a type manually for expression-defined columns in some cases. In most case users should not need to alter this.':
        [
          'Задать тип данных. В некоторых случаях может потребоваться ввести тип вручную для столбцов, которые формируются специальными запросами. В большинстве случаев изменять содержимое этого поля не обязательно.',
        ],
      Table: ['Таблица'],
      Expression: ['Выражение SQL'],
      'Is temporal': ['Содержит дату /время'],
      'Datetime Format': ['Формат Datetime'],
      'Invalid date/timestamp format': ['Формат Даты / Времени'],
      'Show Metric': ['Показать показатель'],
      'Add Metric': ['Добавить показатель'],
      'Edit Metric': ['Редактировать показатель'],
      'SQL Expression': ['Выражение SQL'],
      'D3 Format': ['Формат D3'],
      Extra: ['Дополнительные параметры'],
      'Row level security filter': ['Фильтр на уровне строк'],
      'Show Row level security filter': ['Показать фильтр на уровне строк'],
      'Add Row level security filter': ['Добавить фильтр на уровне строк'],
      'Edit Row level security filter': ['Править фильтр на уровне строк'],
      'Regular filters add where clauses to queries if a user belongs to a role referenced in the filter. Base filters apply filters to all queries except the roles defined in the filter, and can be used to define what users can see if no RLS filters within a filter group apply to them.':
        [''],
      'These are the tables this filter will be applied to.': [
        'Это таблицы, к которым будет применён фильтр.',
      ],
      'For regular filters, these are the roles this filter will be applied to. For base filters, these are the roles that the filter DOES NOT apply to, e.g. Admin if admin should see all data.':
        [''],
      "Filters with the same group key will be ORed together within the group, while different filter groups will be ANDed together. Undefined group keys are treated as unique groups, i.e. are not grouped together. For example, if a table has three filters, of which two are for departments Finance and Marketing (group key = 'department'), and one refers to the region Europe (group key = 'region'), the filter clause would apply the filter (department = 'Finance' OR department = 'Marketing') AND (region = 'Europe').":
        [''],
      'This is the condition that will be added to the WHERE clause. For example, to only return rows for a particular client, you might define a regular filter with the clause `client_id = 9`. To display no rows unless a user belongs to a RLS filter role, a base filter can be created with the clause `1 = 0` (always false).':
        [''],
      Tables: ['Таблицы'],
      Roles: ['Роли'],
      Clause: ['Условие'],
      Creator: ['Автор'],
      'Show Table': ['Показать таблицу'],
      'Import a table definition': ['Импортировать определение таблицы'],
      'Edit Table': ['Редактировать таблицу'],
      'Name of the table that exists in the source database': [
        'Имя таблицы, которая существует в исходной базе данных',
      ],
      'Schema, as used only in some databases like Postgres, Redshift and DB2':
        [
          'Схема, используется только в некоторых базах данных, таких как Postgres, Redshift и DB2',
        ],
      'This fields acts a Superset view, meaning that Superset will run a query against this string as a subquery.':
        ['Это поле будет выполнять запрос в качестве подзапроса.'],
      'Predicate applied when fetching distinct value to populate the filter control component. Supports jinja template syntax. Applies only when `Enable Filter Select` is on.':
        [
          'Предикат применяется при получении значений для компонента - «Фильтр». Поддерживает синтаксис jinja. Применяется только в том случае, если включен параметр «Включить Онлайн Фильтр».',
        ],
      'Redirects to this endpoint when clicking on the table from the table list':
        [
          'Перенаправление на эту конечную точку при нажатии на таблицу в общем списке',
        ],
      "Whether the table was generated by the 'Visualize' flow in SQL Lab": [
        '',
      ],
      'A set of parameters that become available in the query using Jinja templating syntax':
        [''],
      'Duration (in seconds) of the caching timeout for this table. A timeout of 0 indicates that the cache never expires. Note this defaults to the database timeout if undefined.':
        [''],
      Database: ['База данных'],
      'Last Changed': ['Последнее изменение'],
      Schema: ['Схема'],
      Offset: ['Смещение'],
      'Table Name': ['Имя Таблицы'],
      'Fetch Values Predicate': ['Извлечь Значения Предиката'],
      'Main Datetime Column': ['Основной столбец с датой'],
      'SQL Lab View': ['Лаборатория SQL'],
      'Template parameters': ['Параметры шаблона'],
      'The table was created. As part of this two-phase configuration process, you should now click the edit button by the new table to configure it.':
        [
          'Таблица была создана. Теперь нажмите на кнопку редактирования напротив новой таблицы, чтобы настроить её.',
        ],
      'Refresh Metadata': ['Обновить метаданные'],
      'Refresh column metadata': ['Обновить метаданные столбцов'],
      'Metadata refreshed for the following table(s): %(tables)s': [
        'Метаданные обновлены для следующих таблиц: %(tables)s',
      ],
      'The following tables added new columns: %(tables)s': [''],
      'The following tables removed columns: %(tables)s': [''],
      'The following tables update column metadata: %(tables)s': [''],
      'Unable to refresh metadata for the following table(s): %(tables)s': [
        'Метаданные обновлены для следующих таблиц: %(tables)s',
      ],
      'Deleted %(num)d css template': ['Удалено %(num)d шаблонов CSS'],
      'CSS template could not be deleted.': [
        'Шаблон CSS не может быть удалён.',
      ],
      'CSS template not found.': ['Шаблон CSS не найден.'],
      'Deleted %(num)d dashboard': ['Удалено %(num)d дашбордов'],
      'Title or Slug': ['Название'],
      'Must be unique': ['Должно быть уникально'],
      'Dashboard parameters are invalid.': [
        'Параметры дашборда недействительны.',
      ],
      'Dashboard not found.': ['Дашборд не найден.'],
      'Dashboard could not be created.': ['Дашборд не может быть создан.'],
      'Dashboards could not be deleted.': ['Дашборды не могут быть удалены.'],
      'Dashboard could not be updated.': ['Дашборд не может быть обновлён.'],
      'Dashboard could not be deleted.': ['Дашборд не может быть удалён.'],
      'Changing this Dashboard is forbidden': [
        'Изменение этого дашборда запрещено',
      ],
      'Import dashboard failed for an unknown reason': [
        'Импорт дашборда не удался по неизвестной причине',
      ],
      'No data in file': ['Нет данных в файле'],
      'Table name undefined': ['Имя таблицы не определено'],
      'Invalid connection string, a valid string usually follows: driver://user:password@database-host/database-name':
        [
          'Недействительная строка подключения, правильная строка обычно следует следующему шаблону: драйвер://пользователь:пароль@хостБД/имяБД',
        ],
      'SQLite database cannot be used as a data source for security reasons.': [
        'БД SQLite не может быть использована как источник данных из-за потенциальных проблем с безопасностью.',
      ],
      'Field cannot be decoded by JSON. %(msg)s': [''],
      'The metadata_params in Extra field is not configured correctly. The key %(key)s is invalid.':
        [''],
      'Database parameters are invalid.': [
        'Параметры базы данных недействительны.',
      ],
      'A database with the same name already exists': [
        'Источник данных %(name)s уже существует',
      ],
      'Field is required': ['Поле обязательно'],
      'Field cannot be decoded by JSON.  %{json_error}s': [''],
      'The metadata_params in Extra field is not configured correctly. The key %{key}s is invalid.':
        [''],
      'Database not found.': ['База данных не найдена.'],
      'Database could not be created.': ['База данных не может быть создана.'],
      'Database could not be updated.': [
        'База данных не может быть обновлена.',
      ],
      'Connection failed, please check your connection settings': [
        'Подключение не удалось, пожалуйста, проверьте строку подключения',
      ],
      'Cannot delete a database that has tables attached': [
        'Невозможно удалить базу данных, для которой созданы таблицы',
      ],
      'Database could not be deleted.': ['База данных не может быть удалена.'],
      'Stopped an unsafe database connection': [
        'Выберите любые столбцы для проверки метаданных',
      ],
      'Could not load database driver': [
        'Невозможно загрузить драйвер базы данных',
      ],
      'Unexpected error occurred, please check your logs for details': [
        'Произошла непредвиденная ошибка, пожалуйста, проверьте логи для подробностей',
      ],
      'Import database failed for an unknown reason': [
        'Импорт базы данных не удался по неизвестной причине',
      ],
      'Could not load database driver: {}': [
        'Невозможно загрузить драйвер базы данных: {}',
      ],
      'Deleted %(num)d dataset': ['Удалено датасетов: %(num)d'],
      'Null or Empty': ['Null или пусто'],
      'Database not allowed to change': ['Базу данных не разрешено изменять'],
      'One or more columns do not exist': [
        'Один или несколько столбцов не существуют',
      ],
      'One or more columns are duplicated': [
        'Один или несколько столбцов-дубликатов',
      ],
      'One or more columns already exist': [
        'Один или несколько столбцов уже существуют',
      ],
      'One or more metrics do not exist': [
        'Выберите один или несколько показателей для отображения',
      ],
      'One or more metrics are duplicated': [
        'Выберите один или несколько показателей для отображения',
      ],
      'One or more metrics already exist': [
        'Выберите один или несколько показателей для отображения',
      ],
      'Table [%(table_name)s] could not be found, please double check your database connection, schema, and table name':
        [
          'Не удалось найти таблицу [%(table_name)s]. Пожалуйста, проверьте подключение к базе данных, схему и имя таблицы',
        ],
      'Dataset parameters are invalid.': [
        'Параметры датасета недействительны.',
      ],
      'Dataset could not be created.': ['Датасет не может быть создан.'],
      'Dataset could not be updated.': ['Датасет не может быть обновлён.'],
      'Dataset could not be deleted.': ['Датасет не может быть удалён.'],
      'Dataset(s) could not be bulk deleted.': [
        'Датасет(ы) не может быть удален.',
      ],
      'Changing this dataset is forbidden': [
        'Изменение этого датасета запрещено',
      ],
      'Import dataset failed for an unknown reason': [
        'Импорт датасета не удался по неизвестной причине',
      ],
      'Unknown Presto Error': ['Неизвестная ошибка'],
      'We can\'t seem to resolve the column "%(column_name)s" at line %(location)s.':
        [''],
      'The table "%(table_name)s" does not exist. A valid table must be used to run this query.':
        [''],
      'Deleted %(num)d saved query': ['Удалено %(num)d сохранённых запросов'],
      'Saved queries could not be deleted.': [
        'Сохранённые запросы не могут быть удалены.',
      ],
      'Saved query not found.': ['Сохранённый запрос не найден.'],
      'Deleted %(num)d report schedule': ['Удалено %(num)d рассылок'],
      'Alert query returned more than one row. %s rows returned': [
        'Запрос от оповещения вернул больше одной строки. %s строк возвращено',
      ],
      'Alert query returned more than one column. %s columns returned': [
        'Запрос от оповещения вернул больше одного столбца. %s столбцов возвращено',
      ],
      'Dashboard does not exist': ['Дашборд не существует'],
      'Chart does not exist': ['График не существует'],
      'Database is required for alerts': [
        'База данных требуется для уведомлений',
      ],
      'Type is required': ['Тип обязателен'],
      'Choose a chart or dashboard not both': ['Удалить график из дашборда'],
      'Report Schedule parameters are invalid.': [
        'Параметры графика рассылки недействительны.',
      ],
      'Report Schedule could not be deleted.': [
        'Рассылка не может быть удалена.',
      ],
      'Report Schedule could not be created.': [
        'Рассылка не может быть создана.',
      ],
      'Report Schedule could not be updated.': [
        'Рассылка не может быть обновлена.',
      ],
      'Report Schedule not found.': ['График рассылки не найден.'],
      'Report Schedule delete failed.': [
        'Удаление графика рассылки не удалось.',
      ],
      'Report Schedule log prune failed.': [
        'Удаление журнала рассылки не удалось.',
      ],
      'Report Schedule execution failed when generating a screenshot.': [
        'Ошибка при генерировании скриншота во время выполнения рассылки.',
      ],
      'Report Schedule execution got an unexpected error.': [
        'Во время выполнения рассылки произошла непредвиденная ошибка.',
      ],
      'Report Schedule is still working, refusing to re-compute.': [''],
      'Report Schedule reached a working timeout.': [
        'Рассылка достигла тайм-аута в работе.',
      ],
      'Alert query returned more than one row.': [
        'Запрос для оповещения вернул больше одной строки.',
      ],
      'Alert validator config error.': [
        'Неверная конфигурация широты и долготы.',
      ],
      'Alert query returned more than one column.': [
        'Запрос для оповещения вернул больше одного столбца.',
      ],
      'Alert query returned a non-number value.': [
        'Запрос для оповещения вернул не число.',
      ],
      'Alert found an error while executing a query.': [
        'Обнаружена ошибка в запросе.',
      ],
      'Alert fired during grace period.': [''],
      'Alert ended grace period.': [''],
      'Alert on grace period': [''],
      'Report Schedule sellenium user not found': [
        'Пользователь Selenium для графика рассылки не найден',
      ],
      'Report Schedule state not found': [
        'Не найдено состояние графика рассылки',
      ],
      'Report schedule unexpected error': [
        'Неожиданная ошибка графика рассылки',
      ],
      'Changing this report is forbidden': ['Изменение этого отчёта запрещено'],
      'An error occurred while pruning logs ': [
        'Произошла ошибка при удалении журналов ',
      ],
      '\n            <b><a href="%(url)s">Explore in Superset</a></b><p></p>\n            <img src="cid:%(msgid)s">\n            ':
        [
          '\n            <b><a href=“%(url)s”>Исследовать в Superset</a></b><p></p>\n            <img src=“cid:%(msgid)s”>\n            ',
        ],
      '%(prefix)s %(title)s': ['%(prefix)s %(title)s'],
      '\n            *%(name)s*\n\n            <%(url)s|Explore in Superset>\n            ':
        [
          '\n            *%(name)s*\n\n            <%(url)s|Исследовать в Superset>\n            ',
        ],
      '\n        *%(name)s*\n\n        <%(url)s|Explore in Superset>\n        ':
        [
          '\n        *%(name)s*\n\n        <%(url)s|Исследовать в Superset>\n        ',
        ],
      '<b><a href="%(url)s">Explore in Superset</a></b><p></p>': [
        '<b><a href=“%(url)s”>Исследовать в Superset</a></b><p></p>',
      ],
      '%(name)s.csv': ['%(name)s.csv'],
      '\n        *%(slice_name)s*\n\n        <%(slice_url_user_friendly)s|Explore in Superset>\n        ':
        [
          '\n        *%(slice_name)s*\n\n        <%(slice_url_user_friendly)s|Исследовать в Superset>\n        ',
        ],
      '[Alert] %(label)s': ['[Оповещение] %(label)s'],
      New: ['Новый'],
      'SQL Query': ['Сохранить запрос'],
      Chart: ['График'],
      Dashboard: ['Дашборд'],
      Profile: ['Профиль'],
      Info: ['Инфо'],
      Logout: ['Выход из системы'],
      Login: ['Вход в систему'],
      'Record Count': ['Количество записей'],
      'No records found': ['Записи не найдены'],
      'Filter List': ['Фильтры'],
      Search: ['Поиск'],
      Refresh: ['Принудительное обновление'],
      'Import dashboards': ['Импорт дашбордов'],
      'Import Dashboard(s)': ['Импорт дашборда(ов)'],
      File: ['Файл'],
      'Choose File': ['Выберите файл'],
      Upload: ['Загрузить'],
      'No Access!': ['Нет доступа!'],
      'You do not have permissions to access the datasource(s): %(name)s.': [
        'У вас нет разрешений на доступ к источнику(ам) данных: %(name)s.',
      ],
      'Request Permissions': ['Запросить права доступа'],
      Cancel: ['Отменить'],
      'Use the edit buttom to change this field': [
        'Используйте кнопку правки для изменения этого поля',
      ],
      'Test Connection': ['Тестовое соединение'],
      '[Superset] Access to the datasource %(name)s was granted': [
        'Доступ к базе данных предоставлен для пользователя — %(name)s',
      ],
      'Unable to find such a holiday: [{}]': [
        'Невозможно найти такой выходной день: [{}]',
      ],
      'Referenced columns not available in DataFrame.': [
        'Ссылочные столбца недоступны в DataFrame.',
      ],
      'Column referenced by aggregate is undefined: %(column)s': [
        'Столбец, на который ссылается агрегат, не определён: %(column)s',
      ],
      'Operator undefined for aggregator: %(name)s': [''],
      'Invalid numpy function: %(operator)s': [
        'Недействительная функция numpy: %(operator)s',
      ],
      'Pivot operation requires at least one index': [''],
      'Pivot operation must include at least one aggregate': [''],
      'Undefined window for rolling operation': [''],
      'Invalid rolling_type: %(type)s': [''],
      'Invalid options for %(rolling_type)s: %(options)s': [''],
      'Invalid cumulative operator: %(operator)s': [''],
      'Invalid geohash string': ['Недействительная строка geohash'],
      'Invalid longitude/latitude': ['Долгота и Широта [Конец]'],
      'Invalid geodetic string': ['Недействительная строка geodetic'],
      '`fbprophet` package not installed': ['`fbprophet` пакет не установлен'],
      'Time grain missing': ['Период времени'],
      'Unsupported time grain: %(time_grain)s': [
        'Недействительная гранулярность времени: %(time_grain)s',
      ],
      'Periods must be a positive integer value': [
        'Периоды должны быть положительными делами числами',
      ],
      'Confidence interval must be between 0 and 1 (exclusive)': [
        'Доверительный интервал должен быть между 0 и 1 (исключая)',
      ],
      'DataFrame must include temporal column': [
        'DataFrame должен включать временной столбец',
      ],
      'DataFrame include at least one series': [
        'Пожалуйста, выберите хотя бы один показатель',
      ],
      'percentiles must be a list or tuple with two numeric values, of which the first is lower than the second value':
        [
          'процентили должны быть списками из кортежами из двух числовых значений, в которых первое значение меньше второго',
        ],
      User: ['Пользователь'],
      'User Roles': ['Роли пользователей'],
      'Database URL': ['URL базы данных'],
      'Roles to grant': ['Роли для предоставления'],
      'Created On': ['Дата создания'],
      'List Observations': ['Список показателей'],
      'Show Observation': [''],
      'Error Message': ['Предупреждающее сообщение'],
      'Log Retentions (days)': ['Время жизни журналов (в днях)'],
      "A semicolon ';' delimited list of email addresses": [
        'Список адресов, разделённый точкой с запятой ‘;’',
      ],
      'How long to keep the logs around for this alert': [
        'Как долго хранить логи для данного оповещения',
      ],
      'Once an alert is triggered, how long, in seconds, before Superset nags you again.':
        [
          'После срабатывания оповещения, как долго Superset не должен надоедать снова.',
        ],
      'A SQL statement that defines whether the alert should get triggered or not. The query is expected to return either NULL or a number value.':
        [
          'SQL-выражение, которое определяет сработало оповещение или нет. Запрос должен вернуть NULL или числовое значение.',
        ],
      'annotation start time or end time is required.': [
        'время начала или окончания аннотации обязательно.',
      ],
      'Annotation end time must be no earlier than start time.': [
        'Конец интервала для аннотации должен быть не раньше начала.',
      ],
      Annotations: ['Аннотации'],
      'Show Annotation': ['Аннотации'],
      'Add Annotation': ['Добавить слой аннотации'],
      'Edit Annotation': ['Аннотации'],
      Layer: ['Слой'],
      Label: ['Метка'],
      Start: ['Время начала'],
      End: ['Конец'],
      'JSON Metadata': ['Параметры JSON'],
      'Show Annotation Layer': ['Слои аннотаций'],
      'Add Annotation Layer': ['Добавить слой аннотации'],
      'Edit Annotation Layer': ['Добавить слой аннотации'],
      Name: ['Название'],
      'Dataset %(name)s already exists': [
        'Источник данных %(name)s уже существует',
      ],
      'Table [%{table}s] could not be found, please double check your database connection, schema, and table name, error: {}':
        [
          'Не удалось найти таблицу [{}]. Проверьте подключение к базе данных, схему и имя таблицы.',
        ],
      "json isn't valid": ['json не валиден'],
      'Export to YAML': ['Экспорт в YAML'],
      'Export to YAML?': ['Экспорт в YAML?'],
      Delete: ['Удалить'],
      'Delete all Really?': ['Удалить все?'],
      'Is favorite': ['В Избранном'],
      'The data source seems to have been deleted': [
        'Источник данных, похоже, был удален',
      ],
      'The user seems to have been deleted': [
        'Пользователь, кажется, был удален',
      ],
      'Access was requested': ['Запрошен доступ'],
      'The access requests seem to have been deleted': [
        'Запросы доступа, похоже, были удалены',
      ],
      '%(user)s was granted the role %(role)s that gives access to the %(datasource)s':
        [
          '%(user)s была предоставлена роль %(role)s, которая дает доступ к ресурсам %(datasource)s',
        ],
      'Role %(r)s was extended to provide the access to the datasource %(ds)s':
        [
          'Роль %(r) s была расширена для обеспечения доступа к источнику данных %(ds)s',
        ],
      'You have no permission to approve this request': [
        'У вас нет разрешения на утверждение этого запроса',
      ],
      'Cannot import dashboard: %(db_error)s.\nMake sure to create the database before importing the dashboard.':
        [
          'Невозможно импортировать дашборд: %(db_error)s.\nУбедитесь, что перед импортом дашборда была создана база данных.',
        ],
      'An unknown error occurred. Please contact your Superset administrator': [
        'Произошла неизвестная ошибка. Пожалуйста, свяжитесь с администратором Superset',
      ],
      'Error occurred when opening the chart: %(error)s': [
        'Произошла ошибка при открытии графика: %(error)s',
      ],
      "You don't have the rights to ": ['У вас нет прав на '],
      'alter this ': ['изменить этот '],
      chart: ['график'],
      'create a ': ['создать '],
      'Explore - %(table)s': ['Исследовать - %(table)s'],
      'Chart [{}] has been saved': ['График [{}] был сохранён'],
      'Chart [{}] has been overwritten': ['График [{}] был перезаписан'],
      dashboard: ['дашборд'],
      'Chart [{}] was added to dashboard [{}]': [
        'График [{}] был добавлен к дашборду [{}]',
      ],
      'Dashboard [{}] just got created and chart [{}] was added to it': [
        'Дашборд [{}] был создан, и на него был добавлен график [{}]',
      ],
      'This dashboard was changed recently. Please reload dashboard to get latest version.':
        [
          'Этот дашборд был недавно изменён. Пожалуйста, перезагрузите дашборд, чтобы получить последнюю версию.',
        ],
      'Could not load database driver: %(driver_name)s': [
        'Невозможно загрузить драйвер базы данных: %(driver_name)s',
      ],
      "Invalid connection string, a valid string usually follows:\n'DRIVER://USER:PASSWORD@DB-HOST/DATABASE-NAME'":
        [
          'Недействительная строка подключения, правильная строка обычно следует следующему шаблону:\n‘драйвер://пользователь:пароль@хостБД/имяБД’',
        ],
      'Malformed request. slice_id or table_name and db_name arguments are expected':
        [
          'Неправильный запрос. Ожидаются аргументы slice_id или table_name и db_name',
        ],
      'Chart %(id)s not found': ['График %(id)s не найден'],
      "Table %(table)s wasn't found in the database %(db)s": [
        'Таблица %(table)s не найдена в базе данных %(db)s',
      ],
      "Can't find User '%(name)s', please ask your admin to create one.": [
        'Не удалось найти пользователя ‘%(name)s’. Обратитесь к администратору, чтобы создать его.',
      ],
      "Can't find DruidCluster with cluster_name = '%(name)s'": [
        'Не удалось найти DruidCluster с именем cluster_name = ‘%(name)s’',
      ],
      'Data could not be deserialized. You may want to re-run the query.': [''],
      '%(validator)s was unable to check your query.\nPlease recheck your query.\nException: %(ex)s':
        [''],
      'Failed to start remote query on a worker. Tell your administrator to verify the availability of the message queue.':
        [
          'Не удалось начать выполнение запроса на воркере. Сообщите администратору о необходимости проверить доступность очереди сообщений.',
        ],
      'Query record was not created as expected.': [
        'Запись запроса не была создана должным образом.',
      ],
      'The parameter %(parameters)s in your query is undefined.': [
        'Следующие параметры в запросе не определены: %(parameters)s.',
      ],
      "%(user)s's profile": ['Профиль пользователя %(user)s'],
      'Show CSS Template': ['Шаблоны CSS'],
      'Add CSS Template': ['Шаблоны CSS'],
      'Edit CSS Template': ['Шаблоны CSS'],
      'Template Name': ['Имя Шаблона'],
      'A human-friendly name': ['Понятное человеку имя'],
      'Used internally to identify the plugin. Should be set to the package name from the pluginʼs package.json':
        [
          'Используется системой для идентификации плагина. Должно быть установлено в имя пакета, которое указано в файле package.json',
        ],
      'A full URL pointing to the location of the built plugin (could be hosted on a CDN for example)':
        [''],
      'Custom Plugins': ['Пользовательское условие WHERE'],
      'Custom Plugin': ['Пользовательский плагин'],
      'Add a Plugin': ['Добавить плагин'],
      'Edit Plugin': ['Редактировать плагин'],
      'Schedule Email Reports for Dashboards': [
        'Запланировать рассылку по email для дашбордов',
      ],
      'Manage Email Reports for Dashboards': [
        'Управление рассылками для дашбордов',
      ],
      'Changed On': ['Изменено'],
      Active: ['Действия'],
      Crontab: [''],
      Recipients: ['Получатели'],
      'Slack Channel': ['Канал Slack'],
      'Deliver As Group': [''],
      'Delivery Type': ['Тип Подписи'],
      'Schedule Email Reports for Charts': [
        'Запланировать рассылку по email для графиков',
      ],
      'Manage Email Reports for Charts': [
        'Управление рассылкой email для графиков',
      ],
      'Email Format': ['Формат значения'],
      'List Saved Query': ['Список сохраненных запросов'],
      'Show Saved Query': ['Показать сохраненный запрос'],
      'Add Saved Query': ['Добавить сохраненный запрос'],
      'Edit Saved Query': ['Изменить сохраненный запрос'],
      'End Time': ['Время окончания'],
      'Pop Tab Link': ['Открыть'],
      'Changed on': ['Изменено'],
      'Could not determine datasource type': [
        'Невозможно определить тип источника данных',
      ],
      'Could not find viz object': ['Невозможно найти объект визуализации'],
      'Show Chart': ['Показать график'],
      'Add Chart': ['Добавить график'],
      'Edit Chart': ['Редактировать график'],
      'These parameters are generated dynamically when clicking the save or overwrite button in the explore view. This JSON object is exposed here for reference and for power users who may want to alter specific parameters.':
        [
          'Эти параметры генерируются автоматически при нажатии кнопки сохранения. Опытные пользователи могут изменить определенные объекты в формате JSON.',
        ],
      'Duration (in seconds) of the caching timeout for this chart. Note this defaults to the datasource/table timeout if undefined.':
        [
          'Продолжительность (в секундах) таймаута кэширования для этого графика.',
        ],
      'Last Modified': ['Изменено'],
      Parameters: ['Параметры'],
      'Visualization Type': ['Тип визуализации'],
      'Show Dashboard': ['Показать дашборд'],
      'Add Dashboard': ['Добавить дашборд'],
      'Edit Dashboard': ['Изменить'],
      'Edit dashboard': ['Изменить'],
      'This json object describes the positioning of the widgets in the dashboard. It is dynamically generated when adjusting the widgets size and positions by using drag & drop in the dashboard view':
        [
          'Этот объект JSON описывает расположение виджетов в дашборде. Он динамически генерируется при настройке размера и позиции виджетов в дашборде с помощью drag & drop',
        ],
      'The CSS for individual dashboards can be altered here, or in the dashboard view where changes are immediately visible':
        [
          'В этом поле можно задать индивидуальный стиль для дашборда с помощью CSS',
        ],
      'To get a readable URL for your dashboard': [
        'Получить читаемый URL-адрес для дашборда',
      ],
      'This JSON object is generated dynamically when clicking the save or overwrite button in the dashboard view. It is exposed here for reference and for power users who may want to alter specific parameters.':
        [
          'Этот JSON-объект генерируется автоматически при сохранении или перезаписи дашборда. Он размещён здесь справочно и для опытных пользователей.',
        ],
      'Owners is a list of users who can alter the dashboard.': [
        'Владельцы - это пользователи, которые могут изменять дашборд.',
      ],
      'Determines whether or not this dashboard is visible in the list of all dashboards':
        ['Определяет видимость дашборда в списке всех дашбордов'],
      Title: ['Название'],
      Slug: ['Читаемый URL'],
      Published: ['Опубликовано'],
      'Position JSON': ['Позиция JSON'],
      CSS: ['CSS'],
      'Underlying Tables': ['Базовые таблицы'],
      Export: ['Экспорт'],
      'Export dashboards?': ['Экспортировать дашборд?'],
      'Name of table to be created from csv data.': [
        'Имя таблицы, которая будет сформирована из данных csv.',
      ],
      'CSV File': ['CSV-файл'],
      'Select a CSV file to be uploaded to a database.': [
        'Выберите файл CSV, который будет загружен в БД.',
      ],
      'Only the following file extensions are allowed: %(allowed_extensions)s':
        [
          'Разрешены файлы только в следующих расширениях: %(allowed_extensions)s',
        ],
      'Specify a schema (if database flavor supports this).': [
        'Укажите схему (если это поддерживается базой данных).',
      ],
      Delimiter: ['Разделитель'],
      'Delimiter used by CSV file (for whitespace use \\s+).': [
        'Разделитель, используемый CSV-файлом (для пробелов используется \\s+).',
      ],
      'Table Exists': ['Метод добавления'],
      'If table exists do one of the following: Fail (do nothing), Replace (drop and recreate table) or Append (insert data).':
        [
          'Если таблица уже существует, выполните одно из следующих действий: Fail (ничего не делать), Replace (удалить и заново создать таблицу) или Append (добавить данные).',
        ],
      Fail: ['Ошибка'],
      Replace: ['Заменить'],
      Append: ['Добавить'],
      'Header Row': ['Строка заголовков'],
      'Row containing the headers to use as column names (0 is first line of data). Leave empty if there is no header row.':
        [
          'Строка, содержащая заголовки для использования в качестве имен столбцов (0 - первая строка данных). Оставьте пустым, если строка заголовка отсутствует.',
        ],
      'Index Column': ['Столбец индекса'],
      'Column to use as the row labels of the dataframe. Leave empty if no index column.':
        [
          'Столбец для использования в качестве меток строк данных. Оставьте пустым, если столбец индекса отсутствует.',
        ],
      'Mangle Duplicate Columns': ['Дубликаты'],
      'Specify duplicate columns as "X.0, X.1".': [
        'Если есть столбцы с одинаковым именем, то присвоить им порядковые номера - столбец1, столбец2, … и т.д.',
      ],
      'Skip Initial Space': ['Убрать пробелы'],
      'Skip spaces after delimiter.': ['Пропустить пробелы после разделителя.'],
      'Skip Rows': ['Игнорировать'],
      'Number of rows to skip at start of file.': [
        'Количество первых строк, которые нужно проигнорировать.',
      ],
      'Rows to Read': ['Строки для чтения'],
      'Number of rows of file to read.': ['Количество строк файла для чтения.'],
      'Skip Blank Lines': ['Пропустить пустые строки'],
      'Skip blank lines rather than interpreting them as NaN values.': [
        'Пропустите пустые строки, а не интерпретировать их как значения NaN.',
      ],
      'Parse Dates': ['Разбор Дат'],
      'A comma separated list of columns that should be parsed as dates.': [
        'Разделённый запятыми список столбцов, которые должен быть интерпретированы как даты.',
      ],
      'Infer Datetime Format': ['Формат даты и времени'],
      'Use Pandas to interpret the datetime format automatically.': [
        'Используйте Pandas для автоматической интерпретации формата даты и времени.',
      ],
      'Decimal Character': ['Десятичный символ'],
      'Character to interpret as decimal point.': [
        'Символ, который интерпретируется как десятичная точка.',
      ],
      'Dataframe Index': ['Индекс'],
      'Write dataframe index as a column.': [
        'Записывайте индекс данных в виде столбца.',
      ],
      'Column Label(s)': ['Обозначения столбцов'],
      'Column label for index column(s). If None is given and Dataframe Index is True, Index Names are used.':
        [
          'Обозначение столбца для столбцов с индексами. Если поле пустое, а настройка [Индекс] включена, то используются имена индексов.',
        ],
      'Null values': ['Значение фильтра'],
      'Json list of the values that should be treated as null. Examples: [""], ["None", "N/A"], ["nan", "null"]. Warning: Hive database supports only single value. Use [""] for empty string.':
        [''],
      'Name of table to be created from excel data.': [
        'Имя таблицы, которая будет сформирована из данных csv.',
      ],
      'Excel File': ['Файл Excel'],
      'Select a Excel file to be uploaded to a database.': [
        'Выберите файл CSV, который будет загружен в БД.',
      ],
      'Sheet Name': ['Полное имя'],
      'Strings used for sheet names (default is the first sheet).': [
        'Строки, используемые для имён листов (по-умолчанию это первый лист).',
      ],
      'Show Database': ['Показать Базу Данных'],
      'Add Database': ['Добавить Базу Данных'],
      'Edit Database': ['Редактировать Базу Данных'],
      'Expose this DB in SQL Lab': ['Показать базу данных в SQL Редакторе'],
      'Operate the database in asynchronous mode, meaning  that the queries are executed on remote workers as opposed to on the web server itself. This assumes that you have a Celery worker setup as well as a results backend. Refer to the installation docs for more information.':
        [''],
      'Allow CREATE TABLE AS option in SQL Lab': [
        'Разрешить выполнять инструкцию CREATE TABLE AS в редакторе SQL',
      ],
      'Allow CREATE VIEW AS option in SQL Lab': [
        'Разрешить выполнять инструкцию CREATE TABLE AS в редакторе SQL',
      ],
      'Allow users to run non-SELECT statements (UPDATE, DELETE, CREATE, ...) in SQL Lab':
        [
          'Позволяет пользователям запускать инструкции (UPDATE, DELETE, CREATE, …) без SELECT в редакторе SQL',
        ],
      'When allowing CREATE TABLE AS option in SQL Lab, this option forces the table to be created in this schema':
        [
          'При разрешении опции CREATE TABLE AS в редакторе SQL эта опция создаст таблицу в выбранной схеме',
        ],
      'If Presto, Trino or Drill all the queries in SQL Lab are going to be executed as the currently logged on user who must have permission to run them.<br/>If Hive and hive.server2.enable.doAs is enabled, will run the queries as service account, but impersonate the currently logged on user via hive.server2.proxy.user property.':
        [
          'Если вы используете Presto, все запросы в SQL-Редакторе будут выполняться от авторизованного пользователя, который должен иметь разрешение на их выполнение. <br/> Если включен Hive, то запросы будут выполняться через техническую учетную запись, но ассоциировать зарегистрированного пользователя можно через свойство hive.server2.proxy.user.',
        ],
      'Allow SQL Lab to fetch a list of all tables and all views across all database schemas. For large data warehouse with thousands of tables, this can be expensive and put strain on the system.':
        [''],
      'Duration (in seconds) of the caching timeout for charts of this database. A timeout of 0 indicates that the cache never expires. Note this defaults to the global timeout if undefined.':
        [''],
      'If selected, please set the schemas allowed for csv upload in Extra.': [
        'Если включено, выберите схему, в которую разрешено загружать CSV на вкладке “Дополнительно”.',
      ],
      'Expose in SQL Lab': ['Открыть в SQL редакторе'],
      'Allow CREATE TABLE AS': ['Разрешить CREATE TABLE AS'],
      'Allow CREATE VIEW AS': ['Разрешить CREATE TABLE AS'],
      'Allow DML': ['Allow DML'],
      'CTAS Schema': ['Схема по умолчанию'],
      'SQLAlchemy URI': ['SQLAlchemy URI'],
      'Chart Cache Timeout': ['Тайм-аут Кэша'],
      'Secure Extra': ['Безопасность'],
      'Root certificate': ['Корневой сертификат'],
      'Async Execution': ['Асинхронное выполнение'],
      'Impersonate the logged on user': ['Ассоциировать пользователя'],
      'Allow Csv Upload': ['Разрешить загрузку CSV'],
      'Allow Multi Schema Metadata Fetch': [''],
      Backend: [''],
      'Extra field cannot be decoded by JSON. %(msg)s': [''],
      "Invalid connection string, a valid string usually follows:'DRIVER://USER:PASSWORD@DB-HOST/DATABASE-NAME'<p>Example:'postgresql://user:password@your-postgres-db/database'</p>":
        [
          "Недействительная строка подключения, правильная строка обычно следует следующему шаблону: драйвер://пользователь:пароль@хостБД/имяБД<p>Пример:’postgresql://user:password@your-postgres-db/database'</p>",
        ],
      'CSV to Database configuration': ['Настройка CSV для БД'],
      'Database "%(database_name)s" schema "%(schema_name)s" is not allowed for csv uploads. Please contact your Superset Admin.':
        [
          'Схема “%(schema_name)s” в базе данных “%(database_name)s” не разрешена для загрузки CSV. Пожалуйста, свяжитесь с администратором Superset.',
        ],
      'You cannot specify a namespace both in the name of the table: "%(csv_table.table)s" and in the schema field: "%(csv_table.schema)s". Please remove one':
        [
          'Нельзя указывать область имён одновременно и в имени таблицы: “%(csv_table.table)s” и в поле схемы: “%(csv_table.schema)s”. Пожалуйста, удалите в одном из мест',
        ],
      'Unable to upload CSV file "%(filename)s" to table "%(table_name)s" in database "%(db_name)s". Error message: %(error_msg)s':
        [
          'Невозможно загрузить CSV-файл "%(filename)s" таблицу "%(table_name)s" базы данных "%(db_name)s”. Сообщение об ошибке: %(error_msg)s',
        ],
      'CSV file "%(csv_filename)s" uploaded to table "%(table_name)s" in database "%(db_name)s"':
        [
          'CSV-файл "%(csv_filename)s" загружен в таблицу "%(table_name)s" базы данных "%(db_name)s"',
        ],
      'Excel to Database configuration': ['Настройка CSV для БД'],
      'Database "%(database_name)s" schema "%(schema_name)s" is not allowed for excel uploads. Please contact your Superset Admin.':
        [
          'Схема “%(schema_name)s” в базе данных “%(database_name)s” не разрешена для загрузок Excel-файлов. Пожалуйста, свяжитесь с администратором Superset.',
        ],
      'You cannot specify a namespace both in the name of the table: "%(excel_table.table)s" and in the schema field: "%(excel_table.schema)s". Please remove one':
        [''],
      'Unable to upload Excel file "%(filename)s" to table "%(table_name)s" in database "%(db_name)s". Error message: %(error_msg)s':
        [
          'Невозможно загрузить Excel-файл "%(filename)s" в таблицу "%(table_name)s" базы данных "%(db_name)s”. Сообщение об ошибке: %(error_msg)s',
        ],
      'Excel file "%(excel_filename)s" uploaded to table "%(table_name)s" in database "%(db_name)s"':
        [
          'Excel-файл “%(excel_filename)s" загружен в таблицу "%(table_name)s" базы данных "%(db_name)s"',
        ],
      Logs: ['Журналы'],
      'Show Log': ['Показать итоги'],
      'Add Log': ['Добавить журнал'],
      'Edit Log': ['Редактировать'],
      Action: ['Действия'],
      dttm: ['dttm'],
      'Add item': ['Добавить фильтр'],
      "The query couldn't be loaded": ['Запрос невозможно загрузить'],
      'Your query has been scheduled. To see details of your query, navigate to Saved queries':
        [
          'Запрос был запланирован. Чтобы посмотреть детали запроса, перейдите в Сохранённые запросы',
        ],
      'Your query could not be scheduled': [
        'Ваш запрос не может быть сохранен',
      ],
      'Failed at retrieving results': ['Невозможно выполнить запрос'],
      'An error occurred while storing the latest query id in the backend. Please contact your administrator if this problem persists.':
        [''],
      'Unknown error': ['Неизвестная ошибка'],
      'Query was stopped.': ['Запрос прерван.'],
      'Unable to migrate table schema state to backend. Superset will retry later. Please contact your administrator if this problem persists.':
        [''],
      'Unable to migrate query state to backend. Superset will retry later. Please contact your administrator if this problem persists.':
        [''],
      'Unable to migrate query editor state to backend. Superset will retry later. Please contact your administrator if this problem persists.':
        [''],
      'Unable to add a new tab to the backend. Please contact your administrator.':
        [''],
      'Copy of %s': ['Копирование %s'],
      'An error occurred while setting the active tab. Please contact your administrator.':
        [
          'Произошла ошибка при установке активной вкладки. Пожалуйста, свяжитесь с администратором.',
        ],
      'An error occurred while fetching tab state': [
        'Произошла ошибка при получении метаданных из таблицы',
      ],
      'An error occurred while removing tab. Please contact your administrator.':
        [
          'Произошла ошибка при удалении вкладки. Пожалуйста, свяжитесь с администратором.',
        ],
      'An error occurred while removing query. Please contact your administrator.':
        [
          'Произошла ошибка при удалении запроса. Пожалуйста, свяжитесь с администратором.',
        ],
      'An error occurred while setting the tab database ID. Please contact your administrator.':
        [
          'Произошла ошибка при установке ID базы данных для вкладки. Пожалуйста, свяжитесь с администратором.',
        ],
      'An error occurred while setting the tab schema. Please contact your administrator.':
        [
          'Произошла ошибка при настройке схемы вкладок. Пожалуйста, свяжитесь с администратором.',
        ],
      'An error occurred while setting the tab autorun. Please contact your administrator.':
        [
          'Произошла ошибка при настройке автозапуска вкладки. Пожалуйста, свяжитесь с администратором.',
        ],
      'An error occurred while setting the tab title. Please contact your administrator.':
        [
          'Произошла ошибка при настройке заголовка вкладки. Пожалуйста, свяжитесь с администратором.',
        ],
      'Your query was saved': ['Ваш запрос был сохранен'],
      'Your query could not be saved': ['Ваш запрос не может быть сохранен'],
      'Your query was updated': ['Ваш запрос был сохранен'],
      'Your query could not be updated': ['Ваш запрос не может быть сохранен'],
      'An error occurred while storing your query in the backend. To avoid losing your changes, please save your query using the "Save Query" button.':
        [
          'Произошла ошибка при сохранении запроса в бэкенд. Чтобы сохранить изменения, пожалуйста, сохраните ваш запрос через кнопку “Сохранить запрос”.',
        ],
      'An error occurred while setting the tab template parameters. Please contact your administrator.':
        [
          'Произошла ошибка при установке параметров шаблона вкладки. Пожалуйста, свяжитесь с администратором.',
        ],
      'An error occurred while fetching table metadata': [
        'Произошла ошибка при получении метаданных из таблицы',
      ],
      'An error occurred while fetching table metadata. Please contact your administrator.':
        [
          'Произошла ошибка при получении метаданных таблицы. Пожалуйста, свяжитесь с администратором.',
        ],
      'An error occurred while expanding the table schema. Please contact your administrator.':
        [
          'Произошла ошибка при разворачивании схемы. Пожалуйста, свяжитесь с администратором.',
        ],
      'An error occurred while collapsing the table schema. Please contact your administrator.':
        [
          'Произошла ошибка при сворачивании схемы. Пожалуйста, свяжитесь с администратором.',
        ],
      'An error occurred while removing the table schema. Please contact your administrator.':
        [
          'Произошла ошибка при удалении схемы. Пожалуйста, свяжитесь с администратором.',
        ],
      'Shared query': ['Общий запрос'],
      "The datasource couldn't be loaded": ['Запрос невозможно загрузить'],
      'An error occurred while creating the data source': [
        'Произошла ошибка при создании источника данных',
      ],
      "SQL Lab uses your browser's local storage to store queries and results.\n Currently, you are using ${currentUsage.toFixed(\n            2,\n          )} KB out of ${LOCALSTORAGE_MAX_USAGE_KB} KB. storage space.\n To keep SQL Lab from crashing, please delete some query tabs.\n You can re-access these queries by using the Save feature before you delete the tab. Note that you will need to close other SQL Lab windows before you do this.":
        [
          'Лаборатория SQL использует хранилище локального кеша вашего браузера, чтобы сохранить запросы и результаты из вкладок.\n Сейчас вы используете ${currentUsage.toFixed(\n            2,\n          )} KB из ${LOCALSTORAGE_MAX_USAGE_KB} KB пространства.\n Чтобы уберечь Лабораторию SQL от ошибок, пожалуйста, удалите неиспользуемые вкладки с запросами.\n Вы можете получить доступ к этим запросам позже, если сохраните их перед удалением вкладки. Обратите внимание, что перед удалением вкладок нужно будет закрыть другие окна с Лабораторией SQL.',
        ],
      'Estimate selected query cost': ['Выполнить выбранный запрос'],
      'Estimate cost': ['Выполнить выбранный запрос'],
      'Cost estimate': ['Прогноз затрат'],
      'Creating a data source and creating a new tab': [
        'Создание источника данных и добавление новой вкладки',
      ],
      'An error occurred': ['Произошла ошибка'],
      'Explore the result set in the data exploration view': [
        'Исследовать набор данных',
      ],
      Explore: ['Обзор графика'],
      'This query took %s seconds to run, ': [
        'Выполнение этого запроса заняло %s секунд, ',
      ],
      'and the explore view times out at %s seconds ': [
        'а тайм-аут интерфейса исследования %s секунд ',
      ],
      'following this flow will most likely lead to your query timing out. ': [
        '',
      ],
      'We recommend your summarize your data further before following that flow. ':
        [''],
      'If activated you can use the ': [''],
      'feature to store a summarized data set that you can then explore.': [''],
      'Column name(s) ': ['Имена столбца(ов) '],
      'cannot be used as a column name. The column name/alias "__timestamp"\n          is reserved for the main temporal expression, and column aliases ending with\n          double underscores followed by a numeric value (e.g. "my_col__1") are reserved\n          for deduplicating duplicate column names. Please use aliases to rename the\n          invalid column names.':
        [''],
      'Raw SQL': ['Raw SQL'],
      'Source SQL': ['Источник SQL'],
      SQL: ['SQL'],
      'No query history yet...': ['История запросов пуста…'],
      "It seems you don't have access to any database": [
        'Кажется у Вас нет доступа к базе данных',
      ],
      'An error occurred when refreshing queries': [
        'Произошла ошибка при создании источника данных',
      ],
      'Filter by user': ['Значение фильтра'],
      'Filter by database': ['Выберите базу данных'],
      'Query search string': ['Поиск запросов'],
      '[From]-': ['[С]-'],
      '[To]-': ['[До]-'],
      'Filter by status': ['Значение фильтра'],
      Edit: ['Редактировать'],
      'View results': ['Посмотреть результаты'],
      'Data preview': ['Предпросмотр данных'],
      'Overwrite text in the editor with a query on this table': [
        'Перезаписать текст в редакторе с запросом к этой таблице',
      ],
      'Run query in a new tab': ['Выполнить запрос на новой вкладке'],
      'Remove query from log': ['Удалить запрос из журнала'],
      'An error occurred saving dataset': [
        'Произошла ошибка при создании источника данных',
      ],
      '.CSV': ['Экспорт в CSV'],
      Clipboard: ['Скопировать в буфер обмена'],
      'Filter results': ['Результаты поиска'],
      'Database error': ['Database Expression'],
      'was created': ['создан'],
      'Query in a new tab': ['Запрос в отдельной вкладке'],
      'The query returned no data': ['Результат пуст'],
      'Fetch data preview': ['Получить данные для просмотра'],
      'Refetch results': ['Результаты поиска'],
      'Track job': ['Отслеживать работу'],
      Stop: ['Стоп'],
      'Run selection': ['Выполнить выбранный запрос'],
      Run: ['Выполнить'],
      'Stop running (Ctrl + x)': ['Остановить (Ctrl + x)'],
      'Stop running (Ctrl + e)': ['Остановить (Ctrl + e)'],
      'Run query (Ctrl + Return)': ['Выполнить запрос (Ctrl + Return)'],
      'Save & Explore': ['Сохранить и исследовать'],
      'Overwrite & Explore': ['Перезаписать и исследовать'],
      Undefined: ['Не определено'],
      Save: ['Сохранить'],
      'Save as': ['Сохранить как'],
      'Save query': ['Сохранить запрос'],
      'Save as new': ['Сохранить как новый'],
      Update: ['Обновить'],
      'Label for your query': ['Метка для вашего запроса'],
      'Write a description for your query': [
        'Заполните описание к вашему запросу',
      ],
      'Schedule query': ['Сохранить запрос'],
      Schedule: ['Расписание'],
      'There was an error with your request': [
        'С вашим запросом произошла ошибка',
      ],
      'Please save the query to enable sharing': [
        'Пожалуйста, сохраните запрос, чтобы включить функцию “поделиться”',
      ],
      'Copy link': ['Скопировать ссылку'],
      'Copy query link to your clipboard': [
        'Скопировать часть запроса в буфер обмена',
      ],
      'Save the query to copy the link': [
        'Сохраните запрос, чтобы скопировать ссылку',
      ],
      'No stored results found, you need to re-run your query': [
        'Не найдены сохранённые результаты, необходимо повторно выполнить запрос',
      ],
      'Run a query to display results here': [
        'Выполнить запрос для отображения результатов',
      ],
      'Preview: `%s`': ['Предпросмотр %s'],
      Results: ['Результаты'],
      'Query history': ['История запросов'],
      'Run query': ['Выполнить запрос'],
      'New tab': ['Закрыть вкладку'],
      'Untitled query': ['Запрос без имени'],
      'Stop query': ['Остановить запрос'],
      'Schedule the query periodically': [
        'Запланировать периодическое выполнение запроса',
      ],
      'You must run the query successfully first': [
        'Сначала необходимо успешно выполнить запрос',
      ],
      'It appears that the number of rows in the query results displayed\n           was limited on the server side to\n           the %s limit.':
        [''],
      'CREATE TABLE AS': ['Разрешить CREATE TABLE AS'],
      'CREATE VIEW AS': ['Разрешить CREATE TABLE AS'],
      'Estimate the cost before running a query': [
        'Спрогнозировать время до выполнения запроса',
      ],
      'Reset state': ['Сбросить текущее состояние'],
      'Enter a new title for the tab': ['Введите название для таблицы'],
      'Untitled Query %s': ['Запрос без имени %s'],
      'Close tab': ['Закрыть вкладку'],
      'Rename tab': ['Переименовать вкладку'],
      'Expand tool bar': ['Показать панель инструментов'],
      'Hide tool bar': ['Скрыть панель инструментов'],
      'Close all other tabs': ['Закрыть все вкладки'],
      'Duplicate tab': ['Дублировать вкладку'],
      'Copy partition query to clipboard': [
        'Скопировать часть запроса в буфер обмена',
      ],
      'latest partition:': ['последний раздел:'],
      'Keys for table': ['Ключевые поля таблицы'],
      'View keys & indexes (%s)': ['Посмотреть ключи и индексы (%s)'],
      'Sort columns alphabetically': [
        'Отсортировать столбцы в алфавитном порядке',
      ],
      'Original table column order': [
        'Расположение столбцов как в исходной таблице',
      ],
      'Copy SELECT statement to the clipboard': [
        'Скопировать выражение SELECT в буфер обмена',
      ],
      'Show CREATE VIEW statement': ['Показать выражение CREATE VIEW'],
      'CREATE VIEW statement': ['Выражение CREATE VIEW'],
      'Remove table preview': ['Убрать предпросмотр таблицы'],
      'Assign a set of parameters as': [''],
      'below (example:': [''],
      '), and they become available in your SQL (example:': [''],
      ') by using': [''],
      'Edit template parameters': ['Изменить параметры шаблона'],
      'Invalid JSON': ['Недопустимый формат json'],
      'Create a new chart': ['Создать новый срез'],
      'Choose a dataset': ['Выберите источник данных'],
      'If the dataset you are looking for is not available in the list, follow the instructions on how to add it in the Superset tutorial.':
        [
          'Если датасет, который вы ищете не доступен в списке, следуйте инструкциям по добавлению его в руководстве по Superset.',
        ],
      'Choose a visualization type': ['Выберите тип визуализации'],
      'Create new chart': ['Создать новый график'],
      'An error occurred while loading the SQL': [
        'Произошла ошибка при создании источника данных',
      ],
      'Updating chart was stopped': ['Обновление графика остановлено'],
      'An error occurred while rendering the visualization: %s': [
        'Произошла ошибка при построении графика: %s',
      ],
      'Network error.': ['Ошибка сети.'],
      every: ['каждый'],
      'every month': ['месяц'],
      'every day of the month': ['каждый день месяца'],
      'day of the month': ['день месяца'],
      'every day of the week': ['каждый день недели'],
      'day of the week': ['день недели'],
      'every hour': ['каждый час'],
      'every minute UTC': [''],
      year: ['год'],
      month: ['месяц'],
      week: ['неделя'],
      day: ['день'],
      hour: ['час'],
      minute: ['минута'],
      reboot: [''],
      Every: [''],
      in: ['в'],
      on: [''],
      and: [''],
      at: [''],
      ':': [':'],
      'minute(s) UTC': ['5 минут'],
      'Invalid cron expression': [''],
      Clear: ['Очистить'],
      Sunday: ['Воскресенье'],
      Monday: ['Понедельник'],
      Tuesday: ['Вторник'],
      Wednesday: ['Среда'],
      Thursday: ['Четверг'],
      Friday: ['Пятница'],
      Saturday: ['Суббота'],
      January: ['Январь'],
      February: ['Февраль'],
      March: ['Март'],
      April: ['Апрель'],
      May: ['Май'],
      June: ['Июнь'],
      July: ['Июль'],
      August: ['Август'],
      September: ['Сентябрь'],
      October: ['Октябрь'],
      November: ['Ноябрь'],
      December: ['Декабрь'],
      SUN: ['ВС'],
      MON: ['ПН'],
      TUE: ['ВТ'],
      WED: ['СР'],
      THU: ['ЧТ'],
      FRI: ['ПТ'],
      SAT: ['СБ'],
      JAN: ['ЯНВ'],
      FEB: ['ФЕВ'],
      MAR: ['МАР'],
      APR: ['АПР'],
      MAY: ['МАЙ'],
      JUN: ['ИЮН'],
      JUL: ['ИЮЛ'],
      AUG: ['АВГ'],
      SEP: ['СЕН'],
      OCT: ['ОКТ'],
      NOV: ['НОЯ'],
      DEC: ['ДЕК'],
      OK: [''],
      'Click to see difference': ['Нажмите, чтобы увидеть разницу'],
      Altered: ['Изменения'],
      'Chart changes': ['Изменения не сохранены'],
      'Superset chart': ['График Superset'],
      'Check out this chart in dashboard:': [
        'Посмотреть этот график в дашборде:',
      ],
      'Select ...': ['Выбрать …'],
      'Loaded data cached': ['Данные были загружены в кэш'],
      'Loaded from cache': ['Загружается из кэша'],
      'Click to force-refresh': ['Нажмите для принудительного обновления'],
      cached: [''],
      'Certified by %s': ['Сертифицирован: %s'],
      'Copy to clipboard': ['Скопировать в буфер обмена'],
      'Copied!': ['Скопировано!'],
      'Sorry, your browser does not support copying. Use Ctrl / Cmd + C!': [
        'Извините, Ваш браузер не поддерживание копирование. Используйте сочетание клавиш [CTRL + C] для WIN или [CMD + C] для MAC!',
      ],
      'Error while fetching schema list': ['Ошибка при получении списка схем'],
      'Error while fetching database list': [
        'Ошибка при получении списка баз данных',
      ],
      'Database:': ['База данных:'],
      'Select a database': ['Выберите базу данных'],
      'Force refresh schema list': ['Принудительное обновление данных'],
      'Select a schema (%s)': ['Выберите схему (%s)'],
      'Schema:': ['Схема:'],
      datasource: ['источник данных'],
      schema: ['схема'],
      delete: ['удалить'],
      'Type "%s" to confirm': ['Введите “%s” для подтверждения'],
      DELETE: ['DELETE'],
      'Click to edit': ['Нажмите для редактирования'],
      "You don't have the rights to alter this title.": [
        'Недостаточно прав для изменения заголовка.',
      ],
      'Unexpected error': ['Неожиданная ошибка'],
      'Click to favorite/unfavorite': ['Отметить как избранное'],
      'An error occurred while fetching dashboards': [
        'Произошла ошибка при создании источника данных',
      ],
      'Error while fetching table list': ['Ошибка при получении списка таблиц'],
      'Select table or type table name': [''],
      'Type to search ...': ['Введите для поиска…'],
      'Select table ': ['Выберите таблицу '],
      'Force refresh table list': ['Принудительное обновление данных'],
      'See table schema': ['Выберите схему (%s)'],
      '%s%s': [''],
      'Share dashboard': ['Поделиться'],
      'This may be triggered by:': ['Триггеры:'],
      'Please reach out to the Chart Owner for assistance.': [
        'Пожалуйста, обратитесь к создателю графика за дополнительной информацией.',
      ],
      'Chart Owner: %s': ['Параметры графика: %s'],
      '%s Error': ['%s Ошибка'],
      'See more': ['Подробности'],
      'See less': ['Скрыть подробности'],
      'Copy message': ['Предупреждающее сообщение'],
      Close: ['Закрыть'],
      'This was triggered by:': ['Причина срабатывания:'],
      'Did you mean:': [''],
      '%(suggestion)s instead of "%(undefinedParameter)s?"': [''],
      'Parameter error': ['Параметры'],
      'We’re having trouble loading this visualization. Queries are set to timeout after %s second.':
        [
          'Возникла проблема при загрузке этой визуализации. Для запросов установлен тайм-аут %s секунд.',
        ],
      'We’re having trouble loading these results. Queries are set to timeout after %s second.':
        [
          'Возникла проблема при загрузке результатов. Для запросов установлен тайм-аут %s секунд.',
        ],
      'Timeout error': ['Тайм-аут'],
      'Cell content': ['Созданный контент'],
      'The import was successful': ['Неудачно'],
      OVERWRITE: ['OVERWRITE'],
      Overwrite: ['Перезаписать'],
      Import: ['Импорт'],
      'Import %s': ['Импорт %s'],
      'Last Updated %s': [''],
      '%s Selected': ['%s Выбрано'],
      'Deselect all': ['Выберите базу данных'],
      '%s-%s of %s': [''],
      About: [''],
      'SQL query': ['SQL-запрос'],
      'There is not enough space for this component. Try decreasing its width, or increasing the destination width.':
        [
          'Недостаточно пространства для этого компонента. Попробуйте уменьшить ширину или увеличить целевую ширину.',
        ],
      'Can not move top level tab into nested tabs': [
        'Невозможно перенести вкладку верхнего уровня во вложенную вкладку',
      ],
      'This chart has been moved to a different filter scope.': [
        'Этот график был перемещён в другой набор фильтров.',
      ],
      'There was an issue fetching the favorite status of this dashboard.': [
        'К сожалению, произошла ошибка при загрузке виджета.',
      ],
      'There was an issue favoriting this dashboard.': [
        'Произошла ошибка при добавлении этого дашборда в избранное.',
      ],
      'This dashboard is now ${nowPublished}': [
        'Этот дашборд теперь ${nowPublished}',
      ],
      'You do not have permissions to edit this dashboard.': [
        'У вас нет прав на редактирование этого дашборда: %(name)s.',
      ],
      'This dashboard was saved successfully.': ['Дашборд успешно сохранен.'],
      'Could not fetch all saved charts': [''],
      'Sorry there was an error fetching saved charts: ': [
        'Извините, произошла ошибка при загрузке графиков: ',
      ],
      Visualization: ['Визуализация'],
      'Data source': ['Источник данных'],
      Added: ['Добавлено'],
      Components: ['Компоненты'],
      "Any color palette selected here will override the colors applied to this dashboard's individual charts":
        [
          'Любая палитра, выбранная здесь, будет перезаписывать цвета, применённые к отдельным графикам этого дашборда',
        ],
      'Color scheme': ['Цветовая схема'],
      'Load a template': ['Загрузить шаблон'],
      'Load a CSS template': ['Загрузить шаблон стилей (CSS)'],
      'Live CSS editor': ['Редактор CSS'],
      'You have unsaved changes.': ['У вас есть несохраненные изменения.'],
      'This dashboard is currently force refreshing; the next force refresh will be in %s.':
        [
          'Для этого дашборда включено обновление; следующее обновление будет через %s.',
        ],
      'Your dashboard is too large. Please reduce the size before save it.': [
        'Дашборд слишком большой. Пожалуйста, уменьшите его размер перед сохранением.',
      ],
      'Discard changes': ['Отменить изменения'],
      'An error occurred while fetching available CSS templates': [
        'Произошла ошибка при получении доступных CSS-шаблонов',
      ],
      'Superset dashboard': ['Дашборд Superset'],
      'Check out this dashboard: ': ['Посмотреть дашборд: '],
      'Refresh dashboard': ['Обновить дашборд'],
      'Set auto-refresh interval': ['Интервал обновления'],
      'Set filter mapping': ['Установить действие фильтра'],
      'Edit dashboard properties': ['Редактировать свойства дашборда'],
      'Edit CSS': ['Редактировать CSS'],
      'Download as image': ['Сохранить как изображение'],
      Download: ['Скачать'],
      'Toggle fullscreen': ['Полноэкранный режим'],
      'There is no chart definition associated with this component, could it have been deleted?':
        [''],
      'Delete this container and save to remove this message.': [
        'Удалите этот контейнер и сохраните изменения, чтобы убрать это сообщение.',
      ],
      'An error has occurred': ['Произошла ошибка'],
      'You do not have permission to edit this dashboard': [
        'У вас нет доступа к этому источнику данных',
      ],
      'A valid color scheme is required': [
        'Требуется корректная цветовая схема',
      ],
      'The dashboard has been saved': ['Дашборд сохранен'],
      Apply: ['Применить'],
      'Dashboard properties': ['Свойства дашборда'],
      'Basic information': ['Основная информация'],
      'URL slug': ['Читаемый URL'],
      'A readable URL for your dashboard': ['Читаемый URL-адрес для дашборда'],
      Access: ['Доступ'],
      'Owners is a list of users who can alter the dashboard. Searchable by name or username.':
        [
          'Владельцы - это список пользователей, которые могут изменять дашборд.',
        ],
      Colors: ['Цвета'],
      Advanced: ['Дополнительно'],
      'JSON metadata': ['JSON метаданные'],
      'This dashboard is not published, it will not show up in the list of dashboards. Click here to publish this dashboard.':
        [
          'Этот дашборд не опубликован, он не будет отображён в списке дашбордов. Нажмите здесь, чтобы опубликовать этот дашборд.',
        ],
      'This dashboard is not published which means it will not show up in the list of dashboards. Favorite it to see it there or access it by using the URL directly.':
        [
          'Этот дашборд не опубликован, что означает, что он не будет отображён в списке дашбордов. Добавьте его в избранное, чтобы увидеть там или воспользуйтесь доступом по прямой ссылке.',
        ],
      'This dashboard is published. Click to make it a draft.': [
        'Дашборд опубликован. Нажмите, чтобы сделать черновиком.',
      ],
      Draft: ['Черновик'],
      "Don't refresh": ['Не обновлять'],
      '10 seconds': ['10 секунд'],
      '30 seconds': ['30 секунд'],
      '1 minute': ['1 минута'],
      '5 minutes': ['5 минут'],
      '30 minutes': ['30 минут'],
      '1 hour': ['1 час'],
      '6 hours': ['6 часов'],
      '12 hours': ['12 часов'],
      '24 hours': ['24 часа'],
      'Refresh interval': ['Интервал обновления'],
      'Refresh frequency': ['Частота'],
      'Are you sure you want to proceed?': [
        'Вы уверены, что хотите продолжить?',
      ],
      'Save for this session': [''],
      'You must pick a name for the new dashboard': [
        'Вы должны выбрать имя для нового дашборда',
      ],
      'Save dashboard': ['Сохранить дашборд'],
      'Overwrite Dashboard [%s]': ['Перезаписать дашборд [%s]'],
      'Save as:': ['Сохранить как:'],
      '[dashboard name]': ['[название]'],
      'also copy (duplicate) charts': [''],
      'Filter your charts': ['Фильтровать графики'],
      'Annotation layers are still loading.': ['Слои аннотаций загружаются.'],
      'One ore more annotation layers failed loading.': [
        'Один или несколько слоев аннотации не удалось загрузить.',
      ],
      'Cached %s': ['Кэш %s'],
      'Fetched %s': ['Получен %s'],
      'Minimize chart': ['Свернуть график'],
      'Maximize chart': ['Развернуть график'],
      'Force refresh': ['Принудительное обновление'],
      'Toggle chart description': ['Изменить описание графика'],
      'View chart in Explore': ['Посмотреть график в режиме исследования'],
      'Share chart': ['Поделиться графиком'],
      'Export CSV': ['Экпспорт CSV'],
      'Applied Filters (%d)': ['Применено фильтров (%d)'],
      'Incompatible Filters (%d)': ['Несовместимые фильтры (%d)'],
      'Unset Filters (%d)': ['Сбросить фильтры (%d)'],
      'Search...': ['Поиск…'],
      'No filter is selected.': ['Не выбраны фильтры.'],
      'Editing 1 filter:': [''],
      'Batch editing %d filters:': [''],
      'Configure filter scopes': ['Настроить области действия фильтра'],
      'There are no filters in this dashboard.': [
        'В этом дашборде нет фильтров.',
      ],
      'Expand all': ['Развернуть всё'],
      'Collapse all': ['Свернуть всё'],
      'This markdown component has an error.': [
        'Этот компонент содержит ошибки.',
      ],
      'This markdown component has an error. Please revert your recent changes.':
        [
          'Этот компонент содержит ошибки. Пожалуйста, отмените последние изменения.',
        ],
      'Delete dashboard tab?': ['Удалить вкладку дашборда?'],
      Divider: ['Разделитель'],
      Header: ['Строка заголовков'],
      Row: ['Строка'],
      Tabs: ['Вкладки'],
      Preview: ['Предпросмотр %s'],
      'Yes, cancel': ['Да, отменить'],
      'Keep editing': ['Продолжить редактирование'],
      'Select parent filters': ['Выберите дату окончания'],
      'Reset all': ['Сбросить текущее состояние'],
      'You have removed this filter.': ['Вы удалили фильтр.'],
      'Restore filter': ['Фильтр результатов'],
      'Name is required': ['Имя обязательно'],
      'Datasource is required': ['Источники данных'],
      Field: ['Поле'],
      'Parent filter': ['Временной фильтр'],
      'Apply changes instantly': ['Мгновенно применять изменения'],
      'Allow multiple selections': ['Разрешить множественный фильтр'],
      Required: ['Обязательно'],
      'Are you sure you want to cancel?': ['Вы уверены, что хотите отменить?'],
      'will not be saved.': ['не будет сохранён.'],
      'Filter configuration and scoping': ['Фильтруемые срезы'],
      'Add filter': ['Добавить фильтр'],
      '(Removed)': ['(Удалено)'],
      'Undo?': ['Отменить?'],
      'Apply to all panels': ['Применить ко всем панелям'],
      'Apply to specific panels': ['Применить к выбранным панелям'],
      'Only selected panels will be affected by this filter': [
        'Фильтр будет применён только к выбранным панелям',
      ],
      'All panels with this column will be affected by this filter': [
        'Фильтр будет применён ко всем панелям с этим столбцом',
      ],
      'All filters': ['Фильтры'],
      'All charts': ['Все графики'],
      'Warning! Changing the dataset may break the chart if the metadata does not exist.':
        [
          'Внимание! Изменение датасета может привести к тому, что график станет нерабочим, если будут отсутствовать метаданные.',
        ],
      'Changing the dataset may break the chart if the chart relies on columns or metadata that does not exist in the target dataset':
        [
          'Изменения датасета может привести к тому, что график станет нерабочим, если график использует несуществующие в целевом датасете столбцы или метаданные',
        ],
      dataset: ['датасет'],
      'Change dataset': ['Выберите источник данных'],
      'Warning!': ['Предупреждение!'],
      'Search / Filter': ['Поиск / Фильтр'],
      'Physical (table or view)': ['Физический (таблица или представление)'],
      'Virtual (SQL)': ['Виртуальный (SQL)'],
      'SQL expression': ['Выражение SQL'],
      'Data type': ['Таблица Данных'],
      'Datetime format': ['Формат Datetime'],
      'The pattern of timestamp format. For strings use ': [''],
      'Python datetime string pattern': [''],
      ' expression which needs to adhere to the ': [''],
      'ISO 8601': ['ISO 8601'],
      ' standard to ensure that the lexicographical ordering\n                      coincides with the chronological ordering. If the\n                      timestamp format does not adhere to the ISO 8601 standard\n                      you will need to define an expression and type for\n                      transforming the string into a date or timestamp. Note\n                      currently time zones are not supported. If time is stored\n                      in epoch format, put `epoch_s` or `epoch_ms`. If no pattern\n                      is specified we fall back to using the optional defaults on a per\n                      database/column name level via the extra parameter.':
        [''],
      'Is dimension': ['Измерение'],
      'Is filterable': ['Фильтрующийся'],
      'Modified columns: %s': ['Изменённые столбцы: %s'],
      'Removed columns: %s': ['Удалённые столбцы: %s'],
      'New columns added: %s': ['Добавленные столбцы: %s'],
      'Metadata has been synced': ['Метаданные синхронизированы'],
      'Column name [%s] is duplicated': ['Дубль имени столбца [%s]'],
      'Metric name [%s] is duplicated': ['Дубль имения показателя [%s]'],
      'Calculated column [%s] requires an expression': [
        'Для расчётного столбца [%s] требуется выражение',
      ],
      Basic: [''],
      'Default URL': ['URL базы данных'],
      'Default URL to redirect to when accessing from the dataset list page': [
        'URL по-умолчанию, на который будет выполнен редирект при доступе из страницы со списком датасетов',
      ],
      'Autocomplete filters': [''],
      'Whether to populate autocomplete filters options': [
        'Включить фильтр на определенный интервал/диапазон времени',
      ],
      'Autocomplete query predicate': ['Извлечь Значения Предиката'],
      'When using "Autocomplete filters", this can be used to improve performance of the query fetching the values. Use this option to apply a predicate (WHERE clause) to the query selecting the distinct values from the table. Typically the intent would be to limit the scan by applying a relative time filter on a partitioned or indexed time-related field.':
        [''],
      'Extra data to specify table metadata. Currently supports certification data of the format: `{ "certification": { "certified_by": "Data Platform Team", "details": "This table is the source of truth." } }`.':
        [''],
      'Owners of the dataset': ['Владельцы датасета'],
      'Cache timeout': ['Тайм-аут Кэша'],
      'The duration of time in seconds before the cache is invalidated': [
        'Количество секунд до истечения срока действия кэша',
      ],
      'Hours offset': ['Смещение часов'],
      Spatial: [''],
      virtual: [''],
      'Dataset name': ['Наименование датасета'],
      'When specifying SQL, the datasource acts as a view. Superset will use this statement as a subquery while grouping and filtering on the generated parent queries.':
        [
          'Когда указан SQL, источник данных работает как представление. Superset будет использовать это выражение в подзапросе, при необходимости группировки и фильтрации.',
        ],
      'The JSON metric or post aggregation definition.': [''],
      Physical: [''],
      'The pointer to a physical table (or view). Keep in mind that the chart is associated to this Superset logical table, and this logical table points the physical table referenced here.':
        [
          'Указатель на физическую таблицу (или представление). Следует помнить, что график связан с логической таблицей Superset, а эта логическая таблица указывает на физическую таблицу, указанную здесь.',
        ],
      'Click the lock to make changes.': [
        'Нажмите на замок, чтобы выполнить изменения.',
      ],
      'Click the lock to prevent further changes.': [
        'Нажмите на замок, чтобы предотвратить будущие изменения.',
      ],
      'D3 format': ['Формат D3'],
      'Warning message': ['Предупреждающее сообщение'],
      'Warning message to display in the metric selector': [
        'Предупреждение для отображения на селекторе показателей',
      ],
      'Certified by': ['Изменено'],
      'Person or group that has certified this metric': [
        'Лицо или группа, которые сертифицировали данный показатель',
      ],
      'Certification details': ['Детали сертификации'],
      'Details of the certification': ['Детали сертификации'],
      'Be careful.': ['Будьте осторожны.'],
      'Changing these settings will affect all charts using this dataset, including charts owned by other people.':
        [
          'Изменение этих настроек будет влиять на все графики, использующие этот датасет, включая графики других пользователей.',
        ],
      Source: ['Источник'],
      'Sync columns from source': ['Синхронизировать столбцы из источника'],
      'Calculated columns': ['Расчётные столбцы'],
      'The dataset has been saved': ['Источник данных, похоже, был удален'],
      'The dataset configuration exposed here\n                affects all the charts using this dataset.\n                Be mindful that changing settings\n                here may affect other charts\n                in undesirable ways.':
        [
          'Здесь представлена конфигурация датасета\n                влияет на все графики, использующие этот датасет.\n                Помните, что изменение настроек\n                может иметь неожиданный эффект\n                на другие графики.',
        ],
      'Are you sure you want to save and apply changes?': [
        'Вы уверены, что хотите сохранить и применить изменения?',
      ],
      'Confirm save': ['Подтвердить сохранение'],
      'Edit Dataset ': ['Редактировать датасет '],
      'Use legacy datasource editor': ['Использовать старый редактор'],
      'Time range': ['Фильтр по времени'],
      'Time column': ['Столбец с датой и временем'],
      'Time grain': ['Единица времени'],
      Origin: ['Источник'],
      'Time granularity': ['Гранулярность времени'],
      'A reference to the [Time] configuration, taking granularity into account':
        [''],
      'Group by': ['Группировать по'],
      'One or many controls to group by': [
        'Выберите один или несколько срезов в поле группировки данных',
      ],
      'One or many metrics to display': [
        'Выберите один или несколько показателей для отображения',
      ],
      Dataset: ['Датасет'],
      'Visualization type': ['Тип визуализации'],
      'The type of visualization to display': [
        'Выберите необходимый тип визуализации',
      ],
      'Fixed color': ['Фиксированный цвет'],
      'Use this to define a static color for all circles': [
        'Используйте это цвет для заливки всех кругов одним цветом',
      ],
      'Right axis metric': ['Показатель для правой оси'],
      'Choose a metric for right axis': ['Выберите показатель для правой оси'],
      'Linear color scheme': ['Цветовая схема'],
      'Color metric': ['Цвет показателя'],
      'A metric to use for color': [
        'Показатель, используемый для расчета цвета',
      ],
      'One or many controls to pivot as columns': [
        'Выберите один или несколько срезов для отображения показателей в столбцах сводной таблицы',
      ],
      'Defines the origin where time buckets start, accepts natural dates as in `now`, `sunday` or `1970-01-01`':
        [''],
      'The time granularity for the visualization. Note that you can type and use simple natural language as in `10 seconds`, `1 day` or `56 weeks`':
        [
          'Интервал времени, в границах которого строится график. Обратите внимание, что для определения диапазона времени, вы можете использовать естественный язык. Например, можно указать словосочетания - «10 seconds», «1 day» или «56 weeks»',
        ],
      'The time column for the visualization. Note that you can define arbitrary expression that return a DATETIME column in the table. Also note that the filter below is applied against this column or expression':
        [
          'Столбец данных с датой или временем. Вы можете определить произвольное выражение, которое будет возвращать столбец даты/времени в таблице. Фильтр ниже будет применён к этому столбцу или выражению',
        ],
      'The time granularity for the visualization. This applies a date transformation to alter your time column and defines a new time granularity. The options here are defined on a per database engine basis in the Superset source code.':
        [
          'Гранулярность для визуализации. С помощью этого применяются преобразования к столбцу с датой/временем и определяет новую гранулярность (минута, день, год, и т.п.). Доступные опции определены в исходном коде Superset для каждого типа движка БД.',
        ],
      'The time range for the visualization. All relative times, e.g. "Last month", "Last 7 days", "now", etc. are evaluated on the server using the server\'s local time (sans timezone). All tooltips and placeholder times are expressed in UTC (sans timezone). The timestamps are then evaluated by the database using the engine\'s local timezone. Note one can explicitly set the timezone per the ISO 8601 format if specifying either the start and/or end time.':
        [''],
      'Row limit': ['Лимит строк'],
      'Series limit': ['Лимит кол-ва рядов'],
      'Limits the number of time series that get displayed. A sub query (or an extra phase where sub queries are not supported) is applied to limit the number of time series that get fetched and displayed. This feature is useful when grouping by high cardinality dimension(s).':
        ['Ограничивает количество отображаемых временных рядов.'],
      'Sort by': ['Сортировка'],
      'Metric used to define the top series': [
        'Показатель, используемый для определения какие временные ряды будут отображаться при ограничении количества выводимых рядов',
      ],
      Series: ['Ряд данных'],
      'Defines the grouping of entities. Each series is shown as a specific color on the chart and has a legend toggle':
        [
          'Группировка в ряды данных. Каждый ряд отображается в виде определенного цвета на графике и имеет легенду',
        ],
      Entity: ['Элемент'],
      'This defines the element to be plotted on the chart': [
        'Элемент, который будет отражен на графике',
      ],
      'X Axis': ['Ось X'],
      'Metric assigned to the [X] axis': ['Показатель, отраженный на оси X'],
      'Y Axis': ['Ось Y'],
      'Metric assigned to the [Y] axis': ['Показатель, отраженный на оси Y'],
      'Bubble size': ['Размер маркера'],
      'Y Axis Format': ['Формат Оси Y'],
      'When `Calculation type` is set to "Percentage change", the Y Axis Format is forced to `.1%`':
        [
          'Когда `Тип расчёта` установлен в “Изменение процента”, формат оси Y устанавливается в `.1%`',
        ],
      'The color scheme for rendering chart': [
        'Цветовая схема, применяемая для раскрашивания графика',
      ],
      'Color map': ['Цвет'],
      description: ['описание'],
      bolt: [''],
      'Changing this control takes effect instantly': [
        'Изменение этого элемента применяется сразу',
      ],
      Customize: ['Настроить'],
      'rows retrieved': ['строк получено'],
      'Sorry, An error occurred': ['Извините, произошла ошибка'],
      'No data': ['Данных нет'],
      'View samples': ['Посмотреть примеры'],
      'Search Metrics & Columns': ['Столбцы Временных Рядов'],
      'Showing %s of %s': [''],
      'New chart': ['Переместить график'],
      'Edit properties': ['Редактирование свойств'],
      'View query': ['Скопировать запрос'],
      'Run in SQL Lab': ['Открыть в SQL редакторе'],
      Height: ['Высота'],
      Width: ['Ширина'],
      'Export to .json': ['Экспортировать в JSON формат'],
      'Export to .csv format': ['Экспортировать в CSV формат'],
      '%s - untitled': ['%s - без названия'],
      'Edit chart properties': ['Редактирование свойств'],
      'Control labeled ': [''],
      'Open Datasource tab': ['Открыть вкладку источника данных'],
      'You do not have permission to edit this chart': [
        'У вас нет прав на редактирование этого графика',
      ],
      'The description can be displayed as widget headers in the dashboard view. Supports markdown.':
        [
          'Описание может быть отображено как заголовок виджета в ракурсе дашбордов. Поддерживает markdown-разметку.',
        ],
      Configuration: ['Доля'],
      "Duration (in seconds) of the caching timeout for this chart. Note this defaults to the dataset's timeout if undefined.":
        [
          'Продолжительность (в секундах) таймаута кэширования для этого графика.',
        ],
      'A list of users who can alter the chart. Searchable by name or username.':
        ['Владельцы - это пользователи, которые могут изменять график.'],
      rows: ['строк'],
      'Limit reached': ['Достигнут предел'],
      '**Select** a dashboard OR **create** a new one': [
        '**Выберите** дашборд ИЛИ **создайте** новый',
      ],
      'Please enter a chart name': ['Введите имя графика'],
      'Save chart': ['Сохранить график'],
      'Save & go to dashboard': ['Сохранить и перейти к дашборду'],
      'Save as new chart': ['Сохранить как новый график'],
      'Save (Overwrite)': ['Сохранить (Перезаписать)'],
      'Save as ...': ['Сохранить как …'],
      'Chart name': ['Имя графика'],
      'Add to dashboard': ['Добавить в дашборд'],
      'Display configuration': ['Как отображать'],
      'Configure your how you overlay is displayed here.': [
        'Настройте наложение здесь.',
      ],
      Style: ['Стиль'],
      Opacity: ['Прозрачность'],
      Color: ['Цвет'],
      'Line width': ['Толщина линии'],
      'Layer configuration': ['Конфигурация слоя'],
      'Configure the basics of your Annotation Layer.': [
        'Настройте слой аннотации.',
      ],
      Mandatory: [''],
      'Hide layer': ['Скрыть слой'],
      'Choose the annotation layer type': ['Выбрать тип слоя аннотации'],
      'Annotation layer type': ['Тип слоя аннотации'],
      Remove: [''],
      'Edit annotation layer': ['Редактировать слой аннотации'],
      'Add annotation layer': ['Добавить слой аннотации'],
      '`Min` value should be numeric or empty': [
        'Значение «Минимум» должно быть числовым или пустым',
      ],
      '`Max` value should be numeric or empty': [
        'Значение « Максимум» должно быть числовым или пустым',
      ],
      Min: ['Минимум'],
      Max: ['Максимум'],
      'Edit dataset': ['Редактировать датасет'],
      'View in SQL Lab': ['Открыть в лаборатории SQL'],
      'More dataset related options': ['Больше опций к датасету'],
      'Superset supports smart date parsing. Strings like `3 weeks ago`, `last sunday`, or `2 weeks from now` can be used.':
        [
          'Superset поддерживает умную интерпретацию дат. Могут быть использованы такие строки как `3 weeks ago`, `last sunday`, или `2 weeks from now`.',
        ],
      Default: ['Широта по умолчанию'],
      '(optional) default value for the filter, when using the multiple option, you can use a semicolon-delimited list of options.':
        [
          '(опционально) значение по-умолчанию для фильтраю. Когда используются множественные значения, вы можете вставить список значений, разделённых символами точка с запятой',
        ],
      'Sort metric': ['Показатель для сортировки'],
      'Metric to sort the results by': [
        'Показатель, по которому сортировать результаты',
      ],
      'Check for sorting ascending': [
        'Сортировка по убыванию или по возрастанию',
      ],
      'Multiple selections allowed, otherwise filter is limited to a single value':
        [
          'Разрешён множественный выбор, иначе можно выбрать только одно значение фильтра',
        ],
      'Search all filter options': ['Поиск / Фильтр'],
      'By default, each filter loads at most 1000 choices at the initial page load. Check this box if you have more than 1000 filter values and want to enable dynamically searching that loads filter values as users type (may add stress to your database).':
        [
          'По-умолчанию, каждый фильтр загружает не больше 1000 элементов выбора при начальной загрузке страницы. Установите этот флаг, если у вас больше 1000 значений фильтра и вы хотите включить динамический поиск, который загружает значения по мере их ввода пользователем (может увеличить нагрузку на вашу базу данных).',
        ],
      'Filter configuration': ['Фильтруемые срезы'],
      'Error while fetching data': ['Возникла ошибка при получение данных'],
      'No results found': ['Записи не найдены'],
      '%s option(s)': ['%s параметр(ы)'],
      'Invalid lat/long configuration.': [
        'Неверная конфигурация широты и долготы.',
      ],
      'Reverse lat/long ': ['Поменять местами широту и долготу '],
      'Longitude & Latitude columns': ['Долгота и Широта'],
      'Delimited long & lat single column': [
        'Широта и Долгота в одном столбце с разделителем',
      ],
      'Multiple formats accepted, look the geopy.points Python library for more details':
        [
          'Для уточнения форматов и получения более подробной информации, посмотрите Python-библиотеку geopy.points',
        ],
      Geohash: ['Geohash'],
      textarea: ['текстовая область'],
      'in modal': [''],
      'Time series columns': ['Столбцы Временных Рядов'],
      'This visualization type is not supported.': [
        'Этот тип визуализации не поддерживается.',
      ],
      'Click to change visualization type': ['Выберите тип визуализации'],
      'Select a visualization type': ['Выберите тип визуализации'],
      'Failed to verify select options: %s': [
        'Ошибка при проверке опций выбора: %s',
      ],
      'RANGE TYPE': ['ТИП ФИЛЬТРА ПО ВРЕМЕНИ'],
      'Actual time range': ['Текущие настройки фильтрации времени'],
      CANCEL: ['ОТМЕНИТЬ'],
      APPLY: ['ПРИМЕНИТЬ'],
      'Edit time range': ['Изменить параметры шаблона'],
      START: ['НАЧАЛО'],
      END: ['КОНЕЦ'],
      Before: ['До'],
      After: ['После'],
      'Seconds %s': ['Секунд %s'],
      'Minutes %s': ['Минут %s'],
      'Hours %s': ['Часов %s'],
      'Days %s': ['Дней %s'],
      'Weeks %s': ['Недель %s'],
      'Months %s': ['Месяцев %s'],
      'Quarters %s': ['Кварталов %s'],
      'Years %s': ['Лет %s'],
      'START (INCLUSIVE)': ['НАЧАЛО (ВКЛЮЧИТЕЛЬНО)'],
      'END (EXCLUSIVE)': ['КОНЕЦ (НЕВКЛЮЧИТЕЛЬНО)'],
      'Specific Date': ['Точная дата'],
      'Relative Date': ['Относительная дата'],
      Midnight: ['Полночь'],
      Now: ['Сейчас'],
      'Configure Time Range: Previous...': ['Предыдущие…'],
      'Configure Time Range: Last...': ['Последние…'],
      'Configure Advanced Time Range': [
        'Настройка дополнительного фильтра по времени',
      ],
      'Configure custom time range': ['Изменить параметры шаблона'],
      'Relative quantity': ['Относительное количество'],
      'Start date included in time range': ['Первый день включительно'],
      'End date excluded from time range': ['Последний день невключительно'],
      'Anchor to': ['Привязать к'],
      NOW: ['Сейчас'],
      'Date/Time': ['Формат даты'],
      Simple: ['Простые'],
      'Custom SQL': ['Через SQL'],
      'No such column found. To filter on a metric, try the Custom SQL tab.': [
        'Такой столбец не найден. Чтобы фильтровать по показателю, попробуйте вкладку Через SQL.',
      ],
      '%s column(s) and metric(s)': ['%s столбец(ы) и показатель(и)'],
      '%s column(s)': ['Столбец(ы) %s'],
      'To filter on a metric, use Custom SQL tab.': [
        'Фильтр на показателе, используйте вкладку Через SQL.',
      ],
      '%s operator(s)': ['%s параметр(ы)'],
      'Type a value here': ['Введите значение здесь'],
      'Filter value (case sensitive)': [
        'Фильтровать значения (зависит от регистра)',
      ],
      'choose WHERE or HAVING...': ['выберите WHERE или HAVING…'],
      'Filters by columns': ['Фильтруемые срезы'],
      'Filters by metrics': ['Список показателей'],
      "\n                This filter was inherited from the dashboard's context.\n                It won't be saved when saving the chart.\n              ":
        [
          '\n                Фильтр был наследован из контекста дашборда.\n                Это не будет сохранено при сохранении графика.\n              ',
        ],
      '%s aggregates(s)': ['%s агрегат(ы)'],
      '%s saved metric(s)': ['%s сохранённый показатель(и)'],
      Saved: ['Сохранить'],
      'Saved metric': ['Сохранённый показатель'],
      column: ['столбец'],
      aggregate: ['агрегат'],
      'My metric': ['Показатель'],
      'Add metric': ['Добавить показатель'],
      Code: ['Редактор'],
      'Markup type': ['Тип разметки'],
      'Pick your favorite markup language': [
        'Выберите свой любимый язык разметки',
      ],
      'Put your code here': [
        'Введите произвольный текст в формате html или markdown',
      ],
      Query: ['Запрос'],
      URL: ['Ссылка (URL)'],
      "Templated link, it's possible to include {{ metric }} or other values coming from the controls.":
        [
          'Шаблонная ссылка, можно включить {{ metric }} или другие значения, поступающие из элементов управления.',
        ],
      Time: ['Время'],
      'Time related form attributes': ['Параметры, связанные с временем'],
      'Chart type': ['Тип графика'],
      'Chart ID': ['График'],
      'The id of the active chart': ['Идентификатор активного среза'],
      'Cache Timeout (seconds)': ['Тайм-аут кэша (секунды)'],
      'The number of seconds before expiring the cache': [
        'Количество секунд до истечения срока действия кэша',
      ],
      'URL parameters': ['Параметры'],
      'Extra parameters for use in jinja templated queries': [
        'Дополнительные параметры для запросов, использующих шаблоны jinja',
      ],
      'Time range endpoints': ['Период времени'],
      'Time range endpoints (SIP-15)': [''],
      'Annotations and layers': ['Аннотация'],
      'Whether to sort descending or ascending': [
        'Сортировка по убыванию или по возрастанию',
      ],
      Contribution: ['Доля'],
      'Compute the contribution to the total': [
        'Вычислить вклад в общую сумму (долю). Установите формат показателя в проценты',
      ],
      'Advanced analytics': ['Расширенный анализ'],
      'This section contains options that allow for advanced analytical post processing of query results':
        [
          'В этом разделе содержатся параметры, которые позволяют производить аналитическую пост-обработку результатов запроса',
        ],
      'Rolling window': ['Rolling'],
      'Rolling function': ['Rolling'],
      'Defines a rolling window function to apply, works along with the [Periods] text box':
        [
          'Одна из функций (Rolling) библиотеки Pandas, которая определяет способ агрегации данных',
        ],
      Periods: ['Период'],
      'Defines the size of the rolling window function, relative to the time granularity selected':
        [
          'Одна из функций (Rolling) библиотеки Pandas, которая определяет период, к которому применяется функция агрегации',
        ],
      'Min periods': ['HIde Periods'],
      'The minimum number of rolling periods required to show a value. For instance if you do a cumulative sum on 7 days you may want your "Min Period" to be 7, so that all data points shown are the total of 7 periods. This will hide the "ramp up" taking place over the first 7 periods':
        [
          'Скрыть необходимое количество периодов. Например, если вы делаете накопительную сумму показателя за 7 дней, но хотите скрыть нарастающий итог за первые 6 дней, то указав в данном столбце «6», вы скроете нарастание, происходящее в течение первых 6 периодов',
        ],
      'Time comparison': ['Столбец с датой'],
      'Time shift': ['Временной сдвиг'],
      'Overlay one or more timeseries from a relative time period. Expects relative time deltas in natural language (example:  24 hours, 7 days, 52 weeks, 365 days). Free text is supported.':
        [''],
      'Calculation type': ['Тип расчёта'],
      'How to display time shifts: as individual lines; as the absolute difference between the main time series and each time shift; as the percentage change; or as the ratio between series and time shifts.':
        [
          'Как отображать смещения во времени: как отдельные линии; как абсолютную разницу между основным временным рядом и каждым смещением; как процентное изменение; или как соотношение между рядами и смещениями.',
        ],
      'Python functions': ['Python функции'],
      Rule: ['Правило'],
      'Pandas resample rule': [
        'Одна из функций (Resample) библиотеки Pandas, которая определяет период, к которому применяется функция агрегации',
      ],
      Method: ['Метод'],
      'Pandas resample method': [
        'Одна из функций (Resample) библиотеки Pandas, которая определяет метод обработки данных',
      ],
      Favorites: ['Избранное'],
      'Created content': ['Созданный контент'],
      'Recent activity': ['Последние действия'],
      'Security & Access': ['Безопасность и Доступ'],
      'No charts': ['Переместить график'],
      'No dashboards': ['Нет дашбордов'],
      'No favorite charts yet, go click on stars!': [
        'В избранном нет графиков. Нажмите звёздочку для добавления!',
      ],
      'No favorite dashboards yet, go click on stars!': [
        'В избранном нет дашбордов. Нажмите звёздочку для добавления!',
      ],
      'Profile picture provided by Gravatar': [
        'Изображение профиля, сгенерированное сервисом Gravatar',
      ],
      joined: ['присоединился'],
      'id:': ['идентификатор:'],
      'There was an error fetching your recent activity:': [
        'К сожалению, произошла ошибка при загрузке виджета:',
      ],
      'Deleted: %s': ['Удалено: %s'],
      'There was an issue deleting: %s': ['Произошла ошибка при удалении: %s'],
      'There was an issue deleting %s: %s': [
        'Произошла ошибка при удалении %s: %s',
      ],
      report: ['рассылка'],
      alert: ['предупреждение'],
      reports: ['рассылки'],
      alerts: ['предупреждения'],
      'There was an issue deleting the selected %s: %s': [
        'Произошла ошибка при удалении выбранных %s: %s',
      ],
      'Last run': ['Последнее изменение'],
      'Notification method': ['Добавить слой аннотации'],
      'Execution log': ['Журнал Действий'],
      Actions: ['Действия'],
      'Bulk select': ['Множественный выбор'],
      'No %s yet': ['Пока нет %s'],
      'Created by': ['Создан'],
      'An error occurred while fetching created by values: %s': [
        'Произошла ошибка при построении графика: %s',
      ],
      'Create Chart or dataset': ['Создать график или датасет'],
      Status: ['Статус'],
      '${AlertState.success}': ['${AlertState.success}'],
      '${AlertState.working}': ['${AlertState.working}'],
      '${AlertState.error}': ['${AlertState.error}'],
      '${AlertState.noop}': ['${AlertState.noop}'],
      '${AlertState.grace}': ['${AlertState.grace}'],
      'Alerts & reports': ['Оповещения и рассылки'],
      Reports: ['Рассылки'],
      'This action will permanently delete %s.': [
        'Это действие навсегда удалит %s.',
      ],
      'Delete %s?': ['Удалить %s?'],
      'Please confirm': ['Пожалуйста, подтвердите'],
      'Are you sure you want to delete the selected %s?': [
        'Вы уверены, что хотите удалить выбранные %s?',
      ],
      '< (Smaller than)': ['< (меньше чем)'],
      '> (Larger than)': ['> (больше чем)'],
      '<= (Smaller or equal)': ['<= (меньше или равно)'],
      '>= (Larger or equal)': ['>= (больше или равно)'],
      '== (Is equal)': ['== (равно)'],
      '!= (Is not equal)': ['!= (не равно)'],
      'Not null': ['Не пусто'],
      '30 days': ['30 дней'],
      '60 days': ['60 дней'],
      '90 days': ['90 дней'],
      'Add notification method': ['Добавить слой аннотации'],
      'Add delivery method': ['Добавить метод доставки'],
      'Recipients are separated by "," or ";"': [
        'Получатели, разделенные “,” или “;”',
      ],
      Add: ['Добавить'],
      "Edit ${isReport ? 'Report' : 'Alert'}": [
        'Править ${isReport ? ‘рассылку’ : ‘оповещение’}',
      ],
      "Add ${isReport ? 'Report' : 'Alert'}": [
        'Добавить ${isReport ? ‘рассылку’ : ‘оповещение’}',
      ],
      'Report name': ['Имя Шаблона'],
      'Alert name': ['Имя оповещения'],
      'Alert condition': ['Условие оповещения'],
      'Trigger Alert If...': ['Сделать оповещение, если…'],
      Value: ['Значение'],
      'Report schedule': ['Область просмотра'],
      'Alert condition schedule': ['Расписание условия оповещения'],
      'Schedule settings': ['Настройки расписания'],
      'Log retention': ['Время жизни журнала'],
      'Working timeout': [''],
      'Time in seconds': ['Время в секундах'],
      'Grace period': ['Период'],
      'Message content': ['Содержимое сообщения'],
      log: ['журнал'],
      State: ['Состояние'],
      'Scheduled at': ['Запланировано на'],
      'Start at': ['Время начала'],
      Duration: ['Продолжительность'],
      'Error message': ['Сообщение об ошибке'],
      '${alertResource?.type}': ['${alertResource?.type}'],
      'CRON expression': ['Выражение SQL'],
      'Report sent': ['Рассылка отправлена'],
      'Alert triggered, notification sent': [
        'Сработало оповещение, уведомление отправлено',
      ],
      'Report sending': ['Выполняется рассылка'],
      'Alert running': ['Выполняется оповещение'],
      'Report failed': ['Рассылка не удалась'],
      'Alert failed': ['Оповещение не удалось'],
      'Nothing triggered': ['Ничего не сработало'],
      'Alert Triggered, In Grace Period': ['Сработало оповещение'],
      '${RecipientIconName.email}': ['${RecipientIconName.email}'],
      '${RecipientIconName.slack}': ['${RecipientIconName.slack}'],
      annotation: ['аннотация'],
      'There was an issue deleting the selected annotations: %s': [
        'Произошла ошибка при удалении выбранных аннотаций: %s',
      ],
      'Edit annotation': ['Редактировать аннотацию'],
      'Delete annotation': ['Удалить аннотацию'],
      Annotation: ['Аннотация'],
      'No annotation yet': ['Пока нет аннотаций'],
      'Annotation Layer ${annotationLayerName}': [
        'Слой аннотаций ${annotationLayerName}',
      ],
      'Are you sure you want to delete ${annotationCurrentlyDeleting?.short_descr}?':
        [
          'Вы уверены, что хотите удалить ${annotationCurrentlyDeleting?.short_descr}?',
        ],
      'Delete Annotation?': ['Удалить аннотацию?'],
      'Are you sure you want to delete the selected annotations?': [
        'Вы уверены, что хотите удалить выбранные аннотации?',
      ],
      'Add annotation': ['Добавить слой аннотации'],
      'Annotation name': ['Слои аннотаций'],
      date: ['дата'],
      'Additional information': ['Дополнительные метаданные'],
      'Description (this can be seen in the list)': [
        'Описание (будет видно в списке)',
      ],
      annotation_layer: ['слой_аннотации'],
      'Edit annotation layer properties': [
        'Редактировать свойства слоя аннотаций',
      ],
      'Annotation layer name': ['Имя слоя аннотаций'],
      'Annotation layers': ['Слои аннотаций'],
      'There was an issue deleting the selected layers: %s': [
        'Произошла ошибка при удалении выбранных слоёв: %s',
      ],
      'Last modified': ['Изменено'],
      'Created on': ['Дата создания'],
      'Edit template': ['Загрузить шаблон'],
      'Delete template': ['Загрузить шаблон'],
      'Annotation layer': ['Слои аннотаций'],
      'An error occurred while fetching dataset datasource values: %s': [
        'Произошла ошибка при получении значений датасета: %s',
      ],
      'No annotation layers yet': ['Слои аннотаций'],
      'This action will permanently delete the layer.': [
        'Это действие навсегда удалит слой.',
      ],
      'Delete Layer?': ['Удалить все?'],
      'Are you sure you want to delete the selected layers?': [
        'Вы уверены, что хотите удалить выбранные слои?',
      ],
      'Are you sure you want to delete': ['Вы уверены, что хотите удалить'],
      'Last modified %s': ['Изменено %s'],
      'The passwords for the databases below are needed in order to import them together with the charts. Please note that the "Secure Extra" and "Certificate" sections of the database configuration are not present in export files, and should be added manually after the import if they are needed.':
        [
          'Для баз данных нужны пароли, чтобы импортировать их вместе с графиками. Пожалуйста, обратите внимание, что разделы “Безопасность” и “Сертификат” в настройках конфигурации базы данных отсутствуют в экспортируемых файлов и должны быть добавлены вручную после импорта, если необходимо.',
        ],
      'You are importing one or more charts that already exist. Overwriting might cause you to lose some of your work. Are you sure you want to overwrite?':
        [
          'Вы импортируете один или несколько графиков, которые уже существуют. Перезапись может привести к потере части вашей работы. Вы уверены, что хотите перезаписать?',
        ],
      'There was an issue deleting the selected charts: %s': [
        'Произошла ошибка при удалении выбранных графиков: %s',
      ],
      'Modified by': ['Изменено'],
      Owner: ['Владелец'],
      'An error occurred while fetching chart owners values: %s': [
        'Произошла ошибка при получении владельца графика: %s',
      ],
      'An error occurred while fetching chart created by values: %s': [
        'Произошла ошибка при получении создателя графика: %s',
      ],
      'Viz type': ['Тип'],
      'An error occurred while fetching chart dataset values: %s': [
        'Произошла ошибка при получении графиков датасета: %s',
      ],
      Favorite: ['Избранное'],
      Yes: ['Да'],
      No: ['Нет'],
      'Are you sure you want to delete the selected charts?': [
        'Вы уверены, что хотите удалить выбранные графики?',
      ],
      css_template: ['шаблон_css'],
      'Edit CSS template properties': ['Редактирование свойств'],
      'Add CSS template': ['Шаблоны CSS'],
      'CSS template name': ['Имя Шаблона'],
      css: ['Css'],
      'CSS templates': ['Шаблоны CSS'],
      'There was an issue deleting the selected templates: %s': [
        'Произошла ошибка при удалении выбранных шаблонов: %s',
      ],
      'Last modified by %s': ['Автор изменений %s'],
      'CSS template': ['Шаблоны CSS'],
      'This action will permanently delete the template.': [
        'Это действие навсегда удалит шаблон.',
      ],
      'Delete Template?': ['Удалить шаблон?'],
      'Are you sure you want to delete the selected templates?': [
        'Вы уверены, что хотите удалить выбранные шаблоны?',
      ],
      'The passwords for the databases below are needed in order to import them together with the dashboards. Please note that the "Secure Extra" and "Certificate" sections of the database configuration are not present in export files, and should be added manually after the import if they are needed.':
        [
          'Для баз данных нужны пароли, чтобы импортировать их вместе с дашбордами. Пожалуйста, обратите внимание, что разделы “Безопасность” и “Сертификат” в настройках конфигурации базы данных отсутствуют в экспортируемых файлов и должны быть добавлены вручную после импорта, если необходимо.',
        ],
      'You are importing one or more dashboards that already exist. Overwriting might cause you to lose some of your work. Are you sure you want to overwrite?':
        [
          'Вы импортируете один или несколько дашбордов, которые уже существуют. Перезапись может привести к потере части вашей работы. Вы уверены, что хотите перезаписать?',
        ],
      'An error occurred while fetching dashboards: %s': [
        'Произошла ошибка при получении дашбордов: %s',
      ],
      'There was an issue deleting the selected dashboards: ': [
        'Произошла ошибка при удалении выбранных дашбордов: ',
      ],
      'An error occurred while fetching dashboard owner values: %s': [
        'Произошла ошибка при получении владельца дашборда: %s',
      ],
      'An error occurred while fetching dashboard created by values: %s': [
        'Произошла ошибка при получении создателя дашборда: %s',
      ],
      Unpublished: ['Неопубликованные'],
      'Are you sure you want to delete the selected dashboards?': [
        'Вы уверены, что хотите удалить выбранные дашборды?',
      ],
      'Sorry, your browser does not support copying.': [
        'Извините, Ваш браузер не поддерживание копирование. Используйте сочетание клавиш [CTRL + C] для WIN или [CMD + C] для MAC.',
      ],
      'SQL Copied!': ['SQL скопирован!'],
      'The passwords for the databases below are needed in order to import them. Please note that the "Secure Extra" and "Certificate" sections of the database configuration are not present in export files, and should be added manually after the import if they are needed.':
        [''],
      'You are importing one or more databases that already exist. Overwriting might cause you to lose some of your work. Are you sure you want to overwrite?':
        [''],
      database: ['база данных'],
      'An error occurred while fetching database related data: %s': [
        'Произошла ошибка при получении данных о базе данных: %s',
      ],
      'Asynchronous query execution': [''],
      AQE: ['AQE'],
      'Allow data manipulation language': [
        'Разрешить язык манипулирования данными',
      ],
      DML: ['DML'],
      'CSV upload': ['Загрузить CSV'],
      'Delete database': ['Выберите базу данных'],
      'The database %s is linked to %s charts that appear on %s dashboards. Are you sure you want to continue? Deleting the database will break those objects.':
        [''],
      'Delete Database?': ['Удалить базу данных?'],
      'Please enter a SQLAlchemy URI to test': [
        'Введите SQLAlchemy URI для теста',
      ],
      'Connection looks good!': ['Соединение в порядке!'],
      'ERROR: Connection failed. ': ['ОШИБКА: Соединение не удалось.'],
      'Sorry there was an error fetching database information: %s': [
        'К сожалению, произошла ошибка при получении информации о базе данных: %s',
      ],
      'Edit database': ['Редактировать Базу Данных'],
      'Add database': ['Добавить Базу Данных'],
      Connection: ['Тестовое соединение'],
      'Database name': ['Название таблицы'],
      'Name your dataset': ['Назовите свой датасет'],
      'dialect+driver://username:password@host:port/database': [
        'диалект+драйвер://пользователь:пароль@хост:порт/схема',
      ],
      'Test connection': ['Тестовое соединение'],
      'Refer to the ': ['Обратитесь сюда '],
      'SQLAlchemy docs': ['SQLAlchemy URI'],
      ' for more information on how to structure your URI.': [
        ' за подробной информацией по тому, как структурировать ваш URI',
      ],
      Performance: ['Производительность'],
      'Chart cache timeout': ['Тайм-аут Кэша'],
      'Operate the database in asynchronous mode, meaning that the queries are executed on remote workers as opposed to on the web server itself. This assumes that you have a Celery worker setup as well as a results backend. Refer to the installation docs for more information.':
        [
          'Работа с базой данных в асинхронном режиме означает, что запросы исполняются на удалённых воркерах, а не на веб-сервере Superset. Это подразумевает, что у вас установка с воркерами Celery. Обратитесь к документации по настройке за дополнительной информацией.',
        ],
      'SQL Lab settings': ['Лаборатория'],
      'Allow users to run non-SELECT statements (UPDATE, DELETE, CREATE, ...)':
        [
          'Позволяет пользователям запускать инструкции (UPDATE, DELETE, CREATE, …) без SELECT в редакторе SQL',
        ],
      'Allow multi schema metadata fetch': [''],
      'CTAS schema': ['Схема по умолчанию'],
      'When allowing CREATE TABLE AS option in SQL Lab, this option forces the table to be created in this schema.':
        [
          'При разрешении опции CREATE TABLE AS в лаборатории SQL, эта опция создаст таблицу в выбранной схеме.',
        ],
      'Secure extra': ['Безопасность'],
      'JSON string containing additional connection configuration.': [
        'Строка JSON, содержащая дополнительные параметры соединения.',
      ],
      'This is used to provide connection information for systems like Hive, Presto, and BigQuery, which do not conform to the username:password syntax normally used by SQLAlchemy.':
        [
          'Это используется для указания информации о соединении с такими системами как Hive, Presto и BigQuery, которые не укладываются в шаблон пользователь:пароль, который обычно используется в SQLAlchemy.',
        ],
      'Optional CA_BUNDLE contents to validate HTTPS requests. Only available on certain database engines.':
        [''],
      'Impersonate Logged In User (Presto, Trino, Drill & Hive)': [
        'Ассоциировать пользователя',
      ],
      'If Presto, Trino or Drill all the queries in SQL Lab are going to be executed as the currently logged on user who must have permission to run them. If Hive and hive.server2.enable.doAs is enabled, will run the queries as service account, but impersonate the currently logged on user via hive.server2.proxy.user property.':
        [
          'Если вы используете Presto, все запросы в SQL-Редакторе будут выполняться от авторизованного пользователя, который должен иметь разрешение на их выполнение. <br/> Если включен Hive, то запросы будут выполняться через техническую учетную запись, но ассоциировать зарегистрированного пользователя можно через свойство hive.server2.proxy.user.',
        ],
      'Allow data upload': ['Разрешить загрузку данных'],
      'If selected, please set the schemas allowed for data upload in Extra.': [
        'Если установлено, выберите схемы, в которые разрешена загрузка на вкладке “Дополнительно”.',
      ],
      'JSON string containing extra configuration elements.': [
        'Строка JSON, содержащая дополнительные элементы конфигурации.',
      ],
      '1. The engine_params object gets unpacked into the sqlalchemy.create_engine call, while the metadata_params gets unpacked into the sqlalchemy.MetaData call.':
        [''],
      '2. The metadata_cache_timeout is a cache timeout setting in seconds for metadata fetch of this database. Specify it as "metadata_cache_timeout": {"schema_cache_timeout": 600, "table_cache_timeout": 600}. If unset, cache will not be enabled for the functionality. A timeout of 0 indicates that the cache never expires.':
        [''],
      '3. The schemas_allowed_for_file_upload is a comma separated list of schemas that CSVs are allowed to upload to. Specify it as "schemas_allowed_for_file_upload": ["public", "csv_upload"]. If database flavor does not support schema or any schema is allowed to be accessed, just leave the list empty.':
        [''],
      "4. The version field is a string specifying this db's version. This should be used with Presto DBs so that the syntax is correct.":
        [''],
      '5. The allows_virtual_table_explore field is a boolean specifying whether or not the Explore button in SQL Lab results is shown.':
        [''],
      'Error while saving dataset: %s': ['Ошибка при сохранении датасета: %s'],
      'Add dataset': ['Добавить Базу Данных'],
      'The passwords for the databases below are needed in order to import them together with the datasets. Please note that the "Secure Extra" and "Certificate" sections of the database configuration are not present in export files, and should be added manually after the import if they are needed.':
        [
          'Пароли к базам данных требуются, чтобы импортировать их вместе с датасетами. Пожалуйста, обратите внимание, что разделы “Безопасность” и “Сертификат” конфигурации базы данных отсутствуют в экспортируемых файлах и должны быть добавлены после импорта вручную.',
        ],
      'You are importing one or more datasets that already exist. Overwriting might cause you to lose some of your work. Are you sure you want to overwrite?':
        [
          'Вы импортируете один или несколько датасетов, которые уже существуют. Перезапись может привести к потере части вашей работы. Вы уверены, что хотите продолжить?',
        ],
      'An error occurred while fetching dataset related data': [
        'Произошла ошибка при получении метаданных из таблицы',
      ],
      'An error occurred while fetching dataset related data: %s': [
        'Произошла ошибка при получении данных о датасете: %s',
      ],
      'Physical dataset': ['Физический датасет'],
      'Virtual dataset': ['Виртуальный датасет'],
      'An error occurred while fetching dataset owner values: %s': [
        'Произошла ошибка при получении создателя датасета: %s',
      ],
      'An error occurred while fetching datasets: %s': [
        'Произошла ошибка при получении датасетов: %s',
      ],
      'An error occurred while fetching schema values: %s': [
        'Произошла ошибка при построении графика: %s',
      ],
      'There was an issue deleting the selected datasets: %s': [
        'Произошла ошибка при удалении выбранных датасетов: %s',
      ],
      'The dataset %s is linked to %s charts that appear on %s dashboards. Are you sure you want to continue? Deleting the dataset will break those objects.':
        [
          'Датасет %s привязан к графикам %s, которые используются в дашбордах %s. Вы уверены, что хотите продолжить? Удаление датасета приведёт к неработоспособности этих объектов.',
        ],
      'Delete Dataset?': ['Удалить все?'],
      'Are you sure you want to delete the selected datasets?': [
        'Вы уверены, что хотите удалить выбранные датасеты?',
      ],
      '0 Selected': ['Выполнить выбранный запрос'],
      '%s Selected (Virtual)': ['%s Выбрано (Виртуальные)'],
      '%s Selected (Physical)': ['%s Выбрано (Физические)'],
      '%s Selected (%s Physical, %s Virtual)': [
        '%s Выбрано (%s Физические, %s Виртуальные)',
      ],
      'There was an issue previewing the selected query. %s': [
        'Возникла ошибка при предпросмотре выбранных запросов: %s',
      ],
      Success: ['Успешно'],
      Failed: ['Ошибка'],
      Running: ['Выполняется'],
      Offline: [''],
      Scheduled: ['Запланировано'],
      'Duration: %s': ['Продолжительность: %s'],
      'Tab name': ['Имя Таблицы'],
      TABLES: ['ТАБЛИЦЫ'],
      Rows: ['Игнорировать'],
      'Open query in SQL Lab': ['Открыть в SQL редакторе'],
      'An error occurred while fetching database values: %s': [
        'Произошла ошибка при получении значений базы данных: %s',
      ],
      'Search by query text': ['Поиск по тексту запроса'],
      'Query preview': ['Предпросмотр данных'],
      Next: ['След'],
      'Open in SQL Lab': ['Открыть в SQL редакторе'],
      'User query': ['Скопировать запрос'],
      'Executed query': ['Выполнить выбранный запрос'],
      'Saved queries': ['Сохраненные запросы'],
      'There was an issue previewing the selected query %s': [
        'Произошла ошибка при предпросмотре выбранного запроса %s',
      ],
      'Link Copied!': ['Ссылка скопирована!'],
      'There was an issue deleting the selected queries: %s': [
        'Произошла ошибка при удалении выбранных запросов: %s',
      ],
      'Edit query': ['Редактировать запрос'],
      'Copy query URL': ['Скопировать URL запроса'],
      'Delete query': ['Удалить'],
      'This action will permanently delete the saved query.': [
        'Это действие навсегда удалит сохранённый запрос.',
      ],
      'Delete Query?': ['Удалить запрос?'],
      'Are you sure you want to delete the selected queries?': [
        'Вы уверены, что хотите удалить выбранные запросы?',
      ],
      'Query name': ['Страна'],
      Edited: ['Редактировано'],
      Created: ['Создано'],
      Viewed: ['Просмотрено'],
      Examples: ['Примеры'],
      Mine: ['Мои'],
      'Recently viewed charts, dashboards, and saved queries will appear here':
        ['Недавно просмотренные графики, дашборды и сохранённые запросы'],
      'Recently created charts, dashboards, and saved queries will appear here':
        ['Недавно созданные графики, дашборды и сохранённые запросы'],
      'Recent example charts, dashboards, and saved queries will appear here': [
        'Примеры графиков, дашбордов и сохранённых запросов',
      ],
      'Recently edited charts, dashboards, and saved queries will appear here':
        ['Недавно изменённые графики, дашборды и сохранённые запросы'],
      "${tableName\n                        .split('')\n                        .slice(0, tableName.length - 1)\n                        .join('')}\n                    ":
        [''],
      "You don't have any favorites yet!": ['У вас пока нет избранного!'],
      'SQL Lab queries': ['Лаборатория'],
      '${tableName}': ['Имя Таблицы'],
      query: ['запрос'],
      Share: ['Поделиться'],
      'Last run %s': ['Последнее выполнение %s'],
      Recents: ['Последние'],
      'Select start and end date': ['Выберите дату начала'],
      'Type or Select [%s]': ['Выбрать [%s]'],
      'Filter box': ['Фильтр'],
      'Filters configuration': ['Изменение настроек таблицы'],
      'Filter configuration for the filter box': ['Настройки фильтра'],
      'Date filter': ['Временной фильтр'],
      'Whether to include a time filter': [
        'Включить фильтр на определенный интервал/диапазон времени',
      ],
      'Instant filtering': ['Мгновенная Фильтрация'],
      'Check to apply filters instantly as they change instead of displaying [Apply] button':
        [''],
      'Show SQL granularity dropdown': [''],
      'Check to include SQL granularity dropdown': [''],
      'Show SQL time column': ['Показать колонку Druid'],
      'Check to include time column dropdown': [
        'Включить фильтр на определенный интервал/диапазон времени',
      ],
      'Show Druid granularity dropdown': [''],
      'Check to include Druid granularity dropdown': [''],
      'Show Druid time origin': ['Показать Druid Метрики'],
      'Check to include time origin dropdown': [
        'Включить фильтр на определенный интервал/диапазон времени',
      ],
      'Limit selector values': [''],
      'These filters apply to the values available in the dropdowns': [''],
      'Time-series Table': ['Таблица временных рядов'],
      'Filters out of scope (%d)': ['Неприменяемые фильтры (%d)'],
      'Apply filters': ['Применить'],
      'Clear all': ['Очистить'],
      'last day': ['Последние сутки'],
      'last week': ['Последние 7 дней'],
      'last month': ['Последние 30 дней'],
      'last quarter': ['Последние 90 дней'],
      'last year': ['Последние 365 дней'],
      'Last day': ['Последние сутки'],
      'Last week': ['Последние 7 дней'],
      'Last month': ['Последние 30 дней'],
      'Last quarter': ['Последние 90 дней'],
      'Last year': ['Последние 365 дней'],
      'previous calendar week': ['Предыдущая календарная неделя'],
      'previous calendar month': ['Предыдущий календарный месяц'],
      'previous calendar year': ['Предыдущий календарный год'],
      'No filter': ['Без фильтра'],
      'All filters (%(filterCount)d)': ['Фильтры (%(filterCount)d)'],
      'Filter sets (%(filterSetCount)d)': ['Наборы (%(filterSetCount)d)'],
      'New filter set': ['Новый набор фильтров'],
      'Create new filter set': ['Сохранить набор фильтров'],
      'Filters (%d)': ['Фильтры (%d)'],
      None: ['Пусто'],
      'Enter fullscreen': ['Полноэкранный режим'],
      Last: ['Последнее'],
      Previous: ['Предыдущий'],
      Custom: ['Выбрать точную дату'],
      'Add/Edit Filters': ['Создать/Изменить фильтры'],
      'Add filters and dividers': ['Добавить фильтр/разделитель'],
      Settings: ['Настройки'],
      Scoping: ['Влияние'],
      Filter: ['Фильтр'],
      'Filter Type': ['Тип фильтра'],
      'Filter Configuration': ['Конфигурация фильтра'],
      'Filter Settings': ['Параметры фильтра'],
      'Filter name': ['Название фильтра'],
      'Filter has default value': ['Значение по умолчанию'],
      'Filter value is required': ['Обязателен для заполнения'],
      'Filter is hierarchical': ['Фильтр иерархический'],
      'User must select a value before applying the filter': [
        'Пользователь обязан указать значение для применения фильтра',
      ],
      'User must select a value for this filter': [
        'Пользователю нужно будет выбрать значение для этого фильтра',
      ],
      'Pre-filter available values': ['Предв. фильтрация доступных значений'],
      'Pre-filter': ['Предв. фильтр'],
      'Pre-filter is required': ['Укажите предв. фильтрацию'],
      'Sort filter values': ['Сортировать значения фильтра '],
      'Sort type': ['Направление сортировки'],
      'Sort ascending': ['Сортировать по возрастанию'],
      'Sort descending': ['Сортировать по убыванию'],
      'Sort Metric': ['Показатель для сортировки'],
      'Select first filter value by default': [
        'Первое значение фильтра по умолчанию',
      ],
      'Can select multiple values': ['Разрешить выбор нескольких значений'],
      'Dynamically search all filter values': [
        'Динамический поиск доступных значений',
      ],
      'Inverse selection': ['Инвертировать'],
      'When using this option, default value can’t be set': [
        'Значение по умолчанию не может быть установлено, если включена данная опция',
      ],
      'Exclude selected values': ['Исключить указанные значения'],
      'Default Value': ['Значение по умолчанию'],
      'Values are dependent on other filters': [
        'Значения зависят от других фильтров',
      ],
      'Numerical range': ['Цифровой диапазон'],
      'Add and edit filters': ['Создать/изменить фильтры'],
      'Fill all required fields to enable "Default Value"': [
        'Укажите все необходимые поля',
      ],
      'Single Value': ['Одиночное значение'],
      'Single value type': ['Тип одиночного значения'],
      Minimum: ['Минимум'],
      Exact: ['Точное'],
      Maximum: ['Максимум'],
      'Values dependent on': ['Значения зависят от'],
      One_dashboard: ['дашборд'],
      Two_to_4_dashboards: ['дашборда'],
      Five_and_more_dashboards: ['дашбордов'],
      Added_to: ['Добавлен в'],
      Used_in: ['Используется в'],
      'With space': ['С пробелом'],
      'With space rounded': ['С пробелом округл.'],
      'Original value': ['Оригинальное значение'],
      Second: ['Секунда'],
      Minute: ['Минута'],
      '5 minute': ['5 минут'],
      '10 minute': ['10 минут'],
      '15 minute': ['15 минут'],
      'Half hour': ['Пол часа'],
      Hour: ['Час'],
      Day: ['День'],
      Week: ['Неделя'],
      Month: ['Месяц'],
      Quarter: ['Квартал'],
      Year: ['Год'],
      'Week starting sunday': ['Неделя с воскресенья'],
      'Week starting monday': ['Неделя с понедельника'],
      'Week ending saturday': ['Неделя до субботы'],
      'Week_ending sunday': ['Неделя до воскресенья'],
      'Week starting Sunday': ['Неделя с воскресенья'],
      'Week starting Monday': ['Неделя с понедельника'],
      'Week ending Saturday': ['Неделя до субботы'],
      'Query Mode': [''],
      Aggregate: [''],
      'Raw Records': ['Необработанные записи'],
      'Emit Filter Events': [''],
      'Show Cell Bars': ['Показывать столбцы ячеек'],
      'page_size.show': ['Показать'],
      'page_size.all': ['все'],
      'page_size.entries': ['записей'],
      'table.previous_page': ['Предыдущая'],
      'table.next_page': ['Следующая'],
      'search.num_records': ['%s запись', '%s записей...'],
      '%s option': ['%s значений'],
      '%s options': ['%s значений'],
      Cached: ['Кэш'],
      Fetched: ['Получен'],
      'Edit chart': ['Редактировать график'],
      'View as table': ['Открыть как таблицу'],
      'Export to .CSV': ['Скачать .CSV файл'],
      'Export to .XLSX': ['Скачать .XLSX файл'],
    },
  },
};

export { ru };