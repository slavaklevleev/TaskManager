from pydantic import BaseModel
from datetime import date
from typing import Optional

class HabitLogToggle(BaseModel):
    date: Optional[date] # Если нет даты, использовать текущую

class HabitLogRead(BaseModel):
    id: int
    date: date
    completed: bool

    class Config:
        from_attributes = True