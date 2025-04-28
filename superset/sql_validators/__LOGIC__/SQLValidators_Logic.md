# Документация по валидаторам SQL (SQL Validators) в DODO

## Содержание

1. [Введение](#введение)
2. [Архитектура](#архитектура)
3. [Основные компоненты](#основные-компоненты)
   - [Базовый валидатор](#базовый-валидатор)
   - [Аннотации валидации](#аннотации-валидации)
   - [Валидатор PostgreSQL](#валидатор-postgresql)
   - [Валидатор PrestoDB](#валидатор-prestodb)
4. [Процесс валидации](#процесс-валидации)
5. [Интеграция с другими модулями](#интеграция-с-другими-модулями)
6. [Техническая реализация](#техническая-реализация)
7. [Примеры использования](#примеры-использования)

## Введение

Модуль `sql_validators` в Superset отвечает за валидацию SQL-запросов перед их выполнением. Он предоставляет механизмы для проверки синтаксиса SQL-запросов, обнаружения потенциальных ошибок и предоставления пользователю информации о проблемах в запросе.

В DODO этот модуль используется для обеспечения корректности SQL-запросов, что помогает предотвратить ошибки при работе с данными и улучшить пользовательский опыт.

## Архитектура

Модуль `sql_validators` организован следующим образом:

1. **Основные файлы**:
   - `__init__.py` - инициализация модуля и функция для получения валидатора по имени
   - `base.py` - базовый класс для всех валидаторов SQL и класс для аннотаций валидации
   - `postgres.py` - валидатор для PostgreSQL
   - `presto_db.py` - валидатор для PrestoDB

2. **Связанные модули**:
   - `commands/database/validate_sql.py` - команда для валидации SQL-запросов
   - `sqllab/validators.py` - валидаторы для SQL Lab
   - `views/database/validators.py` - валидаторы для представлений баз данных

## Основные компоненты

### Базовый валидатор

Базовый класс `BaseSQLValidator` определяет интерфейс для всех валидаторов SQL:

```python
class BaseSQLValidator:  # pylint: disable=too-few-public-methods
    """BaseSQLValidator defines the interface for checking that a given sql
    query is valid for a given database engine."""

    name = "BaseSQLValidator"

    @classmethod
    def validate(
        cls,
        sql: str,
        catalog: str | None,
        schema: str | None,
        database: Database,
    ) -> list[SQLValidationAnnotation]:
        """Check that the given SQL querystring is valid for the given engine"""
        raise NotImplementedError
```

Этот класс определяет метод `validate`, который должен быть реализован всеми конкретными валидаторами. Метод принимает SQL-запрос, каталог, схему и объект базы данных, и возвращает список аннотаций валидации.

### Аннотации валидации

Класс `SQLValidationAnnotation` представляет одну аннотацию (ошибку или предупреждение) в SQL-запросе:

```python
class SQLValidationAnnotation:  # pylint: disable=too-few-public-methods
    """Represents a single annotation (error/warning) in an SQL querytext"""

    def __init__(
        self,
        message: str,
        line_number: int | None,
        start_column: int | None,
        end_column: int | None,
    ):
        self.message = message
        self.line_number = line_number
        self.start_column = start_column
        self.end_column = end_column

    def to_dict(self) -> dict[str, Any]:
        """Return a dictionary representation of this annotation"""
        return {
            "line_number": self.line_number,
            "start_column": self.start_column,
            "end_column": self.end_column,
            "message": self.message,
        }
```

Аннотация содержит сообщение об ошибке или предупреждении, номер строки и позиции начала и конца проблемного участка в запросе.

### Валидатор PostgreSQL

Валидатор `PostgreSQLValidator` проверяет SQL-запросы для PostgreSQL с использованием модуля `pgsanity`:

```python
class PostgreSQLValidator(BaseSQLValidator):  # pylint: disable=too-few-public-methods
    """Validate SQL queries using the pgsanity module"""

    name = "PostgreSQLValidator"

    @classmethod
    def validate(
        cls,
        sql: str,
        catalog: str | None,
        schema: str | None,
        database: Database,
    ) -> list[SQLValidationAnnotation]:
        annotations: list[SQLValidationAnnotation] = []
        valid, error = check_string(sql, add_semicolon=True)
        if valid:
            return annotations

        match = re.match(r"^line (\d+): (.*)", error)
        line_number = int(match.group(1)) if match else None
        message = match.group(2) if match else error

        annotations.append(
            SQLValidationAnnotation(
                message=message,
                line_number=line_number,
                start_column=None,
                end_column=None,
            )
        )

        return annotations
```

Этот валидатор использует модуль `pgsanity` для проверки синтаксиса SQL-запросов PostgreSQL. Если запрос некорректен, валидатор создает аннотацию с сообщением об ошибке и номером строки.

### Валидатор PrestoDB

Валидатор `PrestoDBSQLValidator` проверяет SQL-запросы для PrestoDB с использованием встроенной функциональности EXPLAIN:

```python
class PrestoDBSQLValidator(BaseSQLValidator):
    """Validate SQL queries using Presto's built-in EXPLAIN subtype"""

    name = "PrestoDBSQLValidator"

    @classmethod
    def validate_statement(
        cls,
        statement: str,
        database: Database,
        cursor: Any,
    ) -> SQLValidationAnnotation | None:
        # pylint: disable=too-many-locals
        db_engine_spec = database.db_engine_spec
        parsed_query = ParsedQuery(statement, engine=db_engine_spec.engine)
        sql = parsed_query.stripped()

        # Hook to allow environment-specific mutation (usually comments) to the SQL
        sql = database.mutate_sql_based_on_config(sql)

        # Transform the final statement to an explain call before sending it on
        # to presto to validate
        sql = f"EXPLAIN (TYPE VALIDATE) {sql}"

        try:
            db_engine_spec.execute(cursor, sql, database)
            polled = cursor.poll()
            while polled:
                logger.info("polling presto for validation progress")
                stats = polled.get("stats", {})
                if stats:
                    state = stats.get("state")
                    if state == "FINISHED":
                        break
                time.sleep(0.2)
                polled = cursor.poll()
            db_engine_spec.fetch_data(cursor, MAX_ERROR_ROWS)
            return None
        except DatabaseError as db_error:
            # Extract error message
            error_message = str(db_error)
            match = re.match(r"line (\d+):(\d+): (.*)", error_message)
            if match:
                line_number = int(match.group(1))
                start_column = int(match.group(2))
                message = match.group(3)
                return SQLValidationAnnotation(
                    message=message,
                    line_number=line_number,
                    start_column=start_column,
                    end_column=None,
                )
            return SQLValidationAnnotation(
                message=error_message,
                line_number=None,
                start_column=None,
                end_column=None,
            )
```

Этот валидатор использует команду `EXPLAIN (TYPE VALIDATE)` для проверки синтаксиса SQL-запросов PrestoDB. Если запрос некорректен, валидатор создает аннотацию с сообщением об ошибке, номером строки и позицией начала проблемного участка.

## Процесс валидации

Процесс валидации SQL-запросов в Superset включает следующие шаги:

1. **Получение валидатора**:
   - Получение валидатора по имени с помощью функции `get_validator_by_name`
   - Проверка, что валидатор существует и поддерживается

2. **Валидация запроса**:
   - Вызов метода `validate` валидатора с передачей SQL-запроса, каталога, схемы и объекта базы данных
   - Получение списка аннотаций валидации

3. **Обработка результатов валидации**:
   - Если список аннотаций пуст, запрос считается корректным
   - Если список аннотаций не пуст, запрос содержит ошибки или предупреждения
   - Аннотации преобразуются в словари и возвращаются пользователю

## Интеграция с другими модулями

Модуль `sql_validators` интегрирован с другими модулями Superset:

1. **Интеграция с SQL Lab**:
   - Валидация запросов перед их выполнением в SQL Lab
   - Отображение ошибок и предупреждений в интерфейсе SQL Lab

2. **Интеграция с командами**:
   - Команда `ValidateSQLCommand` для валидации SQL-запросов
   - Обработка ошибок валидации и возврат соответствующих сообщений

3. **Интеграция с представлениями**:
   - Валидация SQL-запросов в представлениях баз данных
   - Валидация URI подключения к базе данных

## Техническая реализация

### Получение валидатора по имени

Функция `get_validator_by_name` в файле `__init__.py` возвращает класс валидатора по его имени:

```python
def get_validator_by_name(name: str) -> Optional[type[base.BaseSQLValidator]]:
    return {
        "PrestoDBSQLValidator": presto_db.PrestoDBSQLValidator,
        "PostgreSQLValidator": postgres.PostgreSQLValidator,
    }.get(name)
```

### Команда для валидации SQL

Команда `ValidateSQLCommand` в файле `commands/database/validate_sql.py` выполняет валидацию SQL-запроса:

```python
class ValidateSQLCommand(BaseCommand):
    def __init__(self, database_id: int, sql: str, schema: str = None, template_params: dict[str, Any] = None):
        self._properties = {
            "database_id": database_id,
            "sql": sql,
            "schema": schema,
            "template_params": template_params,
        }
        self._model: Optional[Database] = None
        self._validator: Optional[BaseSQLValidator] = None

    def validate(self) -> None:
        database_id = self._properties["database_id"]
        self._model = DatabaseDAO.find_by_id(database_id)
        if not self._model:
            raise DatabaseNotFoundError()

        validator_name = self._model.get_validator_name()
        if not validator_name:
            raise NoValidatorConfigFoundError()

        self._validator = get_validator_by_name(validator_name)
        if not self._validator:
            raise NoValidatorFoundError()

    def run(self) -> list[dict[str, Any]]:
        """
        Validates SQL for a given database.

        :return: A List of SQLValidationAnnotation
        :raises: DatabaseNotFoundError, NoValidatorConfigFoundError
          NoValidatorFoundError, ValidatorSQLUnexpectedError, ValidatorSQLError
          ValidatorSQL400Error
        """
        self.validate()
        if not self._validator or not self._model:
            raise ValidatorSQLUnexpectedError()
        sql = self._properties["sql"]
        catalog = self._properties.get("catalog")
        schema = self._properties.get("schema")
        try:
            timeout = current_app.config["SQLLAB_VALIDATION_TIMEOUT"]
            timeout_msg = f"The query exceeded the {timeout} seconds timeout."
            with utils.timeout(seconds=timeout, error_message=timeout_msg):
                errors = self._validator.validate(sql, catalog, schema, self._model)
            return [err.to_dict() for err in errors]
        except Exception as ex:
            logger.exception(ex)
            raise ValidatorSQLError(str(ex)) from ex
```

### Валидатор для SQL Lab

Валидатор `CanAccessQueryValidatorImpl` в файле `sqllab/validators.py` проверяет, имеет ли пользователь доступ к запросу:

```python
class CanAccessQueryValidatorImpl(CanAccessQueryValidator):
    def validate(self, query: Query) -> None:
        security_manager.raise_for_access(query=query)
```

## Примеры использования

### Валидация SQL-запроса для PostgreSQL

```python
from superset.models.core import Database
from superset.sql_validators.postgres import PostgreSQLValidator

# Получение базы данных
database = Database.get(1)

# Валидация SQL-запроса
sql = "SELECT * FROM users WHERE id = 1"
annotations = PostgreSQLValidator.validate(sql, None, "public", database)

# Проверка результатов валидации
if not annotations:
    print("SQL-запрос корректен")
else:
    for annotation in annotations:
        print(f"Ошибка в строке {annotation.line_number}: {annotation.message}")
```

### Валидация SQL-запроса для PrestoDB

```python
from superset.models.core import Database
from superset.sql_validators.presto_db import PrestoDBSQLValidator

# Получение базы данных
database = Database.get(2)

# Валидация SQL-запроса
sql = "SELECT * FROM users WHERE id = 1"
annotations = PrestoDBSQLValidator.validate(sql, None, "default", database)

# Проверка результатов валидации
if not annotations:
    print("SQL-запрос корректен")
else:
    for annotation in annotations:
        print(f"Ошибка в строке {annotation.line_number}: {annotation.message}")
```

### Использование команды для валидации SQL

```python
from superset.commands.database.validate_sql import ValidateSQLCommand

# Валидация SQL-запроса
database_id = 1
sql = "SELECT * FROM users WHERE id = 1"
schema = "public"
template_params = {}

try:
    command = ValidateSQLCommand(database_id, sql, schema, template_params)
    annotations = command.run()
    
    # Проверка результатов валидации
    if not annotations:
        print("SQL-запрос корректен")
    else:
        for annotation in annotations:
            print(f"Ошибка в строке {annotation['line_number']}: {annotation['message']}")
except Exception as e:
    print(f"Ошибка при валидации SQL: {str(e)}")
```

### Валидация URI подключения к базе данных

```python
from sqlalchemy.engine.url import make_url
from superset.views.database.validators import sqlalchemy_uri_validator

# Валидация URI подключения к базе данных
try:
    uri = "postgresql://user:password@host:port/database"
    sqlalchemy_uri_validator(uri)
    print("URI подключения корректен")
except Exception as e:
    print(f"Ошибка в URI подключения: {str(e)}")
```
