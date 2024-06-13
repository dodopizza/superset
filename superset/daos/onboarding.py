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
from superset.models.user_info import UserInfo

logger = logging.getLogger(__name__)


class OnboardingDAO(BaseDAO[UserInfo]):
    # base_filter = DashboardAccessFilter

    @classmethod
    def get_by_user_id(cls, user_id: int) -> UserInfo:
        try:
            query = (
                db.session.query(UserInfo).filter(UserInfo.user_id == user_id)
            )
            user_info = query.one_or_none()
            if not user_info:
                raise OnboardingNotFoundError()
        except AttributeError as e:
            raise OnboardingNotFoundError()
        return user_info


