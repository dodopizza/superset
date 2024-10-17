# DODO added #36651242
from __future__ import annotations

import logging

from superset.daos.base import BaseDAO
from superset.statement.commands.exceptions import (
    StatementNotFoundError,
)
from superset.extensions import db
from flask_appbuilder.security.sqla.models import User

logger = logging.getLogger(__name__)


class UserDAO(BaseDAO[User]):

    @classmethod
    def get_by_id(cls, pk: int) -> User:
        try:
            query = (
                db.session.query(User).all()
            )
            users = query.one_or_none()

            if not users:
                raise StatementNotFoundError()
        except AttributeError as e:
            raise StatementNotFoundError()
        return statement
