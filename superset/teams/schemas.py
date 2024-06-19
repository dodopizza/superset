# DODO added #32839638

from marshmallow import fields, Schema

from superset.tags.models import TagTypes


class UserSchema(Schema):
    id = fields.Int()
    username = fields.String()
    first_name = fields.String()
    last_name = fields.String()


class RolesSchema(Schema):
    id = fields.Int()
    name = fields.String()


class TagSchema(Schema):
    id = fields.Int()
    name = fields.String()
    type = fields.Enum(TagTypes, by_value=True)


class TeamGetResponseSchema(Schema):
    class TeamSchema(Schema):
        id = fields.Int()
        name = fields.String()
        isExternal = fields.Boolean()
        tag = fields.Nested(TagSchema)
        roles = fields.List(fields.Nested(RolesSchema))
        participants = fields.List(fields.Nested(UserSchema(exclude=(["username"]))))

    result = fields.List(fields.Nested(TeamSchema))


class TeamGetSchema(Schema):
    isExternal = fields.Boolean()
    query = fields.String()
