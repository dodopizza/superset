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
from typing import Optional

from flask_babel import lazy_gettext as _
from marshmallow.validate import ValidationError

from superset.commands.exceptions import (
    CommandInvalidError,
    CreateFailedError,
    DeleteFailedError,
    ForbiddenError,
    ImportFailedError,
    ObjectNotFoundError,
    UpdateFailedError,
)


class TeamSlugExistsValidationError(ValidationError):
    """
    Marshmallow validation error for Team slug already exists
    """

    def __init__(self) -> None:
        super().__init__([_("Must be unique")], field_name="slug")


class TeamInvalidError(CommandInvalidError):
    message = _("Team parameters are invalid.")


class TeamNotFoundError(ObjectNotFoundError):
    def __init__(
        self, Team_id: Optional[str] = None, exception: Optional[Exception] = None
    ) -> None:
        super().__init__("Team", Team_id, exception)


class TeamCreateFailedError(CreateFailedError):
    message = _("Teams could not be created.")


class TeamUpdateFailedError(UpdateFailedError):
    message = _("Team could not be updated.")


class TeamDeleteFailedError(DeleteFailedError):
    message = _("Team could not be deleted.")


class TeamDeleteFailedReportsExistError(TeamDeleteFailedError):
    message = _("There are associated alerts or reports")


class TeamForbiddenError(ForbiddenError):
    message = _("Changing this Team is forbidden")


class TeamImportError(ImportFailedError):
    message = _("Import Team failed for an unknown reason")


class TeamAccessDeniedError(ForbiddenError):
    message = _("You don't have access to this Team.")
