# main.py
from fastapi import FastAPI

# Crie uma instância da classe FastAPI
app = FastAPI()

# Defina um endpoint usando um decorador
@app.get("/")
def read_root():
    return {"Olá": "Mundo"}