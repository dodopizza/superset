# Документация по импорту/экспорту (ImportExport) в DODO

## Содержание

1. [Введение](#введение)
2. [Архитектура](#архитектура)
3. [Стандартная функциональность](#стандартная-функциональность)
4. [DODO-специфичная функциональность](#dodo-специфичная-функциональность)
5. [Техническая реализация](#техническая-реализация)
6. [Примеры использования](#примеры-использования)

## Введение

Модуль `importexport` предоставляет API для импорта и экспорта активов Superset, таких как дашборды, графики, датасеты и базы данных. Эта функциональность позволяет переносить активы между различными экземплярами Superset, а также создавать резервные копии.

В DODO этот модуль используется для управления активами и их переноса между различными средами (разработка, тестирование, продакшн).

## Архитектура

Модуль `importexport` организован следующим образом:

1. **API** (`api.py`):
   - `ImportExportRestApi` - REST API для импорта и экспорта активов
   - Предоставляет эндпоинты для экспорта всех активов и импорта активов из ZIP-файла

2. **Команды**:
   - `ExportAssetsCommand` - команда для экспорта всех активов
   - `ImportAssetsCommand` - команда для импорта активов из ZIP-файла
   - Команды для экспорта и импорта отдельных типов активов (дашборды, графики, датасеты и т.д.)

3. **Утилиты**:
   - Функции для работы с ZIP-файлами
   - Функции для сериализации и десериализации активов

## Стандартная функциональность

Стандартная функциональность модуля `importexport` включает:

1. **Экспорт активов**:
   - Экспорт всех активов в ZIP-файл
   - Экспорт отдельных типов активов (дашборды, графики, датасеты и т.д.)
   - Экспорт активов в формате YAML

2. **Импорт активов**:
   - Импорт активов из ZIP-файла
   - Импорт отдельных типов активов (дашборды, графики, датасеты и т.д.)
   - Импорт активов из формата YAML

3. **Управление зависимостями**:
   - Автоматическое разрешение зависимостей между активами
   - Импорт зависимых активов вместе с основными активами

4. **Версионирование**:
   - Поддержка различных версий формата импорта/экспорта
   - Обратная совместимость с предыдущими версиями

## DODO-специфичная функциональность

В результате анализа кода **не обнаружено DODO-специфичных изменений или расширений** в модуле `importexport`. Весь код в этом модуле является стандартным для Superset.

Однако, в DODO модуль `importexport` используется для управления активами и их переноса между различными средами. Для этого используются стандартные возможности модуля, без каких-либо специфичных модификаций.

## Техническая реализация

### ImportExportRestApi

REST API для импорта и экспорта активов:

```python
class ImportExportRestApi(BaseSupersetApi):
    """
    API for exporting all assets or importing them.
    """

    resource_name = "assets"
    openapi_spec_tag = "Import/export"
    allow_browser_login = True

    @expose("/export/", methods=("GET",))
    @protect()
    @statsd_metrics
    @event_logger.log_this_with_context(
        action=lambda self, *args, **kwargs: f"{self.__class__.__name__}.export",
        log_to_statsd=False,
    )
    def export(self) -> Response:
        """Export all assets.
        ---
        get:
          summary: Export all assets
          description: >-
            Gets a ZIP file with all the Superset assets (databases, datasets, charts,
            dashboards, saved queries) as YAML files.
          responses:
            200:
              description: ZIP file
              content:
                application/zip:
                  schema:
                    type: string
                    format: binary
            401:
              $ref: '#/components/responses/401'
            404:
              $ref: '#/components/responses/404'
            500:
              $ref: '#/components/responses/500'
        """
        timestamp = datetime.now().strftime("%Y%m%dT%H%M%S")
        root = f"assets_export_{timestamp}"
        filename = f"{root}.zip"

        buf = BytesIO()
        with ZipFile(buf, "w") as bundle:
            for file_name, file_content in ExportAssetsCommand().run():
                with bundle.open(f"{root}/{file_name}", "w") as fp:
                    fp.write(file_content().encode())
        buf.seek(0)

        response = send_file(
            buf,
            mimetype="application/zip",
            as_attachment=True,
            download_name=filename,
        )
        return response

    @expose("/import/", methods=("POST",))
    @protect()
    @statsd_metrics
    @event_logger.log_this_with_context(
        action=lambda self, *args, **kwargs: f"{self.__class__.__name__}.import_",
        log_to_statsd=False,
    )
    @requires_form_data
    def import_(self) -> Response:
        """Import multiple assets.
        ---
        post:
          summary: Import multiple assets
          requestBody:
            required: true
            content:
              multipart/form-data:
                schema:
                  type: object
                  properties:
                    bundle:
                      description: upload file (ZIP or JSON)
                      type: string
                      format: binary
                    passwords:
                      description: >-
                        JSON map of passwords for each featured database in the
                        ZIP file. If the ZIP includes a database config in the path
                        `databases/MyDatabase.yaml`, the password should be provided
                        in the following format:
                        `{"databases/MyDatabase.yaml": "my_password"}`.
                      type: string
                    ssh_tunnel_passwords:
                      description: >-
                        JSON map of passwords for each ssh_tunnel associated to a
                        featured database in the ZIP file. If the ZIP includes a
                        database config in the path `databases/MyDatabase.yaml`,
                        the password should be provided in the following format:
                        `{"databases/MyDatabase.yaml": "my_password"}`.
                      type: string
                    ssh_tunnel_private_keys:
                      description: >-
                        JSON map of private_key for each ssh_tunnel associated to a
                        featured database in the ZIP file. If the ZIP includes a
                        database config in the path `databases/MyDatabase.yaml`,
                        the private_key should be provided in the following format:
                        `{"databases/MyDatabase.yaml": "my_private_key"}`.
                      type: string
                    ssh_tunnel_private_key_passwords:
                      description: >-
                        JSON map of private_key_password for each ssh_tunnel associated to a
                        featured database in the ZIP file. If the ZIP includes a
                        database config in the path `databases/MyDatabase.yaml`,
                        the private_key should be provided in the following format:
                        `{"databases/MyDatabase.yaml": "my_private_key_password"}`.
                      type: string
          responses:
            200:
              description: Assets import result
              content:
                application/json:
                  schema:
                    type: object
                    properties:
                      message:
                        type: string
            400:
              $ref: '#/components/responses/400'
            401:
              $ref: '#/components/responses/401'
            422:
              $ref: '#/components/responses/422'
            500:
              $ref: '#/components/responses/500'
        """
        upload = request.files.get("bundle")
        if not upload:
            return self.response_400()
        if not is_zipfile(upload):
            raise IncorrectFormatError("Not a ZIP file")

        with ZipFile(upload) as bundle:
            contents = get_contents_from_bundle(bundle)

        if not contents:
            raise NoValidFilesFoundError()

        passwords = (
            json.loads(request.form["passwords"])
            if "passwords" in request.form
            else None
        )
        ssh_tunnel_passwords = (
            json.loads(request.form["ssh_tunnel_passwords"])
            if "ssh_tunnel_passwords" in request.form
            else None
        )
        ssh_tunnel_private_keys = (
            json.loads(request.form["ssh_tunnel_private_keys"])
            if "ssh_tunnel_private_keys" in request.form
            else None
        )
        ssh_tunnel_priv_key_passwords = (
            json.loads(request.form["ssh_tunnel_private_key_passwords"])
            if "ssh_tunnel_private_key_passwords" in request.form
            else None
        )

        command = ImportAssetsCommand(
            contents,
            passwords=passwords,
            ssh_tunnel_passwords=ssh_tunnel_passwords,
            ssh_tunnel_private_keys=ssh_tunnel_private_keys,
            ssh_tunnel_priv_key_passwords=ssh_tunnel_priv_key_passwords,
        )
        command.run()
        return self.response(200, message="OK")
```

### ExportAssetsCommand

Команда для экспорта всех активов:

```python
class ExportAssetsCommand(BaseCommand):
    """
    Command for exporting all Superset assets.
    """

    def __init__(self) -> None:
        self.dashboard_ids: list[int] = []
        self.chart_ids: list[int] = []
        self.dataset_ids: list[int] = []
        self.database_ids: list[int] = []
        self.query_ids: list[int] = []

    def run(self) -> Iterator[tuple[str, Callable[[], str]]]:
        self.dashboard_ids = DashboardDAO.find_ids_all()
        self.chart_ids = ChartDAO.find_ids_all()
        self.dataset_ids = DatasetDAO.find_ids_all()
        self.database_ids = DatabaseDAO.find_ids_all()
        self.query_ids = SavedQueryDAO.find_ids_all()

        for dashboard_id in self.dashboard_ids:
            yield from ExportDashboardsCommand([dashboard_id]).run()
        for chart_id in self.chart_ids:
            yield from ExportChartsCommand([chart_id]).run()
        for dataset_id in self.dataset_ids:
            yield from ExportDatasetsCommand([dataset_id]).run()
        for database_id in self.database_ids:
            yield from ExportDatabasesCommand([database_id]).run()
        for query_id in self.query_ids:
            yield from ExportSavedQueriesCommand([query_id]).run()
```

### ImportAssetsCommand

Команда для импорта активов из ZIP-файла:

```python
class ImportAssetsCommand(BaseCommand):
    """
    Command for importing databases, datasets, charts, dashboards and saved queries.

    This command is used for managing Superset assets externally under source control,
    and will overwrite everything.
    """

    schemas: dict[str, Schema] = {
        "charts/": ImportV1ChartSchema(),
        "dashboards/": ImportV1DashboardSchema(),
        "datasets/": ImportV1DatasetSchema(),
        "databases/": ImportV1DatabaseSchema(),
        "queries/": ImportV1SavedQuerySchema(),
    }

    def __init__(
        self,
        contents: dict[str, str],
        passwords: dict[str, str] | None = None,
        ssh_tunnel_passwords: dict[str, str] | None = None,
        ssh_tunnel_private_keys: dict[str, str] | None = None,
        ssh_tunnel_priv_key_passwords: dict[str, str] | None = None,
    ) -> None:
        self.contents = contents
        self.passwords = passwords or {}
        self.ssh_tunnel_passwords = ssh_tunnel_passwords or {}
        self.ssh_tunnel_private_keys = ssh_tunnel_private_keys or {}
        self.ssh_tunnel_priv_key_passwords = ssh_tunnel_priv_key_passwords or {}

    def run(self) -> None:
        self.validate()

        # import databases first
        database_files = self._filter_by_prefix("databases/")
        if database_files:
            ImportDatabasesCommand(
                contents=database_files,
                passwords=self.passwords,
                ssh_tunnel_passwords=self.ssh_tunnel_passwords,
                ssh_tunnel_private_keys=self.ssh_tunnel_private_keys,
                ssh_tunnel_priv_key_passwords=self.ssh_tunnel_priv_key_passwords,
                overwrite=True,
            ).run()

        # import datasets
        dataset_files = self._filter_by_prefix("datasets/")
        if dataset_files:
            ImportDatasetsCommand(contents=dataset_files, overwrite=True).run()

        # import charts
        chart_files = self._filter_by_prefix("charts/")
        if chart_files:
            ImportChartsCommand(contents=chart_files, overwrite=True).run()

        # import dashboards
        dashboard_files = self._filter_by_prefix("dashboards/")
        if dashboard_files:
            ImportDashboardsCommand(contents=dashboard_files, overwrite=True).run()

        # import saved queries
        query_files = self._filter_by_prefix("queries/")
        if query_files:
            ImportSavedQueriesCommand(contents=query_files, overwrite=True).run()

    def validate(self) -> None:
        # verify that the metadata file (if any) is valid
        metadata = {}
        if "metadata.yaml" in self.contents:
            try:
                metadata = yaml.safe_load(self.contents["metadata.yaml"])
            except yaml.parser.ParserError as ex:
                raise CommandInvalidError("Invalid metadata.yaml file") from ex

        # validate that the type declared in YAML matches the file prefix
        for path, content in self.contents.items():
            if path == "metadata.yaml":
                continue

            prefix = path.split("/")[0] + "/"
            schema = self.schemas.get(prefix)
            if not schema:
                continue

            try:
                config = yaml.safe_load(content)
            except yaml.parser.ParserError as ex:
                raise CommandInvalidError(f"Invalid YAML file: {path}") from ex

            if not isinstance(config, dict):
                raise CommandInvalidError(f"Invalid YAML file: {path}")

            if "type" not in config:
                continue

            if prefix == "databases/" and config["type"] != "Database":
                raise CommandInvalidError(
                    f"Type {config['type']} is not supported for file {path}"
                )

            if prefix == "datasets/" and config["type"] != "SqlaTable":
                raise CommandInvalidError(
                    f"Type {config['type']} is not supported for file {path}"
                )

    def _filter_by_prefix(self, prefix: str) -> dict[str, str]:
        return {
            path: content
            for path, content in self.contents.items()
            if path.startswith(prefix) and path != prefix
        }
```

## Примеры использования

### Экспорт всех активов

```python
from superset.commands.export.assets import ExportAssetsCommand
from io import BytesIO
from zipfile import ZipFile
from datetime import datetime

# Экспорт всех активов
timestamp = datetime.now().strftime("%Y%m%dT%H%M%S")
root = f"assets_export_{timestamp}"
filename = f"{root}.zip"

buf = BytesIO()
with ZipFile(buf, "w") as bundle:
    for file_name, file_content in ExportAssetsCommand().run():
        with bundle.open(f"{root}/{file_name}", "w") as fp:
            fp.write(file_content().encode())
buf.seek(0)

# Сохранение ZIP-файла
with open(filename, "wb") as f:
    f.write(buf.read())
```

### Импорт активов из ZIP-файла

```python
from superset.commands.importers.v1.assets import ImportAssetsCommand
from zipfile import ZipFile
from superset.commands.importers.v1.utils import get_contents_from_bundle

# Импорт активов из ZIP-файла
with ZipFile("assets_export_20230101T120000.zip") as bundle:
    contents = get_contents_from_bundle(bundle)

# Импорт активов
command = ImportAssetsCommand(
    contents,
    passwords={"databases/MyDatabase.yaml": "my_password"},
    ssh_tunnel_passwords={"databases/MyDatabase.yaml": "my_ssh_password"},
    ssh_tunnel_private_keys={"databases/MyDatabase.yaml": "my_private_key"},
    ssh_tunnel_priv_key_passwords={"databases/MyDatabase.yaml": "my_private_key_password"},
)
command.run()
```

### Экспорт отдельных активов

```python
from superset.commands.dashboard.export import ExportDashboardsCommand
from superset.commands.chart.export import ExportChartsCommand
from superset.commands.dataset.export import ExportDatasetsCommand
from superset.commands.database.export import ExportDatabasesCommand

# Экспорт дашбордов
for file_name, file_content in ExportDashboardsCommand([1, 2, 3]).run():
    with open(file_name, "w") as f:
        f.write(file_content())

# Экспорт графиков
for file_name, file_content in ExportChartsCommand([1, 2, 3]).run():
    with open(file_name, "w") as f:
        f.write(file_content())

# Экспорт датасетов
for file_name, file_content in ExportDatasetsCommand([1, 2, 3]).run():
    with open(file_name, "w") as f:
        f.write(file_content())

# Экспорт баз данных
for file_name, file_content in ExportDatabasesCommand([1, 2, 3]).run():
    with open(file_name, "w") as f:
        f.write(file_content())
```
