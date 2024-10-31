from app.auth.auth_handler import decode_jwt, sign_jwt
from fastapi import APIRouter, Body, Depends
from fastapi.encoders import jsonable_encoder
from app.auth.auth_bearer import JWTBearer

from app.database import (
    add_user,
    delete_user,
    retrieve_user,
    retrieve_user_by_username,
    update_user,
)

from app.models.user import (
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
        return ErrorResponseModel("An error occurred.", 404, "User with this email or username already exists.")
    token = sign_jwt(new_user["id"])
    new_user["token"] = token["access_token"]
    return ResponseModel(new_user, "User added successfully.")

@router.post("/signin", response_description="User data retrieved")
async def user_login(user: UserLogin = Body(...)):
    user = jsonable_encoder(user)
    user_data = await retrieve_user_by_username(user["username"])
    if user_data:
        if check_password(user_data["password"], user["password"]):
            token = sign_jwt(user_data["id"])
            user_data["token"] = token["access_token"]
            return ResponseModel(user_data, "User logged in successfully.")
    return ErrorResponseModel("An error occurred.", 404, "Incorrect username or password.")

@router.get("/verify", response_description="Token verified", dependencies=[Depends(JWTBearer())])
async def verify_token():
    return ResponseModel(True, "Token is valid")


@router.post("/token/refresh", response_description="Token refreshed", dependencies=[Depends(JWTBearer())])
async def refresh_token(token: str = Depends(JWTBearer())):
    decoded_token = decode_jwt(token)
    new_token = sign_jwt(decoded_token['user_id'])
    return ResponseModel({"access_token": new_token["access_token"]}, "Token refreshed successfully.")

@router.get("/me", response_description="User data retrieved", dependencies=[Depends(JWTBearer())])
async def get_user_data(token: str = Depends(JWTBearer())):
    decoded_token = decode_jwt(token)
    user = await retrieve_user(decoded_token['user_id'])
    user["token"] = token
    if user:
        return ResponseModel(user, "User data retrieved successfully")
    return ErrorResponseModel("An error occurred.", 404, "User doesn't exist.")

@router.put("/{id}", response_description="User data updated", dependencies=[Depends(JWTBearer())])
async def update_user_data(id: str, req: UpdateUserModel = Body(...), token: str = Depends(JWTBearer())):
    req = {k: v for k, v in req.dict().items() if v is not None}
    hashed_password = hash_password(req["password"])
    req["password"] = hashed_password
    updated_user = await update_user(id, req)
    updated_user["token"] = token
    if updated_user == None:
        return ErrorResponseModel("An error occurred.", 404, "User with this email already exists.")
    if updated_user:
        return ResponseModel(
            "User with ID: {} name update is successful".format(id),
            "User name updated successfully",
        )
    return ErrorResponseModel(
        "An error occurred",
        404,
        "There was an error updating the user data.",
    )
    
@router.delete("/{id}", response_description="User data deleted from the database", dependencies=[Depends(JWTBearer())])
async def delete_user_data(id: str):
    deleted_user = await delete_user(id)
    if deleted_user:
        return ResponseModel(
            "User with ID: {} removed".format(id), "User deleted successfully"
        )
    return ErrorResponseModel(
        "An error occurred", 404, "User with id {0} doesn't exist".format(id)
    )