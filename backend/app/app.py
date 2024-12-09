# app/app.py

from fastapi import FastAPI
from starlette.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

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

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception handler for rate limit exceeded errors
@app.exception_handler(RateLimitExceeded)
async def rate_limit_exceeded_handler(request, exc):
    return JSONResponse(
        content={"message": "Rate limit exceeded"},
        status_code=429,
    )