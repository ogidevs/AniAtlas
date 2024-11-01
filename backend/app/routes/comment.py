from fastapi import APIRouter, Depends, Request
from fastapi.encoders import jsonable_encoder

from app.limiter import limiter
from app.auth.auth_handler import decode_jwt
from app.auth.auth_bearer import JWTBearer
from app.schemas.comment import CommentCreate, ResponseModel, ErrorResponseModel
from app.database import add_comment, retrieve_comments, delete_comment as delete_comment

from datetime import datetime

router = APIRouter()

@router.post("", dependencies=[Depends(JWTBearer())])
@limiter.limit("10/minute")
async def create_new_comment(request: Request, comment: CommentCreate):
    # Validate comment data
    comment_data = jsonable_encoder(comment)
    if len(comment_data['content']) < 10:
        return ErrorResponseModel(message="An error occurred", code=404, detail="Comment not created, invalid data, make sure the content is at least 10 characters long")

    comment_data["created_at"] = datetime.now()
    db_comment = await add_comment(comment_data)
    if db_comment is None:
        return ErrorResponseModel(message="An error occurred", code=404, detail="Comment not created")

    return ResponseModel(data=db_comment, message="Comment created successfully")

@router.get("", dependencies=[Depends(JWTBearer())])
async def read_comments(anime_id: int, skip: int = 0, limit: int = 10):
    comments = await retrieve_comments(anime_id=anime_id, skip=skip, limit=limit)
    if not comments:
        return ResponseModel(data=[], message="No comments found")
    return ResponseModel(data=comments, message="Comments retrieved successfully")


@router.delete("/{comment_id}", dependencies=[Depends(JWTBearer())])
async def delete_comment_r(comment_id: str, token: str = Depends(JWTBearer())):
    decoded_token = decode_jwt(token)
    if decoded_token["user_id"] is None:
        return ErrorResponseModel("An error occurred", 404, "User not authenticated")
    db_comment = await delete_comment(id=comment_id, user_id=decoded_token["user_id"])
    if db_comment is None:
        return ErrorResponseModel(message="An error occurred", code=404, detail="Comment not deleted")
    return ResponseModel(data=db_comment, message="Comment deleted successfully")