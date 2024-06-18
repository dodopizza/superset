# DODO added #32839641
from datetime import datetime

from sqlalchemy import (
    Column,
    ForeignKey,
    Integer,
    Boolean,
    String,
    DateTime,
    Table,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship
from flask_appbuilder import Model
from flask_appbuilder.security.sqla.models import User

from superset import security_manager


# metadata = Model.metadata  # pylint: disable=no-member
#
#
# TeamRoles = Table(
#     "team_roles",
#     metadata,
#     Column("id", Integer, primary_key=True),
#     Column(
#         "team_id",
#         Integer,
#         ForeignKey("teams.id", ondelete="CASCADE"),
#         nullable=False,
#     ),
#     Column(
#         "role_id",
#         Integer,
#         ForeignKey("ab_role.id", ondelete="CASCADE"),
#         nullable=False,
#     ),
# )


class Statement(Model):

    """Dodo teams for Superset"""

    __tablename__ = "statements"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("ab_user.id"))
    finished = Column(Boolean, default=False)
    team_id = Column(Integer, ForeignKey("teams.id"))
    created_datetime = Column(DateTime)
    last_changed_datetime = Column(DateTime, default=datetime.utcnow())
