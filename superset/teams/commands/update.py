# DODO added #32839638

import logging
from typing import Any, Optional

from flask_appbuilder.models.sqla import Model



from superset.commands.base import BaseCommand, UpdateMixin

from superset.daos.onboarding import OnboardingDAO
from superset.daos.exceptions import DAOUpdateFailedError
from superset.onboarding.commands.exceptions import (
    OnboardingNotFoundError,
    OnboardingUpdateFailedError,
)
from superset.models.user_info import UserInfo

logger = logging.getLogger(__name__)


class UpdateTeamCommand(UpdateMixin, BaseCommand):
    def __init__(self, model_id: int, data: dict[str, Any]):
        self._model_id = model_id
        self._properties = data.copy()
        self._model: Optional[UserInfo] = None

    def run(self) -> Model:
        self.validate()
        assert self._model

        try:
            user_info = OnboardingDAO.update(self._model, self._properties, commit=True)
        except DAOUpdateFailedError as ex:
            logger.exception(ex.exception)
            raise OnboardingUpdateFailedError() from ex
        return user_info

    def validate(self) -> None:
        # Validate model exists
        self._model = OnboardingDAO.find_by_id(self._model_id)
        if not self._model:
            raise OnboardingNotFoundError()

