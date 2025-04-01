from pydantic import BaseModel

class ProjectCommentCreate(BaseModel):
    content: str

class ProjectCommentRead(BaseModel):
    id: int
    content: str

    class Config:
        from_attributes = True