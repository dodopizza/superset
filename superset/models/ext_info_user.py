from datetime import datetime

from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Integer
from sqlalchemy.orm import relationship
from flask_appbuilder import Model

from superset import db
from superset.extensions import (
    security_manager
)


class ExtInfoUser(Model):  # pylint: disable=too-few-public-methods

    """Extra info about user"""

    __tablename__ = "ext_info_user"

    id = Column(Integer, primary_key=True)
    isOnboardingFinished = Column(Boolean, default=False)
    onboardingStartedTime = Column(DateTime, nullable=True)
    language = Column(String(32), default="ru")
    user_id = Column(Integer, ForeignKey("ab_user.id"))
    user = relationship(
        security_manager.user_model, backref="ext_info_user", foreign_keys=[user_id]
    )

    @property
    def get_language(self):
        return self.language or "ru"

    # @classmethod
    # def get(cls, user_id: int) -> ExtInfoUser:
    #     db.session.get(user_id)
    #     qry = db.session.get(user_id)
    #     return qry.one_or_none()
