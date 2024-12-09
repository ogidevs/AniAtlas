from typing import Optional, List, Union
import datetime

from pydantic import BaseModel, EmailStr, Field

class UserRegister(BaseModel):
    username: str = Field(..., max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=8)

class UserLogin(BaseModel):
    username: str = Field(..., max_length=50)
    password: str = Field(..., min_length=8)
    
class UpdateUserModel(BaseModel):
    password: Optional[str]

class UserInDBBase(BaseModel):
    id: str
    username: str
    token: Optional[str] = None
    email: EmailStr
    admin: bool
    disabled: bool
    created_at: datetime.datetime
    
    class Config:
        from_attributes = True

class ResponseModel(BaseModel):
    data: Optional[Union[UserInDBBase, List[UserInDBBase]]] = None
    code: int = 200
    message: str
    
class ErrorResponseModel(BaseModel):
    error: str
    code: int
    message: str