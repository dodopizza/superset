# Документация по коннекторам (Connectors) в DODO

## Содержание

1. [Введение](#введение)
2. [Архитектура](#архитектура)
3. [Стандартная функциональность](#стандартная-функциональность)
4. [DODO-специфичная функциональность](#dodo-специфичная-функциональность)
5. [Техническая реализация](#техническая-реализация)
6. [Примеры использования](#примеры-использования)

## Введение

Модуль `connectors` предоставляет интерфейсы и реализации для подключения к различным источникам данных в Superset. Коннекторы позволяют Superset взаимодействовать с различными базами данных и другими источниками данных, абстрагируя детали реализации и предоставляя единый интерфейс для работы с данными.

В DODO этот модуль расширен для поддержки локализации и дополнительных метаданных, что позволяет создавать более информативные и удобные для пользователя визуализации.

## Архитектура

Модуль `connectors` организован в несколько подмодулей, каждый из которых отвечает за определенный тип источника данных:

1. **SQL Alchemy** (`sqla`):
   - Основной коннектор для работы с реляционными базами данных через SQLAlchemy
   - Включает модели для таблиц, колонок и метрик
   - Предоставляет функциональность для выполнения SQL-запросов

2. **Druid** (`druid`):
   - Коннектор для работы с Apache Druid
   - Включает модели для Druid-кластеров, датасетов и метрик
   - Предоставляет функциональность для выполнения запросов к Druid

3. **Базовые классы** (`base.py`):
   - Определяет базовые интерфейсы и абстрактные классы для всех коннекторов
   - Обеспечивает единый интерфейс для работы с различными источниками данных

## Стандартная функциональность

Стандартная функциональность модуля `connectors` включает:

1. **Подключение к источникам данных**:
   - Создание и управление подключениями к базам данных
   - Настройка параметров подключения
   - Тестирование подключений

2. **Работа с метаданными**:
   - Получение информации о таблицах, колонках и их типах
   - Управление метаданными источников данных
   - Синхронизация метаданных с источниками данных

3. **Выполнение запросов**:
   - Формирование и выполнение запросов к источникам данных
   - Обработка результатов запросов
   - Кэширование результатов

4. **Безопасность**:
   - Управление правами доступа к источникам данных
   - Фильтрация данных на основе прав доступа
   - Поддержка Row Level Security (RLS)

## DODO-специфичная функциональность

В DODO модуль `connectors` был расширен для поддержки локализации и дополнительных метаданных. Основные DODO-специфичные изменения:

1. **Локализация названий колонок**:
   - В модели `TableColumn` добавлены поля `verbose_name_ru` и `verbose_name_en` для хранения локализованных названий колонок
   - Эти поля используются для отображения названий колонок на русском и английском языках в интерфейсе

   ```python
   # dodo added 44120742
   verbose_name_ru = Column(String(1024), nullable=True)
   verbose_name_en = Column(String(1024), nullable=True, default=None)
   ```

2. **Локализация описаний колонок**:
   - В модели `TableColumn` добавлены поля `description_ru` и `description_en` для хранения локализованных описаний колонок
   - Эти поля используются для отображения описаний колонок на русском и английском языках в интерфейсе

   ```python
   # dodo added 44728914
   description_en = Column(utils.MediumText(), nullable=True)
   description_ru = Column(utils.MediumText(), nullable=True)
   ```

3. **Расширенные типы для колонок на фронтенде**:
   - В файле `superset-frontend/packages/superset-ui-core/src/query/types/Column.ts` добавлены интерфейсы `AdhocColumnDodoExtended` и `ColumnDodoExtended` для поддержки локализации

   ```typescript
   interface AdhocColumnDodoExtended {
     labelEN?: string; // DODO added 44120742
     labelRU?: string; // DODO added 44120742
   }

   interface ColumnDodoExtended {
     description_ru?: string | null; // DODO added 44728892
     description_en?: string | null; // DODO added 44728892
     verbose_name_ru?: string | null; // DODO added 44120742
     verbose_name_en?: string | null; // DODO added 44120742
   }
   ```

4. **Утилиты для работы с описаниями источников данных**:
   - В директории `superset-frontend/packages/superset-ui-chart-controls/src/DodoExtensions/utils/` добавлена функция `extractDatasourceDescriptions` для извлечения и отображения описаний источников данных

   ```typescript
   // DODO was here
   // DODO created 44728892
   export * from './extractDatasourceDescriptions';
   ```

## Техническая реализация

### Модель TableColumn

Модель `TableColumn` с DODO-специфичными полями:

```python
class TableColumn(AuditMixinNullable, ImportExportMixin, CertificationMixin, Model):
    """ORM object for table columns, each table can have multiple columns"""

    __tablename__ = "table_columns"
    __table_args__ = (UniqueConstraint("table_id", "column_name"),)

    id = Column(Integer, primary_key=True)
    column_name = Column(String(255), nullable=False)
    verbose_name = Column(String(1024))
    is_active = Column(Boolean, default=True)
    type = Column(Text)
    advanced_data_type = Column(String(255))
    groupby = Column(Boolean, default=True)
    filterable = Column(Boolean, default=True)
    description = Column(utils.MediumText())
    table_id = Column(Integer, ForeignKey("tables.id", ondelete="CASCADE"))
    is_dttm = Column(Boolean, default=False)
    expression = Column(utils.MediumText())
    python_date_format = Column(String(255))
    extra = Column(Text)
    verbose_name_ru = Column(String(1024), nullable=True)  # dodo added 44120742
    verbose_name_en = Column(
        String(1024), nullable=True, default=None
    )  # dodo added 44120742

    # dodo added 44728914
    description_en = Column(utils.MediumText(), nullable=True)
    description_ru = Column(utils.MediumText(), nullable=True)
```

### Модель SqlaTable

Модель `SqlaTable` представляет таблицу в базе данных и содержит связи с колонками и метриками:

```python
class SqlaTable(
    Model,
    BaseDatasource,
    ExploreMixin,
):  # pylint: disable=too-many-public-methods
    """An ORM object for SqlAlchemy table references"""

    type = "table"
    query_language = "sql"
    is_rls_supported = True
    columns: Mapped[list[TableColumn]] = relationship(
        TableColumn,
        back_populates="table",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )
    metrics: Mapped[list[SqlMetric]] = relationship(
        SqlMetric,
        back_populates="table",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )
```

### Утилиты для работы с описаниями источников данных

Функция `extractDatasourceDescriptions` используется для извлечения и отображения описаний источников данных:

```typescript
// DODO was here
// DODO created 44728892
import { ChartDataResponseResult, ChartProps } from '@superset-ui/core';

export const extractDatasourceDescriptions = (
  props: ChartProps,
  queriesData: ChartDataResponseResult[],
) => {
  const { datasource } = props;
  const { verboseMap } = datasource;
  const { colnames } = queriesData[0];

  return colnames.reduce((acc, colname) => {
    const column = datasource.columns.find(col => col.column_name === colname);
    if (column) {
      acc[colname] = {
        description: column.description,
        description_ru: column.description_ru,
        description_en: column.description_en,
        verbose_name: verboseMap[colname] || colname,
        verbose_name_ru: column.verbose_name_ru,
        verbose_name_en: column.verbose_name_en,
      };
    }
    return acc;
  }, {});
};
```

## Примеры использования

### Использование локализованных полей в запросах

```python
from superset.connectors.sqla.models import SqlaTable, TableColumn

# Получение датасета
dataset = SqlaTable.query.get(1)

# Получение колонок с локализованными названиями
columns = TableColumn.query.filter_by(table_id=dataset.id).all()

# Вывод локализованных названий
for column in columns:
    print(f"Column: {column.column_name}")
    print(f"English name: {column.verbose_name_en or column.verbose_name}")
    print(f"Russian name: {column.verbose_name_ru or column.verbose_name}")
    print(f"English description: {column.description_en or column.description}")
    print(f"Russian description: {column.description_ru or column.description}")
```

### Использование утилиты extractDatasourceDescriptions на фронтенде

```typescript
import { extractDatasourceDescriptions } from '@superset-ui/chart-controls';

const transformProps = (chartProps) => {
  const { queriesData } = chartProps;

  // Извлечение описаний источников данных
  const datasourceDescriptions = extractDatasourceDescriptions(chartProps, queriesData);

  // Использование описаний для отображения тултипов
  const tooltips = queriesData[0].colnames.map(colname => {
    const description = datasourceDescriptions[colname];
    return {
      name: colname,
      description: description?.description,
      description_ru: description?.description_ru,
      description_en: description?.description_en,
    };
  });

  return {
    ...chartProps,
    tooltips,
  };
};
```
