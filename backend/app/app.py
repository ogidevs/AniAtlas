# app/app.py

from fastapi import FastAPI
from starlette.responses import FileResponse
from app.routes.user import router as UserRouter
from app.routes.comment import router as CommentRouter
from fastapi.staticfiles import StaticFiles
import os
app = FastAPI()
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