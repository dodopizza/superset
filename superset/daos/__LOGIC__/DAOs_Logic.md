# Документация по объектам доступа к данным (DAOs) в DODO

## Содержание

1. [Введение](#введение)
2. [Архитектура](#архитектура)
3. [Стандартная функциональность](#стандартная-функциональность)
4. [DODO-специфичная функциональность](#dodo-специфичная-функциональность)
5. [Основные DAO](#основные-dao)
6. [Примеры использования](#примеры-использования)

## Введение

Модуль `daos` (Data Access Objects) предоставляет абстракцию для доступа к данным в Superset. DAO инкапсулируют логику доступа к базе данных, предоставляя высокоуровневый интерфейс для работы с различными сущностями системы, такими как дашборды, графики, датасеты и т.д.

В DODO этот модуль расширен для поддержки дополнительных сущностей и функциональности, специфичных для DODO.

## Архитектура

Модуль `daos` организован в иерархическую структуру, где каждый DAO наследуется от базового класса `BaseDAO`:

1. **Базовый класс** (`base.py`):
   - `BaseDAO` - базовый класс для всех DAO
   - Предоставляет общие методы для создания, чтения, обновления и удаления объектов

2. **Специализированные DAO**:
   - `DashboardDAO` - для работы с дашбордами
   - `ChartDAO` - для работы с графиками
   - `DatasetDAO` - для работы с датасетами
   - `DatabaseDAO` - для работы с базами данных
   - `TagDAO` - для работы с тегами
   - `StatementDAO` - для работы с заявками (DODO-специфичный)
   - и другие

## Стандартная функциональность

Стандартная функциональность модуля `daos` включает:

1. **CRUD-операции**:
   - Создание объектов
   - Чтение объектов
   - Обновление объектов
   - Удаление объектов

2. **Фильтрация и поиск**:
   - Поиск объектов по различным критериям
   - Фильтрация объектов на основе прав доступа

3. **Валидация**:
   - Проверка уникальности объектов
   - Проверка корректности данных

4. **Транзакционность**:
   - Выполнение операций в рамках транзакций
   - Откат изменений при возникновении ошибок

## DODO-специфичная функциональность

В DODO модуль `daos` был расширен для поддержки дополнительных сущностей и функциональности:

1. **StatementDAO** (`statement.py`):
   - DAO для работы с заявками на доступ к системе
   - Добавлен в рамках задачи #32839641
   - Предоставляет методы для получения заявок по ID и по ID пользователя

   ```python
   # DODO added #32839641
   class StatementDAO(BaseDAO[Statement]):
       @classmethod
       def get_by_id(cls, pk: int) -> Statement:
           try:
               query = db.session.query(Statement).filter(Statement.id == pk)
               statement = query.one_or_none()

               if not statement:
                   raise StatementNotFoundError()
           except AttributeError as ex:
               raise StatementNotFoundError() from ex
           return statement

       @staticmethod
       def get_statements_by_user_id() -> list[Statement]:  # получаем все заявки пользователя по его id
           user_id = get_user_id()
           try:
               user = (
                   db.session.query(security_manager.user_model)
                   .filter(security_manager.user_model.id == user_id)
                   .one_or_none()
               )
               return user.statements
           except Exception:  # pylint: disable=broad-except
               return []
   ```

2. **Исключения DAO** (`exceptions.py`):
   - Добавлены специфичные исключения для операций DAO
   - Добавлены в рамках задачи #44211751

   ```python
   # dodo added 44211751
   class DAOCreateFailedError(DAOException):
       """
       DAO Create failed
       """
       message = "Create failed"

   # dodo added 44211751
   class DAOUpdateFailedError(DAOException):
       """
       DAO Update failed
       """
       message = "Update failed"

   # dodo added 44211751
   class DAODeleteFailedError(DAOException):
       """
       DAO Delete failed
       """
       message = "Delete failed"
   ```

3. **Расширение DashboardDAO** (`dashboard.py`):
   - Добавлена поддержка наборов фильтров (FilterSets)
   - Добавлено в рамках задачи #44211751

   ```python
   from superset.models.filter_set import FilterSet  # dodo added 44211751
   ```

## Основные DAO

### BaseDAO

Базовый класс для всех DAO, предоставляющий общие методы для работы с объектами:

```python
class BaseDAO(Generic[T]):
    """
    Base DAO, implement base CRUD sqlalchemy operations
    """

    model_cls: type[Model] | None = None
    """
    Child classes need to state the Model class so they don't need to implement basic
    create, update and delete methods
    """
    base_filter: BaseFilter | None = None
    """
    Child classes can register base filtering to be applied to all filter methods
    """
    id_column_name = "id"

    @classmethod
    def find_by_id(cls, id_: int | str) -> T:
        """
        Find an object by id, raises exception if not found
        """
        if not cls.model_cls:
            raise DAOConfigError()
        model = db.session.query(cls.model_cls).get(id_)
        if not model:
            raise ObjectNotFoundError(str(cls.__name__), id_)
        return model

    @classmethod
    def find_by_ids(cls, ids: list[int | str]) -> list[T]:
        """
        Find objects by a list of ids, raises exception if not found
        """
        if not cls.model_cls:
            raise DAOConfigError()
        query = db.session.query(cls.model_cls).filter(
            getattr(cls.model_cls, cls.id_column_name).in_(ids)
        )
        models = query.all()
        if len(models) != len(ids):
            raise ObjectNotFoundError(str(cls.__name__), ids)
        return models
```

### DashboardDAO

DAO для работы с дашбордами:

```python
class DashboardDAO(BaseDAO[Dashboard]):
    base_filter = DashboardAccessFilter

    @staticmethod
    def get_by_id_or_slug(id_or_slug: int | str) -> Dashboard:
        query = (
            db.session.query(Dashboard)
            .filter(id_or_slug_filter(id_or_slug))
            .outerjoin(
                Dashboard.owners,
                Dashboard.roles,
            )
            .options(
                contains_eager(Dashboard.owners),
                contains_eager(Dashboard.roles),
            )
        )
        return query.one_or_none()
```

### StatementDAO

DAO для работы с заявками на доступ к системе (DODO-специфичный):

```python
# DODO added #32839641
class StatementDAO(BaseDAO[Statement]):
    @classmethod
    def get_by_id(cls, pk: int) -> Statement:
        try:
            query = db.session.query(Statement).filter(Statement.id == pk)
            statement = query.one_or_none()

            if not statement:
                raise StatementNotFoundError()
        except AttributeError as ex:
            raise StatementNotFoundError() from ex
        return statement

    @staticmethod
    def get_statements_by_user_id() -> list[Statement]:  # получаем все заявки пользователя по его id
        user_id = get_user_id()
        try:
            user = (
                db.session.query(security_manager.user_model)
                .filter(security_manager.user_model.id == user_id)
                .one_or_none()
            )
            return user.statements
        except Exception:  # pylint: disable=broad-except
            return []
```

## Примеры использования

### Получение дашборда по ID или slug

```python
from superset.daos.dashboard import DashboardDAO

# Получение дашборда по ID
dashboard = DashboardDAO.get_by_id_or_slug(1)

# Получение дашборда по slug
dashboard = DashboardDAO.get_by_id_or_slug("my-dashboard")
```

### Получение заявок пользователя

```python
from superset.daos.statement import StatementDAO

# Получение всех заявок текущего пользователя
statements = StatementDAO.get_statements_by_user_id()

# Получение заявки по ID
statement = StatementDAO.get_by_id(1)
```

### Создание объекта

```python
from superset.daos.dataset import DatasetDAO

# Создание датасета
dataset = DatasetDAO.create(attributes={
    "table_name": "my_table",
    "database_id": 1,
    "schema": "public",
    "owners": [1, 2, 3]
})
```

### Обновление объекта

```python
from superset.daos.chart import ChartDAO

# Обновление графика
chart = ChartDAO.find_by_id(1)
ChartDAO.update(chart, attributes={
    "slice_name": "New Chart Name",
    "description": "New description"
})
```

### Удаление объекта

```python
from superset.daos.database import DatabaseDAO

# Удаление базы данных
database = DatabaseDAO.find_by_id(1)
DatabaseDAO.delete(database)
```
