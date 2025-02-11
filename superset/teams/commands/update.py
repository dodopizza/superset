# DODO added #32839638

import logging
from typing import Any, Optional

from flask_appbuilder.models.sqla import Model

from superset.commands.base import BaseCommand, UpdateMixin

from superset.daos.teams import TeamDAO
from superset.models.team import Team
from superset.daos.exceptions import DAOUpdateFailedError
from superset.teams.commands.exceptions import (
    TeamNotFoundError,
    TeamUpdateFailedError,
)

logger = logging.getLogger(__name__)


class UpdateTeamCommand(UpdateMixin, BaseCommand):
    def __init__(self, model_id: int, data: dict[str, Any], command: str = None):
        self._model_id = model_id
        self._properties = data.copy()
        self._model: Optional[Team] = None
        self.command = command

    def run(self) -> Model:
        self.validate()
        assert self._model

        try:
            team = TeamDAO.update(self._model, self._properties, commit=True)
        except DAOUpdateFailedError as ex:
            logger.exception(ex.exception)
            raise TeamUpdateFailedError() from ex
        return team

    def validate(self) -> None:
        # Validate model exists
        self._model = TeamDAO.find_by_id(self._model_id)
        if not self._model:
            raise TeamNotFoundError()
        if self.command == "add_user":
            for user in self._model.participants:
                self._properties.get("participants").append(user)

        if self.command == "remove_user":
            self._model.participants.remove(self._properties.get("participants")[0])
            self._properties["participants"] = self._model.participants.copy()
