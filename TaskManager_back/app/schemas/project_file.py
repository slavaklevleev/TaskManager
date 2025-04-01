from pydantic import BaseModel

class ProjectFileCreate(BaseModel):
    file_path: str

class ProjectFileRead(BaseModel):
    id: int
    file_path: str

    class Config:
        from_attributes = True