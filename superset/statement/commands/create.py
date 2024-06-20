# DODO added #32839641

import logging
from typing import Any, Optional

from flask_appbuilder.models.sqla import Model
from marshmallow import ValidationError

from superset.commands.base import BaseCommand, CreateMixin
from superset.daos.statement import StatementDAO
from superset.daos.exceptions import DAOCreateFailedError
from superset.statement.commands.exceptions import (
    StatementCreateFailedError,
    StatementInvalidError
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
        exceptions = []
        user_id: Optional[list[int]] = self._properties.get("user")
        try:
            user = self.populate_owners(user_id)
            self._properties["user"] = user
        except ValidationError as ex:
            exceptions.append(ex)
        if exceptions:
            raise StatementInvalidError(exceptions=exceptions)
