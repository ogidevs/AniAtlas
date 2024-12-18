from app.auth.auth_handler import decode_jwt, sign_jwt
from fastapi import APIRouter, Body, Depends
from fastapi.responses import JSONResponse
from typing import List
from fastapi.encoders import jsonable_encoder
from app.auth.auth_bearer import JWTBearer

from app.database import (
    add_user,
    delete_user,
    retrieve_user,
    retrieve_user_by_username,
    retrieve_all_users,
    update_user,
)

from app.schemas.user import (
    ErrorResponseModel,
    ResponseModel,
    UpdateUserModel,
    UserRegister,
    UserLogin
)

from app.utils.hashing import hash_password, check_password

router = APIRouter()

@router.post("/signup", response_description="User data added into the database")
async def user_register(user: UserRegister = Body(...)):
    hashed_password = hash_password(user.password)
    user.password = hashed_password
    user = jsonable_encoder(user)
    new_user = await add_user(user)
    if new_user == None:
        return ErrorResponseModel(error="An error occurred.", code=404, message="User with this email or username already exists.")
    token = sign_jwt(new_user["id"])
    new_user["token"] = token["access_token"]
    return ResponseModel(data=new_user, message="User added successfully.")

@router.post("/signin", response_description="User data retrieved")
async def user_login(user: UserLogin = Body(...)):
    user = jsonable_encoder(user)
    user_data = await retrieve_user_by_username(user["username"])
    if user_data:
        if check_password(user_data["password"], user["password"]):
            token = sign_jwt(user_data["id"])
            user_data["token"] = token["access_token"]
            return ResponseModel(data=user_data, message="User logged in successfully.")
    return ErrorResponseModel(error="An error occurred.", code=404, message="Incorrect username or password.")

@router.get("/verify", response_description="Token verified", dependencies=[Depends(JWTBearer())])
async def verify_token():
    return dict(data=True, message="Token is valid")


@router.post("/token/refresh", response_description="Token refreshed", dependencies=[Depends(JWTBearer())])
async def refresh_token(token: str = Depends(JWTBearer())):
    decoded_token = decode_jwt(token)
    new_token = sign_jwt(decoded_token['user_id'])
    return ResponseModel({"access_token": new_token["access_token"]}, "Token refreshed successfully.")

@router.get("/me", response_description="User data retrieved", dependencies=[Depends(JWTBearer())])
async def get_user_data(token: str = Depends(JWTBearer())):
    decoded_token = decode_jwt(token)
    user = await retrieve_user(decoded_token['user_id'])
    if user == None:
        return ErrorResponseModel(error="An error occurred.", code=404, message="User doesn't exist.")
    user["token"] = token
    return ResponseModel(data=user, message="User data retrieved successfully")

@router.get("/all", response_description="Users data retrieved", dependencies=[Depends(JWTBearer())])
async def get_users(token: str = Depends(JWTBearer())):
    decoded_token = decode_jwt(token)
    user = await retrieve_user(decoded_token['user_id'])
    if user == None:
        return ErrorResponseModel(error="An error occurred.", code=404, message="User doesn't exist.")
    if not user["admin"]:
        return ErrorResponseModel(error="An error occurred.", code=403, message="You are not an admin.")
    users = await retrieve_all_users()
    return ResponseModel(data=users, message="Users data retrieved successfully")


@router.put("/{id}/disable", response_description="User disabled", dependencies=[Depends(JWTBearer())])
async def disable_user(id: str, token: str = Depends(JWTBearer())):
    decoded_token = decode_jwt(token)
    user = await retrieve_user(decoded_token['user_id'])
    if user == None:
        return ErrorResponseModel(error="An error occurred.", code=404, message="User doesn't exist.")
    if not user["admin"]:
        return ErrorResponseModel(error="An error occurred.", code=403, message="You are not an admin.")
    user = await retrieve_user(id)
    if user == None:
        return ErrorResponseModel(error="An error occurred.", code=404, message="User doesn't exist.")
    success = await update_user(id, {"disabled": True})
    if success:
        return JSONResponse(content={"message": "User disabled successfully."})
    return ErrorResponseModel(error="An error occurred.", code=404, message="An error occurred.")

@router.put("/{id}/enable", response_description="User enabled", dependencies=[Depends(JWTBearer())])
async def enable_user(id: str, token: str = Depends(JWTBearer())):
    decoded_token = decode_jwt(token)
    user = await retrieve_user(decoded_token['user_id'])
    if user == None:
        return ErrorResponseModel(error="An error occurred.", code=404, message="User doesn't exist.")
    if not user["admin"]:
        return ErrorResponseModel(error="An error occurred.", code=403, message="You are not an admin.")
    user = await retrieve_user(id)
    if user == None:
        return ErrorResponseModel(error="An error occurred.", code=404, message="User doesn't exist.")
    success = await update_user(id, {"disabled": False})
    if success:
        return JSONResponse(content={"message": "User disabled successfully."})
    return ErrorResponseModel(error="An error occurred.", code=404, message="An error occurred.")

@router.put("/{id}", response_description="User data updated", dependencies=[Depends(JWTBearer())])
async def update_user_data(id: str, req: UpdateUserModel = Body(...), token: str = Depends(JWTBearer())):
    req = {k: v for k, v in req.dict().items() if v is not None}
    hashed_password = hash_password(req["password"])
    req["password"] = hashed_password
    updated_user = await update_user(id, req)
    if updated_user == None:
        return ErrorResponseModel(error="An error occurred.", code=404, message="User with this email already exists.")
    updated_user["token"] = token
    return ResponseModel(
        data=updated_user,
        message="User name updated successfully",
    )
    
@router.delete("/{id}", response_description="User data deleted from the database", dependencies=[Depends(JWTBearer())])
async def delete_user_data(id: str):
    deleted_user = await delete_user(id)
    if deleted_user:
        return ResponseModel(
            data="User with ID: {} removed".format(id), message="User deleted successfully"
        )
    return ErrorResponseModel(
        error="An error occurred", code=404, message="User with id {0} doesn't exist".format(id)
    )