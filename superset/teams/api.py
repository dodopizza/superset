# DODO added #32839641

import logging
from flask_appbuilder.models.sqla.interface import SQLAInterface

from superset.constants import MODEL_API_RW_METHOD_PERMISSION_MAP, RouteMethod
from superset.teams.schemas import (
    TeamGetResponseSchema,
    TeamGetSchema
)
from superset.teams.filters import TeamNameFilter, TeamExternalFilter
from superset.models.team import Team
from superset.views.base_api import (
    BaseSupersetModelRestApi,
)

logger = logging.getLogger(__name__)


class TeamRestApi(BaseSupersetModelRestApi):
    datamodel = SQLAInterface(Team)

    include_route_methods = RouteMethod.REST_MODEL_VIEW_CRUD_SET
    resource_name = "team"
    allow_browser_login = True

    class_permission_name = "Team"
    method_permission_name = MODEL_API_RW_METHOD_PERMISSION_MAP

    search_filters = {
        "name": [TeamNameFilter],
        "isExternal": [TeamExternalFilter],
    }

    list_columns = [
        "id",
        "name",
        "isExternal",
        "slug",
        "roles.id",
        "roles.name",
        "participants.first_name",
        "participants.last_name",
        "participants.id"
    ]

    get_model_schema = TeamGetSchema()
    team_get_response_schema = TeamGetResponseSchema()
