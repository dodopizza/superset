# DODO added #32839641
from __future__ import annotations

import logging
from sqlalchemy.sql.expression import false, true

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

    @staticmethod
    def validate_slug_uniqueness(slug: str) -> bool:
        if not slug:
            return True
        team_query = db.session.query(Team).filter(Team.slug == slug)
        return not db.session.query(team_query.exists()).scalar()
