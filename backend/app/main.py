from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv

from .routers import users, conversations, chat
from app.database import engine
from fastapi import FastAPI
from app.routers import users
from app.models.user import Base, ContactMethod

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="DevCore AI Assistant Backend",
    description="Backend API for the AI Assistant application",
    version="1.0.0"
)

# Configuración CORS
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(users.router, prefix="/api/v1/users", tags=["users"])
app.include_router(conversations.router, prefix="/api/v1/conversations", tags=["conversations"])
app.include_router(chat.router, prefix="/api/v1/chat", tags=["chat"])

# Archivos estáticos
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
async def root():
    return {"message": "🚀 Backend de Lox AI Assistant funcionando correctamente", "version": "1.0.0", "status": "active"}

@app.get("/favicon.ico")
async def favicon():
    return {"message": "No favicon configured"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "DevCore AI Assistant Backend"}

@app.get("/api/v1/contact-methods", tags=["users"])
async def get_contact_methods():
    return [method.value for method in ContactMethod]
