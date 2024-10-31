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


def ResponseModel(data, message):
    return {
        "data": data,
        "code": 200,
        "message": message,
    }
    
def ErrorResponseModel(error, code, message):
    return {"error": error, "code": code, "message": message}