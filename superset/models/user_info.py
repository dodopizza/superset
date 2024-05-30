from sqlalchemy import Column, String, ForeignKey, Integer
from flask_appbuilder import Model

from superset import db
from superset.utils.core import get_user_id


class UserInfo(Model):  # pylint: disable=too-few-public-methods

    """Extra info about user"""

    __tablename__ = "user_info"

    id = Column(Integer, primary_key=True)
    # isOnboardingFinished = Column(Boolean, default=False)
    # onboardingStartedTime = Column(DateTime, nullable=True)
    language = Column(String(32), default="ru")
    user_id = Column(Integer, ForeignKey("ab_user.id"))
