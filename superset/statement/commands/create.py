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
import logging
from typing import Any, Optional

from flask_appbuilder.models.sqla import Model
from marshmallow import ValidationError

from superset.commands.base import BaseCommand, CreateMixin
from superset.commands.utils import populate_roles
from superset.daos.statement import StatementDAO
from superset.daos.exceptions import DAOCreateFailedError
from superset.statement.commands.exceptions import (
    StatementCreateFailedError,
    StatementInvalidError,
    StatementSlugExistsValidationError,
)

logger = logging.getLogger(__name__)


class CreateStatementCommand(CreateMixin, BaseCommand):
    def __init__(self, data: dict[str, Any]):
        self._properties = data.copy()

    def run(self) -> Model:
        self.validate()
        try:
            statement = StatementDAO.create(self._properties, commit=True)
        except DAOCreateFailedError as ex:
            logger.exception(ex.exception)
            raise StatementCreateFailedError() from ex
        return statement

    def validate(self) -> None:
        pass
