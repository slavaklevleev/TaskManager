from pydantic import BaseModel
from typing import Optional

class NoteCreate(BaseModel):
    title: str
    content: str
    color: Optional[str] = None
    pinned: Optional[bool] = False

class NoteRead(BaseModel):
    id: int
    title: str
    content: str
    color: Optional[str]
    pinned: bool

    class Config:
        from_attributes = True

class NoteUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    color: Optional[str] = None
    pinned: Optional[bool] = False