from pydantic import BaseModel
from typing import Optional

class UserCreate(BaseModel):
    email: str
    password: str
    name: Optional[str] = None
    avatar_url: Optional[str] = None

class UserRead(BaseModel):
    id: int
    email: str
    name: Optional[str]
    avatar_url: Optional[str]

    class Config:
        from_attributes = True