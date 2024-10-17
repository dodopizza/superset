# DODO added #32839641

import logging
from typing import Any, Optional

from flask_appbuilder.models.sqla import Model

from superset.commands.base import BaseCommand, UpdateMixin
from superset.daos.statement import StatementDAO
from superset.daos.exceptions import DAOUpdateFailedError
from superset.statement.commands.exceptions import (
    StatementNotFoundError,
    StatementUpdateFailedError,
)
from superset.models.statement import Statement

logger = logging.getLogger(__name__)


class UpdateStatementCommand(UpdateMixin, BaseCommand):
    def __init__(self, model_id: int, data: dict[str, Any]):
        self._model_id = model_id
        self._properties = data.copy()
        self._model: Optional[Statement] = None

    def run(self) -> Model:
        self.validate()
        assert self._model

        try:
            statement = StatementDAO.update(self._model, self._properties, commit=True)
        except DAOUpdateFailedError as ex:
            logger.exception(ex.exception)
            raise StatementUpdateFailedError() from ex
        return statement

    def validate(self) -> None:
        # Validate/populate model exists
        self._model = StatementDAO.find_by_id(self._model_id)
        if not self._model:
            raise StatementNotFoundError()

