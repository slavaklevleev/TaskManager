from pydantic import BaseModel
from typing import Optional
import datetime

class TaskCreate(BaseModel):
    title: str
    due_date: datetime.date

class TaskRead(BaseModel):
    id: int
    title: str
    status: bool
    due_date: Optional[datetime.date] = None

    class Config:
        from_attributes = True
        
class TaskUpdate(BaseModel):
    title: Optional[str] = None
    status: Optional[bool] = None
    due_date: Optional[datetime.date] = None

    class Config:
        from_attributes = True