# DODO added #32839638

import logging
from typing import Any, Optional

from flask_appbuilder.models.sqla import Model
from marshmallow import ValidationError

from superset.commands.base import BaseCommand, CreateMixin
from superset.daos.teams import TeamDAO
from superset.commands.utils import get_ids_roles_by_name
from superset.daos.exceptions import DAOCreateFailedError
from superset.teams.commands.exceptions import (
    TeamCreateFailedError,
    TeamInvalidError,
    TeamSlugExistsValidationError,
    TeamInvalidError
)

logger = logging.getLogger(__name__)


class CreateTeamCommand(CreateMixin, BaseCommand):
    def __init__(self, data: dict[str, Any]):
        self._properties = data.copy()

    def run(self) -> Model:
        self.validate()
        try:
            dashboard = TeamDAO.create(self._properties, commit=True)
        except DAOCreateFailedError as ex:
            logger.exception(ex.exception)
            raise TeamCreateFailedError() from ex
        return dashboard

    def validate(self) -> None:
        exceptions: list[ValidationError] = []
        participants_ids: Optional[list[int]] = self._properties.get("participants")
        role_names: Optional[list[int]] = self._properties.get("roles")
        slug: str = self._properties.get("slug", "")

        # Validate slug uniqueness
        if not TeamDAO.validate_slug_uniqueness(slug):
            exceptions.append(TeamSlugExistsValidationError())

        try:
            participants = self.populate_participants(participants_ids)
            self._properties["participants"] = participants
            roles = get_ids_roles_by_name(role_names)
            logger.error(roles)
            self._properties["roles"] = roles
        except ValidationError as ex:
            exceptions.append(ex)

        if exceptions:
            raise TeamInvalidError(exceptions=exceptions)
