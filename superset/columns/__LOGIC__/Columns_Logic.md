# Документация по колонкам (Columns) в DODO

## Содержание

1. [Введение](#введение)
2. [Архитектура](#архитектура)
3. [Стандартная функциональность](#стандартная-функциональность)
4. [DODO-специфичная функциональность](#dodo-специфичная-функциональность)
5. [Техническая реализация](#техническая-реализация)
6. [API](#api)

## Введение

Модуль `columns` предоставляет функциональность для работы с колонками таблиц в Superset. Колонки являются основными элементами данных, которые используются для создания визуализаций, фильтров и других компонентов аналитики.

В DODO этот модуль расширен для поддержки локализации и дополнительных метаданных, что позволяет создавать более информативные и удобные для пользователя визуализации.

## Архитектура

Модуль `columns` в основном представлен моделью `TableColumn` в `superset/connectors/sqla/models.py`, которая определяет структуру и поведение колонок таблиц. Сама папка `superset/columns` содержит минимальное количество файлов, так как большая часть функциональности реализована в других модулях.

Основные компоненты, связанные с колонками:

1. **Модель данных** (`connectors/sqla/models.py`):
   - `TableColumn` - модель для хранения информации о колонках таблиц

2. **API** (`datasets/columns/api.py`):
   - `DatasetColumnRestApi` - REST API для работы с колонками датасетов

3. **Команды** (`commands/dataset/columns/`):
   - Команды для управления колонками датасетов

## Стандартная функциональность

Стандартная функциональность, связанная с колонками, включает:

1. **Управление колонками**:
   - Создание, чтение, обновление и удаление колонок
   - Настройка типов данных и форматирования

2. **Метаданные колонок**:
   - Описание колонок
   - Настройка отображения колонок в интерфейсе
   - Настройка фильтрации и группировки

3. **Типы данных**:
   - Поддержка различных типов данных (числа, строки, даты и т.д.)
   - Расширенные типы данных (advanced_data_type)

## DODO-специфичная функциональность

В DODO модель `TableColumn` была расширена для поддержки локализации и дополнительных метаданных. Основные DODO-специфичные изменения:

1. **Локализация названий колонок**:
   - Добавлены поля `verbose_name_ru` и `verbose_name_en` для хранения локализованных названий колонок
   - Эти поля используются для отображения названий колонок на русском и английском языках в интерфейсе

2. **Локализация описаний колонок**:
   - Добавлены поля `description_ru` и `description_en` для хранения локализованных описаний колонок
   - Эти поля используются для отображения описаний колонок на русском и английском языках в интерфейсе

3. **Расширенные типы для колонок на фронтенде**:
   - В файле `superset-frontend/packages/superset-ui-core/src/query/types/Column.ts` добавлены интерфейсы `AdhocColumnDodoExtended` и `ColumnDodoExtended` для поддержки локализации

4. **Утилиты для работы с колонками**:
   - В директории `superset-frontend/plugins/plugin-chart-table/src/DodoExtensions/utils/` добавлены утилиты для работы с закрепленными колонками (column pinning)

## Техническая реализация

### Модель данных

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

### Типы на фронтенде

Расширенные типы для колонок на фронтенде:

```typescript
interface AdhocColumnDodoExtended {
  labelEN?: string; // DODO added 44120742
  labelRU?: string; // DODO added 44120742
}
export interface AdhocColumn extends AdhocColumnDodoExtended {
  hasCustomLabel?: boolean;
  label?: string;
  optionName?: string;
  sqlExpression: string;
  expressionType: 'SQL';
  columnType?: 'BASE_AXIS' | 'SERIES';
  timeGrain?: string;
  datasourceWarning?: boolean;
}

interface ColumnDodoExtended {
  description_ru?: string | null; // DODO added 44728892
  description_en?: string | null; // DODO added 44728892
  verbose_name_ru?: string | null; // DODO added 44120742
  verbose_name_en?: string | null; // DODO added 44120742
}
export interface Column extends ColumnDodoExtended {
  id?: number;
  type?: string;
  type_generic?: GenericDataType;
  column_name: string;
  groupby?: boolean;
  is_dttm?: boolean;
  filterable?: boolean;
  verbose_name?: string | null;
  description?: string | null;
  expression?: string | null;
  database_expression?: string | null;
  python_date_format?: string | null;

  // used for advanced_data_type
  optionName?: string;
  filterBy?: string;
  value?: string;
  advanced_data_type?: string;
}
```

### Утилиты для работы с закрепленными колонками

Утилиты для работы с закрепленными колонками:

```typescript
// DODO was here
// DODO created 45525377
import { DataColumnMeta } from '../../types';

export const getDefaultPinColumns = (columns: DataColumnMeta[]) => {
  const result: number[] = [];
  columns.forEach((item, index) => {
    if (item.config?.pinColumn) {
      result.push(index);
    }
  });

  return result;
};

export const getPinnedWidth = (
  colWidths: number[],
  pinnedColumns: number[],
  columnIndex: number,
): number => {
  if (columnIndex === 0 || pinnedColumns.length === 1) return 0;

  let left = 0;

  for (let i = 0; i < pinnedColumns.length; i += 1) {
    const index = pinnedColumns[i];
    if (index === columnIndex) break;
    const columnWidth = colWidths[index];
    left += columnWidth;
  }

  return left;
};
```

## API

### API для работы с колонками датасетов

API для работы с колонками датасетов реализовано в классе `DatasetColumnRestApi` в файле `superset/datasets/columns/api.py`:

```
DELETE /api/v1/dataset/{dataset_id}/column/{column_id}
```

Этот эндпоинт позволяет удалить колонку из датасета.

### Использование локализованных полей

Локализованные поля `verbose_name_ru`, `verbose_name_en`, `description_ru` и `description_en` используются в интерфейсе Superset для отображения названий и описаний колонок на соответствующем языке в зависимости от выбранного пользователем языка интерфейса.
