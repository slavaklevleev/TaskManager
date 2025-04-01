from sqlalchemy import Column, Integer, String, ForeignKey, Date
from sqlalchemy.orm import relationship
from app.db.base_class import Base

from sqlalchemy import Column, Integer, String, Enum, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base_class import Base
import enum

class ProjectPriority(str, enum.Enum):
    low = "low"
    high = "high"
    completed = "completed"

class ProjectBoard(str, enum.Enum):
    todo = "todo"
    in_progress = "in_progress"
    completed = "completed"

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    priority = Column(Enum(ProjectPriority), default=ProjectPriority.low)
    due_date = Column(Date, nullable=True)
    complete_date = Column(Date, nullable=True)
    board = Column(Enum(ProjectBoard), default=ProjectBoard.todo)

    comments = relationship("ProjectComment", back_populates="project", lazy="selectin")
    files = relationship("ProjectFile", back_populates="project", lazy="selectin")