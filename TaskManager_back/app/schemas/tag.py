from pydantic import BaseModel
from typing import Optional

class TagCreate(BaseModel):
    name: str
    color: Optional[str] = None

class TagRead(BaseModel):
    id: int
    name: str
    color: Optional[str]

    class Config:
        from_attributes = True