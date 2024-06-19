# DODO added #33835937

from sqlalchemy import Column, String, ForeignKey, Integer, Boolean, DateTime
from flask_appbuilder import Model


class UserInfo(Model):

    """Extra info about user"""

    __tablename__ = "user_info"

    id = Column(Integer, primary_key=True)
    isOnboardingFinished = Column(Boolean, default=False)  # DODO added #32839638
    onboardingStartedTime = Column(DateTime, nullable=True)  # DODO added #32839638
    language = Column(String(32), default="ru")
    user_id = Column(Integer, ForeignKey("ab_user.id"))
    dodo_role = Column(String(32), nullable=True)

