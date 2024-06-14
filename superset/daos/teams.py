# DODO added #32839641
from __future__ import annotations

import logging
from superset.daos.base import BaseDAO
from superset.daos.exceptions import DAOConfigError, DAOCreateFailedError
from superset.onboarding.commands.exceptions import (
    OnboardingAccessDeniedError,
    OnboardingForbiddenError,
    OnboardingNotFoundError,
)
from superset.exceptions import SupersetSecurityException
from superset.extensions import db
from superset.models.team import Team

logger = logging.getLogger(__name__)


class TeamDAO(BaseDAO[Team]):

    @classmethod
    def get_by_name_and_external(cls, name: str, is_external: bool) -> Team:
        try:
            query = (
                db.session.query(Team).filter(isExternal=is_external).
                filter(Team.name.contains(name))
            )
            team = query.all()
            if not team:
                raise OnboardingNotFoundError()
        except AttributeError as e:
            raise OnboardingNotFoundError()
        return team
