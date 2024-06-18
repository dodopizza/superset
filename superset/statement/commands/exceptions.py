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


class StatementSlugExistsValidationError(ValidationError):
    """
    Marshmallow validation error for Statement slug already exists
    """

    def __init__(self) -> None:
        super().__init__([_("Must be unique")], field_name="slug")


class StatementInvalidError(CommandInvalidError):
    message = _("Statement parameters are invalid.")


class StatementNotFoundError(ObjectNotFoundError):
    def __init__(
        self, Statement_id: Optional[str] = None, exception: Optional[Exception] = None
    ) -> None:
        super().__init__("Statement", Statement_id, exception)


class StatementCreateFailedError(CreateFailedError):
    message = _("Statements could not be created.")


class StatementUpdateFailedError(UpdateFailedError):
    message = _("Statement could not be updated.")


class StatementDeleteFailedError(DeleteFailedError):
    message = _("Statement could not be deleted.")


class StatementDeleteFailedReportsExistError(StatementDeleteFailedError):
    message = _("There are associated alerts or reports")


class StatementForbiddenError(ForbiddenError):
    message = _("Changing this Statement is forbidden")


class StatementImportError(ImportFailedError):
    message = _("Import Statement failed for an unknown reason")


class StatementAccessDeniedError(ForbiddenError):
    message = _("You don't have access to this Statement.")
