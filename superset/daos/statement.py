# DODO added #32839641
from __future__ import annotations

import logging
from typing import Any

from superset.daos.base import BaseDAO, T
from superset.daos.exceptions import DAOConfigError, DAOCreateFailedError
from superset.statement.commands.exceptions import (
    StatementAccessDeniedError,
    StatementForbiddenError,
    StatementNotFoundError,
)
from superset.exceptions import SupersetSecurityException
from superset.extensions import db
from superset.models.statement import Statement

logger = logging.getLogger(__name__)


class StatementDAO(BaseDAO[Statement]):

    @classmethod
    def get_by_id(cls, pk: int) -> Statement:
        try:
            query = (
                db.session.query(Statement).filter(id=pk)
            )
            statement = query.all()
            if not statement:
                raise StatementNotFoundError()
        except AttributeError as e:
            raise StatementNotFoundError()
        return statement
