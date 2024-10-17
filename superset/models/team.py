# DODO added #32839641
from sqlalchemy import (
    Column,
    ForeignKey,
    Integer,
    Boolean,
    String,
    Table,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship
from flask_appbuilder import Model
from flask_appbuilder.security.sqla.models import User

from superset import security_manager


metadata = Model.metadata

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
    Column("user_id", Integer, ForeignKey("ab_user.id", ondelete="CASCADE"))
)


class Team(Model):
    """Dodo teams for Superset"""

    __tablename__ = "teams"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    isExternal = Column(Boolean, nullable=False)
    slug = Column(String, unique=True)
    roles = relationship(security_manager.role_model, secondary=TeamRoles)
    participants = relationship(
        security_manager.user_model, secondary=team_users, passive_deletes=True,
        backref="teams"
    )
