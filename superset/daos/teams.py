# DODO added #32839641
from __future__ import annotations

import logging
from superset.daos.base import BaseDAO
from superset.daos.exceptions import DAOConfigError, DAOCreateFailedError
from superset.teams.commands.exceptions import (
    TeamAccessDeniedError,
    TeamForbiddenError,
    TeamNotFoundError,
)
from superset.exceptions import SupersetSecurityException
from superset.extensions import db
from superset.models.team import Team

logger = logging.getLogger(__name__)


class TeamDAO(BaseDAO[Team]):

    @classmethod
    def get_by_name_and_external(cls, subname: str, is_external: bool) -> list[Team]:
        try:
            query = (
                db.session.query(Team).filter(isExternal=is_external).
                filter(Team.name.contains(subname))
            )
            teams = query.all()
            if not teams:
                raise TeamNotFoundError()
        except AttributeError as e:
            raise TeamNotFoundError()
        return teams
