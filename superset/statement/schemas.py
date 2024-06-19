# DODO added #32839641

from marshmallow import fields, Schema


class StatementGetResponseSchema(Schema):
    id = fields.Int()
    user_id = fields.Int()
    finished = fields.Boolean()
    team_id = fields.Int()
    created_datetime = fields.DateTime()
    last_changed_datetime = fields.DateTime()


class StatementGetSchema(Schema):
    isExternal = fields.Boolean()
    query = fields.String()


class StatementPutSchema(Schema):
    pass


class StatementPostSchema(Schema):
    isNewTeam = fields.Boolean()
    team = fields.String()
    team_slug = fields.String()
    isExternal = fields.Boolean()
    request_roles = fields.List(fields.String)
