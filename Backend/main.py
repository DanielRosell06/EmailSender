# main.py

from fastapi import FastAPI
from database import engine, get_db
from models import Base

# Cria as tabelas no banco de dados, caso não existam
Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.get("/")
def read_root():
    return {"Olá": "Mundo"}