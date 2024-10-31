from typing import List, Optional, Union
from pydantic import BaseModel, Field
from datetime import datetime

class CommentBase(BaseModel):
    content: str = Field(..., max_length=500)
    user_id: str
    username: str
    anime_id: int

class CommentCreate(CommentBase):
    pass

class CommentUpdate(BaseModel):
    content: Optional[str] = Field(None, max_length=500)

class CommentInDB(CommentBase):
    created_at: datetime
    id: str

    class Config:
        orm_mode: True

class ResponseModel(BaseModel):
    data: Optional[Union[CommentInDB, List[CommentInDB]]] = None
    message: str
    
class ErrorResponseModel(BaseModel):
    message: str
    code: int
    detail: Optional[str] = None
