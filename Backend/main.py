# main.py
import os
import importlib
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import engine, Base, get_db
import socketio
import uvicorn
import asyncio
from fastapi.staticfiles import StaticFiles
from pathlib import Path

# Cria as tabelas no banco de dados
Base.metadata.create_all(bind=engine)

# Configurações do SocketIO
sio = socketio.AsyncServer(async_mode='asgi', cors_allowed_origins="*")
app = FastAPI()

# Middleware do FastAPI
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Cria a aplicação ASGI combinada para ser o ponto de entrada principal
socket_app = socketio.ASGIApp(sio, other_asgi_app=app)

# Lida com eventos de conexão e desconexão do SocketIO
@sio.on('connect')
async def connect(sid, environ):
    print(f'Conectado: {sid}')

@sio.on('disconnect')
async def disconnect(sid):
    print(f'Desconectado: {sid}')

# Importa os roteadores dinamicamente
ROUTERS_DIR = os.path.join(os.path.dirname(__file__), "rotas")

# O código de inclusão deve estar dentro do loop para cada roteador
for filename in os.listdir(ROUTERS_DIR):
    if filename.endswith(".py") and filename not in ["__init__.py", "__pycache__"]:
        module_name = filename[:-3]
        module_path = f"rotas.{module_name}"
        router_module = importlib.import_module(module_path)
        if hasattr(router_module, "router"):
            router_instance = getattr(router_module, "router")
            app.include_router(router_instance, prefix="/api")

# Define o caminho para a pasta 'dist'
frontend_dist_path = Path(__file__).parent.parent / "FrontEnd" / "dist"

# Diz que servirá um conteúdo estático
app.mount("/", StaticFiles(directory=frontend_dist_path, html=True), name="static")
