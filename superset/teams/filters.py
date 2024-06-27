# DODO added #32839638

from typing import Any
from flask_babel import lazy_gettext as _
from sqlalchemy.orm.query import Query
import logging

from superset.models.team import Team
from superset.views.base import BaseFilter

logger = logging.getLogger(__name__)


class TeamIDFilter(BaseFilter):  # pylint: disable=too-few-public-methods
    name = _("id")
    arg_name = "eq_id_team"

    def apply(self, query: Query, value: Any) -> Query:
        if value:
            return query.filter(
                Team.id == int(value)
            )
        return query


class TeamNameFilter(BaseFilter):
    name = _("Name")
    arg_name = "ct_name"

    def apply(self, query: Query, value: Any) -> Query:
        logger.error(value)
        if not value:
            return query
        ilike_value = f"%{value}%"
        return query.filter(
            Team.name.ilike(ilike_value)
        )


class TeamSlugFilter(BaseFilter):
    name = _("Slug")
    arg_name = "ct_slug"

    def apply(self, query: Query, value: Any) -> Query:
        if not value:
            return query
        ilike_value = f"%{value}%"
        return query.filter(
            Team.slug.ilike(ilike_value)
        )


class TeamExternalFilter(BaseFilter):
    name = _("External")
    arg_name = "eq_external"

    def apply(self, query: Query, value: Any) -> Query:
        if not value == 0:
            if not value:
                return query
        is_external = bool(int(value))
        return query.filter(
                Team.isExternal.is_(is_external))
