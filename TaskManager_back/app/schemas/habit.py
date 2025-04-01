from pydantic import BaseModel
from typing import Optional, Dict, List
from app.schemas.habit_log import HabitLogRead

class HabitCreate(BaseModel):
    title: str
    color: Optional[str] = None
    frequency: Dict[str, bool]

class HabitRead(BaseModel):
    id: int
    title: str
    color: Optional[str]
    frequency: Dict[str, bool]
    recent_logs: List[HabitLogRead] = []  # Добавлены последние 10 логов
    streak: int = 0

    class Config:
        from_attributes = True
        
class HabitUpdate(BaseModel):
    title: Optional[str] = None
    color: Optional[str] = None
    frequency: Optional[Dict[str, bool]] = None