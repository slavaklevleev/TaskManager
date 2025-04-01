from sqlalchemy import Column, Integer, String, ForeignKey
from app.db.base_class import Base

class Tag(Base):
    __tablename__ = "tags"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String, nullable=False)
    color = Column(String, nullable=True)