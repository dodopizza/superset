# DODO added #32839641
from __future__ import annotations

import logging

from superset.daos.base import BaseDAO
from superset.statement.commands.exceptions import (
    StatementNotFoundError,
)
from superset.extensions import db
from superset.models.statement import Statement

logger = logging.getLogger(__name__)


class StatementDAO(BaseDAO[Statement]):

    @classmethod
    def get_by_id(cls, pk: int) -> Statement:
        try:
            query = (
                db.session.query(Statement).filter(Statement.id == pk)
            )
            statement = query.one_or_none()

            if not statement:
                raise StatementNotFoundError()
        except AttributeError as e:
            raise StatementNotFoundError()
        return statement
