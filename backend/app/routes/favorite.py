from app.auth.auth_bearer import JWTBearer
from app.auth.auth_handler import decode_jwt
from fastapi import APIRouter, Depends, HTTPException, status
from app.database import add_favorite, delete_favorite, retrieve_favorites
from app.schemas.favorite import FavoriteCreate, ResponseModel, ErrorResponseModel

router = APIRouter()

@router.post("", response_description="Favorite data added into the database")
async def add_favorite_data(favorite: FavoriteCreate, token: str = Depends(JWTBearer())):
    favorite = favorite.dict()
    favorite["user_id"] = token
    new_favorite = await add_favorite(favorite)
    if new_favorite == None:
        return ErrorResponseModel("An error occurred.", 404, "Favorite not created")
    return ResponseModel(new_favorite, "Favorite added successfully.")

@router.get("", response_description="Favorite data retrieved", dependencies=[Depends(JWTBearer())])
async def get_favorites(token: str = Depends(JWTBearer())):
    decoded_token = decode_jwt(token)
    favorites = await retrieve_favorites(decoded_token["user_id"])
    if not favorites:
        return ResponseModel([], "No favorites found")
    return ResponseModel(favorites, "Favorites retrieved successfully")

@router.delete("/{anime_id}", response_description="Favorite data deleted", dependencies=[Depends(JWTBearer())])
async def delete_favorite_data(anime_id: int, token: str = Depends(JWTBearer())):
    decoded_token = decode_jwt(token)
    deleted_favorite = await delete_favorite(anime_id, decoded_token["user_id"])
    if deleted_favorite:
        return ResponseModel(deleted_favorite, "Favorite deleted successfully")
    return ErrorResponseModel("An error occurred", 404, "Favorite not found")
