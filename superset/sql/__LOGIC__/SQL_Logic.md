# Документация по модулю SQL в DODO

## Содержание

1. [Введение](#введение)
2. [Архитектура](#архитектура)
3. [Основные компоненты](#основные-компоненты)
   - [Парсинг SQL](#парсинг-sql)
   - [Обработка запросов](#обработка-запросов)
   - [Извлечение таблиц](#извлечение-таблиц)
4. [DODO-специфичные модификации](#dodo-специфичные-модификации)
   - [Поддержка Kusto KQL](#поддержка-kusto-kql)
   - [Интеграция с другими модулями](#интеграция-с-другими-модулями)
5. [Техническая реализация](#техническая-реализация)
6. [Примеры использования](#примеры-использования)

## Введение

Модуль `sql` в Superset отвечает за парсинг и обработку SQL-запросов. Он предоставляет инструменты для анализа SQL-запросов, извлечения информации о таблицах, форматирования запросов и поддержки различных диалектов SQL.

В DODO этот модуль был расширен для поддержки специфичных для DODO источников данных, в частности, Kusto KQL (Kusto Query Language), который используется для работы с Azure Data Explorer.

## Архитектура

Модуль `sql` организован следующим образом:

1. **Основные файлы**:
   - `__init__.py` - инициализация модуля
   - `parse.py` - классы и функции для парсинга SQL-запросов

2. **Связанные модули**:
   - `sql_lab.py` - функциональность SQL Lab
   - `sql_parse.py` - дополнительные функции для парсинга SQL
   - `sql_validators` - валидаторы SQL-запросов

3. **Интеграция с другими модулями**:
   - `db_engine_specs` - спецификации движков баз данных
   - `models/sql_lab.py` - модели для SQL Lab
   - `connectors/sqla` - коннекторы для SQLAlchemy

## Основные компоненты

### Парсинг SQL

Основной функционал парсинга SQL реализован в файле `parse.py`. Он включает в себя:

1. **SQLStatement** - класс для представления одного SQL-запроса
2. **SQLScript** - класс для представления SQL-скрипта, состоящего из нескольких запросов
3. **BaseSQLStatement** - базовый класс для всех типов SQL-запросов
4. **KustoKQLStatement** - специальный класс для Kusto KQL

```python
class SQLStatement(BaseSQLStatement[exp.Expression]):
    """
    A SQL statement, parsed by sqlglot.
    """

    @classmethod
    def _parse(cls, script: str, engine: str) -> list[exp.Expression]:
        """
        Parse a SQL script into a list of statements.
        """
        dialect = SQLGLOT_DIALECTS.get(engine)
        try:
            return list(parse(script, read=dialect))
        except Exception as ex:
            raise SupersetParseError(f"Error parsing SQL: {ex}") from ex

    @classmethod
    def _parse_statement(
        cls,
        statement: str,
        engine: str,
    ) -> exp.Expression:
        """
        Parse a single SQL statement.
        """
        statements = cls.split_script(statement, engine)
        if len(statements) != 1:
            raise SupersetParseError("SQLStatement should have exactly one statement")

        return statements[0]._parsed  # pylint: disable=protected-access

    @classmethod
    def _extract_tables_from_statement(
        cls,
        parsed: exp.Expression,
        engine: str,
    ) -> set[Table]:
        """
        Find all referenced tables.
        """
        dialect = SQLGLOT_DIALECTS.get(engine)
        return extract_tables_from_statement(parsed, dialect)
```

### Обработка запросов

Модуль `sql` предоставляет функциональность для обработки запросов:

1. **Разделение скрипта на отдельные запросы**:
   - `split_script` - разделяет SQL-скрипт на отдельные запросы
   - `split_kql` - разделяет Kusto KQL-скрипт на отдельные запросы

2. **Форматирование запросов**:
   - `format` - форматирует SQL-запрос
   - `strip_comments` - удаляет комментарии из SQL-запроса

3. **Проверка типов запросов**:
   - `is_select` - проверяет, является ли запрос SELECT-запросом
   - `is_explain` - проверяет, является ли запрос EXPLAIN-запросом
   - `is_readonly` - проверяет, является ли запрос только для чтения

### Извлечение таблиц

Модуль `sql` предоставляет функциональность для извлечения информации о таблицах из SQL-запросов:

1. **Извлечение таблиц**:
   - `extract_tables` - извлекает таблицы из SQL-запроса
   - `extract_tables_from_statement` - извлекает таблицы из разобранного SQL-запроса

2. **Представление таблиц**:
   - `Table` - класс для представления таблицы
   - `tables` - свойство для получения списка таблиц из запроса

```python
class Table:
    """
    A fully qualified SQL table.
    """

    def __init__(
        self,
        table: str,
        schema: str | None = None,
        catalog: str | None = None,
        alias: str | None = None,
    ):
        self.table = table
        self.schema = schema
        self.catalog = catalog
        self.alias = alias

    def __eq__(self, other: object) -> bool:
        if not isinstance(other, Table):
            return NotImplemented
        return (
            self.table == other.table
            and self.schema == other.schema
            and self.catalog == other.catalog
        )

    def __repr__(self) -> str:
        return str(self)

    def __str__(self) -> str:
        """
        Return the fully qualified SQL table name.
        """
        return ".".join(
            filter(
                None,
                [
                    f'"{self.catalog}"' if self.catalog else None,
                    f'"{self.schema}"' if self.schema else None,
                    f'"{self.table}"',
                ],
            )
        )

    def __hash__(self) -> int:
        return hash((self.table, self.schema, self.catalog))
```

## DODO-специфичные модификации

### Поддержка Kusto KQL

Одной из основных DODO-специфичных модификаций в модуле `sql` является поддержка Kusto KQL (Kusto Query Language). Для этого был добавлен специальный класс `KustoKQLStatement`, который обрабатывает запросы на языке KQL.

```python
class KustoKQLStatement(BaseSQLStatement[str]):
    """
    Special class for Kusto KQL.

    Kusto KQL is a SQL-like language, but it's not supported by sqlglot. Queries look
    like this:

        StormEvents
        | summarize PropertyDamage = sum(DamageProperty) by State
        | join kind=innerunique PopulationData on State
        | project State, PropertyDamagePerCapita = PropertyDamage / Population
        | sort by PropertyDamagePerCapita
    """

    @classmethod
    def _parse(cls, script: str, engine: str) -> list[str]:
        """
        Parse a KQL script into a list of statements.
        """
        return split_kql(script)

    @classmethod
    def _parse_statement(
        cls,
        statement: str,
        engine: str,
    ) -> str:
        """
        Parse a single KQL statement.
        """
        statements = cls.split_script(statement, engine)
        if len(statements) != 1:
            raise SupersetParseError("KustoKQLStatement should have exactly one statement")

        return statements[0]._parsed  # pylint: disable=protected-access

    @classmethod
    def _extract_tables_from_statement(
        cls,
        parsed: str,
        engine: str,
    ) -> set[Table]:
        """
        Find all referenced tables.

        For KQL we only extract the first table, which is the one before the first pipe.
        """
        if not parsed.strip():
            return set()

        # Extract the first table, which is the one before the first pipe.
        first_pipe = parsed.find("|")
        if first_pipe < 0:
            first_pipe = len(parsed)
        table_name = parsed[:first_pipe].strip()

        # Remove any leading/trailing whitespace and handle database prefixes.
        parts = table_name.strip().split(".")
        if len(parts) == 1:
            return {Table(table=parts[0])}
        if len(parts) == 2:
            return {Table(table=parts[1], catalog=parts[0])}
        return set()
```

Также был добавлен специальный метод `split_kql` для разделения KQL-скрипта на отдельные запросы:

```python
def split_kql(script: str) -> list[str]:
    """
    Split a KQL script into individual statements.

    KQL doesn't have a clear statement separator like SQL, so we assume that each
    statement starts at the beginning of a line and doesn't have any blank lines.
    """
    statements = []
    current_statement = []

    for line in script.splitlines():
        stripped_line = line.strip()
        if not stripped_line:
            if current_statement:
                statements.append("\n".join(current_statement))
                current_statement = []
        else:
            current_statement.append(line)

    if current_statement:
        statements.append("\n".join(current_statement))

    return statements
```

### Интеграция с другими модулями

Модуль `sql` интегрирован с другими модулями DODO для обеспечения полной поддержки Kusto:

1. **Интеграция с `db_engine_specs`**:
   - `KustoSqlEngineSpec` - спецификация для Kusto SQL
   - `KustoKqlEngineSpec` - спецификация для Kusto KQL

2. **Интеграция с SQL Lab**:
   - Поддержка выполнения KQL-запросов в SQL Lab
   - Подсветка синтаксиса KQL

3. **Интеграция с визуализациями**:
   - Поддержка построения запросов для DODO-специфичных чартов

## Техническая реализация

### SQLScript

Класс `SQLScript` представляет SQL-скрипт, состоящий из нескольких запросов:

```python
class SQLScript:
    """
    A SQL script, with 0+ statements.
    """

    # Special engines that can't be parsed using sqlglot. Supporting non-SQL engines
    # adds a lot of complexity to Superset, so we should avoid adding new engines to
    # this data structure.
    special_engines = {
        "kustokql": KustoKQLStatement,
    }

    def __init__(
        self,
        script: str,
        engine: str,
    ):
        statement_class = self.special_engines.get(engine, SQLStatement)
        self.engine = engine
        self.statements = statement_class.split_script(script, engine)

    def __iter__(self) -> Iterator[BaseSQLStatement[Any]]:
        yield from self.statements

    def __getitem__(self, index: int) -> BaseSQLStatement[Any]:
        return self.statements[index]

    def __len__(self) -> int:
        return len(self.statements)

    @property
    def tables(self) -> set[Table]:
        """
        Return all the tables referenced in the script.
        """
        tables: set[Table] = set()
        for statement in self.statements:
            tables.update(statement.tables)
        return tables
```

### Извлечение таблиц из запроса

Функция `extract_tables_from_statement` извлекает таблицы из разобранного SQL-запроса:

```python
def extract_tables_from_statement(
    parsed: exp.Expression, dialect: str | None = None
) -> set[Table]:
    """
    Extract all table references from a SQL statement.
    """
    tables: set[Table] = set()

    for node in parsed.find_all(exp.Table):
        catalog = None
        schema = None
        table = None
        alias = None

        # Extract the table name.
        if isinstance(node.this, exp.Identifier):
            table = node.this.name
        elif isinstance(node.this, exp.Dot):
            # Handle schema/catalog prefixes.
            parts = []
            current = node.this
            while isinstance(current, exp.Dot):
                if isinstance(current.this, exp.Identifier):
                    parts.append(current.this.name)
                current = current.expression
            if isinstance(current, exp.Identifier):
                parts.append(current.name)
            parts.reverse()
            if len(parts) == 2:
                schema, table = parts
            elif len(parts) == 3:
                catalog, schema, table = parts
            else:
                table = ".".join(parts)

        # Extract the alias.
        if node.alias:
            alias = node.alias.this.name

        if table:
            tables.add(Table(table=table, schema=schema, catalog=catalog, alias=alias))

    return tables
```

## Примеры использования

### Парсинг SQL-запроса

```python
from superset.sql.parse import SQLScript

# Парсинг SQL-запроса
script = SQLScript("SELECT * FROM users WHERE id = 1", "postgresql")

# Получение списка таблиц
tables = script.tables
print(tables)  # {Table(table='users', schema=None, catalog=None, alias=None)}

# Проверка, является ли запрос SELECT-запросом
is_select = script[0].is_select()
print(is_select)  # True
```

### Парсинг Kusto KQL-запроса

```python
from superset.sql.parse import SQLScript

# Парсинг Kusto KQL-запроса
script = SQLScript("""
StormEvents
| summarize PropertyDamage = sum(DamageProperty) by State
| join kind=innerunique PopulationData on State
| project State, PropertyDamagePerCapita = PropertyDamage / Population
| sort by PropertyDamagePerCapita
""", "kustokql")

# Получение списка таблиц
tables = script.tables
print(tables)  # {Table(table='StormEvents', schema=None, catalog=None, alias=None)}
```

### Извлечение таблиц из запроса

```python
from superset.sql.parse import SQLScript

# Парсинг SQL-запроса
script = SQLScript("""
SELECT u.name, o.order_date
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE o.status = 'completed'
""", "postgresql")

# Получение списка таблиц
tables = script.tables
print(tables)  # {Table(table='users', schema=None, catalog=None, alias='u'), Table(table='orders', schema=None, catalog=None, alias='o')}
```

### Использование в DODO

В DODO модуль `sql` используется для парсинга и обработки запросов к различным источникам данных, включая Kusto. Примеры использования:

1. **Парсинг запросов в SQL Lab**:
   ```python
   from superset.sql.parse import SQLScript

   # Парсинг запроса
   script = SQLScript(query_string, database.backend)

   # Проверка, является ли запрос только для чтения
   is_readonly = all(statement.is_readonly() for statement in script)
   ```

2. **Извлечение таблиц для проверки разрешений**:
   ```python
   from superset.sql.parse import SQLScript

   # Парсинг запроса
   script = SQLScript(query_string, database.backend)

   # Получение списка таблиц
   tables = script.tables

   # Проверка разрешений для каждой таблицы
   for table in tables:
       if not security_manager.can_access_table(database, table):
           raise Exception(f"Access to table {table} denied")
   ```

3. **Поддержка Kusto KQL в чартах**:
   ```python
   from superset.sql.parse import SQLScript

   # Парсинг Kusto KQL-запроса
   script = SQLScript(kql_query, "kustokql")

   # Получение списка таблиц для проверки разрешений
   tables = script.tables
   ```
