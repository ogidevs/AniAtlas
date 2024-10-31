import motor.motor_asyncio
from bson.objectid import ObjectId

MONGO_DETAILS = "mongodb://localhost:27017"

client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_DETAILS)

database = client.aniatlas

user_collection = database.get_collection("user_collection")
comment_collection = database.get_collection("comment_collection")

# Helper function to convert MongoDB document to Python dictionary
def user_helper(user) -> dict:
    return {
        "id": str(user["_id"]),
        "username": user["username"],
        "password": user["password"],
        "email": user["email"],
    }

def comment_helper(comment) -> dict:
    return {
        "id": str(comment["_id"]),
        "created_at": comment["created_at"],
        "content": comment["content"],
        "user_id": comment["user_id"],
        "username": comment["username"],
        "anime_id": comment["anime_id"],
    }

async def retrieve_users():
    users = []
    async for user in user_collection.find():
        users.append(user_helper(user))
    return users

async def add_user(user_data: dict) -> dict:
    existing_user = await user_collection.find_one(
        {"$or": [{"email": user_data["email"]}, {"username": user_data["username"]}]}
    )
    if existing_user:
        return None
    user = await user_collection.insert_one(user_data)
    new_user = await user_collection.find_one({"_id": user.inserted_id})
    return user_helper(new_user)

async def retrieve_user(id: str) -> dict:
    user = await user_collection.find_one({"_id": ObjectId(id)})
    if user:
        return user_helper(user)
    else:
        return None

async def retrieve_user_by_email(email: str) -> dict:
    user = await user_collection.find_one({"email": email})
    if user:
        return user_helper(user)
    else:
        return None
    
async def retrieve_user_by_username(username: str) -> dict:
    user = await user_collection.find_one({"username": username})
    if user:
        return user_helper(user)
    else:
        return None
    
async def update_user(id: str, data: dict):
    if len(data) < 1:
        return None
    user = await user_collection.find_one({"_id": ObjectId(id)})
    if user:
        updated_user = await user_collection.update_one(
            {"_id": ObjectId(id)}, {"$set": data}
        )
        if updated_user:
            return True
        return None
    
async def delete_user(id: str):
    user = await user_collection.find_one({"_id": ObjectId(id)})
    if user:
        await user_collection.delete_one({"_id": ObjectId(id)})
        return True
    else:
        return None
    
async def add_comment(comment_data: dict) -> dict:
    comment = await comment_collection.insert_one(comment_data)
    new_comment = await comment_collection.find_one({"_id": comment.inserted_id})
    return comment_helper(new_comment)

async def delete_comment(id: str, user_id: str):
    comment = await comment_collection.find_one({"_id": ObjectId(id), "user_id": user_id})
    if comment:
        await comment_collection.delete_one({"_id": ObjectId(id)})
        return comment_helper(comment)
    else:
        return None

async def retrieve_comments(anime_id: int, skip: int, limit: int) -> list[dict]:
    comments = []
    async for comment in comment_collection.find({"anime_id": anime_id}).skip(skip).limit(limit):
        comments.append(comment_helper(comment))
    if not comments or len(comments) == 0:
        return None
    return comments
    