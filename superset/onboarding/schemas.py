# DODO added #32839641
import json
import re
from typing import Any, Union

from marshmallow import fields, post_load, pre_load, Schema
from marshmallow.validate import Length, ValidationError

from superset.exceptions import SupersetException
from superset.tags.models import TagTypes
from superset.utils import core as utils

get_delete_ids_schema = {"type": "array", "items": {"type": "integer"}}
get_export_ids_schema = {"type": "array", "items": {"type": "integer"}}
get_fav_star_ids_schema = {"type": "array", "items": {"type": "integer"}}
thumbnail_query_schema = {
    "type": "object",
    "properties": {"force": {"type": "boolean"}},
}

dashboard_title_description = "A title for the dashboard."
slug_description = "Unique identifying part for the web address of the dashboard."
owners_description = (
    "Owner are users ids allowed to delete or change this dashboard. "
    "If left empty you will be one of the owners of the dashboard."
)
roles_description = (
    "Roles is a list which defines access to the dashboard. "
    "These roles are always applied in addition to restrictions on dataset "
    "level access. "
    "If no roles defined then the dashboard is available to all roles."
)
position_json_description = (
    "This json object describes the positioning of the widgets "
    "in the dashboard. It is dynamically generated when "
    "adjusting the widgets size and positions by using "
    "drag & drop in the dashboard view"
)
css_description = "Override CSS for the dashboard."
json_metadata_description = (
    "This JSON object is generated dynamically when clicking "
    "the save or overwrite button in the dashboard view. "
    "It is exposed here for reference and for power users who may want to alter "
    " specific parameters."
)
published_description = (
    "Determines whether or not this dashboard is visible in "
    "the list of all dashboards."
)
charts_description = (
    "The names of the dashboard's charts. Names are used for legacy reasons."
)
certified_by_description = "Person or group that has certified this dashboard"
certification_details_description = "Details of the certification"

openapi_spec_methods_override = {
    "get": {"get": {"description": "Get a dashboard detail information."}},
    "get_list": {
        "get": {
            "description": "Get a list of dashboards, use Rison or JSON query "
            "parameters for filtering, sorting, pagination and "
            " for selecting specific columns and metadata.",
        }
    },
    "info": {
        "get": {
            "description": "Several metadata information about dashboard API "
            "endpoints.",
        }
    },
    "related": {
        "get": {"description": "Get a list of all possible owners for a dashboard."}
    },
}


class UserSchema(Schema):
    id = fields.Int()
    username = fields.String()
    first_name = fields.String()
    last_name = fields.String()


class RolesSchema(Schema):
    id = fields.Int()
    name = fields.String()


# class TagSchema(Schema):
#     id = fields.Int()
#     name = fields.String()
#     type = fields.Enum(TagTypes, by_value=True)


class OnboardingGetResponseSchema(Schema):
    id = fields.Int()
    slug = fields.String()
    url = fields.String()
    dashboard_title = fields.String(
        metadata={"description": dashboard_title_description}
    )
    thumbnail_url = fields.String()
    published = fields.Boolean()
    css = fields.String(metadata={"description": css_description})
    json_metadata = fields.String(metadata={"description": json_metadata_description})
    position_json = fields.String(metadata={"description": position_json_description})
    certified_by = fields.String(metadata={"description": certified_by_description})
    certification_details = fields.String(
        metadata={"description": certification_details_description}
    )
    changed_by_name = fields.String()
    changed_by = fields.Nested(UserSchema(exclude=(["username"])))
    changed_on = fields.DateTime()
    charts = fields.List(fields.String(metadata={"description": charts_description}))
    owners = fields.List(fields.Nested(UserSchema(exclude=(["username"]))))
    roles = fields.List(fields.Nested(RolesSchema))
    tags = fields.Nested(TagSchema, many=True)
    changed_on_humanized = fields.String(data_key="changed_on_delta_humanized")
    is_managed_externally = fields.Boolean(allow_none=True, dump_default=False)
    dashboard_title_RU = fields.String(description=dashboard_title_description)


class OnboardingPostSchema(Schema):
    dashboard_title = fields.String(
        metadata={"description": dashboard_title_description},
        allow_none=True,
        validate=Length(0, 500),
    )
    slug = fields.String(
        metadata={"description": slug_description},
        allow_none=True,
        validate=[Length(1, 255)],
    )
    owners = fields.List(fields.Integer(metadata={"description": owners_description}))
    roles = fields.List(fields.Integer(metadata={"description": roles_description}))
    position_json = fields.String(
        metadata={"description": position_json_description}, validate=validate_json
    )
    css = fields.String(metadata={"description": css_description})
    json_metadata = fields.String(
        metadata={"description": json_metadata_description},
        validate=validate_json_metadata,
    )
    published = fields.Boolean(metadata={"description": published_description})
    certified_by = fields.String(
        metadata={"description": certified_by_description}, allow_none=True
    )
    certification_details = fields.String(
        metadata={"description": certification_details_description}, allow_none=True
    )
    is_managed_externally = fields.Boolean(allow_none=True, dump_default=False)
    external_url = fields.String(allow_none=True)


class OnboardingPutSchema(Schema):
    dashboard_title = fields.String(
        metadata={"description": dashboard_title_description},
        allow_none=True,
        validate=Length(0, 500),
    )
    slug = fields.String(
        metadata={"description": slug_description},
        allow_none=True,
        validate=Length(0, 255),
    )
    owners = fields.List(
        fields.Integer(metadata={"description": owners_description}, allow_none=True)
    )
    roles = fields.List(
        fields.Integer(metadata={"description": roles_description}, allow_none=True)
    )
    position_json = fields.String(
        metadata={"description": position_json_description},
        allow_none=True,
        validate=validate_json,
    )
    css = fields.String(metadata={"description": css_description}, allow_none=True)
    json_metadata = fields.String(
        metadata={"description": json_metadata_description},
        allow_none=True,
        validate=validate_json_metadata,
    )
    published = fields.Boolean(
        metadata={"description": published_description}, allow_none=True
    )
    certified_by = fields.String(
        metadata={"description": certified_by_description}, allow_none=True
    )
    certification_details = fields.String(
        metadata={"description": certification_details_description}, allow_none=True
    )
    is_managed_externally = fields.Boolean(allow_none=True, dump_default=False)
    external_url = fields.String(allow_none=True)
    dashboard_title_RU = fields.String(description=dashboard_title_description)
