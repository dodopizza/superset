# DODO added #32839638

import enum
from marshmallow import fields, Schema

from superset.tags.models import TagTypes


class CustomDodoRoles(enum.Enum):
    Use_data = "Use data"
    Analyze_Data = "Analyze data"
    Create_Data = "Create data"
    Input_Data = "Input data"


class UserSchema(Schema):
    id = fields.Int()
    username = fields.String()
    first_name = fields.String()
    last_name = fields.String()
    email = fields.String()
    last_login = fields.DateTime()
    created_on = fields.DateTime()
    login_count = fields.Int()


class RolesSchema(Schema):
    id = fields.Int()
    name = fields.String()


class TagSchema(Schema):
    id = fields.Int()
    name = fields.String()
    type = fields.Enum(TagTypes, by_value=True)


class TeamGetSchema(Schema):
    id = fields.Int()
    name = fields.String()
    isExternal = fields.Boolean()
    tag = fields.Nested(TagSchema)
    roles = fields.List(fields.Nested(RolesSchema))
    participants = fields.List(fields.Nested(UserSchema()))


class TeamGetResponseSchema(Schema):
    result = fields.List(fields.Nested(TeamGetSchema))


class TeamPostSchema(Schema):
    isExternal = fields.Boolean()
    name = fields.String()
    slug = fields.String()
    roles = fields.List(fields.String(validate=CustomDodoRoles))
