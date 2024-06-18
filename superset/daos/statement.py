# DODO added #32839641
from __future__ import annotations

import logging
from superset.daos.base import BaseDAO
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
    def get_by_name_and_external(cls, subname: str, is_external: bool) -> Statement:
        try:
            query = (
                db.session.query(Team).filter(isExternal=is_external).
                filter(Team.name.contains(subname))
            )
            team = query.all()
            if not team:
                raise OnboardingNotFoundError()
        except AttributeError as e:
            raise OnboardingNotFoundError()
        return team

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
