from pydantic import BaseModel
from datetime import date, time
from typing import Optional

class EventCreate(BaseModel):
    title: str
    date: date
    start_time: time
    end_time: time
    comment: Optional[str] = None
    color: Optional[str] = None

class EventUpdate(BaseModel):
    title: Optional[str] = None
    date: Optional[date] = None
    start_time: Optional[time] = None
    end_time: Optional[time] = None
    comment: Optional[str] = None
    color: Optional[str] = None

class EventRead(EventCreate):
    id: int

    class Config:
        from_attributes = True