# app/main.py
from fastapi import FastAPI
from app.api import spots, chat
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.include_router(spots.router)
app.include_router(chat.router)

@app.get("/")
def health_check():
    return {"status": "ok"}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)