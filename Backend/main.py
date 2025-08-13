# main.py
# To install dependences run "pip install -r requirements.txt"

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

# Importa a conexão com o banco de dados
from database import engine, Base, get_db

# Importa os módulos de schemas e crud


# Cria as tabelas no banco de dados
Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos os métodos (GET, POST, etc.)
    allow_headers=["*"],  # Permite todos os headers
)


import os
import importlib

ROUTERS_DIR = os.path.join(os.path.dirname(__file__), "rotas")

# Itera sobre todos os arquivos na pasta 'rotas'
for filename in os.listdir(ROUTERS_DIR):
    # Garante que é um arquivo Python e não é o __init__.py ou __pycache__
    if filename.endswith(".py") and filename not in ["__init__.py", "__pycache__"]:
        # Remove a extensão .py para obter o nome do módulo
        module_name = filename[:-3]
        
        # Constrói o caminho completo do módulo (ex: rotas.lista)
        module_path = f"rotas.{module_name}"
        
        # Importa o módulo dinamicamente
        router_module = importlib.import_module(module_path)
        
        # Verifica se o módulo tem uma instância de APIRouter chamada 'router'
        if hasattr(router_module, "router"):
            router_instance = getattr(router_module, "router")
            app.include_router(router_instance)
            print(f"Rota do módulo '{module_name}' incluída com sucesso.")


@app.get("/")
def read_root():
    return {"message": "Bem-vindo à API!"}

# Endpoint para CRIAR uma nova lista
