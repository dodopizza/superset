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


class OnboardingSlugExistsValidationError(ValidationError):
    """
    Marshmallow validation error for Onboarding slug already exists
    """

    def __init__(self) -> None:
        super().__init__([_("Must be unique")], field_name="slug")


class OnboardingInvalidError(CommandInvalidError):
    message = _("Onboarding parameters are invalid.")


class OnboardingNotFoundError(ObjectNotFoundError):
    def __init__(
        self, Onboarding_id: Optional[str] = None, exception: Optional[Exception] = None
    ) -> None:
        super().__init__("Onboarding", Onboarding_id, exception)


class OnboardingCreateFailedError(CreateFailedError):
    message = _("Onboardings could not be created.")


class OnboardingUpdateFailedError(UpdateFailedError):
    message = _("Onboarding could not be updated.")


class OnboardingDeleteFailedError(DeleteFailedError):
    message = _("Onboarding could not be deleted.")


class OnboardingDeleteFailedReportsExistError(OnboardingDeleteFailedError):
    message = _("There are associated alerts or reports")


class OnboardingForbiddenError(ForbiddenError):
    message = _("Changing this Onboarding is forbidden")


class OnboardingImportError(ImportFailedError):
    message = _("Import Onboarding failed for an unknown reason")


class OnboardingAccessDeniedError(ForbiddenError):
    message = _("You don't have access to this Onboarding.")
