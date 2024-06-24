# DODO was here
from typing import Any, Optional

from flask import g
from flask_appbuilder.security.sqla.models import Role
from flask_babel import lazy_gettext as _
from sqlalchemy import and_, or_
from sqlalchemy.orm.query import Query

from superset import db, is_feature_enabled, security_manager
from superset.connectors.sqla.models import SqlaTable
from superset.models.core import Database
from superset.models.statement import Statement
from superset.models.embedded_dashboard import EmbeddedDashboard
from superset.models.slice import Slice
from superset.security.guest_token import GuestTokenResourceType, GuestUser
from superset.utils.core import get_user_id
from superset.utils.filters import get_dataset_access_filters
from superset.views.base import BaseFilter
from superset.views.base_api import BaseFavoriteFilter, BaseTagFilter


class StatementFinishedFilter(BaseFilter):
    name = _("finished")
    arg_name = "eq"

    def apply(self, query: Query, value: Any) -> Query:
        if not value == 0:
            if not value:
                return query
        is_finished = bool(int(value))
        return query.filter(
                Statement.finished.is_(is_finished))


class StatementIDFilter(BaseFilter):  # pylint: disable=too-few-public-methods
    name = _("id")
    arg_name = "eq"

    def apply(self, query: Query, value: Any) -> Query:
        return query.filter(
            Statement.id == int(value)
        )


class StatementUserFirstNameFilter(BaseFilter):
    name = _("first_name")
    arg_name = "ct"

    def apply(self, query: Query, value: Any) -> Query:
        return query.filter(
            Statement.user.first_name.ilike(value)
        )
