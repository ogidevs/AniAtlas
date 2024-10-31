# app/app.py

from fastapi import FastAPI
from starlette.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi.responses import JSONResponse

from app.routes.user import router as UserRouter
from app.routes.comment import router as CommentRouter
from app.limiter import limiter

import os

app = FastAPI()
app.state.limiter = limiter
app.include_router(UserRouter, tags=["User"], prefix="/user")
app.include_router(CommentRouter, tags=["Comment"], prefix="/comment")
app.mount("/client/", StaticFiles(directory="../client/dist", html=True), name="static")

@app.get("/{full_path:path}")
async def serve_react_app(full_path: str):
    file_path = os.path.join("dist", full_path)
    
    # Check if the path is a file in the dist directory
    if os.path.exists(file_path) and not os.path.isdir(file_path):
        # Serve the requested file (JS, CSS, etc.)
        return FileResponse(file_path)
    else:
        # Fallback to index.html for client-side routes
        return FileResponse(os.path.join("../client/dist", "index.html")) 
    
# Exception handler for rate limit exceeded errors
@app.exception_handler(RateLimitExceeded)
async def rate_limit_exceeded_handler(request, exc):
    return JSONResponse(
        content={"message": "Rate limit exceeded"},
        status_code=429,
    )