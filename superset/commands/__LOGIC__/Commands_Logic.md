# Документация по командам (Commands) в DODO

## Содержание

1. [Введение](#введение)
2. [Архитектура](#архитектура)
3. [Стандартная функциональность](#стандартная-функциональность)
4. [DODO-специфичная функциональность](#dodo-специфичная-функциональность)
5. [Основные типы команд](#основные-типы-команд)
6. [Примеры использования](#примеры-использования)

## Введение

Модуль `commands` предоставляет реализацию паттерна "Команда" для выполнения различных операций в Superset. Команды инкапсулируют логику выполнения операций, таких как создание, обновление, удаление и экспорт различных объектов (дашбордов, графиков, датасетов и т.д.).

В DODO этот модуль используется для стандартных операций с объектами Superset, а также для некоторых специфичных операций, связанных с локализацией и дополнительными функциями.

## Архитектура

Модуль `commands` организован в иерархическую структуру, где каждый подмодуль соответствует определенному типу объектов или операций:

1. **Базовые классы** (`commands/base.py`):
   - `BaseCommand` - базовый класс для всех команд
   - Определяет общий интерфейс для команд

2. **Подмодули для различных типов объектов**:
   - `commands/dashboard/` - команды для работы с дашбордами
   - `commands/chart/` - команды для работы с графиками
   - `commands/dataset/` - команды для работы с датасетами
   - `commands/database/` - команды для работы с базами данных
   - и другие

3. **Типы команд**:
   - Команды создания (create)
   - Команды обновления (update)
   - Команды удаления (delete)
   - Команды экспорта (export)
   - Команды импорта (import)
   - и другие

4. **Исключения** (`commands/exceptions.py`):
   - Определяет исключения, которые могут возникнуть при выполнении команд

## Стандартная функциональность

Стандартная функциональность модуля `commands` включает:

1. **Управление объектами**:
   - Создание, обновление и удаление объектов
   - Экспорт и импорт объектов
   - Дублирование объектов

2. **Валидация**:
   - Проверка прав доступа
   - Проверка корректности данных
   - Проверка существования объектов

3. **Транзакционность**:
   - Выполнение операций в рамках транзакций
   - Откат изменений при возникновении ошибок

4. **Обработка ошибок**:
   - Специализированные исключения для различных типов ошибок
   - Логирование ошибок

## DODO-специфичная функциональность

В результате анализа кода **не обнаружено DODO-специфичных изменений или расширений** в модуле `commands`. Весь код в этом модуле является стандартным для Superset.

Однако, некоторые команды могут взаимодействовать с DODO-специфичными полями в моделях данных, такими как локализованные названия и описания. Например, команды обновления датасетов и колонок могут обновлять поля `verbose_name_ru`, `verbose_name_en`, `description_ru` и `description_en`.

## Основные типы команд

### Команды создания

Команды создания используются для создания новых объектов. Они обычно наследуются от `BaseCommand` и реализуют метод `run()`:

```python
class CreateDatasetCommand(CreateMixin, BaseCommand):
    def __init__(self, data: dict[str, Any]) -> None:
        self._properties = data.copy()
        self._model: Optional[SqlaTable] = None

    @transaction(on_error=partial(on_error, reraise=DatasetCreateFailedError))
    def run(self) -> Model:
        self.validate()
        try:
            return DatasetDAO.create(attributes=self._properties)
        except DAOCreateFailedError as ex:
            raise DatasetCreateFailedError() from ex
```

### Команды обновления

Команды обновления используются для обновления существующих объектов:

```python
class UpdateDatasetCommand(UpdateMixin, BaseCommand):
    def __init__(
        self,
        model_id: int,
        data: dict[str, Any],
        override_columns: Optional[bool] = False,
    ):
        self._model_id = model_id
        self._properties = data.copy()
        self._model: Optional[SqlaTable] = None
        self.override_columns = override_columns
        self._properties["override_columns"] = override_columns

    @transaction(
        on_error=partial(
            on_error,
            catches=(
                SQLAlchemyError,
                ValueError,
            ),
            reraise=DatasetUpdateFailedError,
        )
    )
    def run(self) -> Model:
        self.validate()
        assert self._model
        return DatasetDAO.update(self._model, attributes=self._properties)
```

### Команды удаления

Команды удаления используются для удаления объектов:

```python
class DeleteDashboardCommand(BaseCommand):
    def __init__(self, model_id: int):
        self._model_id = model_id
        self._model: Optional[Dashboard] = None

    @transaction(on_error=partial(on_error, reraise=DashboardDeleteFailedError))
    def run(self) -> Model:
        self.validate()
        try:
            dashboard = DashboardDAO.delete(self._model)
        except DAODeleteFailedError as ex:
            logger.exception(ex.exception)
            raise DashboardDeleteFailedError() from ex
        return dashboard
```

### Команды экспорта

Команды экспорта используются для экспорта объектов:

```python
class ExportDatasetsCommand(ExportModelsCommand):
    dao = DatasetDAO
    not_found = DatasetNotFoundError

    @staticmethod
    def _file_name(model: SqlaTable) -> str:
        db_file_name = get_filename(
            model.database.database_name, model.database.id, skip_id=True
        )
        ds_file_name = get_filename(model.table_name, model.id, skip_id=True)
        return f"datasets/{db_file_name}/{ds_file_name}.yaml"
```

## Примеры использования

### Создание датасета

```python
from superset.commands.dataset.create import CreateDatasetCommand

data = {
    "database": 1,
    "schema": "public",
    "table_name": "example_table",
    "sql": "SELECT * FROM example_table",
    "owners": [1],
}

try:
    dataset = CreateDatasetCommand(data).run()
    print(f"Dataset created with id {dataset.id}")
except Exception as e:
    print(f"Error creating dataset: {e}")
```

### Обновление дашборда

```python
from superset.commands.dashboard.update import UpdateDashboardCommand

data = {
    "dashboard_title": "New Dashboard Title",
    "slug": "new-dashboard-slug",
    "json_metadata": '{"some_key": "some_value"}',
}

try:
    dashboard = UpdateDashboardCommand(1, data).run()
    print(f"Dashboard updated: {dashboard.dashboard_title}")
except Exception as e:
    print(f"Error updating dashboard: {e}")
```

### Экспорт графиков

```python
from superset.commands.chart.export import ExportChartsCommand
import json

try:
    content = ExportChartsCommand([1, 2, 3]).run()
    with open("charts_export.json", "w") as f:
        json.dump(content, f)
    print("Charts exported successfully")
except Exception as e:
    print(f"Error exporting charts: {e}")
```
