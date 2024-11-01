from typing import Optional

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
    token: str
    email: EmailStr
    
    class Config:
        orm_mode = True

class ResponseModel(BaseModel):
    data: Optional[UserInDBBase] = None
    code: int = 200
    message: str
    
class ErrorResponseModel(BaseModel):
    error: str
    code: int
    message: str