from pydantic import BaseModel

class FavoriteBase(BaseModel):
    user_id: str
    anime_id: int

class FavoriteCreate(FavoriteBase):
    pass

class FavoriteInDBBase(FavoriteBase):
    id: int
    anime_id: int

    class Config:
        orm_mode: True

class ResponseModel(BaseModel):
    data: FavoriteInDBBase
    message: str
    
class ErrorResponseModel(BaseModel):
    message: str
    code: int
    detail: str