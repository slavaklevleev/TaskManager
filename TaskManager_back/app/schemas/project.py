from pydantic import BaseModel
from typing import Optional, List
from app.schemas.project_comment import ProjectCommentRead
from app.schemas.project_file import ProjectFileRead
import datetime
import enum

class ProjectPriority(str, enum.Enum):
    low = "low"
    high = "high"
    completed = "completed"

class ProjectBoard(str, enum.Enum):
    todo = "todo"
    in_progress = "in_progress"
    completed = "completed"

class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None
    priority: ProjectPriority = ProjectPriority.low
    due_date: Optional[datetime.date] = None
    board: ProjectBoard = ProjectBoard.todo

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[ProjectPriority] = None
    due_date: Optional[datetime.date] = None
    board: Optional[ProjectBoard] = None
    complete_date: Optional[datetime.date] = None

class ProjectRead(BaseModel):
    id: int
    name: str
    description: Optional[str]
    priority: ProjectPriority
    board: ProjectBoard
    comments: List[ProjectCommentRead] = []
    files: List[ProjectFileRead] = []
    due_date: Optional[datetime.date]
    complete_date: Optional[datetime.date]

    class Config:
        from_attributes = True

class ProjectBoardGroupedResponse(BaseModel):
    todo: List[ProjectRead]
    in_progress: List[ProjectRead]
    completed: List[ProjectRead]