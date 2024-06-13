# Licensed to the Apache Software Foundation (ASF) under one
# or more contributor license agreements.  See the NOTICE file
# distributed with this work for additional information
# regarding copyright ownership.  The ASF licenses this file
# to you under the Apache License, Version 2.0 (the
# "License"); you may not use this file except in compliance
# with the License.  You may obtain a copy of the License at
#
#   http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an
# "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
# KIND, either express or implied.  See the License for the
# specific language governing permissions and limitations
# under the License.
import json
import logging
from typing import Any, Optional

from flask_appbuilder.models.sqla import Model
from marshmallow import ValidationError

from superset import security_manager
from superset.commands.base import BaseCommand, UpdateMixin
from superset.commands.utils import populate_roles
from superset.daos.onboarding import OnboardingDAO
from superset.daos.exceptions import DAOUpdateFailedError
from superset.onboarding.commands.exceptions import (
    OnboardingForbiddenError,
    OnboardingInvalidError,
    OnboardingNotFoundError,
    OnboardingSlugExistsValidationError,
    OnboardingUpdateFailedError,
)
from superset.exceptions import SupersetSecurityException
from superset.extensions import db
from superset.models.user_info import UserInfo

logger = logging.getLogger(__name__)


class UpdateOnboardingCommand(UpdateMixin, BaseCommand):
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
        # Validate/populate model exists
        self._model = OnboardingDAO.find_by_id(self._model_id)
        if not self._model:
            raise OnboardingNotFoundError()

