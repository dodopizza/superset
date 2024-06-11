# DODO added #32839641
from sqlalchemy import (
    Column,
    ForeignKey,
    Integer,
    Boolean,
    DateTime,
    Table,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship
from flask_appbuilder import Model
from flask_appbuilder.security.sqla.models import User

from superset import security_manager


metadata = Model.metadata  # pylint: disable=no-member


TeamRoles = Table(
    "team_roles",
    metadata,
    Column("id", Integer, primary_key=True),
    Column(
        "team_id",
        Integer,
        ForeignKey("teams.id", ondelete="CASCADE"),
        nullable=False,
    ),
    Column(
        "role_id",
        Integer,
        ForeignKey("ab_role.id", ondelete="CASCADE"),
        nullable=False,
    ),
)


team_users = Table(
    "team_users",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("team_id", Integer, ForeignKey("teams.id", ondelete="CASCADE")),
    Column("user_id", Integer, ForeignKey("ab_user.id", ondelete="CASCADE")),
    UniqueConstraint("team_id", "user_id"),
)


class Team(Model):

    """Dodo teams for Superset"""

    __tablename__ = "teams"

    id = Column(Integer, primary_key=True)
    userFrom = Column(Boolean, default=False)
    tag = Column(DateTime, nullable=True)
    roles = relationship(security_manager.role_model, secondary=TeamRoles)
    participants: list[User] = relationship(
        User, secondary=team_users, backref="dashboards"
    )

