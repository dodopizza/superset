# DODO added #32839641

import logging
from typing import Any

from flask_appbuilder.models.sqla import Model

from superset.commands.base import BaseCommand, CreateMixin
from superset.daos.statement import StatementDAO
from superset.daos.exceptions import DAOCreateFailedError
from superset.statement.commands.exceptions import (
    StatementCreateFailedError,
)

logger = logging.getLogger(__name__)


class CreateStatementCommand(CreateMixin, BaseCommand):
    def __init__(self, data: dict[str, Any]):
        self._properties = data.copy()

    def run(self) -> Model:
        self.validate()
        try:
            statement = StatementDAO.create(self._properties, commit=True)
        except DAOCreateFailedError as ex:
            logger.exception(ex.exception)
            raise StatementCreateFailedError() from ex
        return statement

    def validate(self) -> None:
        pass
